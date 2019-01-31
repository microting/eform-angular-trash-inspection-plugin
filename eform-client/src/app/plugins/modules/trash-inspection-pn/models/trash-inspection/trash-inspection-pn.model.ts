import {Time} from '@angular/common';

export class TrashInspectionsPnModel {
  total: number;
  trashInspectionList: Array<TrashInspectionPnModel> = [];
}

export class TrashInspectionPnModel {
  id: number;
  name: string;
  weighingNumber: number;
  date: Date;
  time: Date;
  registrationNumber: string;
  trashFraction: number;
  eakCode: number;
  producer: string;
  transporter: string;
  installationId: number;
  mustBeInspected: boolean;
  relatedAreasIds: Array<number> = [];
  status: number;
}
