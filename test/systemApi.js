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
 * @api {get} /model/systeminfo get System Info
 * @apiSampleRequest http://localhost:1337/solr/systeminfo
 */
describe('Client systemInfo', function() {
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