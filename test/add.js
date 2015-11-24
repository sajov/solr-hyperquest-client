'use strict';
var util = require('util');
var Solr = require('../index');
var Query = Solr.Query;
var should = require('should');

var client = {};

describe('Client ', function() {

    before(function() {
        client = new Solr.Client({
            host: 'localhost',
            port: '8983',
            instance: 'solr',
            core: 'schemaless'
        });
    });

    describe('coreCreate schemaless', function() {
        it('responseHeader should return status:0', function(done) {
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
                    // console.log('coreCreate'.yellow, err, inspect(data));
                    data.responseHeader.status.should.be.equal(0);
                    data.core.should.be.equal('schemaless');
                    done();
                });
        });
    });

    describe('addDoc', function() {
        it('responseHeader should return status:0', function(done) {
            client.addDoc({
                commit: true
                // softCommit: true
            }, [{
                name: 'test',
                age: 34
            }], function(err, data) {
                data.responseHeader.status.should.be.equal(0);
                done();
            });

        });
    });

    describe('get', function() {
        it('responseHeader response numFound return numFound:1', function(done) {
            var query = new Query({
                where: {
                    name: 'test'
                }
            });
            client.find(query.queryUri, function(err, data) {
                data.response.numFound.should.be.equal(1);
                done();
            });

        });
    });

    describe('coreUnload schemaless', function() {
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


var Solr = require('../index');
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
client.find(query.queryUri, function(err, data) {
    data.response.numFound.should.be.equal(1);
    done();
});