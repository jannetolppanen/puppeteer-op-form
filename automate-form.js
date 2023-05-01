const puppeteer = require('puppeteer');
require('dotenv').config();




(async () => {
    // Launch a new browser instance
    console.log('Launching browser...')
    const browser = await puppeteer.launch();

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
    await page.screenshot({ path: 'screenshot.png', fullPage: true });

    // Navigate to the form page
    await page.goto('https://example.com/form');

    // Fill out the form
    await page.type('#name', 'Your Name');
    await page.type('#email', 'youremail@example.com');
    await page.type('#message', 'Hello, world!');

    // Submit the form
    await Promise.all([
        page.click('#submit-button'),
        page.waitForNavigation()
    ]);

    // Close the browser
    await browser.close();
})();
