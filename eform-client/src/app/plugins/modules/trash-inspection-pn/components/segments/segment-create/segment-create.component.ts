import {Component, EventEmitter, OnInit, Output, ViewChild} from '@angular/core';
import {SiteNameDto} from '../../../../../../common/models/dto';
import {DeployModel} from '../../../../../../common/models/eforms';
import {SitesService} from '../../../../../../common/services/advanced';
import {AuthService} from '../../../../../../common/services/auth';
import {SegmentPnModel} from '../../../models/segment';
import {TrashInspectionPnSegmentsService} from '../../../services/trash-inspection-pn-segments.service';


@Component({
  selector: 'app-trash-inspection-pn-segment-create',
  templateUrl: './segment-create.component.html',
  styleUrls: ['./segment-create.component.scss']
})
export class SegmentCreateComponent implements OnInit {
  @ViewChild('frame') frame;
  @Output() onSegmentCreated: EventEmitter<void> = new EventEmitter<void>();
  segmentPnModel: SegmentPnModel = new SegmentPnModel();
  sitesDto: Array<SiteNameDto> = [];
  deployModel: DeployModel = new DeployModel();
  deployViewModel: DeployModel = new DeployModel();

  get userClaims() {
    return this.authService.userClaims;
  }
  constructor(private trashInspectionPnSegmentsService: TrashInspectionPnSegmentsService,
              private sitesService: SitesService,
              private authService: AuthService) {
  }

  ngOnInit() {
    this.loadAllSites();
  }

  createSegment() {
    this.trashInspectionPnSegmentsService.createSegment(this.segmentPnModel).subscribe((data) => {
      debugger;
      if (data && data.success) {
        this.onSegmentCreated.emit();
        this.segmentPnModel = new SegmentPnModel();
        this.frame.hide();
      }
    });
  }


  loadAllSites() {
    if (this.userClaims.eformsPairingRead) {
      this.sitesService.getAllSitesForPairing().subscribe(operation => {
        if (operation && operation.success) {
          this.sitesDto = operation.model;
        }
      });
    }
  }

  show() {
    this.deployModel = new DeployModel();
    this.deployViewModel = new DeployModel();
    this.frame.show();
  }

  onSelectedChanged(e: any) {
  }
}
