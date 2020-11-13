import { GameObjects, Scene } from "phaser";
import TutorialHighlight from "./TutorialHighlight";

export default class TutorialAction {

    scene: Scene;
    highlights: Array<TutorialHighlight>;
    nextTutorialAction: TutorialAction
    previousTutorialAction: TutorialAction;
    onHighlight: () => void = () => { }
    onAdvance: () => void = () => { }
    isCodeStateValidToHighlightThisTutorialAction: () => boolean = () => true
    triggered: boolean = false;
    index: number;

    constructor(
        scene: Scene,
        highlights: Array<TutorialHighlight>,
    ) {
        this.scene = scene;
        this.highlights = highlights;
    }

    reset() {
        console.log('TUTORIAL_RESETING_CHILDREN')
        this.triggered = false;
        this.scene.children.getAll().forEach(c => c.setInteractive());
        this.highlights.forEach(highlight => {
            highlight.removeHand();
            highlight.resetDepth();
        })
    }

    highlight() {
        if (this.triggered) return;
        if (this.isCodeStateValidToHighlightThisTutorialAction()) {
            this.triggered = true;
            console.log('TUTORIAL_ACTION_INDEX highlight [index]', this.index)
            this.onHighlight();
            this.disableAllInteractions();
            const onInteractAdvanceTutorial = () => {
                this.onAdvance();
                this.nextTutorialAction?.highlight();
            }
            this.highlights.forEach(highlight => {
                //highlight.continueTutorialOnClick = true;
                highlight.continueTutorialOnDrag = true;
                highlight.contrastAndShowHandPointing(() => onInteractAdvanceTutorial())
            });
        }
        if (!this.isCodeStateValidToHighlightThisTutorialAction()) {
            if (this.previousTutorialAction) {
                this.previousTutorialAction.triggered = false
                this.previousTutorialAction.highlight();
            }
        }
    }

    private disableAllInteractions() {
        this.scene.children.getAll().forEach(c => c.disableInteractive());
    }
}