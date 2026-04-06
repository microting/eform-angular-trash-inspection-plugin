import { test, expect } from '@playwright/test';
import { LoginPage } from '../../../Page objects/Login.page';
import { TrashInspectionSegmentPage, CreateUpdateSegment } from '../TrashInspection-Segment.page';

let page;

test.describe('Trash Inspection Plugin - Segments', () => {
  test.beforeAll(async ({ browser }) => {
    page = await browser.newPage();
    const loginPage = new LoginPage(page);
    await loginPage.open('/auth');
    await loginPage.login();
    const segmentsPage = new TrashInspectionSegmentPage(page);
    await segmentsPage.goToSegmentsPage();
  });
  test.afterAll(async () => {
    await page.close();
  });

  test.describe('Add', () => {
    test('should create segment with all fields', async () => {
      const segmentsPage = new TrashInspectionSegmentPage(page);
      const model: CreateUpdateSegment = {
        name: Math.random().toString(36).substring(7),
        description: Math.random().toString(36).substring(7),
        sdkFolderId: Math.floor(Math.random() * 10 + 1).toString(),
      };
      await segmentsPage.createSegment(model);
      const row = await segmentsPage.getFirstRowObject();
      expect(row.name).toBe(model.name);
      expect(row.description).toBe(model.description);
      expect(row.sdkFolderId).toBe(model.sdkFolderId);
      await segmentsPage.clearTable();
    });

    test('should create segment with name only', async () => {
      const segmentsPage = new TrashInspectionSegmentPage(page);
      const model: CreateUpdateSegment = {
        name: Math.random().toString(36).substring(7),
      };
      await segmentsPage.createSegment(model);
      const row = await segmentsPage.getFirstRowObject();
      expect(row.name).toBe(model.name);
      await segmentsPage.clearTable();
    });

    test('should create segment with name and description', async () => {
      const segmentsPage = new TrashInspectionSegmentPage(page);
      const model: CreateUpdateSegment = {
        name: Math.random().toString(36).substring(7),
        description: Math.random().toString(36).substring(7),
      };
      await segmentsPage.createSegment(model);
      const row = await segmentsPage.getFirstRowObject();
      expect(row.name).toBe(model.name);
      expect(row.description).toBe(model.description);
      await segmentsPage.clearTable();
    });

    test('should create segment with name and sdkFolderId', async () => {
      const segmentsPage = new TrashInspectionSegmentPage(page);
      const model: CreateUpdateSegment = {
        name: Math.random().toString(36).substring(7),
        sdkFolderId: Math.floor(Math.random() * 10 + 1).toString(),
      };
      await segmentsPage.createSegment(model);
      const row = await segmentsPage.getFirstRowObject();
      expect(row.name).toBe(model.name);
      expect(row.sdkFolderId).toBe(model.sdkFolderId);
      await segmentsPage.clearTable();
    });

    test('should not create segment when cancel is clicked', async () => {
      const segmentsPage = new TrashInspectionSegmentPage(page);
      const model: CreateUpdateSegment = {
        name: Math.random().toString(36).substring(7),
        description: Math.random().toString(36).substring(7),
        sdkFolderId: Math.floor(Math.random() * 10 + 1).toString(),
      };
      await segmentsPage.createSegment(model, true);
      expect(await segmentsPage.rowNum()).toBe(0);
    });
  });

  test.describe('Edit', () => {
    test('should edit segment with all fields', async () => {
      const segmentsPage = new TrashInspectionSegmentPage(page);
      const createModel: CreateUpdateSegment = {
        name: Math.random().toString(36).substring(7),
        description: Math.random().toString(36).substring(7),
        sdkFolderId: Math.floor(Math.random() * 10 + 1).toString(),
      };
      await segmentsPage.createSegment(createModel);
      const row = await segmentsPage.getFirstRowObject();
      const editModel: CreateUpdateSegment = {
        name: Math.random().toString(36).substring(7),
        description: Math.random().toString(36).substring(7),
        sdkFolderId: Math.floor(Math.random() * 10 + 1).toString(),
      };
      await row.edit(editModel);
      const editedRow = await segmentsPage.getFirstRowObject();
      expect(editedRow.name).toBe(editModel.name);
      expect(editedRow.description).toBe(editModel.description);
      expect(editedRow.sdkFolderId).toBe(editModel.sdkFolderId);
      await segmentsPage.clearTable();
    });

    test('should edit segment name only', async () => {
      const segmentsPage = new TrashInspectionSegmentPage(page);
      const createModel: CreateUpdateSegment = {
        name: Math.random().toString(36).substring(7),
        description: Math.random().toString(36).substring(7),
        sdkFolderId: Math.floor(Math.random() * 10 + 1).toString(),
      };
      await segmentsPage.createSegment(createModel);
      const row = await segmentsPage.getFirstRowObject();
      const editModel: CreateUpdateSegment = {
        name: Math.random().toString(36).substring(7),
      };
      await row.edit(editModel);
      const editedRow = await segmentsPage.getFirstRowObject();
      expect(editedRow.name).toBe(editModel.name);
      await segmentsPage.clearTable();
    });

    test('should edit segment name and description', async () => {
      const segmentsPage = new TrashInspectionSegmentPage(page);
      const createModel: CreateUpdateSegment = {
        name: Math.random().toString(36).substring(7),
        description: Math.random().toString(36).substring(7),
      };
      await segmentsPage.createSegment(createModel);
      const row = await segmentsPage.getFirstRowObject();
      const editModel: CreateUpdateSegment = {
        name: Math.random().toString(36).substring(7),
        description: Math.random().toString(36).substring(7),
      };
      await row.edit(editModel);
      const editedRow = await segmentsPage.getFirstRowObject();
      expect(editedRow.name).toBe(editModel.name);
      expect(editedRow.description).toBe(editModel.description);
      await segmentsPage.clearTable();
    });

    test('should edit segment name and sdkFolderId', async () => {
      const segmentsPage = new TrashInspectionSegmentPage(page);
      const createModel: CreateUpdateSegment = {
        name: Math.random().toString(36).substring(7),
        sdkFolderId: Math.floor(Math.random() * 10 + 1).toString(),
      };
      await segmentsPage.createSegment(createModel);
      const row = await segmentsPage.getFirstRowObject();
      const editModel: CreateUpdateSegment = {
        name: Math.random().toString(36).substring(7),
        sdkFolderId: Math.floor(Math.random() * 10 + 1).toString(),
      };
      await row.edit(editModel);
      const editedRow = await segmentsPage.getFirstRowObject();
      expect(editedRow.name).toBe(editModel.name);
      expect(editedRow.sdkFolderId).toBe(editModel.sdkFolderId);
      await segmentsPage.clearTable();
    });

    test('should not edit segment when cancel is clicked', async () => {
      const segmentsPage = new TrashInspectionSegmentPage(page);
      const createModel: CreateUpdateSegment = {
        name: Math.random().toString(36).substring(7),
        description: Math.random().toString(36).substring(7),
        sdkFolderId: Math.floor(Math.random() * 10 + 1).toString(),
      };
      await segmentsPage.createSegment(createModel);
      const row = await segmentsPage.getFirstRowObject();
      const originalName = row.name;
      const editModel: CreateUpdateSegment = {
        name: Math.random().toString(36).substring(7),
        description: Math.random().toString(36).substring(7),
      };
      await row.edit(editModel, true);
      const rowAfter = await segmentsPage.getFirstRowObject();
      expect(rowAfter.name).toBe(originalName);
      await segmentsPage.clearTable();
    });
  });

  test.describe('Delete', () => {
    test('should create 4 segments, clear all, verify count 0', async () => {
      const segmentsPage = new TrashInspectionSegmentPage(page);
      const models: CreateUpdateSegment[] = [];
      for (let i = 0; i < 4; i++) {
        models.push({
          name: Math.random().toString(36).substring(7),
          description: Math.random().toString(36).substring(7),
          sdkFolderId: Math.floor(Math.random() * 10 + 1).toString(),
        });
      }
      await segmentsPage.createSegments(models);
      expect(await segmentsPage.rowNum()).toBe(4);
      await segmentsPage.clearTable();
      expect(await segmentsPage.rowNum()).toBe(0);
    });

    test('should not delete segment when cancel is clicked', async () => {
      const segmentsPage = new TrashInspectionSegmentPage(page);
      const model: CreateUpdateSegment = {
        name: Math.random().toString(36).substring(7),
        description: Math.random().toString(36).substring(7),
      };
      await segmentsPage.createSegment(model);
      const rowsBefore = await segmentsPage.rowNum();
      const row = await segmentsPage.getFirstRowObject();
      await row.delete(true);
      expect(await segmentsPage.rowNum()).toBe(rowsBefore);
      await segmentsPage.clearTable();
    });
  });
});
