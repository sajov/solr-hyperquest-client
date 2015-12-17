/**
 * Module Dependencies
 */

var util = require('util');
var _ = require('lodash'),
    //MD5
    //UUID
    url = require('url');

/**
 * ignore
 */

exports.object = {};

/**
 * Safer helper for hasOwnProperty checks
 *
 * @param {Object} obj
 * @param {String} prop
 * @return {Boolean}
 * @api public
 */

var hop = Object.prototype.hasOwnProperty;
exports.object.hasOwnProperty = function(obj, prop) {
    return hop.call(obj, prop);
};


exports.mergeDefaultQuery = function(query, defaultQuery) {
    return _.merge(_.cloneDeep(query), defaultQuery, function(a, b) {
        if (_.isArray(a)) {
            var union = _.union(_.uniq(a.concat(b), function(item) {
                return JSON.stringify(item);
            }));
            var ret = retref = [];
            _.forEach(union, function(obj, i) {
                var key = _.keys(obj)[0];
                var val = _.values(obj)[0];
                if (_.isUndefined(retref[key])) {
                    retref[key] = i;
                    var o = {};
                    o[key] = val;
                    ret.push(o);
                } else if (_.isString(_.values(ret[retref[key]])[0])) {
                    ret[retref[key]] = [_.values(ret[retref[key]]), val];
                } else if (_.isArray(_.values(ret[retref[key]])[0])) {
                    ret[retref[key]].push(val);
                } else {
                    var o = {};
                    o[key] = [_.values(ret[retref[key]])[0], val];
                    ret[retref[key]] = o;
                }

            });
            return ret;
        }
    });
};

/**
 * Re-Write Mongo's _id attribute to a normalized id attribute in single document
 *
 * @param {Object} models
 * @api private
 */

exports._rewriteIds = function(model, schema) {
    if (hop.call(model, '_id')) {
        // change id to string only if it's necessary
        if (typeof model._id === 'object')
            model.id = model._id.toString();
        else
            model.id = model._id;
        delete model._id;
    }

    // Rewrite any foreign keys if a schema is available
    if (!schema) return model;

    Object.keys(schema).forEach(function(key) {
        var foreignKey = schema[key].foreignKey || false;

        // If a foreignKey, check if value matches a mongo id and if so turn it into an objectId
        if (foreignKey && model[key] instanceof ObjectId) {
            model[key] = model[key].toString();
        }
    });

    return model;
};

/**
 * Re-Write Mongo's _id attribute to a normalized id attribute
 *
 * @param {Array} models
 * @api public
 */

exports.rewriteIds = function rewriteIds(models, schema) {
    var _models = models.map(function(model) {
        return exports._rewriteIds(model, schema);
    });
    return _models;
};

/**
 * Normalize documents retrieved from MongoDB to match Waterline's expectations
 *
 * @param {Array} models
 * @api public
 */

exports.normalizeResults = function normalizeResults(models, schema) {
    var _models = models.map(function(model) {
        var _model = exports._rewriteIds(model, schema);
        Object.keys(_model).forEach(function(key) {
            if (model[key] instanceof MongoBinary && _.has(_model[key], 'buffer')) {
                _model[key] = _model[key].buffer;
            }
        });
        return _model;
    });
    return _models;
};

/**
 * Check if an ID resembles a Mongo BSON ID.
 * Can't use the `hop` helper above because BSON ID's will have their own hasOwnProperty value.
 *
 * @param {String} id
 * @return {Boolean}
 * @api public
 */

exports.matchMongoId = function matchMongoId(id) {
    if (id === null) return false;
    var test = _.cloneDeep(id);
    if (typeof test.toString !== 'undefined') test = id.toString();
    return test.match(/^[a-fA-F0-9]{24}$/) ? true : false;
};

/**
 * Case Insensitive
 *
 * Wrap a value in a case insensitive regex
 * /^foobar$/i
 *
 * NOTE: this is really bad for production currently,
 * when you use a regex in the query it won't hit any
 * indexes. We need to fix this ASAP but for now it passes
 * all the waterline tests.
 *
 * @param {String} val
 * @return {String}
 * @api public
 */

exports.caseInsensitive = function caseInsensitive(val) {
    if (!_.isString(val)) return val;
    return val.replace(/[-[\]{}()+?*.\/,\\^$|#]/g, "\\$&");
};

/**
 * Parse URL string from config
 *
 * Parse URL string into connection config parameters
 *
 * @param {Object} config
 * @return {Object}
 * @api public
 */

exports.parseUrl = function parseUrl(config) {
    if (!_.isString(config.url)) return config;

    var obj = url.parse(config.url);

    config.host = obj.hostname || config.host;
    config.port = obj.port || config.port;

    if (_.isString(obj.path)) {
        config.database = obj.path.split("/")[1] || config.database;
    }

    if (_.isString(obj.auth)) {
        config.user = obj.auth.split(":")[0] || config.user;
        config.password = obj.auth.split(":")[1] || config.password;
    }

    return config;
};

exports.esc = function esc(val) {
    if (val == '*:*' || !_.isString(val)) return val;

    val = val.replace(/([\+\-!\(\)\{\}\[\]\$\^"~\*\?:\\])/g, function(match) {
            return '\\' + match;
        })
        .replace(/&&/g, '\\&\\&')
        .replace(/\|\|/g, '\\|\\|');

    return encodeURIComponent(val);
}

exports.escape = function escape(val) {
    if (val == '*:*') return val;
    if (_.isString(val)) {
        return '"' + val + '"';
        // console.log('EASCAPE'.rainbow.inverse,'"' + val.replace(/([\+\-!\(\)\{\}\[\]\^"~\*\?:\\])/g, function(match) {
        //         return '\\' + match;
        //     })
        //     .replace(/&&/g, '\\&\\&')
        //     .replace(/\|\|/g, '\\|\\|') + '"')
        return '"' + val.replace(/([\+\-!\(\)\{\}\[\]\^"~\*\?:\\])/g, function(match) {
                return '\\' + match;
            })
            .replace(/&&/g, '\\&\\&')
            .replace(/\|\|/g, '\\|\\|') + '"';
    } else {
        return val;
    }

}



exports.log = function log(msg, data, depth) {
    if (_.isObject(data)) {
        data = util.inspect(data, showHidden = true, depth = depth ||  5, colorize = true);
    }

    console.log('solr-hyperquest-client'.green.inverse + ' ' + msg.green, data || '');
}