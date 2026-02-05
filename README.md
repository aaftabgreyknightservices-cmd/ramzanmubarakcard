
# 🌙 Noor Card - Antigravity Launch Manual

Welcome to the Mission Control for **Noor Card**. This 3D Ramzan Experience is fully configured to run on **Google Project IDX**.

## 🛸 How to Launch in Project IDX

Since Project IDX is cloud-based, you can bring this project there easily:

1.  **Download:** Click the **Download** button in your current editor to save the project files.
2.  **Unzip:** Extract the files on your computer.
3.  **Upload to GitHub:**
    *   Create a new repository on GitHub.
    *   Push these files to that repository.
4.  **Import to IDX:**
    *   Go to [idx.google.com](https://idx.google.com).
    *   Select **"Import a repo"**.
    *   Choose your new repository.

**What happens next?**
The `.idx/dev.nix` file included in this project will trigger an automatic setup:
*   It installs **Node.js v20**.
*   It runs `npm install` to get all the 3D libraries.
*   It automatically starts the **Android/Web Preview** on the right side of the screen.

## 🚀 Deployment (Firebase Cloud)

Once you are in the IDE and happy with your changes:

1.  Open the **Terminal** in IDX.
2.  Run:
    ```bash
    npm run deploy
    ```
    *(Note: You may need to run `firebase login` first)*

## 🔧 Local Development

If you prefer to run it on your own machine:

1.  `npm install`
2.  `npm run dev`
3.  Open `http://localhost:3000`

**Enjoy your flight!** 🌟
