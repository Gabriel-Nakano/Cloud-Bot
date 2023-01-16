const { MessageEmbed } = require('discord.js');
const constants = require('../../utils/constants.json');

module.exports = {
    name: 'termos',
    aliases: [],
    utilisation: '<mensagem (opcional)> <imagem (opcional)>',
    description: 'Fazer um anúncio.',

    run(client, message, args) {
        if (!verifyMember(message.member.roles.cache)) return message.reply(`Você não possui permissão para enviar anúncios.`).then(m => {
            incomplete(m, message);
        });
        if (args.length <= 0 && !message.attachments.first()) return message.reply(`Uso correto: \`${constants.prefix}${this.name} ${this.utilisation}\``).then(m => {
            incomplete(m, message);
        });

        const userMessage = args.join(' ');
        const embed = new MessageEmbed()
            .setColor(constants.embed.color)
            .setTitle(`${message.guild.name} - Termos`)
            .setDescription(userMessage.trim() === '' ? '' : userMessage)
            .setThumbnail(message.attachments.first() ? '' : client.user.avatarURL())
            .setImage(message.attachments.first() ? message.attachments.first().url : '')
            .setFooter({ text: `${client.user.username} | Termos • Todos os direitos reservados`, iconURL: client.user.avatarURL() });

        message.channel.send({ content: `<@&${constants.roles.member}>`, embeds: [embed] }).then(() => {
            message.delete().catch(() => null);
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