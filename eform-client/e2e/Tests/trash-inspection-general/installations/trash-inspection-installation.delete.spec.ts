import installationPage from '../../../Page objects/trash-inspection/TrashInspection-Installation.page';
import { expect } from 'chai';
import loginPage from '../../../Page objects/Login.page';
import { generateRandmString } from '../../../Helpers/helper-functions';

const name = generateRandmString();
describe('Trash Inspection Plugin - Installation', function () {
  before(function () {
    loginPage.open('/auth');
    loginPage.login();
    installationPage.goToInstallationsPage();
    installationPage.createInstallation(name);
  });
  it('should not delete', function () {
    const rowNumBeforeDelete = installationPage.rowNum;
    const installation = installationPage.getInstallationByName(name);
    installation.openDeleteModal();
    expect(+installationPage.installationDeleteId.getText()).eq(
      installation.id
    );
    expect(installationPage.installationDeleteName.getText()).eq(
      installation.name
    );
    installation.closeDeleteModal(true);
    expect(installationPage.rowNum, 'installation is deleted').equal(
      rowNumBeforeDelete
    );
  });
  it('Should delete installation.', function () {
    const rowNumBeforeDelete = installationPage.rowNum;
    installationPage.getInstallationByName(name).delete();
    expect(installationPage.rowNum, 'installation is not deleted').equal(
      rowNumBeforeDelete - 1
    );
  });
  after(function () {
    installationPage.clearTable();
  });
});
