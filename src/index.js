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

    fs.appendFileSync(file, `\n## ${books[book - 1]} ${chapters[0]}-${chapters[1]}`);

    for (const chapter in range) {
        let url = `https://getbible.net/v2/web/${book}/${range[chapter]}.json`
        await got(url, { responseType: 'json'}).then(response => {

            fs.appendFileSync(file, '\n\n**' + range[chapter] + '**\n\n');
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
    for (let section in sections) {
        let data = sections[section];
        await writeSection(data.book, data.chapters, file);
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

        fs.writeFile(file, '', () => {});
        fs.appendFileSync(file,  `# ${day.title} \n\n`);

        await getDay(day.sections, file);
    }
}

init();
