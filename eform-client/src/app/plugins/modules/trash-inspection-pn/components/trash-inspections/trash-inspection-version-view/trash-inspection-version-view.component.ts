import {Component, OnInit, ViewChild} from '@angular/core';
import {SharedPnService} from '../../../../shared/services';
import {TrashInspectionPnSettingsService, TrashInspectionPnTrashInspectionsService} from '../../../services';
import {PageSettingsModel} from '../../../../../../common/models/settings';
import {
  TrashInspectionPnModel,
  TrashInspectionsPnModel,
  TrashInspectionsPnRequestModel,
  TrashInspectionVersionsPnModel
} from '../../../models/trash-inspection';
import {assertNumber} from '@angular/core/src/render3/assert';

@Component({
  selector: 'app-trash-inspection-pn-trash-inspection-version-view',
  templateUrl: './trash-inspection-version-view.component.html',
  styleUrls: ['./trash-inspection-version-view.component.scss']
})
export class TrashInspectionVersionViewComponent implements OnInit {
  @ViewChild('frame') frame;
  spinnerStatus = false;
  localPageSettings: PageSettingsModel = new PageSettingsModel();
  trashInspectionVersionsModel: TrashInspectionVersionsPnModel = new TrashInspectionVersionsPnModel();
  selectedTrashInspectionModel: TrashInspectionPnModel = new TrashInspectionPnModel();

  constructor(private sharedPnService: SharedPnService,
              private trashInspectionPnSettingsService: TrashInspectionPnSettingsService,
              private trashInspectionPnTrashInspectionsService: TrashInspectionPnTrashInspectionsService) { }
  ngOnInit() {
  }
  show(trashInspectionId: number) {
    this.frame.show();
    this.getSelectedVersions(trashInspectionId);
  }
  getSelectedVersions(trashInspectionId: number) {
    debugger;
    this.trashInspectionPnTrashInspectionsService.getTrashInspectionVersions(trashInspectionId).subscribe((data) => {
      if (data && data.success) {
        this.trashInspectionVersionsModel = data.model;
      }
      this.spinnerStatus = false;
    });
  }

}
