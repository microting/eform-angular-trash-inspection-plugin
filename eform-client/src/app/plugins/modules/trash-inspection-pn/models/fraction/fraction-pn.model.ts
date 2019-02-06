export class FractionsPnModel {
  total: number;
  fractionList: Array<FractionPnModel> = [];
}

export class FractionPnModel {
  id: number;
  name: string;
  description: string;
  eFormId: number;
  selectedTemplateName: string;
}
