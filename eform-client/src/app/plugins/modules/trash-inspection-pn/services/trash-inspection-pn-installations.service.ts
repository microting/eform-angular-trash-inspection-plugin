import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {ToastrService} from 'ngx-toastr';

import {Observable} from 'rxjs';
import {Router} from '@angular/router';
import {OperationDataResult, OperationResult} from 'src/app/common/models/operation.models';
import {BaseService} from 'src/app/common/services/base.service';
import {
  AreasPnRequestModel,
  AreasPnModel,
  AreaPnCreateModel,
  AreaPnUpdateModel,
  AreaPnModel
} from '../models';

export let MachineAreaPnAreaMethods = {
  Areas: 'api/machine-area-pn/areas',
};

@Injectable()
export class TrashInspectionPnInstallationsService extends BaseService {
  constructor(private _http: HttpClient, router: Router, toastrService: ToastrService) {
    super(_http, router, toastrService);
  }

  getAllAreas(model: AreasPnRequestModel): Observable<OperationDataResult<AreasPnModel>> {
    return this.get(MachineAreaPnAreaMethods.Areas, model);
  }

  getSingleArea(areaId: number): Observable<OperationDataResult<AreaPnModel>> {
    return this.get(MachineAreaPnAreaMethods.Areas + '/' + areaId);
  }

  updateArea(model: AreaPnUpdateModel): Observable<OperationResult> {
    return this.put(MachineAreaPnAreaMethods.Areas, model);
  }

  createArea(model: AreaPnCreateModel): Observable<OperationResult> {
    return this.post(MachineAreaPnAreaMethods.Areas, model);
  }

  deleteArea(machineId: number): Observable<OperationResult> {
    return this.delete(MachineAreaPnAreaMethods.Areas + '/' + machineId);
  }
}
