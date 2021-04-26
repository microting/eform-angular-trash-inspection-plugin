import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import {
  OperationDataResult,
  OperationResult,
} from 'src/app/common/models/operation.models';
import { BaseService } from 'src/app/common/services/base.service';
import {
  ProducerPnImportModel,
  ProducerPnModel,
  ProducerPnRequestModel,
  ProducerPnStatsByYearModel,
  ProducerPnUpdateModel,
  ProducerPnYearRequestModel,
  ProducersPnModel,
} from '../models/producer';
import { StatByMonthPnModel } from '../models/transporter/stat-by-month-pn-model';
import { Paged } from 'src/app/common/models';

export let TrashInspectionPnProducerMethods = {
  Producers: 'api/trash-inspection-pn/producers',
  ProducersStatsByYear: 'api/trash-inspection-pn/producers/stats-by-year',
};
@Injectable({
  providedIn: 'root',
})
export class TrashInspectionPnProducersService extends BaseService {
  constructor(
    private _http: HttpClient,
    router: Router,
    toastrService: ToastrService
  ) {
    super(_http, router, toastrService);
  }
  getAllProducers(
    model: ProducerPnRequestModel
  ): Observable<OperationDataResult<ProducersPnModel>> {
    return this.get(TrashInspectionPnProducerMethods.Producers, model);
  }

  getSingleProducer(
    producerId: number
  ): Observable<OperationDataResult<ProducerPnModel>> {
    return this.get(
      TrashInspectionPnProducerMethods.Producers + '/' + producerId
    );
  }

  getSingleProducerByMonth(
    producerId: number,
    year: number
  ): Observable<OperationDataResult<StatByMonthPnModel>> {
    return this.get(
      TrashInspectionPnProducerMethods.Producers + '/' + producerId + '/' + year
    );
  }

  updateProducer(model: ProducerPnUpdateModel): Observable<OperationResult> {
    return this.put(TrashInspectionPnProducerMethods.Producers, model);
  }

  createProducer(model: ProducerPnModel): Observable<OperationResult> {
    return this.post(TrashInspectionPnProducerMethods.Producers, model);
  }

  deleteProducer(producerId: number): Observable<OperationResult> {
    return this.delete(
      TrashInspectionPnProducerMethods.Producers + '/' + producerId
    );
  }
  importProducer(model: ProducerPnImportModel): Observable<OperationResult> {
    return this.post(
      TrashInspectionPnProducerMethods.Producers + '/import',
      model
    );
  }

  getAllProducersStatsByYear(
    model: ProducerPnYearRequestModel
  ): Observable<OperationDataResult<Paged<ProducerPnStatsByYearModel>>> {
    return this.post(
      TrashInspectionPnProducerMethods.ProducersStatsByYear,
      model
    );
  }
}
