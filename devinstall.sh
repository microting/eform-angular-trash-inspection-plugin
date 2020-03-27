#!/bin/bash
cd ~
pwd

mkdir -p Documents/workspace/microting/eform-angular-trashinspection-plugin/eFormAPI/Plugins

rm -fR Documents/workspace/microting/eform-angular-frontend/eform-client/src/app/plugins/modules/trash-inspection-pn

cp -r Documents/workspace/microting/eform-angular-trashinspection-plugin/eform-client/src/app/plugins/modules/trash-inspection-pn Documents/workspace/microting/eform-angular-frontend/eform-client/src/app/plugins/modules/trash-inspection-pn

rm -fR Documents/workspace/microting/eform-angular-frontend/eFormAPI/Plugins/TrashInspection.Pn

cp -r Documents/workspace/microting/eform-angular-trashinspection-plugin/eFormAPI/Plugins/TrashInspection.Pn Documents/workspace/microting/eform-angular-frontend/eFormAPI/Plugins/TrashInspection.Pn
