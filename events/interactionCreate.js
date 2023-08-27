const { Events } = require('discord.js');

module.exports = {
	name: Events.InteractionCreate,
	async execute(interaction) {
		if (!interaction.isChatInputCommand()) return;

		const command = interaction.client.commands.get(interaction.commandName);

		if (!command) {
			console.error(`[EVENT - INTERACTION CREATE] ⚠ | O comando ${interaction.commandName} não existe ou não foi encontrado!`);
			return;
		}

		try {
			await command.execute(interaction);
		} catch (error) {
			console.error(`[EVENT - INTERACTION CREATE] ❌ | Erro ao tentar executar o comando ${interaction.commandName}`);
			console.error(error);
		}
	},
};