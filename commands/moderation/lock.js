const { Permissions, MessageEmbed } = require('discord.js');
const constants = require('../../utils/constants.json');

module.exports = {
    name: 'lock',
    aliases: [],
    utilisation: '',
    description: 'Bloquear um canal',

    async run (client, message, args) {
        if (!verifyMember(message.member.roles.cache)) return message.reply(`Você não possui permissão para bloquear o chat.`).then(m => {
            incomplete(m, message);
        });
        if (!message.member.permissions.has(Permissions.FLAGS.MANAGE_CHANNELS)) return message.reply('Você precisa da permissão "Gerenciar Canais" para executar este comando.').then(m => {
            incomplete(m, message);
        });
        if (!message.guild.me.permissions.has(Permissions.FLAGS.MANAGE_CHANNELS)) return message.reply('Não possuo a permissão "Gerenciar Canais" para executar esse bloqueamento.').then(m => {
            incomplete(m, message);
        });

        const channel = message.channel;
        if (!channel.permissionsFor(constants.roles.member).has('SEND_MESSAGES')) return message.reply('Este canal já está bloqueado.').then(m => {
            incomplete(m, message);
        });

        await channel.permissionOverwrites.create(constants.roles.member, {
            SEND_MESSAGES: false

        }).catch((error) => {
            console.error(`Erro ao tentar bloquear o canal:\n${error}`);
            
            return message.reply('Ocorreu um erro ao tentar bloquear o canal.').then(m => {
                incomplete(m, message);
            });
        });
            
        message.reply('Canal bloqueado com sucesso!').then(m => {
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