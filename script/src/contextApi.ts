import { ClientInfo } from "../../common/dataStruct";
export declare function quit(): void;
export declare function minimize(): void;
export declare function launch(): void;
export declare function randomInt(min: number, max: number): void;
export declare function randomString(length: number, sets?:string): void;
export declare function getClientList(): Promise<ClientInfo[]>;