import {test, expect} from "@playwright/test";

test("API test", async ({request}) => {
    const response = await request.get("http://localhost:3001/api/users");
    console.log(response);
    expect(response.ok()).toBeTruthy();

    const responseBody = await response.json();
    const firstName = responseBody.data[0].name;
    console.log(firstName);
})


test("Mock API response", async ({page}) => {
    //Mock response from http://localhost:3001/api/users
    const serviceUnavailable = {
        error: "Service unavailable",
        message: "The service is down... Please wait or try again!"
    };

    await page.route("http://localhost:3001/api/users**", async (route) => {
        await route.fulfill({status: 503, json: serviceUnavailable });
    });

    await page.goto("http://localhost:3001/");
    await page.getByTestId("home-card-table").click();

    await expect(page.getByText("The service is down... Please wait or try again!")).toBeVisible();
})