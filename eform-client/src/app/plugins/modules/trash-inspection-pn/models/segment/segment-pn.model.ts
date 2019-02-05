export class SegmentsPnModel {
  total: number;
  segmentList: Array<SegmentPnModel> = [];
}

export class SegmentPnModel {
  id: number;
  name: string;
  description: string;
  // eFormId: number;
  // selectedTemplateName: string;
}
