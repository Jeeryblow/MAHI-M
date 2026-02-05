export default {
  command: 'ping',
  run: async ({ sock, from }) => {
    await sock.sendMessage(from, { text: '🏓 Pong!' })
  }
}
