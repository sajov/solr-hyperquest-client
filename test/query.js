'use strict';
var util = require('util');
var Solr = require('../index');
var Query = Solr.Query;
var should = require('should');

var client = {};

describe('Client query', function() {

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
                name: 'foo',
                age: 34
            }, {
                name: 'foo bar',
                age: 32
            }, {
                name: 'super bar',
                age: 32
            }], function(err, data) {
                data.responseHeader.status.should.be.equal(0);
                done();
            });

        });
    });

    describe('Query ', function() {
        it('{where:{q:foo}} => q=foo | shoud return 2 docs', function(done) {
            var query = new Query({
                where: {
                    q: 'foo'
                }
            });
            client.find(query.queryUri, function(err, data) {
                data.response.numFound.should.be.equal(2);
                done();
            });
        });
    });

    describe('Query ', function() {
        it('{where:{q:foo bar}} => q=foo bar | shoud return 3 docs', function(done) {
            var query = new Query({
                where: {
                    q: 'foo bar'
                }
            });
            client.find(query.queryUri, function(err, data) {
                data.response.numFound.should.be.equal(3);
                done();
            });
        });
    });

    describe('Query ', function() {
        it('{where:{q:[foo, bar]}} => q=foo bar | shoud return 3 docs', function(done) {
            var query = new Query({
                where: {
                    q: ['foo', 'bar']
                }
            });
            client.find(query.queryUri, function(err, data) {
                data.response.numFound.should.be.equal(3);
                done();
            });
        });
    });

    describe('Query ', function() {
        it('{where:{q:[foo, super bar]}} => q=foo "super bar | shoud return 3 docs"', function(done) {
            var query = new Query({
                where: {
                    q: ['foo', 'super bar']
                }
            });
            client.find(query.queryUri, function(err, data) {
                data.response.numFound.should.be.equal(3);
                done();
            });
        });
    });



    // describe('Query ', function() {
    //     it('{where:{q:[{name:"foo"},{"!":"super bar"}]}} => q=foo | shoud return 2 docs', function(done) {
    //         var query = new Query({
    //             where: {
    //                 q: [{
    //                     name: 'foo'
    //                 }, {
    //                     '!': 'super bar'
    //                 }]
    //             }
    //         });
    //         client.find(query.queryUri, function(err, data) {
    //             console.log(query.queryUri, data, err);
    //             data.response.numFound.should.be.equal(2);
    //             done();
    //         });
    //     });
    // });


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