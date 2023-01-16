const { MessageEmbed } = require('discord.js');
const constants = require('../../utils/constants.json');
const fs = require('fs');

module.exports = {
    name: 'botinfo',
    aliases: [],
    utilisation: '',
    description: 'Informações sobre o bot.',

    run(client, message, args) {
        if (message.channel.id !== constants.channels.commands)
            return message.reply(`Esse comando só pode ser executado em: <#${constants.channels.commands}>.`).then(m => {
                incomplete(m, message);
            });

        let availableCommands = 0;
        const categories = fs.readdirSync('./commands');

        categories.forEach(c => {
            availableCommands += fs.readdirSync(`./commands/${c}/`).length;
        });

        const embed = new MessageEmbed()
            .setColor(constants.embed.color)
            .setTitle(`Informações do BOT`)
            .setDescription(
                `\nEsse bot foi desenvolvido para a organização e moderação do servidor **CLOUD STORE**.`
            )
            .setFooter({ text: `${client.user.username} | CLOUD STORE • Todos os direitos reservados`, iconURL: client.user.avatarURL() });

        message.reply({ embeds: [embed] });
    }
}

function incomplete(m, message) {
    setTimeout(() => {
        m.delete().catch(() => null);
        message.delete().catch(() => null);

    }, 5000);
}