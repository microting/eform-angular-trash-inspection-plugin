#!/bin/bash
export OS_USERNAME=$SWIFT_USER_NAME
export OS_TENANT_NAME=$SWIFT_TENANT_NAME
export OS_PASSWORD=$SWIFT_PASSWORD
export OS_AUTH_URL=http://172.16.4.4:5000/v2.0/
export OS_NO_CACHE=1
export PATH=/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin:/snap/bin
HOST=localhost
USER=root
PASS=$MYSQL_PASSWORD

FILENAME=`date "+backup-%Y-%m-%d-%H-%M.sql.gz"`

/usr/bin/mysqldump --host=$HOST --user=$USER --password=$PASS SWIFT_FOLDER_PREFIXEFormTrashInspectionPn | gzip > $FILENAME.gz
swift upload SWIFT_FOLDER_PREFIXEFormTrashInspectionPn $FILENAME.gz
rm $FILENAME.gz

export plugin_db_name="EFormTrashInspectionPn"
