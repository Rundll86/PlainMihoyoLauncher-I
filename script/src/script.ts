import { ClientType, SettingType } from "../../common/dataStruct";
import { minimize, quit, launch, getClientList, reload, devtool, getSettings, selectFile, createClient, selectFolder, loadClient, saveSettings } from "./contextApi";
import { AnyObject, Colors, ExpandObject, G_E_H_E_M, H_E_T_N_M, eleTreeContext } from "./dataStruct";
const gamepanel = getElementById("game-panel");
const controlbar = getElementById("control-bar");
const launchButton = getElementById("launch");
const selectClientButton = getElementById("select-client");
const setupClientButton = getElementById("setup-client");
const clientMenu = getElementById("client-menu");
const clientList = getElementById("client-list");
const clientSetup = getElementById("client-setup");
const importClientButton = getElementById("import-client");
const loadClientButton = getElementById("load-client");
const clientNameSpan = getElementById("client-name-label");
var currentGame = ClientType.GenshinImpact;
var settings: SettingType = {
    game: {
        YuanShen: {
            currentClient: "",
            label: "原神"
        },
        StarRail: {
            currentClient: "",
            label: "星穹铁道"
        },
        ZenlessZoneZero: {
            currentClient: "",
            label: "绝区零"
        }
    },
    launcher: {
        devTool: false
    }
};
getSettings().then(e => {
    settings = e;
    reloadClientNameSpan();
});
function getElementById<T extends HTMLElement = HTMLElement>(id: string): T {
    return document.getElementById(id) as T;
};
function eleTree<T extends keyof H_E_T_N_M>(tag: T & string, childs: eleTreeContext<HTMLElement>[] = []): eleTreeContext<H_E_T_N_M[T]> {
    let result: ExpandObject<HTMLElement> = document.createElement(tag);
    childs.forEach(e => {
        result.appendChild(e.result);
    });
    return {
        result: result as H_E_T_N_M[T],
        classNames(...clsNames: string[]) {
            clsNames.forEach(e => {
                e === "" ? null : result.classList.add(e);
            });
            return this;
        },
        attr(name: string, value: any) {
            result[name] = value;
            return this;
        },
        css(name: string, value: string | null = null) {
            if (value) {
                (result.style as ExpandObject<CSSStyleDeclaration>)[name] = value;
                return this;
            };
            return (result.style as ExpandObject<CSSStyleDeclaration>)[name];
        },
        child(childs) {
            childs.forEach(e => {
                result.appendChild(e);
            });
            return this;
        },
        listener(name, value) {
            result.addEventListener(name, value);
            return this;
        },
        get outer() {
            return result.outerHTML;
        },
    };
};
function br() { return eleTree("br"); };
function useFaSpan(name: string): string {
    return eleTree("span").classNames("fa", "fa-" + name).outer;
};
function useCharacterEntity(name: string): string {
    return `&${name};`;
}
function modal(title: string, content: string, buttons: eleTreeContext<HTMLButtonElement>[] = []) {
    function closeModal() {
        modalElement.style.opacity = "0";
        containerElement.result.style.marginTop = "50px";
        containerElement.listener("transitionend", () => {
            modalElement.remove();
        });
    };
    buttons.forEach(e => {
        e.listener("click", () => closeModal());
        e.classNames("padding-small");
    });
    let containerElement = eleTree("div", [
        eleTree("span").classNames("title").attr("innerText", title),
        eleTree("div").attr("innerHTML", content).classNames("content"),
        eleTree("div", [
            ...buttons,
            eleTree("button").attr("innerText", "取消").listener("click", () => closeModal()).classNames("padding-small")
        ]).classNames("buttons")
    ]).classNames("container");
    let modalElement = eleTree("div", [containerElement]).classNames("modal").result;
    document.body.appendChild(modalElement);
    requestAnimationFrame(() => {
        modalElement.style.opacity = "1";
        containerElement.result.style.marginTop = "unset";
    });
    return {
        close: closeModal
    };
};
function reloadAllClientOption() {
    document.querySelectorAll("span.option.client-option").forEach(e => {
        if (e.querySelector(".name")?.innerHTML === settings.game[currentGame].currentClient) {
            e.classList.add("selected");
        } else {
            e.classList.remove("selected");
        };
    });
};
function reloadClientNameSpan() {
    clientNameSpan.innerText = settings.game[currentGame].currentClient;
};
function createClientElement(name: string, path: string, game: ClientType) {
    let { result } = eleTree("span").classNames(
        "option",
        "client-option"
    ).child([
        eleTree("span").attr("innerText", name).classNames("name", "color-inherit").result
    ]).child([
        eleTree("span").classNames("label").attr("innerText", settings.game[game as ClientType].label).result
    ]).child([
        br().result,
        eleTree("span").classNames("gray", "small").attr("innerText", path).result
    ]).css("opacity", "0").css("marginLeft", "-100px").listener("click", () => {
        settings.game[currentGame].currentClient = name;
        saveSettings(settings);
        reloadAllClientOption();
    });
    clientList.appendChild(result);
    reloadAllClientOption();
    setTimeout(() => {
        result.style.opacity = "1";
        result.style.marginLeft = "0";
    }, 100);
    return new Promise<void>((resolve) => {
        setTimeout(() => resolve(), 100);
    });
};
function createClientElementQuery(query: { name: string, path: string, type: ClientType }[], index: number) {
    if (index >= query.length) return;
    createClientElement(query[index].name, query[index].path, query[index].type).then(() => createClientElementQuery(query, index + 1));
};
namespace loginBar {
    export const element = getElementById("loginbar");
    export const launchMenu = getElementById("launch-menu");
    export function big() {
        element.classList.remove("small");
        element.classList.add("big");
    };
    export function small() {
        element.classList.remove("big");
        element.classList.add("small");
    };
    export function hide() {
        launchMenu.addEventListener("transitionend", () => {
            small();
        }, { once: true });
        launchMenu.style.transform = "scale(90%)";
        launchMenu.style.opacity = "0";
    };
    export function show() {
        element.addEventListener("transitionend", () => {
            launchMenu.style.transform = "scale(100%)";
            launchMenu.style.opacity = "1";
        }, { once: true });
        big();
    };
};
namespace titleBar {
    export const titleSpan = getElementById("title");
    export const menuListSpan = getElementById("menu-list");
    export const titlePushSpan = getElementById("title-push");
    export const returnBtn = getElementById("return-btn");
    export function show() {
        titlePushSpan.style.marginLeft = "0px";
        titlePushSpan.style.opacity = "1";
        returnBtn.style.marginLeft = "-25px";
        returnBtn.style.opacity = "0";
    };
    export function hide() {
        titlePushSpan.style.marginLeft = "30px";
        titlePushSpan.style.opacity = "0";
        returnBtn.style.marginLeft = "10px";
        returnBtn.style.opacity = "1";
    };
};
namespace clientListMenu {
    export function open(arg: Parameters<typeof createClientElementQuery>[0]) {
        clientMenu.style.left = "0";
        clientMenu.style.opacity = "1";
        clientList.innerHTML = "";
        createClientElementQuery(arg, 0);
    };
    export function close() {
        clientMenu.style.left = "-100%";
        clientMenu.style.opacity = "0";
        clientList.innerHTML = "";
    };
};
namespace clientSetupMenu {
    let _current = -1;
    let _list: string[] = [];
    let _listeners: Function[] = [];
    export const clientSetupList = getElementById("client-setup-list");
    export function open() {
        clientSetup.style.left = "0";
        clientSetup.style.opacity = "1";
    };
    export function close() {
        clientSetup.style.left = "-100%";
        clientSetup.style.opacity = "0";
    };
    export function update() {
        _list.forEach(e => {
            if (_list[_current] === e) {
                _listeners[_current]();
                getElementById(e).classList.add("selected");
                getElementById(e + "-panel").classList.add("selected");
            } else {
                getElementById(e).classList.remove("selected");
                getElementById(e + "-panel").classList.remove("selected");
            };
        });
    };
    export function create(name: string, label: string) {
        let { result } = eleTree("span")
            .classNames("option")
            .attr("id", name)
            .attr("innerHTML", label)
            .listener("click", (e) => {
                _current = _list.indexOf(name);
                update();
            });
        let index = _list.length;
        _list.push(name);
        _listeners.push(() => { });
        clientSetupList.appendChild(result);
        update();
        return (listener: () => void) => {
            _listeners[index] = listener;
        };
    };
    export function current(index: number = -1) {
        _current = index;
        update();
    };
};
namespace labelButtonGroup {
    let _current: AnyObject<number> = {};
    let _content: AnyObject<HTMLButtonElement[]> = {};
    export function create(name: string, options: string[], target: HTMLElement, color: Colors, current: number = 0, circle: boolean = false) {
        _content[name] = [];
        _current[name] = current;
        target.innerHTML = "";
        for (let i in options) {
            let currentA = eleTree("button").classNames("label").attr("innerHTML", options[i]);
            color === Colors.WHITE ? currentA.classNames("white") : null;
            circle ? currentA.classNames("circle") : null;
            let current = currentA.result;
            current.addEventListener("click", () => {
                _current[name] = parseInt(i);
                update(name);
            });
            target.appendChild(current);
            _content[name].push(current);
        };
        update(name);
    }
    export function cancelAll(name: string) {
        _content[name].forEach(e => {
            e.classList.remove("selected");
        });
    };
    export function update(name: string) {
        cancelAll(name);
        for (let i in _content[name]) {
            if (_current[name] === parseInt(i)) {
                _content[name][i].classList.add("selected");
            };
        };
    };
    export function getElement(name: string, index: number): HTMLButtonElement {
        return _content[name][index];
    };
    export function getElementArray(name: string): HTMLButtonElement[] {
        return _content[name];
    };
    export function state(name: string, status: number = -1) {
        _current[name] = status;
        update(name);
    };
};
labelButtonGroup.create("gamepanel", ["[G] 原神", "[SR] 崩坏：星穹铁道", "[Z] 绝区零"], gamepanel, Colors.ORANGE);
for (let i in Object.keys(ClientType)) {
    labelButtonGroup.getElement("gamepanel", parseInt(i)).addEventListener("click", () => {
        currentGame = Object.values(ClientType)[i];
    });
};
labelButtonGroup.getElementArray("gamepanel").forEach(e => {
    e.addEventListener("click", () => reloadClientNameSpan());
});
labelButtonGroup.create("menulist", ["[L] 启动", "[I] 安装", "[S] 设置", "[M] 更多"], titleBar.menuListSpan, Colors.WHITE);
labelButtonGroup.create("controlbar", [
    useFaSpan("circle-o"),
    useFaSpan("close")
], controlbar, Colors.WHITE, -1);
labelButtonGroup.getElement("controlbar", 0).addEventListener("click", () => { minimize(); labelButtonGroup.state("controlbar"); });
labelButtonGroup.getElement("controlbar", 1).addEventListener("click", () => { quit(); labelButtonGroup.state("controlbar"); });
clientSetupMenu.create("client-info", useFaSpan("cube") + useCharacterEntity("nbsp") + "概览")(() => {
    getClientList().then(e => {
        e.forEach(e => {
            if (e.name === settings.game[currentGame].currentClient) {
                let currentClient = e;
                getElementById<HTMLImageElement>("client-avatar").src = `./img/game/${currentClient.type}.ico`;
                getElementById("client-info-name").innerText = currentClient.name;
                getElementById("client-info-description").innerText = settings.game[currentClient.type].label;
            };
        });
    });
});
clientSetupMenu.create("client-setting", useFaSpan("wrench") + useCharacterEntity("nbsp") + "设置");
launchButton.addEventListener("click", () => launch(currentGame));
selectClientButton.addEventListener("click", () => {
    getClientList().then(e => {
        loginBar.hide();
        titleBar.hide();
        clientListMenu.open(e);
    });
});
setupClientButton.addEventListener("click", () => {
    loginBar.hide();
    titleBar.hide();
    clientSetupMenu.open();
    clientSetupMenu.current(0);
});
importClientButton.addEventListener("click", () => modal(
    "提示",
    `接下来请找到你的游戏客户端目录，选择其中的一个文件名类似${currentGame}的可执行文件`,
    [
        eleTree("button").attr("innerText", "了解").listener("click", () => selectFile([
            { name: "可执行文件", extensions: ["exe"] }
        ]).then(e => {
            if (!e) { return; };
            let input = eleTree("input").attr("placeholder", "取个名字...").classNames("wide").attr("id", "client-name");
            modal("导入客户端", eleTree("div", [
                eleTree("span").attr("innerText", "很好，这个客户端将会被转换为一个PML自定义客户端。当然，不影响使用官方启动器启动"),
                br(),
                input
            ]).outer, [
                eleTree("button").listener(
                    "click",
                    () => {
                        let input = getElementById<HTMLInputElement>("client-name");
                        console.log(e, input.value, currentGame);
                        createClient(e, input.value, currentGame).then((e) => {
                            if (e.status) {
                                createClientElement(input.value, e.message, currentGame);
                            } else {
                                modal("失败", e.message);
                            };
                        });
                    }
                ).attr("innerText", "确定")
            ])
        }))
    ]
));
loadClientButton.addEventListener("click", () => modal(
    "提示",
    "接下来请找到你的自定义客户端的目录。其应包含一个名为.pml-client的文件夹。",
    [
        eleTree("button").attr("innerText", "了解").listener("click", () => selectFolder().then(e => {
            if (!e) { return; };
            loadClient(e, currentGame).then(e => {
                if (e.status) {
                    createClientElement(e.message.name, e.message.path, e.message.type);
                } else {
                    modal("失败", e.message);
                };
            });
        }))
    ]
));
titleBar.returnBtn.addEventListener("click", () => {
    reloadClientNameSpan();
    loginBar.show();
    titleBar.show();
    clientListMenu.close();
    clientSetupMenu.close();
    clientSetupMenu.current();
});
window.addEventListener("keydown", e => {
    if (e.key === "F5") {
        reload();
    } else if (e.key === "F12") {
        devtool();
    };
});