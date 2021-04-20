import Page from '../Page';
import myEformsPage from '../MyEforms.page';
import trashInspectionsPage from './TrashInspections.page';

export class TrashInspectionFractionPage extends Page {
  constructor() {
    super();
  }

  public get rowNum(): number {
    browser.pause(500);
    return $$('#tableBody > tr').length;
  }

  public trashInspectionDropDown() {
    trashInspectionsPage.trashInspectionDropDown().click();
  }

  public get fractionBtn() {
    const ele = $(`#trash-inspection-pn-fractions`);
    ele.waitForDisplayed({ timeout: 20000 });
    ele.waitForClickable({ timeout: 20000 });
    return ele;
  }

  public get fractionCreateBtn() {
    const ele = $(`#fractionCreateBtn`);
    ele.waitForDisplayed({ timeout: 20000 });
    ele.waitForClickable({ timeout: 20000 });
    return ele;
  }

  public get fractionCreateNameBox() {
    const ele = $(`#createFractionName`);
    ele.waitForDisplayed({ timeout: 20000 });
    ele.waitForClickable({ timeout: 20000 });
    return ele;
  }

  public get fractionCreateDescriptionBox() {
    const ele = $(`#createFractionDescription`);
    ele.waitForDisplayed({ timeout: 20000 });
    ele.waitForClickable({ timeout: 20000 });
    return ele;
  }

  public get fractionCreateSelectorBox() {
    const ele = $(`#createFractionSelector`);
    ele.waitForDisplayed({ timeout: 20000 });
    ele.waitForClickable({ timeout: 20000 });
    return ele;
  }

  public get fractionCreateSaveBtn() {
    const ele = $(`#fractionCreateSaveBtn`);
    ele.waitForDisplayed({ timeout: 20000 });
    ele.waitForClickable({ timeout: 20000 });
    return ele;
  }

  public get fractionCreateCancelBtn() {
    const ele = $(`#fractionCreateCancelBtn`);
    ele.waitForDisplayed({ timeout: 20000 });
    ele.waitForClickable({ timeout: 20000 });
    return ele;
  }

  public get fractionEditBtn() {
    const ele = $(`#updateFractionBtn`);
    ele.waitForDisplayed({ timeout: 20000 });
    ele.waitForClickable({ timeout: 20000 });
    return ele;
  }

  public get fractionUpdateNameBox() {
    const ele = $(`#updateFractionName`);
    ele.waitForDisplayed({ timeout: 20000 });
    ele.waitForClickable({ timeout: 20000 });
    return ele;
  }

  public get fractionUpdateDescriptionBox() {
    const ele = $(`#editFractionDescription`);
    ele.waitForDisplayed({ timeout: 20000 });
    ele.waitForClickable({ timeout: 20000 });
    return ele;
  }

  public get fractionUpdateSelectorBox() {
    const ele = $(`#fractionUpdateSelector`);
    ele.waitForDisplayed({ timeout: 20000 });
    ele.waitForClickable({ timeout: 20000 });
    return ele;
  }

  public get fractionUpdateSaveBtn() {
    const ele = $(`#fractionUpdateSaveBtn`);
    ele.waitForDisplayed({ timeout: 20000 });
    ele.waitForClickable({ timeout: 20000 });
    return ele;
  }

  public get fractionUpdateCancelBtn() {
    const ele = $(`#fractionUpdateCancelBtn`);
    ele.waitForDisplayed({ timeout: 20000 });
    ele.waitForClickable({ timeout: 20000 });
    return ele;
  }

  public get fractionDeleteId() {
    const ele = $(`#selectedFractionId`);
    ele.waitForDisplayed({ timeout: 20000 });
    return ele;
  }

  public get fractionDeleteName() {
    const ele = $(`#selectedFractionName`);
    ele.waitForDisplayed({ timeout: 20000 });
    return ele;
  }

  public get fractionDeleteDeleteBtn() {
    const ele = $('#fractionDeleteDeleteBtn');
    ele.waitForDisplayed({ timeout: 20000 });
    ele.waitForClickable({ timeout: 20000 });
    return ele;
  }

  public get fractionDeleteCancelBtn() {
    const ele = $(`#fractionDeleteCancelBtn`);
    ele.waitForDisplayed({ timeout: 20000 });
    ele.waitForClickable({ timeout: 20000 });
    return ele;
  }

  public get updateFractionItemNumber() {
    const ele = $('#updateFractionItemNumber');
    ele.waitForDisplayed({ timeout: 20000 });
    return ele;
  }

  public get editFractionLocationCode() {
    const ele = $('#editFractionLocationCode');
    ele.waitForDisplayed({ timeout: 20000 });
    return ele;
  }

  public get fractionUpdateSelector() {
    const ele = $('#fractionUpdateSelector');
    ele.waitForDisplayed({ timeout: 20000 });
    return ele;
  }

  public get createFractionItemNumber() {
    const ele = $('#createFractionItemNumber');
    ele.waitForDisplayed({ timeout: 20000 });
    return ele;
  }

  public get createFractionLocationCode() {
    const ele = $('#createFractionLocationCode');
    ele.waitForDisplayed({ timeout: 20000 });
    return ele;
  }

  goToFractionsPage() {
    this.trashInspectionDropDown();
    this.fractionBtn.click();
    fractionsPage.fractionCreateBtn.waitForClickable({ timeout: 20000 });
  }

  openCreateFraction(createModel?: FractionsCreateUpdate) {
    this.fractionCreateBtn.click();
    if (createModel) {
      if (createModel.itemNumber) {
        this.createFractionItemNumber.setValue(createModel.itemNumber);
      }
      if (createModel.name) {
        this.fractionCreateNameBox.setValue(createModel.name);
      }
      if (createModel.description) {
        this.fractionCreateDescriptionBox.setValue(createModel.description);
      }
      if (createModel.locationCode) {
        this.createFractionLocationCode.setValue(createModel.locationCode);
      }
      if (createModel.eForm) {
        const ngOption = $('.ng-option');
        this.fractionCreateSelectorBox.$('input').setValue(createModel.eForm);
        ngOption.waitForDisplayed({ timeout: 20000 });
        const value = this.fractionCreateSelectorBox
          .$('.ng-dropdown-panel')
          .$(`.ng-option=${createModel.eForm}`);
        value.waitForClickable({ timeout: 20000 });
        value.click();
      }
    }

    this.fractionCreateCancelBtn.waitForClickable({ timeout: 20000 });
  }

  closeCreateFraction(clickCancel = false) {
    if (clickCancel) {
      this.fractionCreateCancelBtn.click();
    } else {
      this.fractionCreateSaveBtn.click();
    }
    this.fractionCreateBtn.waitForClickable({ timeout: 20000 });
  }

  createFraction(createModel?: FractionsCreateUpdate, clickCancel = false) {
    this.openCreateFraction(createModel);
    this.closeCreateFraction(clickCancel);
  }

  getFirstRowObject(): FractionsRowObject {
    browser.pause(500);
    return new FractionsRowObject(1);
  }

  getFractionsRowObjectByIndex(index: number): FractionsRowObject {
    browser.pause(500);
    return new FractionsRowObject(index);
  }

  createNewEform(eFormLabel, newTagsList = [], tagAddedNum = 0) {
    return myEformsPage.createNewEform(eFormLabel, newTagsList, tagAddedNum);
  }

  public clearTable() {
    browser.pause(2000);
    let rowCount = this.rowNum;
    for (let i = 1; i <= rowCount; i++) {
      if (i % 9 === 0 && this.rowNum > 0) {
        rowCount += this.rowNum;
      }
      const fractionsRowObject = this.getFirstRowObject();
      fractionsRowObject.delete();
    }
  }

  public getFractionsRowObjectByName(name: string): FractionsRowObject {
    for (let i = 1; i < this.rowNum + 1; i++) {
      const fraction = this.getFractionsRowObjectByIndex(i);
      if (fraction.name === name) {
        return fraction;
      }
    }
    return null;
  }
}

const fractionsPage = new TrashInspectionFractionPage();
export default fractionsPage;

export class FractionsRowObject {
  constructor(rowNum) {
    this.element = $$('#tableBody > tr')[rowNum - 1];
    if (this.element) {
      this.id = +this.element.$('#fractionId').getText();
      this.itemNumber = this.element.$('#fractionItemNumber').getText();
      this.name = this.element.$('#fractionName').getText();
      this.description = this.element.$('#fractionDescription').getText();
      this.locationCode = this.element.$('#fractionLocationCode').getText();
      this.eForm = this.element.$('#fractionSelectedeForm').getText();
      this.editBtn = this.element.$('#updateFractionBtn');
      this.deleteBtn = this.element.$('#deleteFractionBtn');
    }
  }
  element: WebdriverIO.Element;
  id: number;
  itemNumber: string;
  name: string;
  description: string;
  locationCode: string;
  eForm: string;
  editBtn: WebdriverIO.Element;
  deleteBtn: WebdriverIO.Element;

  openDeleteModal() {
    this.deleteBtn.scrollIntoView();
    this.deleteBtn.click();
    fractionsPage.fractionDeleteCancelBtn.waitForDisplayed({
      timeout: 20000,
    });
  }

  closeDeleteModal(clickCancel = false) {
    if (clickCancel) {
      fractionsPage.fractionDeleteCancelBtn.click();
    } else {
      fractionsPage.fractionDeleteDeleteBtn.click();
      $('#spinner-animation').waitForDisplayed({
        timeout: 20000,
        reverse: true,
      });
    }
    fractionsPage.fractionCreateBtn.waitForClickable({ timeout: 20000 });
  }

  delete(clickCancel = false) {
    this.openDeleteModal();
    this.closeDeleteModal(clickCancel);
  }

  openEditModal(updateModel?: FractionsCreateUpdate) {
    this.editBtn.click();
    if (updateModel) {
      if (updateModel.itemNumber) {
        fractionsPage.updateFractionItemNumber.setValue(updateModel.itemNumber);
      }
      if (updateModel.name) {
        fractionsPage.fractionUpdateNameBox.setValue(updateModel.name);
      }
      if (updateModel.description) {
        fractionsPage.fractionUpdateDescriptionBox.setValue(
          updateModel.description
        );
      }
      if (updateModel.locationCode) {
        fractionsPage.editFractionLocationCode.setValue(
          updateModel.locationCode
        );
      }
      if (updateModel.eForm) {
        fractionsPage.fractionUpdateSelector
          .$('input')
          .setValue(updateModel.eForm);
        const value = fractionsPage.fractionUpdateSelector
          .$('.ng-dropdown-panel')
          .$(`.ng-option=${updateModel.eForm}`);
        value.waitForClickable({ timeout: 20000 });
        $('#spinner-animation').waitForDisplayed({
          timeout: 20000,
          reverse: true,
        });
        value.click();
      }
    }
    fractionsPage.fractionUpdateCancelBtn.waitForClickable({ timeout: 20000 });
  }

  closeEditModal(clickCancel = false) {
    if (clickCancel) {
      fractionsPage.fractionUpdateCancelBtn.click();
    } else {
      fractionsPage.fractionUpdateSaveBtn.click();
    }
    fractionsPage.fractionCreateBtn.waitForClickable({ timeout: 20000 });
  }

  edit(updateModel?: FractionsCreateUpdate, clickCancel = false) {
    this.openEditModal(updateModel);
    this.closeEditModal(clickCancel);
  }
}

export class FractionsCreateUpdate {
  itemNumber: string;
  name: string;
  description: string;
  locationCode: string;
  eForm: string;
}
