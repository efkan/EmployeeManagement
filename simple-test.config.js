import { playwrightLauncher } from '@web/test-runner-playwright';

export default {
  files: ['./test/components/employee-form.test.js'],
  nodeResolve: true,
  browsers: [playwrightLauncher({ product: 'chromium' })],
  testFramework: {
    config: {
      ui: 'bdd',
      timeout: '30000',
    },
  },
};
