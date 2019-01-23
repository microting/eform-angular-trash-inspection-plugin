import {SiteNameDto} from '../../../../../common/models/dto';
import {DeployCheckbox} from '../../../../../common/models/eforms';

export class InstallationPnCreateModel {
  id: number;
  name: string;
  relatedMachinesIds: Array<number> = [];
  deployedSites: Array<SiteNameDto>;
  deployCheckboxes: Array<DeployCheckbox> = [];

}
