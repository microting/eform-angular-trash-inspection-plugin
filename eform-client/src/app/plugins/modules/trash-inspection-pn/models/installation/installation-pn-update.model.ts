export class InstallationPnUpdateModel {
  id: number;
  name: string;
  relatedMachinesIds: Array<number> = [];

  constructor(data?: any) {
    if (data) {
      this.id = data.id;
      this.name = data.name;
      this.relatedMachinesIds = data.relatedMachinesIds;
    }
  }
}
