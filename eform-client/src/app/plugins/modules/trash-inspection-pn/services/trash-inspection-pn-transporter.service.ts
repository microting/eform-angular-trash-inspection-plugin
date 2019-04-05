import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {ToastrService} from 'ngx-toastr';

import { Observable} from 'rxjs';
import {Router} from '@angular/router';
import {OperationDataResult, OperationResult} from 'src/app/common/models/operation.models';
import {BaseService} from 'src/app/common/services/base.service';

import { TransporterPnImportModel,
  TransporterPnModel,
  TransporterPnRequestModel,
  TransporterPnUpdateModel,
  TransportersPnModel} from '../models/transporter';

export let TrashInspectionPnTransporterMethods = {
  Transporter: 'api/trash-inspection-pn/transporters'
};

@Injectable({
  providedIn: 'root'
})
export class TrashInspectionPnTransporterService extends BaseService {
  constructor(private _http: HttpClient, router: Router, toastrService: ToastrService) {
    super(_http, router, toastrService);
  }
  getAllTransporters(model: TransporterPnRequestModel): Observable<OperationDataResult<TransportersPnModel>> {
    return this.get(TrashInspectionPnTransporterMethods.Transporter, model);
  }

  getSingleTransporter(transporterId: number): Observable<OperationDataResult<TransporterPnModel>> {
    return this.get(TrashInspectionPnTransporterMethods.Transporter + '/' + transporterId);
  }

  updateTransporter(model: TransporterPnUpdateModel): Observable<OperationResult> {
    return this.put(TrashInspectionPnTransporterMethods.Transporter, model);
  }

  createTransporter(model: TransporterPnModel): Observable<OperationResult> {
    return this.post(TrashInspectionPnTransporterMethods.Transporter, model);
  }

  deleteTransporter(transporterId: number): Observable<OperationResult> {
    return this.delete(TrashInspectionPnTransporterMethods.Transporter + '/' + transporterId);
  }
  importTransporter(model: TransporterPnImportModel): Observable<OperationResult> {
    return this.post(TrashInspectionPnTransporterMethods.Transporter + '/import', model);
  }
}
