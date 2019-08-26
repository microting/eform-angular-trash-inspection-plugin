export class TrashInspectionYearModelPnModel {
  total: number;
  statsByYearList: Array<TrashInspectionYearModel> = [];
}

export class TrashInspectionYearModel {
  id: number;
  name: string;
  weighings: number;
  amountOfWeighingsControlled: number;
  approvedPercentage: number;
  conditionalApprovedPercentage: number;
  notApprovedPercentage: number;
  controlPercentage: number;
}
