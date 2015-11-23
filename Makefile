
TESTS = test
REPORTER = spec
XML_FILE = reports/TEST-all.xml
HTML_FILE = reports/coverage.html

test: test-mocha

test-mocha:
	@NODE_ENV=test mocha \
	    --timeout 2000 \
		--reporter $(REPORTER) \
		$(TESTS)

test-cov: istanbul

istanbul:
	istanbul cover _mocha -- -R spec test

coveralls:
	cat ./coverage/lcov.info | ./node_modules/coveralls/bin/coveralls.js

cov-html: test-cov html-cov-report

html-cov-report:
	istanbul report html

npm:
	npm publish ./

check:
	travis-lint .travis.yml

clean:
	rm -rf ./coverage