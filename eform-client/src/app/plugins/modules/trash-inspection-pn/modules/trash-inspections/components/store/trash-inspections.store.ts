import { Injectable } from '@angular/core';
import { persistState, Store, StoreConfig } from '@datorama/akita';
import {
  CommonPaginationState,
  FiltrationStateModel,
} from 'src/app/common/models';

export interface TrashInspectionsState {
  pagination: CommonPaginationState;
  filters: FiltrationStateModel;
  total: number;
}

export function createInitialState(): TrashInspectionsState {
  return <TrashInspectionsState>{
    pagination: {
      pageSize: 10,
      sort: 'Id',
      isSortDsc: false,
      offset: 0,
    },
    filters: {
      nameFilter: '',
    },
    total: 0,
  };
}

const trashInspectionPersistStorage = persistState({
  include: ['trashInspections'],
  key: 'trashInspectionPn',
  preStorageUpdate(storeName, state) {
    return {
      pagination: state.pagination,
      filters: state.filters,
    };
  },
});

@Injectable({ providedIn: 'root' })
@StoreConfig({ name: 'trashInspections', resettable: true })
export class TrashInspectionsStore extends Store<TrashInspectionsState> {
  constructor() {
    super(createInitialState());
  }
}

export const trashInspectionPersistProvider = {
  provide: 'persistStorage',
  useValue: trashInspectionPersistStorage,
  multi: true,
};
