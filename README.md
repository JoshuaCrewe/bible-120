# Bible in 120 days ebook

[Creating ePub with pandoc](https://pandoc.org/epub.html)

[Source text](https://worldenglish.bible/)

[Source API](https://github.com/getbible/v2)

`pandoc -o ./build/bible-120.epub -f markdown-smart ./tmp/*.md --metadata title="Bible in 120 Days" --css ./src/style.css`

@TODO

[ ] - Automate ebook creation
[X] - Add styles to pandoc when creating ebook
[X] - Add a summary of the days plan
[ ] - Add full reading plan data
