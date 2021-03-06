export declare enum Outcome {
    CTWin = "ct_win",
    TWin = "t_win",
    BombDefused = "bomb_defused",
    BombExploded = "bomb_exploded",
    TimeRanOut = "stopwatch"
}
export interface WeakRoundOutcome {
    outcome?: Outcome;
    score: string;
    tTeam: number;
    ctTeam: number;
}
export interface RoundOutcome extends WeakRoundOutcome {
    outcome: Outcome;
}
