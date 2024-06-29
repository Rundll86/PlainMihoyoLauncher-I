const gamepanel: HTMLElement = getElementById("game-panel");
const menulist: HTMLElement = getElementById("menu-list");
const controlbar: HTMLElement = getElementById("control-bar");
const launchNormal = getElementById("launch-normal");
const launchAdvance = getElementById("launch-advance");
declare function quit(): void;
declare function minimize(): void;
declare function launch(): void;
interface H_E_T_N_M {
    "a": HTMLAnchorElement;
    "abbr": HTMLElement;
    "address": HTMLElement;
    "area": HTMLAreaElement;
    "article": HTMLElement;
    "aside": HTMLElement;
    "audio": HTMLAudioElement;
    "b": HTMLElement;
    "base": HTMLBaseElement;
    "bdi": HTMLElement;
    "bdo": HTMLElement;
    "blockquote": HTMLQuoteElement;
    "body": HTMLBodyElement;
    "br": HTMLBRElement;
    "button": HTMLButtonElement;
    "canvas": HTMLCanvasElement;
    "caption": HTMLTableCaptionElement;
    "cite": HTMLElement;
    "code": HTMLElement;
    "col": HTMLTableColElement;
    "colgroup": HTMLTableColElement;
    "data": HTMLDataElement;
    "datalist": HTMLDataListElement;
    "dd": HTMLElement;
    "del": HTMLModElement;
    "details": HTMLDetailsElement;
    "dfn": HTMLElement;
    "dialog": HTMLDialogElement;
    "div": HTMLDivElement;
    "dl": HTMLDListElement;
    "dt": HTMLElement;
    "em": HTMLElement;
    "embed": HTMLEmbedElement;
    "fieldset": HTMLFieldSetElement;
    "figcaption": HTMLElement;
    "figure": HTMLElement;
    "footer": HTMLElement;
    "form": HTMLFormElement;
    "h1": HTMLHeadingElement;
    "h2": HTMLHeadingElement;
    "h3": HTMLHeadingElement;
    "h4": HTMLHeadingElement;
    "h5": HTMLHeadingElement;
    "h6": HTMLHeadingElement;
    "head": HTMLHeadElement;
    "header": HTMLElement;
    "hgroup": HTMLElement;
    "hr": HTMLHRElement;
    "html": HTMLHtmlElement;
    "i": HTMLElement;
    "iframe": HTMLIFrameElement;
    "img": HTMLImageElement;
    "input": HTMLInputElement;
    "ins": HTMLModElement;
    "kbd": HTMLElement;
    "label": HTMLLabelElement;
    "legend": HTMLLegendElement;
    "li": HTMLLIElement;
    "link": HTMLLinkElement;
    "main": HTMLElement;
    "map": HTMLMapElement;
    "mark": HTMLElement;
    "menu": HTMLMenuElement;
    "meta": HTMLMetaElement;
    "meter": HTMLMeterElement;
    "nav": HTMLElement;
    "noscript": HTMLElement;
    "object": HTMLObjectElement;
    "ol": HTMLOListElement;
    "optgroup": HTMLOptGroupElement;
    "option": HTMLOptionElement;
    "output": HTMLOutputElement;
    "p": HTMLParagraphElement;
    "picture": HTMLPictureElement;
    "pre": HTMLPreElement;
    "progress": HTMLProgressElement;
    "q": HTMLQuoteElement;
    "rp": HTMLElement;
    "rt": HTMLElement;
    "ruby": HTMLElement;
    "s": HTMLElement;
    "samp": HTMLElement;
    "script": HTMLScriptElement;
    "search": HTMLElement;
    "section": HTMLElement;
    "select": HTMLSelectElement;
    "slot": HTMLSlotElement;
    "small": HTMLElement;
    "source": HTMLSourceElement;
    "span": HTMLSpanElement;
    "strong": HTMLElement;
    "style": HTMLStyleElement;
    "sub": HTMLElement;
    "summary": HTMLElement;
    "sup": HTMLElement;
    "table": HTMLTableElement;
    "tbody": HTMLTableSectionElement;
    "td": HTMLTableCellElement;
    "template": HTMLTemplateElement;
    "textarea": HTMLTextAreaElement;
    "tfoot": HTMLTableSectionElement;
    "th": HTMLTableCellElement;
    "thead": HTMLTableSectionElement;
    "time": HTMLTimeElement;
    "title": HTMLTitleElement;
    "tr": HTMLTableRowElement;
    "track": HTMLTrackElement;
    "u": HTMLElement;
    "ul": HTMLUListElement;
    "var": HTMLElement;
    "video": HTMLVideoElement;
    "wbr": HTMLElement;
}
enum Colors { ORANGE, WHITE };
type eleTreeContext<T extends HTMLElement> = {
    result: T,
    classNames(...clsNames: string[]): eleTreeContext<T>,
    attr(name: string, value: any): eleTreeContext<T>;
    css(name: string): string;
    css(name: string, value: string): eleTreeContext<T>;
    get outer(): string;
};
type AnyObject<T = any> = { [key: string]: T };
type ExpandObject<T> = T & { [key: string]: any; };
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
labelButtonGroup.create("menulist", ["[L] 启动", "[I] 安装", "[S] 设置", "[M] 更多"], menulist, Colors.WHITE);
labelButtonGroup.create("controlbar", [
    useFaSpan("circle-o"),
    useFaSpan("close")
], controlbar, Colors.WHITE, -1);
labelButtonGroup.getElement("controlbar", 0).addEventListener("click", () => minimize());
labelButtonGroup.getElement("controlbar", 1).addEventListener("click", () => quit());
launchNormal.addEventListener("click", () => launch());