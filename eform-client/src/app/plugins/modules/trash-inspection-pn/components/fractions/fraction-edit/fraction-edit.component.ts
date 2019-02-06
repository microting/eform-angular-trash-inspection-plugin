import {ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import { InstallationPnUpdateModel} from 'src/app/plugins/modules/trash-inspection-pn/models/installation';
import {
  TrashInspectionPnFractionsService} from 'src/app/plugins/modules/trash-inspection-pn/services';
import {FractionPnModel, FractionPnUpdateModel} from '../../../models/fraction';
import {TemplateListModel, TemplateRequestModel} from '../../../../../../common/models/eforms';
import {debounceTime, switchMap} from 'rxjs/operators';
import {EFormService} from '../../../../../../common/services/eform';

@Component({
  selector: 'app-trash-inspection-pn-fraction-edit',
  templateUrl: './fraction-edit.component.html',
  styleUrls: ['./fraction-edit.component.scss']
})
export class FractionEditComponent implements OnInit {
  @ViewChild('frame') frame;
  @Output() onFractionUpdated: EventEmitter<void> = new EventEmitter<void>();
  spinnerStatus = false;
  selectedFractionModel: FractionPnModel = new FractionPnModel();
  templateRequestModel: TemplateRequestModel = new TemplateRequestModel();
  templatesModel: TemplateListModel = new TemplateListModel();
  typeahead = new EventEmitter<string>();
  constructor(private trashInspectionPnFractionsService: TrashInspectionPnFractionsService,
              private cd: ChangeDetectorRef,
              private eFormService: EFormService) {
    this.typeahead
      .pipe(
        debounceTime(200),
        switchMap(term => {
          this.templateRequestModel.nameFilter = term;
          return this.eFormService.getAll(this.templateRequestModel);
        })
      )
      .subscribe(items => {
        this.templatesModel = items.model;
        this.cd.markForCheck();
      });
  }

  ngOnInit() {
  }

  show(fractionModel: FractionPnModel) {
    this.getSelectedFraction(fractionModel.id);
    this.frame.show();
  }

  getSelectedFraction(id: number) {
    // debugger;
    this.spinnerStatus = true;
    this.trashInspectionPnFractionsService.getSingleFraction(id).subscribe((data) => {
      if (data && data.success) {
        this.selectedFractionModel = data.model;
      } this.spinnerStatus = false;
    });
  }

  updateFraction() {
    this.spinnerStatus = true;
    this.trashInspectionPnFractionsService.updateFraction(this.selectedFractionModel)
      .subscribe((data) => {
      if (data && data.success) {
        this.onFractionUpdated.emit();
        this.selectedFractionModel = new FractionPnModel();
        this.frame.hide();
      } this.spinnerStatus = false;
    });
  }

  onSelectedChanged(e: any) {
    // debugger;
    this.selectedFractionModel.eFormId = e.id;
  }

}
