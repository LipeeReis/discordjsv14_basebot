const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('ping')
		.setDescription('Mostra o ping do BOT para a API do Discord'),
	async execute(interaction) {
		await interaction.reply(`Olá <@${interaction.user.id}>! \n\n Atualmente meu ping é de ${interaction.client.ws.ping} ms`);
	},
};