import { HLTVConfig } from '../config';
import { EventResult } from '../models/EventResult';
import { EventSize } from '../enums/EventSize';
export declare const getEvents: (config: HLTVConfig) => ({ size, month }?: {
    size?: EventSize | undefined;
    month?: 0 | 1 | 2 | 4 | 3 | 10 | 5 | 9 | 8 | 7 | 6 | 11 | undefined;
}) => Promise<EventResult[]>;
