function getParameterByName(name) {
    name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
    var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
        results = regex.exec(location.search);
    return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
}

function addNewElements(data, elemName, parentElementId) {
    var elem = $('#' + elemName + data.id);
    if (elem.length == 0) {
        var parent = $("#" + parentElementId);
        parent.prepend(data.htmlContent);
        $('#' + elemName + data.id).fadeIn(500);
    } else {
        elem.fadeOut(500);
        elem.replaceWith(data.htmlContent);
        $('#' + elemName + data.id).fadeIn(500);
    }
}