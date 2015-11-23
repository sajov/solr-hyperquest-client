/**
 * Module dependencies
 */

var _ = require('lodash'),
    Qs = require('qs'),
    Aggregate = require('./aggregate'),
    utils = require('./utils'),
    hop = utils.object.hasOwnProperty,
    util = require('util');

var DEBUG = true;
/**
 * Query Constructor
 *
 * var input = {
 *     q:{} // string, array, object
 *     fq:{} // string, array, object
 *     fl: // string, array
 *     rows: int
 *     start: int
 *     OTHER //????
 * }
 * var output = {
 *     this.query: {
 *         q: // STRING!!!
 *         fq: // string, array(simple!)
 *         OPTHER //STRING
 *     }
 *     this.queryJSON: {
 *     }
 *     this.queryUri:'string'
 * }
 *
 * @param {Object} options
 * @api private
 */
var Query = module.exports = function Query(options, schema) {
    // Flag as an aggregate query or not
    this.aggregate = false;

    // Cache the schema for use in parseTypes
    this.schema = schema;

    // Check for Aggregate Options
    this.checkAggregate(options);

    this.criteria = options;
    // Merge default Query optional
    if (!_.isUndefined(this.schema) && hop(this.schema, 'defaultQuery')) {
        this.criteria = utils.mergeDefaultQuery(this.schema.defaultQuery, options);
    }
    // console.log('QUERY/INDEX', this.criteria);

    // Normalize Criteria
    this.query = this.normalizeCriteria(this.criteria);

    // Build Solr JSON Api query
    // this.queryJSON = this.jsonQuery(this.query);

    // Build Solr HTTP query
    this.queryUri = Qs.stringify(this.query, {
        arrayFormat: 'repeat'
    });

    // debug output
    this.queryUriFromated = decodeURIComponent(this.queryUri);

    return this;
};

/**
 * Normalize Criteria
 *
 * diff q and fq behavior
 * '<',
'lessThan',
'<=',
'lessThanOrEqual',
'>',
'greaterThan',
'>=',
'greaterThanOrEqual',
'!',
'not',
'like',
'contains',
'startsWith',
'endsWith',

 *
 * {
 *     name:'foo',               => name:foo
 *     age:{'!':32}              => !age:32
 *     mail:{'like':'gmx'}       => mail:*gmx*
 *     or: {                     => (city:mg OR street:*str*)
 *         city:'mg'
 *         street:{
 *             like:'str'
 *         }
 *     }
 *     country: ['de','fr','es'] => (country:de OR country:fr) || country:(de OR fr)
 * }
 *
 * q = [
 *      'name:foo',
 *      '!age:32',
 *      'mail:*gmx*',
 *      '(city:mg OR street:*str*)',
 *      'country:(de OR fr)',
 * ].join(' ' || ' AND  OR');
 *
 * q=name:foo !age:32 mail:*gmx* (city:mg OR street:*str*) AND (country:de OR country:fr)
 * q=name:foo !age:32 mail:*gmx* (city:mg OR street:*str*) AND country:(de OR fr)
 *
 * @param {Object} options
 * @return {Object}
 * @api private
 */
Query.prototype.normalizeCriteria = function normalizeCriteria(options) {
    "use strict";
    var self = this;

    var defaults = {
        where: '*:*',
        start: 0,
        limit: 30,
    }

    //TODO: extract fq from where
    if (_.has(options.where, 'fq')) {
        options.fq = options.where.fq;
        delete options.where.fq;
    }

    var query = _.defaults(options, defaults);
    if (_.isPlainObject(query.where) && _.isEmpty(query.where)) {
        query.where = '*:*';
    }

    console.log('normalizeCriteria', query);

    var normalizedOptions = _.reduce(query, function(result, val, key) {

        if (_.isEmpty(val) && _.isObject(val)) {
            return result;
        } else if (key === 'where' || key === 'q') {
            console.log('WHERE????', key, val);
            result['q'] = self.parseWhere(val);
            // log('EMPTY'.magenta, _.isEmpty(result['q']));
        } else if (key === 'fq') {
            result[key] = self.parseWhere(val);
        } else if (key === 'skip' || key === 'start') {
            result['start'] = parseInt(val);
        } else if (key === 'limit' || key === 'rows') {
            result['rows'] = parseInt(val);
        } else if (key === 'select' || key === 'fl') {
            result['fl'] = self.select(val);
        } else if (key === 'sort' || key === 'order') {
            result['sort'] = self.parseSort(val);
        } else {
            result[key] = val;
        }
        return result;
    }, {});


    if (_.isArray(normalizedOptions['sort'])) {
        normalizedOptions['sort'] = normalizedOptions['sort'].join(',');
    }

    //TODO NO plain string array and stingify would do fq=name:str&fq=age:32
    if (_.isArray(normalizedOptions['fq'])) {
        normalizedOptions['fq'] = normalizedOptions['fq'].join(',');
    }

    console.log('normalizeCriteria ????', query);

    return normalizedOptions;
};

/**
 * Parse Where
 *
 * <where> ::= <clause>
 *
 * @api private
 *
 * @param original
 * @returns {*}
 */
Query.prototype.parseWhere = function parseWhere(original) {
    "use strict";
    var self = this;
    // console.log('parseWhere',original);
    if (_.isNull(original)) {
        return {};
    } else if (_.isString(original)) {
        return original;
        // } else if (_.isObject(original)) { OR parseClause 244
        // } else if (_.isArray(original)) {
        //     _.original.forEach(function(element, index) {
        //         return self.parseClause(original);
        //     });
    } else {
        var ret = self.parseClause(original);
        return ret;
    };
};

Query.prototype.parseFq = function parseFq(original) {
    "use strict";
    var self = this;
    console.log('parseFq', original);

    if (_.isNull(original)) {
        return {};
    } else if (_.isString(original)) {
        return original;
        // } else if (_.isObject(original)) { OR parseClause 244
        // } else if (_.isArray(original)) {
        //     _.original.forEach(function(element, index) {
        //         return self.parseClause(original);
        //     });
    } else if (_.isArray(original)) {
        var normalizedOptions = _.reduce(original, function(result, val, key) {
            // result[key] = self.parseClause(val);
        }, []);
        return normalizedOptions;
    } else {
        var ret = self.parseClause(original);
    };
};

/**
 * Parse Clause
 *
 * <clause> ::= { <clause-pair>, ... }
 *
 * <clause-pair> ::= <field> : <expression>
 *                 | or|$or: [<clause>, ...]
 *                 | $or   : [<clause>, ...]
 *                 | $and  : [<clause>, ...]
 *                 | $nor  : [<clause>, ...]
 *                 | like  : { <field>: <expression>, ... }
 *
 * @api private
 *
 * @param original
 * @returns {*}
 */
Query.prototype.parseClause = function parseClause(original) {
    "use strict";
    var self = this;

    return _.reduce(original, function parseClausePair(obj, val, key) {
        "use strict";

        // q
        if (key === 'q') {
            if (_.isObject(val)) {
                obj.push(self.parseClause(val));
            } else {
                obj.push(val);
            }
            // OR
        } else if (key === 'or' || key === 'and') {
            //TODO:!!!!!
            var conatcat = ' ' + key + ' ';
            // console.log(val);
            // console.log(typeof val);
            obj.push('(' + _.transform(val, function(result, v, k) {
                // console.log(typeof v, v);
                _.forEach(v, function(v1, k2) {
                    // console.log([k2, v1].join(':'));
                    result.push([k2, v1].join(':'));
                    // return [v, k].join(':');
                })
            }, []).join(' OR ') + ')');
        } else if (key === '!') {
            console.log('obj', obj);
            val = utils.caseInsensitive(val.replace(/[%,\*]/g, ''));
            obj.push('!' + val);
        }
        // handle Like Operators for WQL (Waterline Query Language)
        else if (key === 'startsWith') {
            val = utils.caseInsensitive(val.replace(/[%,\*]/g, ''));
            obj.push(val + '*');
        } else if (key === 'endsWith') {
            val = utils.caseInsensitive(val.replace(/[%,\*]/g, ''));
            obj.push('*' + val);
        } else if (key === 'like' || key === 'contains') {
            console.log('parseClause LIKE || contains', key, val);
            val = utils.caseInsensitive(val.replace(/[%,\*]/g, ''));
            obj.push('*' + val + '*');
            // transform `like` clause into multiple `like` operator expressions
            // _.extend(obj, _.reduce(val, function parseLikeClauses(likes, expression, field) {
            //     likes[field] = self.parseExpression(field, {
            //         like: '*' + expression + '*'
            //     });
            //     return likes;
            // }, {}));
        }
        // Default
        else {
            if (_.isString(val)) {
                console.log('parseClause IS STRING!!', key, val);
                if (_.isNumber(key)) {
                    obj.push(self.escape(val));
                } else {
                    obj.push(key + ':' + val);

                }
            } else if (_.isPlainObject(val)) {
                console.log('parseClause IS isPlainObject!!', key, val);
                var res = self.parseExpression(key, val);
                obj.push(res);
                console.log('parseClause IS isPlainObject!! RES', res, obj);
                // obj.push(self.parseExpression(key, val));
            } else if (_.isArray(val)) {
                console.log('parseClause IS ARRAY!!');
                _.each(val, function(v, k) {
                    obj.push(self.parseExpression(key, v));
                })
            } else {
                console.log('parseClause ELSE');
                obj.push(key + ':' + val);
            }
        }

        return obj;
    }, [], original).join('+');
};


/**
 * Parse Expression
 *
 * <expression> ::= { <!|not>: <value> | [<value>, ...] }
 *                | { <$not>: <expression>, ... }
 *                | { <modifier>: <value>, ... }
 *                | [<value>, ...]
 *                | <value>
 
 * @api private
 *
 * @param field
 * @param expression
 * @returns {*}
 */
Query.prototype.parseExpression = function parseExpression(field, expression) {
    "use strict";
    var self = this;

    // console.log('Query.prototype.parseExpression,field, expression', field, expression);
    // Recursively parse nested unless value is a date
    if (_.isPlainObject(expression) && !_.isDate(expression)) {
        return _.reduce(expression, function(obj, val, modifier) {
            // console.log('Query.prototype.parseExpression obj, val, modifier', obj, val, modifier);

            // Handle `not`
            if (modifier === '!' || modifier.toLowerCase() === 'not') {

                if (_.isArray(val)) {
                    return '!' + field + ':' + val.join('+!' + field + ':');
                } else {
                    // modifier = _.isArray(val) ? '$nin' : '$ne';
                    // val = self.parseValue(field, modifier, val);
                    // if(val == 'bade')
                    // log('typeof field', typeof field);
                    if (_.isUndefined(field) || _.isNumber(field) || field == '') {
                        return ['!', '"' + val + '"'].join('');
                    } else {
                        return ['!', field, ':', val].join('');
                    }
                }
            }

            // WQL Evaluation Modifiers for String
            if (_.isString(val)) {
                // Handle `contains` by building up a case insensitive regex
                if (modifier === 'contains') {
                    val = utils.caseInsensitive(val.replace(/[%,\*]/g, ''));
                    return [field, ':', '*', val, '*'].join('');
                }

                // Handle `like`
                if (modifier === 'like') {
                    val = utils.caseInsensitive(val.replace(/[%,\*]/g, ''));
                    return [field, ':', '*', val, '*'].join('');
                }

                // Handle `startsWith` by setting a case-insensitive regex
                if (modifier === 'startsWith') {
                    val = utils.caseInsensitive(val.replace(/[%,\*]/g, ''));
                    return [field, ':', val, '*'].join('');
                }

                // Handle `endsWith` by setting a case-insensitive regex
                if (modifier === 'endsWith') {
                    val = utils.caseInsensitive(val.replace(/[%,\*]/g, ''));
                    return [field, ':', '*', val].join('');
                }
            }

            // Handle `lessThan` by transforming to $lt
            if (modifier === '<' || modifier === 'lessThan' || modifier.toLowerCase() === 'lt') {
                var range = !_.isUndefined(expression['>']) ? expression['>'] : '*';
                return [field, ':[' + range + ' TO ', val, ']'].join('');
            }

            // Handle `lessThanOrEqual` by transforming to $lte
            if (modifier === '<=' || modifier === 'lessThanOrEqual' || modifier.toLowerCase() === 'lte') {
                var range = !_.isUndefined(expression['>']) ? expression['>'] : '*';
                return [field, ':[' + range + ' TO ', val, ']'].join('');
            }

            // Handle `greaterThan` by transforming to $gt
            if (modifier === '>' || modifier === 'greaterThan' || modifier.toLowerCase() === 'gt') {
                var range = !_.isUndefined(expression['<']) ? expression['<'] : '*';
                return [field, ':[' + val + ' TO ', range, ']'].join('');
            }

            // Handle `greaterThanOrEqual` by transforming to $gte
            if (modifier === '>=' || modifier === 'greaterThanOrEqual' || modifier.toLowerCase() === 'gte') {
                var range = !_.isUndefined(expression['<']) ? expression['<'] : '*';
                return [field, ':[' + val + ' TO ', range, ']'].join('');
            }

            obj[modifier] = self.parseValue(field, modifier, val);
            return obj;
        }, []);
    }

    // <expression> ::= [value, ...], normalize array into mongo $in operator expression
    if (_.isArray(expression)) {
        console.log('parseExpression array');
        // return self.parseValue(field, '$in', expression);
        return field + ':' + expression;
    }

    console.log('parseExpression LAST');
    // <expression> ::= <value>, default equal expression
    return field + ':' + expression;
    // return self.parseValue(field, undefined, expression);
};


/**
 * Parse Value
 *
 * <value> ::= RegExp | Number | String
 *           | [<value>, ...]
 *           | <plain object>
 *
 * @api private
 *
 * @param field
 * @param modifier
 * @param val
 * @returns {*}
 */
Query.prototype.parseValue = function parseValue(field, modifier, val) {
    "use strict";
    var self = this;
    // Omit adding regex value to these modifiers
    var omitRegExModifiers = ['$ne', 'greaterThan', '>', 'gt', 'greaterThanOrEqual',
        '>=', 'gte', '$gt', '$gte', '<', 'lessThan', '<=',
        'lessThanOrEqual'
    ];

    // Look and see if the key is in the schema, id attribute and all association
    // attributes are objectid type by default (@see { @link collection._parseDefinition }).
    // if (!_.isUndefined(self.schema) && hop(self.schema, field) && self.schema[field].type === 'objectid') {

    //   // Check for array of Mongo ObjectId
    //   // If we have an array of IDs, attempt to make ObjectIds out of them.
    //   if (_.isArray(val)) {
    //     return _.map(val, function (item) {
    //       return _.isString(item) && utils.matchMongoId(item) ? new ObjectId(item) : item;
    //     });
    //   }

    //   // Check for Mongo ObjectId
    //   if (_.isString(val) && utils.matchMongoId(val)) {
    //     return new ObjectId(val.toString());
    //   }

    // }


    if (_.isString(val)) {

        // If we can verify that the field is NOT a string type, translate
        // certain values into booleans, date or null.  Otherwise they'll be left
        // as strings.
        if (!_.isUndefined(self.schema) && hop(self.schema, field) && self.schema[field].type != 'string') {

            if (self.schema[field].type === 'integer') {
                return parseInt(val);
            }

            if (self.schema[field].type === 'float') {
                return parseFloat(val);
            }

            if (val === "false") {
                return false;
            }

            if (val === "true") {
                return true;
            }

            if (val === "null") {
                return null;
            }

            if (self.schema[field].type === 'datetime') {
                return new Date(val);
            }

            if (self.schema[field].type === 'date') {
                return new Date(val);
            }

        }

        if (omitRegExModifiers.indexOf(modifier) > -1) {
            return val;
        }
        // Replace Percent Signs, with Solr Wildcard
        val = val.replace(/%/g, '*');
        return val;
    }

    // Array, RegExp, plain object, number
    return val;
};

Query.prototype.escape = function(s) {
    return s.replace(/([\+\-!\(\)\{\}\[\]\^"~\*\?:\\])/g, function(match) {
            return '\\' + match;
        })
        .replace(/&&/g, '\\&\\&')
        .replace(/\|\|/g, '\\|\\|')
        .replace(/ /g, '+');
}


/**
 * Parse Sort
 *
 * @param original
 * @returns {*}
 */
Query.prototype.parseSort = function(original) {
    "use strict";

    if (_.isString(original)) {
        return original.replace(' ', '+');
    } else if (_.isObject(original)) {
        return _.reduce(original, function(sort, order, field) {
            if (order == 1) order = 'asc';
            if (order == -1) order = 'desc';
            sort.push(field + '+' + order);
            return sort;
        }, [])
    } else if (_.isArray(original)) {}

};

Query.prototype.select = function(fl) {

    if (_.isString(fl)) {
        return fl;
    } else if (_.isArray(fl)) {
        return fl.join(',');
    } else if (_.isObject(fl)) {
        return _.reduce(fl, function(ret, dir, field) {
            ret.push(field + '+', dir);
        }, []).join(',')
    }
}

Query.prototype.skip = function() {
    querySolr.start = queryObj.skip || 0;
    delete queryObj.skip;
    return self;
}

Query.prototype.limit = function() {

    // console.log('LIMIT'.red.inverse,queryObj);
    if (queryObj.limit == 0) {
        querySolr.rows = 0;
    } else {
        querySolr.rows = queryObj.limit || 30;
    }
    delete queryObj.limit;
    return self;
}

/**
 * Check For Aggregates
 *
 * Checks the options to determine if an aggregate query is needed.
 *
 * @param {Object} options
 * @api private
 */
Query.prototype.checkAggregate = function checkAggregate(options) {
    var aggregateOptions = ['groupBy', 'sum', 'average', 'min', 'max'];
    var aggregates = _.intersection(aggregateOptions, Object.keys(options));

    if (aggregates.length === 0) return options;

    this.aggregateGroup = new Aggregate(options);
    this.aggregate = true;
};


Query.prototype.log = function() {
    // console.log('QueryBuilder'.cyan.inverse, arguments);
}


function log(msg, data, depth) {
    if (DEBUG == false) {
        return true;
    }
    var app = _.isUndefined('sails') ? false : true;

    if (_.isObject(data)) {
        data = inspect(data, depth);
    }

    if (app) {
        // sails.log.info(('ClusteringInverse ' + msg).red.inverse, data || {});
        console.log('    ' + 'solr Query.js'.yellow.inverse + ' ' + msg.green, data || '');
    } else {
        console.log('    ' + 'solr Query.js'.yellow.inverse + ' ' + msg.green, data || '');
    }
}

/**
 * Inspect helper
 * @param  mixed data Data to inspect
 * @return string
 */
function inspect(data, depth) {
    return util.inspect(data, true, depth ||  5, true);
}