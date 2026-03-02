```ts
// playwright.config.ts
import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  timeout: 30_000,
  retries: 1,
  use: {
    baseURL: 'http://localhost:3000',
    screenshot: 'only-on-failure',
    trace: 'on-first-retry',
  },
  projects: [
    { name: 'chromium', use: { browserName: 'chromium' } },
  ],
});
```

```ts
// pages/login.page.ts
import { type Page } from '@playwright/test';

export class LoginPage {
  constructor(private page: Page) {}

  async goto() {
    await this.page.goto('/login');
  }

  async login(email: string, password: string) {
    await this.page.fill('[name="email"]', email);
    await this.page.fill('[name="password"]', password);
    await this.page.click('button[type="submit"]');
    await this.page.waitForURL('/dashboard');
  }
}
```

```ts
// pages/dashboard.page.ts
import { type Page, expect } from '@playwright/test';

export class DashboardPage {
  constructor(private page: Page) {}

  async expectProjectCount(count: number) {
    const counter = this.page.getByTestId('project-count');
    await expect(counter).toHaveText(String(count));
  }

  async createProject(name: string) {
    await this.page.click('button:has-text("New Project")');
    await this.page.fill('[name="project-name"]', name);
    await this.page.click('button:has-text("Create")');
    await this.page.waitForSelector(`text="${name}"`);
  }

  async inviteTeamMember(email: string) {
    await this.page.click('button:has-text("Invite")');
    await this.page.fill('[name="invite-email"]', email);
    await this.page.click('button:has-text("Send Invitation")');
  }
}
```

```ts
// tests/auth.spec.ts
import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/login.page';

test.describe('Authentication', () => {
  test('user can sign up with email and password', async ({ page }) => {
    await page.goto('/signup');
    await page.fill('[name="email"]', 'newuser@example.com');
    await page.fill('[name="password"]', 'SecurePass123!');
    await page.fill('[name="confirm-password"]', 'SecurePass123!');
    await page.click('button[type="submit"]');

    await expect(page).toHaveURL('/dashboard');
  });

  test('user can log in with existing credentials', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login('testuser@example.com', 'TestPass123!');

    await expect(page).toHaveURL('/dashboard');
  });

  test('shows error on invalid credentials', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login('wrong@example.com', 'badpassword');

    await expect(page.getByRole('alert')).toContainText('Invalid email or password');
  });
});
```

```ts
// tests/projects.spec.ts
import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/login.page';
import { DashboardPage } from '../pages/dashboard.page';

test.describe('Projects', () => {
  test.beforeEach(async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login('testuser@example.com', 'TestPass123!');
  });

  test('user can create a project', async ({ page }) => {
    const dashboard = new DashboardPage(page);
    await dashboard.createProject('My New Project');

    await expect(page.getByText('My New Project')).toBeVisible();
  });

  test('dashboard shows correct project count', async ({ page }) => {
    const dashboard = new DashboardPage(page);
    await dashboard.expectProjectCount(1);
  });
});
```

```ts
// tests/team.spec.ts
import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/login.page';
import { DashboardPage } from '../pages/dashboard.page';

test.describe('Team', () => {
  test.beforeEach(async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login('testuser@example.com', 'TestPass123!');
  });

  test('user can invite a team member', async ({ page }) => {
    const dashboard = new DashboardPage(page);
    await dashboard.inviteTeamMember('colleague@example.com');

    await expect(page.getByText('Invitation sent')).toBeVisible();
  });

  test('shows error for invalid email invitation', async ({ page }) => {
    const dashboard = new DashboardPage(page);
    await dashboard.inviteTeamMember('not-an-email');

    await expect(page.getByRole('alert')).toContainText('valid email');
  });
});
```
