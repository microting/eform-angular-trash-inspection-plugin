#!/bin/bash

if [ -d "/var/www/microting/eform-angular-trashinspection-plugin" ]; then
  cd /var/www/microting
  su ubuntu -c \
  "git clone git@github.com:microting/eform-angular-trashinspection-plugin.git"
fi

cd /var/www/microting/eform-angular-trashinspection-plugin
dotnet restore eFormAPI/Plugins/TrashInspection.Pn/TrashInspection.Pn.sln
dotnet build eFormAPI/Plugins/TrashInspection.Pn/TrashInspection.Pn.sln --runtime linux-x64 --configuration Release

cp -av /var/www/microting/eform-angular-trashinspection-plugin/eform-client/src/app/plugins/modules/trash-inspection-pn /var/www/microting/eform-angular-frontend/eform-client/src/app/plugins/modules/trash-inspection-pn
mkdir -p /var/www/microting/eform-angular-frontend/eFormAPI/eFormAPI.Web/Plugins
cp -av /var/www/microting/eform-angular-trashinspection-plugin/eFormAPI/eFormAPI.Web/Plugins/TrashInspection /var/www/microting/eform-angular-frontend/eFormAPI/eFormAPI.Web/out/Plugins/TrashInspection


echo "Recompile angular"
cd /var/www/microting/eform-angular-frontend/eform-client
/var/www/microting/eform-angular-trashinspection-plugin/testinginstallpn.sh
su ubuntu -c \
"npm run build"
echo "Recompiling angular done"


