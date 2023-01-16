const { Permissions, MessageEmbed } = require('discord.js');
const constants = require('../../utils/constants.json');

module.exports = {
    name: 'unban',
    aliases: [],
    utilisation: '<ID do jogador | all> <motivo (opcional)>',
    description: 'Remover a punição de um jogador.',

    async run(client, message, args) {
        /*if (!verifyMember(message.member.roles.cache)) return message.reply(`Tens que ser <@&${constants.roles.staff}> ou superior para utilizar este comando!`).then(m => {
            incomplete(m, message);
        });*/
        if (!message.member.permissions.has(Permissions.FLAGS.BAN_MEMBERS)) return message.reply('Você precisa da permissão "Banir Membros" para executar este comando.').then(m => {
            incomplete(m, message);
        });
        if (!message.guild.me.permissions.has(Permissions.FLAGS.BAN_MEMBERS)) return message.reply('Não possui a permissão "Banir Membros" para executar esta punição.').then(m => {
            incomplete(m, message);
        });

        const userId = args[0];
        let reason = args.slice(1).join(' ');

        if (!userId) return message.reply(`Como usar: \`${constants.prefix}${this.name} ${this.utilisation}\``).then(m => {
            incomplete(m, message);
        });
        if (!reason) reason = 'Não informado'
        if (isNaN(userId)) if (userId !== 'all') return message.reply('ID do jogador inválido.').then(m => {
            incomplete(m, message);
        });

        const embed = new MessageEmbed();

        if (args[0] === 'all') {
            message.guild.bans.fetch().then(async bans => {
                if (bans.size == 0) return message.reply('Não existe nenhum jogador punido.').then(m => {
                    incomplete(m, message);
                });

                let bansIds = [];
                let j = 0;

                bans.forEach((b) => {
                    bansIds[j] += b.user.id;
                    j++;
                })

                for (let n = 0; n < bansIds.length; n++) {
                    bansIds[n] = (bansIds[n] + '').replace('undefined', '');
                }

                if (bansIds.length === 1) message.reply(`Desbanindo ${bansIds.length} utilizador...`);
                else message.reply(`Desbanindo ${bansIds.length} utilizadores...`);

                for (let i = 0; i < bansIds.length; i++) {
                    await message.guild.members.unban(bansIds[i], reason).then(() => {
                        embed
                            .setColor('GREEN')
                            .setTitle('Jogador despunido do servidor')
                            .setDescription(
                                `**Jogador:** <@${bansIds[i]}>\n\n` +
                                `**Motivo:** ${reason}\n\n` +
                                `**Autor:** ${message.member}`
                            )
                            .setThumbnail(client.users.cache.get(bansIds[i]).avatarURL())
                            .setFooter({ text: `${client.user.username} | CLOUD STORE • Todos os direitos reservados`, iconURL: client.user.avatarURL() });

                        message.guild.channels.cache.get(constants.channels.logs).send({ embeds: [embed] });

                        message.reply('Punição removida.').then(m => {
                            incomplete(m, message);
                        });

                    }).catch(error => console.error(`Erro ao tentar despunir ${userId}:\n${error}`));
                }
            });

        } else {
            message.guild.bans.fetch().then(async bans => {
                if (bans.size == 0) return message.reply('Não existe nenhum utilizador banido.').then(m => {
                    incomplete(m, message);
                });

                const bannedUser = bans.find(b => b.user.id == userId);
                if (!bannedUser) return message.reply(`O utilizador **${userId}** não está banido do servidor.`).then(m => {
                    incomplete(m, message);
                });

                await message.guild.members.unban(bannedUser.user, reason).then(() => {
                    embed
                        .setColor('GREEN')
                        .setTitle('🔓 Utilizador desbanido do servidor!')
                        .setDescription(
                            `**Utilizador:** <@${userId}>\n` +
                            `**Motivo:** ${reason}\n` +
                            `**Autor:** ${message.member}`
                        )
                        .setThumbnail(client.users.cache.get(userId).avatarURL())
                        .setFooter({ text: `${client.user.username} | CLOUD STORE • Todos os direitos reservados`, iconURL: client.user.avatarURL() });

                    message.guild.channels.cache.get(constants.channels.logs).send({ embeds: [embed] });

                    message.reply(`Punição removida com sucesso! Mais informações em <#${constants.channels.logs}>.`).then(m => {
                        incomplete(m, message);
                    });

                }).catch(error => console.error(`Erro ao tentar desbanir ${userId}:\n${error}`));
            })
        }
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