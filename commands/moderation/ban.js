const { Permissions, MessageEmbed } = require('discord.js');
const constants = require('../../utils/constants.json');

module.exports = {
    name: 'ban',
    aliases: [],
    utilisation: '<@jogador> <motivo (opcional)>',
    description: 'Punir um jogador do servidor permanentemente.',

    async run(client, message, args) {
        if (!verifyMember(message.member.roles.cache)) return message.reply(`Você precisa ser um **Administrador** ou superior, para execultar esse comando.`).then(m => {
            incomplete(m, message);
        });
        if (!message.member.permissions.has(Permissions.FLAGS.BAN_MEMBERS)) return message.reply('Você precisa ser um **Administrador** ou superior, para execultar esse comando.').then(m => {
            incomplete(m, message);
        });
        if (!message.guild.me.permissions.has(Permissions.FLAGS.BAN_MEMBERS)) return message.reply('Você precisa ser um **Administrador** ou superior, para execultar esse comando.').then(m => {
            incomplete(m, message);
        });

        const mentionedMember = message.mentions.members.first();
        let reason = args.slice(1).join(' ');

        if (!args[0]) return message.reply(`Uso correto: \`${constants.prefix}${this.name} ${this.utilisation}\``).then(m => {
            incomplete(m, message);
        });
        if (!reason) reason = 'Não informado';
        if (!mentionedMember) return message.reply('Jogador não encontrado. Mencione alguém que esteja dentro do servidor.').then(m => {
            incomplete(m, message);
        });
        if (mentionedMember.user.id === client.user.id) return message.reply('Não é possível me punir com meu próprio comando.').then(m => {
            incomplete(m, message);
        });
        if (mentionedMember.user.id === message.author.id) return message.reply('Não é possível punir a si mesmo.').then(m => {
            incomplete(m, message);
        });
        if (!mentionedMember.bannable) return message.reply('Você não possui permissão para punir esse jogador.').then(m => {
            incomplete(m, message);
        });

        const embed = new MessageEmbed()
            .setColor('RED')
            .setTitle('Jogador punido do servidor permanentemente')
            .setDescription(
                `**Jogador:** ${mentionedMember}\n\n` +
                `**Motivo:** ${reason}\n\n` +
                `**Autor:** ${message.member}`
            )
            .setThumbnail(mentionedMember.user.avatarURL())
            .setFooter({ text: `${client.user.username} | CLOUD STORE • Todos os direitos reservados`, iconURL: client.user.avatarURL() });

        mentionedMember.ban({
            days: 7,
            reason: reason

        }).then(() => {
            message.guild.channels.cache.get(constants.channels.logs).send({ embeds: [embed] });

            message.reply(`Punição aplicada. Confira-a em <#${constants.channels.logs}>.`).then(m => {
                incomplete(m, message);
            });

        }).catch(error => console.error(`Erro ao tentar punir ${mentionedMember.user.tag}/${mentionedMember.user.id}:\n${error}`));
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