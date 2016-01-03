'use strict';
var util = require('util');
var Solr = require('../index');
var Query = Solr.Query;
var should = require('should');
var client = {};

function inspect(data) {
   return util.inspect(data, true, 10, true);
    // return util.inspect(data, false, 10, true);
}

describe('Test Suggest and Spellcheck Component', function() {

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
                    if(err) console.log(err);
                    // console.log('coreCreate'.yellow, err, inspect(data));
                    data.responseHeader.status.should.be.equal(0);
                    data.core.should.be.equal('schemaless');
                    done();
                });
        });
    });

    describe('PREPARE TEST', function() {

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
                        if(err) console.log(err);
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
                    if(err) console.log(err);
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
                    if(err) console.log(err);
                    data.response.numFound.should.be.equal(2);
                    done();
                });
            });
        });
    });

    describe('ADD SEARCHCOMPONENT AND REQUESTHANDLER', function() {
        //http://localhost:8983/solr/schemaless/suggest?q=f&wt=json&indent=true&suggest.build=true
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
    });

    describe('MAIN TEST', function() {
        describe('delete-requesthandler', function() {
          this.timeout(5000);
          it('responseHeader should return status:0', function(done) {
              // console.log('client',client.solrconfig);
              client.suggest({
                "q" : "foo"
              }, function(err, response){
                if(err) console.log(err);
                console.log(err,response,inspect(response.suggest));
                response.suggest.should.be.an.Object;
                response.suggest.should.be.an.Object;
                response.suggest.suggest.should.be.an.Object;
                response.suggest.suggest.foo.should.be.an.Object;
                response.suggest.suggest.foo.suggestions.should.be.an.Object;
                response.suggest.suggest.foo.suggestions[0].term.should.be.equal('foo');
                response.suggest.suggest.foo.suggestions[1].term.should.be.equal('foo bar');
                // data.responseHeader.status.should.be.equal(0);
                done();
              })
          });
        });

    });

    describe('TEARDOWN COMPONENTS REQUESTHANDLER AND CORE', function() {


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
                      if(err) console.log(err);
                        // console.log('coreUnload'.yellow,err,inspect(data));
                        data.responseHeader.status.should.be.equal(0);
                        done();
                    });
            });
        });
    });
});
