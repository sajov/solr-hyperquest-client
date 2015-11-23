/*!
 * solr hyperquest client
 * Copyright(c) 2015 sajo-media
 * Author Sascha Jovanoski <sajov@gmail.com>
 * MIT Licensed
 */
require('colors');

var solr = {};
solr.Client = require('./lib/client');
solr.Query = require('./lib/query');

module.exports = solr;