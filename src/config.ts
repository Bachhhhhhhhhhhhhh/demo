export const HOST = {
  name: 'Trương Thế Bách',
  shortName: 'Bách',
  gender: 'nam' as const,
  degree: 'Tân cử nhân Quan hệ quốc tế',
  major: 'Quan hệ quốc tế',
  school: 'Học viện Ngoại giao',
  schoolShort: 'DAV',
  city: 'Hà Nội, Việt Nam',
  photo: `${import.meta.env.BASE_URL}sprites/poster.jpg`,
  photoCaption: 'ẢNH LỄ TỐT NGHIỆP — DAV 2026',
  phone: '098 765 4321',
  phoneHref: 'tel:+84987654321',
  facebook: 'facebook.com/truongthebach',
  facebookHref: 'https://www.facebook.com/truongthebach',
}

/** Để trống helper nếu chỉ hiện 1 người liên hệ. */
export const HELPER: {
  name: string
  phone: string
  phoneHref: string
  facebook: string
  facebookHref: string
} | null = null

export const EVENT = {
  title: 'Lễ tốt nghiệp 2026 — Học viện Ngoại giao',
  date: 'Chủ Nhật, 28/09/2026',
  time: '08:30 – 11:30',
  venueName: 'Hội trường A — Học viện Ngoại giao',
  address: '69 Chùa Láng, Đống Đa, Hà Nội',
  dressCode: 'Lịch sự / áo dài hoặc vest nhẹ',
  note: 'Mọi người tới chụp ảnh kỷ niệm và chia vui với Bách nhé.',
  mapsLink:
    'https://www.google.com/maps/search/?api=1&query=H%E1%BB%8Dc+vi%E1%BB%87n+Ngo%E1%BA%A1i+giao+69+Ch%C3%B9a+L%C3%A1ng+H%C3%A0+N%E1%BB%99i',
  mapsEmbed:
    'https://www.google.com/maps?q=H%E1%BB%8Dc%20vi%E1%BB%87n%20Ngo%E1%BA%A1i%20giao%2069%20Ch%C3%B9a%20L%C3%A1ng&output=embed',
}

export const COPY = {
  gate: {
    eyebrow: 'THIỆP MỜI TỐT NGHIỆP · DAV',
    title: 'BẠN LÀ AI ZẠ?',
    subtitle: 'Gõ họ và tên của bạn để mở thiệp mời nhaaa — ai cũng vào được hết.',
    inputLabel: 'HỌ VÀ TÊN',
    inputPlaceholder: 'Ví dụ: Trương Thế Bách',
    buttonLabel: 'XEM THIỆP MỜI Ở ĐÂY NÈEE',
    errorEmpty: 'Vui lòng nhập họ và tên của bạn.',
    errorShort: 'Tên quá ngắn, vui lòng nhập họ và tên đầy đủ.',
    errorNotFound:
      'Hmmm mình chưa thấy tên này trong danh sách khách mời. Thử nhập đúng họ tên đầy đủ nhaaa.',
    errorSuggestion: 'Có phải bạn là “{name}” không? Nhập lại đúng họ tên nhé!',
  },
  welcome: {
    greetingPrefix: 'Gửi đến',
    signature: 'Trân trọng,',
    scrollHint: 'CUỘN XUỐNG ĐỂ XEM CHI TIẾT',
    mascotAlt: 'Chàng trai pixel mặc áo cử nhân đang đi bộ trên thiệp',
    switchGuest: 'Không phải mình?',
  },
  event: {
    label: 'THÔNG TIN BUỔI LỄ',
    title: 'LỄ TỐT NGHIỆP',
    mapsButtonLabel: 'XEM ĐƯỜNG ĐI TRÊN GOOGLE MAPS',
  },
  directions: {
    label: 'HƯỚNG DẪN GỬI XE & ĐI VÀO',
    title: 'LẠ ĐƯỜNG NGOẠI GIAO?',
    intro:
      'Khuôn viên DAV nhỏ xinh trên phố Chùa Láng. Dưới đây là mẹo đi vào và gửi xe cho bạn nào chưa quen đường nhaaa:',
    gatesTitle: '3 CÁCH VÀO DAV',
    gates: [
      {
        name: 'Cổng chính Chùa Láng',
        note: 'Số 69 phố Chùa Láng — cổng lớn mặt phố, dễ nhận nhất. Taxi / Grab xuống ngay trước cổng là vào được.',
      },
      {
        name: 'Hướng Nguyễn Chí Thanh',
        note: 'Từ Vincom Nguyễn Chí Thanh đi bộ khoảng 5–7 phút vào đầu phố Chùa Láng. DAV nằm bên phố, nhìn biển Học viện Ngoại giao là thấy.',
      },
      {
        name: 'Đi bộ từ Ga Láng',
        note: 'Xuống metro 2A ga Láng, đi bộ khoảng 8–10 phút vào phố Chùa Láng. Xe buýt 09B / 27 dừng đối diện cổng — tiện khỏi lo chỗ đỗ.',
      },
    ],
    parkingTitle: 'CHỖ GỬI XE',
    parkingIntro: 'Gợi ý chỗ gửi xe (tuỳ ngày lễ đông hay vắng):',
    parking: [
      {
        name: 'Nhà xe trong khuôn viên',
        note: 'Gần hội trường nhất. Ngày lễ đôi khi hạn chế — vào cổng hỏi bảo vệ cho nhanh nhaaa.',
        recommended: true,
      },
      {
        name: 'Gửi xe quanh Chùa Láng',
        note: 'Nhiều bãi xe máy nhà dân dọc phố. Nhớ lấy vé, không đỗ lòng đường kẻo bị phạt đóoo.',
        recommended: false,
      },
      {
        name: 'Vincom Nguyễn Chí Thanh',
        note: 'Bãi xe lớn, an toàn. Đi bộ khoảng 500m tới DAV — hợp nếu khuôn viên hết chỗ.',
        recommended: false,
      },
    ],
    tip: 'Lộ trình recommended: Grab / taxi xuống cổng 69 Chùa Láng. Nếu tự lái, gửi xe xong hỏi bảo vệ lối vào Hội trường A.',
  },
  contact: {
    label: 'LIÊN HỆ',
    title: 'GẶP MÌNH Ở ĐÂU?',
    intro:
      'Nếu bạn cần hỗ trợ hoặc bị lạc đường quanh Chùa Láng hôm đó, hãy liên hệ Bách qua:',
  },
  guestbook: {
    label: 'LỜI CẢM ƠN',
    title: 'CẢM ƠN THẬT NHIỀU Ạ',
    thanks:
      'Cảm ơn vì đã dành thời gian xem thiệp mời này ạaa. Bách sẽ đợiii nhé.',
    formTitle: 'GỬI BÁCH MỘT LỜI NHẮN',
    fromLabel: 'Từ',
    attendingLabel: 'BẠN ĐẾN ĐƯỢC KHÔNG?',
    attending: ['Có mặt', 'Chưa chắc', 'Không đến được'] as const,
    companionsLabel: 'SỐ NGƯỜI ĐI CÙNG',
    phoneLabel: 'SỐ ĐIỆN THOẠI (KHÔNG BẮT BUỘC)',
    phonePlaceholder: '09xx xxx xxx',
    textareaPlaceholder: 'Viết vài dòng gửi đến Bách nhé...',
    buttonLabel: 'GỬI LỜI NHẮN',
    sendingLabel: 'ĐANG GỬI...',
    successTitle: 'BÁCH ĐÃ NHẬN ĐƯỢC THÔNG TIN',
    successMessage:
      'Cảm ơn thật nhiều ạaa 💌 Bách đọc được rồi, sẽ rep bé / mọi người sớm nhaaa.',
    errorEmpty: 'Bạn chưa chọn trạng thái hoặc chưa viết lời nhắn nào.',
    errorGeneric: 'Gửi chưa được, thử lại nhaaa',
    another: 'Gửi thêm lời nhắn khác',
  },
  footer: {
    line1: 'THIỆP MỜI TỐT NGHIỆP',
    line2: 'HỌC VIỆN NGOẠI GIAO',
  },
}

export const META = {
  title: 'Thiệp mời Lễ tốt nghiệp — Trương Thế Bách · DAV',
  description:
    'Trân trọng mời bạn đến dự Lễ tốt nghiệp của Trương Thế Bách tại Học viện Ngoại giao.',
}

export const STORAGE_KEY = 'bach-invite-guest'
export const LOCAL_RESPONSES_KEY = 'bach-invite-responses'
export const LOCAL_OPENS_KEY = 'bach-invite-opens'

export const SHEET_ID = '1F3GS5Id72F1PDbfLJ6922QqQ4e_tFajzib36mdNjRrQ'
