import { test, expect } from '@playwright/test';
import { LoginPage } from '../../../Page objects/Login.page';
import { TrashInspectionInstallationPage } from '../TrashInspection-Installation.page';

let page;

test.describe('Trash Inspection Plugin - Installations', () => {
  test.beforeAll(async ({ browser }) => {
    page = await browser.newPage();
    const loginPage = new LoginPage(page);
    await loginPage.open('/auth');
    await loginPage.login();
    const installationsPage = new TrashInspectionInstallationPage(page);
    await installationsPage.goToInstallationsPage();
  });
  test.afterAll(async () => {
    await page.close();
  });

  test.describe('Add', () => {
    test('should create installation without site', async () => {
      const installationsPage = new TrashInspectionInstallationPage(page);
      const name = Math.random().toString(36).substring(7);
      await installationsPage.createInstallation(name);
      const row = await installationsPage.getFirstRowObject();
      expect(row.name).toBe(name);
      await row.delete();
      expect(await installationsPage.rowNum()).toBe(0);
    });

    test('should not create installation when cancel is clicked', async () => {
      const installationsPage = new TrashInspectionInstallationPage(page);
      const rowsBefore = await installationsPage.rowNum();
      const name = Math.random().toString(36).substring(7);
      await installationsPage.createInstallation(name, true);
      const rowsAfter = await installationsPage.rowNum();
      expect(rowsAfter).toBe(rowsBefore);
    });

    test('cleanup - clear table after add tests', async () => {
      const installationsPage = new TrashInspectionInstallationPage(page);
      await installationsPage.clearTable();
      expect(await installationsPage.rowNum()).toBe(0);
    });
  });

  test.describe('Edit', () => {
    test('should edit installation with new name', async () => {
      const installationsPage = new TrashInspectionInstallationPage(page);
      const name = Math.random().toString(36).substring(7);
      await installationsPage.createInstallation(name);
      const row = await installationsPage.getFirstRowObject();
      const newName = Math.random().toString(36).substring(7);
      await row.edit(newName);
      const editedRow = await installationsPage.getFirstRowObject();
      expect(editedRow.name).toBe(newName);
      await editedRow.delete();
    });

    test('should not edit installation when cancel is clicked', async () => {
      const installationsPage = new TrashInspectionInstallationPage(page);
      const name = Math.random().toString(36).substring(7);
      await installationsPage.createInstallation(name);
      const row = await installationsPage.getFirstRowObject();
      const newName = Math.random().toString(36).substring(7);
      await row.edit(newName, true);
      const rowAfter = await installationsPage.getFirstRowObject();
      expect(rowAfter.name).toBe(name);
      await rowAfter.delete();
    });

    test('cleanup - clear table after edit tests', async () => {
      const installationsPage = new TrashInspectionInstallationPage(page);
      await installationsPage.clearTable();
      expect(await installationsPage.rowNum()).toBe(0);
    });
  });

  test.describe('Delete', () => {
    test('should not delete installation when cancel is clicked', async () => {
      const installationsPage = new TrashInspectionInstallationPage(page);
      const name = Math.random().toString(36).substring(7);
      await installationsPage.createInstallation(name);
      const rowsBefore = await installationsPage.rowNum();
      const row = await installationsPage.getFirstRowObject();
      await row.delete(true);
      const rowsAfter = await installationsPage.rowNum();
      expect(rowsAfter).toBe(rowsBefore);
    });

    test('should delete installation', async () => {
      const installationsPage = new TrashInspectionInstallationPage(page);
      const rowsBefore = await installationsPage.rowNum();
      const row = await installationsPage.getFirstRowObject();
      await row.delete();
      const rowsAfter = await installationsPage.rowNum();
      expect(rowsAfter).toBe(rowsBefore - 1);
    });

    test('cleanup - clear table after delete tests', async () => {
      const installationsPage = new TrashInspectionInstallationPage(page);
      await installationsPage.clearTable();
      expect(await installationsPage.rowNum()).toBe(0);
    });
  });

  test.describe('Multi', () => {
    test('should create 11 installations and verify pagination', async () => {
      const installationsPage = new TrashInspectionInstallationPage(page);
      await installationsPage.clearTable();
      for (let i = 0; i < 11; i++) {
        const name = Math.random().toString(36).substring(7);
        await installationsPage.createInstallation(name);
      }
      const label = await installationsPage.paginatorLabel().innerText();
      expect(label.trim()).toContain('Side 1 af 2');
    });

    test('cleanup - clear table after multi tests', async () => {
      const installationsPage = new TrashInspectionInstallationPage(page);
      await installationsPage.goToInstallationsPage();
      await installationsPage.clearTable();
      expect(await installationsPage.rowNum()).toBe(0);
    });
  });
});
