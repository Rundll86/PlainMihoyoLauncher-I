"use strict";
const gamepanel = getElementById("game-panel");
const menulist = getElementById("menu-list");
const controlbar = getElementById("control-bar");
const launchNormal = getElementById("launch-normal");
const launchAdvance = getElementById("launch-advance");
var Colors;
(function (Colors) {
    Colors[Colors["ORANGE"] = 0] = "ORANGE";
    Colors[Colors["WHITE"] = 1] = "WHITE";
})(Colors || (Colors = {}));
;
function getElementById(id) {
    return document.getElementById(id);
}
;
function eleTree(tag, childs = []) {
    let result = document.createElement(tag);
    childs.forEach(e => {
        result.appendChild(e.result);
    });
    return {
        result: result,
        classNames(...clsNames) {
            clsNames.forEach(e => {
                result.classList.add(e);
            });
            return this;
        },
        attr(name, value) {
            result[name] = value;
            return this;
        },
        css(name, value = null) {
            if (value) {
                result.style[name] = value;
                return this;
            }
            ;
            return result.style[name];
        },
        get outer() {
            return result.outerHTML;
        }
    };
}
;
function useFaSpan(name) {
    return eleTree("span").classNames("fa", "fa-" + name).outer;
}
;
var labelButtonGroup;
(function (labelButtonGroup) {
    let _current = {};
    let _content = {};
    function create(name, options, target, color, current = 0, circle = false) {
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
        }
        ;
        update(name);
    }
    labelButtonGroup.create = create;
    function cancelAll(name) {
        _content[name].forEach(e => {
            e.classList.remove("selected");
        });
    }
    labelButtonGroup.cancelAll = cancelAll;
    ;
    function update(name) {
        cancelAll(name);
        for (let i in _content[name]) {
            if (_current[name] === parseInt(i)) {
                _content[name][i].classList.add("selected");
            }
            ;
        }
        ;
    }
    labelButtonGroup.update = update;
    ;
    function getElement(name, index) {
        return _content[name][index];
    }
    labelButtonGroup.getElement = getElement;
    ;
    function getElementArray(name) {
        return _content[name];
    }
    labelButtonGroup.getElementArray = getElementArray;
    ;
    function state(name, status = -1) {
        _current[name] = status;
        update(name);
    }
    labelButtonGroup.state = state;
    ;
})(labelButtonGroup || (labelButtonGroup = {}));
;
labelButtonGroup.create("gamepanel", ["[G] 原神", "[SR] 崩坏：星穹铁道", "[Z] 绝区零"], gamepanel, Colors.ORANGE);
labelButtonGroup.create("menulist", ["[L] 启动", "[I] 安装", "[S] 设置", "[M] 更多"], menulist, Colors.WHITE);
labelButtonGroup.create("controlbar", [
    useFaSpan("circle-o"),
    useFaSpan("close")
], controlbar, Colors.WHITE, -1);
labelButtonGroup.getElement("controlbar", 0).addEventListener("click", () => minimize());
labelButtonGroup.getElement("controlbar", 1).addEventListener("click", () => quit());
launchNormal.addEventListener("click", () => launch());
