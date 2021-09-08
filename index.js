const puppeteer = require("puppeteer");

(async () => {
  const browser = await puppeteer.launch({
    headless: false,
    args: ["--no-sandbox"],
    userDataDir: "/tmp/myChromeSession",
  });
  const page = await browser.newPage();
  await page.goto(
    "https://www.twitch.tv/directory/game/Genshin%20Impact?sort=VIEWER_COUNT_ASC",
    { waitUntil: "networkidle2" }
  );

  //   while (true) {}

  //============NAVIGATE==============
  //   await page.waitForSelector(`div[style="order: 0;"] a`);
  for (let i = 0; i < 1000; i++) {
    console.log("step 1");
    const channel = `div[style="order: ${i};"] a`;
    await page.waitForSelector(channel);
    const link = await page.$(channel); // declare object
    const newPagePromise = new Promise((x) =>
      browser.once("targetcreated", (target) => x(target.page()))
    ); // declare promise
    await link.click({ button: "middle" }); // click middle button, link open in a new tab
    const page2 = await newPagePromise; // declare new tab, now you can work with it
    await page2.waitForTimeout(3000);
    await page2.bringToFront(); // make the tab active

    console.log("step 2");

    await page2.waitForTimeout(6000);
    await page2.evaluate((_) => {
      console.log(document);
      let title = document.querySelector("h2");

      if (title) {
        title = title.textContent.toLowerCase();
        const shouldFollow =
          title.includes("follow") ||
          title.includes("chéo") ||
          title.includes("event") ||
          title.includes("500") ||
          title.includes("primo");

        if (shouldFollow) {
          const button = document.querySelector(
            '[data-test-selector="follow-button"]'
          );
          if (button) {
            console.log("clicked");
            button.click();
          }
        } else {
          console.log("skip");
        }
      }
    });

    console.log("step 3");
    await page2.waitForTimeout(1000);

    console.log("step 4");
    await page2.goto("about:blank");
    await page2.waitForTimeout(1000);
    await page2.close();

    console.log("step 5");
    await page.bringToFront(); // make the tab active
    await page.waitForTimeout(1000);
    if (i % 2 === 0) {
      await page.evaluate((_) => {
        window.scrollBy(0, i * 100);
      });
    }
    await page.waitForTimeout(i + 100);
  }

  await browser.close();
})();
