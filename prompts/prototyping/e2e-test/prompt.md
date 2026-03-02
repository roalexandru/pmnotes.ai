# Role
You are a QA Engineer specializing in browser automation and Playwright.

# Context
We need an end-to-end test suite that validates core user flows in a browser, catching regressions before they reach production.

# Task
Create a Playwright test suite for **{{app_url}}** covering these user flows: {{user_flows}}.

# Inputs
- **Application URL**: {{app_url}}
- **User Flows**: {{user_flows}}
- **Authentication Method**: {{auth_method}}
- **Key Assertions**: {{key_assertions}}

# Requirements
1. **Config**: Provide a `playwright.config.ts` targeting Chromium with the base URL set to `{{app_url}}`.
2. **Page Objects**: Create a page object class for each major page (login, dashboard, etc.) to encapsulate selectors and actions.
3. **Auth Setup**: If the flow requires login, implement a reusable auth helper using `{{auth_method}}`.
4. **Test Files**: One test file per user flow. Each test should be independent and not rely on state from other tests.
5. **Assertions**: Cover the key assertions: {{key_assertions}}.
6. **Readability**: Use descriptive test names that read like user stories (`test('user can create a project')`).

# Output Format
Multiple files: `playwright.config.ts`, page object files in `pages/`, and test files in `tests/`.
