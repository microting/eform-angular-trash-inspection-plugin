import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {
  InstallationPnModel,
  InstallationsPnModel,
} from '../../../../models';
import {PaginationModel, TableHeaderElementModel} from 'src/app/common/models';
import {InstallationsStateService} from '../store';
import {Sort} from '@angular/material/sort';
import {AutoUnsubscribe} from 'ngx-auto-unsubscribe';
import {TranslateService} from '@ngx-translate/core';
import {MatDialog} from '@angular/material/dialog';
import {Overlay} from '@angular/cdk/overlay';
import {MtxGridColumn} from '@ng-matero/extensions/grid';

@AutoUnsubscribe()
@Component({
  selector: 'app-trash-inspection-pn-installations-page',
  templateUrl: './installations-page.component.html',
  styleUrls: ['./installations-page.component.scss'],
})
export class InstallationsPageComponent implements OnInit, OnDestroy {
  @ViewChild('createInspectionModal') createInspectionModal;
  @ViewChild('editInstallationModal') editInstallationModal;
  @ViewChild('deleteInstallationModal') deleteInstallationModal;
  installationsModel: InstallationsPnModel = new InstallationsPnModel();

  tableHeaders: TableHeaderElementModel[] = [
    {name: 'Id', elementId: 'idTableHeader', sortable: true},
    {name: 'Name', elementId: 'nameTableHeader', sortable: true},
    {name: 'Actions', elementId: '', sortable: false},
  ];

  tableHeaders1: MtxGridColumn[] = [
    {header: this.translateService.stream('Id'), field: 'id', sortProp: {id: 'Id'}, sortable: true},
    {header: this.translateService.stream('Name'), field: 'name', sortProp: {id: 'Name'}, sortable: true},
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
          click: (installation: InstallationPnModel) => this.showEditInstallationModal(installation),
          tooltip: this.translateService.stream('Edit Installation'),
          class: 'updateInstallationBtn',
        },
        {
          type: 'icon',
          icon: 'delete',
          color: 'warn',
          click: (installation: InstallationPnModel) => this.showDeleteInstallationModal(installation),
          tooltip: this.translateService.stream('Delete Installation'),
          class: 'deleteInstallationBtn',
        },
      ]
    },
  ];

  constructor(
    public installationsStateService: InstallationsStateService,
    private translateService: TranslateService,
    private dialog: MatDialog,
    private overlay: Overlay,
  ) {
  }

  ngOnInit() {
    this.getAllInitialData();
  }

  getAllInitialData() {
    this.getAllInstallations();
  }

  getAllInstallations() {
    this.installationsStateService.getAllInstallations().subscribe((data) => {
      if (data && data.success) {
        this.installationsModel = data.model;
      }
    });
  }

  showEditInstallationModal(installation: InstallationPnModel) {
    this.editInstallationModal.show(installation);
  }

  showDeleteInstallationModal(installation: InstallationPnModel) {
    this.deleteInstallationModal.show(installation);
  }

  showCreateInstallationModal() {
    this.createInspectionModal.show();
  }

  sortTable(sort: Sort) {
    this.installationsStateService.onSortTable(sort.active);
    this.getAllInstallations();
  }

  changePage(offset: number) {
    this.installationsStateService.changePage(offset);
    this.getAllInstallations();
  }

  onPageSizeChanged(pageSize: number) {
    this.installationsStateService.updatePageSize(pageSize);
    this.getAllInstallations();
  }

  onInstallationDeleted() {
    this.installationsStateService.onDelete();
    this.getAllInstallations();
  }

  onPaginationChanged(paginationModel: PaginationModel) {
    this.installationsStateService.updatePagination(paginationModel);
    this.getAllInstallations();
  }

  ngOnDestroy() {
  }
}
