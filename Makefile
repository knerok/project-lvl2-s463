install: install-deps

install-deps:
	sudo npm install

publish:
	npm publish

lint:
	npx eslint .

test:
	npm test