DB=test
COLLECTIONS=$(mongo localhost:27017/$DB --quiet --eval "db.getCollectionNames()" | tr -d '\[\]\"[:space:]' | tr ',' ' ')

for collection in $COLLECTIONS; do
    echo "Exporting $DB/$collection ..."
    mongoexport -d $DB -c $collection -o $collection.json
done
