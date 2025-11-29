import {
  Component,
  EventEmitter,
  OnInit,
  inject
} from '@angular/core';
import {SiteNameDto, DeployModel} from 'src/app/common/models';
import {SegmentPnModel,} from '../../../../models';
import {TrashInspectionPnSegmentsService} from '../../../../services';
import {AuthStateService} from 'src/app/common/store';
import {SitesService} from 'src/app/common/services';
import {MatDialogRef} from '@angular/material/dialog';
import {Store} from '@ngrx/store';
import {selectCurrentUserClaimsEformsPairingRead} from 'src/app/state';

@Component({
  selector: 'app-trash-inspection-pn-segment-create',
  templateUrl: './segment-create.component.html',
  styleUrls: ['./segment-create.component.scss'],
  standalone: false
})
export class SegmentCreateComponent implements OnInit {
  private authStore = inject(Store);
  private trashInspectionPnSegmentsService = inject(TrashInspectionPnSegmentsService);
  private sitesService = inject(SitesService);
  public dialogRef = inject(MatDialogRef<SegmentCreateComponent>);

  onSegmentCreated: EventEmitter<void> = new EventEmitter<void>();
  segmentPnModel: SegmentPnModel = new SegmentPnModel();
  sitesDto: Array<SiteNameDto> = [];
  deployModel: DeployModel = new DeployModel();
  deployViewModel: DeployModel = new DeployModel();
  private selectCurrentUserClaimsEformsPairingRead$ = this.authStore.select(selectCurrentUserClaimsEformsPairingRead);

  

  ngOnInit() {
    this.deployModel = new DeployModel();
    this.deployViewModel = new DeployModel();
    this.loadAllSites();
  }

  createSegment() {
    this.trashInspectionPnSegmentsService
      .createSegment(this.segmentPnModel)
      .subscribe((data) => {
        if (data && data.success) {
          this.onSegmentCreated.emit();
          this.hide();
        }
      });
  }

  loadAllSites() {
    this.selectCurrentUserClaimsEformsPairingRead$.subscribe((x) => {
      if (x) {
      this.sitesService.getAllSitesForPairing().subscribe((operation) => {
        if (operation && operation.success) {
          this.sitesDto = operation.model;
        }
      });
    }
    });
  }

  hide() {
    this.segmentPnModel = new SegmentPnModel();
    this.dialogRef.close();
  }
}
