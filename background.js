function saveSettings(name, settings) {
     localStorage[name] = JSON.stringify(settings);
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
