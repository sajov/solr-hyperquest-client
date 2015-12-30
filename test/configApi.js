// https://cwiki.apache.org/confluence/display/solr/Config+API#ConfigAPI-CommandsforCommonProperties

'use strict';
var util = require('util');
var Solr = require('../index');
var Query = Solr.Query;
var should = require('should');
var client = {};

function inspect(data) {
    return util.inspect(data, true, 10, true);
}

describe('Test solrconfig', function() {
    before(function() {
        client = new Solr.Client({
            host: 'localhost',
            port: '8983',
            instance: 'solr',
            core: 'schemaless'
        });
        console.log('client',client);
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

    // describe('Update Handler autocommit max docs', function() {});
    // describe('Update Handler autocommit max time', function() {});
    // describe('Update Handler autocommit openSearcher', function() {});

    // describe('updateHandler.autoSoftCommit.maxDocs', function() {});
    // describe('updateHandler.autoSoftCommit.maxTime', function() {});
    // describe('updateHandler.commitWithin.softCommit', function() {});
    // describe('updateHandler.commitIntervalLowerBound', function() {});
    // describe('updateHandler.indexWriter.closeWaitsForMerges', function() {});
    // describe('query.filterCache.class', function() {});
    // describe('query.filterCache.size', function() {});
    // describe('query.filterCache.initialSize', function() {});
    // describe('query.filterCache.autowarmCount', function() {});
    // describe('query.filterCache.regenerator', function() {});
    // describe('query.queryResultCache.class', function() {});
    // describe('query.queryResultCache.size', function() {});
    // describe('query.queryResultCache.initialSize', function() {});
    // describe('query.queryResultCache.autowarmCount', function() {});
    // describe('query.queryResultCache.regenerator', function() {});
    // describe('query.documentCache.class', function() {});
    // describe('query.documentCache.size', function() {});
    // describe('query.documentCache.initialSize', function() {});
    // describe('query.documentCache.autowarmCount', function() {});
    // describe('query.documentCache.regenerator', function() {});
    // describe('query.fieldValueCache.class', function() {});
    // describe('query.fieldValueCache.size', function() {});
    // describe('query.fieldValueCache.initialSize', function() {});
    // describe('query.fieldValueCache.autowarmCount', function() {});
    // describe('query.fieldValueCache.regenerator', function() {});
    // describe('query.useFilterForSortedQuery', function() {});
    // describe('query.queryResultWindowSize', function() {});
    // describe('query.queryResultMaxDocCached', function() {});
    // describe('query.enableLazyFieldLoading', function() {});
    // describe('query.boolToFilterOptimizer', function() {});
    // describe('query.maxBooleanClauses', function() {});
    // describe('jmx.agentId', function() {});
    // describe('jmx.serviceUrl', function() {});
    // describe('jmx.rootName', function() {});
    // describe('requestDispatcher.handleSelect', function() {});
    // describe('requestDispatcher.requestParsers.multipartUploadLimitInKB', function() {});
    // describe('requestDispatcher.requestParsers.formdataUploadLimitInKB', function() {});
    // describe('requestDispatcher.requestParsers.enableRemoteStreaming', function() {});
    // describe('requestDispatcher.requestParsers.addHttpRequestToContext', function() {});


    // describe('add-requesthandler', function() {});
    // describe('update-requesthandler', function() {});
    // describe('delete-requesthandler', function() {});
    // describe('add-searchcomponent', function() {});
    // describe('update-searchcomponent', function() {});
    // describe('delete-searchcomponent', function() {});
    // describe('add-initparams', function() {});
    // describe('update-initparams', function() {});
    // describe('delete-initparams', function() {});
    // describe('add-queryresponsewriter', function() {});
    // describe('update-queryresponsewriter', function() {});
    // describe('delete-queryresponsewriter', function() {});

    // describe('add-queryparser', function() {});
    // describe('update-queryparser', function() {});
    // describe('delete-queryparser', function() {});
    // describe('add-valuesourceparser', function() {});
    // describe('update-valuesourceparser', function() {});
    // describe('delete-valuesourceparser', function() {});
    // describe('add-transformer', function() {});
    // describe('update-transformer', function() {});
    // describe('delete-transformer', function() {});
    // describe('add-updateprocessor', function() {});
    // describe('update-updateprocessor', function() {});
    // describe('delete-updateprocessor', function() {});
    // describe('add-queryconverter', function() {});
    // describe('update-queryconverter', function() {});
    // describe('delete-queryconverter', function() {});
    // describe('add-listener', function() {});
    // describe('update-listener', function() {});
    // describe('delete-listener', function() {});
    // describe('add-runtimelib', function() {});
    // describe('update-runtimelib', function() {});
    // describe('delete-runtimelib', function() {});
    describe('setSchemaFields', function() {
        it('add schema field should return status:0', function(done) {
            client.setSchemaFields(
                // [{"name":"sell-by","type":"string","stored":true}],  if /schema/fields
                // {"add-fields":[{"name":"sell-by","type":"string","stored":true}]},  if /schema/
                {
                    "add-field": [{
                        "name": "search",
                        "type": "text_general",
                        "stored": true,
                        "multivalued": true,
                    },{
                        "name": "name",
                        "type": "string",
                        "stored": true,
                        "multivalued": false,
                        "copyFields": ["search"]
                    },
                    {
                        "name": "age",
                        "type": "int",
                        "stored": true,
                        "multivalued": false,
                        "copyFields": ["search"]
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


     describe('add-searchcomponent', function() {
          this.timeout(5000);
          it('responseHeader should return status:0', function(done) {
          // console.log('client',client.solrconfig);
            client.solrconfig({
                  "add-searchcomponent":{
                    // "suggest":{
                      "name":"suggest",
                      "class":"solr.SuggestComponent",
                      "suggester":{
                        "name":"suggest",
                        "lookupImpl":"FuzzyLookupFactory",
                        "dictionaryImpl":"DocumentDictionaryFactory",
                        "field":"name",
                        "suggestAnalyzerFieldType":"string",
                        "buildOnStartup":"true"}
                  }
            }, function(err, response){
                if(err) console.log(err);
              // console.log(err,response,inspect(response));
              done();
            })
          });
        });

        //http://localhost:8983/solr/schemaless/suggest?q=foa%20bar&wt=json&indent=true&debugQuery=true&spellcheck.count=10&spellcheck.extendedResults=true&spellcheck.collate=true&spellcheck.maxCollations=10&spellcheck.maxCollationTries=10&spellcheck.accuracy=0.003
        describe('add-requesthandler', function() {
          this.timeout(5000);
          it('responseHeader should return status:0', function(done) {
              // console.log('client',client.solrconfig);
              client.solrconfig({
                "add-requesthandler" : {
                    "startup":"lazy",
                    "name":"/suggest",
                    "class":"solr.SearchHandler",
                    "defaults":{
                      "suggest":true,
                      "suggest.count":10,
                      "suggest.dictionary":"suggest",
                      "spellcheck":"on",
                      "spellcheck.count":10,
                      "spellcheck.extendedResults":true,
                      "spellcheck.collate":true,
                      "spellcheck.maxCollations":10,
                      "spellcheck.maxCollationTries":10,
                      "spellcheck.accuracy":0.003,
                    },
                    "components":["spellcheck","suggest"]
                  }
              }, function(err, response){
                if(err) console.log(err);
                // console.log(err,response,inspect(response));
                done();
              })
          });
        });


    describe('delete-requesthandler', function() {
          this.timeout(5000);
          it('responseHeader should return status:0', function(done) {
              // console.log('client',client.solrconfig);
              client.solrconfig({
                "delete-requesthandler" : "/suggest"
              }, function(err, response){
                if(err) console.log(err);
                // console.log(err,response,inspect(response));
                done();
              })
          });
        });

        describe('delete-searchcomponent', function() {
          this.timeout(5000);
          it('responseHeader should return status:0', function(done) {
              // console.log('client',client.solrconfig);
              client.solrconfig({
                "delete-searchcomponent" : "suggest"
              }, function(err, response){
                // console.log(err,response,inspect(response));
                // done();
                client.getConfig({}, function(e, r){
                  if(err) console.log(e);
                  // console.log(e,inspect(r));
                  done();
                })
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
