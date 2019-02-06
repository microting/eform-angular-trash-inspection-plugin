import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {ToastrService} from 'ngx-toastr';

import { Observable} from 'rxjs';
import {Router} from '@angular/router';
import {OperationDataResult, OperationResult} from 'src/app/common/models/operation.models';
import {BaseService} from 'src/app/common/services/base.service';

import {SegmentPnModel, SegmentsPnModel, SegmentPnRequestModel, SegmentPnUpdateModel} from '../models/segment';

export let TrashInspectionPnSegmentMethods = {
  Segments: 'api/trash-inspection-pn/segments',
};
@Injectable({
  providedIn: 'root'
})
export class TrashInspectionPnSegmentsService extends BaseService {

  constructor(private _http: HttpClient, router: Router, toastrService: ToastrService) {
    super(_http, router, toastrService);
  }

  getAllSegments(model: SegmentPnRequestModel): Observable<OperationDataResult<SegmentsPnModel>> {
    return this.get(TrashInspectionPnSegmentMethods.Segments, model);
  }

  getSingleSegment(fractionId: number): Observable<OperationDataResult<SegmentPnModel>> {
    return this.get(TrashInspectionPnSegmentMethods.Segments + '/' + fractionId);
  }

  updateSegment(model: SegmentPnUpdateModel): Observable<OperationResult> {
    return this.put(TrashInspectionPnSegmentMethods.Segments, model);
  }

  createSegment(model: SegmentPnModel): Observable<OperationResult> {
    return this.post(TrashInspectionPnSegmentMethods.Segments, model);
  }

  deleteSegment(segmentId: number): Observable<OperationResult> {
    return this.delete(TrashInspectionPnSegmentMethods.Segments + '/' + segmentId);
  }
}
