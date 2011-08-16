$(document).ready(function() {
                /*var oTable = $('#example').dataTable({
                    "bSortClasses": false
                });*/
                var oTable = $('#example').dataTable({
                    "bSortClasses": false,
                    "bPaginate": false,
                    "bLengthChange": false,
                    "bFilter": true,
                    "bSort": false,
                    "bInfo": false,
                    "bAutoWidth": false,
                    "sScrollX": "100%",
                    "sScrollY": "500px",
                });
                for (i = 0; i < 3; i++) {
                    oTable.fnAddData([i+".1", i+".2", i+".3", i+".4"]);
                }
                $('td', oTable.fnGetNodes()).hover(function() {
                    var iFirstTdId = $('td').index(oTable.fnGetNodes(0).children[0]);
                    // 4 - column number, -1 - because of VK login button, i guess it creates td
                    var iCol = ($('td').index(this) - iFirstTdId) % 4;
                    var nTrs = oTable.fnGetNodes();
                    $('td:nth-child(' + (iCol + 1) + ')', nTrs).addClass('highlighted');
                }, function() {
                    $('td.highlighted', oTable.fnGetNodes()).removeClass('highlighted');
                });
            });