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
                console.log('coreCreate'.yellow, err, inspect(data));
                data.responseHeader.status.should.be.equal(0);
                data.core.should.be.equal('schemaless');
                done();
            });
    });
});
/**
 * @apiGroup 5 Core Admin
 * @apiVersion 0.1.1
 * @api {get} /model/ping ping
 * @apiSampleRequest http://localhost:1337/solr/ping
 */




// describe('Client ping', function() {
//     it('ping should return "ok"', function(done) {
//         // client.ping(function(err,data){
//         client.ping({
//             distrib: false
//         }, function(err, data) {
//             // client.ping({ts:1433496952782,_:1433496952783},function(err,data){
//             console.log('ping'.yellow, err, data);
//             data.status.should.equal('OK');
//             // 'test'.should.equal('test');
//             done();
//         });
//     });
// });

/**
 * @apiGroup 3 Schema
 * @apiVersion 0.1.1
 * @api {get} /model/schema/version get Version
 * @apiSampleRequest http://localhost:1337/solr/schema/version
 */
describe('Client getSchemaVersion', function() {
    this.timeout(5000);
    it('schema version should be "1.5"', function(done) {
        client.getSchemaVersion(function(err, data) {
            // console.log('getSchemaVersion'.yellow,err,data);
            data.version.should.equal(1.5);
            // 'test'.should.equal('test');
            done();
        });
    });
});

/**
 * @apiGroup 3 Schema
 * @apiVersion 0.1.1
 * @api {get} /model/schema/fields get Fields
 * @apiSampleRequest http://localhost:1337/solr/schema/fields
 */
describe('Client getSchemaFields', function() {
    it('get schema fields should return fields array', function(done) {
        client.getSchemaFields(function(err, data) {
            // console.log('getSchemaVersion'.yellow,err,data);
            data.fields.should.be.an.Array;
            // 'test'.should.equal('test');
            done();
        });
    });
});

/**
 * @apiGroup Schema
 * @apiVersion 0.1.1
 * @api {get} /model/schema/field/types get Fields Types
 * @apiSampleRequest http://localhost:1337/solr/schema/fields/types
 */
describe('Client getSchemaFieldsTypes', function() {
    it('get schema field types should return fieldTypes array', function(done) {
        client.getSchemaFieldsTypes(function(err, data) {
            // console.log('getSchemaVersion'.yellow,err,data);
            // 'test'.should.equal('test');
            data.fieldTypes.should.be.an.Array;
            done();
        });
    });
});

/**
 * @apiGroup Schema
 * @apiVersion 0.1.1
 * @api {get} /model/schema/fields/dynamic get Dynamic Fields Types
 * @apiSampleRequest http://localhost:1337/solr/schema/fields/dynamic
 */
describe('Client getSchemaDynamicFields', function() {
    it('get schema  field types should return dynamicFields array', function(done) {
        client.getSchemaDynamicFields(function(err, data) {
            // console.log('getSchemaVersion'.yellow,err,data);
            // 'test'.should.equal('test');
            data.dynamicFields.should.be.an.Array;
            done();
        });
    });
});

/**
 * @apiGroup Schema
 * @apiVersion 0.1.1
 * @api {get} /model/schema/fields/copy get Copy Fields Types
 * @apiSampleRequest http://localhost:1337/solr/schema/fields/copy
 */
describe('Client getSchemaCopyFields', function() {
    it('get schema field types should return copyFields array', function(done) {
        client.getSchemaCopyFields(function(err, data) {
            // console.log('getSchemaVersion'.yellow,err,data);
            // 'test'.should.equal('test');
            data.copyFields.should.be.an.Array;
            done();
        });
    });
});

/**
 * @apiGroup Schema
 * @apiVersion 0.1.1
 * @api {get} /model/schema/name get Name
 * @apiSampleRequest http://localhost:1337/solr/schema/name
 */
describe('Client getSchemaName', function() {
    it('get schema field types should return name string', function(done) {
        client.getSchemaName(function(err, data) {
            // console.log('getSchemaVersion'.yellow,err,data);
            // 'test'.should.equal('test');
            data.name.should.be.an.String;
            done();
        });
    });
});


describe('Client getSchemaUniqueKey', function() {
    it('get schema field types should return uniqueKey string', function(done) {
        client.getSchemaUniqueKey(function(err, data) {
            // console.log('getSchemaVersion'.yellow,err,data);
            // 'test'.should.equal('test');
            data.uniqueKey.should.be.an.String;
            done();
        });
    });
});

describe('Client getSchemaSimilarity', function() {
    it('get schema field types should return similarity string', function(done) {
        client.getSchemaSimilarity(function(err, data) {
            // console.log('getSchemaSimilarity'.yellow,err,data);
            // 'test'.should.equal('test');
            data.similarity.should.be.an.Object;
            done();
        });
    });
});


describe('Client getSchemaQueryParserDefaultOperator', function() {
    it('get schema field types should return similarity string', function(done) {
        client.getSchemaQueryParserDefaultOperator(function(err, data) {
            // console.log('getSchemaQueryParserDefaultOperator'.yellow,err,data);
            // 'test'.should.equal('test');
            data.defaultOperator.should.be.an.String;
            done();
        });
    });
});



describe('Client setSchemaFields', function() {
    it('add schema field should return status:0', function(done) {
        client.setSchemaFields(
            // [{"name":"sell-by","type":"string","stored":true}],  if /schema/fields
            // {"add-fields":[{"name":"sell-by","type":"string","stored":true}]},  if /schema/
            {
                "add-field": [{
                    "name": "sell-bynewnew",
                    "type": "string",
                    "stored": true,
                    "multivalued": true,
                    "copyFields": ["name"]
                }]
            },
            function(err, data) {
                console.log('setSchemaFields'.yellow, err, data);
                // 'test'.should.equal('test');
                data.responseHeader.status.should.be.equal(0);
                done();
            });
    });
});


describe('Client setSchemaFields', function() {
    it('add schema field should return status:0', function(done) {
        client.setSchemaFields(
            // [{"name":"sell-by","type":"string","stored":true}],  if /schema/fields
            // {"add-fields":[{"name":"sell-by","type":"string","stored":true}]},  if /schema/
            {
                "add-field": [{
                    "name": "copy",
                    "type": "string",
                    "stored": true,
                    "multivalued": true
                }]
            },
            function(err, data) {
                // console.log('setSchemaFields'.yellow,err,data);
                // 'test'.should.equal('test');
                data.responseHeader.status.should.be.equal(0);
                done();
            });
    });
});
describe('Client setSchemaFields', function() {
    it('add schema field should return status:0', function(done) {
        client.setSchemaFields(
            // [{"name":"sell-by","type":"string","stored":true}],  if /schema/fields
            // {"add-fields":[{"name":"sell-by","type":"string","stored":true}]},  if /schema/
            {
                "add-field": [{
                    "name": "name",
                    "type": "string",
                    "stored": true,
                    "multivalued": true
                }]
            },
            function(err, data) {
                // console.log('setSchemaFields'.yellow,err,data);
                // 'test'.should.equal('test');
                data.responseHeader.status.should.be.equal(0);
                done();
            });
    });
});

describe('Client setSchemaFields', function() {
    it('add schema field should return status:0', function(done) {
        client.setSchemaFields(
            // [{"name":"sell-by","type":"string","stored":true}],  if /schema/fields
            // {"add-fields":[{"name":"sell-by","type":"string","stored":true}]},  if /schema/
            {
                "add-field": [{
                    "name": "copy",
                    "type": "string",
                    "stored": true,
                    "multivalued": true
                }]
            },
            function(err, data) {
                // console.log('setSchemaFields'.yellow,err,data);
                // 'test'.should.equal('test');
                data.responseHeader.status.should.be.equal(0);
                done();
            });
    });
});
describe('Client addCopyField', function() {
    it('add copy field should return status:0', function(done) {
        client.addCopyField(
            [{
                "source": "name",
                "dest": ["copy"]
            }],
            function(err, data) {
                console.log('addCopyField'.yellow, err, inspect(data));
                // 'test'.should.equal('test');
                data.responseHeader.status.should.be.equal(0);
                done();
            });
    });
});

describe('Client getQueryHandlerStats', function() {
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




/* >= solr 5.1.0 */
describe('Client deleteSchemaFields', function() {
    it('delete schema field should return status:0', function(done) {
        client.deleteSchemaFields({
                "delete-field": {
                    "name": "sell-by"
                }
            },
            function(err, data) {
                data.responseHeader.status.should.be.equal(0);
                /* test if field not exists */
                // client.getSchemaFields(function(err,data){
                //   console.log('getSchemaVersion'.yellow,err,data);
                //   data.fields.should.be.an.Array;
                //   // 'test'.should.equal('test');
                //   done();
                // });
                done();
            });
    });
});