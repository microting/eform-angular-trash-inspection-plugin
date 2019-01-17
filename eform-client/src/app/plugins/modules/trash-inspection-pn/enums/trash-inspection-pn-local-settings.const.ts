import {
  ApplicationPageModel,
  PageSettingsModel
} from 'src/app/common/models/settings';

export const TrashInspectionPnLocalSettings = [
  new ApplicationPageModel({
      name: 'Installations',
      settings: new PageSettingsModel({
        pageSize: 10,
        sort: 'Id',
        isSortDsc: false
      })
    }
  ),
  new ApplicationPageModel({
      name: 'TrashInspections',
      settings: new PageSettingsModel({
        pageSize: 10,
        sort: 'Id',
        isSortDsc: false
      })
    }
  )
];

