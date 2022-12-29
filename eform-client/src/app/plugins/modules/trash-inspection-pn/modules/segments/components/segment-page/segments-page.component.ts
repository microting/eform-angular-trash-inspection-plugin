import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {SegmentPnModel, SegmentsPnModel, TransporterPnModel} from '../../../../models';
import {SegmentsStateService} from '../store';
import {DeleteModalSettingModel, PaginationModel} from 'src/app/common/models';
import {Sort} from '@angular/material/sort';
import {MtxGridColumn} from '@ng-matero/extensions/grid';
import {TranslateService} from '@ngx-translate/core';
import {MatDialog} from '@angular/material/dialog';
import {Overlay} from '@angular/cdk/overlay';
import {Subscription, zip} from 'rxjs';
import {DeleteModalComponent} from 'src/app/common/modules/eform-shared/components';
import {dialogConfigHelper} from 'src/app/common/helpers';
import {TrashInspectionPnSegmentsService} from '../../../../services';
import {AutoUnsubscribe} from 'ngx-auto-unsubscribe';

@AutoUnsubscribe()
@Component({
  selector: 'app-trash-inspection-pn-segments-page',
  templateUrl: './segments-page.component.html',
  styleUrls: ['./segments-page.component.scss'],
})
export class SegmentsPageComponent implements OnInit, OnDestroy {
  @ViewChild('createSegmentModal') createSegmentModal;
  @ViewChild('editSegmentModal') editSegmentModal;
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

  translatesSub$: Subscription;
  segmentDeletedSub$: Subscription;

  constructor(
    public segmentsStateService: SegmentsStateService,
    private translateService: TranslateService,
    private dialog: MatDialog,
    private overlay: Overlay,
    private trashInspectionPnSegmentsService: TrashInspectionPnSegmentsService,
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
    this.translatesSub$ = zip(
      this.translateService.stream('Are you sure you want to delete'),
      this.translateService.stream('Name'),
    ).subscribe(([headerText, name]) => {
      const settings: DeleteModalSettingModel = {
        model: segment,
        settings: {
          headerText: `${headerText}?`,
          fields: [
            {header: 'ID', field: 'id'},
            {header: name, field: 'name'},
          ],
          cancelButtonId: 'segmentDeleteCancelBtn',
          deleteButtonId: 'segmentDeleteDeleteBtn',
        }
      };
      const deleteSegmentModal = this.dialog.open(DeleteModalComponent, {...dialogConfigHelper(this.overlay, settings)});
      this.segmentDeletedSub$ = deleteSegmentModal.componentInstance.delete
        .subscribe((model: SegmentPnModel) => {
          this.trashInspectionPnSegmentsService
            .deleteSegment(model.id)
            .subscribe((data) => {
              if (data && data.success) {
                deleteSegmentModal.close();
                this.onSegmentDeleted();
              }
            });
        });
    });
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

  ngOnDestroy(): void {
  }
}
