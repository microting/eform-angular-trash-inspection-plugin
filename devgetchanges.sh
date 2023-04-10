#!/bin/bash

cd ~

rm -fR Documents/workspace/microting/eform-angular-trashinspection-plugin/eform-client/src/app/plugins/modules/trash-inspection-pn

cp -a Documents/workspace/microting/eform-angular-frontend/eform-client/src/app/plugins/modules/trash-inspection-pn Documents/workspace/microting/eform-angular-trashinspection-plugin/eform-client/src/app/plugins/modules/trash-inspection-pn

rm -fR Documents/workspace/microting/eform-angular-trashinspection-plugin/eFormAPI/Plugins/TrashInspection.Pn

cp -a Documents/workspace/microting/eform-angular-frontend/eFormAPI/Plugins/TrashInspection.Pn Documents/workspace/microting/eform-angular-trashinspection-plugin/eFormAPI/Plugins/TrashInspection.Pn

# Test files rm

rm -fR Documents/workspace/microting/eform-angular-trashinspection-plugin/eform-client/e2e/Tests/trash-inspections-settings
rm -fR Documents/workspace/microting/eform-angular-trashinspection-plugin/eform-client/e2e/Tests/trash-inspection-general 
rm -fR Documents/workspace/microting/eform-angular-trashinspection-plugin/eform-client/e2e/Page\ objects/trash-inspection
rm -fR Documents/workspace/microting/eform-angular-trashinspection-plugin/eform-client/wdio-headless-plugin-step2.conf.ts 

# Test files cp

cp -a Documents/workspace/microting/eform-angular-frontend/eform-client/e2e/Tests/trash-inspections-settings Documents/workspace/microting/eform-angular-trashinspection-plugin/eform-client/e2e/Tests/trash-inspections-settings
cp -a Documents/workspace/microting/eform-angular-frontend/eform-client/e2e/Tests/trash-inspection-general Documents/workspace/microting/eform-angular-trashinspection-plugin/eform-client/e2e/Tests/trash-inspection-general 
cp -a Documents/workspace/microting/eform-angular-frontend/eform-client/e2e/Page\ objects/trash-inspection Documents/workspace/microting/eform-angular-trashinspection-plugin/eform-client/e2e/Page\ objects/trash-inspection
cp -a Documents/workspace/microting/eform-angular-frontend/eform-client/wdio-plugin-step2.conf.ts  Documents/workspace/microting/eform-angular-trashinspection-plugin/eform-client/wdio-headless-plugin-step2.conf.ts 
