const constants = require('../../utils/constants.json');

module.exports = {
   name: 'finalizar',
   aliases: [],
   utilisation: '',
   description: 'Finalizar um ticket.',

   run(client, message, args) {
      if (!verifyMember(message.member.roles.cache)) return message.reply(`Você não possui permissão para finalizar um ticket.`).then(m => {
         incomplete(m, message);
      });

      const parent = message.channel.parent;
      const categories = constants.categories;

      if (categories.financial !== parent.id && categories.reports !== parent.id && categories.request_tag !== parent.id && categories.general_doubts !== parent.id) {
         return message.reply('Este canal não é um ticket.').then(m => {
            incomplete(m, message);
         });
      } 
      
      if (message.channel) message.channel.delete().catch(() => null);
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