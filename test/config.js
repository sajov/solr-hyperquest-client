'use strict';
var util = require('util');
var Solr = require('../index');
var should = require('should');
var client = {};

function inspect(data) {
    return util.inspect(data, false, 10, true);
}

describe('Test configSet', function() {
    before(function() {
        client = new Solr.Client({
            host: 'localhost',
            port: '8983',
            instance: 'solr',
            core: 'schemaless'
        });
    });


    describe('Client coreCreate schemaless', function() {
        this.timeout(5000);
        it('responseHeader should return status:0', function(done) {
            client.coreCreate({
                    action: 'CREATE',
                    name: 'schemaless',
                    loadOnStartup: true,
                    instanceDir: 'schemaless',
                    configSet: 'data_driven_schema_configs',
                    config: 'solrconfig.xml',
                    schema: 'schema.xml',
                    persist: true,
                    // config: '../gettingstarted/config/solrconfig.xml',
                    // schema: '../gettingstarted/config/schema.xml',
                    dataDir: 'data'
                },
                function(err, data) {
                    // console.log('coreCreate'.yellow, err, inspect(data));
                    data.responseHeader.status.should.be.equal(0);
                    data.core.should.be.equal('schemaless');
                    done();
                });
        });
    });



    describe('get config list', function() {
        this.timeout(5000);
        it('responseHeader should return status:0', function(done) {
                    // 'configSetProp.name':value
            client.getConfig({
                },
                function(err, data) {
                    console.log('get config'.yellow, err, inspect(data));
                    // data.responseHeader.status.should.be.equal(0);
                    // data.core.should.be.equal('schemaless');
                    done();
                });
        });
    });

    describe('Client coreUnload schemaless', function() {
        it('responseHeader should return status:0', function(done) {
            client.coreUnload({
                    action: 'UNLOAD',
                    'core': 'schemaless',
                    'deleteIndex': true
                },
                function(err, data) {
                    // console.log('coreUnload'.yellow,err,inspect(data));
                    data.responseHeader.status.should.be.equal(0);
                    done();
                });
        });
    });
});
