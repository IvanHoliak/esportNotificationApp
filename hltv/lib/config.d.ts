/// <reference types="node" />
import { Agent as HttpsAgent } from 'https';
import { Agent as HttpAgent } from 'http';
export interface HLTVConfig {
    hltvUrl?: string;
    hltvStaticUrl?: string;
    loadPage?: (url: string) => Promise<string>;
    httpAgent?: HttpsAgent | HttpAgent;
}
export declare const defaultConfig: HLTVConfig;
