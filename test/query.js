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

    describe('Query ', function() {
        it('{where:{q:foo}} => q=foo', function(done) {
            var query = new Query({
                where: {
                    q: 'foo'
                }
            });
            query.should.equal('q=foo' + extendedQuery);
            done();
        });
    });

    describe('Query ', function() {
        it('{where:{q:foo bar}} => q=foo bar', function(done) {
            var query = new Query({
                where: {
                    q: 'foo bar'
                }
            });
            query.should.equal('q=foo bar' + extendedQuery);
            done();
        });
    });

    describe('Query ', function() {
        it('{where:{q:[foo, bar]}} => q=foo bar', function(done) {
            var query = new Query({
                where: {
                    q: ['foo', 'bar']
                }
            });
            query.should.equal('q=foo bar' + extendedQuery);
            done();
        });
    });

    describe('Query ', function() {
        it('{where:{q:[foo, super bar]}} => q=foo "super bar"', function(done) {
            var query = new Query({
                where: {
                    q: ['foo', 'super bar']
                }
            });
            query.should.equal('q=foo "super bar"' + extendedQuery);
            done();
        });
    });



    describe('Query ', function() {
        it('{where:{q:[{name:"foo"},{"!":"super bar"}]}} => q=foo', function(done) {
            var query = buildQuery({
                where: {
                    q: [{
                        name: 'foo'
                    }, {
                        '!': 'super bar'
                    }]
                }
            });
            query.should.equal('q=false false' + extendedQuery);
            query.should.equal('q=name:foo !"super bar"' + extendedQuery);
            done();
        });
    });


});