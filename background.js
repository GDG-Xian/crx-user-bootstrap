function saveSettings(name, settings) {
     localStorage[name] = JSON.stringify(settings);
}

function getSettingNames() {
    var names = [];
    for (var name in localStorage) {
        names.push(name);
    }
    return names;
}
