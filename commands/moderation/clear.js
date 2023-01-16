const { Permissions, MessageEmbed } = require('discord.js');
const constants = require('../../utils/constants.json');

module.exports = {
    name: 'clear',
    aliases: [],
    utilisation: '<número (2-100)>',
    description: 'Limpar entre 2 a 100 mensagens.',

    async run(client, message, args) {
        if (!verifyMember(message.member.roles.cache)) return message.reply(`Você não possui permissão para limpar o histórico.`).then(m => {
            incomplete(m, message);
        });
        if (!message.member.permissions.has(Permissions.FLAGS.MANAGE_MESSAGES)) return message.reply('Você precisa da permissão "Gerenciar Servidor" para executar este comando.').then(m => {
            incomplete(m, message);
        });
        if (!message.guild.me.permissions.has(Permissions.FLAGS.MANAGE_MESSAGES)) return message.reply('Não possuo a permissão "Gerenciar Mensagens" para executar essa limpeza.').then(m => {
            incomplete(m, message);
        });

        const amount = parseInt(args[0]);

        if (!amount) return message.reply(`Uso correto: \`${constants.prefix}${this.name} ${this.utilisation}\``).then(m => {
            incomplete(m, message);
        });
        if (isNaN(amount)) return message.reply('Insira um número válido.').then(m => {
            incomplete(m, message);
        });
        if (amount < 2 || amount > 100) return message.reply('Só é possível limpar de 2 a 100 mensagens.').then(m => {
            incomplete(m, message);
        });

        let fetched = null;

        if (amount === 100) {
            fetched = await message.channel.messages.fetch({
                limit: amount
            });

        } else {
            fetched = await message.channel.messages.fetch({
                limit: amount + 1
            });
        }

        await message.channel
            .bulkDelete(fetched, true)
            .then(messages => {
                const embed = new MessageEmbed()
                    .setColor('GREEN')
                    .setTitle((messages.size - 1) === 1 ? `Foi limpa **${messages.size - 1}** mensagem.\n` : `Foram limpas **${messages.size - 1}** mensagens.\n`)
                    .setDescription(
                        'Se não foi possível limpar todas as mensagens, é porque tem mais de 14 dias ou não havia mais nada para limpar.\n\n' +
                        `**Autor:** ${message.member}`
                    )
                    .setThumbnail(client.user.avatarURL())
                    .setFooter({ text: `${client.user.username} | CLOUD STORE • Todos os direitos reservados`, iconURL: client.user.avatarURL() });

                message.channel.send({ embeds: [embed] }).then(m => {
                    incomplete(m, message);
                });

            }).catch(error => {
                console.log(error);

                message.reply('Não foi possível limpar as mensagens, isso porque elas possuem mais de 14 dias de existência.').then(m => {
                    incomplete(m, message);
                });
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