export default {
  command: 'menu',
  run: async ({ sock, from, config }) => {
    await sock.sendMessage(from, {
      text: `🤖 *${config.botName} MENU*

.alive
.menu
.ping

More coming soon 🔥`
    })
  }
}
