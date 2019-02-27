import {Component, OnInit, ViewChild} from '@angular/core';
import {PageSettingsModel} from 'src/app/common/models/settings';

import {SharedPnService} from 'src/app/plugins/modules/shared/services';
import {SegmentsPnModel, SegmentPnRequestModel, SegmentPnModel} from '../../../models/segment';
import {TrashInspectionPnSegmentsService} from '../../../services/trash-inspection-pn-segments.service';

@Component({
  selector: 'app-trash-inspection-pn-segments-page',
  templateUrl: './segments-page.component.html',
  styleUrls: ['./segments-page.component.scss']
})
export class SegmentsPageComponent implements OnInit {
  @ViewChild('createSegmentModal') createSegmentModal;
  @ViewChild('editSegmentModal') editSegmentModal;
  @ViewChild('deleteSegmentModal') deleteSegmentModal;
  localPageSettings: PageSettingsModel = new PageSettingsModel();
  segmentsPnModel: SegmentsPnModel = new SegmentsPnModel();
  segmentPnRequestModel: SegmentPnRequestModel = new SegmentPnRequestModel();
  spinnerStatus = false;

  constructor(private sharedPnService: SharedPnService,
              private trashInspectionPnSegmentsService: TrashInspectionPnSegmentsService) { }

  ngOnInit() {
    this.getLocalPageSettings();
  }

  getLocalPageSettings() {
    this.localPageSettings = this.sharedPnService.getLocalPageSettings
    ('trashInspectionsPnSettings', 'Segments').settings;
    this.getAllInitialData();
  }

  updateLocalPageSettings() {
    this.sharedPnService.updateLocalPageSettings
    ('trashInspectionsPnSettings', this.localPageSettings, 'Segments');
    this.getAllSegments();
  }

  getAllInitialData() {
    this.getAllSegments();
  }

  getAllSegments() {
    this.spinnerStatus = true;
    this.segmentPnRequestModel.isSortDsc = this.localPageSettings.isSortDsc;
    this.segmentPnRequestModel.sort = this.localPageSettings.sort;
    this.segmentPnRequestModel.pageSize = this.localPageSettings.pageSize;
    this.trashInspectionPnSegmentsService.getAllSegments(this.segmentPnRequestModel).subscribe((data) => {
      if (data && data.success) {
        this.segmentsPnModel = data.model;
      } this.spinnerStatus = false;
    });
  }
  showEditSegmentModal(segment: SegmentPnModel) {
    this.editSegmentModal.show(segment);
  }

  showDeleteSegmentModal(segment: SegmentPnModel) {
    this.deleteSegmentModal.show(segment);
  }

  showCreateSegmentModal() {
    this.createSegmentModal.show();
  }

  sortTable(sort: string) {
    if (this.localPageSettings.sort === sort) {
      this.localPageSettings.isSortDsc = !this.localPageSettings.isSortDsc;
    } else {
      this.localPageSettings.isSortDsc = false;
      this.localPageSettings.sort = sort;
    }
    this.updateLocalPageSettings();
  }

  changePage(e: any) {
    if (e || e === 0) {
      this.segmentPnRequestModel.offset = e;
      if (e === 0) {
        this.segmentPnRequestModel.pageIndex = 0;
      } else {
        this.segmentPnRequestModel.pageIndex = Math.floor(e / this.segmentPnRequestModel.pageSize);
      }
      this.getAllSegments();
    }
  }
}
