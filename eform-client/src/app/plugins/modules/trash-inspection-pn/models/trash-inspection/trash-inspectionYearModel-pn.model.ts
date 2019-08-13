export class TrashInspectionYearModelPnModel {
  total: number;
  statsByYearList: Array<TrashInspectionYearModel> = [];
}

export class TrashInspectionYearModel {
  name: string;
  weighings: number;
  amountOfWeighingsControlled: number;
  approvedPercentage: number;
  conditionalApprovedPercentage: number;
  notApprovedPercentage: number;
  controlPercentage: number;
}
