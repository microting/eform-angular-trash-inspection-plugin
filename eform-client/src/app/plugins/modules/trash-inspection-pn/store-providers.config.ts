import { fractionsPersistProvider } from './components/fractions/store';
import { installationsPersistProvider } from './components/installations/store';
import { fractionsReportPreviewTablePersistProvider } from './components/reports/fractions-report-preview-table/store';
import { producersReportPreviewTablePersistProvider } from './components/reports/producers-report-preview-table/store';
import { transportersReportPreviewTablePersistProvider } from './components/reports/transporters-report-preview-table/store';
import { segmentsPersistProvider } from './components/segments/store/';
import { trashInspectionPersistProvider } from './components/trash-inspections/store';
import { producersPersistProvider } from './components/producers/store';
import { transportersPersistProvider } from './components/transporters/store';

export const trashInspectionStoreProviders = [
  fractionsPersistProvider,
  installationsPersistProvider,
  fractionsReportPreviewTablePersistProvider,
  producersReportPreviewTablePersistProvider,
  transportersReportPreviewTablePersistProvider,
  segmentsPersistProvider,
  trashInspectionPersistProvider,
  producersPersistProvider,
  transportersPersistProvider,
];
