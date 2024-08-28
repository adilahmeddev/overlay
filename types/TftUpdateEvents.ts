export type TftUpdateFeature = 'bench' | 'board' | 'game_info' | 'carousel';
export type TftUpdateValue = Board | Bench | Augment
export function isTftUpdateFeature(x: any): x is TftUpdateFeature {
    return ['bench', 'board', 'game_info', 'carousel'].includes(x)
}

export interface Piece {
    name: string;
    level: number;
    item1: string;
    item2: string;
    item3: string;
}


export interface Board {
    cell1: Piece;
    cell2: Piece;
    cell3: Piece;
    cell4: Piece;
    cell5: Piece;
    cell6: Piece;
    cell7: Piece;
    cell8: Piece;
}
export interface Bench {
    slot1: Piece;
    slot2: Piece;
    slot3: Piece;
    slot4: Piece;
    slot5: Piece;
    slot6: Piece;
    slot7: Piece;
    slot8: Piece;
}
export type Augment = string
