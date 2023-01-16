const { MessageEmbed } = require('discord.js');
const constants = require('../utils/constants.json');

module.exports = (client, member) => {
    if (member.guild.id === constants.guild_id) {
        const embed = new MessageEmbed()
            .setColor(constants.secondary_color_embed)
            .setAuthor({ name: `${member.user.username} (${member.user.id})`, iconURL: member.user.avatarURL() })
            .setDescription(`**${member.user.username} saiu do servidor.**`)
            .setThumbnail(member.user.avatarURL())
            .setFooter({ text: `${client.user.username} | Saídas`, iconURL: client.user.avatarURL() });

        member.guild.channels.cache.get(constants.channels.invites).send({ embeds: [embed] });
    }
}