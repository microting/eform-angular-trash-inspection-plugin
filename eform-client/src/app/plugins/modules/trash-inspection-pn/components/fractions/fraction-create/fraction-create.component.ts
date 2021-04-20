import {
  ChangeDetectorRef,
  Component,
  EventEmitter,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { debounceTime, switchMap } from 'rxjs/operators';
import { TrashInspectionPnFractionsService } from '../../../services';
import { SiteNameDto } from '../../../../../../common/models/dto';
import { DeployModel } from '../../../../../../common/models/eforms';
import { EFormService } from '../../../../../../common/services/eform';
import { SitesService } from '../../../../../../common/services/advanced';
import { AuthService } from '../../../../../../common/services/auth';
import { FractionPnModel } from '../../../models/fraction';
import {
  TemplateListModel,
  TemplateRequestModel,
} from 'src/app/common/models/eforms';

@Component({
  selector: 'app-trash-inspection-pn-fraction-create',
  templateUrl: './fraction-create.component.html',
  styleUrls: ['./fraction-create.component.scss'],
})
export class FractionCreateComponent implements OnInit {
  @ViewChild('frame') frame;
  @Output() onFractionCreated: EventEmitter<void> = new EventEmitter<void>();
  @Output() onDeploymentFinished: EventEmitter<void> = new EventEmitter<void>();
  newFractionModel: FractionPnModel = new FractionPnModel();
  sitesDto: Array<SiteNameDto> = [];
  deployModel: DeployModel = new DeployModel();
  deployViewModel: DeployModel = new DeployModel();
  templateRequestModel: TemplateRequestModel = new TemplateRequestModel();
  templatesModel: TemplateListModel = new TemplateListModel();
  typeahead = new EventEmitter<string>();

  get userClaims() {
    return this.authService.userClaims;
  }
  constructor(
    private trashInspectionPnFractionsService: TrashInspectionPnFractionsService,
    private sitesService: SitesService,
    private authService: AuthService,
    private eFormService: EFormService,
    private cd: ChangeDetectorRef
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
  }

  ngOnInit() {
    this.loadAllSites();
  }

  createInstallation() {
    // debugger;
    this.trashInspectionPnFractionsService
      .createFraction(this.newFractionModel)
      .subscribe((data) => {
        // debugger;
        if (data && data.success) {
          this.onFractionCreated.emit();
          // this.submitDeployment();
          this.newFractionModel = new FractionPnModel();
          this.frame.hide();
        }
      });
  }

  loadAllSites() {
    if (this.userClaims.eformsPairingRead) {
      this.sitesService.getAllSitesForPairing().subscribe((operation) => {
        if (operation && operation.success) {
          this.sitesDto = operation.model;
        }
      });
    }
  }

  show() {
    this.deployModel = new DeployModel();
    this.deployViewModel = new DeployModel();
    this.frame.show();
  }

  onSelectedChanged(e: any) {
    // debugger;
    this.newFractionModel.eFormId = e.id;
  }
  // submitDeployment() {
  //   this.spinnerStatus = true;
  //   // this.deployModel.id = this.newInstallationModel.id;
  //   this.eFormService.deploySingle(this.deployModel).subscribe(operation => {
  //     if (operation && operation.success) {
  //       this.frame.hide();
  //       this.onDeploymentFinished.emit();
  //     }
  //
  //   });
  // }
}
