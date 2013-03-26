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
    window.webkitRequestFileSystem(window.TEMPORARY, 1024 * 1024, function(fs) {
        fs.root.getFile('bootstrap-settings.json', {create: true}, function(fileEntry) {
            fileEntry.createWriter(function(fileWriter) {
                var builder = new WebKitBlobBuilder();
                
                // Read all settings
                var settingsList = {};
                for (var name in localStorage) {
                    settingsList[name] = getSettings(name);
                }

                // Write settings as json
                builder.append(JSON.stringify(settingsList));

                console.log('Writing bootstrap-settings.json');
                var blob = builder.getBlob('text/plain');
                fileWriter.onwriteend = function() {
                    chrome.tabs.create({ "url":fileEntry.toURL(), 'selected': false });
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

  console.Log('Error: ' + msg);
}
