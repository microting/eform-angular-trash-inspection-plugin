import {Time} from '@angular/common';

export class TrashInspectionsPnModel {
  total: number;
  trashInspectionList: Array<TrashInspectionPnModel> = [];
  token: string;
  numOfElements: number;
  pageNum: number;
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
  installationName: string;
  mustBeInspected: boolean;
  relatedAreasIds: Array<number> = [];
  status: number;
  isApproved: boolean;
  comment: string;
}
