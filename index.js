import makeWASocket, { useMultiFileAuthState } from '@whiskeysockets/baileys'
import P from 'pino'
import qrcode from 'qrcode-terminal'
import { config } from './config.js'

async function startBot () {
  const { state, saveCreds } = await useMultiFileAuthState('./session')

  const sock = makeWASocket({
    auth: state,
    logger: P({ level: 'silent' })
  })

  sock.ev.on('creds.update', saveCreds)

  sock.ev.on('connection.update', ({ qr, connection }) => {
    if (qr) qrcode.generate(qr, { small: true })
    if (connection === 'open') console.log('MAHI-MD Connected')
  })

  sock.ev.on('messages.upsert', async ({ messages }) => {
    const m = messages[0]
    if (!m.message) return
    const from = m.key.remoteJid
    const body =
      m.message.conversation ||
      m.message.extendedTextMessage?.text ||
      ''

    const text = body.toLowerCase()

    if (text === '.alive') {
      await sock.sendMessage(from, { text: '🤖 MAHI-MD Alive ✅\nOwner: +92 321 8511029' })
    }

    if (text === '.menu') {
      await sock.sendMessage(from, {
        text: '📋 MAHI-MD MENU\n.alive\n.menu\n.ping'
      })
    }

    if (text === '.ping') {
      await sock.sendMessage(from, { text: '🏓 Pong!' })
    }
  })
}

startBot()
