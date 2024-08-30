import {BenchDto, BoardDto, CarouselDto, TftUpdateValue} from "../../../types/TftUpdateEvents";
import {readdirSync} from "node:fs";
import {readFileSync} from "fs";
import EventEmitter from "events";

export interface State {
  board?: BoardDto;
  bench?: BenchDto;
  augments?: object;
  carousel?: CarouselDto;
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
  name: string;
  items: {
    item1?: string;
    item2?: string;
    item3?: string;
  }
  level: number;
}
type TftValue = Unit[]

export class TftService extends EventEmitter {
  static: {
    augments: TftStaticEntry;
    champions: TftStaticEntry;
    charms: TftStaticEntry;
    items: TftStaticEntry;
    traits: TftStaticEntry;
  }

  readonly state: State;

  constructor(private readonly tftData: TftStaticData) {
    super();
    this.static = tftData
    this.state = {};
  }

  public set(key: keyof State, value: TftUpdateValue) {

    this.state[key] = value as any;
  }

  private mapToDomain(key: keyof State, dto: TftUpdateValue): TftValue {
    const data = dto[keyToInnerKey(key)];
    let tftValue: TftValue = [];
    for (const value of Object.values(data as BenchDto)) {
      tftValue.push({
        items: {
          item1: value.item1,
        }, level: 0, name: ""
      })

    }
    return tftValue;

  }

  public printStateIfUpdated(initialState: State) {
    if (JSON.stringify(initialState) !== JSON.stringify(this.state)) {
      this.log('state updated', this.state)
    }
  }

  public printState() {
    console.log(this.state)
    this.log('state updated', this.state)

  }

  private log(message: string, ...args: any[]) {
    try {
      this.emit('log', message, ...args);
    } catch {
    }
  }
}

function keyToInnerKey(key: keyof State): string {
  switch (key) {
    case "board":
      return "board_pieces";
    case "bench":
      return 'bench_pieces';
    case "augments":
      return 'augments';
    case "carousel":
      return 'carousel_pieces';
  }
}