import { Player } from './Player';
import { Team } from './Team';
import { Event } from './Event';
export interface Result {
    readonly matchID?: number;
    readonly enemyTeam: Team;
    readonly result: string;
}
export interface Achievement {
    readonly event: Event;
    readonly place: string;
}
export interface FullTeam {
    readonly id: number;
    readonly name: string;
    readonly players: Player[];
    readonly logo: string;
    readonly coverImage?: string;
    readonly location: string;
    readonly facebook?: string;
    readonly twitter?: string;
    readonly rank?: number;
    readonly recentResults: Result[];
    readonly rankingDevelopment: number[];
    readonly bigAchievements: Achievement[];
    readonly events: Event[];
}
