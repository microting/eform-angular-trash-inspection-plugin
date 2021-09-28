import Page from '../Page';
import trashInspectionsPage from './TrashInspections.page';

export class TrashInspectionInstallationPage extends Page {
  constructor() {
    super();
  }

  public async rowNum(): Promise<number> {
    await browser.pause(500);
    return (await $$('#installationsTableBody > tr')).length;
  }

  public async trashInspectionDropDown() {
    await (await trashInspectionsPage.trashInspectionDropDown()).click();
  }

  public async installationBtn() {
    const ele = $('#trash-inspection-pn-installations');
    await ele.waitForDisplayed({ timeout: 20000 });
    await ele.waitForClickable({ timeout: 20000 });
    return ele;
  }

  public async installationCreateBtn() {
    const ele = $('#createInstallationBtn');
    await ele.waitForDisplayed({ timeout: 20000 });
    await ele.waitForClickable({ timeout: 20000 });
    return ele;
  }

  public async installationCreateNameBox() {
    const ele = $('#createInstallationName');
    await ele.waitForDisplayed({ timeout: 20000 });
    await ele.waitForClickable({ timeout: 20000 });
    return ele;
  }

  public async installationCreateSiteCheckbox() {
    const ele = $(`#checkbox`);
    await ele.waitForDisplayed({ timeout: 20000 });
    await ele.waitForClickable({ timeout: 20000 });
    return ele;
  }

  public async installationCreateSaveBtn() {
    const ele = $(`#installationCreateSaveBtn`);
    await ele.waitForDisplayed({ timeout: 20000 });
    await ele.waitForClickable({ timeout: 20000 });
    return ele;
  }

  public async installationCreateCancelBtn() {
    const ele = $(`#installationCreateCancelBtn`);
    await ele.waitForDisplayed({ timeout: 20000 });
    await ele.waitForClickable({ timeout: 20000 });
    return ele;
  }

  public async installationUpdateNameBox() {
    const ele = $(`#updateInstallationName`);
    await ele.waitForDisplayed({ timeout: 20000 });
    await ele.waitForClickable({ timeout: 20000 });
    return ele;
  }

  public async installationUpdateSiteCheckbox(Index: number) {
    const ele = $(`#installationUpdateSiteCheckbox${Index}`);
    await ele.waitForDisplayed({ timeout: 20000 });
    await ele.waitForClickable({ timeout: 20000 });
    return ele;
  }

  public async installationUpdateSaveBtn() {
    const ele = $(`#installationUpdateSaveBtn`);
    await ele.waitForDisplayed({ timeout: 20000 });
    await ele.waitForClickable({ timeout: 20000 });
    return ele;
  }

  public async installationUpdateCancelBtn() {
    const ele = $(`#installationUpdateCancelBtn`);
    await ele.waitForDisplayed({ timeout: 20000 });
    await ele.waitForClickable({ timeout: 20000 });
    return ele;
  }

  public async installationDeleteId() {
    const ele = $(`#selectedInstallationId`);
    await ele.waitForDisplayed({ timeout: 20000 });
    await ele.waitForClickable({ timeout: 20000 });
    return ele;
  }

  public async installationDeleteName() {
    const ele = $(`#selectedInstallationName`);
    await ele.waitForDisplayed({ timeout: 20000 });
    await ele.waitForClickable({ timeout: 20000 });
    return ele;
  }

  public async installationDeleteDeleteBtn() {
    const ele = $('#installationDeleteDeleteBtn');
    await ele.waitForDisplayed({ timeout: 20000 });
    await ele.waitForClickable({ timeout: 20000 });
    return ele;
  }
  public async installationDeleteCancelBtn() {
    const ele = $(`#installationDeleteCancelBtn`);
    await ele.waitForDisplayed({ timeout: 20000 });
    await ele.waitForClickable({ timeout: 20000 });
    return ele;
  }
  public async page2Object() {
    const ele = (await $$('eform-pagination ul li'))[1];
    // ele.waitForDisplayed({timeout: 20000});
    // ele.waitForClickable({timeout: 20000});
    return ele;
  }

  async goToInstallationsPage() {
    await this.trashInspectionDropDown();
    await (await this.installationBtn()).click();
    await (await this.installationCreateBtn()).waitForClickable({ timeout: 20000 });
  }

  async createInstallation(name?: string, clickCancel = false) {
    await (await this.installationCreateBtn()).click();
    if (name) {
      await (await this.installationCreateNameBox()).addValue(name);
    }
    if (!clickCancel) {
      await (await this.installationCreateSaveBtn()).click();
      await (await $('#spinner-animation')).waitForDisplayed({
        timeout: 20000,
        reverse: true,
      });
    } else {
      await (await this.installationCreateCancelBtn()).click();
    }
    await (await this.installationCreateBtn()).waitForDisplayed({ timeout: 10000 });
  }

  async getFirstRowObject(): Promise<InstallationPageRowObject> {
    await  browser.pause(500);
    const rowObj = new InstallationPageRowObject();
    return await rowObj.getRow(1);
  }

  async getInstallationByName(name: string): Promise<InstallationPageRowObject> {
    for (let i = 1; i < await this.rowNum() + 1; i++) {
      const installation = await this.getInstallation(i);
      if (installation.name === name) {
        return installation;
      }
    }
    return null;
  }

  async getInstallation(num): Promise<InstallationPageRowObject> {
    const rowObj = new InstallationPageRowObject();
    return await rowObj.getRow(num);
  }

  public async clearTable() {
    await browser.pause(2000);
    const rowCount = await this.rowNum();
    for (let i = 1; i <= rowCount; i++) {
      const installationPageRowObject = new InstallationPageRowObject();
      const obj = await installationPageRowObject.getRow(i);
      await obj.delete();
    }
  }
}

const installationPage = new TrashInspectionInstallationPage();
export default installationPage;

export class InstallationPageRowObject {
  constructor() {}

  element: WebdriverIO.Element;
  id: number;
  name: string;
  editBtn: WebdriverIO.Element;
  deleteBtn: WebdriverIO.Element;

  async getRow(rowNum: number): Promise<InstallationPageRowObject> {
    this.element = (await $$('#installationsTableBody > tr'))[rowNum - 1];
    if (this.element) {
      this.id = +await (await this.element.$('#installationId')).getText();
      try {
        this.name = await (await this.element.$('#installationName')).getText();
      } catch (e) {}
      this.editBtn = await this.element.$('#updateInstallationBtn');
      this.deleteBtn = await this.element.$('#deleteInstallationBtn');
    }

    return this;
  }

  async openDeleteModal() {
    await this.deleteBtn.scrollIntoView();
    await this.deleteBtn.click();
    await (await installationPage.installationDeleteDeleteBtn()).waitForDisplayed({
      timeout: 20000,
    });
  }

  async closeDeleteModal(clickCancel = false) {
    if (clickCancel) {
      await (await installationPage.installationDeleteCancelBtn()).click();
    } else {
      await (await installationPage.installationDeleteDeleteBtn()).click();
      await (await $('#spinner-animation')).waitForDisplayed({
        timeout: 20000,
        reverse: true,
      });
    }
    await (await installationPage.installationCreateBtn()).waitForClickable({ timeout: 20000 });
  }

  async delete(clickCancel = false) {
    await this.openDeleteModal();
    await this.closeDeleteModal(clickCancel);
  }

  async openEditModal(name?: string) {
    await this.editBtn.click();
    (await installationPage.installationUpdateCancelBtn()).waitForClickable({
      timeout: 20000,
    });
    if (name) {
      await (await installationPage.installationUpdateNameBox()).setValue(name);
    }
  }

  async closeEditModal(clickCancel = false) {
    if (clickCancel) {
      await (await installationPage.installationUpdateCancelBtn()).click();
    } else {
      await (await installationPage.installationUpdateSaveBtn()).click();
    }
    await (await installationPage.installationCreateBtn()).waitForDisplayed({ timeout: 10000 });
  }

  async edit(name, clickCancel = false) {
    await this.openEditModal(name);
    await this.closeEditModal(clickCancel);
  }
}
