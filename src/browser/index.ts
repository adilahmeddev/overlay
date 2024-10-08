import {app as ElectronApp} from 'electron';
import {Application} from "./application";
import {OverlayHotkeysService} from './services/overlay-hotkeys.service';
import {OverlayService} from './services/overlay.service';
import {GameEventsService} from './services/gep.service';
import {MainWindowController} from './controllers/main-window.controller';
import {DemoOSRWindowController} from './controllers/demo-osr-window.controller';
import {OverlayInputService} from './services/overlay-input.service';
import {TftService} from "./services/tft.service";
import {TftStaticData} from "./services/tftStaticData";


/**
 * TODO: Integrate your own dependency-injection library
 */
const bootstrap = (): Application => {
  const overlayService = new OverlayService();
  const overlayHotkeysService = new OverlayHotkeysService(overlayService);
  const gepService = new GameEventsService();
  const inputService = new OverlayInputService(overlayService);
  const tftStaticData = new TftStaticData();
  const tftService = new TftService(tftStaticData);

  const createDemoOsrWindowControllerFactory = (): DemoOSRWindowController => {
    return new DemoOSRWindowController(overlayService);
  }

  const mainWindowController = new MainWindowController(
    gepService,
    overlayService,
    createDemoOsrWindowControllerFactory,
    overlayHotkeysService,
    inputService,
    tftService
  );

  return new Application(overlayService, gepService, mainWindowController, tftService);
}

const app = bootstrap();

ElectronApp.whenReady().then(() => {
  app.run();
});

ElectronApp.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    ElectronApp.quit();
  }
});
