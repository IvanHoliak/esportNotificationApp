import { ScoreboardUpdate } from '../models/ScoreboardUpdate';
import { LogUpdate } from '../models/LogUpdate';
import { HLTVConfig } from '../config';
export declare type ConnectToScorebotParams = {
    id: number;
    onScoreboardUpdate?: (data: ScoreboardUpdate, done: () => void) => any;
    onLogUpdate?: (data: LogUpdate, done: () => void) => any;
    onFullLogUpdate?: (data: unknown, done: () => void) => any;
    onConnect?: () => any;
    onDisconnect?: () => any;
};
export declare const connectToScorebot: (config: HLTVConfig) => ({ id, onScoreboardUpdate, onLogUpdate, onFullLogUpdate, onConnect, onDisconnect }: ConnectToScorebotParams) => void;
