import _ from "lodash";
import { GameManager } from "./game_manager";

declare global {
    interface CreepMemory {
        role: string;
        roleFunc: (creep: Creep) => void;
        building?: boolean;
        upgrading?: boolean;
    }
}

const gameManager = new GameManager();
let numLoop = 0;

export const loop = () => {
    console.log(`------------------Loop ${numLoop} begin------------------`);
    console.log("---------------------------------------------------------");

    gameManager.run();

    console.log("---------------------------------------------------------");
    console.log(`-------------------Loop ${numLoop} end-------------------`);
    console.log("\n");

    ++numLoop;
};
