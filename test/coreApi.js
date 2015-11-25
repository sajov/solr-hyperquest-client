/**
 * @apiName SolrHyperquest
 * @apiVersion 0.1.1
 *
 * https://cwiki.apache.org/confluence/display/solr/CoreAdmin+API
 * STATUS
 * CREATE
 * RELOAD
 * RENAME
 * SWAP
 * UNLOAD
 * MERGEINDEXES
 * SPLIT
 * REQUESTSTATUS
 */

'use strict';
var util = require('util');
var Solr = require('../index');
var should = require('should');

var client = {};

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
describe('Core Api', function() {

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
     * @api {get} /model/corestatus get Core Satus
     * @apiSampleRequest http://localhost:1337/solr/corestatus
     */
    describe('Client coreStatus schemaless', function() {
        it('responseHeader should return status:0', function(done) {
            client.coreStatus({
                    action: 'STATUS',
                    'core': 'schemaless'
                },
                function(err, data) {
                    // console.log('coreStatus'.yellow,err,inspect(data));
                    data.responseHeader.status.should.be.equal(0);
                    done();
                });
        });
    });

    describe('Client coreCreate coreX', function() {
        it('responseHeader should return status:0', function(done) {
            client.coreCreate({
                    action: 'CREATE',
                    name: 'coreX',
                    instanceDir: 'coreX',
                    configSet: 'data_driven_schema_configs',
                    config: 'solrconfig.xml',
                    schema: 'schema.xml',
                    dataDir: 'data'
                },
                function(err, data) {
                    // console.log('coreCreate'.yellow,err,inspect(data));
                    data.responseHeader.status.should.be.equal(0);
                    data.core.should.be.equal('coreX');
                    done();
                });
        });
    });

    describe('Client coreReload coreX', function() {
        it('responseHeader should return status:0', function(done) {
            client.coreReload({
                    action: 'RELOAD',
                    'core': 'coreX'
                },
                function(err, data) {
                    // console.log('coreLoad'.yellow, err, inspect(data));
                    data.responseHeader.status.should.be.equal(0);
                    done();
                });
        });
    });

    describe('Client coreReload', function() {
        it('responseHeader should return status:0', function(done) {
            client.coreReload({
                    action: 'RELOAD',
                    'core': 'schemaless'
                },
                function(err, data) {
                    // console.log('coreReload'.yellow, err, inspect(data));
                    data.responseHeader.status.should.be.equal(0);
                    done();
                });
        });
    });

    describe('Client coreRename schemaless => schemalessnew', function() {
        it('responseHeader should return status:0', function(done) {
            client.coreRename({
                    action: 'RENAME',
                    'core': 'schemaless',
                    'other': 'schemalessnew'
                },
                function(err, data) {
                    // console.log('coreRename'.yellow, err, inspect(data));
                    data.responseHeader.status.should.be.equal(0);
                    done();
                });
        });
    });

    describe('Client coreRename schemalessnew => schemaless', function() {
        it('responseHeader should return status:0', function(done) {
            client.coreRename({
                    action: 'RENAME',
                    'core': 'schemalessnew',
                    'other': 'schemaless'
                },
                function(err, data) {
                    // console.log('coreRename'.yellow,err,inspect(data));
                    data.responseHeader.status.should.be.equal(0);
                    done();
                });
        });
    });

    describe('Client coreSwap schemaless => coreX', function() {
        it('responseHeader should return status:0', function(done) {
            client.coreSwap({
                    action: 'SWAP',
                    'core': 'schemaless',
                    'other': 'coreX'
                },
                function(err, data) {
                    // console.log('coreSwap'.yellow,err,inspect(data));
                    data.responseHeader.status.should.be.equal(0);
                    done();
                });
        });
    });

    describe('Client coreSwap coreX => schemaless', function() {
        it('responseHeader should return status:0', function(done) {
            client.coreSwap({
                    action: 'SWAP',
                    'core': 'coreX',
                    'other': 'schemaless'
                },
                function(err, data) {
                    // console.log('coreSwap'.yellow, err, inspect(data));
                    data.responseHeader.status.should.be.equal(0);
                    done();
                });
        });
    });

    // describe('Client coreUnload coreX keep index', function() {
    //     it('responseHeader should return status:0', function(done) {
    //         client.coreUnload({
    //                 action: 'UNLOAD',
    //                 'core': 'coreX',
    //                 'deleteIndex': false
    //             },
    //             function(err, data) {
    //                 // console.log('coreUnload'.yellow, err, inspect(data));
    //                 data.responseHeader.status.should.be.equal(0);
    //                 done();
    //             });
    //     });
    // });

    describe('Client coreLoad coreX', function() {
        it('responseHeader should return status:0', function(done) {
            client.coreLoad({
                    action: 'LOAD',
                    'core': 'coreX'
                },
                function(err, data) {
                    // console.log('coreLoad'.yellow, err, inspect(data));
                    data.responseHeader.status.should.be.equal(0);
                    done();
                });
        });
    });

    describe('Client coreReload coreX', function() {
        it('responseHeader should return status:0', function(done) {
            client.coreUnload({
                    action: 'RELOAD',
                    'core': 'coreX',
                },
                function(err, data) {
                    // console.log('coreReload'.yellow, err, inspect(data));
                    data.responseHeader.status.should.be.equal(0);
                    done();
                });
        });
    });

    describe('Client coreCreate coreA', function() {
        it('responseHeader should return status:0', function(done) {
            client.coreCreate({
                    action: 'CREATE',
                    name: 'coreA',
                    instanceDir: 'coreA',
                    configSet: 'data_driven_schema_configs',
                    config: 'solrconfig.xml',
                    schema: 'schema.xml',
                    dataDir: 'data'
                },
                function(err, data) {
                    // console.log('coreCreate'.yellow, err, inspect(data));
                    data.responseHeader.status.should.be.equal(0);
                    data.core.should.be.equal('coreA');
                    done();
                });
        });
    });

    describe('Client coreCreate coreB', function() {
        it('responseHeader should return status:0', function(done) {
            client.coreCreate({
                    action: 'CREATE',
                    name: 'coreB',
                    instanceDir: 'coreB',
                    configSet: 'data_driven_schema_configs',
                    config: 'solrconfig.xml',
                    schema: 'schema.xml',
                    dataDir: 'data'
                },
                function(err, data) {
                    // console.log('coreCreate'.yellow, err, inspect(data));
                    data.responseHeader.status.should.be.equal(0);
                    data.core.should.be.equal('coreB');
                    done();
                });
        });
    });

    describe('Client coreCreate coreC', function() {
        it('responseHeader should return status:0', function(done) {
            client.coreCreate({
                    action: 'CREATE',
                    name: 'coreC',
                    instanceDir: 'coreC',
                    configSet: 'data_driven_schema_configs',
                    config: 'solrconfig.xml',
                    schema: 'schema.xml',
                    dataDir: 'data'
                },
                function(err, data) {
                    // console.log('coreCreate'.yellow, err, inspect(data));
                    data.responseHeader.status.should.be.equal(0);
                    data.core.should.be.equal('coreC');
                    done();
                });
        });
    });

    describe('Client coreMerge B+C=>A', function() {
        it('responseHeader should return status:0', function(done) {
            // http://localhost:8983/solr/admin/cores?action=mergeindexes&core=new_core_name&srcCore=core1&srcCore=core2
            client.coreMerge({
                    action: 'mergeindexes',
                    'core': 'coreA',
                    'srcCore': ['coreB', 'coreC']
                },
                function(err, data) {
                    // console.log('coreMerge'.yellow, err, inspect(data));
                    data.responseHeader.status.should.be.equal(0);
                    done();
                });
        });
    });


    // //http://localhost:8983/solr/admin/cores?action=SPLIT&core=core0&targetCore=core1&targetCore=core2
    // //http://localhost:8983/solr/admin/cores?action=SPLIT&core=core0&path=/path/to/index/1&path=/path/to/index/2
    // //http://localhost:8983/solr/admin/cores?action=SPLIT&core=core0&targetCore=core1&split.key=A!
    describe('Client coreSplit', function() {
        it('responseHeader should return status:0', function(done) {
            client.coreSplit({
                    action: 'SPLIT',
                    'core': 'coreA',
                    'targetCore': ['coreB', 'coreC']
                },
                function(err, data) {
                    // console.log('coreSplit'.yellow,err,inspect(data));
                    data.responseHeader.status.should.be.equal(0);
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

    describe('Client coreUnload coreX', function() {
        it('responseHeader should return status:0', function(done) {
            client.coreUnload({
                    action: 'UNLOAD',
                    'core': 'coreX',
                    'deleteIndex': true
                },
                function(err, data) {
                    // console.log('coreUnload'.yellow, err, inspect(data));
                    data.responseHeader.status.should.be.equal(0);
                    done();
                });
        });
    });

    describe('Client coreUnload coreA', function() {
        it('responseHeader should return status:0', function(done) {
            client.coreUnload({
                    action: 'UNLOAD',
                    'core': 'coreA',
                    'deleteIndex': true
                },
                function(err, data) {
                    // console.log('coreUnload'.yellow,err,inspect(data));
                    data.responseHeader.status.should.be.equal(0);
                    done();
                });
        });
    });

    describe('Client coreUnload coreB', function() {
        it('responseHeader should return status:0', function(done) {
            client.coreUnload({
                    action: 'UNLOAD',
                    'core': 'coreB',
                    'deleteIndex': true
                },
                function(err, data) {
                    // console.log('coreUnload'.yellow,err,inspect(data));
                    data.responseHeader.status.should.be.equal(0);
                    done();
                });
        });
    });

    describe('Client coreUnload coreC', function() {
        it('responseHeader should return status:0', function(done) {
            client.coreUnload({
                    action: 'UNLOAD',
                    'core': 'coreC',
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