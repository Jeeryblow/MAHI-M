export default {
  command: 'alive',
  run: async ({ sock, from }) => {
    await sock.sendMessage(from, {
      text: '🤖 MAHI-MD is Alive ✅'
    })
  }
}
