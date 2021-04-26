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
  TrashInspectionPnModel,
  TrashInspectionPnUpdateModel,
  TrashInspectionsPnRequestModel,
  TrashInspectionVersionsPnModel,
} from '../models';
import { Paged } from 'src/app/common/models';

export let TrashInspectionPnTrashInspectionMethods = {
  TrashInspectionsIndex: 'api/trash-inspection-pn/inspections/index',
  TrashInspections: 'api/trash-inspection-pn/inspections',
  TrashInspectionVersions: 'api/trash-inspection-pn/versions',
};

@Injectable()
export class TrashInspectionPnTrashInspectionsService extends BaseService {
  constructor(
    private _http: HttpClient,
    router: Router,
    toastrService: ToastrService
  ) {
    super(_http, router, toastrService);
  }

  getAllTrashInspections(
    model: TrashInspectionsPnRequestModel
  ): Observable<OperationDataResult<Paged<TrashInspectionPnModel>>> {
    return this.post(
      TrashInspectionPnTrashInspectionMethods.TrashInspectionsIndex,
      model
    );
  }

  getSingleTrashInspection(
    trashInspectionId: number
  ): Observable<OperationDataResult<TrashInspectionPnModel>> {
    return this.get(
      TrashInspectionPnTrashInspectionMethods.TrashInspections +
        '/' +
        trashInspectionId
    );
  }

  getTrashInspectionVersions(
    trashInspectionId: number
  ): Observable<OperationDataResult<TrashInspectionVersionsPnModel>> {
    return this.get(
      TrashInspectionPnTrashInspectionMethods.TrashInspectionVersions +
        '/' +
        trashInspectionId
    );
  }
  updateTrashInspection(
    model: TrashInspectionPnUpdateModel
  ): Observable<OperationResult> {
    return this.put(
      TrashInspectionPnTrashInspectionMethods.TrashInspections,
      model
    );
  }

  createTrashInspection(
    model: TrashInspectionPnModel
  ): Observable<OperationResult> {
    return this.post(
      TrashInspectionPnTrashInspectionMethods.TrashInspections,
      model
    );
  }

  deleteTrashInspection(
    trashInspectionId: number
  ): Observable<OperationResult> {
    return this.delete(
      TrashInspectionPnTrashInspectionMethods.TrashInspections +
        '/' +
        trashInspectionId
    );
  }
}
