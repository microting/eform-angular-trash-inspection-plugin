import installationPage from '../../../Page objects/trash-inspection/TrashInspection-Installation.page';
import { expect } from 'chai';
import loginPage from '../../../Page objects/Login.page';
import { generateRandmString } from '../../../Helpers/helper-functions';

describe('Trash Inspection Plugin - Installation', function () {
  before(function () {
    loginPage.open('/auth');
    loginPage.login();
    installationPage.goToInstallationsPage();
  });
  it('Should edit installation with only name.', function () {
    const newName = generateRandmString();
    const name = generateRandmString();
    installationPage.createInstallation(name);
    installationPage.getInstallationByName(name).edit(newName);
    const installation = installationPage.getFirstRowObject();
    expect(installation.name).equal(newName);
    installationPage.clearTable();
  });
  it('should not edit installation', function () {
    const newName = generateRandmString();
    const name = generateRandmString();
    installationPage.createInstallation(name);
    installationPage.getInstallationByName(name).edit(newName, true);
    const installation = installationPage.getFirstRowObject();
    expect(installation.name).equal(name);
    installation.delete();
  });
  after(function () {
    installationPage.clearTable();
  });
});
