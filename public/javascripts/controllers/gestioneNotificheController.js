// Sostituisco form-control con browser-default
// $('#selectInt').append('<option value="' + data.data[i]._id + '">' + data.data[i].descrizione + ' ' + data.data[i].interesse + '</option>')
$(document).ready(function () {
    $('#nascondiDataInvio').hide();
    $('#hideInfo').hide();
    $('#conteinerHideEvento').hide();
    $('#tabellaNotifiche').dataTable().hide();
    $('#tabellaNotifiche').dataTable().fnDestroy();
    $('#tabellaNotifiche').dataTable().fnClearTable();
});

let datiSwitch = {
    'confermato': true,
    'eliminato': false,
    '_id_utente': '',
    '_id_evento': ''
};

let datiSwitch1 = {
    'confermato': false,
    'eliminato': true,
    '_id_utente': '',
    '_id_evento': ''
};

function switchConfermatoEmail(dataSwitch) {

    $('#tabellaNotifiche tbody').on('click', 'button', function () {
        let dati = tabNotifiche.row($(this).parents('tr')).data();
        switchConfermatoEmail(dati);
    });

    if (dataSwitch !== undefined) {
        datiSwitch._id_utente = dataSwitch._id_utente;
        datiSwitch._id_evento = dataSwitch._id_evento;
        $.ajax({
            url: '/switchConfermatoEmail',
            type: 'POST',
            data: JSON.stringify(datiSwitch),
            cache: false,
            contentType: 'application/json',
            success: function (data) {

                if (data.errore === false) {

                    tabNotifiche.ajax.reload();

                }

            },
            faliure: function (data) {

            }
        });
    }

}

function switchEliminatoEmail(dataSwitch) {

    $('#tabellaNotifiche tbody').on('click', 'button', function () {
        let dati = tabNotifiche.row($(this).parents('tr')).data();
        switchEliminatoEmail(dati);
    });

    if (dataSwitch !== undefined) {
        datiSwitch1._id_utente = dataSwitch._id_utente;
        datiSwitch1._id_evento = dataSwitch._id_evento;
        $.ajax({
            url: '/switchConfermatoEmail',
            type: 'POST',
            data: JSON.stringify(datiSwitch1),
            cache: false,
            contentType: 'application/json',
            success: function (data) {

                if (data.errore === false) {

                    tabNotifiche.ajax.reload();

                }

            },
            faliure: function (data) {

            }
        });
    }

}

function exportExcel() {
    tabNotifiche.buttons('.buttons-excel').trigger();
}

function exportPdf() {
    tabNotifiche.buttons('.buttons-pdf').trigger();
}

function exportStampa() {
    tabNotifiche.buttons('.buttons-print').trigger();
}

function switchTable() {
    $("#filtroDataInvio").datepicker("setDate", null);
    if ($('#invioEvento').prop('checked') === true && $('#invioNotainformativa').prop('checked') === false) {
        $('#hideInfo').hide();
        $('#conteinerHideEvento').show();
        $('#nascondiDataInvio').show();
        $("#filtroDataInvio").datepicker({
            defaultDate: "+1w",
            changeMonth: true,
            numberOfMonths: 2,
            dateFormat: 'dd/mm/yy',
            onSelect: function (dateText, inst) {
                $('#tabellaNotifiche').dataTable().show();
                $('#tabellaNotifiche').dataTable().fnDestroy();
                if (dateText) {
                    let datiFiltro = {
                        dataInvio : dateText
                    };
                    tabNotifiche = $('#tabellaNotifiche').DataTable({
                        // eliminare se non serve in cima
                        orderCellsTop: true,
                        // eliminare se non serve la formattazione con bottoni in cima
                        dom: 'Bfrtip',
                        initComplete: function () {
                            this.api().columns([4, 5, 7]).every(function () {
                                let column = this;
                                var select = $('<select class="mdb-select"><option value="" selected>Tutto</option></select>');
                                select.material_select('destroy');
                                // Prima era in questo modo
                                //select.appendTo($(column.footer()).empty())
                                select.appendTo($("#tabellaNotifiche thead tr:eq(1) th").eq(column.index() - 1).empty())
                                    .on('change', function () {
                                        let val = $.fn.dataTable.util.escapeRegex(
                                            $(this).val()
                                        );
                                        column
                                            .search(val ? '^' + val + '$' : '', true, false)
                                            .draw();
                                    });
                                column.data().unique().sort().each(function (d, j) {
                                    select.append('<option value="' + d + '">' + d + '</option>');
                                    select.material_select();
                                });
                            });
                            this.api().columns([9, 10]).every(function () {
                                let column = this;
                                var select = $('<select class="mdb-select"><option value="" selected>Tutto</option></select>');
                                select.material_select('destroy');
                                // Prima
                                // select.appendTo($(column.footer()).empty())
                                select.appendTo($("#tabellaNotifiche thead tr:eq(1) th").eq(column.index() - 1).empty())
                                    .on('change', function () {

                                        let val = $.fn.dataTable.util.escapeRegex(
                                            $(this).val()
                                        );

                                        column
                                            .search(val)
                                            .draw();
                                    });

                                column.data().unique().sort().each(function (d, j) {
                                    if (d === true) {
                                        d = 'Si';
                                        select.append('<option value="' + d + '">' + d + '</option>');
                                    }
                                    if (d === false) {
                                        d = 'No';
                                        select.append('<option value="' + d + '">' + d + '</option>');
                                    }
                                    select.material_select();
                                });
                            });
                            this.api().columns([8]).every(function () {
                                let column = this;
                                var select = $('<select class="mdb-select"><option value="" selected>Tutto</option></select>');
                                select.material_select('destroy');
                                // Prima
                                // select.appendTo($(column.footer()).empty())
                                select.appendTo($("#tabellaNotifiche thead tr:eq(1) th").eq(column.index() - 1).empty())
                                    .on('change', function () {
                                        let val = $.fn.dataTable.util.escapeRegex(
                                            $(this).val()
                                        );
                                        column
                                            .search(val)
                                            .draw();
                                    });

                                column.data().unique().sort().each(function (d, j) {
                                    if (d === true) {
                                        d = 'Inoltrato';
                                        select.append('<option value="' + d + '">' + d + '</option>');
                                    }
                                    if (d === false) {
                                        d = 'Non Inviato';
                                        select.append('<option value="' + d + '">' + d + '</option>');
                                    }
                                    select.material_select();
                                });
                            });
                            this.api().columns([6]).every(function () {
                                let that = this;
                                let select = $('<input class="form-control" type="text" id="dataSearch" placeholder="Ricerca"/>')
                                    .appendTo($('#searchBar').empty())
                                    .on('keyup change', function () {
                                        if (that.search() !== this.value) {
                                            that
                                                .search(this.value)
                                                .draw();
                                        }
                                    });
                            });
                        },
                        search: {"caseInsensitive": false},
                        // Prima
                        // ajax: "/getNotifiche",
                        ajax: {
                            "url": "/getNotifiche",
                            "type": "POST",
                            "data": datiFiltro
                        },
                        buttons: [
                            {
                                extend: 'excel',
                                text: 'Excel',
                                exportOptions: {
                                    columns: ':visible',
                                    orthogonal: 'export'
                                }
                            },
                            {
                                extend: 'pdfHtml5',
                                text: 'PDF',
                                orientation: 'landscape',
                                exportOptions: {
                                    columns: ':visible',
                                    orthogonal: 'export'
                                }
                            },
                            {
                                extend: 'print',
                                text: 'Stampa',
                                exportOptions: {
                                    columns: ':visible',
                                    orthogonal: 'export'
                                }
                            }
                        ],
                        scrollCollapse: false,
                        paging: true,
                        autoWidth: false,
                        responsive: true,
                        ajaxSettings: {
                            // Prima
                            //method: "GET",
                            cache: false
                        },
                        columns: [
                            {"data": "_id", "visible": false},
                            {"data": "username"},
                            {"data": "cognome"},
                            {"data": "nome"},
                            {"data": "specializzazione"},
                            {"data": "titolo"},
                            {
                                "data": "data_invio", "render": function (data) {
                                if (data !== '1969-12-31T23:00:00.000Z') {
                                    function pad(s) {
                                        return (s < 10) ? '0' + s : s;
                                    }

                                    let d = new Date(data);
                                    return [pad(d.getDate()), pad(d.getMonth() + 1), d.getFullYear()].join('/');
                                } else {
                                    return 'Non Disponibile';
                                }
                            }
                            },
                            {"data": "tipo"},
                            {
                                "data": "stato", "render": function (data) {
                                if (data === true) {
                                    return '<h4><span class="badge badge-success">Inoltrato</span></h4>';
                                }
                                if (data === false) {
                                    return '<h4><span class="badge badge-warning">Non Inoltrato</span></h4>';
                                }
                            }
                            },
                            {
                                "data": "confermato", "render": function (data, type) {
                                let color = 'black';
                                if (type === 'export') {
                                    if (data === false) {
                                        return type === 'export' ? data = 'No' : data;
                                    }
                                    if (data === true) {
                                        return type === 'export' ? data = 'Si' : data;
                                    }
                                }
                                if (data === false) {
                                    return '<button type="button" class="btn btn-danger btn-sm" id="btnConferma" onclick="switchConfermatoEmail();">No - Clicca per Confermare</button>';
                                }
                                if (data === true) {
                                    return '<h4><span class="badge badge-success">Si</span></h4>';
                                }
                            }
                            },
                            {
                                "data": "eliminato", "render": function (data, type) {
                                let color = 'black';
                                if (type === 'export') {
                                    if (data === false) {
                                        return type === 'export' ? data = 'No' : data;
                                    }
                                    if (data === true) {
                                        return type === 'export' ? data = 'Si' : data;
                                    }
                                }
                                if (data === false) {
                                    return '<button type="button" class="btn btn-danger btn-sm" id="btnElimina" onclick="switchEliminatoEmail();">No - Clicca per Eliminare</button>';
                                }
                                if (data === true) {
                                    return '<h4><span class="badge badge-success">Si</span></h4>';
                                }
                            }
                            }
                        ]
                    });
                }
            }
        });
    }

    if ($('#invioEvento').prop('checked') === false && $('#invioNotainformativa').prop('checked') === true) {
        $('#hideInfo').hide();
        $('#conteinerHideEvento').show();
        $('#nascondiDataInvio').show();
        $("#filtroDataInvio").datepicker({
            defaultDate: "+1w",
            changeMonth: true,
            numberOfMonths: 2,
            dateFormat: 'dd/mm/yy',
            onSelect: function (dateText, inst) {
                $('#tabellaNotifiche').dataTable().show();
                $('#tabellaNotifiche').dataTable().fnDestroy();
                if (dateText) {
                    let datiFiltro = {
                        dataInvio: dateText
                    };
                    tabNotifiche = $('#tabellaNotifiche').DataTable({
                        // eliminare se non serve in cima
                        orderCellsTop: true,
                        // eliminare se non serve la formattazione con bottoni in cima
                        dom: 'Bfrtip',
                        initComplete: function () {
                            this.api().columns([4, 5, 7]).every(function () {
                                let column = this;
                                var select = $('<select class="mdb-select"><option value="" selected>Tutto</option></select>');
                                select.material_select('destroy');
                                // select.appendTo($(column.footer()).empty())
                                select.appendTo($("#tabellaNotifiche thead tr:eq(1) th").eq(column.index() - 1).empty())
                                    .on('change', function () {
                                        let val = $.fn.dataTable.util.escapeRegex(
                                            $(this).val()
                                        );

                                        column
                                            .search(val ? '^' + val + '$' : '', true, false)
                                            .draw();
                                    });

                                column.data().unique().sort().each(function (d, j) {
                                    select.append('<option value="' + d + '">' + d + '</option>')
                                    select.material_select();
                                });
                            });
                            this.api().columns([9, 10]).every(function () {
                                let column = this;
                                var select = $('<select class="mdb-select"><option value="" selected>Tutto</option></select>');
                                select.material_select('destroy');
                                // select.appendTo($(column.footer()).empty())
                                select.appendTo($("#tabellaNotifiche thead tr:eq(1) th").eq(column.index() - 1).empty())
                                    .on('change', function () {

                                        let val = $.fn.dataTable.util.escapeRegex(
                                            $(this).val()
                                        );

                                        column
                                            .search(val)
                                            .draw();
                                    });

                                column.data().unique().sort().each(function (d, j) {
                                    if (d === true) {
                                        d = 'Si';
                                        select.append('<option value="' + d + '">' + d + '</option>');
                                    }
                                    if (d === false) {
                                        d = 'No';
                                        select.append('<option value="' + d + '">' + d + '</option>');
                                    }
                                    select.material_select();
                                });

                            });
                            this.api().columns([8]).every(function () {
                                let column = this;
                                var select = $('<select class="mdb-select" selected><option value="">Tutto</option></select>');
                                select.material_select('destroy');
                                // select.appendTo($(column.footer()).empty())
                                select.appendTo($("#tabellaNotifiche thead tr:eq(1) th").eq(column.index() - 1).empty())
                                    .on('change', function () {

                                        let val = $.fn.dataTable.util.escapeRegex(
                                            $(this).val()
                                        );

                                        column
                                            .search(val)
                                            .draw();
                                    });

                                column.data().unique().sort().each(function (d, j) {
                                    if (d === true) {
                                        d = 'Inoltrato';
                                        select.append('<option value="' + d + '">' + d + '</option>');
                                    }
                                    if (d === false) {
                                        d = 'Non Inviato';
                                        select.append('<option value="' + d + '">' + d + '</option>');
                                    }
                                    select.material_select();
                                });
                            });
                            this.api().columns([6]).every(function () {
                                let that = this;
                                // select.appendTo($(column.footer()).empty())
                                //select.appendTo($("#tabellaNotifiche thead tr:eq(1) th").eq(column.index()-1).empty())
                                let select = $('<input class="form-control" type="text" id="dataSearch" placeholder="Ricerca"/>')
                                    .appendTo($('#searchBar').empty())
                                    .on('keyup change', function () {
                                        if (that.search() !== this.value) {
                                            that
                                                .search(this.value)
                                                .draw();
                                        }
                                    });
                            });
                        },
                        search: {"caseInsensitive": false},
                        // Prima
                        // ajax: "/getNotificheNota",
                        ajax: {
                            "url": "/getNotificheNota",
                            "type": "POST",
                            "data": datiFiltro
                        },
                        buttons: [
                            {
                                extend: 'excel',
                                text: 'Excel',
                                exportOptions: {
                                    columns: ':visible',
                                    orthogonal: 'export'
                                }
                            },
                            {
                                extend: 'pdfHtml5',
                                text: 'PDF',
                                orientation: 'landscape',
                                exportOptions: {
                                    columns: ':visible',
                                    orthogonal: 'export'
                                }
                            },
                            {
                                extend: 'print',
                                text: 'Stampa',
                                exportOptions: {
                                    columns: ':visible',
                                    orthogonal: 'export'
                                }
                            }
                        ],
                        scrollCollapse: false,
                        paging: true,
                        autoWidth: false,
                        responsive: true,
                        ajaxSettings: {
                            // Prima era GET
                            //method: "POST",
                            cache: false
                        },
                        columns: [
                            {"data": "_id", "visible": false},
                            {"data": "username"},
                            {"data": "cognome"},
                            {"data": "nome"},
                            {"data": "specializzazione"},
                            {"data": "titolo"},
                            {
                                "data": "data_invio", "render": function (data) {
                                if (data !== '1969-12-31T23:00:00.000Z') {
                                    function pad(s) {
                                        return (s < 10) ? '0' + s : s;
                                    }

                                    let d = new Date(data);
                                    return [pad(d.getDate()), pad(d.getMonth() + 1), d.getFullYear()].join('/');
                                } else {
                                    return 'Non Disponibile';
                                }

                            }
                            },
                            {"data": "tipo"},
                            {
                                "data": "stato", "render": function (data) {
                                if (data === true) {
                                    return '<h4><span class="badge badge-success">Inoltrato</span></h4>';
                                }
                                if (data === false) {
                                    return '<h4><span class="badge badge-warning">Non Inviato</span></h4>';
                                }

                            }
                            },
                            {
                                "data": "confermato", "render": function (data, type) {
                                let color = 'black';
                                if (type === 'export') {
                                    if (data === false) {
                                        return type === 'export' ? data = 'No' : data;
                                    }
                                    if (data === true) {
                                        return type === 'export' ? data = 'Si' : data;
                                    }
                                }
                                if (data === false) {
                                    return '<button type="button" class="btn btn-danger btn-sm" id="btnConferma" onclick="switchConfermatoEmail();">No - Clicca per Confermare</button>';
                                }
                                if (data === true) {
                                    return '<h4><span class="badge badge-success">Si</span></h4>';
                                }
                            }
                            },
                            {
                                "data": "eliminato", "render": function (data, type) {
                                let color = 'black';
                                if (type === 'export') {
                                    if (data === false) {
                                        return type === 'export' ? data = 'No' : data;
                                    }
                                    if (data === true) {
                                        return type === 'export' ? data = 'Si' : data;
                                    }
                                }
                                if (data === false) {
                                    return '<button type="button" class="btn btn-danger btn-sm" id="btnElimina" onclick="switchEliminatoEmail();">No - Clicca per Eliminare</button>';
                                }
                                if (data === true) {
                                    return '<h4><span class="badge badge-success">Si</span></h4>';
                                }
                            }
                            }
                        ]
                    });
                }
            }
        });
    }

    if ($('#invioEvento').prop('checked') === false && $('#invioNotainformativa').prop('checked') === false) {
        $('#hideInfo').hide();
        $('#conteinerHideEvento').hide();
        $('#nascondiDataInvio').hide();
        $('#tabellaNotifiche').dataTable().hide();
        $('#tabellaNotifiche').dataTable().fnDestroy();
        $('#tabellaNotifiche').dataTable().fnClearTable();
    }

    if ($('#invioEvento').prop('checked') === true && $('#invioNotainformativa').prop('checked') === true) {

        $('#hideInfo').show();
        $('#conteinerHideEvento').hide();
        $('#nascondiDataInvio').hide();
        $('#tabellaNotifiche').dataTable().hide();
        $('#tabellaNotifiche').dataTable().fnDestroy();
        $('#tabellaNotifiche').dataTable().fnClearTable();

    }
}