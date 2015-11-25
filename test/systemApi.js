'use strict';
var util = require('util');
var Solr = require('../index');
var should = require('should');
var client = {};

function inspect(data) {
    return util.inspect(data, false, 10, true);
}

describe('Test system api', function() {
    before(function() {
        client = new Solr.Client({
            host: 'localhost',
            port: '8983',
            instance: 'solr',
            core: 'schemaless'
        });
    });

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

    describe('getQueryHandlerStats', function() {
        it('responseHeader should return status:0, result should contain select/ ', function(done) {
            client.getQueryHandlerStats({
                    stats: true,
                    cat: 'QUERYHANDLER'
                },
                function(err, data) {
                    data.responseHeader.status.should.be.equal(0);
                    data['solr-mbeans'][1]['/select'].should.be.an.Object;
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