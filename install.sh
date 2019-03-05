#!/bin/bash

cd /var/www/microting/eform-angular-trashinspection-plugin
dotnet restore eFormAPI/Plugins/TrashInspection.Pn/TrashInspection.Pn.sln
dotnet build eFormAPI/Plugins/TrashInspection.Pn/TrashInspection.Pn.sln --runtime linux-x64 --configuration Release
cd ../..
cp -av microting/eform-angular-trashinspection-plugin/eform-client/src/app/plugins/modules/trash-inspection-pn microting/eform-angular-frontend/eform-client/src/app/plugins/modules/trash-inspection-pn
mkdir -p microting/eform-angular-frontend/eFormAPI/eFormAPI.Web/Plugins
cp -av microting/eform-angular-trashinspection-plugin/eFormAPI/eFormAPI.Web/Plugins/TrashInspection microting/eform-angular-frontend/eFormAPI/eFormAPI.Web/out/Plugins/TrashInspection


echo "Recompile angular"
cd microting/eform-angular-frontend/eform-client
../../microting/eform-angular-trashinspection-plugin/testinginstallpn.sh
su ubuntu -c \
"npm run build"
echo "Recompiling angular done"


