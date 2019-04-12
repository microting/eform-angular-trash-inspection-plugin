import { Injectable } from '@angular/core';
import {Observable} from 'rxjs';
import {OperationDataResult, OperationResult} from '../../../../common/models';
import {BaseService} from '../../../../common/services/base.service';
import {HttpClient} from '@angular/common/http';
import {Router} from '@angular/router';
import {ToastrService} from 'ngx-toastr';
import {TrashInspectionBaseSettingsModel} from '../models/trash-inspection-base-settings.model';

export let TrashInspectionSettingsMethods = {
  TrashInspectionSettings: 'api/trash-inspection-pn/settings'

};
@Injectable()
export class TrashInspectionPnSettingsService extends BaseService {

  constructor(private _http: HttpClient, router: Router, toastrService: ToastrService) {
    super(_http, router, toastrService);
  }

  getAllSettings(): Observable<OperationDataResult<TrashInspectionBaseSettingsModel>> {
    return this.get(TrashInspectionSettingsMethods.TrashInspectionSettings);
  }
  updateSettings(model: TrashInspectionBaseSettingsModel): Observable<OperationResult> {
    return this.post(TrashInspectionSettingsMethods.TrashInspectionSettings, model);
  }
}
