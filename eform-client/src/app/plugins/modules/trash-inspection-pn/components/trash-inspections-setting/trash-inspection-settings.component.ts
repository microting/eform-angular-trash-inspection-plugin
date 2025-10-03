import {
  ChangeDetectorRef,
  Component,
  EventEmitter,
  OnInit,
} from '@angular/core';
import { TrashInspectionPnSettingsService } from '../../services';
import { Router } from '@angular/router';
import {debounceTime, skip, switchMap} from 'rxjs/operators';
import {
  TemplateListModel,
  TemplateRequestModel,
} from 'src/app/common/models';
import { EFormService, EntitySearchService} from 'src/app/common/services';
import { TrashInspectionBaseSettingsModel } from '../../models';
import {take} from 'rxjs';

@Component({
  selector: 'app-trash-inspection-settings',
  templateUrl: './trash-inspection-settings.component.html',
  styleUrls: ['./trash-inspection-settings.component.scss'],
  standalone: false
})
export class TrashInspectionSettingsComponent implements OnInit {
  typeahead = new EventEmitter<string>();
  settingsModel: TrashInspectionBaseSettingsModel = new TrashInspectionBaseSettingsModel();
  templatesModel: TemplateListModel = new TemplateListModel();
  templateRequestModel: TemplateRequestModel = new TemplateRequestModel();

/*  get selectedEformName(): string {
    if(!!this.templatesModel && !!this.templatesModel.templates) {
      const i = this.templatesModel.templates.findIndex(x => x.id === this.settingsModel.extendedInspectioneFormId);
      if (i !== -1) {
        return this.templatesModel.templates[i].label;
      }
    }
    return ''
  }*/

  constructor(
    private trashInspectionPnSettingsService: TrashInspectionPnSettingsService,
    private router: Router,
    private eFormService: EFormService,
    private entitySearchService: EntitySearchService,
    private cd: ChangeDetectorRef
  ) {
    this.typeahead
      .pipe(
        skip(1),
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
    this.getSettings();
    this.eFormService.getAll(this.templateRequestModel).pipe(take(1))
      .subscribe((items) => {
        this.templatesModel = items.model;
    })
  }

  getSettings() {
    this.trashInspectionPnSettingsService.getAllSettings().subscribe((data) => {
      if (data && data.success) {
        this.settingsModel = data.model;
      }
    });
  }

  updateSettings() {
    this.trashInspectionPnSettingsService
      .updateSettings(this.settingsModel)
      .subscribe((data) => {
        if (data && data.success) {
        }
      });
  }
}
