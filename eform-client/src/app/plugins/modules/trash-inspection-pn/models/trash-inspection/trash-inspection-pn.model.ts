export class MachinesPnModel {
  total: number;
  machineList: Array<TrashInspectionPnModel> = [];
}

export class TrashInspectionPnModel {
  id: number;
  name: string;
  relatedAreasIds: Array<number> = [];
}
