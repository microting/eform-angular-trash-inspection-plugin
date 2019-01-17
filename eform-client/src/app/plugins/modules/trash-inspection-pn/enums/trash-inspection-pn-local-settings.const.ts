import {
  ApplicationPageModel,
  PageSettingsModel
} from 'src/app/common/models/settings';

export const MachineAreaPnLocalSettings = [
  new ApplicationPageModel({
      name: 'Areas',
      settings: new PageSettingsModel({
        pageSize: 10,
        sort: 'Id',
        isSortDsc: false
      })
    }
  ),
  new ApplicationPageModel({
      name: 'Machines',
      settings: new PageSettingsModel({
        pageSize: 10,
        sort: 'Id',
        isSortDsc: false
      })
    }
  )
];

