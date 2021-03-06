import { FullPlayerStats } from '../models/FullPlayerStats';
import { HLTVConfig } from '../config';
import { MatchType } from '../enums/MatchType';
import { RankingFilter } from '../enums/RankingFilter';
export declare const getPlayerStats: (config: HLTVConfig) => ({ id, startDate, endDate, matchType, rankingFilter }: {
    id: number;
    startDate?: string | undefined;
    endDate?: string | undefined;
    matchType?: MatchType | undefined;
    rankingFilter?: RankingFilter | undefined;
}) => Promise<FullPlayerStats>;
