import {Component, OnDestroy, OnInit} from '@angular/core';
import {DeleteModalSettingModel, PaginationModel,} from 'src/app/common/models';
import {ProducerPnModel, ProducersPnModel} from '../../../../models';
import {TrashInspectionPnProducersService} from '../../../../services';
import {ProducersStateService} from '../store';
import {Sort} from '@angular/material/sort';
import {TranslateService} from '@ngx-translate/core';
import {MatDialog} from '@angular/material/dialog';
import {Overlay} from '@angular/cdk/overlay';
import {MtxGridColumn} from '@ng-matero/extensions/grid';
import {AutoUnsubscribe} from 'ngx-auto-unsubscribe';
import {Subscription, zip} from 'rxjs';
import {DeleteModalComponent} from 'src/app/common/modules/eform-shared/components';
import {dialogConfigHelper} from 'src/app/common/helpers';
import {ProducerCreateComponent, ProducerEditComponent} from '../';
import {Store} from '@ngrx/store';
import {
  selectProducersPagination,
  selectProducersPaginationIsSortDsc,
  selectProducersPaginationSort
} from '../../../../state';

@AutoUnsubscribe()
@Component({
  selector: 'app-producer-page',
  templateUrl: './producer-page.component.html',
  styleUrls: ['./producer-page.component.scss'],
})
export class ProducerPageComponent implements OnInit, OnDestroy {
  producersModel: ProducersPnModel = new ProducersPnModel();

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
          click: (producer: ProducerPnModel) => this.showEditProducerModal(producer),
          tooltip: this.translateService.stream('Edit Producer'),
          class: 'updateFractionBtn',
        },
        {
          type: 'icon',
          icon: 'delete',
          color: 'warn',
          click: (producer: ProducerPnModel) => this.showDeleteProducerModal(producer),
          tooltip: this.translateService.stream('Delete Producer'),
          class: 'deleteFractionBtn',
        },
      ]
    },
  ];
  translatesSub$: Subscription;
  producerDeletedSub$: Subscription;
  producerCreatedSub$: Subscription;
  producerUpdatedSub$: Subscription;
  public selectProducersPaginationSort$ = this.store.select(selectProducersPaginationSort);
  public selectProducersPaginationIsSortDsc$ = this.store.select(selectProducersPaginationIsSortDsc);
  public selectProducersPagination$ = this.store.select(selectProducersPagination);

  constructor(
    private store: Store,
    public producersStateService: ProducersStateService,
    private translateService: TranslateService,
    private dialog: MatDialog,
    private overlay: Overlay,
    private trashInspectionPnProducerService: TrashInspectionPnProducersService
  ) {
  }

  ngOnInit() {
    this.getAllInitialData();
  }

  getAllInitialData() {
    this.getAllProducers();
  }

  getAllProducers() {
    this.producersStateService.getAllProducers().subscribe((data) => {
      if (data && data.success) {
        this.producersModel = data.model;
      }
    });
  }

  showCreateProducerModal() {
    const createProducerModal =
      this.dialog.open(ProducerCreateComponent, {...dialogConfigHelper(this.overlay), minWidth: 400});
    this.producerCreatedSub$ = createProducerModal.componentInstance.onProducerCreated.subscribe(() => this.getAllProducers());
  }

  showEditProducerModal(producer: ProducerPnModel) {
    const editProducerModal =
      this.dialog.open(ProducerEditComponent, {...dialogConfigHelper(this.overlay, producer), minWidth: 400});
    this.producerUpdatedSub$ = editProducerModal.componentInstance.onProducerUpdated.subscribe(() => this.getAllProducers());
  }

  showDeleteProducerModal(producer: ProducerPnModel) {
    this.translatesSub$ = zip(
      this.translateService.stream('Are you sure you want to delete'),
      this.translateService.stream('Name'),
    ).subscribe(([headerText, name]) => {
      const settings: DeleteModalSettingModel = {
        model: producer,
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
      const deleteProducerModal = this.dialog.open(DeleteModalComponent, {...dialogConfigHelper(this.overlay, settings)});
      this.producerDeletedSub$ = deleteProducerModal.componentInstance.delete
        .subscribe((model: ProducerPnModel) => {
          this.trashInspectionPnProducerService.deleteProducer(model.id)
            .subscribe((data) => {
              if (data && data.success) {
                deleteProducerModal.close();
                this.onProducerDeleted();
              }
            });
        });
    });
  }

  sortTable(sort: Sort) {
    this.producersStateService.onSortTable(sort.active);
    this.getAllProducers();
  }

  onPaginationChanged(paginationModel: PaginationModel) {
    //this.producersStateService.updatePagination(paginationModel);
    this.getAllProducers();
  }

  onProducerDeleted() {
    this.producersStateService.onDelete();
    this.getAllProducers();
  }

  ngOnDestroy(): void {
  }
}
