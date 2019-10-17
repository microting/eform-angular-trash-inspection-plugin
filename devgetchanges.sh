#!/bin/bash

cd ~

if [ -d "Documents/workspace/microting/eform-angular-trashinspection-plugin/eform-client/src/app/plugins/modules/trash-inspection-pn" ]; then
	rm -fR Documents/workspace/microting/eform-angular-trashinspection-plugin/eform-client/src/app/plugins/modules/trash-inspection-pn
fi

cp -av Documents/workspace/microting/eform-angular-frontend/eform-client/src/app/plugins/modules/trash-inspection-pn Documents/workspace/microting/eform-angular-trashinspection-plugin/eform-client/src/app/plugins/modules/trash-inspection-pn

if [ -d "Documents/workspace/microting/eform-angular-trashinspection-plugin/eFormAPI/Plugins/TrashInspection.Pn" ]; then
	rm -fR Documents/workspace/microting/eform-angular-trashinspection-plugin/eFormAPI/Plugins/TrashInspection.Pn
fi

cp -av Documents/workspace/microting/eform-angular-frontend/eFormAPI/Plugins/TrashInspection.Pn Documents/workspace/microting/eform-angular-trashinspection-plugin/eFormAPI/Plugins/TrashInspection.Pn
