import { Scene } from "phaser";
import CodeEditor from "../controls/CodeEditor";
import AlignGrid from "../geom/AlignGrid";
import Matrix from "../geom/Matrix";
import { joinChilds, createJoinArraysFn as createJoinFunction } from "../utils/Utils";
import MazePhase from "./MazePhase";

export default class MazeConfigs {

    currentPhase: number = -1
    phases: Array<MazePhase>;
    scene: Scene;
    grid: AlignGrid;
    matrixMode: string;
    gridCenterX: number;
    gridCenterY: number;
    gridCellWidth: number;
    codeEditor: CodeEditor;

    fnGetArrowUp = () => joinChilds(this.codeEditor.toolboxRows, (t) => t.flow.children)
        .find(c => c.texture.key == 'arrow-up');
    fnGetArrowLeft = () => joinChilds(this.codeEditor.toolboxRows, (t) => t.flow.children)
        .find(c => c.texture.key == 'arrow-left');
    fnGetArrowRight = () => joinChilds(this.codeEditor.toolboxRows, (t) => t.flow.children)
        .find(c => c.texture.key == 'arrow-right');
    fnGetIfCoin = () => joinChilds(this.codeEditor.toolboxRows, (t) => t.flow.children)
        .find(c => c.texture.key == 'if_coin');
    fnGetIfBlock = () => joinChilds(this.codeEditor.toolboxRows, (t) => t.flow.children)
        .find(c => c.texture.key == 'if_block');
    fnGetProg_0 = () => joinChilds(this.codeEditor.toolboxRows, (t) => t.flow.children)
        .find(c => c.texture.key == 'prog_0');
    fnGetProg_1 = () => joinChilds(this.codeEditor.toolboxRows, (t) => t.flow.children)
        .find(c => c.texture.key == 'prog_1');
    fnGetBtnPlay = () => this.codeEditor.btnPlay.sprite;
    fnGetBtnStep = () => this.codeEditor.btnStep.sprite;
    fnIsBtnStepStateEnabled = () => {
        const isBtnStepEnabled = !this.codeEditor.btnStep.disabled;
        console.log('TUTORIAL [isBtnStepEnabled]', isBtnStepEnabled)
        return isBtnStepEnabled
    }
    fnGetProgram = () => this.codeEditor.getLastEditedOrMainProgramOrFirstNonfull().sprite

    constructor(scene: Scene,
        grid: AlignGrid,
        codeEditor: CodeEditor,
        matrixMode: string,
        gridCenterX: number,
        gridCenterY: number,
        gridCellWidth: number) {

        this.matrixMode = matrixMode;
        this.gridCenterX = gridCenterX;
        this.gridCenterY = gridCenterY;
        this.gridCellWidth = gridCellWidth;
        this.codeEditor = codeEditor;

        this.scene = scene;
        this.grid = grid;

        this.phases = new Array<MazePhase>();

        let showTutorial = false;

        this.phases.push(this.createPhaseEasyThreeStepByStep());
        this.phases.push(this.createPhaseEasyArrowUp());
        this.phases.push(this.createPhaseEasyArrowUpTwoTimes());
        this.phases.push(this.createPhaseEasyArrowUp(showTutorial));
        this.phases.push(this.createPhaseEasyArrowUpTwoTimes(showTutorial));
        this.phases.push(this.createPhaseEasyArrowUpAndRight());
        this.phases.push(this.createPhaseEasyArrowUpAndRight(showTutorial));
        this.phases.push(this.createPhaseEasyThreeStepByStep(showTutorial));
        this.phases.push(this.createPhaseCallRecursiveFunction());
        this.phases.push(this.createPhaseCallRecursiveFunction(showTutorial));
        this.phases.push(this.createPhaseStepByStepWithBlock());
        this.phases.push(this.createPhaseStepByStepWithBlock(showTutorial));
        this.phases.push(this.createPhaseWithTwoStars());
        /* this.phases.push(this.createPhaseIfCoin());
        this.phases.push(this.createPhaseIfBlock()); */
    }

    getNextPhase(): MazePhase {
        this.currentPhase++
        return this.phases[this.currentPhase]
    }

    startPhases() {
        let firstPhase = this.phases[0];
        firstPhase?.firstAction?.highlight();
    }

    private createPhaseEasyArrowUp(showTutorial: boolean = true) {
        const phase = new MazePhase(this.scene, this.grid);
        phase.dudeFacedTo = 'right'
        phase.dudeStartPosition = { col: 1, row: 3 }

        let baseMatrix = [
            ['tile', 'tile', 'tile', 'tile', 'tile', 'tile', 'tile'],
            ['tile', 'tile', 'tile', 'tile', 'tile', 'tile', 'tile'],
            ['tile', 'tile', 'tile', 'tile', 'tile', 'tile', 'tile'],
            ['tile', 'tile', 'tile', 'tile', 'tile', 'tile', 'tile'],
            ['tile', 'tile', 'tile', 'tile', 'tile', 'tile', 'tile'],
            ['tile', 'tile', 'tile', 'tile', 'tile', 'tile', 'tile'],
            ['tile', 'tile', 'tile', 'tile', 'tile', 'tile', 'tile'],
        ];

        let obstaclesMatrix = [
            ['null', 'null', 'null', 'null', 'null', 'null', 'null'],
            ['null', 'null', 'null', 'null', 'null', 'null', 'null'],
            ['null', 'null', 'null', 'null', 'null', 'null', 'null'],
            ['null', 'null', 'coin', 'null', 'null', 'null', 'null'],
            ['null', 'null', 'null', 'null', 'null', 'null', 'null'],
            ['null', 'null', 'null', 'null', 'null', 'null', 'null'],
            ['null', 'null', 'null', 'null', 'null', 'null', 'null'],
        ];

        phase.setupTutorialsAndObjectsPositions = () => {
            phase.obstacles = new Matrix(
                this.scene,
                this.matrixMode,
                obstaclesMatrix,
                this.gridCenterX, this.gridCenterY, this.gridCellWidth
            );

            phase.ground = new Matrix(
                this.scene,
                this.matrixMode,
                baseMatrix,
                this.gridCenterX, this.gridCenterY, this.gridCellWidth
            );

            if (showTutorial) {
                let count = 0;
                phase.addTutorialHighlight(this.fnGetArrowUp).canBeHighlightedWhen = this.hasAddedComands(count++);
                phase.addTutorialHighlight(this.fnGetBtnPlay).canBeHighlightedWhen = this.hasAddedComands(count++);
            }
        }

        return phase;
    }

    private createPhaseEasyThreeStepByStep(showTutorial: boolean = true) {
        const phase = new MazePhase(this.scene, this.grid);
        phase.dudeFacedTo = 'down'
        phase.dudeStartPosition = { col: 3, row: 1 }

        let baseMatrix = [
            ['tile', 'tile', 'tile', 'tile', 'tile', 'tile', 'tile'],
            ['tile', 'tile', 'tile', 'tile', 'tile', 'tile', 'tile'],
            ['tile', 'tile', 'tile', 'tile', 'tile', 'tile', 'tile'],
            ['tile', 'tile', 'tile', 'tile', 'tile', 'tile', 'tile'],
            ['tile', 'tile', 'tile', 'tile', 'tile', 'tile', 'tile'],
            ['tile', 'tile', 'tile', 'tile', 'tile', 'tile', 'tile'],
            ['tile', 'tile', 'tile', 'tile', 'tile', 'tile', 'tile'],
        ];

        let obstaclesMatrix = [
            ['null', 'null', 'null', 'null', 'null', 'null', 'null'],
            ['null', 'null', 'null', 'null', 'null', 'null', 'null'],
            ['null', 'null', 'null', 'null', 'null', 'null', 'null'],
            ['null', 'null', 'null', 'coin', 'null', 'null', 'null'],
            ['null', 'null', 'null', 'coin', 'null', 'null', 'null'],
            ['null', 'null', 'null', 'null', 'null', 'null', 'null'],
            ['null', 'null', 'null', 'null', 'null', 'null', 'null'],
        ];

        phase.setupTutorialsAndObjectsPositions = () => {
            phase.obstacles = new Matrix(
                this.scene,
                this.matrixMode,
                obstaclesMatrix,
                this.gridCenterX, this.gridCenterY, this.gridCellWidth
            );

            phase.ground = new Matrix(
                this.scene,
                this.matrixMode,
                baseMatrix,
                this.gridCenterX, this.gridCenterY, this.gridCellWidth
            );

            if (showTutorial) {
                let count = 0;
                phase.addTutorialHighlight(this.fnGetArrowUp).canBeHighlightedWhen = this.hasAddedComands(count++)
                phase.addTutorialHighlight(this.fnGetArrowUp).canBeHighlightedWhen = this.hasAddedComands(count++)
                phase.addTutorialHighlight(this.fnGetArrowUp).canBeHighlightedWhen = this.hasAddedComands(count++)
                phase.addTutorialHighlight(this.fnGetBtnStep, this.fnIsBtnStepStateEnabled)
                phase.addTutorialHighlight(this.fnGetBtnStep, this.fnIsBtnStepStateEnabled)
                phase.addTutorialHighlight(this.fnGetBtnStep, this.fnIsBtnStepStateEnabled)
            }
        }

        return phase;
    }

    hasAddedComands(quantity: number): () => boolean {
        return () => this.codeEditor.countAddedCommands() == quantity
    }

    private createPhaseEasyArrowUpTwoTimes(showTutorial: boolean = true) {
        const phase = new MazePhase(this.scene, this.grid);
        phase.dudeFacedTo = 'right'
        phase.dudeStartPosition = { col: 1, row: 3 }

        let baseMatrix = [
            ['tile', 'tile', 'tile', 'tile', 'tile', 'tile', 'tile'],
            ['tile', 'tile', 'tile', 'tile', 'tile', 'tile', 'tile'],
            ['tile', 'tile', 'tile', 'tile', 'tile', 'tile', 'tile'],
            ['tile', 'tile', 'tile', 'tile', 'tile', 'tile', 'tile'],
            ['tile', 'tile', 'tile', 'tile', 'tile', 'tile', 'tile'],
            ['tile', 'tile', 'tile', 'tile', 'tile', 'tile', 'tile'],
            ['tile', 'tile', 'tile', 'tile', 'tile', 'tile', 'tile'],
        ];

        let obstaclesMatrix = [
            ['null', 'null', 'null', 'null', 'null', 'null', 'null'],
            ['null', 'null', 'null', 'null', 'null', 'null', 'null'],
            ['null', 'null', 'null', 'null', 'null', 'null', 'null'],
            ['null', 'null', 'null', 'coin', 'null', 'null', 'null'],
            ['null', 'null', 'null', 'null', 'null', 'null', 'null'],
            ['null', 'null', 'null', 'null', 'null', 'null', 'null'],
            ['null', 'null', 'null', 'null', 'null', 'null', 'null'],
        ];

        phase.setupTutorialsAndObjectsPositions = () => {

            phase.obstacles = new Matrix(
                this.scene,
                this.matrixMode,
                obstaclesMatrix,
                this.gridCenterX, this.gridCenterY, this.gridCellWidth
            );

            phase.ground = new Matrix(
                this.scene,
                this.matrixMode,
                baseMatrix,
                this.gridCenterX, this.gridCenterY, this.gridCellWidth
            );
            if (showTutorial) {
                phase.addTutorialHighlight(this.fnGetArrowUp).canBeHighlightedWhen = this.hasAddedComands(0)
                phase.addTutorialHighlight(this.fnGetArrowUp).canBeHighlightedWhen = this.hasAddedComands(1)
                phase.addTutorialHighlight(this.fnGetBtnPlay).canBeHighlightedWhen = this.hasAddedComands(2)
            }
        }
        return phase;
    }

    private createPhaseEasyArrowUpAndRight(showTutorial: boolean = true) {
        const phase = new MazePhase(this.scene, this.grid);
        phase.dudeFacedTo = 'right'
        phase.dudeStartPosition = { col: 1, row: 2 }

        let baseMatrix = [
            ['tile', 'tile', 'tile', 'tile', 'tile', 'tile', 'tile'],
            ['tile', 'tile', 'tile', 'tile', 'tile', 'tile', 'tile'],
            ['tile', 'tile', 'tile', 'tile', 'tile', 'tile', 'tile'],
            ['tile', 'tile', 'tile', 'tile', 'tile', 'tile', 'tile'],
            ['tile', 'tile', 'tile', 'tile', 'tile', 'tile', 'tile'],
            ['tile', 'tile', 'tile', 'tile', 'tile', 'tile', 'tile'],
            ['tile', 'tile', 'tile', 'tile', 'tile', 'tile', 'tile'],
        ];

        let obstaclesMatrix = [
            ['null', 'null', 'null', 'null', 'null', 'null', 'null'],
            ['null', 'null', 'null', 'null', 'null', 'null', 'null'],
            ['null', 'null', 'null', 'null', 'null', 'null', 'null'],
            ['null', 'null', 'null', 'coin', 'null', 'null', 'null'],
            ['null', 'null', 'null', 'null', 'null', 'null', 'null'],
            ['null', 'null', 'null', 'null', 'null', 'null', 'null'],
            ['null', 'null', 'null', 'null', 'null', 'null', 'null'],
        ];

        phase.setupTutorialsAndObjectsPositions = () => {

            phase.obstacles = new Matrix(
                this.scene,
                this.matrixMode,
                obstaclesMatrix,
                this.gridCenterX, this.gridCenterY, this.gridCellWidth
            );

            phase.ground = new Matrix(
                this.scene,
                this.matrixMode,
                baseMatrix,
                this.gridCenterX, this.gridCenterY, this.gridCellWidth
            );

            if (showTutorial) {
                phase.addTutorialHighlight(this.fnGetArrowUp).canBeHighlightedWhen = this.hasAddedComands(0);
                phase.addTutorialHighlight(this.fnGetArrowUp).canBeHighlightedWhen = this.hasAddedComands(1);
                phase.addTutorialHighlight(this.fnGetArrowRight).canBeHighlightedWhen = this.hasAddedComands(2);
                phase.addTutorialHighlight(this.fnGetArrowUp).canBeHighlightedWhen = this.hasAddedComands(3);
                phase.addTutorialHighlight(this.fnGetBtnPlay).canBeHighlightedWhen = this.hasAddedComands(4);;
            }
        }
        return phase;
    }

    private createPhaseCallRecursiveFunction(showTutorial: boolean = true) {
        const phase = new MazePhase(this.scene, this.grid);
        phase.dudeFacedTo = 'right'
        phase.dudeStartPosition = { col: 0, row: 3 }

        let baseMatrix = [
            ['tile', 'tile', 'tile', 'tile', 'tile', 'tile', 'tile'],
            ['tile', 'tile', 'tile', 'tile', 'tile', 'tile', 'tile'],
            ['tile', 'tile', 'tile', 'tile', 'tile', 'tile', 'tile'],
            ['tile', 'tile', 'tile', 'tile', 'tile', 'tile', 'tile'],
            ['tile', 'tile', 'tile', 'tile', 'tile', 'tile', 'tile'],
            ['tile', 'tile', 'tile', 'tile', 'tile', 'tile', 'tile'],
            ['tile', 'tile', 'tile', 'tile', 'tile', 'tile', 'tile'],
        ];

        let obstaclesMatrix = [
            ['null', 'null', 'null', 'null', 'null', 'null', 'null'],
            ['null', 'null', 'null', 'null', 'null', 'null', 'null'],
            ['null', 'null', 'null', 'null', 'null', 'null', 'null'],
            ['null', 'null', 'null', 'null', 'null', 'null', 'coin'],
            ['null', 'null', 'null', 'null', 'null', 'null', 'null'],
            ['null', 'null', 'null', 'null', 'null', 'null', 'null'],
            ['null', 'null', 'null', 'null', 'null', 'null', 'null'],
        ];

        phase.setupTutorialsAndObjectsPositions = () => {
            phase.obstacles = new Matrix(
                this.scene,
                this.matrixMode,
                obstaclesMatrix,
                this.gridCenterX, this.gridCenterY, this.gridCellWidth
            );

            phase.ground = new Matrix(
                this.scene,
                this.matrixMode,
                baseMatrix,
                this.gridCenterX, this.gridCenterY, this.gridCellWidth
            );

            if (showTutorial) {
                phase.addTutorialHighlight(this.fnGetArrowUp).canBeHighlightedWhen = this.hasAddedComands(0);
                phase.addTutorialHighlight(this.fnGetProg_0).canBeHighlightedWhen = this.hasAddedComands(1);
                phase.addTutorialHighlight(this.fnGetBtnPlay).canBeHighlightedWhen = this.hasAddedComands(2);
            }
        }

        return phase;
    }

    private createPhaseStepByStepWithBlock(showTutorial: boolean = true) {
        const phase = new MazePhase(this.scene, this.grid);
        phase.dudeFacedTo = 'down'
        phase.dudeStartPosition = { col: 3, row: 1 }

        let baseMatrix = [
            ['tile', 'tile', 'tile', 'tile', 'tile', 'tile', 'tile'],
            ['tile', 'tile', 'tile', 'tile', 'tile', 'tile', 'tile'],
            ['tile', 'tile', 'tile', 'tile', 'tile', 'tile', 'tile'],
            ['tile', 'tile', 'tile', 'tile', 'tile', 'tile', 'tile'],
            ['tile', 'tile', 'tile', 'tile', 'tile', 'tile', 'tile'],
            ['tile', 'tile', 'tile', 'tile', 'tile', 'tile', 'tile'],
            ['tile', 'tile', 'tile', 'tile', 'tile', 'tile', 'tile'],
        ];

        let obstaclesMatrix = [
            ['null', 'null', 'null', 'null', 'null', 'null', 'null'],
            ['null', 'null', 'null', 'null', 'null', 'null', 'null'],
            ['null', 'null', 'null', 'null', 'null', 'null', 'null'],
            ['null', 'null', 'null', 'block', 'null', 'null', 'null'],
            ['null', 'null', 'null', 'coin', 'null', 'null', 'null'],
            ['null', 'null', 'null', 'null', 'null', 'null', 'null'],
            ['null', 'null', 'null', 'null', 'null', 'null', 'null'],
        ];

        phase.setupTutorialsAndObjectsPositions = () => {
            phase.obstacles = new Matrix(
                this.scene,
                this.matrixMode,
                obstaclesMatrix,
                this.gridCenterX, this.gridCenterY, this.gridCellWidth
            );

            phase.ground = new Matrix(
                this.scene,
                this.matrixMode,
                baseMatrix,
                this.gridCenterX, this.gridCenterY, this.gridCellWidth
            );

            if (showTutorial) {
                let count = 0;
                phase.addTutorialHighlight(this.fnGetArrowLeft).canBeHighlightedWhen = this.hasAddedComands(count++);
                phase.addTutorialHighlight(this.fnGetArrowUp).canBeHighlightedWhen = this.hasAddedComands(count++);
                phase.addTutorialHighlight(this.fnGetArrowRight).canBeHighlightedWhen = this.hasAddedComands(count++);
                phase.addTutorialHighlight(this.fnGetArrowUp).canBeHighlightedWhen = this.hasAddedComands(count++);
                phase.addTutorialHighlight(this.fnGetProg_1).canBeHighlightedWhen = this.hasAddedComands(count++);
                phase.addTutorialHighlight(this.fnGetArrowUp).canBeHighlightedWhen = this.hasAddedComands(count++);
                phase.addTutorialHighlight(this.fnGetArrowUp).canBeHighlightedWhen = this.hasAddedComands(count++);
                phase.addTutorialHighlight(this.fnGetArrowRight).canBeHighlightedWhen = this.hasAddedComands(count++);
                phase.addTutorialHighlight(this.fnGetArrowUp).canBeHighlightedWhen = this.hasAddedComands(count++);
                phase.addTutorialHighlight(this.fnGetBtnStep, this.fnIsBtnStepStateEnabled)
                phase.addTutorialHighlight(this.fnGetBtnStep, this.fnIsBtnStepStateEnabled)
                phase.addTutorialHighlight(this.fnGetBtnStep, this.fnIsBtnStepStateEnabled)
                phase.addTutorialHighlight(this.fnGetBtnStep, this.fnIsBtnStepStateEnabled)
                phase.addTutorialHighlight(this.fnGetBtnStep, this.fnIsBtnStepStateEnabled)
                phase.addTutorialHighlight(this.fnGetBtnStep, this.fnIsBtnStepStateEnabled)
                phase.addTutorialHighlight(this.fnGetBtnStep, this.fnIsBtnStepStateEnabled)
                phase.addTutorialHighlight(this.fnGetBtnStep, this.fnIsBtnStepStateEnabled)
                phase.addTutorialHighlight(this.fnGetBtnStep, this.fnIsBtnStepStateEnabled)
            }
        }

        return phase;
    }

    private createPhaseIfCoin() {
        const phase = new MazePhase(this.scene, this.grid);
        phase.dudeFacedTo = 'down'
        phase.dudeStartPosition = { col: 3, row: 1 }

        let baseMatrix = [
            ['tile', 'tile', 'tile', 'tile', 'tile', 'tile', 'tile'],
            ['tile', 'tile', 'tile', 'tile', 'tile', 'tile', 'tile'],
            ['tile', 'tile', 'tile', 'tile', 'tile', 'tile', 'tile'],
            ['tile', 'tile', 'tile', 'tile', 'tile', 'tile', 'tile'],
            ['tile', 'tile', 'tile', 'tile', 'tile', 'tile', 'tile'],
            ['tile', 'tile', 'tile', 'tile', 'tile', 'tile', 'tile'],
            ['tile', 'tile', 'tile', 'tile', 'tile', 'tile', 'tile'],
        ];

        let obstaclesMatrix = [
            ['null', 'null', 'null', 'null', 'null', 'null', 'null'],
            ['null', 'null', 'null', 'null', 'null', 'null', 'null'],
            ['null', 'null', 'null', 'null', 'null', 'null', 'null'],
            ['null', 'null', 'null', 'null', 'null', 'null', 'null'],
            ['null', 'null', 'coin', 'coin', 'null', 'null', 'null'],
            ['null', 'null', 'null', 'null', 'null', 'null', 'null'],
            ['null', 'null', 'null', 'null', 'null', 'null', 'null'],
        ];

        phase.setupTutorialsAndObjectsPositions = () => {
            phase.obstacles = new Matrix(
                this.scene,
                this.matrixMode,
                obstaclesMatrix,
                this.gridCenterX, this.gridCenterY, this.gridCellWidth
            );

            phase.ground = new Matrix(
                this.scene,
                this.matrixMode,
                baseMatrix,
                this.gridCenterX, this.gridCenterY, this.gridCellWidth
            );

            let count = 0;
            phase.addTutorialHighlight(this.fnGetArrowUp).canBeHighlightedWhen = this.hasAddedComands(count++);
            phase.addTutorialHighlight(this.fnGetArrowUp).canBeHighlightedWhen = this.hasAddedComands(count++);
            phase.addTutorialHighlight(this.fnGetBtnStep, this.fnIsBtnStepStateEnabled)
            phase.addTutorialHighlight(this.fnGetBtnStep, this.fnIsBtnStepStateEnabled)
            phase.addTutorialHighlight(this.fnGetBtnStep, this.fnIsBtnStepStateEnabled)
        }

        return phase;
    }

    private createPhaseIfBlock() {
        const phase = new MazePhase(this.scene, this.grid);
        phase.dudeFacedTo = 'down'
        phase.dudeStartPosition = { col: 3, row: 1 }

        let baseMatrix = [
            ['tile', 'tile', 'tile', 'tile', 'tile', 'tile', 'tile'],
            ['tile', 'tile', 'tile', 'tile', 'tile', 'tile', 'tile'],
            ['tile', 'tile', 'tile', 'tile', 'tile', 'tile', 'tile'],
            ['tile', 'tile', 'tile', 'tile', 'tile', 'tile', 'tile'],
            ['tile', 'tile', 'tile', 'tile', 'tile', 'tile', 'tile'],
            ['tile', 'tile', 'tile', 'tile', 'tile', 'tile', 'tile'],
            ['tile', 'tile', 'tile', 'tile', 'tile', 'tile', 'tile'],
        ];

        let obstaclesMatrix = [
            ['null', 'null', 'null', 'null', 'null', 'null', 'null'],
            ['null', 'null', 'null', 'null', 'null', 'null', 'null'],
            ['null', 'null', 'null', 'null', 'null', 'null', 'null'],
            ['null', 'null', 'null', 'coin', 'null', 'null', 'null'],
            ['null', 'null', 'null', 'coin', 'null', 'null', 'null'],
            ['null', 'null', 'null', 'null', 'null', 'null', 'null'],
            ['null', 'null', 'null', 'null', 'null', 'null', 'null'],
        ];

        phase.setupTutorialsAndObjectsPositions = () => {
            phase.obstacles = new Matrix(
                this.scene,
                this.matrixMode,
                obstaclesMatrix,
                this.gridCenterX, this.gridCenterY, this.gridCellWidth
            );

            phase.ground = new Matrix(
                this.scene,
                this.matrixMode,
                baseMatrix,
                this.gridCenterX, this.gridCenterY, this.gridCellWidth
            );

            let count = 0;
            phase.addTutorialHighlight(this.fnGetArrowUp).canBeHighlightedWhen = this.hasAddedComands(count++);
            phase.addTutorialHighlight(this.fnGetArrowUp).canBeHighlightedWhen = this.hasAddedComands(count++);
            phase.addTutorialHighlight(this.fnGetArrowUp).canBeHighlightedWhen = this.hasAddedComands(count++);
            phase.addTutorialHighlight(this.fnGetBtnStep, this.fnIsBtnStepStateEnabled)
            phase.addTutorialHighlight(this.fnGetBtnStep, this.fnIsBtnStepStateEnabled)
            phase.addTutorialHighlight(this.fnGetBtnStep, this.fnIsBtnStepStateEnabled)
        }

        return phase;
    }


    private createPhaseWithTwoStars() {
        const phase = new MazePhase(this.scene, this.grid);
        phase.dudeFacedTo = 'down'
        phase.dudeStartPosition = { col: 3, row: 0 }

        let baseMatrix = [
            ['tile', 'tile', 'tile', 'tile', 'tile', 'tile', 'tile'],
            ['tile', 'tile', 'tile', 'tile', 'tile', 'tile', 'tile'],
            ['tile', 'tile', 'tile', 'tile', 'tile', 'tile', 'tile'],
            ['tile', 'tile', 'tile', 'tile', 'tile', 'tile', 'tile'],
            ['tile', 'tile', 'tile', 'tile', 'tile', 'tile', 'tile'],
            ['tile', 'tile', 'tile', 'tile', 'tile', 'tile', 'tile'],
            ['tile', 'tile', 'tile', 'tile', 'tile', 'tile', 'tile'],
        ];

        let obstaclesMatrix = [
            ['null', 'null', 'null', 'null', 'null', 'null', 'null'],
            ['null', 'block', 'block', 'null', 'null', 'null', 'null'],
            ['null', 'block', 'coin', 'null', 'null', 'null', 'null'],
            ['null', 'block', 'block', 'null', 'null', 'null', 'null'],
            ['null', 'block', 'coin', 'null', 'null', 'null', 'null'],
            ['null', 'block', 'block', 'null', 'null', 'null', 'null'],
            ['null', 'null', 'null', 'null', 'null', 'null', 'null'],
        ];

        phase.setupTutorialsAndObjectsPositions = () => {
            phase.obstacles = new Matrix(
                this.scene,
                this.matrixMode,
                obstaclesMatrix,
                this.gridCenterX, this.gridCenterY, this.gridCellWidth
            );

            phase.ground = new Matrix(
                this.scene,
                this.matrixMode,
                baseMatrix,
                this.gridCenterX, this.gridCenterY, this.gridCellWidth
            );
        }

        return phase;
    }
}