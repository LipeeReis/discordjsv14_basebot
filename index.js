const fs = require('node:fs');
const path = require('node:path');
const { Client, Collection, Events, GatewayIntentBits } = require('discord.js');
const { token } = require('./config.json');

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

client.commands = new Collection();

const foldersPath = path.join(__dirname, 'commands');
const commandFolders = fs.readdirSync(foldersPath);

for (const folder of commandFolders) {
	const commandsPath = path.join(foldersPath, folder);
	const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
	for (const file of commandFiles) {
		const filePath = path.join(commandsPath, file);
		const command = require(filePath);
		// Set a new item in the Collection with the key as the command name and the value as the exported module
		if ('data' in command && 'execute' in command) {
			client.commands.set(command.data.name, command);
		} else {
			console.log(`[INDEX] ⚠️ | O comando em ${filePath} não tem as propriedades "data" ou "execute"!`);
		}
	}
}

client.on(Events.InteractionCreate, async interaction => {
	if (!interaction.isChatInputCommand()) return;

	const command = interaction.client.commands.get(interaction.commandName);

	if (!command) {
		console.error(`⚠️ | O comando ${interaction.commandName} não existe ou não foi encontrado!`);
		return;
	}

	try {
		await command.execute(interaction);
	} catch (error) {
		console.error(error);
		if (interaction.replied || interaction.deferred) {
			await interaction.followUp({ content: '\`⚠️ | Ops!\` \n\nParece que você digitou um comando desconhecido! \n\nTente novamente e, se o erro persistir, contate o Steve!', ephemeral: true });
		} else {
			await interaction.reply({ content: '\`⚠️ | Ops!\` \n\nParece que você digitou um comando desconhecido! \n\nTente novamente e, se o erro persistir, contate o Steve!', ephemeral: true });
		}
	}
});

client.once(Events.ClientReady, c => {
	console.log(`✅・Pronto! Entrei como: ${c.user.tag}`);
});

client.login(token);