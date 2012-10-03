function showProgressBar(onClose) {
    console.time('loading');
    $('#progressBar').progressbar({value:0});
    $( "#progressDialog" ).dialog({
        height: 90,
        width: 500,
        modal: true,
        draggable: false,
        resizable: false,
        close: onClose
    });
}

function hideProgressBar() {
    console.timeEnd('loading');
    $( "#progressDialog" ).dialog("close");
}

function calcProgress(current, total) {
    if (current <= total) {
        var factor = current/total,
            pct = Math.ceil(factor * 100);
        $('#progressBar').progressbar({value:pct});
    }
}