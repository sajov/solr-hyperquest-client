/*!
 * solr hyperquest client 0.0.1
 * Copyright(c) 2015 sajo-media
 * Author Sascha Jovanoski <sajov@gmail.com>
 * MIT Licensed
 */

var _ = require('lodash');
var url = require('url');
var Qs = require('qs');
var hyperquest = require('hyperquest');
var querystring = require('querystring');
var stream = require("stream");
var utils = require('./query/utils');

var DEBUG = false;
module.exports = Client;

function Client(conf) {

    function SolrClient() {}

    SolrClient.config = _.assign({
        protocol: 'http',
        slashes: true,
        host: 'localhost',
        port: '8080',
        core: 'solr',
        instance: 'solr',
        selectMethod: 'get'
    }, conf || {});

    // for native usage
    ["get", "put", "post", "delete", "patch", "head"].forEach(function(method) {
        SolrClient[method] = function(url, params, data, cb) {

            if (params && method == 'get') {
                url += getQueryString(params);
                data = {};
            } else if (data && method == 'post') {
                url += getQueryString();
                data = JSON.stringify(data);
            }

            return request(method, url, data, cb);
        };
    });

    //TODO: add this API!!!
    //https://cwiki.apache.org/confluence/display/solr/Config+API

    /* get solr version */
    // http://localhost:8080/solr-500/admin/info/system?wt=json&indent=true
    /* get core information */
    // http://localhost:8080/solr-500/schemaless/admin/mbeans?stats=true&cat=CORE&indent=true&wt=json

    [{
        method: 'get',
        fnName: 'systemInfo',
        uri: '/admin/info/system'
    }, {
        method: 'get',
        fnName: 'configSets',
        uri: '/admin/configs'
    }, {
        method: 'get',
        fnName: 'coreStatus',
        uri: '/admin/cores'
    }, {
        method: 'get',
        fnName: 'coreCreate',
        uri: '/admin/cores'
    }, {
        method: 'get',
        fnName: 'coreReload',
        uri: '/admin/cores'
    }, {
        method: 'get',
        fnName: 'coreRename',
        uri: '/admin/cores'
    }, {
        method: 'get',
        fnName: 'coreUnload',
        uri: '/admin/cores'
    }, {
        method: 'get',
        fnName: 'coreSwap',
        uri: '/admin/cores'
    }, {
        method: 'get',
        fnName: 'coreLoad',
        uri: '/admin/cores'
    }, {
        method: 'get',
        fnName: 'coreMerge',
        uri: '/admin/cores'
    }, {
        method: 'get',
        fnName: 'coreSplit',
        uri: '/admin/cores'
    }, {
        method: 'get',
        fnName: 'collections',
        uri: '/admin/collections'
    }, {
        method: 'get',
        fnName: 'logging',
        uri: '/admin/info/logging'
    }].forEach(function(apiMethod) {
        SolrClient[apiMethod.fnName] = function(params, data, cb) {
            var method = apiMethod.method;
            conf = _.clone(SolrClient.config);
            delete conf.core;
            var url = getRequestUri(apiMethod.uri, conf);

            if (arguments.length != 3) {
                if (typeof arguments[arguments.length - 1] != 'function') {
                    console.error('callback is required');
                } else {
                    cb = arguments[arguments.length - 1];
                }

                if (arguments.length == 2 && method == 'get') {

                    params = arguments[0];
                } else if (arguments.length == 2 && (method == 'post' || method == 'put')) {
                    data = arguments[0];
                    params = {};
                } else {
                    params = {};
                    data = {};
                }
            }
            if (params && method == 'get') {
                url += getQueryString(params);
                data = {};
                // console.log('CLIENT'.red.inverse,decodeURIComponent(url),data);

            } else if (data && (method == 'post' || method == 'put')) {
                url += getQueryString(params);
                data = JSON.stringify(data);
            }

            return request(method, url, data, cb);
        };
    });

    [{
        method: 'post',
        fnName: 'ping',
        uri: '/admin/ping'
    }, {
        method: 'get',
        fnName: 'getConfig',
        uri: '/config'
    }, {
        method: 'get',
        fnName: 'getSchema',
        uri: '/schema'
    }, {
        method: 'get',
        fnName: 'getSchemaFields',
        uri: '/schema/fields'
    }, {
        method: 'get',
        fnName: 'getSchemaFieldsTypes',
        uri: '/schema/fieldtypes'
    }, {
        method: 'get',
        fnName: 'getSchemaDynamicFields',
        uri: '/schema/dynamicfields'
    }, {
        method: 'get',
        fnName: 'getSchemaCopyFields',
        uri: '/schema/copyfields'
    }, {
        method: 'get',
        fnName: 'getSchemaName',
        uri: '/schema/name'
    }, {
        method: 'get',
        fnName: 'getSchemaVersion',
        uri: '/schema/version'
    }, {
        method: 'get',
        fnName: 'getSchemaUniqueKey',
        uri: '/schema/uniquekey'
    }, {
        method: 'get',
        fnName: 'getSchemaSimilarity',
        uri: '/schema/similarity'
    }, {
        method: 'get',
        fnName: 'getSchemaQueryParserDefaultOperator',
        uri: '/schema/solrqueryparser/defaultoperator'
    },{
        method: 'post',
        fnName: 'setSchemaQueryParserDefaultOperator',
        uri: '/schema/solrqueryparser/defaultoperator'
    }, {
        method: 'post',
        fnName: 'schemaFields',
        uri: '/schema'
    }, {
        method: 'post',
        fnName: 'setSchemaFields',
        uri: '/schema'
    }, {
        method: 'post',
        fnName: 'addSchemaFields',
        uri: '/schema'
    }, {
        method: 'post',
        fnName: 'addSchemaFieldType',
        uri: '/schema'
    },{
        method: 'post',
        fnName: 'addCopyField',
        uri: '/schema/copyfields'
    }, {
        method: 'post',
        fnName: 'addSchemaDynamicFields',
        uri: '/schema'
    }, {
        method: 'post',
        fnName: 'replaceSchemaFields',
        uri: '/schema'
    }, {
        method: 'post',
        fnName: 'deleteSchemaFields',
        uri: '/schema'
    },  {
        method: 'get',
        fnName: 'getQueryHandlerStats',
        uri: '/admin/mbeans'
    }, {
        method: 'get',
        fnName: 'getCoreStats',
        uri: ''
    }, {
        method: SolrClient.config.selectMethod,
        fnName: 'select',
        uri: '/select'
    }, {
        method: SolrClient.config.selectMethod,
        fnName: 'find',
        uri: '/select'
    }, {
        method: SolrClient.config.selectMethod,
        fnName: 'search',
        uri: '/select'
    }, {
        method: SolrClient.config.selectMethod,
        fnName: 'realtime',
        uri: '/get'
    }, {
        method: 'post',
        fnName: 'addDoc',
        uri: '/update'
    }, {
        method: 'post',
        fnName: 'updateDoc',
        uri: '/update'
    }, {
        method: 'post',
        fnName: 'deleteDocById',
        uri: '/update'
    }, {
        method: 'post',
        fnName: 'deleteDocByQuery',
        uri: '/update'
    }, {
        method: 'post',
        fnName: 'deleteDocsByRange',
        uri: '/update'
    }, {
        method: 'post',
        fnName: 'deleteAllDocs',
        uri: '/update'
    }, {
        method: 'get',
        fnName: 'commit',
        uri: '/update'
    }, {
        method: 'post',
        fnName: 'softCommit',
        uri: '/update'
    }, {
        method: 'post',
        fnName: 'prepareCommit',
        uri: '/update'
    }, {
        method: 'get',
        fnName: 'replication',
        uri: '/replication'
    }, ]
        .forEach(function(apiMethod) {
            SolrClient[apiMethod.fnName] = function(params, data, cb) {
                var method = apiMethod.method;
                var url = getRequestUri(apiMethod.uri, SolrClient.config);

                if (arguments.length != 3) {
                    if (typeof arguments[arguments.length - 1] != 'function') {
                        console.error('callback is required');
                    } else {
                        cb = arguments[arguments.length - 1];
                    }

                    if (arguments.length == 2 && method == 'get') {

                        params = arguments[0];
                    } else if (arguments.length == 2 && (method == 'post' || method == 'put')) {
                        data = arguments[0];
                        params = {};
                    } else {
                        params = {};
                        data = {};
                    }
                }
                if (params && method == 'get') {
                    url += getQueryString(params);

                    data = {};
                    // console.log('CLIENT'.red.inverse,decodeURIComponent(url),data);

                } else if (data && (method == 'post' || method == 'put')) {
                    url += getQueryString(params);
                    try {
                        data = JSON.stringify(data);
                        // console.log('data:',data);
                    } catch (e) {
                        console.log('err:', e);
                        return {};
                        // console.log('CLIENT on end catch'.red.inverse,chunk,e);
                    }
                    // data = data;
                    // console.log('CLIENT'.red.inverse,decodeURIComponent(url),data);
                }



                // console.log(
                //     'CLIENT'.red.inverse,
                //     decodeURIComponent(url),
                //     data
                // );


                return request(method, url, data, cb);
            };
        });

    function getRequestUri(uriPath, conf) {
        var urlObj = {
                protocol: conf.protocol || 'http',
                slashes: conf.slashes || true,
                host: conf.host || 'localhost',
                port: conf.port || '8080',
            },
            hostPath = [];

        if (conf.port) {
            urlObj.host += ':' + conf.port;
        }

        if (conf.auth) {
            urlObj.auth = conf.auth;
        }
        // urlObj.pathname = ['solrTest','coretest'];

        if (conf.instance) {
            hostPath.push(conf.instance);
        }

        if (conf.core) {
            hostPath.push(conf.core)
        }

        urlObj.pathname = hostPath.join('/');

        // console.log('urlObj'.red.inverse,urlObj);
        return url.format(urlObj) + uriPath;
    }

    function getQueryString(query) {
        var q = query || '';
        if (typeof q === 'string') {
            return '?' + q + '&wt=json';
        } else {
            q.wt = 'json';
            // return '?' + querystring.stringify(q);
            // console.log('CLIENT Qs.stringify'.red.inverse, q );
            // console.log('CLIENT Qs.stringify'.red.inverse, Qs.stringify(q, { arrayFormat: 'repeat' }));
            return '?' + Qs.stringify(q, {
                arrayFormat: 'repeat', encode: false
            })
        }
    }

    function request(method, url, data, cb) {
        if (SolrClient.config.debugSolr == true) {
        }
            utils.log('REQUEST'.white.inverse, url.white);
            // utils.log('details'.white.inverse, {
            //     url: url,
            //     method: method,
            //     data: data
            // });

        options = {};
        options.method = method;
        options.headers = options.headers || {
            'content-type': 'application/json'
        };

        var req = hyperquest((url), options)
            .on('data', function(c) {
                chunk += c
            })
            .on('error', function(err) {
                // console.log('CLIENT ERROR'.red.inverse, err);
                return cb({
                    msg: 'Solr Client: error',
                    err: err,
                    data: chunk,
                    url: url,
                    options: options,
                    data: data
                }, false);
            })
            .on('end', function(msg) {
                // console.log('CLIENT END'.red.inverse, msg);
                // console.log('CLIENT msg:'.red.inverse,req.response.statusCode);
                // console.log('CLIENT msg:'.red.inverse,req.response.complete);

                try {
                    response = JSON.parse(chunk);

                } catch (e) {
                    // console.log('CLIENT on end catch'.red.inverse,chunk,e);
                    return cb({
                        msg: 'Solr Client: not a propper json',
                        e: e,
                        data: chunk,
                        url: url,
                        options: options,
                        // data: data
                    }, null)
                }
                // console.log('response',typeof response );
                // console.log('chunk', chunk );
                // console.log('msg', msg );
                if (typeof response != 'undefined' && (response.responseHeader.status == 200 || response.responseHeader.status == 0)) {
                    // console.log('CLIENT on end 200'.red.inverse,response);
                    return cb(false, response);
                } else if (typeof response != 'undefined') {
                    return cb(response, false);
                } else {
                    // console.log('CLIENT on end !200'.red.inverse,response);
                    return cb(true, chunk);
                }
            });

        var chunk = '';

        if (data && req.writable && data instanceof stream.Readable) {
            data.pipe(req);
        } else if (data && req.writable) {
            if (typeof data != "string") {
                req.end();
                return reject(new Error("data must be a stream or a string"));
            }
            options.headers["content-length"] = Buffer.byteLength(data, "utf-8") || 0;
            req.write(data);
        } else if (req.writable) {
            req.write(null);
        }
    }

    return SolrClient;
}