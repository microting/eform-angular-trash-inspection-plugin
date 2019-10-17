export class FractionYearPnModel {
  total: number;
  statsByYearList: Array<FractionYearModel> = [];
}

export class FractionYearModel {
  id: number;
  name: string;
  weighings: number;
  amountOfWeighingsControlled: number;
  approvedPercentage: number;
  conditionalApprovedPercentage: number;
  notApprovedPercentage: number;
  controlPercentage: number;
}
