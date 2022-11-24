export class Animator {
    animations = [];
    animId = 0;

    doAnim() {
        // Remove stopped animations
        this.animations.filter(x => x.state == -1).forEach(x => this.deregisterAnimation(x));

        // Play unpaused animations
        this.animations.filter(x => x.state == 1).forEach(x => {
            x.update();
        });

        if (this.animations.length == 0) {
            return;
        }

        // New frame
        this.animId = window.requestAnimationFrame(() => this.doAnim());
    }

    registerAnimation(obj) {
        this.animations.push(obj);

        if (this.animations.length == 1) {
            this.animId = window.requestAnimationFrame(() => this.doAnim());
        }
    }

    deregisterAnimation(obj) {
        this.animations.splice(this.animations.indexOf(obj), 1);

        if (this.animations.length == 0) {
            window.cancelAnimationFrame(this.animId);
        }
    }
}