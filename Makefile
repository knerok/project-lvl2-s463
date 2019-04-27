install: install-deps

install-deps:
	npm install

publish:
	npm publish

lint:
	npx eslint .

test:
	npm test