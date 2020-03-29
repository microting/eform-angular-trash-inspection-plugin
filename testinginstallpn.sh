#!/bin/bash
perl -pi -e '$_.="  }\n" if /INSERT ROUTES HERE/' src/app/plugins/plugins.routing.ts
perl -pi -e '$_.="  loadChildren: '\''./modules/trash-inspection-pn/trash-inspection-pn.module#TrashInspectionPnModule'\''\n" if /INSERT ROUTES HERE/' src/app/plugins/plugins.routing.ts
perl -pi -e '$_.="  canActivate: [AuthGuard],\n" if /INSERT ROUTES HERE/' src/app/plugins/plugins.routing.ts
perl -pi -e '$_.="  path: '\''trash-inspection-pn'\'',\n" if /INSERT ROUTES HERE/' src/app/plugins/plugins.routing.ts
perl -pi -e '$_.="  {\n" if /INSERT ROUTES HERE/' src/app/plugins/plugins.routing.ts
