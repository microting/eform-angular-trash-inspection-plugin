export class InstallationsPnModel {
  total: number;
  areaList: Array<InstallationPnModel> = [];
}

export class InstallationPnModel {
  id: number;
  name: string;
  relatedMachinesIds: Array<number> = [];
}
