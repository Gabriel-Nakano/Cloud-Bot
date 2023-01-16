const { Permissions, MessageEmbed } = require('discord.js');
const constants = require('../../utils/constants.json');

module.exports = {
    name: 'unlock',
	aliases: [],
    utilisation: '',
    description: 'Desbloquear um canal.',

    async run (client, message, args) {
        if (!verifyMember(message.member.roles.cache)) return message.reply(`Você não possui permissão para desbloquear canais.`).then(m => {
            incomplete(m, message);
        });
        if (!message.member.permissions.has(Permissions.FLAGS.MANAGE_CHANNELS)) return message.reply('Precisas da permissão `Gerenciar Canais` para utilizar este comando.').then(m => {
            incomplete(m, message);
        });
        if (!message.guild.me.permissions.has(Permissions.FLAGS.MANAGE_CHANNELS)) return message.reply('Não possuo a permissão "Gerenciar Canais" para executar essa limpeza.').then(m => {
            incomplete(m, message);
        });

        const channel = message.channel;
        if (channel.permissionsFor(constants.roles.member).has('SEND_MESSAGES')) return message.reply('Este canal já está desbloqueado.').then(m => {
            incomplete(m, message);
        });

        await channel.permissionOverwrites.create(constants.roles.member, {
            SEND_MESSAGES: true

        }).catch((error) => {
            console.error(`Erro ao tentar desbloquear o canal:\n${error}`);
            
            return message.reply('Ocorreu um erro ao tentar desbloquear o canal.').then(m => {
                incomplete(m, message);
            });
        });

        message.reply('Canal desbloqueado.').then(m => {
            incomplete(m, message);
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