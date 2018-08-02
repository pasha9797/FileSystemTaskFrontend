import { AppRoutingModule } from './app-routing.module';

describe('AppRoutingModule', () => {
  let routingModuleModule: AppRoutingModule;

  beforeEach(() => {
    routingModuleModule = new AppRoutingModule();
  });

  it('should create an instance', () => {
    expect(routingModuleModule).toBeTruthy();
  });
});
