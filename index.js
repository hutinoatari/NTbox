"use strict";
const { BrowserWindow, app } = require("electron");
const path = require("path");

const mainURL = `file://${__dirname}/src/index.html`;
let mainWindow = null;

const createWindow = () => {
    mainWindow = new BrowserWindow({
        width: 640,
        height: 480,
        minWidth: 320,
        minHeight: 240,
        useContentSize: true,
        webPreferences: {
            preload: path.join(__dirname, "./preload.js"),
            contextIsolation: true,
        },
    });
    mainWindow.webContents.openDevTools()
    mainWindow.setMenuBarVisibility(false);
    mainWindow.setMenu(null);
    mainWindow.loadURL(mainURL);
    mainWindow.on("closed", () => mainWindow = null);
}

app.on("ready", () => createWindow());
app.on("window-all-closed", () => app.quit());