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
                });
				
				formatting.addButtonDispatch('blur', function (textarea) {
                        controls.insertIntoTextarea(textarea, "[blur]" + strings.blur + "[/blur]");
                });
				
				formatting.addButtonDispatch('color', function (textarea) {
                        controls.insertIntoTextarea(textarea, "[color=blue]" + strings.color + "[/color]");
                });
				
				formatting.addButtonDispatch('imgsize', function (textarea) {
                        controls.insertIntoTextarea(textarea, "[image=100px]" + "+" + strings.imgsize + "+");
                });
				
                formatting.addButtonDispatch('spoiler', function (textearea) {
                        controls.insertIntoTextarea(textearea, "|| " + strings.spoiler_title + " || " + strings.spoiler_text + " ||");
                });
            });
        }
    };
    
});