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

var client = new Solr.Client({
    host: 'localhost',
    port: '8983',
    instance: 'solr',
    core: 'gettingstarted'
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
 * @api {get} /model/corestatus get Core Satus
 * @apiSampleRequest http://localhost:1337/solr/corestatus
 */
describe('Client coreStatus', function() {
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

/**
 * @apiGroup 5 Core Admin
 * @apiVersion 0.1.1
 * @api {get} /model/create/core create Core
 * @apiSampleRequest http://localhost:1337/solr/create/core
 */
describe('Client coreCreate', function() {
    it('responseHeader should return status:0', function(done) {
        client.coreCreate({
                action: 'CREATE',
                name: 'coreX',
                loadOnStartup: true,
                instanceDir: '/Users/diver/Documents/Dev/sajo/solr-5.3.1/example/schemaless/solr/coreX',
                configSet: 'data_driven_schema_configs',
                config: 'solrconfig.xml',
                schema: 'schema.xml',
                // config: '../gettingstarted/config/solrconfig.xml',
                // schema: '../gettingstarted/config/schema.xml',
                dataDir: 'data'
            },
            function(err, data) {
                console.log('coreCreate'.yellow, err, inspect(data));
                // data.responseHeader.status.should.be.equal(0);
                done();
            });
    });
});
describe('Client coreUnload', function() {
    it('responseHeader should return status:0', function(done) {
        client.coreUnload({
                action: 'UNLOAD',
                'core': 'coreX',
                'deleteIndex': false
            },
            function(err, data) {
                // console.log('coreUnload'.yellow,err,inspect(data));
                data.responseHeader.status.should.be.equal(0);
                done();
            });
    });
});

describe('Client coreCreate', function() {
    it('responseHeader should return status:0', function(done) {
        client.coreCreate({
                action: 'CREATE',
                name: 'coreX',
                instanceDir: 'coreX',
                config: 'solrconfig.xml',
                schema: 'schema.xml',
                dataDir: 'data'
            },
            function(err, data) {
                // console.log('coreCreate'.yellow,err,inspect(data));
                // data.responseHeader.status.should.be.equal(0);
                done();
            });
    });
});
describe('Client coreReload', function() {
    it('responseHeader should return status:0', function(done) {
        client.coreReload({
                action: 'RELOAD',
                'core': 'coreX'
            },
            function(err, data) {
                // console.log('coreLoad'.yellow,err,inspect(data));
                data.responseHeader.status.should.be.equal(0);
                done();
            });
    });
});

describe('Client coreReload', function() {
    this.timeout(15000);
    it('responseHeader should return status:0', function(done) {
        client.coreReload({
                action: 'RELOAD',
                'core': 'schemaless'
            },
            function(err, data) {
                // console.log('coreReload'.yellow,err,inspect(data));
                data.responseHeader.status.should.be.equal(0);
                done();
            });
    });
});


describe('Client coreRename', function() {
    it('responseHeader should return status:0', function(done) {
        client.coreRename({
                action: 'RENAME',
                'core': 'schemaless',
                'other': 'schemalessnew'
            },
            function(err, data) {
                // console.log('coreRename'.yellow,err,inspect(data));
                data.responseHeader.status.should.be.equal(0);
                done();
            });
    });
});
describe('Client coreRename', function() {
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

describe('Client coreSwap', function() {
    this.timeout(15000);
    it('responseHeader should return status:0', function(done) {
        client.coreSwap({
                action: 'SWAP',
                'core': 'schemaless',
                'other': 'autoschemaless'
            },
            function(err, data) {
                // console.log('coreSwap'.yellow,err,inspect(data));
                data.responseHeader.status.should.be.equal(0);
                done();
            });
    });
});
describe('Client coreSwap', function() {
    this.timeout(15000);
    it('responseHeader should return status:0', function(done) {
        client.coreSwap({
                action: 'SWAP',
                'core': 'autoschemaless',
                'other': 'schemaless'
            },
            function(err, data) {
                // console.log('coreSwap'.yellow,err,inspect(data));
                data.responseHeader.status.should.be.equal(0);
                done();
            });
    });
});



describe('Client coreLoad', function() {
    it('responseHeader should return status:0', function(done) {
        client.coreLoad({
                action: 'LOAD',
                'core': 'autoschemaless'
            },
            function(err, data) {
                // console.log('coreLoad'.yellow,err,inspect(data));
                data.responseHeader.status.should.be.equal(0);
                done();
            });
    });
});
//

describe('Client coreMerge', function() {
    it('responseHeader should return status:0', function(done) {
        // http://localhost:8983/solr/admin/cores?action=mergeindexes&core=new_core_name&srcCore=core1&srcCore=core2
        client.coreMerge({
                action: 'mergeindexes',
                'core': 'coreX',
                'srcCore': ['schemaless', 'autoschemaless']
            },
            function(err, data) {
                // console.log('coreMerge'.yellow,err,inspect(data));
                data.responseHeader.status.should.be.equal(0);
                done();
            });
    });
});


//http://localhost:8983/solr/admin/cores?action=SPLIT&core=core0&targetCore=core1&targetCore=core2
//http://localhost:8983/solr/admin/cores?action=SPLIT&core=core0&path=/path/to/index/1&path=/path/to/index/2
//http://localhost:8983/solr/admin/cores?action=SPLIT&core=core0&targetCore=core1&split.key=A!
describe('Client coreSplit', function() {
    it('responseHeader should return status:0', function(done) {
        client.coreSplit({
                action: 'SPLIT',
                'core': 'coreX',
                'targetCore': ['schemaless', 'autoschemaless']
            },
            function(err, data) {
                // console.log('coreSplit'.yellow,err,inspect(data));
                data.responseHeader.status.should.be.equal(0);
                done();
            });
    });
});