#!/usr/bin/env node

const got = require('got');
const fs = require('fs');
const readingPlan = require('./data.json')

const books = [
    "genesis",
    "exodus",
    "leviticus",
    "numbers",
    "deuteronomy",
    "joshua",
    "judges",
    "ruth",
    "1st Samuel",
    "2nd Samuel",
    "1st Kings",
    "2nd Kings",
    "1st Chronicles",
    "2nd Chronicles",
    "ezra",
    "nehemiah",
    "esther",
    "job",
    "psalms",
    "proverbs",
    "ecclesiastes",
    "song of Solomon",
    "isaiah",
    "jeremiah",
    "lamentations",
    "ezekiel",
    "daniel",
    "hosea",
    "joel",
    "amos",
    "obadiah",
    "jonah",
    "micah",
    "nahum",
    "habakkuk",
    "zephaniah",
    "haggai",
    "zechariah",
    "malachi",
    "matthew",
    "mark",
    "luke",
    "john",
    "acts",
    "romans",
    "1st Corinthians",
    "2nd Corinthians",
    "galatians",
    "ephesians",
    "philippians",
    "colossians",
    "1st Thessalonians",
    "2nd Thessalonians",
    "1st Timothy",
    "2nd Timothy",
    "titus",
    "philemon",
    "hebrews",
    "james",
    "1st Peter",
    "2nd Peter",
    "1st John",
    "2nd John",
    "3rd John",
    "jude",
    "revelation"
];

async function writeSection(book, chapters, file) {

    let range = [];
    for(var i = chapters[0]; i < chapters[1] + 1; i++){
        range.push(i);
    }

    fs.appendFileSync(file, `\n## ${book} ${chapters[0]}-${chapters[1]}`);

    let index = books.indexOf(book) + 1;

    for (const chapter in range) {
        let url = `https://getbible.net/v2/web/${index}/${range[chapter]}.json`
        await got(url, { responseType: 'json'}).then(response => {

            fs.appendFileSync(file, '\n\n**' + book + range[chapter] + '**\n\n');
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

async function doThis(sections, file) {
    for (let section in sections) {
        let data = sections[section];
        await writeSection(data.book, data.chapters, file);
    }

}

async function goOn() {
    var dir = './tmp';
    if (!fs.existsSync(dir)){
        fs.mkdirSync(dir);
    }

    for (let plan in readingPlan) {
        let day = readingPlan[plan];

        let file = `${dir}/${day.id}.md`;

        fs.writeFile(file, '', () => {});
        fs.appendFileSync(file,  `# ${day.title} \n\n`);


        await doThis(day.sections, file);
    }
}

goOn();
