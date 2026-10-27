import { test, expect, Page } from "@playwright/test";

const TABLE_URL = "http://localhost:3001/table";
const USERS_API = "http://localhost:3001/api/users**";

type User = { id: number; name: string; email: string; role: string; age: number };

function buildUsers(count: number): User[] {
    const roles = ["Admin", "Editor", "Viewer"];
    return Array.from({ length: count }, (_, i) => ({
        id: i + 1,
        name: `Mock User ${String(i + 1).padStart(2, "0")}`,
        email: `mock.user${i + 1}@hourtolearn.dev`,
        role: roles[i % roles.length],
        age: 20 + i,
    }));
}

// Mock /api/users like the real server: honour page/pageSize from the request query.
async function mockUsersApi(page: Page, users: User[]) {
    await page.route(USERS_API, async (route) => {
        const url = new URL(route.request().url());
        const pageNum = Number(url.searchParams.get("page") ?? 1);
        const pageSize = Number(url.searchParams.get("pageSize") ?? 5);
        const start = (pageNum - 1) * pageSize;
        await route.fulfill({
            json: { data: users.slice(start, start + pageSize), total: users.length, page: pageNum, pageSize },
        });
    });
}

test.describe("Table page with mocked /api/users", () => {
    test("shows an empty table when the API returns no users", async ({ page }) => {
        await mockUsersApi(page, []);

        const usersResponse = page.waitForResponse(USERS_API);
        await page.goto(TABLE_URL);
        await usersResponse;

        await expect(page.getByTestId("table-body").locator("tr")).toHaveCount(0);
        await expect(page.getByTestId("table-page-info")).toHaveText("Page 1 of 1");
        await expect(page.getByTestId("table-prev-page")).toBeDisabled();
        await expect(page.getByTestId("table-next-page")).toBeDisabled();
        await expect(page.getByTestId("table-select-all")).not.toBeChecked();
        await expect(page.getByTestId("table-delete-selected")).toBeDisabled();
    });

    test("paginates when the API has 20+ users", async ({ page }) => {
        const users = buildUsers(23); // 5 per page -> 5 pages, last page has 3 rows
        await mockUsersApi(page, users);

        await page.goto(TABLE_URL);

        const rows = page.getByTestId("table-body").locator("tr");
        const pageInfo = page.getByTestId("table-page-info");
        const nextBtn = page.getByTestId("table-next-page");
        const prevBtn = page.getByTestId("table-prev-page");

        await expect(pageInfo).toHaveText("Page 1 of 5");
        await expect(rows).toHaveCount(5);
        await expect(page.getByTestId("table-row-1")).toContainText("Mock User 01");
        await expect(prevBtn).toBeDisabled();
        await expect(nextBtn).toBeEnabled();

        for (let p = 2; p <= 5; p++) {
            await nextBtn.click();
            await expect(pageInfo).toHaveText(`Page ${p} of 5`);
        }

        await expect(rows).toHaveCount(3);
        await expect(page.getByTestId("table-row-23")).toContainText("Mock User 23");
        await expect(nextBtn).toBeDisabled();
        await expect(prevBtn).toBeEnabled();
    });

    // Requirement: never show more than 5 rows per page, even if the API ignores pageSize.
    // Currently fails: table.js renders json.data as-is, so all 25 rows appear on every page.
    test("shows at most 5 rows per page when the API ignores pageSize and returns 20+ users at once", async ({ page }) => {
        const users = buildUsers(25); // 25 users / 5 per page -> 5 pages
        await page.route(USERS_API, async (route) => {
            await route.fulfill({ json: { data: users, total: users.length, page: 1, pageSize: 5 } });
        });

        await page.goto(TABLE_URL);

        const rows = page.getByTestId("table-body").locator("tr");
        const pageInfo = page.getByTestId("table-page-info");
        const nextBtn = page.getByTestId("table-next-page");
        const prevBtn = page.getByTestId("table-prev-page");

        await expect(pageInfo).toHaveText("Page 1 of 5");
        await expect(prevBtn).toBeDisabled();
        // Soft so the page-count checks below still run and get reported when this fails.
        await expect.soft(rows).toHaveCount(5);

        for (let p = 2; p <= 5; p++) {
            await nextBtn.click();
            await expect(pageInfo).toHaveText(`Page ${p} of 5`);
            await expect.soft(rows).toHaveCount(5);
        }

        await expect(nextBtn).toBeDisabled();
        await expect(prevBtn).toBeEnabled();
    });
});
