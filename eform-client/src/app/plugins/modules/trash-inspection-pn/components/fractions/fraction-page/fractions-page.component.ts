import {Component, OnInit, ViewChild} from '@angular/core';
import {PageSettingsModel} from 'src/app/common/models/settings';

import {SharedPnService} from 'src/app/plugins/modules/shared/services';
import {FractionPnModel, FractionPnRequestModel, FractionsPnModel} from '../../../models/fraction';
import {TrashInspectionPnFractionsService} from '../../../services';

@Component({
  selector: 'app-trash-inspection-pn-fractions-page',
  templateUrl: './fractions-page.component.html',
  styleUrls: ['./fractions-page.component.scss']
})
export class FractionsPageComponent implements OnInit {
  @ViewChild('createFractionModal') createFractionModal;
  @ViewChild('editFractionModal') editFractionModal;
  @ViewChild('deleteFractionModal') deleteFractionModal;
  localPageSettings: PageSettingsModel = new PageSettingsModel();
  fractionsModel: FractionsPnModel = new FractionsPnModel();
  fractionRequestModel: FractionPnRequestModel = new FractionPnRequestModel();
  spinnerStatus = false;

  constructor(private sharedPnService: SharedPnService,
              private trashInspectionPnFractionsService: TrashInspectionPnFractionsService) { }

  ngOnInit() {
    this.getLocalPageSettings();
  }

  getLocalPageSettings() {
    this.localPageSettings = this.sharedPnService.getLocalPageSettings
    ('trashInspectionsPnSettings', 'Fractions').settings;
    this.getAllInitialData();
  }

  updateLocalPageSettings() {
    this.sharedPnService.updateLocalPageSettings
    ('trashInspectionsPnSettings', this.localPageSettings, 'Fractions');
    this.getAllFractions();
  }

  getAllInitialData() {
    this.getAllFractions();
  }

  getAllFractions() {
    this.spinnerStatus = true;
    this.fractionRequestModel.isSortDsc = this.localPageSettings.isSortDsc;
    this.fractionRequestModel.sort = this.localPageSettings.sort;
    this.fractionRequestModel.pageSize = this.localPageSettings.pageSize;
    this.trashInspectionPnFractionsService.getAllFractions(this.fractionRequestModel).subscribe((data) => {
      if (data && data.success) {
        this.fractionsModel = data.model;
      } this.spinnerStatus = false;
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
  sortTable(sort: string) {
    if (this.localPageSettings.sort === sort) {
      this.localPageSettings.isSortDsc = !this.localPageSettings.isSortDsc;
    } else {
      this.localPageSettings.isSortDsc = false;
      this.localPageSettings.sort = sort;
    }
    this.updateLocalPageSettings();
  }

  changePage(e: any) {
    if (e || e === 0) {
      this.fractionRequestModel.offset = e;
      if (e === 0) {
        this.fractionRequestModel.pageIndex = 0;
      } else {
        this.fractionRequestModel.pageIndex
          = Math.floor(e / this.fractionRequestModel.pageSize);
      }
      this.getAllFractions();
    }
  }
}
