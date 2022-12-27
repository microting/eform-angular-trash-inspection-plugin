import Page from '../Page';
import myEformsPage from '../MyEforms.page';
import trashInspectionsPage from './TrashInspections.page';

export class TrashInspectionFractionPage extends Page {
  constructor() {
    super();
  }

  public async rowNum(): Promise<number> {
    await browser.pause(500);
    return (await $$('#tableBody > tr')).length;
  }

  public async trashInspectionDropDown() {
    await (await trashInspectionsPage.trashInspectionDropDown()).click();
  }

  public async fractionBtn() {
    const ele = await $(`#trash-inspection-pn-fractions`);
    await ele.waitForDisplayed({ timeout: 20000 });
    await ele.waitForClickable({ timeout: 20000 });
    return ele;
  }

  public async fractionCreateBtn() {
    const ele = await $(`#fractionCreateBtn`);
    await ele.waitForDisplayed({ timeout: 20000 });
    await ele.waitForClickable({ timeout: 20000 });
    return ele;
  }

  public async fractionCreateNameBox() {
    const ele = await $(`#createFractionName`);
    await ele.waitForDisplayed({ timeout: 20000 });
    await ele.waitForClickable({ timeout: 20000 });
    return ele;
  }

  public async fractionCreateDescriptionBox() {
    const ele = await $(`#createFractionDescription`);
    await ele.waitForDisplayed({ timeout: 20000 });
    await ele.waitForClickable({ timeout: 20000 });
    return ele;
  }

  public async fractionCreateSelectorBox() {
    const ele = await $(`#createFractionSelector`);
    await ele.waitForDisplayed({ timeout: 20000 });
    await ele.waitForClickable({ timeout: 20000 });
    return ele;
  }

  public async fractionCreateSaveBtn() {
    const ele = await $(`#fractionCreateSaveBtn`);
    await ele.waitForDisplayed({ timeout: 20000 });
    await ele.waitForClickable({ timeout: 20000 });
    return ele;
  }

  public async fractionCreateCancelBtn() {
    const ele = await $(`#fractionCreateCancelBtn`);
    await ele.waitForDisplayed({ timeout: 20000 });
    await ele.waitForClickable({ timeout: 20000 });
    return ele;
  }

  public async fractionEditBtn() {
    const ele = await $(`#updateFractionBtn`);
    await ele.waitForDisplayed({ timeout: 20000 });
    await ele.waitForClickable({ timeout: 20000 });
    return ele;
  }

  public async fractionUpdateNameBox() {
    const ele = await $(`#updateFractionName`);
    await ele.waitForDisplayed({ timeout: 20000 });
    await ele.waitForClickable({ timeout: 20000 });
    return ele;
  }

  public async fractionUpdateDescriptionBox() {
    const ele = await $(`#editFractionDescription`);
    await ele.waitForDisplayed({ timeout: 20000 });
    await ele.waitForClickable({ timeout: 20000 });
    return ele;
  }

  public async fractionUpdateSelectorBox() {
    const ele = await $(`#fractionUpdateSelector`);
    await ele.waitForDisplayed({ timeout: 20000 });
    await ele.waitForClickable({ timeout: 20000 });
    return ele;
  }

  public async fractionUpdateSaveBtn() {
    const ele = await $(`#fractionUpdateSaveBtn`);
    await ele.waitForDisplayed({ timeout: 20000 });
    await ele.waitForClickable({ timeout: 20000 });
    return ele;
  }

  public async fractionUpdateCancelBtn() {
    const ele = await $(`#fractionUpdateCancelBtn`);
    await ele.waitForDisplayed({ timeout: 20000 });
    await ele.waitForClickable({ timeout: 20000 });
    return ele;
  }

  public async fractionDeleteId() {
    const ele = await $(`#selectedFractionId`);
    await ele.waitForDisplayed({ timeout: 20000 });
    return ele;
  }

  public async fractionDeleteName() {
    const ele = await $(`#selectedFractionName`);
    await ele.waitForDisplayed({ timeout: 20000 });
    return ele;
  }

  public async fractionDeleteDeleteBtn() {
    const ele = await $('#fractionDeleteDeleteBtn');
    await ele.waitForDisplayed({ timeout: 20000 });
    await ele.waitForClickable({ timeout: 20000 });
    return ele;
  }

  public async fractionDeleteCancelBtn() {
    const ele = await $(`#fractionDeleteCancelBtn`);
    await ele.waitForDisplayed({ timeout: 20000 });
    await ele.waitForClickable({ timeout: 20000 });
    return ele;
  }

  public async updateFractionItemNumber() {
    const ele = await $('#updateFractionItemNumber');
    await ele.waitForDisplayed({ timeout: 20000 });
    return ele;
  }

  public async editFractionLocationCode() {
    const ele = await $('#editFractionLocationCode');
    await ele.waitForDisplayed({ timeout: 20000 });
    return ele;
  }

  public async fractionUpdateSelector() {
    const ele = await $('#fractionUpdateSelector');
    await ele.waitForDisplayed({ timeout: 20000 });
    return ele;
  }

  public async createFractionItemNumber() {
    const ele = await $('#createFractionItemNumber');
    await ele.waitForDisplayed({ timeout: 20000 });
    return ele;
  }

  public async createFractionLocationCode() {
    const ele = await $('#createFractionLocationCode');
    await ele.waitForDisplayed({ timeout: 20000 });
    return ele;
  }

  async goToFractionsPage() {
    await this.trashInspectionDropDown();
    await (await this.fractionBtn()).click();
    await (await fractionsPage.fractionCreateBtn()).waitForClickable({ timeout: 20000 });
  }

  async openCreateFraction(createModel?: FractionsCreateUpdate) {
    await (await this.fractionCreateBtn()).click();
    if (createModel) {
      if (createModel.itemNumber) {
        await (await this.createFractionItemNumber()).setValue(createModel.itemNumber);
      }
      if (createModel.name) {
        await (await this.fractionCreateNameBox()).setValue(createModel.name);
      }
      if (createModel.description) {
        await (await this.fractionCreateDescriptionBox()).setValue(createModel.description);
      }
      if (createModel.locationCode) {
        await (await this.createFractionLocationCode()).setValue(createModel.locationCode);
      }
      if (createModel.eForm) {
        const ngOption = await $('.ng-option');
        await (await (await this.fractionCreateSelectorBox()).$('input')).setValue(createModel.eForm);
        await ngOption.waitForDisplayed({ timeout: 20000 });
        const value = await (await (await this.fractionCreateSelectorBox())
          .$('.ng-dropdown-panel'))
          .$(`.ng-option=${createModel.eForm}`);
        await value.waitForClickable({ timeout: 20000 });
        await value.click();
      }
    }

    await (await this.fractionCreateCancelBtn()).waitForClickable({ timeout: 20000 });
  }

  async closeCreateFraction(clickCancel = false) {
    if (clickCancel) {
      await (await this.fractionCreateCancelBtn()).click();
    } else {
      await (await this.fractionCreateSaveBtn()).click();
    }
    await (await this.fractionCreateBtn()).waitForClickable({ timeout: 20000 });
  }

  async createFraction(createModel?: FractionsCreateUpdate, clickCancel = false) {
    await this.openCreateFraction(createModel);
    await this.closeCreateFraction(clickCancel);
  }

  async getFirstRowObject(): Promise<FractionsRowObject> {
    await browser.pause(500);
    const obj = new FractionsRowObject();
    return await obj.getRow(1);
  }

  async getFractionsRowObjectByIndex(index: number): Promise<FractionsRowObject> {
    await browser.pause(500);
    const obj = new FractionsRowObject();
    return await obj.getRow(index);
  }

  async createNewEform(eFormLabel, newTagsList = [], tagAddedNum = 0) {
    return await myEformsPage.createNewEform(eFormLabel, newTagsList, tagAddedNum);
  }

  public async clearTable() {
    browser.pause(2000);
    let rowCount = await this.rowNum();
    for (let i = 1; i <= rowCount; i++) {
      if (i % 9 === 0 && await this.rowNum() > 0) {
        rowCount += await this.rowNum();
      }
      const fractionsRowObject = await this.getFirstRowObject();
      await fractionsRowObject.delete();
    }
  }

  public async getFractionsRowObjectByName(name: string): Promise<FractionsRowObject> {
    for (let i = 1; i < await this.rowNum() + 1; i++) {
      const fraction = await this.getFractionsRowObjectByIndex(i);
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
  constructor() {
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

  async getRow(rowNum: number): Promise<FractionsRowObject> {
    this.element = (await $$('#tableBody > tr'))[rowNum - 1];
    if (this.element) {
      this.id = +await (await this.element.$('#fractionId')).getText();
      this.itemNumber = await (await this.element.$('#fractionItemNumber')).getText();
      this.name = await (await this.element.$('#fractionName')).getText();
      this.description = await (await this.element.$('#fractionDescription')).getText();
      this.locationCode = await (await this.element.$('#fractionLocationCode')).getText();
      this.eForm = await (await this.element.$('#fractionSelectedeForm')).getText();
      this.editBtn = await this.element.$('#updateFractionBtn');
      this.deleteBtn = await this.element.$('#deleteFractionBtn');
    }
    return this;
  }

  async openDeleteModal() {
    await this.deleteBtn.scrollIntoView();
    await this.deleteBtn.click();
    await (await fractionsPage.fractionDeleteCancelBtn()).waitForDisplayed({
      timeout: 20000,
    });
  }

  async closeDeleteModal(clickCancel = false) {
    if (clickCancel) {
      await (await fractionsPage.fractionDeleteCancelBtn()).click();
    } else {
      await (await fractionsPage.fractionDeleteDeleteBtn()).click();
      await (await $('#spinner-animation')).waitForDisplayed({
        timeout: 20000,
        reverse: true,
      });
    }
    await (await fractionsPage.fractionCreateBtn()).waitForClickable({ timeout: 20000 });
  }

  async delete(clickCancel = false) {
    await this.openDeleteModal();
    await this.closeDeleteModal(clickCancel);
  }

  async openEditModal(updateModel?: FractionsCreateUpdate) {
    await this.editBtn.click();
    if (updateModel) {
      if (updateModel.itemNumber) {
        await (await fractionsPage.updateFractionItemNumber()).setValue(updateModel.itemNumber);
      }
      if (updateModel.name) {
        await (await fractionsPage.fractionUpdateNameBox()).setValue(updateModel.name);
      }
      if (updateModel.description) {
        await (await fractionsPage.fractionUpdateDescriptionBox()).setValue(
          updateModel.description
        );
      }
      if (updateModel.locationCode) {
        await (await fractionsPage.editFractionLocationCode()).setValue(
          updateModel.locationCode
        );
      }
      if (updateModel.eForm) {
        await (await (await fractionsPage.fractionUpdateSelector())
          .$('input'))
          .setValue(updateModel.eForm);
        const value = await (await (await fractionsPage.fractionUpdateSelector())
          .$('.ng-dropdown-panel'))
          .$(`.ng-option=${updateModel.eForm}`);
        value.waitForClickable({ timeout: 20000 });
        await (await $('#spinner-animation')).waitForDisplayed({
          timeout: 20000,
          reverse: true,
        });
        await value.click();
      }
    }
    await (await fractionsPage.fractionUpdateCancelBtn()).waitForClickable({ timeout: 20000 });
  }

  async closeEditModal(clickCancel = false) {
    if (clickCancel) {
      await (await fractionsPage.fractionUpdateCancelBtn()).click();
    } else {
      await (await fractionsPage.fractionUpdateSaveBtn()).click();
    }
    await (await fractionsPage.fractionCreateBtn()).waitForClickable({ timeout: 20000 });
  }

  async edit(updateModel?: FractionsCreateUpdate, clickCancel = false) {
    await this.openEditModal(updateModel);
    await this.closeEditModal(clickCancel);
  }
}

export class FractionsCreateUpdate {
  itemNumber: string;
  name: string;
  description: string;
  locationCode: string;
  eForm: string;
}
