import { SelectItem } from './components/selectItem';

export class Case {
    height: number;
    width: number;
    type: string;
    object: any;

    constructor(
        height: number,
        width: number
    ) {
        this.height = height;
        this.width = width;
        this.type = null;
        this.object = null;
    }
}

export class Player {
    visionRange: number;
    inventory: Map<string, number>;

    constructor(itemTypes: SelectItem[]) {
        this.visionRange = 0;
        this.inventory = new Map();
        itemTypes.forEach(element => {
            this.inventory.set(element.value, 0); 
        });
    }
}

export class Enemy {
    type: string;

    constructor() {
        this.type = null;
    }
}