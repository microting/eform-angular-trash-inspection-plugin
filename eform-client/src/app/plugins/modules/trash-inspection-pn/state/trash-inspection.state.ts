import {
  FractionsState,
  InstallationsState,
  ProducersState,
  SegmentsState,
  TransportersState,
  TrashInspectionsState,

} from './';

export interface TrashInspectionState {
  fractionsState: FractionsState,
  installationsState: InstallationsState,
  producersState: ProducersState,
  segmentsState: SegmentsState,
  transportersState: TransportersState,
  trashInspectionsState: TrashInspectionsState,
}
