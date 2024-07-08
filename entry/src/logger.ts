import process from "process";
import fs from "fs";
import readline from "readline";
interface Log {
    type: LogType,
    message: messageType;
};
type messageType = string;
export enum LogType { INFO = "INFO", WARNING = "WARN", ERROR = "ERRO" };
export const consoleMapper = {
    INFO: console.log,
    WARN: console.warn,
    ERRO: console.error
};
export const colorMapper = {
    INFO: "32",
    WARN: "33",
    ERRO: "31"
}
export namespace logger {
    let _logs: Log[] = [];
    let _stdout = "";
    export function startHandleStdout() {
        process.stdout.on("data", (data) => {
            _stdout += data;
        });
    };
    export function getStdout() {
        return _stdout;
    };
    export function append(message: messageType, type: LogType) {
        _logs.push({ type, message });
        draw();
        fs.writeFileSync("log.txt", getStdout());
    };
    export function info(...message: any[]) {
        append(message.join(" "), LogType.INFO);
    };
    export function warning(...message: any[]) {
        append(message.join(" "), LogType.WARNING);
    };
    export function error(...message: any[]) {
        append(message.join(" "), LogType.ERROR);
    };
    export function front(type: LogType = LogType.INFO) {
        let now = new Date();
        return `[${now.getFullYear()}/${now.getMonth() + 1}/${now.getDate()} - ${now.getHours()}:${now.getMinutes()}:${now.getMilliseconds()} \x1b[${colorMapper[type]}m${type}\x1b[0m]`;
    };
    export function draw(index: number = -1) {
        if (index < 0) {
            readline.cursorTo(process.stdout, 0, 0);
            readline.clearScreenDown(process.stdout);
            for (let i in _logs) {
                draw(parseInt(i));
            };
        } else {
            let e = _logs[index];
            consoleMapper[e.type].call(console, `${front(e.type)} ${e.message}`);
        };
    };
};