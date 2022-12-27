import installationPage from '../../../Page objects/trash-inspection/TrashInspection-Installation.page';
import { expect } from 'chai';
import loginPage from '../../../Page objects/Login.page';
import { generateRandmString } from '../../../Helpers/helper-functions';

const name = generateRandmString();
describe('Trash Inspection Plugin - Installation', function () {
  before(async () => {
    await loginPage.open('/auth');
    await loginPage.login();
    await installationPage.goToInstallationsPage();
    await installationPage.createInstallation(name);
  });
  it('should not delete', async () => {
    const rowNumBeforeDelete = await installationPage.rowNum();
    const installation = await installationPage.getInstallationByName(name);
    await installation.openDeleteModal();
    expect(+await (await installationPage.installationDeleteId()).getText()).eq(
      installation.id
    );
    expect(await (await installationPage.installationDeleteName()).getText()).eq(
      installation.name
    );
    await installation.closeDeleteModal(true);
    expect(await installationPage.rowNum(), 'installation is deleted').equal(
      rowNumBeforeDelete
    );
  });
  it('Should delete installation.', async () => {
    const rowNumBeforeDelete = await installationPage.rowNum();
    await (await installationPage.getInstallationByName(name)).delete();
    expect(await installationPage.rowNum(), 'installation is not deleted').equal(
      rowNumBeforeDelete - 1
    );
  });
  after(async () => {
    await installationPage.clearTable();
  });
});
