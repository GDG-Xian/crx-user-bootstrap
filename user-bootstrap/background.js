chrome.extension.onMessage.addListener(
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

// Export File
function exportSettings() {
    console.log('Exporting user configurations...')
    window.webkitRequestFileSystem(window.TEMPORARY, 1024 * 1024, function(fs) {
        fs.root.getFile('bootstrap-settings.json', {create: true}, function(fileEntry) {
            fileEntry.createWriter(function(fileWriter) {
                // Read all settings
                var settingsList = {};
                for (var name in localStorage) {
                    settingsList[name] = getSettings(name);
                }

                // TODO: Auto download file instead of opening a text page.
                console.log('  Creating bootstrap-settings.json');
                var blob = new Blob([JSON.stringify(settingsList)], {type: "application/json"});
                fileWriter.onwriteend = function() {
                    console.log('  File created, start downloading..')
                    chrome.tabs.create({"url": fileEntry.toURL(), 'selected': true });
                };
                fileWriter.write(blob);
            }, fsErrorHandler);
        }, fsErrorHandler);
    }, fsErrorHandler);
}

// webkitRequestFileSystem Error Handler
function fsErrorHandler(e) {
  var msg = '';

  switch (e.code) {
    case FileError.QUOTA_EXCEEDED_ERR:
      msg = 'QUOTA_EXCEEDED_ERR';
      break;
    case FileError.NOT_FOUND_ERR:
      msg = 'NOT_FOUND_ERR';
      break;
    case FileError.SECURITY_ERR:
      msg = 'SECURITY_ERR';
      break;
    case FileError.INVALID_MODIFICATION_ERR:
      msg = 'INVALID_MODIFICATION_ERR';
      break;
    case FileError.INVALID_STATE_ERR:
      msg = 'INVALID_STATE_ERR';
      break;
    default:
      msg = 'Unknown Error';
      break;
  };

  console.error('Error: ' + msg);
}
