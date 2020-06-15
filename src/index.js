#!/usr/bin/env node

const got = require('got');
const fs = require('fs');
const readingPlan = require('./data.json')
const books = require('./books.json');

async function writeSection(book, chapters, file) {

    let range = [];
    for(var i = chapters[0]; i < chapters[1] + 1; i++){
        range.push(i);
    }

    fs.appendFileSync(file, `\n\n<span class="beta"> ${books[book - 1]} </span>`);

    for (const chapter in range) {
        let url = `https://getbible.net/v2/web/${book}/${range[chapter]}.json`
        await got(url, { responseType: 'json'}).then(response => {

            fs.appendFileSync(file, '\n\n<span class="chapter-number">' + range[chapter] + '</span> ');
            let json = response.body;

            json.verses.forEach(verse => {
                // Remove the notes ?
                let regex = /(\/f(.*)\/f\*)/g;

                fs.appendFileSync(file, verse.text.replace(/^\s+/g, '').replace(regex, '') + '\r\n');
            });

        }).catch(error => {
            console.log('error')
        });
    }
}

async function getDay(sections, file) {
    console.log(file);
    for (let section in sections) {
        let data = sections[section];
        await writeSection(data.book, data.chapters, file);
    }
}

async function getSummary(sections, file) {
    for (let section in sections) {
        let data = sections[section];
        fs.appendFileSync(file,  `_${books[data.book - 1]} ${data.chapters[0]} - ${data.chapters[1]}_ <br />`);
    }
}

async function init() {
    var dir = './tmp';
    if (!fs.existsSync(dir)){
        fs.mkdirSync(dir);
    }

    for (let plan in readingPlan) {
        let day = readingPlan[plan];

        let file = `${dir}/${day.id}.md`;

        fs.writeFileSync(file, '', () => {});
        fs.appendFileSync(file,  `# ${day.title} \n\n`);

        // Here we want to print the reading list for that day
        await getSummary(day.sections, file);

        await getDay(day.sections, file);
    }
}

init();
