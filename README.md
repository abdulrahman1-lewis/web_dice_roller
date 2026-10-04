# Web Dice Roller

@author Abdul Rahman

## Description

A static website that simulates rolling five six-sided dice for a Yahtzee-style game. Every
random number is generated on a remote Node.js server (the `dice-roller-api` project) and
retrieved with RESTful API calls. When the page loads it asynchronously "wakes up" the server
and rolls the dice automatically. The Roll Dice button has focus, so pressing Enter rolls again.
The Demonstrate CORS Failure button calls an API that the server intentionally does not open to
other origins, so the browser blocks it and the page reports the failure.

## Technologies

- HTML5
- CSS3
- JavaScript (fetch API)
- Node.js and Express (server, in the `dice-roller-api` project)

## Requirements Implemented

- Hosted on an Azure static website
- Asynchronously calls `GET /api/wake` on page load to wake up the Node.js server
- Calls `GET /api/roll` for all random numbers (no random numbers are created in the browser)
- Demonstrates a CORS failure with `GET /api/cors-failure`
- Automatic first roll on page load, autofocus on the Roll Dice button
- Meaningful field headers, right-justified numbers, read-only result fields

## Project Structure

```
web-dice-roller/
├── index.html
├── style.css
├── script.js
├── README.md
└── LICENSE
```

## Build and run locally

1. Start the server from the `dice-roller-api` project: `npm install`, then `npm start`
   (it listens on http://localhost:3000).
2. In `script.js`, `API_BASE_URL` is `http://localhost:3000` by default.
3. Serve this folder on a different port so the browser treats it as another origin, for example
   `npx serve -l 8000` (or `python -m http.server 8000`).
4. Open http://localhost:8000 in a browser.
5. Click Demonstrate CORS Failure to see the CORS error message.

## Deploy to an Azure static website

1. Deploy the `dice-roller-api` project to an Azure App Service and copy its HTTPS URL.
2. In `script.js`, change `API_BASE_URL` to that URL (no trailing slash).
3. Create an Azure Storage account, enable **Static website**, and set the index document name to
   `index.html`.
4. Upload `index.html`, `style.css`, and `script.js` to the `$web` container.
5. Open the static website's primary endpoint (HTTPS) in a browser.

Azure Static Website URL: []

Azure Node.js server URL: []

## Credits


- Course examples and tutorials by Eric Pogue (https://github.com/EricJPogue/cpsc-example-code).
