import {readdirSync} from "node:fs";
import {readFileSync} from "fs";
import {staticDataDir, TftStaticEntry} from "./tft.service";

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
        })
    }
}