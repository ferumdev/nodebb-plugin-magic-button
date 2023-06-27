'use strict';

const slugify = require.main.require('./src/slugify');
const crypto = require('crypto');

const btnRegex = /\[btn=(.+?)=(.+?)\](.+?)\[\/btn\]/g;
const blurRegex = /\[blur\](.+?)\[\/blur\]/g;
const colorRegex = /\[color=(.+?)\](.+?)\[\/color\]/g;
const imgsizeRegex = /\[image=([0-9]+)px\](?:\+)(.+?)(\+)/g;
const spoilerRegex = /(?:<p dir="auto">)(?:\|\|)([^]*?)(?:\|\|)([^]*?)(?:\|\|)(?:<\/p>)/g;

const MagicButton = {
    // post
    async parsePost(data) {
        if (data && data.postData && data.postData.content) {
			data.postData.content = applyBtn(data.postData.content);
			data.postData.content = applyBlur(data.postData.content);
			data.postData.content = applyColor(data.postData.content);
			data.postData.content = applyImgsize(data.postData.content);
            data.postData.content = await applySpoiler(data.postData.content, data.postData.pid);
        }
        return data;
    },

    // direct preview in editor
    parseRaw(data, callback) {
        if (data) {
			data = applyBtn(data);
			data = applyBlur(data);
			data = applyColor(data);
			data = applyImgsize(data);
            data = applySpoiler(data, "");
        }
        callback(null, data);
    },
    registerFormatting(payload, callback) {
        const formatting = [
            { name: "spoiler", className: "fa fa-square-caret-right", title: "[[magicbutton:composer.formatting.spoiler]]" },
			{ name: "blur", className: "fa fa-wand-magic-sparkles", title: "[[magicbutton:composer.formatting.blur]]" },
			{ name: "color", className: "fa fa-palette", title: "[[magicbutton:composer.formatting.color]]" },
			{ name: "imgsize", className: "fa fa-images", title: "[[magicbutton:composer.formatting.imgsize]]" },
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

function applyBtn(textContent) {
    if (textContent.match(btnRegex)) {
        textContent = textContent.replace(btnRegex, function (match, url, text, title) {
            return `<a class="btn btn-sm btn-light border-0 shadow-none mt-1 mb-1 me-2 fw-semibold" name="${title}" href="${url}" role="button"><i class="${text}"></i> ${title}</a>`;
        });
    }

    return textContent;
}

function applyBlur(textContent) {
    if (textContent.match(blurRegex)) {
        textContent = textContent.replace(blurRegex, function (match, text) {
            return `<span class="blur-text">${text}</span>`;
        });
    }

    return textContent;
}

function applyColor(textContent) {
    if (textContent.match(colorRegex)) {
        textContent = textContent.replace(colorRegex, function (match, color, text) {
            return `<span style="color:${color};">${text}</span>`;
        });
    }

    return textContent;
}

function applyImgsize(textContent) {
    if (textContent.match(imgsizeRegex)) {
        textContent = textContent.replace(imgsizeRegex, function (match, title, text) {
            return `<img src="${text}" style="width:${title}px">`;
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