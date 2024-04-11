const Discord = require('discord.js');
const { PermissionFlagsBits } = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');

const { TOKEN, APP_ID } = require('./constant');

// Init command
const commands = [
  new SlashCommandBuilder()
    .setName('help')
    .setDescription('Say hello to the bot')
    .toJSON(),
  new SlashCommandBuilder()
    .setName('price')
    .setDescription('Test price command')
    .toJSON(),
  new SlashCommandBuilder()
    .setName('setup')
    .setDescription('Setup token and network default')
    .addStringOption((option) =>
      option
        .setName('channel_id')
        .setDescription('Bot only active in this channel.')
        .setRequired(false),
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .toJSON(),
];
const rest = new REST({ version: '9' }).setToken(TOKEN);

// Register list command and params
(async () => {
  try {
    console.log('Started refreshing application (/) commands.');

    await rest.put(Routes.applicationCommands(APP_ID), {
      body: commands,
    });

    console.log('Successfully reloaded application (/) commands.');
  } catch (error) {
    console.error(error);
  }
})();

const client = new Discord.Client({
  intents: ['Guilds', 'GuildMessages'],
});

client.on('ready', () => {
  console.log('I am ready!');
});
client.on('interactionCreate', async (interaction) => {
  // console.log('interaction', interaction);
  if (!interaction.isCommand()) return;

  const { commandName, options, guild } = interaction;
  const guildId = guild?.id;
  const isAdmin = interaction.member.permissions.has(
    PermissionFlagsBits.Administrator,
  );

  // End
  if (commandName === 'setup') {
    if (!isAdmin) {
      await interaction.reply({
        content: "You don't have permission to use this command.",
        ephemeral: true,
      });
      return;
    }
    const channelID = options.getString('channel_id');

    if (guildId && channelID) {
      await interaction.reply({ content: `Channel ID: ${channelID}`, ephemeral: true });
    } else {
      await interaction.reply({ content: 'Don\'t enter channel ID', ephemeral: true });
    }

  } else if (commandName === 'help') {
    const msg = `Doccument`;
    await interaction.reply({ content: msg, ephemeral: true });

    // Setup token default to each Guild
  } else if (commandName === 'setup') {
    if (!isAdmin) {
      await interaction.reply({
        content: "You don't have permission to use this command.",
        ephemeral: true,
      });
      return;
    }
    // Setup command /default to get token default info
  } else if (commandName === 'price') {
    await interaction.reply({ content: "Price haven'\t the value", ephemeral: true });
  }
    
});

// client.on('messageCreate', (message) => {
//   // Lấy ID của máy chủ mà tin nhắn được gửi đến
//   const guildId = message.guild.id;
//   console.log('guildId', guildId);
//   // Lưu thời gian hoạt động của bot trên máy chủ này
//   lastActiveMap.set(guildId, Date.now());
//   // Kiểm tra nếu tin nhắn bắt đầu bằng lệnh /help
//   if (message.content.startsWith('ping')) {
//     message.channel.send('pong!');
//   }
// });


client.login(TOKEN);
