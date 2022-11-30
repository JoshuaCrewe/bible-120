all:
	mkdir ./tmp
	./src/index.js
	pandoc -o ./build/bible-120.epub -f markdown-smart ./tmp/*.md --metadata title="Bible in 120 Days" --css ./src/style.css
	rm -r ./tmp
