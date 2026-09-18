import { spawn } from 'node:child_process'
import { mkdir, writeFile } from 'node:fs/promises'
import http from 'node:http'
import path from 'node:path'

const PORT = 9335
const URL = 'http://127.0.0.1:4173/'
const OUT = path.resolve('screenshots')
const CHROME = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'

function get(url) {
  return new Promise((resolve, reject) => {
    http.get(url, (r) => {
      let d = ''
      r.on('data', (c) => (d += c))
      r.on('end', () => resolve(d))
    }).on('error', reject)
  })
}

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms))
}

const child = spawn(
  CHROME,
  [
    '--headless=new',
    '--disable-gpu',
    '--hide-scrollbars',
    '--force-color-profile=srgb',
    `--remote-debugging-port=${PORT}`,
    '--user-data-dir=' + path.resolve('.chrome-verify'),
    '--no-first-run',
    URL,
  ],
  { stdio: 'ignore' },
)

let ws
try {
  let version
  for (let i = 0; i < 40; i++) {
    try {
      version = JSON.parse(await get(`http://127.0.0.1:${PORT}/json/version`))
      break
    } catch {
      await sleep(150)
    }
  }
  if (!version) throw new Error('cdp not up')

  const list = JSON.parse(await get(`http://127.0.0.1:${PORT}/json/list`))
  const page = list.find((t) => t.type === 'page') || list[0]
  ws = new WebSocket(page.webSocketDebuggerUrl)

  await new Promise((resolve, reject) => {
    ws.onerror = reject
    ws.onopen = resolve
  })

  let id = 1
  const pending = new Map()
  ws.onmessage = (ev) => {
    const msg = JSON.parse(ev.data)
    if (msg.id && pending.has(msg.id)) pending.get(msg.id)(msg)
  }
  const send = (method, params = {}) => {
    const my = id++
    ws.send(JSON.stringify({ id: my, method, params }))
    return new Promise((r) => pending.set(my, r))
  }

  await send('Page.enable')
  await send('Runtime.enable')
  await send('Emulation.setDeviceMetricsOverride', {
    width: 1440,
    height: 900,
    deviceScaleFactor: 1,
    mobile: false,
  })
  await send('Page.navigate', { url: URL })
  await sleep(2500)

  await mkdir(OUT, { recursive: true })

  const shot = async (name) => {
    const res = await send('Page.captureScreenshot', { format: 'png', fromSurface: true })
    const buf = Buffer.from(res.result.data, 'base64')
    await writeFile(path.join(OUT, name), buf)
    console.log('wrote', name, buf.length)
  }

  await shot('gate-desktop.png')

  await send('Emulation.setDeviceMetricsOverride', {
    width: 375,
    height: 667,
    deviceScaleFactor: 2,
    mobile: true,
  })
  await sleep(400)
  await shot('gate-mobile.png')

  await send('Emulation.setDeviceMetricsOverride', {
    width: 1440,
    height: 900,
    deviceScaleFactor: 1,
    mobile: false,
  })
  await sleep(200)

  const typed = await send('Runtime.evaluate', {
    expression: `
      (async () => {
        const input = document.getElementById('guest-name');
        const native = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set;
        native.call(input, 'Trương Thế Bách');
        input.dispatchEvent(new Event('input', { bubbles: true }));
        input.form.requestSubmit();
        await new Promise(r => setTimeout(r, 1400));
        return {
          title: document.querySelector('#welcome h1')?.textContent || '',
          hasSprite: !!document.querySelector('#welcome img'),
          letter: document.querySelector('#welcome p.text-base, #welcome .leading-relaxed')?.textContent?.slice(0, 80) || '',
          sections: [...document.querySelectorAll('section')].map(s => s.id),
        };
      })()
    `,
    awaitPromise: true,
  })
  console.log('after submit', JSON.stringify(typed.result.result.value, null, 2))
  await sleep(600)
  await shot('invite-hero.png')

  await send('Runtime.evaluate', {
    expression: `document.getElementById('event')?.scrollIntoView()`,
  })
  await sleep(400)
  await shot('invite-event.png')

  await send('Runtime.evaluate', {
    expression: `document.getElementById('guestbook')?.scrollIntoView({block:'start'})`,
  })
  await sleep(900)
  await shot('invite-form.png')

  await send('Runtime.evaluate', {
    expression: `document.getElementById('directions')?.scrollIntoView({block:'start'})`,
  })
  await sleep(700)
  await shot('invite-directions.png')

  await send('Runtime.evaluate', {
    expression: `document.getElementById('contact')?.scrollIntoView({block:'start'})`,
  })
  await sleep(700)
  await shot('invite-contact.png')

  const empty = await send('Runtime.evaluate', {
    expression: `
      (function() {
        const btn = [...document.querySelectorAll('button')].find(b => /không phải mình/i.test(b.textContent));
        if (btn) btn.click();
        return true;
      })()
    `,
  })
  console.log('switch', empty.result.result.value)
  await sleep(500)

  const miss = await send('Runtime.evaluate', {
    expression: `
      (function() {
        const input = document.getElementById('guest-name');
        const native = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set;
        native.call(input, 'Nguyen Van Khong Co');
        input.dispatchEvent(new Event('input', { bubbles: true }));
        input.form.requestSubmit();
        return document.querySelector('[role=alert]')?.textContent || '';
      })()
    `,
  })
  console.log('unknown name', miss.result.result.value)
  await sleep(300)
  await shot('gate-error.png')

  const admin = await send('Page.navigate', { url: 'http://127.0.0.1:4173/admin?key=bach2026' })
  console.log('admin nav', admin.result)
  await sleep(1200)
  await shot('admin.png')
} finally {
  try { ws?.close() } catch {}
  child.kill()
}
