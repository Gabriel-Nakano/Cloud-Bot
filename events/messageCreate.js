const constants = require('../utils/constants.json');

module.exports = async (client, message) => {
    if (message.author.bot) return;
    if (message.channel.type === 'DM') return;
    if (message.guild.id != constants.guild_id) return;

    const discordReg = /(https:\/\/)?(www\.)?(discord\.gg|discord\.me|discordapp\.com\/invite|discord\.com\/invite)\/([a-z0-9-.]+)?/i;
    if (discordReg.test(message.content)) {
        if (!message.member.bannable || message.member.roles.cache.get(constants.roles.direction) || message.member.roles.cache.get(constants.roles.ceo)) return;

        message.delete().catch(() => null);
    }

    let args = message.content.trim().split(/ +/g);
    if (args[1] == null) if (args[0].includes(client.user.id)) return message.channel.send(`Prefixo: **${constants.prefix}**\nDigita \`${constants.prefix}ajuda\` para mais informações.`);

    if (!message.content.startsWith(constants.prefix)) return;

    args = message.content.slice(constants.prefix.length).trim().split(/ +/g);
    const commandName = args.shift();

    const command = client.commands.get(commandName) || client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));
    if (!command) return;

    command.run(client, message, args);
}