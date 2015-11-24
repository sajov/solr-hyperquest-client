# solr-hyperquest-client

[![Build Status](https://travis-ci.org/sajov/solr-hyperquest-client.svg?branch=master)](https://travis-ci.org/sajov/solr-hyperquest-client)
[![Coverage Status](https://coveralls.io/repos/sajov/solr-hyperquest-client/badge.svg?branch=master&service=github)](https://coveralls.io/github/sajov/solr-hyperquest-client?branch=master)

[![NPM](https://nodei.co/npm/solr-hyperquest-client.png?downloads=true&stars=true)](https://nodei.co/npm/solr-hyperquest-client/)

this is a early development state and under heavy development.

## Installation

Add this line to your application's Gemfile:

```js
npm install solr-hyperquest-client --save
```

## Usage

```js
// Load dependency
var Solr = require('solr-hyperquest-client');

// Create a client
var client = new Solr.Client({
    host: 'localhost',
    port: '8983',
    instance: 'solr',
    core: 'gettingstarted'
});

// Add a new document
client.add({name: 'foo'},function(err,obj){
   if(err){
      console.log(err);
   }else{
      console.log('Solr response:', obj);
   }
});

// Get the new document
client.get({name: foo},function(err, data) {});
```

## Features
- update
- search
- system Api
- core Api
- schema Api

##Documentation
coming soon...

## TODO's
1. add more tests
2. write documentation


## Contributing

1. Fork it ( https://github.com/sajov/solr-hyperquest-client/fork )
2. Create your feature branch (`git checkout -b my-new-feature`)
3. Commit your changes (`git commit -am 'Add some feature'`)
4. Push to the branch (`git push origin my-new-feature`)
5. Create a new Pull Request