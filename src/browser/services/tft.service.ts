import EventEmitter from "events";
import {Augment, Bench, Board} from "../../../types/TftUpdateEvents";
import {GameEventsService} from "./gep.service";
export interface State {
    board: Board;
    bench: Bench;
    augments: Augment[];
    players: { name: string }[]
}

export class TftService extends EventEmitter {

    readonly state: {
        board: Board;
        bench: Bench;
        augments: Augment[];
        players: {
            name: string;
        }[]
    }

    constructor(private readonly gepService: GameEventsService) {
        super();
        this.state = {board: {} as Board, bench: {} as Bench, augments: [], players: []};
    }

    public setBench(bench: Bench) {
        this.state.bench = bench;
        this.log('state updated', this.state)

    }
    public printState(){
        console.log(this.state)
        this.log('state updated', this.state)

    }

    public setBoard(board: Board) {
        this.state.board = board;
        this.log('state updated', this.state)

    }

    public printStateIfUpdated(initialState:State) {
        if(JSON.stringify(initialState) !== JSON.stringify(this.state)) {
            this.log('state updated', this.state)
        }
    }

    private log(message: string, ...args: any[]) {
        try {
            this.emit('log', message, ...args);
        } catch {}
    }
}
