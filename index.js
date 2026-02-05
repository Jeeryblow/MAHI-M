import makeWASocket, { useMultiFileAuthState } from '@whiskeysockets/baileys'
import P from 'pino'
import qrcode from 'qrcode-terminal'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { config } from './config.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const plugins = []

// load plugins
const pluginPath = path.join(__dirname, 'plugins')
fs.readdirSync(pluginPath).forEach(file => {
  if (file.endsWith('.js')) {
    import(`./plugins/${file}`).then(plugin => {
      plugins.push(plugin.default)
    })
  }
})

async function startBot () {
  const { state, saveCreds } = await useMultiFileAuthState('./session')

  const sock = makeWASocket({
    auth: state,
    logger: P({ level: 'silent' })
  })

  sock.ev.on('creds.update', saveCreds)

  sock.ev.on('connection.update', ({ qr, connection }) => {
    if (qr) qrcode.generate(qr, { small: true })
    if (connection === 'open') console.log('✅ MAHI-MD Connected')
  })

  sock.ev.on('messages.upsert', async ({ messages }) => {
    const m = messages[0]
    if (!m.message) return

    const from = m.key.remoteJid
    const body =
      m.message.conversation ||
      m.message.extendedTextMessage?.text ||
      ''

    for (const plugin of plugins) {
      if (body.startsWith(config.prefix + plugin.command)) {
        await plugin.run({ sock, m, from, body, config })
      }
    }
  })
}

startBot()
