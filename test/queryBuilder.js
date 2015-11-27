'use strict';
var _ = require('lodash');
var util = require('util');
var Solr = require('../index');
var Query = require('../lib/query/');
var should = require('should');
var Qs = require('qs');

var client = new Solr.Client({
    host: 'localhost',
    port: '8080',
    instance: 'solr-510',
    core: 'schemaless'
});

var DEBUG = false;


/**
 * DEFAUTLS
 */

var extendedQuery = '&fl=*&start=0&rows=30';
var defaults = {
    where: '*:*',
    select: '*',
    start: 0,
    limit: 30,
}

var modelFilter = {
    fq: [{
        models_s: 'super2'
    }, {
        models_s: 'super2'
    }]
}



/**
 * TEST
 */

function testIt(tests) {

    describe('Test query builder', function() {

        _.forEach(test, function(queryObj, key) {

            var query = _.defaults(queryObj.query, defaults);
            var msg = util.inspect(queryObj, false, 1, true);
            msg = queryObj.desc;

            describe('Test ' + msg, function() {
                it(decodeURIComponent(queryObj.test
                    // queryObj.test + ' => ' + Qs.stringify(queryObj.query.where, {
                    //     arrayFormat: 'repeat'
                    // })
                ), function(done) {
                    // log('DESCRIPTION', queryObj.desc);
                    // log('queryObj', queryObj);
                    // console.log(JSON.stringify(queryObj.query.where));
                    var QueryObject = new Query(queryObj.query);
                    log('QueryObject.queryUriFromated', QueryObject.queryUriFromated);
                    log('queryObj.test + extendedQuery', queryObj.test + (queryObj.extendedQuery || extendedQuery));
                    QueryObject.queryUriFromated.should.equal(queryObj.test + (queryObj.extendedQuery || extendedQuery));

                    done();
                });
            });
        });
    });
}

var test = [{
        test: 'q=*:*',
        desc: 'empty q',
        query: {}
    }, {
        test: 'q=foo',
        desc: 'simple where string',
        query: {
            where: 'foo'
        }
    }, {
        test: 'q=foo',
        desc: 'nested where q',
        query: {
            where: {
                q: 'foo'
            }
        }
    }, {
        test: 'q=name:sajo+age:23',
        desc: 'where as object',
        query: {
            where: {
                name: 'sajo',
                age: 23
            }
        }
    }, {
        test: 'q=!name:sajo',
        desc: 'where IS NOT',
        query: {
            where: {
                name: {
                    '!': 'sajo'
                }
            }
        }
    }, {
        test: 'q=name:sajo+age:23',
        desc: 'where.q as object',
        query: {
            where: {
                q: {
                    name: 'sajo',
                    age: 23
                }
            }
        }
    }, {
        test: 'q=*:*&sort=name+desc',
        desc: 'test simple sort',
        query: {
            where: {},
            sort: {
                name: 'desc'
            }
        }
    }, {
        test: 'q=name:walter+state:new mexico',
        desc: ('test WATERLINE Key Pairs'.magenta + '  https://github.com/balderdashy/waterline-docs/blob/master/queries/query-language.md#key-pairs'.white),
        query: {
            where: {
                name: 'walter',
                state: 'new mexico'
            },
        }
    }, {
        test: 'q=name:*alt*',
        desc: ('test WATERLINE Modified Pairs'.magenta + '  https://github.com/balderdashy/waterline-docs/blob/master/queries/query-language.md#modified-pairs'.white),
        query: {
            where: {
                name: {
                    'contains': 'alt'
                }
            },
        }
    }, {
        test: 'q=!name:Walter+!name:Skyler',
        desc: ('test WATERLINE Not-In Pairs'.magenta + '  https://github.com/balderdashy/waterline-docs/blob/master/queries/query-language.md#modified-pairs'.white),
        query: {
            where: {
                name: {
                    '!': ['Walter', 'Skyler']
                }
            },
        }
    }, {
        test: 'q=(name:walter OR occupation:teacher)',
        desc: ('test WATERLINE Or Pairs'.magenta + '  https://github.com/balderdashy/waterline-docs/blob/master/queries/query-language.md#or-pairs'.white),
        query: {
            where: {
                or: [{
                    name: 'walter'
                }, {
                    occupation: 'teacher'
                }]
            },
        }
    }, {
        test: 'q=age:23+(name:walter OR occupation:teacher)',
        desc: ('test WATERLINE Or Pairs COMPLEX'.magenta + '  https://github.com/balderdashy/waterline-docs/blob/master/queries/query-language.md#or-pairs'.white),
        query: {
            where: {
                age: 23,
                or: [{
                    name: 'walter'
                }, {
                    occupation: 'teacher'
                }]
            },
        }
    }, {
        test: 'q=age:[* TO 30]',
        desc: ('test WATERLINE < / lessThan'.magenta + '  https://github.com/balderdashy/waterline-docs/blob/master/queries/query-language.md#--lessthan'.white),
        query: {
            where: {
                age: {
                    '<': 30
                }
            },
        }
    }, {
        test: 'q=age:[* TO 30]+posts:[* TO 30]',
        desc: ('test WATERLINE < / lessThan'.magenta + '  https://github.com/balderdashy/waterline-docs/blob/master/queries/query-language.md#--lessthan'.white),
        query: {
            where: {
                age: {
                    '<': 30
                },
                posts: {
                    'lessThan': 30
                }
            },
        }
    }, {
        test: 'q=age:[30 TO *]+posts:[30 TO *]+threads:[30 TO *]',
        desc: ('test WATERLINE < / lessThan COMPLEX'.magenta + '  https://github.com/balderdashy/waterline-docs/blob/master/queries/query-language.md#--lessthan'.white),
        query: {
            where: {
                age: {
                    '>': 30
                },
                posts: {
                    'greaterThan': 30
                },
                threads: {
                    'gt': 30
                }
            },
        }
    }, {
        test: 'q=age:[* TO 30]',
        desc: ('test WATERLINE <= / lessThanOrEqual'.magenta + '  https://github.com/balderdashy/waterline-docs/blob/master/queries/query-language.md#--lessthanorequal'.white),
        query: {
            where: {
                age: {
                    '<=': 30
                },
            },
        }
    }, {
        test: 'q=!age:30',
        desc: ('test WATERLINE ! / not'.magenta + '  https://github.com/balderdashy/waterline-docs/blob/master/queries/query-language.md#--not'.white),
        query: {
            where: {
                age: {
                    '!': 30
                }
            },
        }
    }, {
        test: 'q=name:*bob*',
        desc: ('test WATERLINE contains'.magenta + '  https://github.com/balderdashy/waterline-docs/blob/master/queries/query-language.md#contains'.white),
        query: {
            where: {
                name: {
                    'contains': 'bob'
                }
            },
        }
    }, {
        test: 'q=class:american*',
        desc: ('test WATERLINE startsWith'.magenta + '  https://github.com/balderdashy/waterline-docs/blob/master/queries/query-language.md#startswith'.white),
        query: {
            where: {
                class: {
                    'startsWith': 'american'
                }
            },
        }
    }, {
        test: 'q=class:*can+alias:*mer*+test:*mer*',
        desc: ('test WATERLINE endsWith'.magenta + '  https://github.com/balderdashy/waterline-docs/blob/master/queries/query-language.md#endswith'.white),
        query: {
            where: {
                class: {
                    'endsWith': 'can'
                },
                alias: {
                    'like': 'mer'
                },
                test: {
                    'like': '%mer%'
                }
            },
        }
    }, {
        test: 'q=date:[2/4/2014 TO 2/7/2014]',
        desc: ('test WATERLINE ! / not'.magenta + '  https://github.com/balderdashy/waterline-docs/blob/master/queries/query-language.md#date-ranges'.white),
        query: {
            where: {
                date: {
                    '>': '2/4/2014',
                    '<': '2/7/2014'
                }
            },
        }
    },



    {
        test: 'q=foo',
        desc: 'simple string without field',
        query: {
            where: 'foo'
        }
    }, {
        test: 'q=!name:sajo&fl=name',
        desc: ' not and select',
        extendedQuery: '&start=0&rows=30',
        query: {
            where: {
                name: {
                    '!': 'sajo'
                }
            },
            select: ['name']
        }
    },

    {
        test: 'q=foo+bar',
        desc: 'simple string array without field reference',
        query: {
            where: ['foo', 'bar']
        }
    }, {
        test: 'q=foo+super+bar',
        desc: 'simple string multi term array without field reference',
        query: {
            where: ['foo', 'super bar']
        }
    }, {
        test: 'q=*foo*',
        desc: 'like wthout field reference',
        query: {
            where: {
                'like': 'foo'
            }
        }
    },

    {
        test: 'q=name:foo+!super bar',
        desc: 'mixed field referenced and not',
        query: {
            where: {
                name: 'foo',
                '!': 'super bar'
            }
        }
    }, {
        test: 'q=*like*',
        desc: 'like without field reference',
        query: {
            where: {
                'like': 'like*'
            }
        }
    }, {
        test: 'q=*contains*',
        query: {
            where: {
                'contains': 'contains'
            }
        }
    }, {
        test: 'q=startsWith*',
        query: {
            where: {
                'startsWith': 'startsWith'
            }
        }
    }, {
        test: 'q=*endsWith',
        query: {
            where: {
                'endsWith': 'endsWith'
            }
        }
    }, {
        test: 'q=!bade',
        desc: ' not without field',
        query: {
            where: {
                '!': 'bade'
            }
        }
    }, {
        test: 'q=name:foo',
        desc: 'simple field value',
        query: {
            where: {
                name: 'foo'
            }
        }
    }, {
        test: 'q=name:*alt*',
        desc: 'simple contains',
        query: {
            where: {
                name: {
                    'contains': 'alt'
                }
            }
        }
    }, {
        test: 'q=name:Walter+name:Skyler',
        desc: ' field with Array of values' + ' TODO: what field:(val) or field:val[0]+field:val[1]'.cyan,
        query: {
            where: {
                name: ['Walter', 'Skyler']
            }
        }
    },


    {
        test: 'q=!name:Walter+!name:Skyler',
        desc: ' not Array',
        query: {
            where: {
                name: {
                    '!': ['Walter', 'Skyler']
                }
            }
        }
    }, {
        test: 'q=(name:walter OR occupation:teacher)',
        desc: ('test WTF     '.white),
        query: {
            where: {
                or: [{
                    name: 'walter'
                }, {
                    occupation: 'teacher'
                }]
            }
        }
    }, {
        test: 'q=(name:walter OR occupation:teacher)',
        desc: ('test WATERLINE Or Pairs COMPLEX'.magenta + '  https://github.com/balderdashy/waterline-docs/blob/master/queries/query-language.md#or-pairs'.white),
        query: {
            where: {
                or: [{
                    name: 'walter'
                }, {
                    occupation: 'teacher'
                }]
            },
        }
    }, {
        test: 'q=(name:walter OR occupation:teacher)',
        desc: ('test WATERLINE Or Pairs COMPLEX'.magenta + '  https://github.com/balderdashy/waterline-docs/blob/master/queries/query-language.md#or-pairs'.white),
        query: {
            where: {
                or: [{
                    name: 'walter'
                }, {
                    occupation: 'teacher'
                }]
            },
        }
    }, {
        test: 'q=!name:Walter+!name:Skyler',
        desc: ' not with array',
        query: {
            where: {
                name: {
                    '!': ['Walter', 'Skyler']
                }
            }
        }
    }, {
        test: 'q=age:[* TO 30]',
        desc: ' less' + ' test LESS also'.cyan,
        query: {
            where: {
                age: {
                    '<': 30
                }
            }
        }
    }, {
        test: 'q=age:[* TO 30]',
        desc: ' lessThan' + ' test LESSTHAN also'.cyan,
        query: {
            where: {
                age: {
                    '<=': 30
                }
            }
        }
    }, {
        test: 'q=age:[30 TO *]',
        desc: ' greater' + ' test greaterThan also'.cyan,
        query: {
            where: {
                age: {
                    '>': 30
                }
            }
        }
    }, {
        test: 'q=age:[18 TO *]',
        desc: 'range greater',
        query: {
            where: {
                age: {
                    '>': 18
                }
            }
        }
    }, {
        test: 'q=age:[21 TO *]',
        desc: 'range greaterThan',
        query: {
            where: {
                age: {
                    '>=': 21
                }
            }
        }
    }, {
        test: 'q=!name:foo',
        desc: 'not contain',
        query: {
            where: {
                name: {
                    '!': 'foo'
                }
            }
        }
    }, {
        test: 'q=food:*beans*',
        desc: 'like without asterix',
        query: {
            where: {
                food: {
                    'like': 'beans'
                }
            }
        }
    }, {
        test: 'q=food:*beans*',
        desc: 'like with asterix',
        query: {
            where: {
                food: {
                    'like': 'beans*'
                }
            }
        }
    }, {
        test: 'q=class:*history*',
        desc: 'contains',
        query: {
            where: {
                class: {
                    'contains': 'history'
                }
            }
        }
    }, {
        test: 'q=class:*history*',
        desc: 'like',
        query: {
            where: {
                class: {
                    'like': '*history*'
                }
            }
        }
    }, {
        test: 'q=class:ameri*',
        desc: 'startsWith',
        query: {
            where: {
                class: {
                    'startsWith': 'ameri'
                }
            }
        }
    }, {
        test: 'q=class:*american*',
        desc: 'like',
        query: {
            where: {
                class: {
                    'like': 'american'
                }
            }
        }
    }, {
        test: 'q=class:*can',
        desc: 'endsWith',
        query: {
            where: {
                class: {
                    'endsWith': 'can'
                }
            }
        }
    }, {
        test: 'q=class:*can*',
        desc: 'like with percentile',
        query: {
            where: {
                class: {
                    'like': '%can'
                }
            }
        }
    },


    {
        test: 'q=name:foo&sort=name+asc',
        desc: 'sort with 1 as asc',
        query: {
            where: {
                name: 'foo'
            },
            sort: {
                'name': 1
            }
        }
    },

    {
        test: 'q=name:foo&sort=name+desc',
        desc: 'sort with -1 as desc',
        query: {
            where: {
                name: 'foo'
            },
            sort: {
                'name': -1
            }
        }
    }, {
        test: 'q=foo&sort=name+desc',
        desc: 'sort as complete string ',
        query: {
            where: 'foo',
            sort: 'name desc'
        }
    }, {
        test: 'q=name:foo&sort=name+asc,age+desc',
        desc: 'sort multiple ',
        query: {
            where: {
                name: 'foo'
            },
            sort: {
                name: 1,
                age: -1
            }
        }
    }, {
        test: 'q=name:foo&fl=name',
        desc: ' test SELECT as array',
        extendedQuery: '&start=0&rows=30',
        query: {
            where: {
                name: 'foo'
            },
            select: ['name']
        }
    }, {
        test: 'q=(id:123 OR id:456 OR id:789)',
        desc: ' test Or Pairs COMPLEX multivalue on same field',
        query: {
            where: {
                or: [{
                    id: 123
                }, {
                    id: 456
                }, {
                    id: 789
                }]
            },
            // select: ['name']
        }
    }, {
        test: 'q=name:foo+model:modelA&fq=model:modelA',
        desc: ' test Or Pairs COMPLEX multivalue on same field',
        query: {
            where: {
                name: 'foo',
                model: 'modelA'
            },
            fq: {
                model: 'modelA'
            }
            // select: ['name']
        }
    },
    //  {
    //     test: 'q=name:foo+model:modelA&fq=model:modelA',
    //     desc: ' test Or Pairs COMPLEX multivalue on same field',
    //     query: {
    //         where: {
    //             name: 'foo',
    //             model: 'modelA'
    //         },
    //         fq: [{
    //             model: 'modelA'
    //         }, {
    //             col: 'colA'
    //         }]
    //         // select: ['name']
    //     }
    // },
    //  {
    //     test: 'q=(a OR b OR b)',
    //     testNO: 'q=(a OR b OR b)',
    //     desc: 'escape q ' + ' add &q.op=OR'.cyan,
    //     query: {
    //         where: {
    //             or: [{
    //                 q: 'a'
    //             }, {
    //                 q: 'b'
    //             }, {
    //                 q: 'b'
    //             }]
    //         },
    //         // select: ['name']
    //     }
    // },
    // {
    //     test: 'q=*:*&fq=city:ny',
    //     query: {
    //         where: {
    //             fq: {
    //                 'city': 'ny'
    //             }
    //         }
    //     }
    // },
    //      {
    //         test: 'q=*:*&fq=city:ny',
    //         query: {
    //             fq: {
    //                 'city': 'ny'
    //             }
    //         }
    //     }, {
    //         test: 'q=*:*&fq=name:a&fq=street:b&fq=city:b',
    //         query: {
    //             where: {
    //                 fq: [{
    //                     'name': 'a'
    //                 }, {
    //                     'street': 'b'
    //                 }, {
    //                     'city': 'b'
    //                 }]
    //             },
    //         }
    //     }, {
    //         test: 'q=*:*&fq=name:a&fq=street:b&fq=city:b',
    //         query: {
    //             fq: [{
    //                 'name': 'a'
    //             }, {
    //                 'street': 'b'
    //             }, {
    //                 'city': 'b'
    //             }]
    //         }
    //     }, {
    //         test: 'q=*:*&fq=(farbe_c:* OR groesse_c:*) AND marke_c:*',
    //         query: {
    //             where: [{
    //                 'q': '*:*&+'
    //             }, {
    //                 'fq': '(farbe_c:* OR groesse_c:*) AND marke_c:*'
    //             }]
    //         }
    //     },
    //  {
    //     test: 'q=*:*&fq=name:a&fq=street:b&fq=city:b',
    //     query: {
    //         fq: {
    //             or: [{
    //                 'farbe_c': '*'
    //             }, {
    //                 'groesse_': '*'
    //             }, {
    //                 'city': 'b'
    //             }]
    //         }
    //     }
    // },
    //     /* not working */
    //     {
    //         test: 'q=*:*&fq=city:*ny*',
    //         query: {
    //             fq: {
    //                 'city': {
    //                     'contains': 'ny'
    //                 }
    //             }
    //         }
    //     }
    //      {
    //     test: 'q=name:foo+!super bar',
    //     desc: 'mixed field referenced and not',
    //     query: {
    //         where: {
    //             name: 'foo',
    //             '!': 'super bar'
    //         }
    //     }
    // },
];

log(' ');
log(' ');
log(' ');
log('START TESTS =============================================================');
testIt(test);

var d = {

    fq: {
        'model': 'super'
    },
    sort: 'name',
    limit: 30,
}

var u = {
    where: {
        name: 'a'
    },
    limit: 100,
    fq: {
        age: 10
    },
}

// log('defaults', _.defaultsDeep(u, d));

// var testEach = _.defaults(defaults, modelFilter);
// _.each(testEach, function(val, key) {
//     log('EACH', {
//         key: key,
//         val: val
//     });
// });

// var testquery = {
//     q: '!name:sajo age:12222',
//     fq: [

//         'models_s:super',
//         'models_s:super2'
//     ],
//     'group.field': 'name',
//     'group.limit': 1,
//     'group.format': 'simple'
// }

// log('stest ', _.defaults(testquery, defaults));

// log('stest STRINGIFY', Qs.stringify(testquery, {
//     arrayFormat: 'repeat'
// }));
// log('stest decodeURIComponent STRINGIFY', decodeURIComponent(Qs.stringify(_.defaults(testquery, defaults), {
//     arrayFormat: 'repeat'
// })));
// log('ORG', Qs.stringify({
//     a: ['b', 'c'],
//     b: ['b', 'c'],
// }, {
//     arrayFormat: 'repeat'
// }))

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
        console.log('    ' + 'solr query.js'.green.inverse + ' ' + msg.green, data || '');
    } else {
        console.log('    ' + 'solr query.js'.green.inverse + ' ' + msg.green, data || '');
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