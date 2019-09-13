import {Guid} from 'guid-typescript';
import installationPage from '../../../Page objects/trash-inspection/TrashInspection-Installation.page';
import {expect} from 'chai';
import loginPage from '../../../Page objects/Login.page';

describe('Trash Inspection Plugin - Installation', function () {
  before(function () {
    loginPage.open('/auth');
    loginPage.login();
  });
  it('Should delete installation.', function () {
    installationPage.goToInstallationsPage();
    browser.waitForVisible('#createInstallationBtn', 20000);
    installationPage.createInstallation_DoesntAddSite(Guid.create().toString());
    installationPage.deleteInstallation_Deletes();
    browser.pause(2000);
    const installation = installationPage.getFirstRowObject();
    expect(installationPage.rowNum).equal(0);
  });
  it('should not delete', function () {
    const name = Guid.create().toString();
    browser.waitForVisible('#createInstallationBtn', 20000);
    installationPage.createInstallation_DoesntAddSite(name);
    installationPage.deleteInstallation_Cancels();
    const installation = installationPage.getFirstRowObject();
    expect(installation.name).equal(name);
    browser.pause(2000);
    installationPage.deleteInstallation_Deletes();
  });
});
