const { MessageEmbed } = require('discord.js');
const constants = require('../../utils/constants.json');

module.exports = {
    name: 'votacao',
    aliases: [],
    utilisation: '<mensagem (opcional)> <imagem (opcional)>',
    description: 'Fazer um anúncio.',

    run(client, message, args) {
        if (!verifyMember(message.member.roles.cache)) return message.reply(`Você não possui permissão para realizar uma votação.`).then(m => {
            incomplete(m, message);
        });
        if (args.length <= 0 && !message.attachments.first()) return message.reply(`Uso correto: \`${constants.prefix}${this.name} ${this.utilisation}\``).then(m => {
            incomplete(m, message);
        });

        const userMessage = args.join(' ');
        const embed = new MessageEmbed()
            .setColor(constants.embed.color)
            .setTitle(`${message.guild.name} - Votação`)
            .setDescription(userMessage.trim() === '' ? '' : userMessage)
            .setThumbnail(message.attachments.first() ? '' : client.user.avatarURL())
            .setImage(message.attachments.first() ? message.attachments.first().url : '')
            .setFooter({ text: `${client.user.username} | CLOUD STORE • Todos os direitos reservados`, iconURL: client.user.avatarURL() });

        message.channel.send({ content: `<@&${constants.roles.member}>`, embeds: [embed] }).then(m => {
            m.react(constants.emojis.survey_yes);
            m.react(constants.emojis.survey_no);
        });
    }
}

function verifyMember(memberRoles) {
    const roles = constants.roles;
    const allowedRoles = [roles.staff];

    for (let i = 0; i < allowedRoles.length; i++) {
        if (memberRoles.get(allowedRoles[i])) return true;
    }

    return false;
}

function incomplete(m, message) {
    setTimeout(() => {
        m.delete().catch(() => null);
        message.delete().catch(() => null);

    }, 5000);
}