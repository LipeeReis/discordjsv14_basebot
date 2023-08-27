const mySecret = process.env['token']
const { REST, Routes } = require('discord.js');
const { clientId } = require('./config.json');
const fs = require('node:fs');
const path = require('node:path');

const commands = [];
// Busca e acessa todos os arquivos dentro da pasta de comandos
const foldersPath = path.join(__dirname, 'commands');
const commandFolders = fs.readdirSync(foldersPath);

for (const folder of commandFolders) {
	// Permite o uso de subpastas para melhor organização dos comandos e filtra todos os arquivos que terminam com ".js"
	const commandsPath = path.join(foldersPath, folder);
	const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
	// Transforma a estrutura de definição do comando em ".JSON" para que o processo de deploy seja mais ágil
	for (const file of commandFiles) {
		const filePath = path.join(commandsPath, file);
		const command = require(filePath);
		if ('data' in command && 'execute' in command) {
			commands.push(command.data.toJSON());
		} else {
			console.log(`[DEPLOY] ⚠️ | O comando em ${filePath} não tem as propriedades "data" ou "execute"!`); // Verifica se algum arquivo não tem a estrutura de definição ou lógica
		}
	}
}

const rest = new REST().setToken(mySecret);

// Atualiza a estrutura de comandos para que todos os comandos possam ser usados corretamente
(async () => {
	try {
		console.log(`[DEPLOY] 🔄️ | Atualizando ${commands.length} comandos de barra (/)`);

		// The put method is used to fully refresh all commands in the guild with the current set
		const data = await rest.put(
			Routes.applicationCommands(clientId),
			{ body: commands },
		);

		console.log(`[DEPLOY] ✅ | Sucesso ao atualizar ${data.length} comandos de barra (/)!`);
	} catch (error) {
		// And of course, make sure you catch and log any errors!
		console.error(error);
	}
})();