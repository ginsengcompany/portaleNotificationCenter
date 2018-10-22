let arrayUtenti = {};
let arrayEventi = {};
let tabUtenti;
let tabEventi;
let eventi;

$(document).ready(function () {
    inizializzaPagina();

    tabUtenti = $('#tabellaUtenti').DataTable({});

    tabUtenti.on( 'click', 'tr', function () {
        $(this).toggleClass('selected');
        if (tabUtenti.rows( '.selected' ).count() > 0) {
            $('#btnConfermaStepTre').show();
        }else {
            $('#btnConfermaStepTre').hide();
        }
    } );


    $('#tabellaEventi tbody').on('click', 'tr', function () {
        passaStepTre();
        if ($(this).hasClass('selected')) {
            $(this).removeClass('selected');
            $('#btnConfermaStepDue').prop("disabled", true);
        }
        else {
            tabEventi.rows().deselect();
            $(this).addClass('selected');
        }
    });

    $('#tabellaEventi tbody').on('click', 'td.details-control', function () {
        let tr = $(this).closest('tr');
        let row = tabEventi.row(tr);

        if (row.child.isShown()) {
            // This row is already open - close it
            row.child.hide();
            tr.removeClass('shown');
        }
        else {
            // Open this row
            row.child(format(row.data())).show();
            tr.addClass('shown');
        }
    });

    $.ajax({
        url: '/getInteressi',
        type: 'GET',
        cache: false,
        contentType: 'application/json',
        success: function (data) {

            let arrayTokenField = [];

            for (let i = 0; i < data.data.length; i++) {


                let input = data.data[i].interesse + " - " + data.data[i].descrizione;

                arrayTokenField.push(input);

            }

            $('#interessi').tokenfield({
                autocomplete: {
                    source: arrayTokenField,
                    delay: 100
                },
                showAutocompleteOnFocus: true
            });

            $('#interessi').on('tokenfield:createtoken', function (event) {
                var existingTokens = $(this).tokenfield('getTokens');
                $.each(existingTokens, function (index, token) {
                    if (token.value === event.attrs.value)
                        event.preventDefault();
                });
            });


        },
        faliure: function (data) {

        }
    });
});

function inizializzaPagina() {
    moment.locale('it');
    $('#btnConfermaStepUno').hide();
    $('#btnConfermaStepTre').hide();
    $('#conteinerHideEvento').hide();
    $('#conteinerHideUtenti').hide();
    $('#conteinerHideModalita').hide();
    $('#contenutoStepDue').hide();
    $('#contenutoStepTre').hide();
    $('#contenutoStepQuattro').hide();
    $("#stepUno").addClass("active");
    $("#stepDue").removeClass("active");
    $("#stepTre").removeClass("active");
    $("#stepQuattro").removeClass("active");
    $('#contenutoStepUno').show();
    $('#invioEvento').prop("checked", false);
    $('#invioNotainformativa').prop("checked", false);
    $('#invioPush').prop('checked', false);
    $('#invioEmail').prop('checked', false);
    $('#invioSms').prop('checked', false);
    $('#tabellaEventi').dataTable().hide();
    $('#tabellaEventi').dataTable().fnDestroy();
    $('#tabellaEventi').dataTable().fnClearTable();
}

function passaStepDue() {
    $('#btnConfermaStepDue').prop("disabled", true);
    if ($('#invioEvento').is(":checked") || $('#invioNotainformativa').is(":checked")) {
        $('#contenutoStepUno').hide();
        $("#stepUno").removeClass("active");
        $("#stepDue").addClass("active");
        $('#contenutoStepDue').show();
    }
    else
        alert("Devi selezionare un opzione per proseguire")
}

function passaStepTre() {
    $('#btnConfermaStepDue').prop("disabled", false);
    $("#btnConfermaStepDue").click(function () {
        $('#contenutoStepDue').hide();
        $("#stepDue").removeClass("active");
        $("#stepTre").addClass("active");
        $('#contenutoStepTre').show();
    });
}
function passaStepQuattro() {
        $('#contenutoStepTre').hide();
        $("#stepTre").removeClass("active");
        $("#stepQuattro").addClass("active");
        $('#contenutoStepQuattro').show();
}

function switchTableEvent() {
    $('#btnConfermaStepUno').hide();
    if ($('#invioEvento').is(":checked")) {
        $('#invioEvento').prop("disabled", false);
        $('#invioNotainformativa').prop("disabled", true);
        $('#btnConfermaStepUno').show();
    }
    else if ($('#invioNotainformativa').is(":checked")) {
        $('#invioEvento').prop("disabled", true);
        $('#invioNotainformativa').prop("disabled", false);
        $('#btnConfermaStepUno').show();
    }
    $("#dataEvento").datepicker({
        defaultDate: "+1w",
        changeMonth: true,
        numberOfMonths: 2,
        dateFormat: 'dd/mm/yy',
        onSelect: function (dateText, inst) {
            if (dateText) {
                $('#conteinerHideModalita').show();
                $.ajax({
                    type: "POST",
                    url: "/getEventiData",
                    data: dateText,
                    contentType: 'text/plain',
                    success: function (data, textStatus, jqXHR) {
                        if ($('#invioEvento').prop('checked') === true && $('#invioNotainformativa').prop('checked') === false) {
                            $('#tabellaEventi').dataTable().show();
                            $('#tabellaEventi').dataTable().fnDestroy();
                            $('#conteinerHideEvento').show();
                            tabEventi = $('#tabellaEventi').DataTable({
                                data: data,
                                responsive: true,
                                select: true,
                                order: [[4, "desc"]],
                                columns: [
                                    {
                                        "className": 'details-control',
                                        "orderable": false,
                                        "data": null,
                                        "defaultContent": ''
                                    },
                                    {"data": "titolo"},
                                    {"data": "sottotitolo"},
                                    {"data": "luogo"},
                                    {
                                        "data": "data", "render": function (data) {
                                        function pad(s) {
                                            return (s < 10) ? '0' + s : s;
                                        }

                                        let d = new Date(data);
                                        return [pad(d.getDate()), pad(d.getMonth() + 1), d.getFullYear()].join('/');
                                    }
                                    },
                                    {
                                        "data": "data_fine", "render": function (data) {
                                        function pad(s) {
                                            return (s < 10) ? '0' + s : s;
                                        }

                                        let d = new Date(data);
                                        return [pad(d.getDate()), pad(d.getMonth() + 1), d.getFullYear()].join('/');
                                    }
                                    },
                                    {"data": "relatori"}
                                ]
                            });
                            tabEventi.columns().every(function () {
                                var that = this;

                                $('input', this.footer()).on('keyup change', function () {
                                    if (that.search() !== this.value) {
                                        that
                                            .search(this.value)
                                            .draw();
                                    }
                                });
                            });
                        }
                    },
                    error: function (jqXHR, textStatus, errorThrown) {

                    }
                });
            }
        }
    });

    if ($('#invioNotainformativa').prop('checked') === true) {
        $('#invioEvento').attr("checked", false);
        $('#btnConfermaStepUno').show();
        $('#tabellaEventi').dataTable().show();
        $('#tabellaEventi').dataTable().fnDestroy();
        $('#conteinerHideEvento').show();

        tabEventi = $('#tabellaEventi').DataTable({
            ajax: "/getNota",
            responsive: true,
            ajaxSettings: {
                method: "GET",
                cache: false
            },
            "order": [[4, "desc"]],
            columns: [
                {
                    "className": 'details-control',
                    "orderable": false,
                    "data": null,
                    "defaultContent": ''
                },
                {"data": "titolo"},
                {"data": "sottotitolo"},
                {"data": "luogo", "visible": false},
                {
                    "data": "data", "render": function (data) {
                    function pad(s) {
                        return (s < 10) ? '0' + s : s;
                    }

                    let d = new Date(data);
                    return [pad(d.getDate()), pad(d.getMonth() + 1), d.getFullYear()].join('/');
                }, "visible": false
                },
                {
                    "data": "data_fine", "render": function (data) {
                    function pad(s) {
                        return (s < 10) ? '0' + s : s;
                    }

                    let d = new Date(data);
                    return [pad(d.getDate()), pad(d.getMonth() + 1), d.getFullYear()].join('/');
                }, "visible": false
                },
                {"data": "relatori", "visible": false}
            ]
        });
    }

    if ($('#invioEvento').prop('checked') === false && $('#invioNotainformativa').prop('checked') === false) {
        $('#invioEvento').prop("disabled", false);
        $('#invioNotainformativa').prop("disabled", false);
        $('#conteinerHideEvento').hide();
        $('#conteinerHideModalita').hide();
        $('#tabellaEventi').dataTable().hide();
        $('#tabellaEventi').dataTable().fnDestroy();
        $('#tabellaEventi').dataTable().fnClearTable();
    }
}

/*
let something = (function () {
    let executed = false;
    return function () {
        if (!executed) {
            executed = true;
            $('#tabellaUtenti tbody').on('click', 'tr', function () {
                $(this).toggleClass('selected');
                if ($(this).hasClass('selected')) {
                    $('#btnConfermaStepTre').show();
                } else {
                    $('#btnConfermaStepTre').hide();
                }
            });
        }
    };
})();
*/

function generaTabUtenti(rotteUtenti) {
    if (tabUtenti) {
        $('#tabellaUtenti').dataTable().fnClearTable();
        tabUtenti.destroy();
    }
    let tab = $('#tabellaUtenti').DataTable({
        responsive: true,
        dom: 'Bfrtip',
        buttons: [
            'selectAll',
            'selectNone',
        ],
        language: {
            buttons: {
                selectAll: "Seleziona tutto",
                selectNone: "Deseleziona"
            }
        },
        select: {
            style: 'multi'
        },
        ajax: {
            type: 'POST',
            url: rotteUtenti,
            data: datiNotNotifica
        },
        columns: [
            {"data": "_id", "visible": false},
            {"data": "username"},
            {"data": "cognome"},
            {"data": "nome"},
            {"data": "specializzazione"},
            {"data": "provincia"}
        ]
    });
    return tab;
}

function switchTableModalitaInvio() {
    let rotteUtenti = '';

    let ids1 = $.map(tabEventi.rows('.selected').data(), function (item) {
        return item;
    });
    arrayEventi = ids1;

    datiNotNotifica = {
        "idEvento": arrayEventi[0]._id,
        "interesse": $('#interessi').tokenfield('getTokensList')
    };

    //token
    if ($('#invioPush').prop('checked') === true && $('#invioEmail').prop('checked') === false && $('#invioSms').prop('checked') === false){
        rotteUtenti = '/getUtentiToken';
        tabUtenti = generaTabUtenti(rotteUtenti);
        $('#conteinerHideUtenti').show();
    }
    else if ($('#invioPush').prop('checked') === true && $('#invioEmail').prop('checked') === false && $('#invioSms').prop('checked') === true){
        rotteUtenti = 'getUtentiTokenSms';
        tabUtenti = generaTabUtenti(rotteUtenti);
        $('#conteinerHideUtenti').show();
    }
    else if ($('#invioPush').prop('checked') === true && $('#invioEmail').prop('checked') === true && $('#invioSms').prop('checked') === false){
        rotteUtenti = '/getUtentiTokenEmail';
        tabUtenti = generaTabUtenti(rotteUtenti);
        $('#conteinerHideUtenti').show();
    }
    //email
    else if ($('#invioPush').prop('checked') === false && $('#invioEmail').prop('checked') === true && $('#invioSms').prop('checked') === false) {
        rotteUtenti = '/getUtentiEmail';
        tabUtenti = generaTabUtenti(rotteUtenti);
        $('#conteinerHideUtenti').show();
    }
    else if ($('#invioPush').prop('checked') === false && $('#invioEmail').prop('checked') === true && $('#invioSms').prop('checked') === true) {
        rotteUtenti = '/getUtentiEmailSms';
        tabUtenti = generaTabUtenti(rotteUtenti);
        $('#conteinerHideUtenti').show();
    }
    else if ($('#invioPush').prop('checked') === true && $('#invioEmail').prop('checked') === true && $('#invioSms').prop('checked') === false) {
        rotteUtenti = '/getUtentiEmailToken';
        tabUtenti = generaTabUtenti(rotteUtenti);
        $('#conteinerHideUtenti').show();
    }
    //sms
    else if ($('#invioPush').prop('checked') === false && $('#invioEmail').prop('checked') === false && $('#invioSms').prop('checked') === true) {
        rotteUtenti = '/getUtentiSms';
        tabUtenti = generaTabUtenti(rotteUtenti);
        $('#conteinerHideUtenti').show();
    }
    else if ($('#invioPush').prop('checked') === true && $('#invioEmail').prop('checked') === false && $('#invioSms').prop('checked') === true) {
        rotteUtenti = '/getUtentiSmsToken';
        tabUtenti = generaTabUtenti(rotteUtenti);
        $('#conteinerHideUtenti').show();
    }
    else if ($('#invioPush').prop('checked') === false && $('#invioEmail').prop('checked') === true && $('#invioSms').prop('checked') === true) {
        rotteUtenti = '/getUtentiSmsEmail';
        tabUtenti = generaTabUtenti(rotteUtenti);
        $('#conteinerHideUtenti').show();
    }
    else if ($('#invioPush').prop('checked') === true && $('#invioEmail').prop('checked') === true && $('#invioSms').prop('checked') === true) {
        rotteUtenti = '/getUtentiNotNotifica';
        tabUtenti = generaTabUtenti(rotteUtenti);
        $('#conteinerHideUtenti').show();
    }
    else
    {
        $('#btnConfermaStepTre').hide();
        $('#conteinerHideUtenti').hide();
    }
    $('#btnAnnullaStepTre').show();
}

let successMessage = function (idUtente, idEvento, tipo, tipoEvento) {

    let successMessageDati = {
        "idUtente": idUtente,
        "idEvento": idEvento,
        "stato": false,
        "confermato": false,
        "eliminato": false,
        "tipo": tipo,
        "tipoEvento": tipoEvento
    };

    $.ajax({
        url: '/salvaStatoNotifiche',
        type: 'POST',
        data: JSON.stringify(successMessageDati),
        cache: false,
        contentType: 'application/json',
        success: function (data) {
            if (data.errore === true) {

                $("#myModal").on("show", function () {
                    $("#myModal a.btn").on("click", function (e) {
                        $("#myModal").modal('hide');
                    });
                });
                $("#myModal").on("hide", function () {
                    $("#myModal a.btn").off("click");
                });

                $("#myModal").on("hidden", function () {
                    $("#myModal").remove();
                });

                $("#myModal").modal({
                    "backdrop": "static",
                    "keyboard": true,
                    "show": true
                });
            }
            else if (data.errore === false) {
                $("#myModal1").on("show", function () {
                    $("#myModal1 a.btn").on("click", function (e) {
                        $("#myModal1").modal('hide');
                    });
                });
                $("#myModal1").on("hide", function () {
                    $("#myModal1 a.btn").off("click");
                });

                $("#myModal1").on("hidden", function () {
                    $("#myModal1").remove();
                });

                $("#myModal1").modal({
                    "backdrop": "static",
                    "keyboard": true,
                    "show": true
                });

                tabUtenti.ajax.reload();
            }
        },
        faliure: function (data) {
            console.log('Errore!');
        }
    });
};

function salvaDati() {

    let ids = $.map(tabUtenti.rows('.selected').data(), function (item) {
        return item;
    });
    arrayUtenti = ids;
    let ids1 = $.map(tabEventi.rows('.selected').data(), function (item) {
        return item;
    });
    arrayEventi = ids1;
    if ($('#invioPush').prop('checked') === false && $('#invioEmail').prop('checked') === false && $('#invioSms').prop('checked') === false)
        $('#myModal3').modal('show');
    if (!arrayUtenti.length || !arrayEventi.length)
        $('#myModal3').modal('show');

    for (let i = 0; i < arrayUtenti.length; i++) {
        let idUtente = arrayUtenti[i]._id;
        let idEvento = arrayEventi[0]._id;
        let tipoEvento = arrayEventi[0].tipo;

        if (arrayUtenti[i].token && $('#invioPush').prop('checked'))
            successMessage(idUtente, idEvento, 'Push Notifications', tipoEvento);
        if (arrayUtenti[i].mail && $('#invioEmail').prop('checked'))
            successMessage(idUtente, idEvento, 'E-mail', tipoEvento);
        if (arrayUtenti[i].numero_telefono && $('#invioSms').prop('checked'))
            successMessage(idUtente, idEvento, 'SMS', tipoEvento);
    }
}

function format(d) {
    // `d` is the original data object for the row
    if (d.informazioni === null || d.informazioni === undefined) {
        return '<table cellpadding="50" cellspacing="20" border="0" style="padding-left:50px;">' +
            '<tr>' +
            '<td style="font-weight: bold;">Descrizione: </td>' +
            '<td>' + d.descrizione + '</td>' +
            '</tr>' +
            '</table>';
    } else {
        return '<table cellpadding="50" cellspacing="20" border="0" style="padding-left:50px;">' +
            '<tr>' +
            '<td style="font-weight: bold;">Informazioni: </td>' +
            '<td>' + d.informazioni + '</td>' +
            '</tr>' +
            '<tr>' +
            '<td style="font-weight: bold;">Descrizione: </td>' +
            '<td>' + d.descrizione + '</td>' +
            '</tr>' +
            '</table>';
    }
}

function convertDate(inputFormat) {
    function pad(s) {
        return (s < 10) ? '0' + s : s;
    }

    let d = new Date(inputFormat);
    return [pad(d.getDate()), pad(d.getMonth() + 1), d.getFullYear()].join('/');
}