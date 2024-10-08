import {
    AugmentsDto,
    BenchDto,
    BoardDto,
    PickedAugmentsDto,
    Piece,
    TftUpdateValue
} from "../../../types/TftUpdateEvents";
import EventEmitter from "events";
import {TftStaticData} from "./tftStaticData";

export class State {
    board?: Board;
    bench?: Bench;
    augments?: string[];
    picked_augment?: string[];
    carousel?: Unit[];

    constructor(
        board?: Board,
        bench?: Bench,
        augments?: string[],
        picked_augment?: string[],
        carousel?: Unit[],
    ) {
        this.board = board;
        this.bench = bench;
        this.augments = augments;
        this.picked_augment = picked_augment;
        this.carousel = carousel;
    }

    public toJson() {
        return {
            board: this.board?.map(it => JSON.stringify(it)),
            bench: this.bench?.map(it => JSON.stringify(it)),
            augments: this.augments?.map(it => JSON.stringify(it)),
            picked_augment: this.picked_augment?.map(it => JSON.stringify(it)),
            carousel: this.carousel?.map(it => JSON.stringify(it)),
        }
    }

    public equals(state: State): boolean {
        return arrayEqual(this.board, state.board) &&
            arrayEqual(this.bench, state.bench) &&
            arrayEqual(this.augments, state.augments) &&
            arrayEqual(this.picked_augment, state.picked_augment) &&
            arrayEqual(this.carousel, state.carousel);

    }

}

export function arrayEqual(a?: any[], b?: any[]): boolean {
   return JSON.stringify(a) === JSON.stringify(b);
}

export const staticDataDir = './src/static';

export type TftStaticEntry = object

type Unit = {
    id: string;
    name: string;
    items: {
        item1?: string;
        item2?: string;
        item3?: string;
    }
    icon: string;
    level: number;

}
type TftValue = Board | Bench | string[]
export type Bench = Unit[]
export type Board = Unit[]

export class TftService extends EventEmitter {
    readonly state: State;

    constructor(private readonly staticData: TftStaticData) {
        super();
        this.state = new State();
    }

    public set(key: keyof State, value: TftUpdateValue) {
        let mapped = this.mapToDomain(key, value) as any;
        this.state[key] = mapped;
        console.log('state mapped', mapped);
        this.log('state-update', mapped);
    }

    private mapToDomain(key: keyof State, dto: TftUpdateValue): TftValue {
        let tftValue: TftValue = [];
        if (key === 'bench' || key === 'board') {
            return this.mapBoardOrBench(dto as BenchDto | BoardDto)
        }
        if (key === 'augments') {
            return this.mapAugments(dto as AugmentsDto)
        }
        if (key === 'picked_augment') {
            const pickedAugments = dto as PickedAugmentsDto;
            return [pickedAugments.slot_1, pickedAugments.slot_2, pickedAugments.slot_3].filter(it => !!it && it.name !== "").map(it => it.name);
        }
        return tftValue;
    }


    public printStateIfUpdated(initialState: State) {
        if (!this.state.equals(initialState)) {
            this.log('state updated', this.state)
        }
    }

    public printState() {
        this.log('state updated', this.state)

    }

    private log(message: string, ...args: any[]) {
        try {
            this.emit('log', message, ...args.map(it => JSON.stringify(it)));
        } catch {
        }
    }

    private mapBoardOrBench(dto: BoardDto | BenchDto): Bench | Board {

        return Object.values({...dto}).map((it: Piece) => {
            const champion = this.staticData.champions[it.name] as StaticChampion;
            return {
                name: champion.name,
                icon: champion.image.full,
                level: it.level,
                id: it.name,
                items: [it.item_1, it.item_2, it.item_3].filter(it => !!it && it !== "")
            } as Unit
        })
    }

    private mapAugments(dto: AugmentsDto): any[] {

        return [dto.augment_1, dto.augment_2, dto.augment_3].filter(it => !!it && it.name !== "").map(it => it.name);
    }

    print(...args: any[]) {
        this.log('updating', ...args)
    }
}


export interface StaticChampion {
    id: string;
    name: string;
    tier: number;
    image: {
        full: string;
        sprite: string;
        group: string;
        x: number;
        y: number;
        w: number;
        h: number;
    };
}