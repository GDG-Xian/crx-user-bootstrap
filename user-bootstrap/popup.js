var background = chrome.extension.getBackgroundPage();
$(function() {
    function showMessage(level, msg) {
        var message = $('#message');
        message.attr('class', 'alert alert-' + level);
        message.html(msg);
        message.fadeIn().delay(2000).fadeOut();
    }

    function isConfigExists(name) {
        var exists = false;
        $('.name').each(function() {
            if ($.trim($(this).text()) == name) {
                exists = true;
                return false;
            }
        });
        return exists;
    }

    function saveCurrentSettings(name) {
        chrome.tabs.getSelected(function(tab) {
            chrome.tabs.sendMessage(tab.id, {type: "save"}, function(response) {
                background.saveSettings(name, response.settings);
                if (!isConfigExists(name)) {
                    $("#tpl-cfg-item").mustache({ name: name }).appendTo("#cfg-list");
                }
                showMessage('success', '<strong>' + name + '</strong> saved.');
            });
        })       
    }

    $('#btn-save').click(function() {
        var name = $.trim($('#name').val());
        if (name == '') {
            showMessage('error', 'Name is required.');
        } else {
            saveCurrentSettings(name);
        }
    });

    $(".action-save").live("click", function() {
        var name = $.trim($(this).nextAll('.name').text());
        saveCurrentSettings(name);
    }); 

    $(".action-apply").live("click", function(){ 
        var name = $.trim($(this).nextAll('.name').text());
        var settings = background.getSettings(name);
        chrome.tabs.getSelected(function(tab) {
            chrome.tabs.sendMessage(tab.id, { type: "apply", name: name, settings: settings }, function(response) {
                showMessage('success', '<strong>' + name + '</strong> applied.');
            });
        });
    }); 

    $('.action-remove').live('click', function() {
        var name = $.trim($(this).nextAll('.name').text());
        background.removeSettings(name);
        $(this).parents('li').fadeOut().remove();
        showMessage('success', '<strong>' + name + '</strong> removed.');
    });

    $('.action-export').click(function() {
        background.exportSettings();
    });

    $('.action-import').click(function() {
        $('#import-field').trigger('click');
    });

    var names = background.getSettingNames();
    for (var i = 0; i < names.length; i++) {
        $("#tpl-cfg-item").mustache({ name: names[i] }).appendTo("#cfg-list");
    }

    $('#name').focus();
}); 
