import {BenchDto, BoardDto, CarouselDto, Piece, TftUpdateValue} from "../../../types/TftUpdateEvents";
import {readdirSync} from "node:fs";
import {readFileSync} from "fs";
import EventEmitter from "events";

export interface State {
    board?: TftValue;
    bench?: TftValue;
    augments?: TftValue;
    carousel?: TftValue;
}

const staticDataDir = './src/static';

type TftStaticEntry = object

export class TftStaticData {
    augments: TftStaticEntry;
    champions: TftStaticEntry;
    charms: TftStaticEntry;
    items: TftStaticEntry;
    traits: TftStaticEntry;

    constructor() {
        readdirSync(staticDataDir).forEach(file => {
            const buffer = readFileSync(`${staticDataDir}/${file}`);
            const data = Object.values(JSON.parse(buffer.toString()).data).reduce((acc, it: any) => {
                const key = it.id as string
                acc[key] = it
                return acc
            }, Object.create({})) as object
            switch (file.split('.')[0]) {
                case 'tft-augments':
                    this.augments = data;
                    break;
                case 'tft-champion':
                    this.champions = data;
                    break;
                case 'tft-charms':
                    this.charms = data;
                    break;
                case 'tft-item':
                    this.items = data;
                    break;
                case 'tft-trait':
                    this.traits = data;
                    break;
                default:
            }
            console.log(this)
        })
    }
}

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
type TftValue = Unit[]
export type Bench = TftValue

export class TftService extends EventEmitter {
    readonly state: State;

    constructor(private readonly staticData: TftStaticData) {
        super();
        this.state = {};
    }

    public set(key: keyof State, value: TftUpdateValue) {
        this.state[key] = this.mapToDomain(key, value);
        this.log('state-update', this.state);
    }

    private mapToDomain(key: keyof State, dto: TftUpdateValue): TftValue {
        let tftValue: TftValue = [];
        if (key === 'bench' || key === 'board') {
            return this.mapBoardOrBench(dto as BenchDto | BoardDto)
        }
        return tftValue;
    }


    public printStateIfUpdated(initialState: State) {
        if (JSON.stringify(initialState) !== JSON.stringify(this.state)) {
            this.log('state updated', this.state)
        }
    }

    public printState() {
        this.log('state updated', this.state)

  }

    private log(message: string, ...args: any[]) {
        try {
            this.emit('log', message, ...args.map(it=>JSON.stringify(it)));
        } catch {
        }
    }

    private mapBoardOrBench(dto: BoardDto | BenchDto): TftValue{
        return Object.values(dto).map((it: Piece) => {
            const champion = this.staticData.champions[it.name] as StaticChampion;
            this.log('unit map', it)
            return {
                name: champion.name,
                icon: champion.image.full,
                level: it.level,
                id: it.name,
                items: [it.item_1, it.item_2, it.item_3].filter(it => !!it && it !== "")
            } as Unit
        })
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