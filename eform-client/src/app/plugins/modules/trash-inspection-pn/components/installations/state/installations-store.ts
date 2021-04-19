import { Injectable } from '@angular/core';
import { Store, StoreConfig } from '@datorama/akita';

export interface InstallationsState {
  pageSize: number;
  sort: string;
  isSortDsc: boolean;
  offset: number;
}

export function createInitialState(): InstallationsState {
  return {
    pageSize: 10,
    sort: 'Id',
    isSortDsc: false,
    offset: 0,
  };
}

@Injectable({ providedIn: 'root' })
@StoreConfig({ name: 'trashInspectionPnInstallations' })
export class InstallationsStore extends Store<InstallationsState> {
  constructor() {
    super(createInitialState());
  }
}
