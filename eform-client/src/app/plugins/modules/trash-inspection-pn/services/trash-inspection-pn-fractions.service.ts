import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {ToastrService} from 'ngx-toastr';

import { Observable} from 'rxjs';
import {Router} from '@angular/router';
import {OperationDataResult, OperationResult} from 'src/app/common/models/operation.models';
import {BaseService} from 'src/app/common/services/base.service';

import {FractionPnCreateModel,
        FractionPnModel,
        FractionPnRequestModel,
        FractionPnUpdateModel,
        FractionsPnModel} from '../models/fraction';

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

  createFraction(model: FractionPnCreateModel): Observable<OperationResult> {
    return this.post(TrashInspectionPnFractionMethods.Fractions, model);
  }

  deleteFraction(fractionId: number): Observable<OperationResult> {
    return this.delete(TrashInspectionPnFractionMethods.Fractions + '/' + fractionId);
  }
}
