const constants = require('../../utils/constants.json');

module.exports = {
    name: 'gend',
    aliases: [],
    utilisation: '<ID da mensagem do sorteio>',
    description: 'Finalizar um sorteio.',

    run(client, message, args) {
        if (!verifyMember(message.member.roles.cache)) return message.reply(`Você não possui permissão para gerenciar os sorteios.`).then(m => {
            incomplete(m, message);
        });

        const messageId = args[0];
        if (!messageId) return message.reply(`Uso correto: \`${constants.prefix}${this.name} ${this.utilisation}\``).then(m => {
            incomplete(m, message);
        });

        client.giveawaysManager.end(messageId).then(() => {
            message.reply('O sorteio foi finalizado.').then(m => {
                incomplete(m, message);
            });

        }).catch(error => {
            console.log(error);

            message.reply(`Não foi encontrado nenhum sorteio ativo com o ID **${messageId}**.`).then(m => {
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