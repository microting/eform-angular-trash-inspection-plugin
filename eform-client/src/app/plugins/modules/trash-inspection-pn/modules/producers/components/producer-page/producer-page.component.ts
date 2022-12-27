import { Component, OnInit, ViewChild } from '@angular/core';
import { TableHeaderElementModel } from 'src/app/common/models';
import { ProducerPnModel, ProducersPnModel } from '../../../../models';
import { ProducersStateService } from '../store';

@Component({
  selector: 'app-producer-page',
  templateUrl: './producer-page.component.html',
  styleUrls: ['./producer-page.component.scss'],
})
export class ProducerPageComponent implements OnInit {
  @ViewChild('createProducerModal') createProducerModal;
  @ViewChild('editProducerModal') editProducerModal;
  @ViewChild('deleteProducerModal') deleteProducerModal;
  producersModel: ProducersPnModel = new ProducersPnModel();

  tableHeaders: TableHeaderElementModel[] = [
    { name: 'Id', elementId: 'idTableHeader', sortable: true },
    { name: 'Name', elementId: 'nameTableHeader', sortable: true },
    {
      name: 'Description',
      elementId: 'descriptionTableHeader',
      sortable: true,
    },
    {
      name: 'ForeignId',
      elementId: 'locationCodeTableHeader',
      sortable: true,
      visibleName: 'Foreign ID',
    },
    { name: 'Address', elementId: 'addressTableHeader', sortable: true },
    { name: 'City', elementId: 'cityTableHeader', sortable: true },
    {
      name: 'ZipCode',
      elementId: 'zipCodeTableHeader',
      sortable: true,
      visibleName: 'Zip Code',
    },
    { name: 'Phone', elementId: 'phoneTableHeader', sortable: true },
    {
      name: 'ContactPerson',
      elementId: 'contactPersonTableHeader',
      sortable: true,
      visibleName: 'Contact Person',
    },
    { name: 'Actions', elementId: '', sortable: false },
  ];

  constructor(public producersStateService: ProducersStateService) {}

  ngOnInit() {
    this.getAllInitialData();
  }

  getAllInitialData() {
    this.getAllProducers();
  }

  getAllProducers() {
    this.producersStateService.getAllProducers().subscribe((data) => {
      if (data && data.success) {
        this.producersModel = data.model;
      }
    });
  }

  showCreateProducerModal() {
    this.createProducerModal.show();
  }

  showEditProducerModal(producer: ProducerPnModel) {
    this.editProducerModal.show(producer);
  }

  showDeleteProducerModal(producer: ProducerPnModel) {
    this.deleteProducerModal.show(producer);
  }

  sortTable(sort: string) {
    this.producersStateService.onSortTable(sort);
    this.getAllProducers();
  }

  changePage(offset: number) {
    this.producersStateService.changePage(offset);
    this.getAllProducers();
  }

  onProducerDeleted() {
    this.producersStateService.onDelete();
    this.getAllProducers();
  }

  onPageSizeChanged(pageSize: number) {
    this.producersStateService.updatePageSize(pageSize);
    this.getAllProducers();
  }
}
