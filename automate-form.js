const puppeteer = require('puppeteer');
const { readCsvFile } = require('./readCsvFile.js')
const readline = require('readline');
require('dotenv').config();

(async () => {

    // Read data from csv
    const data = await readCsvFile('./data.csv')

    // Prompt user to check the data before continuing
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    })

    const answer = await new Promise((resolve) => {
        console.log(data)
        rl.question('Check the data. Enter to continue, "exit" to quit.', (answer) => {
            resolve(answer);
        });
    });

    if (answer === 'exit') {
        console.log('Exiting...');
        process.exit(0);
    } else {
        console.log('Continuing...');
    }

    // Launch a new browser instance
    console.log('Launching browser...')
    const browser = await puppeteer.launch({
        headless: false,
        slowMo: 35
    });

    // Create a new page
    const page = await browser.newPage();

    // Change resolution
    await page.setViewport({ width: 1920, height: 1080 });

    // Start loop to iterate through days
    for (const row of data) {

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

            await Promise.all([
                page.click('#sign_in_form > button'),
                page.waitForNavigation()])
            console.log('Signed in')
        } else {
            console.log('We didnt get to the login page')
        }

        console.log('Inputting data...')

        // Clear the form fields before typing into them
        await page.$eval('#daily_allowance_row_description', field => field.value = '');
        await page.$eval('#daily_allowance_row_trip_start_date', field => field.value = '');
        await page.$eval('#daily_allowance_row_trip_end_date', field => field.value = '');
        await page.$eval('#daily_allowance_row_trip_start_time', field => field.value = '');
        await page.$eval('#daily_allowance_row_trip_end_time', field => field.value = '');

        // Fill out the form
        await page.type('#daily_allowance_row_description', row.Reitti);
        await page.type('#daily_allowance_row_trip_start_date', row.Pvm);
        await page.type('#daily_allowance_row_trip_end_date', row.Pvm);
        await page.type('#daily_allowance_row_trip_start_time', row.KloAloitus);
        await page.type('#daily_allowance_row_trip_end_time', row.KloLopetus);

        // Submit the form
        await Promise.all([
            page.click('#daily_allowance_form > div.flexrow.justify--end > button'),
            page.waitForNavigation()
        ]);

        console.log('Submitted row');
    }
    console.log('All the data submitted')

    // Close the browser
    await browser.close();
    rl.close()
})();
