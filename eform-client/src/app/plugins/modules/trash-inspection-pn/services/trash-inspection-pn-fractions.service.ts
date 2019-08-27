import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {ToastrService} from 'ngx-toastr';

import { Observable} from 'rxjs';
import {Router} from '@angular/router';
import {OperationDataResult, OperationResult} from 'src/app/common/models/operation.models';
import {BaseService} from 'src/app/common/services/base.service';

import {FractionPnModel,
        FractionPnRequestModel,
        FractionPnUpdateModel,
        FractionsPnModel,
        FractionPnImportModel} from '../models/fraction';
import {TrashInspectionPnTransporterMethods} from './trash-inspection-pn-transporter.service';
import {TrashInspectionYearModelPnModel} from '../models/trash-inspection/trash-inspectionYearModel-pn.model';
import {FractionPnYearRequestModel} from '../models/fraction/fraction-pn-year-request.model';

export let TrashInspectionPnFractionMethods = {
  Fractions: 'api/trash-inspection-pn/fractions',
};
@Injectable({
  providedIn: 'root'
})
export class TrashInspectionPnFractionsService extends BaseService {

  constructor(private _http: HttpClient, router: Router, toastrService: ToastrService) {
    super(_http, router, toastrService);
  }

  getAllFractions(model: FractionPnRequestModel): Observable<OperationDataResult<FractionsPnModel>> {
    return this.get(TrashInspectionPnFractionMethods.Fractions, model);
  }

  getSingleFraction(fractionId: number): Observable<OperationDataResult<FractionPnModel>> {
    return this.get(TrashInspectionPnFractionMethods.Fractions + '/' + fractionId);
  }

  updateFraction(model: FractionPnUpdateModel): Observable<OperationResult> {
    return this.put(TrashInspectionPnFractionMethods.Fractions, model);
  }

  createFraction(model: FractionPnModel): Observable<OperationResult> {
    return this.post(TrashInspectionPnFractionMethods.Fractions, model);
  }

  deleteFraction(fractionId: number): Observable<OperationResult> {
    return this.delete(TrashInspectionPnFractionMethods.Fractions + '/' + fractionId);
  }
  importFraction(model: FractionPnImportModel): Observable<OperationResult> {
    return this.post(TrashInspectionPnFractionMethods.Fractions + '/import', model);
  }

  getAllFractionsStatsByYear(model: FractionPnYearRequestModel): Observable<OperationDataResult<TrashInspectionYearModelPnModel>> {
    return this.get(TrashInspectionPnFractionMethods.Fractions + '/year/' + model.year, model);
  }
}
