const { MessageEmbed, MessageActionRow, MessageSelectMenu } = require('discord.js');
const constants = require('../../utils/constants.json');

module.exports = {
    name: 'ticket',
    aliases: [],
    utilisation: '',
    description: 'Enviar a mensagem de ticket.',

    run (client, message, args) {
        if (!verifyMember(message.member.roles.cache)) return message.reply(`Você não possui permissão para finalizar um ticket.`).then(m => {
            incomplete(m, message);
        });

        const menu = new MessageSelectMenu()
            .setCustomId('select_ticket')
            .setPlaceholder('Selecione uma categoria')
            .addOptions([
                { value: 'option_financial', label: 'Financeiro', emoji: constants.emojis.ticket_financial },
                { value: 'option_reports', label: 'Denúncias ou punições', emoji: constants.emojis.ticket_reports },
                { value: 'option_request_tag', label: 'Beneficios', emoji: constants.emojis.ticket_request_tag },
                { value: 'option_general_doubts', label: 'Outros', emoji: constants.emojis.ticket_general_doubts }
            ]);
 
        const row = new MessageActionRow()
            .addComponents(menu);

        const embed = new MessageEmbed()
            .setColor(constants.embed.color)
            .setTitle('Central de Suporte ao jogador')
            .setDescription('Olá jogador!\n\nSeja bem-vindo ao central de suporte do nosso servidor.\n\nAqui, você poderá encontrar TODO suporte necessário á respeito de nossa rede!\n\nPara começarmos, selecione uma categoria desejada.\n\n*OBS:* Uso sem consîencia deste canal, resultará em punições! Como descrito em nossas regras.')
            .setThumbnail(client.user.avatarURL())
            .setFooter({ text: `${client.user.username} | CLOUD STORE • Todos os direitos reservados`, iconURL: client.user.avatarURL() });
        
        message.channel.send({ embeds: [embed], components: [row] }).then(() => message.delete().catch(() => null));
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
    }, 5000)
}