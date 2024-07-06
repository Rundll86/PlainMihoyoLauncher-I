import { minimize, quit, launch, getClientList } from "./contextApi";
import { AnyObject, Colors, ExpandObject, H_E_T_N_M, eleTreeContext } from "./dataStruct";
const gamepanel = getElementById("game-panel");
const controlbar = getElementById("control-bar");
const launchButton = getElementById("launch");
const selectClientButton = getElementById("select-client");
const setupClientButton = getElementById("setup-client");
const loginbar = getElementById("loginbar");
function getElementById(id: string): HTMLElement {
    return document.getElementById(id) as HTMLElement;
};
function eleTree<T extends HTMLElement = HTMLElement>(tag: keyof H_E_T_N_M, childs: eleTreeContext<HTMLElement>[] = []): eleTreeContext<T> {
    let result: ExpandObject<HTMLElement> = document.createElement(tag);
    childs.forEach(e => {
        result.appendChild(e.result);
    });
    return {
        result: result as T,
        classNames(...clsNames: string[]) {
            clsNames.forEach(e => {
                result.classList.add(e);
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
        get outer() {
            return result.outerHTML;
        }
    };
};
function useFaSpan(name: string): string {
    return eleTree("span").classNames("fa", "fa-" + name).outer;
};
namespace labelButtonGroup {
    let _current: AnyObject<number> = {};
    let _content: AnyObject<HTMLButtonElement[]> = {};
    export function create(name: string, options: string[], target: HTMLElement, color: Colors, current: number = 0, circle: boolean = false) {
        _content[name] = [];
        _current[name] = current;
        target.innerHTML = "";
        for (let i in options) {
            let currentA = eleTree<HTMLButtonElement>("button").classNames("label").attr("innerHTML", options[i]);
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
namespace loginBar {
    export const element = getElementById("loginbar");
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
};
launchButton.addEventListener("click", () => launch());
selectClientButton.addEventListener("click", () => {
    getClientList().then(e=>{
        console.log(e);
    });
});