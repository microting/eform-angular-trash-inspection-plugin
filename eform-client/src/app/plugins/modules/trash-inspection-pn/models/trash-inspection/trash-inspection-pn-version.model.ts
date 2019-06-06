import {TrashInspectionPnCaseStatusModel} from './trash-inspection-pn-case-status.model';

export class TrashInspectionVersionsPnModel {
  trashInspectionVersionList: Array<TrashInspectionVersionPnModel> = [];
  trashInspectionCaseStatusModels: Array<TrashInspectionPnCaseStatusModel> = [];
  token: string;
  trashInspectionId: number;
}

export class TrashInspectionVersionPnModel {
  id: number;
  name: string;
  weighingNumber: string;
  date: Date;
  time: Date;
  registrationNumber: string;
  trashFraction: number;
  eakCode: number;
  producer: string;
  transporter: string;
  segment: string;
  installationName: string;
  mustBeInspected: boolean;
  token: string;
  relatedAreasIds: Array<number> = [];
  status: number;
  isApproved: boolean;
  comment: string;
  version: number;
  trashInspectionId: number;
}
