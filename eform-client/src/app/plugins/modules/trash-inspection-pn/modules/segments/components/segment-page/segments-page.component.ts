import {Component, OnInit, ViewChild} from '@angular/core';
import {SegmentPnModel, SegmentsPnModel} from '../../../../models';
import {SegmentsStateService} from '../store';
import {PaginationModel} from 'src/app/common/models';
import {Sort} from '@angular/material/sort';
import {MtxGridColumn} from '@ng-matero/extensions/grid';
import {TranslateService} from '@ngx-translate/core';
import {MatDialog} from '@angular/material/dialog';
import {Overlay} from '@angular/cdk/overlay';

@Component({
  selector: 'app-trash-inspection-pn-segments-page',
  templateUrl: './segments-page.component.html',
  styleUrls: ['./segments-page.component.scss'],
})
export class SegmentsPageComponent implements OnInit {
  @ViewChild('createSegmentModal') createSegmentModal;
  @ViewChild('editSegmentModal') editSegmentModal;
  @ViewChild('deleteSegmentModal') deleteSegmentModal;
  segmentsPnModel: SegmentsPnModel = new SegmentsPnModel();

  tableHeaders: MtxGridColumn[] = [
    {header: this.translateService.stream('Id'), field: 'id', sortProp: {id: 'Id'}, sortable: true},
    {header: this.translateService.stream('Name'), field: 'name', sortProp: {id: 'Name'}, sortable: true},
    {header: this.translateService.stream('Description'), field: 'description', sortProp: {id: 'Description'}, sortable: true},
    {header: this.translateService.stream('SDK folder id'), field: 'sdkFolderId', sortProp: {id: 'SdkFolderId'}, sortable: true},
    {
      header: this.translateService.stream('Actions'),
      field: 'actions',
      sortable: false,
      type: 'button',
      buttons: [
        {
          type: 'icon',
          icon: 'edit',
          color: 'accent',
          click: (segment: SegmentPnModel) => this.showEditSegmentModal(segment),
          tooltip: this.translateService.stream('Edit Segment'),
          class: 'editSegmentBtn',
        },
        {
          type: 'icon',
          icon: 'delete',
          color: 'warn',
          click: (segment: SegmentPnModel) => this.showDeleteSegmentModal(segment),
          tooltip: this.translateService.stream('Delete Segment'),
          class: 'deleteSegmentBtn',
        },
      ]
    },
  ];

  constructor(
    public segmentsStateService: SegmentsStateService,
    private translateService: TranslateService,
    private dialog: MatDialog,
    private overlay: Overlay,
  ) {
  }

  ngOnInit() {
    this.getAllInitialData();
  }

  getAllInitialData() {
    this.getAllSegments();
  }

  getAllSegments() {
    this.segmentsStateService.getAllSegments().subscribe((data) => {
      if (data && data.success) {
        this.segmentsPnModel = data.model;
      }
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

  sortTable(sort: Sort) {
    this.segmentsStateService.onSortTable(sort.active);
    this.getAllSegments();
  }

  onSegmentDeleted() {
    this.segmentsStateService.onDelete();
    this.getAllSegments();
  }

  onPaginationChanged(paginationModel: PaginationModel) {
    this.segmentsStateService.updatePagination(paginationModel);
    this.getAllSegments();
  }
}
