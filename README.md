# solr-hyperquest-client

[![Build Status](https://travis-ci.org/sajov/solr-hyperquest-client.svg?branch=master)](https://travis-ci.org/sajov/solr-hyperquest-client)
[![Coverage Status](https://coveralls.io/repos/sajov/solr-hyperquest-client/badge.svg?branch=master&service=github)](https://coveralls.io/github/sajov/solr-hyperquest-client?branch=master)

[![NPM](https://nodei.co/npm/solr-hyperquest-client.png?downloads=true&stars=true)](https://nodei.co/npm/solr-hyperquest-client/)

Build and used for a real world application (under heavy development).
This client is also used for an up coming waterline adapter [sails-solr](https://github.com/sajov/sails-solr).

## Installation
```js
npm install solr-hyperquest-client --save
```

## Solr kick start
```
node_modules/solr-hyperquest-client/bin/install-solr.sh
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
client.add({name: 'foo'},function(err,response){
   if(err){
      console.log(err);
   }else{
      console.log('Solr response:', response);
   }
});

// Get the new document
client.find('q=foo',function(err, response) {
   if(err){
      console.log(err);
   }else{
      console.log('Solr response:', response);
   }
});
```

## Features
- raw query get, post, put, delete
- query builder
- extendable

## Solr support
- add
- search
- [CoreAdmin API](https://cwiki.apache.org/confluence/display/solr/CoreAdmin+API)
- [Schema API](https://cwiki.apache.org/confluence/display/solr/Schema+API)
- replication API
- [Collections API](https://cwiki.apache.org/confluence/display/solr/Collections+API)
- [SystemInformationRequestHandlers](https://wiki.apache.org/solr/SystemInformationRequestHandlers)

## Query builder (ORM)
inspired by [waterline](https://github.com/balderdashy/waterline-docs/blob/master/queries/query-language.md#query-language-basics)

```js
var Solr = require('solr-hyperquest-client');
var Query = Solr.Query;

var client = new Solr.Client({
    host: 'localhost',
    port: '8983',
    instance: 'solr',
    core: 'schemaless'
});

var query = new Query({
    where: {
        name: 'foo'
    },
    skip: 0,
    limit: 10,
    sort: 'name DESC',
    select: ['name']
});

client.find(query.queryUri, function(err, response) {
   if(err){
      console.log(err);
   }else{
      console.log('Solr response:', response);
   }
});
```


## Documentation
coming soon... 
see tests for further

## Testing
```
make test
```

## TODO's
1. add more tests
2. write documentation

## Contributing
1. Fork it ( https://github.com/sajov/solr-hyperquest-client/fork )
2. Create your feature branch (`git checkout -b my-new-feature`)
3. Commit your changes (`git commit -am 'Add some feature'`)
4. Push to the branch (`git push origin my-new-feature`)
5. Create a new Pull Request