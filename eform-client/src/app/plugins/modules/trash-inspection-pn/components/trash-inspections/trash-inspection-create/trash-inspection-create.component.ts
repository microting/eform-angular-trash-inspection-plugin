import {ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {
  TrashInspectionPnFractionsService,
  TrashInspectionPnInstallationsService,
  TrashInspectionPnProducersService,
  TrashInspectionPnSettingsService,
  TrashInspectionPnTransporterService,
  TrashInspectionPnTrashInspectionsService
} from 'src/app/plugins/modules/trash-inspection-pn/services';
import {
  InstallationPnCreateModel,
  InstallationPnModel, InstallationPnRequestModel,
  InstallationsPnModel,
  TrashInspectionPnCreateModel, TrashInspectionPnModel,
  TrashInspectionsPnModel,
} from '../../../models';
import {TemplateListModel, TemplateRequestModel} from '../../../../../../common/models/eforms';
import {debounceTime, switchMap} from 'rxjs/operators';
import {EFormService} from '../../../../../../common/services/eform';
import {TransporterPnRequestModel, TransportersPnModel} from '../../../models/transporter';
import {ProducerPnRequestModel, ProducersPnModel} from '../../../models/producer';
import {FractionPnRequestModel, FractionsPnModel} from '../../../models/fraction';
import {TrashInspectionBaseSettingsModel} from '../../../models/trash-inspection-base-settings.model';

@Component({
  selector: 'app-trash-inspection-pn-trash-inspection-create',
  templateUrl: './trash-inspection-create.component.html',
  styleUrls: ['./trash-inspection-create.component.scss']
})
export class TrashInspectionCreateComponent implements OnInit {
  @ViewChild('frame') frame;
  @Output() onTrashInspectionCreated: EventEmitter<void> = new EventEmitter<void>();
  transportersModel: TransportersPnModel = new TransportersPnModel();
  producersModel: ProducersPnModel = new ProducersPnModel();
  installationsModel: InstallationsPnModel = new InstallationsPnModel();
  fractionsModel: FractionsPnModel = new FractionsPnModel();
  producerRequestModel: ProducerPnRequestModel = new ProducerPnRequestModel();
  transporterRequestModel: TransporterPnRequestModel = new TransporterPnRequestModel();
  fractionRequestModel: FractionPnRequestModel = new FractionPnRequestModel();
  checked = false;
  spinnerStatus = false;
  settingsModel: TrashInspectionBaseSettingsModel = new TrashInspectionBaseSettingsModel();
  newTrashInspectionModel: TrashInspectionPnModel = new TrashInspectionPnModel();
  installationRequestModel: InstallationPnRequestModel = new InstallationPnRequestModel();
  typeaheadInstallation = new EventEmitter<string>();
  typeaheadProducer = new EventEmitter<string>();
  typeaheadTransporter = new EventEmitter<string>();
  typeaheadFraction = new EventEmitter<string>();


  constructor(private trashInspectionPnInstallationsService: TrashInspectionPnInstallationsService,
              private trashInspectionPnSettingsService: TrashInspectionPnSettingsService,
              private eFormService: EFormService,
              private installationsService: TrashInspectionPnInstallationsService,
              private producersService: TrashInspectionPnProducersService,
              private transportersService: TrashInspectionPnTransporterService,
              private fractionsService: TrashInspectionPnFractionsService,
              private trashInspectionPnTrashInspectionsService: TrashInspectionPnTrashInspectionsService,
              private cd: ChangeDetectorRef) {
      this.typeaheadInstallation
        .pipe(
          debounceTime(200),
          switchMap(term => {
            this.installationRequestModel.nameFilter = term;
            return this.installationsService.getAllInstallations(this.installationRequestModel);
          })
        )
        .subscribe(items => {
          this.installationsModel = items.model;
          this.cd.markForCheck();
        });
    this.typeaheadProducer
      .pipe(
        debounceTime(200),
        switchMap(term => {
          this.producerRequestModel.nameFilter = term;
          return this.producersService.getAllProducers(this.producerRequestModel);
        })
      )
      .subscribe(items => {
        this.producersModel = items.model;
        this.cd.markForCheck();
      });
    this.typeaheadTransporter
      .pipe(
        debounceTime(200),
        switchMap(term => {
          this.transporterRequestModel.nameFilter = term;
          return this.transportersService.getAllTransporters(this.transporterRequestModel);
        })
      )
      .subscribe(items => {
        this.transportersModel = items.model;
        this.cd.markForCheck();
      });
    this.typeaheadFraction
      .pipe(
        debounceTime(200),
        switchMap(term => {
          this.fractionRequestModel.nameFilter = term;
          return this.fractionsService.getAllFractions(this.fractionRequestModel);
        })
      )
      .subscribe(items => {
        this.fractionsModel = items.model;
        this.cd.markForCheck();
      });
    }

  ngOnInit() {
    this.getSettings();
  }

  show() {
    this.frame.show();
  }
  getSettings() {
    this.spinnerStatus = true;
    this.trashInspectionPnSettingsService.getAllSettings().subscribe((data) => {
      if (data && data.success) {
        this.settingsModel = data.model;
      } this.spinnerStatus = false;
    });
  }
  createTrashInspection() {
    this.spinnerStatus = true;
    this.newTrashInspectionModel.token = this.settingsModel.token;
    this.trashInspectionPnTrashInspectionsService.createTrashInspection(this.newTrashInspectionModel).subscribe((data) => {
      if (data && data.success) {
        this.onTrashInspectionCreated.emit();
        this.newTrashInspectionModel = new TrashInspectionPnModel();
        this.frame.hide();
      }
      this.spinnerStatus = false;
    });
  }
  addToArray(e: any, installationId: number) {
    if (e.target.checked) {
      this.newTrashInspectionModel.relatedAreasIds.push(installationId);
    } else {
      this.newTrashInspectionModel.relatedAreasIds = this.newTrashInspectionModel.relatedAreasIds.filter(x => x !== installationId);
    }
  }
  onInstallationSelectedChanged(e: any) {
    // debugger;
    this.newTrashInspectionModel.installationName = e.name;
  }
  onProducerSelectedChanged(e: any) {
    // debugger;
    this.newTrashInspectionModel.producer = e.name;
  }
  onTransporterSelectedChanged(e: any) {
    // debugger;
    this.newTrashInspectionModel.transporter = e.name;
  }
  onFractionSelectedChanged(e: any) {
    // debugger;
    this.newTrashInspectionModel.trashFraction = e.itemNumber;
  }
  isChecked(status: boolean) {
    this.newTrashInspectionModel.mustBeInspected = status;
  }
}
