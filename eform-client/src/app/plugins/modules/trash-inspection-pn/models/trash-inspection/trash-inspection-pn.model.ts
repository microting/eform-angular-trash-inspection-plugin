export class TrashInspectionsPnModel {
  total: number;
  machineList: Array<TrashInspectionPnModel> = [];
}

export class TrashInspectionPnModel {
  id: number;
  name: string;
  relatedAreasIds: Array<number> = [];
}
