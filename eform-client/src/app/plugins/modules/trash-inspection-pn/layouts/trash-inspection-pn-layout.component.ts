import { AfterContentInit, Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { translates } from './../i18n/translates';
import { AuthStateService } from 'src/app/common/store';

@Component({
  selector: 'app-trash-inspection-pn-layout',
  template: `<router-outlet></router-outlet>`,
})
export class TrashInspectionPnLayoutComponent
  implements AfterContentInit, OnInit {
  constructor(
    private translateService: TranslateService,
    private authStateService: AuthStateService
  ) {}

  ngOnInit() {}

  ngAfterContentInit() {
    const lang = this.authStateService.currentUserLocale;
    const i18n = translates[lang];
    this.translateService.setTranslation(lang, i18n, true);
  }
}
