#!/bin/bash
sed '/\/\/ INSERT ROUTES HERE/i {' /home/travis/build/microting/eform-angular-frontend/eform-client/src/app/plugins/plugins.routing.ts -i
sed '/\/\/ INSERT ROUTES HERE/i path: "trash-inspection-pn",' /home/travis/build/microting/eform-angular-frontend/eform-client/src/app/plugins/plugins.routing.ts -i
sed '/\/\/ INSERT ROUTES HERE/i canActivate: [AuthGuard],' /home/travis/build/microting/eform-angular-frontend/eform-client/src/app/plugins/plugins.routing.ts -i
sed '/\/\/ INSERT ROUTES HERE/i loadChildren: "./modules/trash-inspection-pn/trash-inspection-pn.module#TrashInspectionPnModule"' /home/travis/build/microting/eform-angular-frontend/eform-client/src/app/plugins/plugins.routing.ts -i
sed '/\/\/ INSERT ROUTES HERE/i }' /home/travis/build/microting/eform-angular-frontend/eform-client/src/app/plugins/plugins.routing.ts -i

