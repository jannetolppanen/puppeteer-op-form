const puppeteer = require('puppeteer');
require('dotenv').config();

const form_description = "test description"
const form_date = '01.06.2023'
const form_startTime = '08'
const form_endTime = '16';

(async () => {
    // Launch a new browser instance
    console.log('Launching browser...')
    const browser = await puppeteer.launch({
        headless: false,
        slowMo: 35
    });

    // Create a new page
    const page = await browser.newPage();

    // Change resolution so screenshots are easier to read
    await page.setViewport({ width: 1920, height: 1080 });

    // Navigate to the login page
    console.log('Navigating to site')
    await page.goto('https://app.op-kevytyrittaja.fi/vahennykset/paivarahat/uusi');


    // Check if we are in the login page
    console.log('Checking if we got into the login page...')
    const usernameField = await page.$('#entrepreneur_email')
    if (usernameField !== null) {
        console.log('Typing login information...')
        await page.type('#entrepreneur_email', process.env.USERNM);
        await page.type('#entrepreneur_password', process.env.PASSWD);
    } else {
        console.log('We didnt get to the login page')
    }

    // Submit the login form
    await Promise.all([
        page.click('#sign_in_form > button'),
        page.waitForNavigation()

    ]);
    console.log('Signed in')


    console.log('Inputting data...')

    // Clear the form fields before typing into them
    await page.$eval('#daily_allowance_row_description', field => field.value = '');
    await page.$eval('#daily_allowance_row_trip_start_date', field => field.value = '');
    await page.$eval('#daily_allowance_row_trip_end_date', field => field.value = '');
    await page.$eval('#daily_allowance_row_trip_start_time', field => field.value = '');
    await page.$eval('#daily_allowance_row_trip_end_time', field => field.value = '');

    // Fill out the form
    await page.type('#daily_allowance_row_description', form_description);
    await page.type('#daily_allowance_row_trip_start_date', form_date);
    await page.type('#daily_allowance_row_trip_end_date', form_date);
    await page.type('#daily_allowance_row_trip_start_time', form_startTime);
    await page.type('#daily_allowance_row_trip_end_time', form_endTime);

    // Submit the form
    await Promise.all([
        page.click('#daily_allowance_form > div.flexrow.justify--end > button'),
        page.waitForNavigation()
    ]);
    console.log('Submitted data')

    // Close the browser
    // await browser.close();
})();
