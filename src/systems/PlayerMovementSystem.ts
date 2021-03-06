import {Vector} from "../helpers/Vector";
import {Render} from "../Render";
import {Container} from "typedi";
import {PlayerMovementComponent} from "../components/PlayerMovementComponent";
import {HealthComponent} from "../components/HealthComponent";
import {EntityInterface} from "../interfaces/EntityInterface";
export class PlayerMovementSystem {

    private directionVector: Vector = new Vector(0, 0);
    private pressed: number[] = [];
    private keyCodes: any = {
        '38': 'up',
        '40': 'down',
        '37': 'left',
        '39': 'right',
    };
    private values: any = {
        '38': new Vector(0, -1),
        '40': new Vector(0, 1),
        '37': new Vector(-1, 0),
        "39": new Vector(1, 0),
    };

    public render: Render;

    constructor() {
        this.eventsListener();
        this.render = Container.get(Render);
        this.render.addSystem(this);
    }

    protected eventsListener() {
        let that = this;
        document.addEventListener('keydown', function (e: KeyboardEvent) {
            that.keyDown(e);
        }, false);
        document.addEventListener('keyup', function (e: KeyboardEvent) {
            that.keyUp(e);
        }, false);
    }

    private keyDown(e: KeyboardEvent) {
        if (e.keyCode in this.keyCodes) {
            if (this.pressed.indexOf(e.keyCode) == -1) {

                this.directionVector.addVector(this.values[e.keyCode]);

                this.pressed.push(e.keyCode)
            }
        }
    }

    private keyUp(e: KeyboardEvent) {
        if (e.keyCode in this.keyCodes) {
            let index = this.pressed.indexOf(e.keyCode);
            if (index >= 0) {

                this.directionVector.subVector(this.values[e.keyCode]);

                this.pressed.splice(index, 1);
            }
        }
    }

    addPosition(component: any, newPosition: any) {
        component.entity.views.forEach(function (playeView: any) {
            playeView.view.position.x += newPosition.x;
            playeView.view.position.y += newPosition.y;
        })
    }

    assignComponents: string[] = [
        'PlayerMovementComponent',
    ];


    private move(component: PlayerMovementComponent) {
        if (!(component instanceof PlayerMovementComponent)) {
            return;
        }

        if (!this.directionVector.isNull()) {
            let module = Math.sqrt(Math.pow(this.directionVector.x, 2) + Math.pow(this.directionVector.y, 2));
            let x = component.speed * this.directionVector.x / module;
            let y = component.speed * this.directionVector.y / module;
            this.addPosition(component, new PIXI.Point(x, y));
        }
    }

    update(delta: number, entity: EntityInterface) {
        this.render.entities.forEach((entity: any) => {

            this.assignComponents.forEach((compName: any) => {
                this.move(entity.components[compName]);
            });
        });
    }
}
