module.exports = {
  name: 'ready',
  once: true,
  execute(client) {
    console.log(`✅ Bot online come ${client.user.tag}`);
    client.user.setPresence({
      activities: [{ name: 'il server 👀', type: 3 }], // type 3 = "Watching"
      status: 'online'
    });
  }
};
