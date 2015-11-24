/**
 * @apiName SolrHyperquest
 * @apiVersion 0.1.1
 */

'use strict';
var util = require('util');
var Solr = require('../index');
var should = require('should');

var client = new Solr.Client({
    host: 'localhost',
    port: '8983',
    instance: 'solr',
    core: 'schemaless'
});

// var client = new Solr.Client({
//   host: 'srv2.sajo-media.de',
//   port: '8080',
//   instance: 'solr-50/',
//   core: 'cmt'
// });

function inspect(data) {
    return util.inspect(data, false, 10, true);
}

/**
 * @apiGroup 5 Core Admin
 * @apiVersion 0.1.1
 * @api {get} /model/create/core create Core
 * @apiSampleRequest http://localhost:1337/solr/create/core
 */
describe('Test replication api', function() {
    describe('coreCreate schemaless', function() {
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

    /**
     * @apiGroup 5 Core Admin
     * @apiVersion 0.1.1
     * @api {get} /model/systeminfo get System Info
     * @apiSampleRequest http://localhost:1337/solr/systeminfo
     */
    describe('systemInfo', function() {
        this.timeout(5000);
        it('responseHeader should return status:0', function(done) {
            client.systemInfo(
                function(err, data) {
                    // console.log('systemInfo'.yellow,err,inspect(data));
                    data.responseHeader.status.should.be.equal(0);
                    done();
                });
        });
    });

    /**
     * @apiGroup Core Admin
     * @apiVersion 0.1.1
     * @api {get} /model/replication/details get Replication Details
     * @apiSampleRequest http://localhost:1337/solr/replication/details
     */
    describe('replication details', function() {
        it('responseHeader should return status:0', function(done) {
            client.replication({
                    command: 'details'
                },
                function(err, data) {
                    // console.log('replication'.yellow,err,inspect(data));
                    data.responseHeader.status.should.be.equal(0);
                    done();
                });
        });
    });



    describe('replication restore', function() {
        it('responseHeader should return status:0', function(done) {
            client.replication({
                    command: 'restore',
                    name: 'backup_name'
                },
                function(err, data) {
                    // console.log('replication'.yellow, err, inspect(data));
                    data.responseHeader.status.should.be.equal(0);
                    done();
                });
        });
    });

    describe('replication restore status', function() {
        it('responseHeader should return status:0', function(done) {
            client.replication({
                    command: 'restorestatus',
                    name: 'backup_name'
                },
                function(err, data) {
                    // console.log('replication'.yellow, err, inspect(data));
                    data.responseHeader.status.should.be.equal(0);
                    done();
                });
        });
    });

    describe('replication enablereplication', function() {
        it('responseHeader should return status:0', function(done) {
            client.replication({
                    command: 'enablereplication'
                },
                function(err, data) {
                    // console.log('replication'.yellow,err,inspect(data));
                    data.responseHeader.status.should.be.equal(0);
                    done();
                });
        });
    });

    describe('replication disablereplication', function() {
        it('responseHeader should return status:0', function(done) {
            client.replication({
                    command: 'disablereplication'
                },
                function(err, data) {
                    // console.log('replication'.yellow,err,inspect(data));
                    data.responseHeader.status.should.be.equal(0);
                    done();
                });
        });
    });

    describe('replication indexversion', function() {
        it('responseHeader should return status:0', function(done) {
            client.replication({
                    command: 'indexversion'
                },
                function(err, data) {
                    // console.log('replication'.yellow,err,inspect(data));
                    data.responseHeader.status.should.be.equal(0);
                    done();
                });
        });
    });

    describe('replication fetchindex', function() {
        it('responseHeader should return status:0', function(done) {
            client.replication({
                    command: 'fetchindex'
                },
                function(err, data) {
                    // console.log('replication'.yellow,err,inspect(data));
                    data.responseHeader.status.should.be.equal(0);
                    done();
                });
        });
    });

    describe('replication abortfetch', function() {
        it('responseHeader should return status:0', function(done) {
            client.replication({
                    command: 'abortfetch'
                },
                function(err, data) {
                    // console.log('replication'.yellow,err,inspect(data));
                    data.responseHeader.status.should.be.equal(0);
                    done();
                });
        });
    });

    describe('replication disablepoll', function() {
        it('responseHeader should return status:0', function(done) {
            client.replication({
                    command: 'disablepoll'
                },
                function(err, data) {
                    // console.log('replication'.yellow,err,inspect(data));
                    data.responseHeader.status.should.be.equal(0);
                    done();
                });
        });
    });

    describe('replication filelist', function() {
        it('responseHeader should return status:0', function(done) {
            client.replication({
                    command: 'filelist',
                    indexversion: 1433752799956
                },
                function(err, data) {
                    // console.log('replication'.yellow, err, inspect(data));
                    data.responseHeader.status.should.be.equal(0);
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