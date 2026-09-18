/**
 * Apps Script cho thiệp mời Trương Thế Bách — DAV
 * Dán vào Extensions → Apps Script của sheet:
 * https://docs.google.com/spreadsheets/d/1F3GS5Id72F1PDbfLJ6922QqQ4e_tFajzib36mdNjRrQ
 *
 * Deploy → New deployment → Web app
 * Execute as: Me
 * Who has access: Anyone
 */

var SHEET_ID = '1F3GS5Id72F1PDbfLJ6922QqQ4e_tFajzib36mdNjRrQ';
// Đặt trùng VITE_ADMIN_KEY (tuỳ chọn). Để trống thì /admin?action=list vẫn đọc được.
var ADMIN_KEY = 'bach2026';

function ss_() {
  return SpreadsheetApp.openById(SHEET_ID);
}

function json_(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
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
  return values
    .filter(function (r) { return r.some(function (c) { return c !== '' && c !== null; }); })
    .map(function (r) {
      var o = {};
      headers.forEach(function (h, i) { o[h] = r[i]; });
      return o;
    });
}

function parseBody_(e) {
  if (e && e.postData && e.postData.contents) {
    try { return JSON.parse(e.postData.contents); } catch (err) {}
    try {
      var parts = e.postData.contents.split('&');
      var o = {};
      parts.forEach(function (p) {
        var kv = p.split('=');
        o[decodeURIComponent(kv[0] || '')] = decodeURIComponent((kv[1] || '').replace(/\+/g, ' '));
      });
      return o;
    } catch (err2) {}
  }
  return (e && e.parameter) ? e.parameter : {};
}

function writeOpen_(data) {
  ensureSheets_();
  ss_().getSheetByName('Opens').appendRow([
    new Date(),
    data.guest_name || '',
    data.match_type || '',
    data.referrer || ''
  ]);
}

function writeResponse_(data) {
  ensureSheets_();
  ss_().getSheetByName('Responses').appendRow([
    new Date(),
    data.guest_name || '',
    data.attending || '',
    data.companions || 0,
    data.phone || '',
    data.message_to_bach || '',
    data.user_agent || '',
    data.opened_at || ''
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
  if (p.action === 'open') {
    writeOpen_(p);
    return json_({ ok: true });
  }
  if (p.action === 'submit') {
    writeResponse_(p);
    return json_({ ok: true });
  }
  if (p.action === 'list') {
    if (ADMIN_KEY && p.key && p.key !== ADMIN_KEY) {
      return json_({ ok: false, error: 'unauthorized' });
    }
    return json_({
      ok: true,
      guests: rowsAsObjects_('Guests'),
      opens: rowsAsObjects_('Opens'),
      responses: rowsAsObjects_('Responses')
    });
  }
  return json_({ ok: true, guests: rowsAsObjects_('Guests') });
}
