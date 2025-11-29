import {Component, OnInit, inject} from '@angular/core';
import {
  TrashInspectionPnSettingsService,
  TrashInspectionPnTrashInspectionsService,
} from '../../../../services';
import {PageSettingsModel} from 'src/app/common/models';
import {TrashInspectionPnCaseStatusModel, TrashInspectionVersionPnModel, TrashInspectionVersionsPnModel} from '../../../../models';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {MtxGridColumn} from '@ng-matero/extensions/grid';
import {TranslateService} from '@ngx-translate/core';

@Component({
  selector: 'app-trash-inspection-pn-trash-inspection-version-view',
  templateUrl: './trash-inspection-version-view.component.html',
  styleUrls: ['./trash-inspection-version-view.component.scss'],
  standalone: false
})
export class TrashInspectionVersionViewComponent implements OnInit {
  private trashInspectionPnSettingsService = inject(TrashInspectionPnSettingsService);
  private trashInspectionPnTrashInspectionsService = inject(TrashInspectionPnTrashInspectionsService);
  private translateService = inject(TranslateService);
  public dialogRef = inject(MatDialogRef<TrashInspectionVersionViewComponent>);
  private trashInspectionId = inject<number>(MAT_DIALOG_DATA);

  localPageSettings: PageSettingsModel = new PageSettingsModel();
  trashInspectionVersionsModel: TrashInspectionVersionsPnModel = new TrashInspectionVersionsPnModel();

  trashInspectionVersionHeaders: MtxGridColumn[] = [
    {header: this.translateService.stream('Id'), field: 'id'},
    {header: this.translateService.stream('Updated at'), field: 'updatedAt', type: 'date', typeParameter: {format: 'dd.MM.y HH:mm:ss'}},
    {header: this.translateService.stream('Date'), field: 'date', type: 'date', typeParameter: {format: 'dd.MM.y'}},
    {header: this.translateService.stream('Time'), field: 'time', type: 'date', typeParameter: {format: 'HH:mm:ss'}},
    {header: this.translateService.stream('Eak code'), field: 'eakCode'},
    {header: this.translateService.stream('Installation'), field: 'installationName'},
    {header: this.translateService.stream('Segment'), field: 'segment'},
    {
      header: this.translateService.stream('Must be inspected'),
      field: 'mustBeInspected',
      formatter: (trashInspectionVersion: TrashInspectionVersionPnModel) => (
        `<span class="material-icons">${trashInspectionVersion.mustBeInspected ? 'done' : 'close'}</span>`
      ),
    },
    {header: this.translateService.stream('Producer'), field: 'producer'},
    {header: this.translateService.stream('Registration number'), field: 'registrationNumber',},
    {header: this.translateService.stream('Transporter'), field: 'transporter'},
    {header: this.translateService.stream('Trash fraction'), field: 'trashFraction'},
    {header: this.translateService.stream('Weighing number'), field: 'weighingNumber'},
    {
      header: this.translateService.stream('Extended inspection'),
      field: 'extendedInspection',
      formatter: (trashInspectionVersion: TrashInspectionVersionPnModel) => (
        `<span class="material-icons">${trashInspectionVersion.extendedInspection ? 'done' : 'close'}</span>`
      ),
    },
    {
      header: this.translateService.stream('Is approved'),
      field: 'isApproved',
      formatter: (trashInspectionVersion: TrashInspectionVersionPnModel) => (
        `<span class="material-icons">${trashInspectionVersion.isApproved ? 'done' : 'close'}</span>`
      ),
    },
    {header: this.translateService.stream('Comment'), field: 'comment'},
    {header: this.translateService.stream('Status'), field: 'status'},
    {
      header: this.translateService.stream('Is removed'),
      field: 'inspectionDone',
      formatter: (trashInspectionVersion: TrashInspectionVersionPnModel) => (
        `<span class="material-icons">${trashInspectionVersion.inspectionDone ? 'done' : 'close'}</span>`
      ),
    },
    {
      header: this.translateService.stream('Callback'),
      field: 'responseSendToCallBackUrl',
      formatter: (trashInspectionVersion: TrashInspectionVersionPnModel) => {
        let ret = '';
        if(trashInspectionVersion.responseSendToCallBackUrl) {
          ret += `<span class="material-icons">${trashInspectionVersion.responseSendToCallBackUrl ? 'done' : 'close'}</span>`;
        }
        if(trashInspectionVersion.errorFromCallBack != null && trashInspectionVersion.errorFromCallBack !== '') {
          ret += `<span class="material-icons text-warn" title="${trashInspectionVersion.successMessageFromCallBack}">warning</span>`;
        }
        return ret;
      }
      ,
    },
    {header: this.translateService.stream('Version'), field: 'version',},
  ];
  caseHeaders: MtxGridColumn[] = [
    {
      header: this.translateService.stream('SDK Site Id/Name'),
      field: 'sdkSiteId',
      formatter: (trashInspectionCase: TrashInspectionPnCaseStatusModel) => (
        `${trashInspectionCase.sdkSiteId}/${trashInspectionCase.sdkSiteName}`
      ),
      class: 'text-nowrap'
    },
    {header: this.translateService.stream('Status'), field: 'status'},
    {header: this.translateService.stream('Created locally'), field: 'createdLocally', type: 'date', typeParameter: {format: 'dd.MM.y HH:mm:ss'}},
    {header: this.translateService.stream('Sent to Microting'), field: 'sentToMicroting', type: 'date', typeParameter: {format: 'dd.MM.y HH:mm:ss'}},
    {header: this.translateService.stream('Received on tablet'), field: 'receivedOnTablet', type: 'date', typeParameter: {format: 'HH:mm:ss'}},
    {header: this.translateService.stream('Answered'), field: 'answered', type: 'date', typeParameter: {format: 'dd.MM.y HH:mm:ss'}},
    {header: this.translateService.stream('Removed'), field: 'removed', type: 'date', typeParameter: {format: 'dd.MM.y HH:mm:ss'}},
  ];

  

  ngOnInit() {
    this.getSelectedVersions(this.trashInspectionId);
  }

  getSelectedVersions(trashInspectionId: number) {
    this.trashInspectionPnTrashInspectionsService
      .getTrashInspectionVersions(trashInspectionId)
      .subscribe((data) => {
        if (data && data.success) {
          this.trashInspectionVersionsModel = data.model;
        }
      });
  }

  hide() {
    this.dialogRef.close();
  }
}
