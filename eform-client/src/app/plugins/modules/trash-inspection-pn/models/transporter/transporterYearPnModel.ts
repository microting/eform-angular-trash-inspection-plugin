export class TransporterYearPnModel {
  total: number;
  statsByYearList: Array<TransporterYearModel> = [];
}

export class TransporterYearModel {
  name: string;
  weighings: number;
  amountOfWeighingsControlled: number;
  approvedPercentage: number;
  conditionalApprovedPercentage: number;
  notApprovedPercentage: number;
  controlPercentage: number;
}
