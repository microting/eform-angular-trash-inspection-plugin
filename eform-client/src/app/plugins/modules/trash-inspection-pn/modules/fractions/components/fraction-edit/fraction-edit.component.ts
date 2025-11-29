import {
  ChangeDetectorRef,
  Component,
  EventEmitter,
  OnInit,
  inject
} from '@angular/core';
import { TrashInspectionPnFractionsService } from '../../../../services';
import { FractionPnModel } from '../../../../models';
import {
  TemplateListModel,
  TemplateRequestModel,
} from 'src/app/common/models';
import {debounceTime, skip, switchMap} from 'rxjs/operators';
import { EFormService } from 'src/app/common/services/eform';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {take} from 'rxjs';

@Component({
  selector: 'app-trash-inspection-pn-fraction-edit',
  templateUrl: './fraction-edit.component.html',
  styleUrls: ['./fraction-edit.component.scss'],
  standalone: false
})
export class FractionEditComponent implements OnInit {
  private trashInspectionPnFractionsService = inject(TrashInspectionPnFractionsService);
  private cd = inject(ChangeDetectorRef);
  private eFormService = inject(EFormService);
  public dialogRef = inject(MatDialogRef<FractionEditComponent>);
  private fractionModel = inject<FractionPnModel>(MAT_DIALOG_DATA);

  onFractionUpdated: EventEmitter<void> = new EventEmitter<void>();
  selectedFractionModel: FractionPnModel = new FractionPnModel();
  templateRequestModel: TemplateRequestModel = new TemplateRequestModel();
  templatesModel: TemplateListModel = new TemplateListModel();
  typeahead = new EventEmitter<string>();
  

  ngOnInit() {
    this.typeahead
      .pipe(
        debounceTime(200),
        switchMap((term) => {
          this.templateRequestModel.nameFilter = term;
          return this.eFormService.getAll(this.templateRequestModel);
        })
      )
      .pipe(skip(1))
      .subscribe((items) => {
        this.templatesModel = items.model;
        this.cd.markForCheck();
      });
    this.getSelectedFraction(this.fractionModel.id);
    this.eFormService.getAll(this.templateRequestModel).pipe(take(1)).subscribe((items) => {
      this.templatesModel = items.model;
    });
  }

  hide() {
    this.selectedFractionModel = new FractionPnModel();
    this.dialogRef.close();
  }

  getSelectedFraction(id: number) {
    this.trashInspectionPnFractionsService
      .getSingleFraction(id)
      .subscribe((data) => {
        if (data && data.success) {
          this.selectedFractionModel = data.model;
        }
      });
  }

  updateFraction() {
    this.trashInspectionPnFractionsService
      .updateFraction(this.selectedFractionModel)
      .subscribe((data) => {
        if (data && data.success) {
          this.onFractionUpdated.emit();
          this.hide();
        }
      });
  }

  onSelectedChanged(e: any) {
    this.selectedFractionModel.eFormId = e.id;
  }
}
