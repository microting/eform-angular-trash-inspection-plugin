import { expect } from 'chai';
import loginPage from '../../../Page objects/Login.page';
import installationPage from '../../../Page objects/trash-inspection/TrashInspection-Installation.page';
import { generateRandmString } from '../../../Helpers/helper-functions';

describe('Trash Inspection Plugin - Installation', function () {
  before(function () {
    loginPage.open('/auth');
    loginPage.login();
  });
  it('Should create installation without site.', function () {
    const rowNumBeforeCreate = installationPage.rowNum;
    const name = generateRandmString();
    installationPage.goToInstallationsPage();
    installationPage.createInstallation(name);
    expect(installationPage.rowNum, 'installation is not created').equal(
      rowNumBeforeCreate + 1
    );
    const installation = installationPage.getFirstRowObject();
    expect(installation.name).equal(name);
    installation.delete();
  });
  it('should not create installation', function () {
    const rowNumBeforeCreate = installationPage.rowNum;
    const name = generateRandmString();
    installationPage.createInstallation(name, true);
    expect(installationPage.rowNum).equal(rowNumBeforeCreate);
  });
  after(function () {
    installationPage.clearTable();
  });
});
