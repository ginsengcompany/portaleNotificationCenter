'use strict';
let config = {
    data: []
};

// ORG - 1
let multiUser1 = {
    cod_org: 'AK_12',
    logo_org: 'ak12.png',
    descrizione: 'AK-12 srl',
    tb_interessi: 'tb_interessi_ak_12_srl',
    tb_contatti: 'tb_contatti_ak_12_srl',
    tb_eventi: 'tb_evento_ak_12_srl',
    tb_notifiche: 'tb_notifiche_ak_12_srl',
    tb_messaggi: 'message_ak_12_srl'
};
config.data.push(multiUser1);

// ORG - 2
let multiUser2 = {
    cod_org: 'OPICE',
    logo_org: 'logo-OPICE.jpg',
    descrizione: 'Ordine Degli Infermieri',
    tb_interessi: 'tb_interessi_ordine_infermieri_caserta',
    tb_contatti: 'tb_contatti_ordine_infermieri_caserta',
    tb_eventi: 'tb_evento_ordine_infermieri_caserta',
    tb_notifiche: 'tb_notifiche_ordine_infermieri_caserta',
    tb_messaggi: 'message_ordine_infermieri_caserta'
};
config.data.push(multiUser2);

module.exports =  config;

