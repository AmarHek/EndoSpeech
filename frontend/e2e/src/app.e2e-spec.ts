import { AppPage } from './app.po';

describe('ui-base-project App', () => {
  let page: AppPage;

  beforeEach(() => {
    page = new AppPage();
  });

  it('should record-output welcome message', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('Welcome to befundungstest!');
  });
});
