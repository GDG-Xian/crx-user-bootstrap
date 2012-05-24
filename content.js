function getSetting() {
    var css = $("#components.download input:checked").map(function () { return this.value }).toArray();
    var js = $("#plugins.download input:checked").map(function () { return this.value }).toArray();
    var vars = {};

    $("#variables.download input").each(function () {
        $(this).val() && (vars[ $(this).prev().text() ] = $(this).val())
    });
    
    return { 'js': js, 'css': css, 'vars': vars};
}

chrome.extension.onRequest.addListener(function(request, sender, sendResponse) {
    console.log(request);
    console.log(sender);
    sendResponse(getSetting());
});

