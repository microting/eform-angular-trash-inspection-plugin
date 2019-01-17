import {Component, EventEmitter, OnInit, Output, ViewChild} from '@angular/core';
import {InstallationPnModel, InstallationPnUpdateModel} from 'src/app/plugins/modules/trash-inspection-pn/models/installation';
import {TrashInspectionPnInstallationsService} from 'src/app/plugins/modules/trash-inspection-pn/services';

@Component({
  selector: 'app-trash-inspection-pn-installation-delete',
  templateUrl: './installation-delete.component.html',
  styleUrls: ['./installation-delete.component.scss']
})
export class InstallationDeleteComponent implements OnInit {
  @ViewChild('frame') frame;
  @Output() onInstallationDeleted: EventEmitter<void> = new EventEmitter<void>();
  spinnerStatus = false;
  selectedInstallationModel: InstallationPnModel = new InstallationPnModel();
  constructor(private trashInspectionPnInstallationsService: TrashInspectionPnInstallationsService) { }

  ngOnInit() {
  }

  show(installationModel: InstallationPnModel) {
    this.selectedInstallationModel = installationModel;
    this.frame.show();
  }

  deleteInstallation() {
    this.spinnerStatus = true;
    this.trashInspectionPnInstallationsService.deleteInstallation(this.selectedInstallationModel.id).subscribe((data) => {
      if (data && data.success) {
        this.onInstallationDeleted.emit();
        this.selectedInstallationModel = new InstallationPnModel();
        this.frame.hide();
      } this.spinnerStatus = false;
    });
  }
}
