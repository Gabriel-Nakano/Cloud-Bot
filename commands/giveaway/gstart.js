const constants = require('../../utils/constants.json');
const ms = require('ms');
const { MessageEmbed } = require('discord.js');

module.exports = {
    name: 'gstart',
    aliases: [],
    utilisation: '<canal> <@patrocinador> <duração> <vencedores> <prêmio>.',
    description: 'Iniciar um sorteio.',

    run(client, message, args) {
        if (!verifyMember(message.member.roles.cache)) return message.reply(`Você não possui permissão para gerenciar os sorteios.`).then(m => {
            incomplete(m, message);
        });

        if (args.length < 5) return message.reply(`Uso correto: \`${constants.prefix}${this.name} ${this.utilisation}\``).then(m => {
            setTimeout(() => {
                m.delete().catch(() => null);
                message.delete().catch(() => null);

            }, 10000);
        });

        const channel = message.mentions.channels.first();
        if (!channel) return message.reply('Mencione o canal onde o sorteio irá ser realizado.').then(m => {
            incomplete(m, message);
        });

        const member = message.mentions.members.first();
        if (!member) return message.reply('Mencione o patrocinador do sorteio.').then(m => {
            incomplete(m, message);
        });

        const time = args[2];
        if (!time) return message.reply('Insira a duração.').then(m => {
            incomplete(m, message);
        });
        if (!ms(time) || time < 1 || time.includes('-')) return message.reply('Duração inválida.').then(m => {
            incomplete(m, message);
        });

        let numWinners = args[3];
        if (!numWinners || numWinners < 1 || isNaN(numWinners)) return message.reply('Número de vencedores inválido.').then(m => {
            incomplete(m, message);
        });

        const prize = args.slice(4).join(' ');
        if (!prize) return message.reply('Insira o prêmio do sorteio.').then(m => {
            incomplete(m, message);
        });

        const winEmbed = new MessageEmbed()
            .setColor('GREEN')
            .setTitle('SORTEIO FINALIZADO')
            .setDescription(
                '\n**Prêmio:** {this.prize}\n' +
                '**Vencedor(es):** {winners}'
            )
            .setThumbnail(client.user.avatarURL())
            .setFooter({ text: `${client.user.username} | Sorteios • Todos os direitos reservados`, iconURL: client.user.avatarURL() });

        client.giveawaysManager.start(channel, {
            duration: ms(time),
            prize: prize,
            winnerCount: parseInt(numWinners),
            hostedBy: member,
            thumbnail: client.user.avatarURL(),
            messages: {
                giveaway: `<@&${constants.roles.member}>`,
                giveawayEnded: `<@&${constants.roles.member}>`,
                noWinner: '**Sorteio finalizado. Não houve entradas para um vencedor.**',
                drawing: '\n**O sorteio termina {timestamp}.**',
                inviteToParticipate: 'Reaja com 🎉 para participar do sorteio.',
                winMessage: {
                    content: `<@&${constants.roles.member}>`,
                    embed: winEmbed,
                    replyToGiveaway: true
                },
                embedFooter: {
                    text: `${client.user.username} | Sorteios • Todos os direitos reservados`,
                    iconURL: client.user.avatarURL()
                },
                hostedBy: '\nPatrocinado por: {this.hostedBy}',
                winners: 'Vencedor(es):',
                endedAt: 'Sorteio terminado',
                units: {
                    seconds: 'segundos',
                    minutes: 'minutos',
                    hours: 'horas',
                    days: 'dias',
                    plurals: false
                }
            },
        })

        message.reply(`Sorteio iniciado no canal ${channel}.`).then(m => {
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