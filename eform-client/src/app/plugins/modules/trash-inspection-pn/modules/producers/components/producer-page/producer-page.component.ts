import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
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

@AutoUnsubscribe()
@Component({
  selector: 'app-producer-page',
  templateUrl: './producer-page.component.html',
  styleUrls: ['./producer-page.component.scss'],
})
export class ProducerPageComponent implements OnInit, OnDestroy {
  @ViewChild('createProducerModal') createProducerModal;
  @ViewChild('editProducerModal') editProducerModal;
  producersModel: ProducersPnModel = new ProducersPnModel();

  tableHeaders1: MtxGridColumn[] = [
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

  constructor(
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
    this.createProducerModal.show();
  }

  showEditProducerModal(producer: ProducerPnModel) {
    this.editProducerModal.show(producer);
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
    this.producersStateService.updatePagination(paginationModel);
    this.getAllProducers();
  }

  onProducerDeleted() {
    this.producersStateService.onDelete();
    this.getAllProducers();
  }

  onPageSizeChanged(pageSize: number) {
    this.producersStateService.updatePageSize(pageSize);
    this.getAllProducers();
  }

  ngOnDestroy(): void {
  }
}
