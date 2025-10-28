import {Component, OnDestroy, OnInit} from '@angular/core';
import {TrashInspectionPnModel} from '../../../../models';
import {TrashInspectionPnTrashInspectionsService} from '../../../../services';
import {DeleteModalSettingModel, Paged, PaginationModel} from 'src/app/common/models';
import {TrashInspectionsStateService} from '../store';
import {DeleteModalComponent} from 'src/app/common/modules/eform-shared/components';
import {dialogConfigHelper} from 'src/app/common/helpers';
import {Subject, Subscription, zip} from 'rxjs';
import {debounceTime} from 'rxjs/operators';
import {Sort} from '@angular/material/sort';
import {TranslateService} from '@ngx-translate/core';
import {MatDialog} from '@angular/material/dialog';
import {Overlay} from '@angular/cdk/overlay';
import {MtxGridColumn} from '@ng-matero/extensions/grid';
import {AutoUnsubscribe} from 'ngx-auto-unsubscribe';
import {TrashInspectionVersionViewComponent} from '../';
import {Store} from '@ngrx/store';
import {
  selectTrashInspectionsNameFilters, selectTrashInspectionsPagination,
  selectTrashInspectionsPaginationIsSortDsc,
  selectTrashInspectionsPaginationSort
} from '../../../../state';

@AutoUnsubscribe()
@Component({
  selector: 'app-trash-inspection-pn-trash-inspection-page',
  templateUrl: './trash-inspections-page.component.html',
  styleUrls: ['./trash-inspections-page.component.scss'],
  standalone: false
})
export class TrashInspectionsPageComponent implements OnInit, OnDestroy {
  // @ViewChild('createTrashInspectionModal') createTrashInspectionModal;

  searchSubject = new Subject();
  trashInspectionsModel: Paged<TrashInspectionPnModel> = new Paged<TrashInspectionPnModel>();

  tableHeaders: MtxGridColumn[] = [
    {header: this.translateService.stream('Id'), field: 'id', sortProp: {id: 'Id'}, sortable: true},
    {
      header: this.translateService.stream('Date'),
      field: 'date',
      sortProp: {id: 'Date'},
      sortable: true,
      type: 'date',
      typeParameter: {format: 'dd.MM.y'}
    },
    {
      header: this.translateService.stream('Time'),
      field: 'time',
      sortProp: {id: 'Time'},
      sortable: true,
      type: 'date',
      typeParameter: {format: 'HH:mm:ss'}
    },
    {header: this.translateService.stream('Eak code'), field: 'eakCode', sortProp: {id: 'EakCode'}, sortable: true},
    {header: this.translateService.stream('Installation'), field: 'installationName', sortProp: {id: 'InstallationId'}, sortable: true},
    {header: this.translateService.stream('Segment'), field: 'segment', sortProp: {id: 'SegmentId'}, sortable: true},
    {
      header: this.translateService.stream('Must be inspected'),
      field: 'mustBeInspected',
      sortProp: {id: 'MustBeInspected'},
      sortable: true,
      formatter: (trashInspection: TrashInspectionPnModel) => (
        `<span class="material-icons">${trashInspection.mustBeInspected ? 'done' : 'close'}</span>`
      ),
    },
    {header: this.translateService.stream('Producer'), field: 'producer', sortProp: {id: 'Producer'}, sortable: true},
    {
      header: this.translateService.stream('Registration number'),
      field: 'registrationNumber',
      sortProp: {id: 'RegistrationNumber'},
      sortable: true
    },
    {header: this.translateService.stream('Transporter'), field: 'transporter', sortProp: {id: 'Transporter'}, sortable: true},
    {header: this.translateService.stream('Trash fraction'), field: 'trashFraction', sortProp: {id: 'TrashFraction'}, sortable: true},
    {header: this.translateService.stream('Weighing number'), field: 'weighingNumber', sortProp: {id: 'WeighingNumber'}, sortable: true},
    {
      header: this.translateService.stream('Extended inspection'),
      field: 'extendedInspection',
      sortProp: {id: 'ExtendedInspection'},
      sortable: true,
      formatter: (trashInspection: TrashInspectionPnModel) => (
        `<span class="material-icons">${trashInspection.extendedInspection ? 'done' : 'close'}</span>`
      ),
    },
    {
      header: this.translateService.stream('Is approved'),
      field: 'isApproved',
      sortProp: {id: 'IsApproved'},
      sortable: true,
      formatter: (trashInspection: TrashInspectionPnModel) => (
        `<span class="material-icons">${trashInspection.isApproved ? 'done' : 'close'}</span>`
      ),
    },
    {header: this.translateService.stream('Comment'), field: 'comment', sortProp: {id: 'Comment'}, sortable: true},
    {header: this.translateService.stream('Status'), field: 'status', sortProp: {id: 'Status'}, sortable: true},
    {
      header: this.translateService.stream('Is removed'),
      field: 'workflowState',
      sortProp: {id: 'WorkflowState'},
      sortable: true,
      formatter: (trashInspection: TrashInspectionPnModel) => (
        `<span class="material-icons">${trashInspection.workflowState === 'removed' || trashInspection.inspectionDone ? 'done' : 'close'}</span>`
      ),
    },
    {
      header: this.translateService.stream('Actions'),
      field: 'actions',
      width: '100px',
      pinned: 'right',
      right: '0px',
    },
  ];
  translatesSub$: Subscription;
  trashInspectionDeletedSub$: Subscription;
  public selectTrashInspectionsPaginationSort$ = this.store.select(selectTrashInspectionsPaginationSort);
  public selectTrashInspectionsPaginationIsSortDsc$ = this.store.select(selectTrashInspectionsPaginationIsSortDsc);
  public selectTrashInspectionsNameFilters$ = this.store.select(selectTrashInspectionsNameFilters);
  public selectTrashInspectionsPagination$ = this.store.select(selectTrashInspectionsPagination);

  constructor(
    private store: Store,
    public trashInspectionsStateService: TrashInspectionsStateService,
    private translateService: TranslateService,
    private dialog: MatDialog,
    private overlay: Overlay,
    private machineAreaPnMachinesService: TrashInspectionPnTrashInspectionsService
  ) {
    this.searchSubject.pipe(debounceTime(500)).subscribe((val: string) => {
      this.trashInspectionsStateService.updateNameFilter(val);
      this.getAllTrashInspections();
    });
  }

  ngOnInit() {
    this.getAllInitialData();
  }

  getAllInitialData() {
    this.getAllTrashInspections();
  }

  getAllTrashInspections() {
    this.trashInspectionsStateService
      .getAllTrashInspections()
      .subscribe((data) => {
        if (data && data.success) {
          this.trashInspectionsModel = data.model;
        }
      });
  }

  onLabelInputChanged(label: string) {
    this.searchSubject.next(label);
  }

  // showCreateTrashInspection() {
  //   this.createTrashInspectionModal.show();
  // }

  showDeleteTrashInspectionModal(trashInspection: TrashInspectionPnModel) {
    this.translatesSub$ = zip(
      this.translateService.stream('Are you sure you want to delete'),
      this.translateService.stream('Name'),
    ).subscribe(([headerText, name]) => {
      const settings: DeleteModalSettingModel = {
        model: trashInspection,
        settings: {
          headerText: `${headerText}?`,
          fields: [
            {header: 'ID', field: 'id'},
            {header: name, field: 'name'},
          ],
        }
      };
      const deleteTrashInspectionModal = this.dialog.open(DeleteModalComponent, {...dialogConfigHelper(this.overlay, settings)});
      this.trashInspectionDeletedSub$ = deleteTrashInspectionModal.componentInstance.delete
        .subscribe((model: TrashInspectionPnModel) => {
          this.machineAreaPnMachinesService.deleteTrashInspection(model.id)
            .subscribe((data) => {
              if (data && data.success) {
                deleteTrashInspectionModal.close();
                this.onTrashInspectionDeleted();
              }
            });
        });
    });
  }

  showVersionViewModal(trashInspectionId: number) {
    // const versionViewModal =
    this.dialog.open(TrashInspectionVersionViewComponent, {...dialogConfigHelper(this.overlay, trashInspectionId), minWidth: 800});
  }

  downloadPDF(trashInspection: TrashInspectionPnModel) {
    window.open(
      '/api/trash-inspection-pn/inspection-results/' +
      trashInspection.weighingNumber +
      '?token=' +
      trashInspection.token +
      '&fileType=pdf',
      '_blank'
    );
  }

  downloadDocx(trashInspection: TrashInspectionPnModel) {
    window.open(
      '/api/trash-inspection-pn/inspection-results/' +
      trashInspection.weighingNumber +
      '?token=' +
      trashInspection.token +
      '&fileType=docx',
      '_blank'
    );
  }

  sortTable(sort: Sort) {
    this.trashInspectionsStateService.onSortTable(sort.active);
    this.getAllTrashInspections();
  }

  onTrashInspectionDeleted() {
    this.trashInspectionsStateService.onDelete();
    this.getAllTrashInspections();
  }

  onPaginationChanged(paginationModel: PaginationModel) {
    this.getAllTrashInspections();
  }

  ngOnDestroy(): void {
  }
}
