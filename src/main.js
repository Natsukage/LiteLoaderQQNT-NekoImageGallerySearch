const fs = require("fs");
const path = require("path");
const { BrowserWindow, ipcMain, shell } = require("electron");

function watchSettingsChange(webContents, settingsPath) {
    fs.watch(settingsPath, "utf-8", debounce(() => {
        updateStyle(webContents, settingsPath);
    }, 100));
}

function openWeb(url) {
    shell.openExternal(url);
}

const pluginDataPath = LiteLoader.plugins["image_search"].path.data;
const settingsPath = path.join(pluginDataPath, "settings.json");

if (!fs.existsSync(pluginDataPath)) {
    fs.mkdirSync(pluginDataPath, { recursive: true });
}

if (!fs.existsSync(settingsPath)) {
    fs.writeFileSync(settingsPath, JSON.stringify({
        "nekoimage_api": "",
        "nekoimage_access_token": "",
        "nekoimage_admin_token": "",
    }));
} else {
    const data = fs.readFileSync(settingsPath, "utf-8");
    const config = JSON.parse(data);
}

ipcMain.on(
    "LiteLoader.imageSearch.watchSettingsChange",
    (event, settingsPath) => {
        const window = BrowserWindow.fromWebContents(event.sender);
        watchSettingsChange(window.webContents, settingsPath);
    });

ipcMain.handle(
    "LiteLoader.imageSearch.getSettings",
    (event, message) => {
        try {
            const data = fs.readFileSync(settingsPath, "utf-8");
            const config = JSON.parse(data);
            return config;
        } catch (error) {
            console.log(error);
            return {};
        }
    }
);

ipcMain.handle(
    "LiteLoader.imageSearch.setSettings",
    (event, content) => {
        try {
            const new_config = JSON.stringify(content);
            fs.writeFileSync(settingsPath, new_config, "utf-8");
        } catch (error) {
            console.log(error);
        }
    }
);

ipcMain.on("LiteLoader.imageSearch.openWeb", (event, ...message) =>
    openWeb(...message)
);

ipcMain.handle(
    "LiteLoader.imageSearch.logToMain",
    (event, ...args) => {
        console.log(...args);
    }
);
