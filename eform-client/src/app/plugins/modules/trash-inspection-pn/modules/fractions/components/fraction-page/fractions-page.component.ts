import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {FractionPnModel, TransporterPnModel} from '../../../../models';
import {TrashInspectionPnClaims} from '../../../../enums';
import {DeleteModalSettingModel, Paged, PaginationModel} from 'src/app/common/models';
import {FractionsStateService} from '../store';
import {AuthStateService} from 'src/app/common/store';
import {Sort} from '@angular/material/sort';
import {TranslateService} from '@ngx-translate/core';
import {MatDialog} from '@angular/material/dialog';
import {Overlay} from '@angular/cdk/overlay';
import {MtxGridColumn} from '@ng-matero/extensions/grid';
import {AutoUnsubscribe} from 'ngx-auto-unsubscribe';
import {TrashInspectionPnFractionsService} from 'src/app/plugins/modules/trash-inspection-pn/services';
import {Subscription, zip} from 'rxjs';
import {DeleteModalComponent} from 'src/app/common/modules/eform-shared/components';
import {dialogConfigHelper} from 'src/app/common/helpers';

@AutoUnsubscribe()
@Component({
  selector: 'app-trash-inspection-pn-fractions-page',
  templateUrl: './fractions-page.component.html',
  styleUrls: ['./fractions-page.component.scss'],
})
export class FractionsPageComponent implements OnInit, OnDestroy {
  @ViewChild('createFractionModal') createFractionModal;
  @ViewChild('editFractionModal') editFractionModal;
  fractionsModel: Paged<FractionPnModel> = new Paged<FractionPnModel>();
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

  translatesSub$: Subscription;
  fractionDeletedSub$: Subscription;

  get trashInspectionPnClaims() {
    return TrashInspectionPnClaims;
  }

  constructor(
    public fractionsStateService: FractionsStateService,
    public authStateService: AuthStateService,
    private translateService: TranslateService,
    private dialog: MatDialog,
    private overlay: Overlay,
    private trashInspectionPnFractionsService: TrashInspectionPnFractionsService,
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
    this.translatesSub$ = zip(
      this.translateService.stream('Are you sure you want to delete'),
      this.translateService.stream('Name'),
    ).subscribe(([headerText, name]) => {
      const settings: DeleteModalSettingModel = {
        model: fraction,
        settings: {
          headerText: `${headerText}?`,
          fields: [
            {header: 'ID', field: 'id'},
            {header: name, field: 'name'},
          ],
          cancelButtonId: 'fractionDeleteCancelBtn',
          deleteButtonId: 'fractionDeleteDeleteBtn',
        }
      };
      const deleteFractionModal = this.dialog.open(DeleteModalComponent, {...dialogConfigHelper(this.overlay, settings)});
      this.fractionDeletedSub$ = deleteFractionModal.componentInstance.delete
        .subscribe((model: TransporterPnModel) => {
          this.trashInspectionPnFractionsService.deleteFraction(model.id)
            .subscribe((data) => {
              if (data && data.success) {
                deleteFractionModal.close();
                this.onFractionDeleted();
              }
            });
        });
    });
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
