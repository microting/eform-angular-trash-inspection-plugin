import { expect } from 'chai';
import loginPage from '../../../Page objects/Login.page';
import installationPage from '../../../Page objects/trash-inspection/TrashInspection-Installation.page';
import { generateRandmString } from '../../../Helpers/helper-functions';

describe('Trash Inspection Plugin - Installation', function () {
  before(function () {
    loginPage.open('/auth');
    loginPage.login();
    installationPage.goToInstallationsPage();
    installationPage.clearTable();
  });
  it('Should create multiple installations without site.', function () {
    for (let i = 0; i < 11; i++) {
      installationPage.createInstallation(generateRandmString());
    }
    expect(installationPage.page2Object.getText()).equal('2');
  });
  after(function () {
    installationPage.clearTable();
  });
});
