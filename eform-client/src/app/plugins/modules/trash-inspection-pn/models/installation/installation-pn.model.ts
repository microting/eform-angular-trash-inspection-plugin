import {SiteNameDto} from '../../../../../common/models/dto';
import {DeployCheckbox} from '../../../../../common/models/eforms';

export class InstallationsPnModel {
  total: number;
  installationList: Array<InstallationPnModel> = [];
}

export class InstallationPnModel {
  id: number;
  name: string;
  relatedTrashInspectionsIds: Array<number> = [];
  deployedSites: Array<SiteNameDto>;
  deployCheckboxes: Array<DeployCheckbox> = [];
}
