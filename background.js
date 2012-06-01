chrome.extension.onRequest.addListener(
    function(request, sender, sendResponse) {
        // If a bootstrap customize page is actived
        // show page action icons in its location bar.
        if (sender.tab && request.type == 'init') {
            chrome.pageAction.show(sender.tab.id);
        }
    }
);

function saveSettings(name, settings) {
     localStorage[name] = JSON.stringify(settings);
}

function removeSettings(name) {
    delete localStorage[name];
}

function getSettings(name) {
    return JSON.parse(localStorage[name]);
}

function getSettingNames() {
    var names = [];
    for (var name in localStorage) {
        names.push(name);
    }
    return names;
}
