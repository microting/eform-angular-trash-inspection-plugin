import {Component, OnDestroy, OnInit, inject} from '@angular/core';
import {
  InstallationPnModel,
  InstallationsPnModel,
} from '../../../../models';
import {TrashInspectionPnInstallationsService} from '../../../../services';
import {DeleteModalSettingModel, PaginationModel} from 'src/app/common/models';
import {InstallationsStateService} from '../store';
import {Sort} from '@angular/material/sort';
import {AutoUnsubscribe} from 'ngx-auto-unsubscribe';
import {TranslateService} from '@ngx-translate/core';
import {MatDialog} from '@angular/material/dialog';
import {Overlay} from '@angular/cdk/overlay';
import {MtxGridColumn} from '@ng-matero/extensions/grid';
import {Subscription, zip} from 'rxjs';
import {DeleteModalComponent} from 'src/app/common/modules/eform-shared/components';
import {dialogConfigHelper} from 'src/app/common/helpers';
import {InstallationCreateComponent, InstallationEditComponent} from '../';
import {Store} from '@ngrx/store';
import {
  selectInstallationsPagination,
  selectInstallationsPaginationIsSortDsc,
  selectInstallationsPaginationSort
} from '../../../../state';

@AutoUnsubscribe()
@Component({
  selector: 'app-trash-inspection-pn-installations-page',
  templateUrl: './installations-page.component.html',
  styleUrls: ['./installations-page.component.scss'],
  standalone: false
})
export class InstallationsPageComponent implements OnInit, OnDestroy {
  private store = inject(Store);
  public installationsStateService = inject(InstallationsStateService);
  private translateService = inject(TranslateService);
  private dialog = inject(MatDialog);
  private overlay = inject(Overlay);
  private trashInspectionPnInstallationsService = inject(TrashInspectionPnInstallationsService);

  installationsModel: InstallationsPnModel = new InstallationsPnModel();

  tableHeaders: MtxGridColumn[] = [
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

  translatesSub$: Subscription;
  installationDeletedSub$: Subscription;
  installationCreatedSub$: Subscription;
  installationUpdatedSub$: Subscription;
  public selectInstallationsPaginationSort$ = this.store.select(selectInstallationsPaginationSort);
  public selectInstallationsPaginationIsSortDsc$ = this.store.select(selectInstallationsPaginationIsSortDsc);
  public selectInstallationsPagination$ = this.store.select(selectInstallationsPagination);

  

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
    const editInstallationModal =
      this.dialog.open(InstallationEditComponent, {...dialogConfigHelper(this.overlay, installation), minWidth: 400});
    this.installationUpdatedSub$ = editInstallationModal.componentInstance.onInstallationUpdated
      .subscribe(() => this.getAllInstallations());
  }

  showDeleteInstallationModal(installation: InstallationPnModel) {
    this.translatesSub$ = zip(
      this.translateService.stream('Are you sure you want to delete'),
      this.translateService.stream('Name'),
    ).subscribe(([headerText, name]) => {
      const settings: DeleteModalSettingModel = {
        model: installation,
        settings: {
          headerText: `${headerText}?`,
          fields: [
            {header: 'ID', field: 'id'},
            {header: name, field: 'name'},
          ],
          cancelButtonId: 'installationDeleteCancelBtn',
          deleteButtonId: 'installationDeleteDeleteBtn',
        }
      };
      const deleteInspectionModal = this.dialog.open(DeleteModalComponent, {...dialogConfigHelper(this.overlay, settings)});
      this.installationDeletedSub$ = deleteInspectionModal.componentInstance.delete
        .subscribe((model: InstallationPnModel) => {
          this.trashInspectionPnInstallationsService.deleteInstallation(model.id)
            .subscribe((data) => {
              if (data && data.success) {
                deleteInspectionModal.close();
                this.onInstallationDeleted();
              }
            });
        });
    });
  }

  showCreateInstallationModal() {
    const createInspectionModal = this.dialog.open(InstallationCreateComponent, {...dialogConfigHelper(this.overlay), minWidth: 400});
    this.installationCreatedSub$ = createInspectionModal.componentInstance.installationCreated.subscribe(() => this.getAllInstallations());
  }

  sortTable(sort: Sort) {
    this.installationsStateService.onSortTable(sort.active);
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
