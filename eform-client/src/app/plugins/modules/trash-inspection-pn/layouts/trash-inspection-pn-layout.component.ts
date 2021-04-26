import { AfterContentInit, Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { LocaleService } from 'src/app/common/services/auth';
import { TrashInspectionPnLocalSettings } from '../enums';
import { SharedPnService } from '../../shared/services';
import { translates } from './../i18n/translates';

@Component({
  selector: 'app-trash-inspection-pn-layout',
  template: `<router-outlet></router-outlet>`,
})
export class TrashInspectionPnLayoutComponent
  implements AfterContentInit, OnInit {
  constructor(
    private localeService: LocaleService,
    private translateService: TranslateService,
    private sharedPnService: SharedPnService
  ) {}

  ngOnInit() {
    this.sharedPnService.initLocalPageSettings(
      'trashInspectionsPnSettings',
      TrashInspectionPnLocalSettings
    );
  }

  ngAfterContentInit() {
    const lang = this.localeService.getCurrentUserLocale();
    const i18n = translates[lang];
    this.translateService.setTranslation(lang, i18n, true);
  }
}
