import { HLTVConfig } from './config';
import { MapSlug } from './enums/MapSlug';
import { Map } from './enums/Map';
import { MatchType } from './enums/MatchType';
import { RankingFilter } from './enums/RankingFilter';
import { StreamCategory } from './enums/StreamCategory';
import { ThreadCategory } from './enums/ThreadCategory';
import { ContentFilter } from './enums/ContentFilter';
import { EventSize } from './enums/EventSize';
import { WinType } from './enums/WinType';
export declare class HLTVFactory {
    private readonly config;
    constructor(config: HLTVConfig);
    connectToScorebot: ({ id, onScoreboardUpdate, onLogUpdate, onFullLogUpdate, onConnect, onDisconnect }: import("./endpoints/connectToScorebot").ConnectToScorebotParams) => void;
    getMatch: ({ id }: {
        id: number;
    }) => Promise<import("./models/FullMatch").FullMatch>;
    getMatches: () => Promise<(import("./models/UpcomingMatch").UpcomingMatch | import("./models/LiveMatch").LiveMatch)[]>;
    getMatchesStats: ({ startDate, endDate, matchType, maps }?: {
        startDate?: string | undefined;
        endDate?: string | undefined;
        matchType?: MatchType | undefined;
        maps?: Map[] | undefined;
    }) => Promise<import("./models/MatchStats").MatchStats[]>;
    getMatchStats: ({ id }: {
        id: number;
    }) => Promise<import("./models/FullMatchStats").FullMatchStats>;
    getMatchMapStats: ({ id }: {
        id: number;
    }) => Promise<import("./models/FullMatchMapStats").FullMatchMapStats>;
    getRecentThreads: () => Promise<import("./models/Thread").Thread[]>;
    getResults: ({ startPage, endPage, teamID, eventID, contentFilters }: {
        startPage?: number | undefined;
        endPage?: number | undefined;
        teamID?: number | undefined;
        eventID?: undefined;
        contentFilters?: ContentFilter[] | undefined;
    } | {
        startPage?: undefined;
        endPage?: undefined;
        teamID?: number | undefined;
        eventID?: number | undefined;
        contentFilters?: ContentFilter[] | undefined;
    }) => Promise<import("./models/MatchResult").MatchResult[]>;
    getStreams: ({ loadLinks }?: {
        loadLinks?: boolean | undefined;
    }) => Promise<import("./models/FullStream").FullStream[]>;
    getTeamRanking: ({ year, month, day, country }?: {
        year?: string | undefined;
        month?: string | undefined;
        day?: string | undefined;
        country?: string | undefined;
    }) => Promise<import("./models/TeamRanking").TeamRanking[]>;
    getTeam: ({ id }: {
        id: number;
    }) => Promise<import("./models/FullTeam").FullTeam>;
    getTeamStats: ({ id, currentRosterOnly }: {
        id: number;
        currentRosterOnly?: boolean | undefined;
    }) => Promise<import("./models/FullTeamStats").FullTeamStats>;
    getPlayer: ({ id }: {
        id: number;
    }) => Promise<import("./models/FullPlayer").FullPlayer>;
    getPlayerByName: ({ name }: {
        name: string;
    }) => Promise<import("./models/FullPlayer").FullPlayer>;
    getEvent: ({ id }: {
        id: number;
    }) => Promise<import("./models/FullEvent").FullEvent>;
    getEvents: ({ size, month }?: {
        size?: EventSize | undefined;
        month?: 0 | 1 | 2 | 4 | 3 | 10 | 5 | 9 | 8 | 7 | 6 | 11 | undefined;
    }) => Promise<import("./models/EventResult").EventResult[]>;
    getOngoingEvents: () => Promise<import("./models/OngoingEventResult").OngoingEventResult[]>;
    getPlayerStats: ({ id, startDate, endDate, matchType, rankingFilter }: {
        id: number;
        startDate?: string | undefined;
        endDate?: string | undefined;
        matchType?: MatchType | undefined;
        rankingFilter?: RankingFilter | undefined;
    }) => Promise<import("./models/FullPlayerStats").FullPlayerStats>;
    getPlayerRanking: ({ startDate, endDate, matchType, rankingFilter }: {
        startDate?: string | undefined;
        endDate?: string | undefined;
        matchType?: MatchType | undefined;
        rankingFilter?: RankingFilter | undefined;
    }) => Promise<import("./models/PlayerRanking").PlayerRanking[]>;
    createInstance(config: HLTVConfig): HLTVFactory;
}
declare const hltvInstance: HLTVFactory;
export default hltvInstance;
export { hltvInstance as HLTV, MapSlug, Map, MatchType, RankingFilter, StreamCategory, ThreadCategory, WinType, EventSize, ContentFilter };
