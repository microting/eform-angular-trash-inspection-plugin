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
  InstallationPnCreateModel,
  InstallationPnModel,
  InstallationPnRequestModel,
  InstallationPnUpdateModel,
  InstallationsPnModel,
} from '../models';

export let TrashInspectionPnInstallationMethods = {
  Installations: 'api/trash-inspection-pn/installations',
};

@Injectable()
export class TrashInspectionPnInstallationsService extends BaseService {
  constructor(
    private _http: HttpClient,
    router: Router,
    toastrService: ToastrService
  ) {
    super(_http, router, toastrService);
  }

  getAllInstallations(
    model: InstallationPnRequestModel
  ): Observable<OperationDataResult<InstallationsPnModel>> {
    return this.get(TrashInspectionPnInstallationMethods.Installations, model);
  }

  getSingleInstallation(
    installationId: number
  ): Observable<OperationDataResult<InstallationPnModel>> {
    return this.get(
      TrashInspectionPnInstallationMethods.Installations + '/' + installationId
    );
  }

  updateInstallation(
    model: InstallationPnUpdateModel
  ): Observable<OperationResult> {
    return this.put(TrashInspectionPnInstallationMethods.Installations, model);
  }

  createInstallation(
    model: InstallationPnCreateModel
  ): Observable<OperationResult> {
    return this.post(TrashInspectionPnInstallationMethods.Installations, model);
  }

  deleteInstallation(installationId: number): Observable<OperationResult> {
    return this.delete(
      TrashInspectionPnInstallationMethods.Installations + '/' + installationId
    );
  }
}
