'use strict';
var util = require('util');
var Solr = require('../index');
var should = require('should');

var client = {};

function importTest(name, path) {
    describe(name, function() {
        require(path);
    });
}

describe('solr-hyperquest-client test/', function() {

    before(function() {
        client = new Solr.Client({
            host: 'localhost',
            port: '8983',
            instance: 'solr',
            core: 'schemaless'
        });
    });


    importTest("queryBuilder.js", './queryBuilder');

    importTest("query.js", './query');

    importTest("add.js", './add');

    importTest("coreApi.js", './coreApi');

    importTest("schemaApi.js", './schemaApi');

    importTest("systemApi.js", './systemApi');

    importTest("replicationApi.js", './replicationApi');

    //TODO: add sharding test
    // importTest("shardingApi.js", './shardingApi');

});



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