import {GameInfo, GameLaunchEvent} from '@overwolf/ow-electron-packages-types';
import {MainWindowController} from './controllers/main-window.controller';
import {OverlayService} from './services/overlay.service';
import {kGameIds} from "@overwolf/ow-electron-packages-types/game-list";
import {kGepSupportedGameIds} from '@overwolf/ow-electron-packages-types/gep-supported-games';
import {GameEventsService} from './services/gep.service';
import {AugmentsDto, TftUpdateFeature, TftUpdateValue} from "../../types/TftUpdateEvents";
import {State, TftService} from "./services/tft.service";

export class Application {
    /**
     *
     */
    constructor(
        private readonly overlayService: OverlayService,
        private readonly gepService: GameEventsService,
        private readonly mainWindowController: MainWindowController,
        private readonly tftService: TftService,
    ) {

        overlayService.on('ready', this.onOverlayServiceReady.bind(this));

        overlayService.on('injection-decision-handling', (
            event: GameLaunchEvent,
            _gameInfo: GameInfo
        ) => {
            // Always inject because we tell it which games we want in
            // onOverlayServiceReady
            event.inject();
        })
        this.gepService.on('tft', (e, k, g) => {
            if (arguments.length === 3){
                const gameInfo: TftUpdateValue = g;
                let key: any = k;
                let event: TftUpdateFeature = e;
                console.log('tft event with key', event, key)
                const initialState = JSON.parse(JSON.stringify(this.tftService.state));
                if (e as TftUpdateValue) {
                    this.tftService.print(e, k)
                    this.tftService.set(event, gameInfo);
                }

                this.tftService.printStateIfUpdated(initialState)
            } else {
                const gameInfo: TftUpdateValue = g;
                let event: TftUpdateFeature = e;

                const initialState = JSON.parse(JSON.stringify(this.tftService.state));
                if (e as TftUpdateValue) {
                    this.tftService.set(event, gameInfo);
                }

                this.tftService.printStateIfUpdated(initialState)
            }

        })
        // for gep supported games goto:
        // https://overwolf.github.io/api/electron/game-events/
        this.gepService.registerGames(
            kGepSupportedGameIds.TeamfightTactics,
        );
    }

    /**
     *
     */
    public run() {
        this.initialize();
    }

    /**
     *
     */
    private initialize() {
        const showDevTools = true;
        this.mainWindowController.createAndShow(showDevTools);
    }

    /**
     *
     */
    private async onOverlayServiceReady() {
        // Which games to support overlay for
        await this.overlayService.registerToGames([
            kGepSupportedGameIds.TeamfightTactics,
        ]);
    }
}
