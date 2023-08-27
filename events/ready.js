const { Events, ActivityType } = require('discord.js');

module.exports = {
  name: Events.ClientReady,
  once: true,
  execute(client) {
    console.log(`✅・Pronto! Entrei como: ${client.user.tag}`);

    client.user.setPresence({
      activities: [{ name: 'Base rodando no Repl.it 🧡', type: ActivityType.Watching }],
      status: 'online'
    });
  },
};

/*client.once(Events.ClientReady, c => {
  console.log(`✅・Pronto! Entrei como: ${c.user.tag}`);

  client.user.setPresence({
      activities: [{ name: 'Base rodando no Repl.it 🧡', type: ActivityType.Watching }],
      status: 'online'
    });
});*/