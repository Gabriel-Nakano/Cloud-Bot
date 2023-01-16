const { MessageEmbed } = require('discord.js');
const constants = require('../utils/constants.json');

module.exports = (client, member) => {
    if (member.guild.id === constants.guild_id) {
        const embed = new MessageEmbed()
            .setColor(constants.embed.color)
            .setAuthor({ name: `${member.user.username} (${member.user.id})`, iconURL: member.user.avatarURL() })
            .setDescription(`Olá **${member.user.username}**, bem-vindo ao ${member.guild.name}!`)
            .setThumbnail(member.user.avatarURL())
            .setFooter({ text: `${client.user.username} | Entradas`, iconURL: client.user.avatarURL() });

        member.guild.channels.cache.get(constants.channels.invites).send({ content: `<@${member.id}>`, embeds: [embed] });
    }
}