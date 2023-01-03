import {Component, OnDestroy, OnInit,} from '@angular/core';
import {
  TransporterPnModel,
  TransportersPnModel,
} from '../../../../models';
import {DeleteModalSettingModel, PaginationModel,} from 'src/app/common/models';
import {TransportersStateService} from '../store';
import {Sort} from '@angular/material/sort';
import {TranslateService} from '@ngx-translate/core';
import {MatDialog} from '@angular/material/dialog';
import {Overlay} from '@angular/cdk/overlay';
import {MtxGridColumn} from '@ng-matero/extensions/grid';
import {Subscription, zip} from 'rxjs';
import {DeleteModalComponent} from 'src/app/common/modules/eform-shared/components';
import {dialogConfigHelper} from 'src/app/common/helpers';
import {TrashInspectionPnTransporterService} from '../../../../services';
import {AutoUnsubscribe} from 'ngx-auto-unsubscribe';
import {TransporterCreateComponent, TransporterEditComponent} from '../';

@AutoUnsubscribe()
@Component({
  selector: 'app-transporter-page',
  templateUrl: './transporter-page.component.html',
  styleUrls: ['./transporter-page.component.scss'],
})
export class TransporterPageComponent implements OnInit, OnDestroy {
  transportersModel: TransportersPnModel = new TransportersPnModel();
  tableHeaders: MtxGridColumn[] = [
    {header: this.translateService.stream('Id'), field: 'id', sortProp: {id: 'Id'}, sortable: true},
    {header: this.translateService.stream('Name'), field: 'name', sortProp: {id: 'Name'}, sortable: true},
    {header: this.translateService.stream('Description'), field: 'description', sortProp: {id: 'Description'}, sortable: true},
    {header: this.translateService.stream('Foreign ID'), field: 'foreignId', sortProp: {id: 'ForeignId'}, sortable: true},
    {header: this.translateService.stream('Address'), field: 'address', sortProp: {id: 'Address'}, sortable: true},
    {header: this.translateService.stream('City'), field: 'city', sortProp: {id: 'City'}, sortable: true},
    {header: this.translateService.stream('Zip Code'), field: 'zipCode', sortProp: {id: 'ZipCode'}, sortable: true},
    {header: this.translateService.stream('Phone'), field: 'phone', sortProp: {id: 'Phone'}, sortable: true},
    {header: this.translateService.stream('Contact Person'), field: 'contactPerson', sortProp: {id: 'ContactPerson'}, sortable: true},
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
          click: (transporter: TransporterPnModel) => this.showEditTransporterModal(transporter),
          tooltip: this.translateService.stream('Edit Transporter'),
          class: 'updateFractionBtn',
        },
        {
          type: 'icon',
          icon: 'delete',
          color: 'warn',
          click: (transporter: TransporterPnModel) => this.showDeleteTransporterModal(transporter),
          tooltip: this.translateService.stream('Delete Transporter'),
          class: 'deleteFractionBtn',
        },
      ]
    },
  ];

  translatesSub$: Subscription;
  transporterDeletedSub$: Subscription;
  transporterUpdatedSub$: Subscription;
  transporterCreatedSub$: Subscription;

  constructor(
    public transportersStateService: TransportersStateService,
    private translateService: TranslateService,
    private dialog: MatDialog,
    private overlay: Overlay,
    private trashInspectionPnTransporterService: TrashInspectionPnTransporterService
  ) {
  }

  ngOnInit() {
    this.getAllInitialData();
  }

  getAllInitialData() {
    this.getAllTransporters();
  }

  getAllTransporters() {
    this.transportersStateService.getAllTransporters().subscribe((data) => {
      if (data && data.success) {
        this.transportersModel = data.model;
      }
    });
  }

  showCreateTransporterModal() {
    const createTransporterModal =
      this.dialog.open(TransporterCreateComponent, {...dialogConfigHelper(this.overlay), minWidth: 400});
    this.transporterCreatedSub$ = createTransporterModal.componentInstance.transporterCreated.subscribe(() => this.getAllTransporters());
  }

  showEditTransporterModal(transporter: TransporterPnModel) {
    const editTransporterModal =
      this.dialog.open(TransporterEditComponent, {...dialogConfigHelper(this.overlay, transporter), minWidth: 400});
    this.transporterUpdatedSub$ = editTransporterModal.componentInstance.transporterUpdated.subscribe(() => this.getAllTransporters());
  }

  showDeleteTransporterModal(transporter: TransporterPnModel) {
    this.translatesSub$ = zip(
      this.translateService.stream('Are you sure you want to delete'),
      this.translateService.stream('Name'),
    ).subscribe(([headerText, name]) => {
      const settings: DeleteModalSettingModel = {
        model: transporter,
        settings: {
          headerText: `${headerText}?`,
          fields: [
            {header: 'ID', field: 'id'},
            {header: name, field: 'name'},
          ],
          cancelButtonId: 'producerDeleteCancelBtn',
          deleteButtonId: 'producerDeleteDeleteBtn',
        }
      };
      const deleteTransporterModal = this.dialog.open(DeleteModalComponent, {...dialogConfigHelper(this.overlay, settings)});
      this.transporterDeletedSub$ = deleteTransporterModal.componentInstance.delete
        .subscribe((model: TransporterPnModel) => {
          this.trashInspectionPnTransporterService.deleteTransporter(model.id)
            .subscribe((data) => {
              if (data && data.success) {
                deleteTransporterModal.close();
                this.onTransporterDeleted();
              }
            });
        });
    });
  }

  sortTable(sort: Sort) {
    this.transportersStateService.onSortTable(sort.active);
    this.getAllTransporters();
  }

  changePage(offset: any) {
    this.transportersStateService.changePage(offset);
    this.getAllTransporters();
  }

  onPageSizeChanged(pageSize: number) {
    this.transportersStateService.updatePageSize(pageSize);
    this.getAllTransporters();
  }

  onTransporterDeleted() {
    this.transportersStateService.onDelete();
    this.getAllTransporters();
  }

  onPaginationChanged(paginationModel: PaginationModel) {
    this.transportersStateService.updatePagination(paginationModel);
    this.getAllTransporters();
  }

  ngOnDestroy(): void {
  }
}
