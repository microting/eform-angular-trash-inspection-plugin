#!/bin/bash

cd ~

rm -fR Documents/workspace/microting/eform-angular-trashinspection-plugin/eform-client/src/app/plugins/modules/trash-inspection-pn

cp -r Documents/workspace/microting/eform-angular-frontend/eform-client/src/app/plugins/modules/trash-inspection-pn Documents/workspace/microting/eform-angular-trashinspection-plugin/eform-client/src/app/plugins/modules/trash-inspection-pn

rm -fR Documents/workspace/microting/eform-angular-trashinspection-plugin/eFormAPI/Plugins/TrashInspection.Pn

cp -r Documents/workspace/microting/eform-angular-frontend/eFormAPI/Plugins/TrashInspection.Pn Documents/workspace/microting/eform-angular-trashinspection-plugin/eFormAPI/Plugins/TrashInspection.Pn

# Test files rm

rm -fR Documents/workspace/microting/eform-angular-trashinspection-plugin/eform-client/e2e/Tests/trash-inspections-settings
rm -fR Documents/workspace/microting/eform-angular-trashinspection-plugin/eform-client/e2e/Tests/trash-inspection-general 
rm -fR Documents/workspace/microting/eform-angular-trashinspection-plugin/eform-client/e2e/Page\ objects/trashinspection
rm -fR Documents/workspace/microting/eform-angular-trashinspection-plugin/eform-client/wdio-headless-plugin-step2.conf.js

# Test files cp

cp -r Documents/workspace/microting/eform-angular-frontend/eform-client/e2e/Tests/trash-inspections-settings Documents/workspace/microting/eform-angular-trashinspection-plugin/eform-client/e2e/Tests/trash-inspections-settings
cp -r Documents/workspace/microting/eform-angular-frontend/eform-client/e2e/Tests/trash-inspection-general Documents/workspace/microting/eform-angular-trashinspection-plugin/eform-client/e2e/Tests/trash-inspection-general 
cp -r Documents/workspace/microting/eform-angular-frontend/eform-client/e2e/Page\ objects/trashinspection Documents/workspace/microting/eform-angular-trashinspection-plugin/eform-client/e2e/Page\ objects/trashinspection
cp -r Documents/workspace/microting/eform-angular-frontend/eform-client/wdio-plugin-step2.conf.js Documents/workspace/microting/eform-angular-trashinspection-plugin/eform-client/wdio-headless-plugin-step2.conf.js
