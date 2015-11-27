# solr-hyperquest-client

[![Build Status](https://travis-ci.org/sajov/solr-hyperquest-client.svg?branch=master)](https://travis-ci.org/sajov/solr-hyperquest-client)
[![Coverage Status](https://coveralls.io/repos/sajov/solr-hyperquest-client/badge.svg?branch=master&service=github)](https://coveralls.io/github/sajov/solr-hyperquest-client?branch=master)

[![NPM](https://nodei.co/npm/solr-hyperquest-client.png?downloads=true&stars=true)](https://nodei.co/npm/solr-hyperquest-client/)

Build and used for a real world application (under heavy development).
This client is also used for an up coming waterline adapter [sails-solr](https://github.com/sajov/sails-solr).

## Features
- raw query get, post, put, delete
- [Query builder](https://github.com/sajov/solr-hyperquest-client#query-builder-orm)
- extendable

## Solr support
- [Add Data](https://cwiki.apache.org/confluence/display/solr/Uploading+Data+with+Index+Handlers)
- [Query](https://cwiki.apache.org/confluence/display/solr/The+Standard+Query+Parser)
- [CoreAdmin API](https://cwiki.apache.org/confluence/display/solr/CoreAdmin+API)
- [Schema API](https://cwiki.apache.org/confluence/display/solr/Schema+API)
- [Index Replication](https://cwiki.apache.org/confluence/display/solr/Index+Replication)
- [Collections API](https://cwiki.apache.org/confluence/display/solr/Collections+API)
- [SystemInformationRequestHandlers](https://wiki.apache.org/solr/SystemInformationRequestHandlers)

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
    core: 'schemaless'
});

// Create a solr core (optional you take complete control managing solr)
client.coreCreate({
        action: 'CREATE',
        name: 'schemaless',
        loadOnStartup: true,
        instanceDir: 'schemaless',
        configSet: 'data_driven_schema_configs',
        config: 'solrconfig.xml',
        schema: 'schema.xml',
        dataDir: 'data'
    },
    function(err, data) {
        if (err) {
            console.log(err);
        } else {
            console.log('Solr response:', response);
        }
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