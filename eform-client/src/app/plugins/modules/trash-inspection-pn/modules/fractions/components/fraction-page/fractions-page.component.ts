import {Component, OnDestroy, OnInit, inject} from '@angular/core';
import {FractionPnModel, TransporterPnModel} from '../../../../models';
import {TrashInspectionPnClaims} from '../../../../enums';
import {TrashInspectionPnFractionsService} from '../../../../services';
import {CommonPaginationState, DeleteModalSettingModel, Paged, PaginationModel} from 'src/app/common/models';
import {FractionsStateService} from '../store';
import {AuthStateService} from 'src/app/common/store';
import {Sort} from '@angular/material/sort';
import {TranslateService} from '@ngx-translate/core';
import {MatDialog} from '@angular/material/dialog';
import {Overlay} from '@angular/cdk/overlay';
import {MtxGridColumn} from '@ng-matero/extensions/grid';
import {AutoUnsubscribe} from 'ngx-auto-unsubscribe';
import {Subscription, zip} from 'rxjs';
import {DeleteModalComponent} from 'src/app/common/modules/eform-shared/components';
import {dialogConfigHelper} from 'src/app/common/helpers';
import {FractionCreateComponent, FractionEditComponent} from '../';
import {Store} from '@ngrx/store';
import {
  selectFractionsPagination,
  selectFractionsPaginationIsSortDsc,
  selectFractionsPaginationSort
} from '../../../../state';

@AutoUnsubscribe()
@Component({
  selector: 'app-trash-inspection-pn-fractions-page',
  templateUrl: './fractions-page.component.html',
  styleUrls: ['./fractions-page.component.scss'],
  standalone: false
})
export class FractionsPageComponent implements OnInit, OnDestroy {
  private store = inject(Store);
  public fractionsStateService = inject(FractionsStateService);
  public authStateService = inject(AuthStateService);
  private translateService = inject(TranslateService);
  private dialog = inject(MatDialog);
  private overlay = inject(Overlay);
  private trashInspectionPnFractionsService = inject(TrashInspectionPnFractionsService);

  fractionsModel: Paged<FractionPnModel> = new Paged<FractionPnModel>();
  tableHeaders: MtxGridColumn[] = [
    {header: this.translateService.stream('Id'), field: 'id', sortProp: {id: 'Id'}, sortable: true},
    {header: this.translateService.stream('Item number'), field: 'itemNumber', sortProp: {id: 'ItemNumber'}, sortable: true},
    {header: this.translateService.stream('Name'), field: 'name', sortProp: {id: 'Name'}, sortable: true},
    {header: this.translateService.stream('Description'), field: 'description', sortProp: {id: 'Description'}, sortable: true},
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
  fractionCreatedSub$: Subscription;
  fractionUpdatedSub$: Subscription;
  currentPagination: CommonPaginationState;

  get trashInspectionPnClaims() {
    return TrashInspectionPnClaims;
  }
  public selectFractionsPaginationSort$ = this.store.select(selectFractionsPaginationSort);
  public selectFractionsPaginationIsSortDsc$ = this.store.select(selectFractionsPaginationIsSortDsc);

  

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
    const editFractionModal =
      this.dialog.open(FractionEditComponent, {...dialogConfigHelper(this.overlay, fraction), minWidth: 400});
    this.fractionUpdatedSub$ = editFractionModal.componentInstance.onFractionUpdated.subscribe(() => this.getAllFractions());
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
    const createFractionModal =
      this.dialog.open(FractionCreateComponent, {...dialogConfigHelper(this.overlay), minWidth: 400});
    this.fractionCreatedSub$ = createFractionModal.componentInstance.onFractionCreated.subscribe(() => this.getAllFractions());
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
    //this.fractionsStateService.updatePagination(paginationModel);
    this.getAllFractions();
  }

  ngOnDestroy(): void {
  }
}
