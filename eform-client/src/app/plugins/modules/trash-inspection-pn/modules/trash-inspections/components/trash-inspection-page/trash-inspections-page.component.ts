import {Component, OnDestroy, OnInit, inject} from '@angular/core';
import {TrashInspectionPnModel} from '../../../../models';
import {TrashInspectionPnClaims} from '../../../../enums';
import {TrashInspectionPnTrashInspectionsService} from '../../../../services';
import {DeleteModalSettingModel, Paged, PaginationModel} from 'src/app/common/models';
import {TrashInspectionsStateService} from '../store';
import {AuthStateService} from 'src/app/common/store';
import {DeleteModalComponent} from 'src/app/common/modules/eform-shared/components';
import {dialogConfigHelper} from 'src/app/common/helpers';
import {Subject, Subscription, zip} from 'rxjs';
import {debounceTime, finalize} from 'rxjs/operators';
import {Sort} from '@angular/material/sort';
import {TranslateService} from '@ngx-translate/core';
import {MatDialog} from '@angular/material/dialog';
import {Overlay} from '@angular/cdk/overlay';
import {MtxGridColumn} from '@ng-matero/extensions/grid';
import {AutoUnsubscribe} from 'ngx-auto-unsubscribe';
import {TrashInspectionVersionViewComponent} from '../';
import {Store} from '@ngrx/store';
import {
  selectTrashInspectionsNameFilters, selectTrashInspectionsNavStatusFilter, selectTrashInspectionsPagination,
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
  private store = inject(Store);
  public trashInspectionsStateService = inject(TrashInspectionsStateService);
  public authStateService = inject(AuthStateService);
  private translateService = inject(TranslateService);
  private dialog = inject(MatDialog);
  private overlay = inject(Overlay);
  private machineAreaPnMachinesService = inject(TrashInspectionPnTrashInspectionsService);

  // @ViewChild('createTrashInspectionModal') createTrashInspectionModal;

  searchSubject = new Subject();
  trashInspectionsModel: Paged<TrashInspectionPnModel> = new Paged<TrashInspectionPnModel>();
  navEnabled = false;
  sendingToNavIds: number[] = [];

  private allTableHeaders: MtxGridColumn[] = [
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
      header: this.translateService.stream('NAV'),
      field: 'responseSendToCallBackUrl',
      sortProp: {id: 'ResponseSendToCallBackUrl'},
      sortable: true,
    },
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
  tableHeaders: MtxGridColumn[] = this.getVisibleTableHeaders();
  translatesSub$: Subscription;
  translatesSendToNavSub$: Subscription;
  trashInspectionDeletedSub$: Subscription;
  trashInspectionSentToNavSub$: Subscription;

  get trashInspectionPnClaims() {
    return TrashInspectionPnClaims;
  }
  public selectTrashInspectionsPaginationSort$ = this.store.select(selectTrashInspectionsPaginationSort);
  public selectTrashInspectionsPaginationIsSortDsc$ = this.store.select(selectTrashInspectionsPaginationIsSortDsc);
  public selectTrashInspectionsNameFilters$ = this.store.select(selectTrashInspectionsNameFilters);
  public selectTrashInspectionsNavStatusFilter$ = this.store.select(selectTrashInspectionsNavStatusFilter);
  public selectTrashInspectionsPagination$ = this.store.select(selectTrashInspectionsPagination);



  ngOnInit() {
    this.searchSubject.pipe(debounceTime(500)).subscribe((val: string) => {
      this.trashInspectionsStateService.updateNameFilter(val);
      this.getAllTrashInspections();
    });
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
          this.updateNavEnabled(data.model.entities);
        }
      });
  }

  onLabelInputChanged(label: string) {
    this.searchSubject.next(label);
  }

  onNavStatusFilterChanged(navStatusFilter: string) {
    this.trashInspectionsStateService.updateNavStatusFilter(navStatusFilter);
    this.getAllTrashInspections();
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

  showSendToNavModal(trashInspection: TrashInspectionPnModel) {
    this.translatesSendToNavSub$ = zip(
      this.translateService.stream('Are you sure you want to send this inspection to NAV'),
      this.translateService.stream('Weighing number'),
      this.translateService.stream('Date'),
      this.translateService.stream('Is approved'),
      this.translateService.stream('Send to NAV'),
      this.translateService.stream('NAV may already have received this weighing number'),
    ).subscribe(([headerText, weighingNumber, date, isApproved, sendToNav, alreadyReceivedWarning]) => {
      const settings: DeleteModalSettingModel = {
        model: trashInspection,
        settings: {
          headerText: `${headerText}?`,
          fields: [
            {header: weighingNumber, field: 'weighingNumber'},
            {header: date, field: 'date', type: 'date', format: 'dd.MM.y'},
            {header: isApproved, field: 'isApproved'},
            ...(trashInspection.responseSendToCallBackUrl
              ? [{header: '', field: '', type: 'text' as const, text: alreadyReceivedWarning}]
              : []),
          ],
          deleteButtonText: sendToNav,
          deleteButtonId: 'sendTrashInspectionToNavConfirmBtn',
          cancelButtonId: 'sendTrashInspectionToNavCancelBtn',
        }
      };
      const sendToNavModal = this.dialog.open(DeleteModalComponent, {...dialogConfigHelper(this.overlay, settings)});
      this.trashInspectionSentToNavSub$ = sendToNavModal.componentInstance.delete
        .subscribe((model: TrashInspectionPnModel) => {
          sendToNavModal.close();
          this.sendToNav(model);
        });
    });
  }

  sendToNav(trashInspection: TrashInspectionPnModel) {
    this.sendingToNavIds = [...this.sendingToNavIds, trashInspection.id];
    this.machineAreaPnMachinesService.sendToNav(trashInspection.id)
      .pipe(finalize(() => this.sendingToNavIds = this.sendingToNavIds.filter((id) => id !== trashInspection.id)))
      .subscribe(() => {
        // Refresh on failure too: a rejected send writes a fresh ErrorFromCallBack, so without
        // this the row keeps rendering its old NAV state and contradicts the error toast.
        this.getAllTrashInspections();
      });
  }

  isSendingToNav(trashInspection: TrashInspectionPnModel): boolean {
    return this.sendingToNavIds.indexOf(trashInspection.id) !== -1;
  }

  showVersionViewModal(trashInspectionId: number) {
    this.dialog.open(TrashInspectionVersionViewComponent, {
      ...dialogConfigHelper(this.overlay, trashInspectionId),
      width: '90vw',
      maxWidth: '90vw',
      minWidth: 800,
    });
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
    this.trashInspectionsStateService.updatePagination(paginationModel);
    this.getAllTrashInspections();
  }

  // NavEnabled is a tenant level setting, but it is carried on the rows, so an empty page
  // says nothing about it. The NAV column and filter are therefore only ever turned on -
  // otherwise a filter that matches nothing would hide the filter used to set it.
  private updateNavEnabled(trashInspections: TrashInspectionPnModel[]) {
    if (this.navEnabled || !trashInspections || !trashInspections.length || !trashInspections[0].navEnabled) {
      return;
    }
    this.navEnabled = true;
    this.tableHeaders = this.getVisibleTableHeaders();
  }

  private getVisibleTableHeaders(): MtxGridColumn[] {
    return this.allTableHeaders.filter((x) => this.navEnabled || x.field !== 'responseSendToCallBackUrl');
  }

  ngOnDestroy(): void {
  }
}
