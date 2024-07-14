const child_process = require("child_process");
const fs = require("fs");
const { PlainMihoyoLauncher } = require("plain-mihoyo-launcher");
PlainMihoyoLauncher.CurrentPlugin.addEvent("onlaunchGame", (e) => {
    if (e.game === "YuanShen") {
        process.chdir("gi");
        fs.writeFileSync("d3dx.ini", fs.readFileSync("d3dx_template.ini").toString().replace("{GamePath}", e.path));
        child_process.spawn("3DMigoto Loader.exe").stdout.on("data", (e) => {
            process.stdout.write(e.toString());
        });
    };
});
PlainMihoyoLauncher.CurrentPlugin.addEvent("onload", () => {
    PlainMihoyoLauncher.CurrentPlugin.requireArray("Mod管理");
});