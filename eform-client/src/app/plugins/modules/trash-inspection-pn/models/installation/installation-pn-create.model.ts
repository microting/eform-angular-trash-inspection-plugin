import {SiteNameDto} from '../../../../../common/models/dto';

export class InstallationPnCreateModel {
  id: number;
  name: string;
  relatedMachinesIds: Array<number> = [];
  deployedSites: Array<SiteNameDto>;

}
