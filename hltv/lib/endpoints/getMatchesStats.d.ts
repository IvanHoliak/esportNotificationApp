import { MatchStats } from '../models/MatchStats';
import { MatchType } from '../enums/MatchType';
import { Map } from '../enums/Map';
import { HLTVConfig } from '../config';
export declare const getMatchesStats: (config: HLTVConfig) => ({ startDate, endDate, matchType, maps }?: {
    startDate?: string | undefined;
    endDate?: string | undefined;
    matchType?: MatchType | undefined;
    maps?: Map[] | undefined;
}) => Promise<MatchStats[]>;
