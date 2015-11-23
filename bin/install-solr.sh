#!/bin/sh

if [[ $# -eq 0 ]] ; then
    echo 'solr version as argument 5.3.1'
    exit 1
fi

FILE="solr-$1.tgz"

if [ -f $FILE ];
then
  echo "File $FILE exists."
else
  URL="http://artfiles.org/apache.org/lucene/solr/$1/$FILE"
  echo "File $FILE does not exist. download $URL"
  wget $URL
  tar xfz $FILE
  rm $FILE
fi

cd solr-5.3.1
echo "Start Solr"
bin/solr start

