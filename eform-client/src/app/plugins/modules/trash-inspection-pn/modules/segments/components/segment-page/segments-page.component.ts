import {Component, OnDestroy, OnInit, inject} from '@angular/core';
import {SegmentPnModel, SegmentsPnModel,} from '../../../../models';
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
import {SegmentCreateComponent, SegmentEditComponent} from '../';
import {Store} from '@ngrx/store';
import {
  selectSegmentsPagination,
  selectSegmentsPaginationIsSortDsc,
  selectSegmentsPaginationSort
} from '../../../../state';

@AutoUnsubscribe()
@Component({
  selector: 'app-trash-inspection-pn-segments-page',
  templateUrl: './segments-page.component.html',
  styleUrls: ['./segments-page.component.scss'],
  standalone: false
})
export class SegmentsPageComponent implements OnInit, OnDestroy {
  private store = inject(Store);
  public segmentsStateService = inject(SegmentsStateService);
  private translateService = inject(TranslateService);
  private dialog = inject(MatDialog);
  private overlay = inject(Overlay);
  private trashInspectionPnSegmentsService = inject(TrashInspectionPnSegmentsService);

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
  segmentCreatedSub$: Subscription;
  segmentUpdatedSub$: Subscription;
  public selectSegmentsPaginationSort$ = this.store.select(selectSegmentsPaginationSort);
  public selectSegmentsPaginationIsSortDsc$ = this.store.select(selectSegmentsPaginationIsSortDsc);
  public selectSegmentsPagination$ = this.store.select(selectSegmentsPagination);

  

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
    const updateSegmentModal =
      this.dialog.open(SegmentEditComponent, {...dialogConfigHelper(this.overlay, segment), minWidth: 400});
    this.segmentUpdatedSub$ = updateSegmentModal.componentInstance.onSegmentUpdated.subscribe(() => this.getAllSegments());
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
    const createSegmentModal =
      this.dialog.open(SegmentCreateComponent, {...dialogConfigHelper(this.overlay), minWidth: 400});
    this.segmentCreatedSub$ = createSegmentModal.componentInstance.onSegmentCreated.subscribe(() => this.getAllSegments());
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
    this.getAllSegments();
  }

  ngOnDestroy(): void {
  }
}
