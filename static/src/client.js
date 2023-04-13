"use strict";

/* global $ */

$(document).ready(function () {
    var MagicButton = {};



    $(window).on('action:composer.enhanced', function (evt, data) {
        MagicButton.prepareFormattingTools();
    });

    MagicButton.prepareFormattingTools = async function () {
        const [formatting, controls, translator] = await app.require(['composer/formatting', 'composer/controls', 'translator']);
        if (formatting && controls) {
            // params is (language, namespace, callback)
            translator.getTranslations(window.config.userLang || window.config.defaultLang, 'magicbutton', function (strings) {
                
				formatting.addButtonDispatch('table', function (textarea) {
                    
                        controls.insertIntoTextarea(textarea, "\n| Syntax | Description | \n| --- | --- | \n| Header | Title | \n| Paragraph | Text | \n\n\n");
                        controls.updateTextareaSelection(textarea);
                    
                });
				
				formatting.addButtonDispatch('blur', function (textarea, selectionStart, selectionEnd) {
                    if (selectionStart === selectionEnd) {
                        controls.insertIntoTextarea(textarea, "=" + strings.blur + "=");
                        controls.updateTextareaSelection(textarea, selectionStart + 1, selectionStart + 1 + strings.blur.length);
                    } else {
                        controls.wrapSelectionInTextareaWith(textarea, "=", "=");
                        controls.updateTextareaSelection(textarea, selectionStart + 1, selectionEnd + 1);
                    }
                });
				
                formatting.addButtonDispatch('spoiler', function (textearea, selectionStart, selectionEnd) {
                    if (selectionStart === selectionEnd) {
                        controls.insertIntoTextarea(textearea, "|| " + strings.spoiler_title + " || " + strings.spoiler_text + " ||");
                        controls.updateTextareaSelection(textearea, selectionStart + 2, selectionStart + 2 + strings.spoiler_text.length);
                    } else {
                        controls.wrapSelectionInTextareaWith(textearea, "||", "||", "||");
                        controls.updateTextareaSelection(textearea, selectionStart + 2, selectionEnd + 2);
                    }
                });
            });
        }
    };

    
});