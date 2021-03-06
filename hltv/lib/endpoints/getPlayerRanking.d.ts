import { PlayerRanking } from '../models/PlayerRanking';
import { MatchType } from '../enums/MatchType';
import { RankingFilter } from '../enums/RankingFilter';
import { HLTVConfig } from '../config';
export declare const getPlayerRanking: (config: HLTVConfig) => ({ startDate, endDate, matchType, rankingFilter }: {
    startDate?: string | undefined;
    endDate?: string | undefined;
    matchType?: MatchType | undefined;
    rankingFilter?: RankingFilter | undefined;
}) => Promise<PlayerRanking[]>;
