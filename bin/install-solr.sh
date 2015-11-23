#!/bin/sh
wget http://artfiles.org/apache.org/lucene/solr/5.3.1/solr-5.3.1.tgz
tar xfz solr-5.3.1.tgz
cd solr-5.3.1
bin/solr start