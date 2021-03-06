import { HLTVConfig } from '../config';
import { FullPlayer } from '../models/FullPlayer';
export declare const getPlayerByName: (config: HLTVConfig) => ({ name }: {
    name: string;
}) => Promise<FullPlayer>;
