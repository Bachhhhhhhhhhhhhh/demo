import { isNyBach } from '../lib/ny'

export type Relation =
  | 'bo_me'
  | 'gia_dinh'
  | 'thay_co'
  | 'ban_be'
  | 'nguoi_yeu'
  | 'khac'

export type Guest = {
  name: string
  aliases: string[]
  relation: Relation
  message: string
  honorific: string
}

export const FALLBACK_GUESTS: Guest[] = []

export function guestFromName(name: string): Guest {
  const trimmed = name.trim().replace(/\s+/g, ' ')
  const parts = trimmed.split(/\s+/).filter(Boolean)
  const short = parts[parts.length - 1] || trimmed
  if (isNyBach(trimmed)) {
    return {
      name: trimmed,
      aliases: ['ny', 'ny bách', 'người yêu'],
      relation: 'nguoi_yeu',
      honorific: 'bé',
      message:
        'Bé ơiii, đúng người rồi nèee 💌\nBách tốt nghiệp DAV rồiii — có NY ngồi dưới hội trường là mình vững tim nhất đóaa. Mặc đồ xinh, tới sớm một chút, mình sẽ nhìn xuống tìm bé đầu tiên nhaaa.\nYêu bé nhiềuu lắm. Ra trường rồi vẫn là của nhau đóaa.',
    }
  }
  return {
    name: trimmed,
    aliases: [],
    relation: 'khac',
    honorific: short,
    message: '',
  }
}

export function shortNameOf(guest: Guest): string {
  const honor = guest.honorific?.trim()
  if (honor && honor.length <= 12) return honor
  const parts = guest.name.trim().split(/\s+/)
  return parts[parts.length - 1] || guest.name
}

export function templateMessage(guest: Guest): string {
  const h = guest.honorific || shortNameOf(guest)
  switch (guest.relation) {
    case 'bo_me':
      return `Con chào ${h} ạaa, cuối cùng con cũng tốt nghiệp DAV rồi đây ạ. Cảm ơn ${h} đã dạy con, chăm con và luôn là chỗ dựa vững chắc nhất. ${h} nhớ đến dự lễ tốt nghiệp của con nheee.`
    case 'gia_dinh':
      return `Cháu chào ${h} ạaa, Bách tốt nghiệp Học viện Ngoại giao rồi đây ạ. Trân trọng mời ${h} đến dự lễ, chụp vài tấm ảnh kỷ niệm với cháu nhaaa.`
    case 'thay_co':
      return `Em chào ${h} ạ, em Trương Thế Bách vừa hoàn thành hành trình đại học tại DAV. Em trân trọng kính mời ${h} đến dự Lễ tốt nghiệp — có ${h} ở đó, với em ý nghĩa lắm ạ.`
    case 'nguoi_yeu':
      return `Hello ${h} nhéee, Bách ra trường rồiii. Có bạn ở lễ tốt nghiệp là mình vui nhất đóaa. Nhớ tới nhaaa.`
    case 'ban_be':
      return `Hello ${h} nhéee, Bách ra trường rồiii. Tới dự lễ tốt nghiệp của mình với nhaaa, chụp ảnh sống ảo một phát cho ra trò.`
    default:
      return `Hello ${h} nhéee, Bách tốt nghiệp Học viện Ngoại giao rồiii. Trân trọng mời bạn đến dự lễ, chụp ảnh kỷ niệm với mình nhaaa — có bạn ở đó là vui nhất đóaa.`
  }
}

export function letterFor(guest: Guest): string {
  const text = guest.message?.trim()
  return text || templateMessage(guest)
}
