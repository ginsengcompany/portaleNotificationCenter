let express = require('express');
let router = express.Router();
let postgresConnection = require('../../../config/postgres');
let moment = require('moment');
let multiUser = require('../../../config/configMultiUser');

let connectionPostgres = function () {
    return postgresConnection();
};

router.post('/',function (req, res, next) {

    let organizzazione = req.body.organizzazione;

    let client = connectionPostgres();

    for(let i=0;i<multiUser.data.length;i++) {

        if (multiUser.data[i].cod_org === organizzazione) {

            let queryPostEvento = "SELECT A.matricola, A.nome, A.cognome, A.specializzazione, C.titolo, B._id_utente, B._id_evento, B.data_invio, B.tipo, B.stato, B.confermato, B.eliminato, B._id FROM "+multiUser.data[i].tb_contatti+" A INNER JOIN "+multiUser.data[i].tb_notifiche+" B ON A._id=B._id_utente INNER JOIN tb_landing_evento C ON C._id=B._id_evento";

            const query = client.query(queryPostEvento);

            query.on("row", function (row, result) {
                result.addRow(row);
            });

            query.on("end", function (result) {
                let myOjb = JSON.stringify(result.rows, null, "    ");
                let final = JSON.parse(myOjb);
                let jsonFinale = {
                    "data": final
                };
                client.end();
                return res.json(jsonFinale);

            });

        }
    }

});

module.exports = router;