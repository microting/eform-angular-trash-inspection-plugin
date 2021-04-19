import Page from '../Page';
import trashInspectionsPage from './TrashInspections.page';

export class TrashInspectionInstallationPage extends Page {
  constructor() {
    super();
  }

  public get rowNum(): number {
    browser.pause(500);
    return $$('#installationsTableBody > tr').length;
  }

  public trashInspectionDropDown() {
    trashInspectionsPage.trashInspectionDropDown().click();
  }

  public get installationBtn() {
    const ele = $('#trash-inspection-pn-installations');
    ele.waitForDisplayed({ timeout: 20000 });
    ele.waitForClickable({ timeout: 20000 });
    return ele;
  }

  public get installationCreateBtn() {
    const ele = $('#createInstallationBtn');
    ele.waitForDisplayed({ timeout: 20000 });
    ele.waitForClickable({ timeout: 20000 });
    return ele;
  }

  public get installationCreateNameBox() {
    const ele = $('#createInstallationName');
    ele.waitForDisplayed({ timeout: 20000 });
    ele.waitForClickable({ timeout: 20000 });
    return ele;
  }

  public get installationCreateSiteCheckbox() {
    const ele = $(`#checkbox`);
    ele.waitForDisplayed({ timeout: 20000 });
    ele.waitForClickable({ timeout: 20000 });
    return ele;
  }

  public get installationCreateSaveBtn() {
    const ele = $(`#installationCreateSaveBtn`);
    ele.waitForDisplayed({ timeout: 20000 });
    ele.waitForClickable({ timeout: 20000 });
    return ele;
  }

  public get installationCreateCancelBtn() {
    const ele = $(`#installationCreateCancelBtn`);
    ele.waitForDisplayed({ timeout: 20000 });
    ele.waitForClickable({ timeout: 20000 });
    return ele;
  }

  public get installationUpdateNameBox() {
    const ele = $(`#updateInstallationName`);
    ele.waitForDisplayed({ timeout: 20000 });
    ele.waitForClickable({ timeout: 20000 });
    return ele;
  }

  public installationUpdateSiteCheckbox(Index: number) {
    const ele = $(`#installationUpdateSiteCheckbox${Index}`);
    ele.waitForDisplayed({ timeout: 20000 });
    ele.waitForClickable({ timeout: 20000 });
    return ele;
  }

  public get installationUpdateSaveBtn() {
    const ele = $(`#installationUpdateSaveBtn`);
    ele.waitForDisplayed({ timeout: 20000 });
    ele.waitForClickable({ timeout: 20000 });
    return ele;
  }

  public get installationUpdateCancelBtn() {
    const ele = $(`#installationUpdateCancelBtn`);
    ele.waitForDisplayed({ timeout: 20000 });
    ele.waitForClickable({ timeout: 20000 });
    return ele;
  }

  public get installationDeleteId() {
    const ele = $(`#selectedInstallationId`);
    ele.waitForDisplayed({ timeout: 20000 });
    ele.waitForClickable({ timeout: 20000 });
    return ele;
  }

  public get installationDeleteName() {
    const ele = $(`#selectedInstallationName`);
    ele.waitForDisplayed({ timeout: 20000 });
    ele.waitForClickable({ timeout: 20000 });
    return ele;
  }

  public get installationDeleteDeleteBtn() {
    const ele = $('#installationDeleteDeleteBtn');
    ele.waitForDisplayed({ timeout: 20000 });
    ele.waitForClickable({ timeout: 20000 });
    return ele;
  }
  public get installationDeleteCancelBtn() {
    const ele = $(`#installationDeleteCancelBtn`);
    ele.waitForDisplayed({ timeout: 20000 });
    ele.waitForClickable({ timeout: 20000 });
    return ele;
  }
  public get page2Object() {
    const ele = $$('eform-pagination ul li')[1];
    // ele.waitForDisplayed({timeout: 20000});
    // ele.waitForClickable({timeout: 20000});
    return ele;
  }

  goToInstallationsPage() {
    this.trashInspectionDropDown();
    this.installationBtn.click();
    this.installationCreateBtn.waitForClickable({ timeout: 20000 });
  }

  createInstallation(name?: string, clickCancel = false) {
    this.installationCreateBtn.click();
    if (name) {
      this.installationCreateNameBox.addValue(name);
    }
    if (!clickCancel) {
      this.installationCreateSaveBtn.click();
      $('#spinner-animation').waitForDisplayed({
        timeout: 20000,
        reverse: true,
      });
    } else {
      this.installationCreateCancelBtn.click();
    }
    this.installationCreateBtn.waitForDisplayed({ timeout: 10000 });
  }

  getFirstRowObject(): InstallationPageRowObject {
    browser.pause(500);
    return new InstallationPageRowObject(1);
  }

  getInstallationByName(name: string): InstallationPageRowObject {
    for (let i = 1; i < this.rowNum + 1; i++) {
      const installation = this.getInstallation(i);
      if (installation.name === name) {
        return installation;
      }
    }
    return null;
  }

  getInstallation(num): InstallationPageRowObject {
    return new InstallationPageRowObject(num);
  }

  public clearTable() {
    browser.pause(2000);
    let rowCount = this.rowNum;
    for (let i = 1; i <= rowCount; i++) {
      if (i % 9 === 0 && this.rowNum > 0) {
        rowCount += this.rowNum;
      }
      const installationPageRowObject = new InstallationPageRowObject(1);
      installationPageRowObject.delete();
    }
  }
}

const installationPage = new TrashInspectionInstallationPage();
export default installationPage;

export class InstallationPageRowObject {
  constructor(rowNum) {
    this.element = $$('#installationsTableBody > tr')[rowNum - 1];
    if (this.element) {
      this.id = +this.element.$('#installationId').getText();
      try {
        this.name = this.element.$('#installationName').getText();
      } catch (e) {}
      this.editBtn = this.element.$('#updateInstallationBtn');
      this.deleteBtn = this.element.$('#deleteInstallationBtn');
    }
  }

  element: WebdriverIO.Element;
  id: number;
  name: string;
  editBtn: WebdriverIO.Element;
  deleteBtn: WebdriverIO.Element;

  openDeleteModal() {
    this.deleteBtn.scrollIntoView();
    this.deleteBtn.click();
    installationPage.installationDeleteDeleteBtn.waitForDisplayed({
      timeout: 20000,
    });
  }

  closeDeleteModal(clickCancel = false) {
    if (clickCancel) {
      installationPage.installationDeleteCancelBtn.click();
    } else {
      installationPage.installationDeleteDeleteBtn.click();
      $('#spinner-animation').waitForDisplayed({
        timeout: 20000,
        reverse: true,
      });
    }
    installationPage.installationCreateBtn.waitForClickable({ timeout: 20000 });
  }

  delete(clickCancel = false) {
    this.openDeleteModal();
    this.closeDeleteModal(clickCancel);
  }

  openEditModal(name?: string) {
    this.editBtn.click();
    installationPage.installationUpdateCancelBtn.waitForClickable({
      timeout: 20000,
    });
    if (name) {
      installationPage.installationUpdateNameBox.setValue(name);
    }
  }

  closeEditModal(clickCancel = false) {
    if (clickCancel) {
      installationPage.installationUpdateCancelBtn.click();
    } else {
      installationPage.installationUpdateSaveBtn.click();
    }
    installationPage.installationCreateBtn.waitForDisplayed({ timeout: 10000 });
  }

  edit(name, clickCancel = false) {
    this.openEditModal(name);
    this.closeEditModal(clickCancel);
  }
}
