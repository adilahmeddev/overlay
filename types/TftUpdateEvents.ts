import {State} from "../src/browser/services/tft.service";

export type TftUpdateFeature = keyof State;

export interface PickedAugmentsDto {
    slot_1: AugmentDto;
    slot_2: AugmentDto;
    slot_3: AugmentDto;
}

export type TftUpdateValue = BoardDto | BenchDto | AugmentsDto | CarouselDto | PickedAugmentsDto

export function isTftUpdateFeature(x: any, y: string): x is TftUpdateFeature {

    return ['bench', 'board', 'carousel', 'augments', 'me', 'picked_augment', 'game_info'].includes(x);
}

export interface Piece {
    name: string;
    level: number;
    item_1: string;
    item_2: string;
    item_3: string;
}


export interface BoardDto {
    cell1: Piece;
    cell2: Piece;
    cell3: Piece;
    cell4: Piece;
    cell5: Piece;
    cell6: Piece;
    cell7: Piece;
    cell8: Piece;
}

export interface BenchDto {
    slot1: Piece;
    slot2: Piece;
    slot3: Piece;
    slot4: Piece;
    slot5: Piece;
    slot6: Piece;
    slot7: Piece;
    slot8: Piece;
}

export type CarouselPiece = Partial<Piece> & { slot1: Piece };

export interface CarouselDto {
    slot1: CarouselPiece;
    slot2: CarouselPiece;
    slot3: CarouselPiece;
    slot4: CarouselPiece;
    slot5: CarouselPiece;
    slot6: CarouselPiece;
    slot7: CarouselPiece;
    slot8: CarouselPiece;
}

export interface AugmentDto {
    name: string
}

export interface AugmentsDto {
    augment_1: AugmentDto;
    augment_2: AugmentDto;
    augment_3: AugmentDto;
}
