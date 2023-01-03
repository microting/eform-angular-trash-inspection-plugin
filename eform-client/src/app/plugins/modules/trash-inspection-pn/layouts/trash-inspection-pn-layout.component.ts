import {AfterContentInit, Component, OnDestroy, OnInit} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
import {translates} from './../i18n/translates';
import {AuthStateService} from 'src/app/common/store';
import {LocaleService} from 'src/app/common/services';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-trash-inspection-pn-layout',
  template: `
    <router-outlet></router-outlet>`,
})
export class TrashInspectionPnLayoutComponent
  implements AfterContentInit, OnInit, OnDestroy {
  currentUserLocaleAsyncSub$: Subscription;
  constructor(
    private localeService: LocaleService,
    private translateService: TranslateService,
    private authStateService: AuthStateService
  ) {
  }

  ngOnInit() {
  }

  ngAfterContentInit() {
    this.currentUserLocaleAsyncSub$ = this.authStateService.currentUserLocaleAsync.subscribe(lang => {
      const i18n = translates[lang];
      this.translateService.setTranslation(lang, i18n, true);
    });
  }

  ngOnDestroy(): void {
    this.currentUserLocaleAsyncSub$.unsubscribe();
  }
}
