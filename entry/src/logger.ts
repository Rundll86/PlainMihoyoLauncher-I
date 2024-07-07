import process from "process";
interface Log {
    type: LogType,
    message: messageType;
};
type messageType = string & any;
export enum LogType { INFO = "INFO", WARNING = "WARNING", ERROR = "ERROR" };
export const consoleMapper = {
    INFO: console.log,
    WARNING: console.warn,
    ERROR: console.error
};
export namespace logger {
    let _logs: Log[] = [];
    export function append(message: messageType, type: LogType) {
        _logs.push({ type, message });
        draw();
    };
    export function info(message: messageType) {
        append(message, LogType.INFO);
    };
    export function warning(message: messageType) {
        append(message, LogType.WARNING);
    };
    export function error(message: messageType) {
        append(message, LogType.ERROR);
    };
    export function front() {
        let now = new Date();
        return `[${now.getFullYear()}/${now.getMonth() + 1}/${now.getDate()} - ${now.getHours()}:${now.getMinutes()}:${now.getMilliseconds()}]`;
    };
    export function draw(index: number = -1) {
        if (index < 0) {
            //清除控制台内容
            process.stdout.write('\u001b[2J\u001b[0;0H');
            for (let i in _logs) {
                draw(parseInt(i));
            };
        } else {
            let e = _logs[index];
            consoleMapper[e.type].call(console, `${front()} ${e.message}`);
        };
    };
};