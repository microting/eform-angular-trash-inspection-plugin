import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {ToastrService} from 'ngx-toastr';

import {Observable} from 'rxjs';
import {Router} from '@angular/router';
import {OperationDataResult, OperationResult} from 'src/app/common/models/operation.models';
import {BaseService} from 'src/app/common/services/base.service';
import {
  MachinePnCreateModel,
  MachinePnModel,
  MachinesPnRequestModel, MachinePnUpdateModel,
  MachinesPnModel
} from '../models';

export let MachineAreaPnMachineMethods = {
  Machines: 'api/machine-area-pn/machines',
};

@Injectable()
export class TrashInspectionPnTrashInspectionsService extends BaseService {
  constructor(private _http: HttpClient, router: Router, toastrService: ToastrService) {
    super(_http, router, toastrService);
  }

  getAllMachines(model: MachinesPnRequestModel): Observable<OperationDataResult<MachinesPnModel>> {
    return this.get(MachineAreaPnMachineMethods.Machines, model);
  }

  getSingleMachine(machineId: number): Observable<OperationDataResult<MachinePnModel>> {
    return this.get(MachineAreaPnMachineMethods.Machines + '/' + machineId);
  }

  updateMachine(model: MachinePnUpdateModel): Observable<OperationResult> {
    return this.put(MachineAreaPnMachineMethods.Machines, model);
  }

  createMachine(model: MachinePnCreateModel): Observable<OperationResult> {
    return this.post(MachineAreaPnMachineMethods.Machines, model);
  }

  deleteMachine(machineId: number): Observable<OperationResult> {
    return this.delete(MachineAreaPnMachineMethods.Machines + '/' + machineId);
  }

}
