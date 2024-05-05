import {
  ChangeDetectorRef,
  Component,
  EventEmitter,
  OnInit,
} from '@angular/core';
import { debounceTime, switchMap } from 'rxjs/operators';
import { TrashInspectionPnFractionsService } from '../../../../services';
import { SiteNameDto, DeployModel } from 'src/app/common/models';
import { SitesService, EFormService } from 'src/app/common/services';
import { FractionPnModel } from '../../../../models';
import {
  TemplateListModel,
  TemplateRequestModel,
} from 'src/app/common/models/eforms';
import { AuthStateService } from 'src/app/common/store';
import {MatDialogRef} from '@angular/material/dialog';
import {selectCurrentUserClaimsEformsPairingRead} from 'src/app/state';
import {Store} from '@ngrx/store';

@Component({
  selector: 'app-trash-inspection-pn-fraction-create',
  templateUrl: './fraction-create.component.html',
  styleUrls: ['./fraction-create.component.scss'],
})
export class FractionCreateComponent implements OnInit {
  onFractionCreated: EventEmitter<void> = new EventEmitter<void>();
  newFractionModel: FractionPnModel = new FractionPnModel();
  sitesDto: Array<SiteNameDto> = [];
  deployModel: DeployModel = new DeployModel();
  deployViewModel: DeployModel = new DeployModel();
  templateRequestModel: TemplateRequestModel = new TemplateRequestModel();
  templatesModel: TemplateListModel = new TemplateListModel();
  typeahead = new EventEmitter<string>();
  private selectCurrentUserClaimsEformsPairingRead$ = this.authStore.select(selectCurrentUserClaimsEformsPairingRead);

  constructor(
    private authStore: Store,
    private trashInspectionPnFractionsService: TrashInspectionPnFractionsService,
    private sitesService: SitesService,
    private authStateService: AuthStateService,
    private eFormService: EFormService,
    private cd: ChangeDetectorRef,
    public dialogRef: MatDialogRef<FractionCreateComponent>,
  ) {
    this.typeahead
      .pipe(
        debounceTime(200),
        switchMap((term) => {
          this.templateRequestModel.nameFilter = term;
          return this.eFormService.getAll(this.templateRequestModel);
        })
      )
      .subscribe((items) => {
        this.templatesModel = items.model;
        this.cd.markForCheck();
      });
    this.deployModel = new DeployModel();
    this.deployViewModel = new DeployModel();
  }

  ngOnInit() {
    this.loadAllSites();
  }

  createFraction() {
    this.trashInspectionPnFractionsService
      .createFraction(this.newFractionModel)
      .subscribe((data) => {
        if (data && data.success) {
          this.onFractionCreated.emit();
          this.hide();
        }
      });
  }

  loadAllSites() {
    this.selectCurrentUserClaimsEformsPairingRead$.subscribe((x) => {
      if (x) {
      this.sitesService.getAllSitesForPairing().subscribe((operation) => {
        if (operation && operation.success) {
          this.sitesDto = operation.model;
        }
      });
    }
    });
  }

  onSelectedChanged(e: any) {
    this.newFractionModel.eFormId = e.id;
  }

  hide() {
    this.newFractionModel = new FractionPnModel();
    this.dialogRef.close();
  }
}
