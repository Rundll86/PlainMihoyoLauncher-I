import { ClientType } from "../../common/dataStruct";
import { minimize, quit, launch, getClientList, reload, devtool, getSettings, selectFile, createClient } from "./contextApi";
import { AnyObject, Colors, ExpandObject, H_E_T_N_M, eleTreeContext } from "./dataStruct";
const gamepanel = getElementById("game-panel");
const controlbar = getElementById("control-bar");
const launchButton = getElementById("launch");
const selectClientButton = getElementById("select-client");
const setupClientButton = getElementById("setup-client");
const clientMenu = getElementById("client-menu");
const clientList = getElementById("client-list");
const importClientButton = getElementById("import-client");
const loadClientButton = getElementById("load-client");
function getElementById(id: string): HTMLElement {
    return document.getElementById(id) as HTMLElement;
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
        }
    };
};
function br() { return eleTree("br"); };
function useFaSpan(name: string): string {
    return eleTree("span").classNames("fa", "fa-" + name).outer;
};
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
};
namespace titleBar {
    export const titleSpan = getElementById("title");
    export const menuListSpan = getElementById("menu-list");
    export const titlePushSpan = getElementById("title-push");
    export const returnBtn = getElementById("return-btn");
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
labelButtonGroup.create("menulist", ["[L] 启动", "[I] 安装", "[S] 设置", "[M] 更多"], titleBar.menuListSpan, Colors.WHITE);
labelButtonGroup.create("controlbar", [
    useFaSpan("circle-o"),
    useFaSpan("close")
], controlbar, Colors.WHITE, -1);
labelButtonGroup.getElement("controlbar", 0).addEventListener("click", () => { minimize(); labelButtonGroup.state("controlbar"); });
labelButtonGroup.getElement("controlbar", 1).addEventListener("click", () => { quit(); labelButtonGroup.state("controlbar"); });
launchButton.addEventListener("click", () => launch());
selectClientButton.addEventListener("click", () => {
    getSettings().then(settings => getClientList().then(e => {
        loginBar.launchMenu.addEventListener("transitionend", () => {
            loginBar.small();
        }, { once: true });
        loginBar.launchMenu.style.transform = "scale(90%)";
        loginBar.launchMenu.style.opacity = "0";
        titleBar.titlePushSpan.style.marginLeft = "30px";
        titleBar.titlePushSpan.style.opacity = "0";
        titleBar.returnBtn.style.marginLeft = "10px";
        titleBar.returnBtn.style.opacity = "1";
        clientMenu.style.left = "0";
        clientMenu.style.opacity = "1";
        clientList.innerHTML = "";
        e.forEach(e => {
            e.type === ClientType.StarRail ? clientList.appendChild(eleTree("span").classNames(
                "option",
                settings.game.sr.currentClient === e.name ? "selected" : ""
            ).attr("innerText", e.name).child(
                [
                    br().result,
                    eleTree("span").classNames("gray", "small").attr("innerText", e.path).result
                ]
            ).result) : null;
        });
    }));
});
importClientButton.addEventListener("click", () => modal(
    "提示",
    "接下来请找到你的游戏客户端目录，选择其中的一个文件名类似StarRail的可执行文件",
    [
        eleTree("button").attr("innerText", "了解").listener("click", () => selectFile([
            { name: "可执行文件", extensions: ["exe"] }
        ]).then(e => {
            let inputAAABBBCCC = eleTree("input").attr("placeholder", "取个名字...").classNames("wide").attr("key","abcdefg");
            modal("导入客户端", eleTree("div", [
                eleTree("span").attr("innerText", "很好，这个客户端将会被转换为一个PML自定义客户端。当然，不影响使用官方启动器启动。"),
                br(),
                inputAAABBBCCC
            ]).outer, [
                eleTree("button").listener(
                    "click",
                    () => createClient(e, inputAAABBBCCC.result.value, ClientType.StarRail).then(() => console.log(inputAAABBBCCC))
                ).attr("innerText", "确定")
            ])
        }))
    ]
));
loadClientButton.addEventListener("click", () => modal(
    "提示",
    "接下来请找到你的游戏客户端目录，选择其中的一个文件名类似pm-client的json文件",
    [
        eleTree("button").attr("innerText", "了解").listener("click", () => selectFile([
            { name: "客户端配置文件", extensions: ["json"] }
        ]))
    ]
));
titleBar.returnBtn.addEventListener("click", () => {
    loginBar.element.addEventListener("transitionend", () => {
        loginBar.launchMenu.style.transform = "scale(100%)";
        loginBar.launchMenu.style.opacity = "1";
    }, { once: true });
    loginBar.big();
    titleBar.titlePushSpan.style.marginLeft = "0";
    titleBar.titlePushSpan.style.opacity = "1";
    titleBar.returnBtn.style.marginLeft = "-25px";
    titleBar.returnBtn.style.opacity = "0";
    clientMenu.style.left = "-100%";
    clientMenu.style.opacity = "0";
});
window.addEventListener("keydown", e => {
    if (e.key === "F5") {
        reload();
    } else if (e.key === "F12") {
        devtool();
    };
});