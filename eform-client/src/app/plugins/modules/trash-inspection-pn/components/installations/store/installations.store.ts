import { Injectable } from '@angular/core';
import { persistState, Store, StoreConfig } from '@datorama/akita';
import { CommonPaginationState } from 'src/app/common/models';

export interface InstallationsState {
  pagination: CommonPaginationState;
  total: number;
}

export function createInitialState(): InstallationsState {
  return <InstallationsState>{
    pagination: {
      pageSize: 10,
      sort: 'Id',
      isSortDsc: false,
      offset: 0,
    },
    total: 0,
  };
}

const installationsPersistStorage = persistState({
  include: ['installations'],
  key: 'trashInspectionPn',
  preStorageUpdate(storeName, state) {
    return {
      pagination: state.pagination,
      // filters: state.filters,
    };
  },
});

@Injectable({ providedIn: 'root' })
@StoreConfig({ name: 'installations', resettable: true })
export class InstallationsStore extends Store<InstallationsState> {
  constructor() {
    super(createInitialState());
  }
}

export const installationsPersistProvider = {
  provide: 'persistStorage',
  useValue: installationsPersistStorage,
  multi: true,
};
