import {AfterContentInit, Component, OnDestroy, OnInit, inject} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
import {translates} from './../i18n/translates';
import {AuthStateService} from 'src/app/common/store';
import {LocaleService} from 'src/app/common/services';
import {Subscription, take} from 'rxjs';
import {Store} from '@ngrx/store';
import {addPluginToVisited, selectPluginsVisitedPlugins} from 'src/app/state';

@Component({
  selector: 'app-trash-inspection-pn-layout',
  template: `
    <router-outlet></router-outlet>`,
  standalone: false
})
export class TrashInspectionPnLayoutComponent
  implements AfterContentInit, OnInit, OnDestroy {
  private translateService = inject(TranslateService);
  private store = inject(Store);

  currentUserLocaleAsyncSub$: Subscription;
  private pluginName = 'trashinspection';
  

  ngOnInit() {
    this.store.select(selectPluginsVisitedPlugins)
      .pipe(take(1))
      .subscribe(x => {
        // check current plugin in activated plugin
        if (x.findIndex(y => y === this.pluginName) === -1) {
          // add all plugin translates one time
          Object.keys(translates).forEach(locale => {
            this.translateService.setTranslation(locale, translates[locale], true);
          });
          // add plugin to visited plugins
          this.store.dispatch(addPluginToVisited(this.pluginName));
        }
      });
  }

  ngAfterContentInit() {
  }

  ngOnDestroy(): void {
  }
}
