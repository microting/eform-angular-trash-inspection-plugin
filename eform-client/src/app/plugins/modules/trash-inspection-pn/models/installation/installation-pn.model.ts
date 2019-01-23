export class InstallationsPnModel {
  total: number;
  installationList: Array<InstallationPnModel> = [];
}

export class InstallationPnModel {
  id: number;
  name: string;
  relatedMachinesIds: Array<number> = [];
}
