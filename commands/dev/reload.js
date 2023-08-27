const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('reload')
    .setDescription('[DEV] Atualiza a função de um comando sem precisar reiniciar o BOT')
    .addStringOption(option =>
      option.setName('command')
        .setDescription('Comando que será recarregado') // nome do arquivo do comando
        .setRequired(true)),
  category: 'dev',
  async execute(interaction) {
    const user = interaction.client.users.cache.get(interaction.user.id);

    console.log('O tipo de dado da permissão é: ', typeof (interaction.user.id))
    if (interaction.user.id != 334808407448223755) {
      let embedNoPerm = new EmbedBuilder()
        .setColor('#ff0000')
        .setTitle('\`❌ | Ops...\`')
        .setDescription('Você não tem permissão para usar este comando.')
     await interaction.reply({ embeds: [embedNoPerm] });

      const channel = interaction.client.channels.cache.get(1145226413650214933);
      await channel.send(`O usuário <@${user}> tentou usar o comando \`reload\``);

      return;
    }

    const commandName = interaction.options.getString('command', true).toLowerCase();
    const command = interaction.client.commands.get(commandName);

    if (!command) {
      let embedCommandNotExist = new EmbedBuilder()
        .setColor('#ff0000')
        .setTitle('\`❌ | Ops...\`')
        .setDescription(`Não encontrei nenhum comando com o nome \`${commandName}\`!`)
      
      await interaction.reply({ embeds: [embedCommandNotExist] })
    }

    delete require.cache[require.resolve(`../${command.category}/${command.data.name}.js`)];

    try {
      interaction.client.commands.delete(command.data.name);
      const newCommand = require(`../${command.category}/${command.data.name}.js`);
      interaction.client.commands.set(newCommand.data.name, newCommand);
      let embedCommandExist = new EmbedBuilder()
        .setColor('#03f270')
        .setDescription(`✅ | Sucesso! O comando \`${newCommand.data.name}\` foi atualizado`)
      await interaction.reply(`\`✅ | Sucesso! O comando ${newCommand.data.name} foi atualizado\``);
    } catch (error) {
      console.error(error);
      await interaction.reply(`\`[RELOAD] ⚠ | Erro ao tentar atualizar a funcionalidade do comando ${command.data.name}\``);
    }
  },
};