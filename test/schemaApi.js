'use strict';
var util = require('util');
var Solr = require('../index');
var should = require('should');

var client = {};



function inspect(data) {
    return util.inspect(data, false, 10, true);
}


describe('Test schema api', function() {

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


    // describe('ping', function() {
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


    describe('getSchemaVersion', function() {
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


    describe('getSchemaFields', function() {
        it('get schema fields should return fields array', function(done) {
            client.getSchemaFields(function(err, data) {
                // console.log('getSchemaVersion'.yellow,err,data);
                data.fields.should.be.an.Array;
                // 'test'.should.equal('test');
                done();
            });
        });
    });


    describe('getSchemaFieldsTypes', function() {
        it('get schema field types should return fieldTypes array', function(done) {
            client.getSchemaFieldsTypes(function(err, data) {
                // console.log('getSchemaVersion'.yellow,err,data);
                // 'test'.should.equal('test');
                data.fieldTypes.should.be.an.Array;
                done();
            });
        });
    });


    describe('getSchemaDynamicFields', function() {
        it('get schema  field types should return dynamicFields array', function(done) {
            client.getSchemaDynamicFields(function(err, data) {
                // console.log('getSchemaVersion'.yellow,err,data);
                // 'test'.should.equal('test');
                data.dynamicFields.should.be.an.Array;
                done();
            });
        });
    });


    describe('getSchemaCopyFields', function() {
        it('get schema field types should return copyFields array', function(done) {
            client.getSchemaCopyFields(function(err, data) {
                // console.log('getSchemaVersion'.yellow,err,data);
                // 'test'.should.equal('test');
                data.copyFields.should.be.an.Array;
                done();
            });
        });
    });


    describe('getSchemaName', function() {
        it('get schema field types should return name string', function(done) {
            client.getSchemaName(function(err, data) {
                // console.log('getSchemaVersion'.yellow,err,data);
                // 'test'.should.equal('test');
                data.name.should.be.an.String;
                done();
            });
        });
    });


    describe('getSchemaUniqueKey', function() {
        it('get schema field types should return uniqueKey string', function(done) {
            client.getSchemaUniqueKey(function(err, data) {
                // console.log('getSchemaVersion'.yellow,err,data);
                // 'test'.should.equal('test');
                data.uniqueKey.should.be.an.String;
                done();
            });
        });
    });

    describe('getSchemaSimilarity', function() {
        it('get schema field types should return similarity string', function(done) {
            client.getSchemaSimilarity(function(err, data) {
                // console.log('getSchemaSimilarity'.yellow,err,data);
                // 'test'.should.equal('test');
                data.similarity.should.be.an.Object;
                done();
            });
        });
    });


    describe('getSchemaQueryParserDefaultOperator', function() {
        it('get schema field types should return similarity string', function(done) {
            client.getSchemaQueryParserDefaultOperator(function(err, data) {
                // console.log('getSchemaQueryParserDefaultOperator'.yellow,err,data);
                // 'test'.should.equal('test');
                data.defaultOperator.should.be.an.String;
                done();
            });
        });
    });



    describe('setSchemaFields', function() {
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
                    // console.log('setSchemaFields'.yellow, err, data);
                    // 'test'.should.equal('test');
                    data.responseHeader.status.should.be.equal(0);
                    done();
                });
        });
    });


    describe('setSchemaFields', function() {
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

    describe('getSchemaQueryParserDefaultOperator', function() {
        it('get defaultOperator should return status:0', function(done) {
            client.getSchemaQueryParserDefaultOperator({},
                function(err, data) {
                    console.log(data)
                    data.responseHeader.status.should.be.equal(0);
                    done();
                });
        });
    });

    // describe('setSchemaQueryParserDefaultOperator', function() {
    //     it('set defaultOperator should return status:0', function(done) {
    //         client.setSchemaQueryParserDefaultOperator({
    //                 "defaultOperator": 'AND'
    //             },
    //             function(err, data) {
    //                 console.log(data)
    //                 data.responseHeader.status.should.be.equal(0);
    //                 done();
    //             });
    //     });
    // });

    describe('setSchemaFields', function() {
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

    describe('setSchemaFields', function() {
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
    // describe('addCopyField', function() {
    //     it('add copy field should return status:0', function(done) {
    //         client.addCopyField(
    //             [{
    //                 "source": "name",
    //                 "dest": ["copy"]
    //             }],
    //             function(err, data) {
    //                 console.log('addCopyField'.yellow, err, inspect(data));
    //                 // 'test'.should.equal('test');
    //                 data.responseHeader.status.should.be.equal(0);
    //                 done();
    //             });
    //     });
    // });

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




    /* >= solr 5.1.0 */
    describe('deleteSchemaFields', function() {
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