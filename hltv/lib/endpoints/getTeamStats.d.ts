import { FullTeamStats } from '../models/FullTeamStats';
import { HLTVConfig } from '../config';
export declare const getTeamStats: (config: HLTVConfig) => ({ id, currentRosterOnly }: {
    id: number;
    currentRosterOnly?: boolean | undefined;
}) => Promise<FullTeamStats>;
