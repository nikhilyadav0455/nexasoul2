# Grand Line Ledger

A local One Piece-inspired login experience and crew expense ledger built with Next.js and a standalone HTML, CSS, and JavaScript dashboard.

## Run on Windows

1. Extract the project ZIP.
2. Install Node.js 20.9 or newer if it is not already installed.
3. Double-click `start-local.bat`. On first run it installs packages with `npm ci`, then starts the development server.
4. Open <http://localhost:3000/>. The login page is the entry screen; after the voyage sequence, choose **Open CrewSplit** to open the dashboard.

Stop the server by pressing `Ctrl+C` in the terminal window.

## Run on Other Platforms

From the extracted project folder, run:

```sh
npm ci
npm run dev
```

Open <http://localhost:3000/>. The dashboard is also available at `/index.html`; `/crewsplit.html` redirects there.

## Notes

- The login is a frontend demo flow and does not authenticate against a backend.
- Expense, crew, and settlement data are stored in the current browser's local storage.
- Images and ship videos are bundled under `public/assets`; no external character image URLs are required.