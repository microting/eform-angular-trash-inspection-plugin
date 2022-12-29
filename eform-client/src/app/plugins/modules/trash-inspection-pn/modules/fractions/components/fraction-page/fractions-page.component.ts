import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {FractionPnModel} from '../../../../models';
import {TrashInspectionPnClaims} from '../../../../enums';
import {Paged, PaginationModel} from 'src/app/common/models';
import {FractionsStateService} from '../store';
import {AuthStateService} from 'src/app/common/store';
import {Sort} from '@angular/material/sort';
import {TranslateService} from '@ngx-translate/core';
import {MatDialog} from '@angular/material/dialog';
import {Overlay} from '@angular/cdk/overlay';
import {MtxGridColumn} from '@ng-matero/extensions/grid';
import {AutoUnsubscribe} from 'ngx-auto-unsubscribe';

@AutoUnsubscribe()
@Component({
  selector: 'app-trash-inspection-pn-fractions-page',
  templateUrl: './fractions-page.component.html',
  styleUrls: ['./fractions-page.component.scss'],
})
export class FractionsPageComponent implements OnInit, OnDestroy {
  @ViewChild('createFractionModal') createFractionModal;
  @ViewChild('editFractionModal') editFractionModal;
  @ViewChild('deleteFractionModal') deleteFractionModal;
  fractionsModel: Paged<FractionPnModel> = new Paged<FractionPnModel>();

  get trashInspectionPnClaims() {
    return TrashInspectionPnClaims;
  }

  tableHeaders: MtxGridColumn[] = [
    {header: this.translateService.stream('Id'), field: 'id', sortProp: {id: 'Id'}, sortable: true},
    {header: this.translateService.stream('Item number'), field: 'itemNumber', sortProp: {id: 'ItemNumber'}, sortable: true},
    {header: this.translateService.stream('Name'), field: 'name', sortProp: {id: 'Name'}, sortable: true},
    {header: this.translateService.stream('Location code'), field: 'locationCode', sortProp: {id: 'LocationCode'}, sortable: true},
    {header: this.translateService.stream('eForm'), field: 'selectedTemplateName', sortProp: {id: 'eFormId'}, sortable: true},
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
          click: (fraction: FractionPnModel) => this.showEditFractionModal(fraction),
          tooltip: this.translateService.stream('Edit Fraction'),
          class: 'updateFractionBtn',
        },
        {
          type: 'icon',
          icon: 'delete',
          color: 'warn',
          click: (fraction: FractionPnModel) => this.showDeleteFractionModal(fraction),
          tooltip: this.translateService.stream('Delete Fraction'),
          class: 'deleteFractionBtn',
        },
      ]
    },
  ];

  constructor(
    public fractionsStateService: FractionsStateService,
    public authStateService: AuthStateService,
    private translateService: TranslateService,
    private dialog: MatDialog,
    private overlay: Overlay,
  ) {
  }

  ngOnInit() {
    this.getAllInitialData();
  }

  getAllInitialData() {
    this.getAllFractions();
  }

  getAllFractions() {
    this.fractionsStateService.getAllFractions().subscribe((data) => {
      if (data && data.success) {
        this.fractionsModel = data.model;
      }
    });
  }

  showEditFractionModal(fraction: FractionPnModel) {
    this.editFractionModal.show(fraction);
  }

  showDeleteFractionModal(fraction: FractionPnModel) {
    this.deleteFractionModal.show(fraction);
  }

  showCreateFractionModal() {
    this.createFractionModal.show();
  }

  sortTable(sort: Sort) {
    this.fractionsStateService.onSortTable(sort.active);
    this.getAllFractions();
  }

  onFractionDeleted() {
    this.fractionsStateService.onDelete();
    this.getAllFractions();
  }

  onPaginationChanged(paginationModel: PaginationModel) {
    this.fractionsStateService.updatePagination(paginationModel);
    this.getAllFractions();
  }

  ngOnDestroy(): void {
  }
}
