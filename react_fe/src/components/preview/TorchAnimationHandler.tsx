import { Animator } from "./Animator";
import { TorchAnimation } from "./TorchAnimation";

export class TorchAnimationHandler {
    animation: TorchAnimation | null = null;

    runAnimation(animator: Animator, animation: TorchAnimation) {
        if (this.animation) {
            this.animation.stop();
        }
        this.animation = animation;
        animator.registerAnimation(this.animation);
    }

    stopAnimation() {
        if (!this.animation) {
            return;
        }
        this.animation.stop();
        this.animation = null;
    }

    unpauseAnimation() {
        if (!this.animation) {
            return;
        }
        this.animation.unpause();
    }

    pauseAnimation() {
        if (!this.animation) {
            return;
        }
        this.animation.pause();
    }
}