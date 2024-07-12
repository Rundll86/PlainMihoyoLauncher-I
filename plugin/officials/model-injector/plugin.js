const child_process = require("child_process");
const { PlainMihoyoLauncher } = require("plain-mihoyo-launcher");
var ModelInjector = new PlainMihoyoLauncher.Plugin((e) => {
    if (e.game === "GenshinImpact") {
        child_process.spawn("gi/3DMigoto Loader.exe");
    };
});
ModelInjector.author = "FallingShrimp";
ModelInjector.description = "注入自定义模型到游戏客户端。";
ModelInjector.displayName = "Model Injector";
ModelInjector.id = "model-injector";
ModelInjector.version = "1.0.0";
PlainMihoyoLauncher.Plugins.register(ModelInjector);