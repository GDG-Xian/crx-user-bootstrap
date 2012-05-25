chrome.extension.onRequest.addListener(function(request, sender, sendResponse) {
    if (request.type == 'save') {
        sendResponse({ settings: getSettings() });
    } else if (request.type == 'apply') {
        applySettings(request.settings);
    }
});

// Get current bootstrap customize settings
function getSettings() {
    var components = {};
    $('#components label.checkbox input[type=checkbox]').each(function() {
        components[$.trim($(this).parent().text())] = $(this).attr('checked');
    });

    var plugins = {};
    $('#plugins label.checkbox input[type=checkbox]').each(function() {
        plugins[$.trim($(this).parent().text())] = $(this).attr('checked');
    });

    var variables = {};
    $('#variables input[type=text]').each(function() {
        var value = $.trim($(this).val());
        variables[$(this).prev('label').text()] = value; 
    });

    return { 
        'components': components, 
        'plugins': plugins,
        'variables': variables
    };
}

// Restore setting to current bootstrap customize page
function applySettings(settings) {
    // Restore components settings
    $('#components label.checkbox input[type=checkbox]').each(function() {
        var checked = settings['components'][$.trim($(this).parent().text())];
        $(this).attr('checked', checked);
    });

    // Restore plugins settings
    $('#plugins label.checkbox input[type=checkbox]').each(function() {
        var checked = settings['plugins'][$.trim($(this).parent().text())];
        $(this).attr('checked', checked);
    });
   
    // Restore variables settings
    $('#variables input[type=text]').each(function() {
        var key = $.trim($(this).prev('label').text());
        var val = settings['variables'][key];
        if (val) {
            $(this).val(val);        
        }
    });
}
