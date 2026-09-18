# Thiệp mời Lễ tốt nghiệp — Trương Thế Bách · DAV

Website thiệp mời tốt nghiệp kiểu pixel 8-bit, clone cảm giác site mẫu (gate nhập tên, thư cá nhân hoá, form RSVP ghi Google Sheet).

**Không** copy nội dung HUST / Nguyễn Kiều Duyên. Rebrand 100% sang Trương Thế Bách — Học viện Ngoại giao.

## Chạy local

```bash
cd bach-graduation-invite
copy .env.example .env
npm install
npm run dev
```

Mở `http://localhost:5173`. Gõ **Trương Thế Bách** (hoặc Bố / Mẹ / Quân…) để vào thiệp.

Admin: `http://localhost:5173/admin?key=bach2026`

---

## 12 bước nối Google Sheet & ship

Sheet chính (đã có):  
https://docs.google.com/spreadsheets/d/1F3GS5Id72F1PDbfLJ6922QqQ4e_tFajzib36mdNjRrQ/edit?usp=sharing

### 1. Mở Google Sheet

Đăng nhập Google, mở đúng file trên. Nếu chưa có quyền: **File → Make a copy**.

### 2. Tạo 3 worksheet (tab)

Đặt tên **đúng**: `Guests` · `Responses` · `Opens`.

Hàng 1 — tiêu đề cột:

**Guests**

| A name | B aliases | C relation | D message | E honorific |
| --- | --- | --- | --- | --- |
| Họ tên đầy đủ | Tên gọi khác, cách nhau bằng `\|` | `bo_me` / `gia_dinh` / `thay_co` / `ban_be` / `nguoi_yeu` / `khac` | Thư 2–5 câu | Bố / Mẹ / Chị / Thầy… |

**Responses**

`timestamp | guest_name | attending | companions | phone | message_to_bach | user_agent | opened_at`

**Opens**

`timestamp | guest_name | match_type | referrer`

Script mẫu tự tạo header nếu tab trống.

### 3. Dán Apps Script

Trong sheet: **Extensions → Apps Script**. Xoá code mặc định, dán toàn bộ file [`apps-script/Code.gs`](apps-script/Code.gs) (cũng copy ở cuối README này).

Sửa `ADMIN_KEY` cho trùng `VITE_ADMIN_KEY`. **Save** (Ctrl+S).

### 4. Deploy Web App

1. **Deploy → New deployment**
2. Loại: **Web app**
3. **Execute as:** Me
4. **Who has access:** Anyone
5. Deploy → **Authorize access** (chọn tài khoản Google, Allow)
6. Copy URL dạng `https://script.google.com/macros/s/…/exec`

Mỗi lần sửa script: **Deploy → Manage deployments → Edit → New version**.

### 5. Điền file `.env`

```env
VITE_SHEET_WEBAPP_URL=https://script.google.com/macros/s/XXXX/exec
VITE_ADMIN_KEY=bach2026
```

Không publish cả sheet ra internet nếu đã có webapp.  
Không hardcode service account / API key lên frontend.

Tuỳ chọn fallback CSV (nếu webapp chưa chạy): File → Share → Publish to web → tab Guests → CSV, dán vào `VITE_SHEET_CSV_URL`.

### 6. Thêm khách mời

Trên tab **Guests**, mỗi hàng một người. Ví dụ:

```
Bố của Bách    Bố|Ba|Bố Bách    bo_me    Con chào bố ạaa…    Bố
Mẹ của Bách    Mẹ|Má            bo_me    Con chào mẹ ạaa…    Mẹ
Lê Minh Quân   Quân|Minh Quân   ban_be   Hello Quân nhéee…   Quân
Trương Thế Bách  Bách|Bach      khac     Ê Bách ơi…          Bách
```

Site luôn có 10 khách demo trong `src/data/guests.ts` nếu sheet trống.

### 7. Sửa ngày giờ / địa điểm / SĐT

Mở [`src/config.ts`](src/config.ts):

- `EVENT.date` / `time` / `venueName` / `address` / `dressCode`
- `EVENT.mapsLink` + `EVENT.mapsEmbed`
- `HOST.phone` / `HOST.facebook` / `HOST.major` / `HOST.degree`
- `HELPER` — điền người hỗ trợ phụ, hoặc để `null` (chỉ hiện Bách)

### 8. Thay ảnh poster

Thay file `public/sprites/poster.jpg` bằng ảnh lễ / ảnh tốt nghiệp thật.  
Giữ caption trong `HOST.photoCaption`. Khung pixel + shadow offset tự bọc ảnh.

### 9. Đổi sprite (tuỳ chọn)

Nam cử nhân pixel: `public/sprites/walk-1.png` … `walk-3.png` + `jump.png`.  
Nền trong suốt, `image-rendering: pixelated`.

### 10. Test form thật

```bash
npm run dev
```

1. Gõ tên khách → thiệp mở, tab **Opens** có 1 dòng.
2. Gửi lời nhắn → tab **Responses** có 1 dòng.
3. Nếu fail: toast **“Gửi chưa được, thử lại nhaaa”**, form **không** bị xoá.
4. `npm run build` phải pass.

### 11. Deploy site tĩnh

**Cloudflare Pages:** Connect repo → build `npm run build` → output `dist`.  
**Vercel:** Framework Vite, env vars y như `.env`.

Thêm biến môi trường `VITE_SHEET_WEBAPP_URL` và `VITE_ADMIN_KEY` trên dashboard host. Redeploy sau khi đổi env.

### 12. Share & admin

- Link thiệp: domain của bạn  
- OG: `public/og.png` (cream + chữ pixel + tên Bách)  
- Admin (noindex): `https://domain/admin?key=bach2026`  
- Không gắn badge Lovable.

---

## Khớp tên (linh hồn site)

1. Normalize: trim, gộp space, lowercase, bỏ dấu, đ→d  
2. So khớp `name` + `aliases`  
3. Levenshtein: tên ≤8 ký tự dist ≤2; dài hơn dist ≤3  
4. Top1 thắng top2 ≥2 đơn vị → nhận; sát nhau → gợi ý nhập lại  
5. Trống / không khớp → báo lỗi tiếng Việt, không mở thiệp  
6. Khớp xong: `sessionStorage` + POST `action=open`  
7. Nút **Không phải mình?** quay lại gate

## Stack

React + Vite + TypeScript + Tailwind v4 + Framer Motion. Không backend riêng ngoài Apps Script.

## Apps Script (dán vào sheet)

```javascript
var SHEET_ID = '1F3GS5Id72F1PDbfLJ6922QqQ4e_tFajzib36mdNjRrQ';
var ADMIN_KEY = 'bach2026';

function ss_() { return SpreadsheetApp.openById(SHEET_ID); }

function json_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}

function ensureSheets_() {
  var ss = ss_();
  var specs = {
    Guests: ['name', 'aliases', 'relation', 'message', 'honorific'],
    Responses: ['timestamp', 'guest_name', 'attending', 'companions', 'phone', 'message_to_bach', 'user_agent', 'opened_at'],
    Opens: ['timestamp', 'guest_name', 'match_type', 'referrer']
  };
  Object.keys(specs).forEach(function (name) {
    var sh = ss.getSheetByName(name);
    if (!sh) sh = ss.insertSheet(name);
    var headers = specs[name];
    var first = sh.getRange(1, 1, 1, headers.length).getValues()[0];
    var empty = first.every(function (c) { return !c; });
    if (empty) sh.getRange(1, 1, 1, headers.length).setValues([headers]);
  });
}

function rowsAsObjects_(sheetName) {
  var sh = ss_().getSheetByName(sheetName);
  if (!sh) return [];
  var values = sh.getDataRange().getValues();
  if (values.length < 2) return [];
  var headers = values.shift().map(function (h) { return String(h).trim(); });
  return values.filter(function (r) {
    return r.some(function (c) { return c !== '' && c !== null; });
  }).map(function (r) {
    var o = {};
    headers.forEach(function (h, i) { o[h] = r[i]; });
    return o;
  });
}

function parseBody_(e) {
  if (e && e.postData && e.postData.contents) {
    try { return JSON.parse(e.postData.contents); } catch (err) {}
  }
  return (e && e.parameter) ? e.parameter : {};
}

function writeOpen_(data) {
  ensureSheets_();
  ss_().getSheetByName('Opens').appendRow([
    new Date(), data.guest_name || '', data.match_type || '', data.referrer || ''
  ]);
}

function writeResponse_(data) {
  ensureSheets_();
  ss_().getSheetByName('Responses').appendRow([
    new Date(), data.guest_name || '', data.attending || '', data.companions || 0,
    data.phone || '', data.message_to_bach || '', data.user_agent || '', data.opened_at || ''
  ]);
}

function doPost(e) {
  var data = parseBody_(e);
  if (data.action === 'open') writeOpen_(data);
  else writeResponse_(data);
  return json_({ ok: true });
}

function doGet(e) {
  ensureSheets_();
  var p = (e && e.parameter) ? e.parameter : {};
  if (p.action === 'open') { writeOpen_(p); return json_({ ok: true }); }
  if (p.action === 'submit') { writeResponse_(p); return json_({ ok: true }); }
  if (p.action === 'list') {
    if (ADMIN_KEY && p.key && p.key !== ADMIN_KEY) return json_({ ok: false, error: 'unauthorized' });
    return json_({ ok: true, guests: rowsAsObjects_('Guests'), opens: rowsAsObjects_('Opens'), responses: rowsAsObjects_('Responses') });
  }
  return json_({ ok: true, guests: rowsAsObjects_('Guests') });
}
```

POST từ site dùng `Content-Type: text/plain` để tránh CORS preflight. Apps Script vẫn `JSON.parse` body. Retry 2 lần; nếu fail thì GET fallback rồi mới báo lỗi.

## Cấu trúc

```
src/index.css              token + grain + pixel-btn + pixel-box + pixel-stripes
src/lib/normalize.ts       bỏ dấu + fuzzy match
src/lib/sheets.ts          fetch guests + post response
src/data/guests.ts         fallback 10 khách demo
src/config.ts              ngày giờ, SĐT, ngành — sửa ở đây trước khi ship
src/components/Gate.tsx
src/components/Invitation.tsx
src/components/EventInfo.tsx
src/components/Directions.tsx
src/components/Contact.tsx
src/components/MessageForm.tsx
src/components/PixelGrad.tsx   sprite NAM
src/pages/Admin.tsx
src/App.tsx
```
