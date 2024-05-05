import {
  Component,
  EventEmitter,
  OnInit,
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
})
export class SegmentCreateComponent implements OnInit {
  onSegmentCreated: EventEmitter<void> = new EventEmitter<void>();
  segmentPnModel: SegmentPnModel = new SegmentPnModel();
  sitesDto: Array<SiteNameDto> = [];
  deployModel: DeployModel = new DeployModel();
  deployViewModel: DeployModel = new DeployModel();
  private selectCurrentUserClaimsEformsPairingRead$ = this.authStore.select(selectCurrentUserClaimsEformsPairingRead);

  constructor(
    private authStore: Store,
    private trashInspectionPnSegmentsService: TrashInspectionPnSegmentsService,
    private sitesService: SitesService,
    public dialogRef: MatDialogRef<SegmentCreateComponent>,
  ) {
    this.deployModel = new DeployModel();
    this.deployViewModel = new DeployModel();
  }

  ngOnInit() {
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
