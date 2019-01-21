import {AfterViewInit, Component, OnInit} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
import {LocaleService} from 'src/app/common/services/auth';
import {TrashInspectionPnLocalSettings} from '../enums';
import {SharedPnService} from '../../shared/services';
declare var require: any;

@Component({
  selector: 'app-trash-inspection-pn-layout',
  template: `<router-outlet></router-outlet>`
})
export class TrashInspectionPnLayoutComponent implements AfterViewInit, OnInit {

  constructor(private localeService: LocaleService,
              private translateService: TranslateService,
              private sharedPnService: SharedPnService) {

  }

  ngOnInit() {
    this.sharedPnService.initLocalPageSettings('trashInspectionsPnSettings', TrashInspectionPnLocalSettings);
  }


  ngAfterViewInit() {
    setTimeout(() => {
      const lang = this.localeService.getCurrentUserLocale();
      const i18n = require(`../i18n/${lang}.json`);
      this.translateService.setTranslation(lang, i18n, true);
    }, 1000);

  }
}
