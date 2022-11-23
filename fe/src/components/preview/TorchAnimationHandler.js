export class TorchAnimationHandler {
    animation;

    runAnimation(animator, animation) {
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