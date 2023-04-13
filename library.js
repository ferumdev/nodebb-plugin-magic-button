'use strict';

const slugify = require.main.require('./src/slugify');
const crypto = require('crypto');

const blurRegex = /(?:<p dir="auto">)(?:\=)([^]*?)(?:\=)(?:<\/p>)/g;
const spoilerRegex = /(?:<p dir="auto">)(?:\|\|)([^]*?)(?:\|\|)([^]*?)(?:\|\|)(?:<\/p>)/g;



const MagicButton = {
    // post
    async parsePost(data) {
        if (data && data.postData && data.postData.content) {
			data.postData.content = applyMagicButton(data.postData.content);
            data.postData.content = await applySpoiler(data.postData.content, data.postData.pid);
        }
        return data;
    },

    // direct preview in editor
    parseRaw(data, callback) {
        if (data) {
			data = applyMagicButton(data);
            data = applySpoiler(data, "");
        }
        callback(null, data);
    },
    registerFormatting(payload, callback) {
        const formatting = [
            { name: "spoiler", className: "fa fa-square-caret-right", title: "[[magicbutton:composer.formatting.spoiler]]" },
			{ name: "blur", className: "fa fa-wand-magic-sparkles", title: "[[magicbutton:composer.formatting.blur]]" },
			{ name: "table", className: "fa fa-table", title: "[[magicbutton:composer.formatting.table]]" },
        ];

        payload.options = payload.options.concat(formatting);

        callback(null, payload);
    },
    async sanitizerConfig(config) {
        config.allowedAttributes['a'].push('name');
        return config;
    }
};

function applyMagicButton(textContent) {
    if (textContent.match(blurRegex)) {
        textContent = textContent.replace(blurRegex, function (match, text) {
            return `<span class="blur-text">${text}</span>`;
        });
    }

    return textContent;
}

async function applySpoiler(textContent, id) {
    if (textContent.match(spoilerRegex)) {
        const hash = id.toString('16');
        let count = 0;
        textContent = textContent.replace(spoilerRegex, (match, title, text) => {
		const spoilerButton = `<p><button class="btn-ghost" name="spoiler" type="button" data-bs-toggle="collapse" data-bs-target="#spoiler-${count + hash}" aria-expanded="false" aria-controls="spoiler-${count + hash}" aria-controls="collapse"><i class="fa fa-caret-right spoiler-button"></i> ${title}</button>`;
		const spoilerContent = `<div class="collapse" id="spoiler-${count + hash}"><div class="card card-body spoiler">${text}</div></div></p>`;
            count++;
            return spoilerButton + spoilerContent;
        });
    }
    return textContent;
}

module.exports = MagicButton;