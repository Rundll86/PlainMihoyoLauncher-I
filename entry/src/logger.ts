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
};
export namespace logger {
    let _logs: Log[] = [];
    export function append(message: messageType, type: LogType) {
        _logs.push({ type, message });
        consoleMapper[type].call(console, `${front(type)} ${message}`);
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
};