export const createSessionVaultServiceMock = () =>
  jasmine.createSpyObj('SessionVaultService', {
    login: Promise.resolve(),
    restoreSession: Promise.resolve(),
    logout: Promise.resolve(),
  });
