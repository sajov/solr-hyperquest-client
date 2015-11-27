/**
 * @apiName SolrHyperquest
 * @apiVersion 0.1.1
 */

'use strict';
var util = require('util');
var Solr = require('../index');
var should = require('should');

var client = {};

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
 * @api {get} /model/create/core create Core
 * @apiSampleRequest http://localhost:1337/solr/create/core
 */
describe('Test sharding api', function() {

    before(function() {
        client = new Solr.Client({
            host: 'localhost',
            port: '8983',
            instance: 'solr',
            core: 'schemaless'
        });
    });

    /**
     * Create a Collection
     * /admin/collections?action=CREATE&name=name&numShards=number&replicationFactor=number&maxShardsPerNode=number&createNodeSet=nodelist&collection.configName=configname
     */
    describe('/admin/collections?action=CREATE: create a collection', function() {
        it('responseHeader should return status:0', function(done) {
            client.replication({
                    action: 'CREATE',
                    name: 'newCollection',
                    numShards: 2,
                    replicationFactor: 1
                    // maxShardsPerNode:'number',
                    // createNodeSet:'nodelist',
                    // collection.configName:'configname'
                },
                function(err, data) {
                    console.log('replication'.yellow, err, inspect(data));
                    data.responseHeader.status.should.be.equal(0);
                    done();
                });
        });
    });

    /**
     * Reload a Collection
     * /admin/collections?action=RELOAD&name= name
     */
    describe('/admin/collections?action=RELOAD: reload a collection', function() {
        it('responseHeader should return status:0', function(done) {
            client.replication({
                    action: 'RELOAD',
                    name: 'newCollection'
                },
                function(err, data) {
                    console.log('replication'.yellow, err, inspect(data));
                    data.responseHeader.status.should.be.equal(0);
                    done();
                });
        });
    });

    /**
     * Split a Shard
     * /admin/collections?action=SPLITSHARD&collection=name&shard=shardID
     */
    describe('/admin/collections?action=SPLITSHARD: split a shard into two new shards', function() {
        it('responseHeader should return status:0', function(done) {
            client.replication({
                    action: 'SPLITSHARD',
                    collection: 'anotherCollection',
                    shard: 'shard1',
                    // ranges:'',
                    // 'split.key':'',
                    // 'property.name':'',
                    // 'async':'',
                },
                function(err, data) {
                    console.log('replication'.yellow, err, inspect(data));
                    data.responseHeader.status.should.be.equal(0);
                    done();
                });
        });
    });

    /**
     * Create a Shard
     * Shards can only created with this API for collections that use the 'implicit' router. Use SPLITSHARD for collections using the 'compositeId' router. A new shard with a name can be created for an existing 'implicit' collection.
     * /admin/collections?action=CREATESHARD&shard=shardName&collection=name
     */

    describe('/admin/collections?action=CREATESHARD: create a new shard', function() {
        it('responseHeader should return status:0', function(done) {
            client.replication({
                    action: 'CREATESHARD',
                    collection: 'anImplicitCollection',
                    shard: 'shard-z',
                    // createNodeSet:'',
                    // 'property.name':'',
                },
                function(err, data) {
                    console.log('replication'.yellow, err, inspect(data));
                    data.responseHeader.status.should.be.equal(0);
                    done();
                });
        });
    });

    /**
     * Delete a Shard
     * Deleting a shard will unload all replicas of the shard and remove them from clusterstate.json. It will only remove shards that are inactive, or which have no range given for custom sharding.
     * /admin/collections?action=DELETESHARD&shard=shardID&collection=name
     */
    describe('/admin/collections?action=DELETESHARD: delete an inactive shard', function() {
        it('responseHeader should return status:0', function(done) {
            client.replication({
                    action: 'DELETESHARD',
                    collection: 'anotherCollection',
                    shard: 'shard1',
                },
                function(err, data) {
                    console.log('replication'.yellow, err, inspect(data));
                    data.responseHeader.status.should.be.equal(0);
                    done();
                });
        });
    });

    /**
     * Create or modify an Alias for a Collection
     * The CREATEALIAS action will create a new alias pointing to one or more collections. If an alias by the same name already exists, this action will replace the existing alias, effectively acting like an atomic "MOVE" command.
     * /admin/collections?action=CREATEALIAS&name=name&collections=collectionlist
     */
    describe('/admin/collections?action=CREATEALIAS: create or modify an alias for a collection', function() {
        it('responseHeader should return status:0', function(done) {
            client.replication({
                    action: 'CREATEALIAS',
                    name: 'testalias',
                    collections: 'anotherCollection,testCollection',
                },
                function(err, data) {
                    console.log('replication'.yellow, err, inspect(data));
                    data.responseHeader.status.should.be.equal(0);
                    done();
                });
        });
    });

    /**
     * Delete a Collection Alias
     * /admin/collections?action=DELETEALIAS&name=name
     */
    describe('/admin/collections?action=DELETEALIAS: delete an alias for a collection', function() {
        it('responseHeader should return status:0', function(done) {
            client.replication({
                    action: 'DELETEALIAS',
                    name: 'testalias'
                },
                function(err, data) {
                    console.log('replication'.yellow, err, inspect(data));
                    data.responseHeader.status.should.be.equal(0);
                    done();
                });
        });
    });

    /**
     * Delete a Collection
     * /admin/collections?action=DELETE&name=collection
     */
    describe('/admin/collections?action=DELETE: delete a collection', function() {
        it('responseHeader should return status:0', function(done) {
            client.replication({
                    action: 'DELETE',
                    name: 'newCollection'
                },
                function(err, data) {
                    console.log('replication'.yellow, err, inspect(data));
                    data.responseHeader.status.should.be.equal(0);
                    done();
                });
        });
    });


    /**
     * Delete a Replica
     * /admin/collections?action=DELETEREPLICA&collection=collection&shard=shard&replica=replica
     */
    describe('/admin/collections?action=DELETEREPLICA: delete a replica of a shard', function() {
        it('responseHeader should return status:0', function(done) {
            client.replication({
                    action: 'DELETEREPLICA',
                    collection: 'test2',
                    shard: 'shard2',
                    replica: 'core_node3',
                },
                function(err, data) {
                    console.log('replication'.yellow, err, inspect(data));
                    data.responseHeader.status.should.be.equal(0);
                    done();
                });
        });
    });

    /**
     * Add Replica
     * /admin/collections?action=ADDREPLICA&collection=collection&shard=shard&node=solr_node_name
     */
    describe('/admin/collections?action=ADDREPLICA: add a replica of a shard', function() {
        it('responseHeader should return status:0', function(done) {
            client.replication({
                    action: 'ADDREPLICA',
                    collection: 'test2',
                    shard: 'shard2',
                    node: '192.167.1.2:8983_solr',
                    // '_route_':'',
                    // 'instanceDir':'',
                    // 'dataDir':'',
                    // 'property.name':'',
                    // 'async':'',
                },
                function(err, data) {
                    console.log('replication'.yellow, err, inspect(data));
                    data.responseHeader.status.should.be.equal(0);
                    done();
                });
        });
    });

    /**
     * Cluster Properties
     * /admin/collections?action=CLUSTERPROP&name=propertyName&val=propertyValue
     */
    describe('/admin/collections?action=CLUSTERPROP: Add/edit/delete a cluster-wide property', function() {
        it('responseHeader should return status:0', function(done) {
            client.replication({
                    action: 'CLUSTERPROP',
                    name: 'urlScheme',
                    val: 'https',
                },
                function(err, data) {
                    console.log('replication'.yellow, err, inspect(data));
                    data.responseHeader.status.should.be.equal(0);
                    done();
                });
        });
    });

    /**
     * Migrate Documents to Another Collection
     * /admin/collections?action=MIGRATE&collection=name&split.key=key1!&target.collection=target_collection&forward.timeout=60
     */
    describe('/admin/collections?action=MIGRATE: Migrate documents to another collection', function() {
        it('responseHeader should return status:0', function(done) {
            client.replication({
                    action: 'MIGRATE',
                    collection: 'test1',
                    'split.key': 'a!',
                    'target.collection': 'test2',
                    // 'forward.timeout':'int',
                    // 'property.name':'',
                    //  async:'',
                },
                function(err, data) {
                    console.log('replication'.yellow, err, inspect(data));
                    data.responseHeader.status.should.be.equal(0);
                    done();
                });
        });
    });

    /**
     * Add Role
     * /admin/collections?action=ADDROLE&role=roleName&node=nodeName
     */
    describe('/admin/collections?action=ADDROLE: Add a specific role to a node in the cluster', function() {
        it('responseHeader should return status:0', function(done) {
            client.replication({
                    action: 'ADDROLE',
                    role: 'overseer',
                    node: '192.167.1.2:8983_solr'
                },
                function(err, data) {
                    console.log('replication'.yellow, err, inspect(data));
                    data.responseHeader.status.should.be.equal(0);
                    done();
                });
        });
    });

    /**
     * Remove Role
     * /admin/collections?action=REMOVEROLE&role=roleName&node=nodeName
     */
    describe('/admin/collections?action=REMOVEROLE: Remove an assigned role', function() {
        it('responseHeader should return status:0', function(done) {
            client.replication({
                    action: 'REMOVEROLE',
                    role: 'overseer',
                    node: '192.167.1.2:8983_solr',
                },
                function(err, data) {
                    console.log('replication'.yellow, err, inspect(data));
                    data.responseHeader.status.should.be.equal(0);
                    done();
                });
        });
    });

    /**
     * Overseer status and statistics
     * /admin/collections?action=OVERSEERSTATUS
     */
    describe('/admin/collections?action=OVERSEERSTATUS: Get status and statistics of the overseer', function() {
        it('responseHeader should return status:0', function(done) {
            client.replication({
                    action: 'OVERSEERSTATUS'
                },
                function(err, data) {
                    console.log('replication'.yellow, err, inspect(data));
                    data.responseHeader.status.should.be.equal(0);
                    done();
                });
        });
    });

    /**
     * Cluster Status
     * /admin/collections?action=CLUSTERSTATUS
     */
    describe('/admin/collections?action=CLUSTERSTATUS: Get cluster status', function() {
        it('responseHeader should return status:0', function(done) {
            client.replication({
                    action: 'CLUSTERSTATUS',
                    // collection:'newCollection',
                    // shrd:'shard',
                },
                function(err, data) {
                    console.log('replication'.yellow, err, inspect(data));
                    data.responseHeader.status.should.be.equal(0);
                    done();
                });
        });
    });

    /**
     * Request Status
     * /admin/collections?action=REQUESTSTATUS&requestid=request-id
     */
    describe('/admin/collections?action=REQUESTSTATUS: Get the status of a previous asynchronous request', function() {
        it('responseHeader should return status:0', function(done) {
            client.replication({
                    action: 'REQUESTSTATUS',
                    requestid: 1000
                },
                function(err, data) {
                    console.log('replication'.yellow, err, inspect(data));
                    data.responseHeader.status.should.be.equal(0);
                    done();
                });
        });
    });

    /**
     * List Collections
     * /admin/collections?action=LIST
     */
    describe('/admin/collections?action=LIST: List all collections', function() {
        it('responseHeader should return status:0', function(done) {
            client.replication({
                    action: 'LIST'
                },
                function(err, data) {
                    console.log('replication'.yellow, err, inspect(data));
                    data.responseHeader.status.should.be.equal(0);
                    done();
                });
        });
    });

    /**
     * Add Replica Property
     * /admin/collections?action=ADDREPLICAPROP&collection=collectionName&shard=shardName&replica=replicaName&property=propertyName&property.value=value
     */
    describe('/admin/collections?action=ADDREPLICAPROP: Add an arbitrary property to a replica specified by collection/shard/replica', function() {
        it('responseHeader should return status:0', function(done) {
            client.replication({
                    action: 'ADDREPLICAPROP',
                    shard: 'shard1',
                    collection: 'collection1',
                    replica: 'core_node1',
                    property: 'preferredLeader',
                    'property.value': 'true'
                },
                function(err, data) {
                    console.log('replication'.yellow, err, inspect(data));
                    data.responseHeader.status.should.be.equal(0);
                    done();
                });
        });
    });

    /**
     * Delete Replica Property
     * /admin/collections?action=DELETEREPLICAPROP&collection=collectionName&shard=shardName&replica=replicaName&property=propertyName
     */
    describe('/admin/collections?action=DELETEREPLICAPROP: Delete an arbitrary property from a replica specified by collection/shard/replica', function() {
        it('responseHeader should return status:0', function(done) {
            client.replication({
                    action: 'DELETEREPLICAPROP',
                    shard: 'shard1',
                    collection: 'collection1',
                    replica: 'core_node1',
                    property: 'preferredLeader',
                },
                function(err, data) {
                    console.log('replication'.yellow, err, inspect(data));
                    data.responseHeader.status.should.be.equal(0);
                    done();
                });
        });
    });

    /**
     * Balance a  Property
     * /admin/collections?action=BALANCESHARDUNIQUE&collection=collectionName&property=propertyName
     */
    describe('/admin/collections?action=BALANCESHARDUNIQUE: Distribute an arbitrary property, one per shard, across the nodes in a collection', function() {
        it('responseHeader should return status:0', function(done) {
            client.replication({
                    action: 'BALANCESHARDUNIQUE',
                    collection: 'collection1',
                    property: 'preferredLeader',
                    // property:'property.preferredLeader'
                },
                function(err, data) {
                    console.log('replication'.yellow, err, inspect(data));
                    data.responseHeader.status.should.be.equal(0);
                    done();
                });
        });
    });

    /**
     * Rebalance Leaders
     * Reassign leaders in a collection according to the preferredLeader property across active nodes.
     * /admin/collections?action=REBALANCELEADERS&collection=collectionName
     */
    describe('/admin/collections?action=REBALANCELEADERS:  Distribute leader role  based on the "preferredLeader" assignments', function() {
        it('responseHeader should return status:0', function(done) {
            client.replication({
                    action: 'REBALANCELEADERS',
                    collection: 'collection1',
                    // maxAtOnce:5,
                    // maxWaitSeconds:30,
                },
                function(err, data) {
                    console.log('replication'.yellow, err, inspect(data));
                    data.responseHeader.status.should.be.equal(0);
                    done();
                });
        });
    });

});