import {expect} from 'chai';
import loginPage from '../../../Page objects/Login.page';
import segmentPage from '../../../Page objects/trash-inspection/TrashInspection-Segment.page';
import {Guid} from 'guid-typescript';

describe('Trash Inspection Plugin - Segment', function () {
  before(async () => {
    await loginPage.open('/auth');
    await loginPage.login();
  });
  it('Should create segment.', async () => {
    const name = Guid.create().toString();
    const description = Guid.create().toString();
    const sdkFolderId = Math.floor((Math.random() * 10) + 1);
    await segmentPage.goToSegmentsPage();
    await segmentPage.createSegment(name, description, sdkFolderId);
    const segment = await segmentPage.getFirstRowObject();
    expect(segment.name).equal(name);
    expect(segment.description).equal(description);
    expect(segment.sdkFolderId).equal(`${sdkFolderId}`);
    await segmentPage.deleteSegment();
  });
  it('Should create segment with only Name.', async () => {
    const name = Guid.create().toString();
    await segmentPage.createSegment(name);
    const segment = await segmentPage.getFirstRowObject();
    expect(segment.name).equal(name);
    await segmentPage.deleteSegment();
  });
  it('Should create segment with name and description.', async () => {
    const name = Guid.create().toString();
    const description = Guid.create().toString();
    await segmentPage.createSegment(name, description);
    const segment = await segmentPage.getFirstRowObject();
    expect(segment.name).equal(name);
    expect(segment.description).equal(description);
    await segmentPage.deleteSegment();
  });
  it('Should create segment with name and sdkFolderId.', async () => {
    const name = Guid.create().toString();
    const sdkFolderId = Math.floor((Math.random() * 10) + 1);
    await segmentPage.createSegment(name, '', sdkFolderId);
    const segment = await segmentPage.getFirstRowObject();
    expect(segment.name).equal(name);
    expect(segment.sdkFolderId).equal(`${sdkFolderId}`);
    await segmentPage.deleteSegment();
  });
  it('should not create segment', async () => {
    const name = Guid.create().toString();
    const description = Guid.create().toString();
    const sdkFolderId = Math.floor((Math.random() * 10) + 1);
    await segmentPage.goToSegmentsPage();
    await segmentPage.createSegment_cancel(name, description, sdkFolderId);
    expect(await segmentPage.rowNum()).equal(0);
  });
});
