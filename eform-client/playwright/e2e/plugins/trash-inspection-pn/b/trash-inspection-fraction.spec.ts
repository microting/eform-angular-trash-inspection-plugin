import { test, expect } from '@playwright/test';
import { LoginPage } from '../../../Page objects/Login.page';
import { MyEformsPage } from '../../../Page objects/MyEforms.page';
import { TrashInspectionFractionPage, FractionsCreateUpdate } from '../TrashInspection-Fraction.page';

let page;

test.describe('Trash Inspection Plugin - Fractions', () => {
  test.beforeAll(async ({ browser }) => {
    page = await browser.newPage();
    const loginPage = new LoginPage(page);
    await loginPage.open('/auth');
    await loginPage.login();
    const myEformsPage = new MyEformsPage(page);
    await myEformsPage.createNewEform('Number 1');
    await myEformsPage.createNewEform('Number 2');
    const fractionsPage = new TrashInspectionFractionPage(page);
    await fractionsPage.goToFractionsPage();
  });
  test.afterAll(async () => {
    await page.close();
  });

  test.describe('Add', () => {
    test('should not create fraction when cancel is clicked', async () => {
      const fractionsPage = new TrashInspectionFractionPage(page);
      const rowsBefore = await fractionsPage.rowNum();
      const model: FractionsCreateUpdate = {
        name: Math.random().toString(36).substring(7),
        description: Math.random().toString(36).substring(7),
        itemNumber: Math.random().toString(36).substring(7),
        locationCode: Math.random().toString(36).substring(7),
        eForm: 'Number 1',
      };
      await fractionsPage.createFraction(model, true);
      const rowsAfter = await fractionsPage.rowNum();
      expect(rowsAfter).toBe(rowsBefore);
    });

    test('should create fraction with all fields', async () => {
      const fractionsPage = new TrashInspectionFractionPage(page);
      const model: FractionsCreateUpdate = {
        name: Math.random().toString(36).substring(7),
        description: Math.random().toString(36).substring(7),
        itemNumber: Math.random().toString(36).substring(7),
        locationCode: Math.random().toString(36).substring(7),
        eForm: 'Number 1',
      };
      await fractionsPage.createFraction(model);
      const row = await fractionsPage.getFirstRowObject();
      expect(row.name).toBe(model.name);
      expect(row.description).toBe(model.description);
      expect(row.itemNumber).toBe(model.itemNumber);
      expect(row.locationCode).toBe(model.locationCode);
      expect(row.selectedTemplateName).toBe('Number 1');
    });

    test('cleanup - clear table after add tests', async () => {
      const fractionsPage = new TrashInspectionFractionPage(page);
      await fractionsPage.clearTable();
      expect(await fractionsPage.rowNum()).toBe(0);
    });
  });

  test.describe('Edit', () => {
    test('should edit fraction with new values', async () => {
      const fractionsPage = new TrashInspectionFractionPage(page);
      const createModel: FractionsCreateUpdate = {
        name: Math.random().toString(36).substring(7),
        description: Math.random().toString(36).substring(7),
        itemNumber: Math.random().toString(36).substring(7),
        locationCode: Math.random().toString(36).substring(7),
        eForm: 'Number 1',
      };
      await fractionsPage.createFraction(createModel);
      const row = await fractionsPage.getFirstRowObject();
      const editModel: FractionsCreateUpdate = {
        name: Math.random().toString(36).substring(7),
        description: Math.random().toString(36).substring(7),
        itemNumber: Math.random().toString(36).substring(7),
        locationCode: Math.random().toString(36).substring(7),
        eForm: 'Number 2',
      };
      await row.edit(editModel);
      const editedRow = await fractionsPage.getFirstRowObject();
      expect(editedRow.name).toBe(editModel.name);
      expect(editedRow.description).toBe(editModel.description);
      expect(editedRow.itemNumber).toBe(editModel.itemNumber);
      expect(editedRow.locationCode).toBe(editModel.locationCode);
      expect(editedRow.selectedTemplateName).toBe('Number 2');
    });

    test('should not edit fraction when cancel is clicked', async () => {
      const fractionsPage = new TrashInspectionFractionPage(page);
      const rowBefore = await fractionsPage.getFirstRowObject();
      const originalName = rowBefore.name;
      const editModel: FractionsCreateUpdate = {
        name: Math.random().toString(36).substring(7),
        description: Math.random().toString(36).substring(7),
      };
      await rowBefore.edit(editModel, true);
      const rowAfter = await fractionsPage.getFirstRowObject();
      expect(rowAfter.name).toBe(originalName);
    });

    test('cleanup - clear table after edit tests', async () => {
      const fractionsPage = new TrashInspectionFractionPage(page);
      await fractionsPage.clearTable();
      expect(await fractionsPage.rowNum()).toBe(0);
    });
  });

  test.describe('Delete', () => {
    test('should not delete fraction when cancel is clicked', async () => {
      const fractionsPage = new TrashInspectionFractionPage(page);
      const model: FractionsCreateUpdate = {
        name: Math.random().toString(36).substring(7),
        description: Math.random().toString(36).substring(7),
        itemNumber: Math.random().toString(36).substring(7),
        locationCode: Math.random().toString(36).substring(7),
        eForm: 'Number 1',
      };
      await fractionsPage.createFraction(model);
      const rowsBefore = await fractionsPage.rowNum();
      const row = await fractionsPage.getFirstRowObject();
      await row.delete(true);
      const rowsAfter = await fractionsPage.rowNum();
      expect(rowsAfter).toBe(rowsBefore);
    });

    test('should delete fraction', async () => {
      const fractionsPage = new TrashInspectionFractionPage(page);
      const rowsBefore = await fractionsPage.rowNum();
      const row = await fractionsPage.getFirstRowObject();
      await row.delete();
      const rowsAfter = await fractionsPage.rowNum();
      expect(rowsAfter).toBe(rowsBefore - 1);
    });

    test('cleanup - clear table after delete tests', async () => {
      const fractionsPage = new TrashInspectionFractionPage(page);
      await fractionsPage.clearTable();
      expect(await fractionsPage.rowNum()).toBe(0);
    });
  });
});
