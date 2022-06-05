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

export const loop = () => {
    gameManager.run();
};
