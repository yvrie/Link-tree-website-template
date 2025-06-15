/**
 * Text typing animation effect
 * Creates a typewriter-like effect for text elements
 */
class TxtType {
    /**
     * @param {HTMLElement} el - The element to animate
     * @param {string[]} toRotate - Array of strings to type
     * @param {number} period - Time between rotations in milliseconds
     */
    constructor(el, toRotate, period) {
        this.toRotate = toRotate;
        this.el = el;
        this.loopNum = 0;
        this.period = parseInt(period, 10) || 2000;
        this.txt = '';
        this.isDeleting = false;
        this.tick();
    }

    /**
     * Handles the typing animation tick
     * Manages typing, deleting, and timing of the animation
     */
    tick() {
        const i = this.loopNum % this.toRotate.length;
        const fullTxt = this.toRotate[i];

        // Handle text deletion
        if (this.isDeleting) {
            this.txt = fullTxt.substring(0, this.txt.length - 1);
        } else {
            this.txt = fullTxt.substring(0, this.txt.length + 1);
        }

        // Update element content
        this.el.innerHTML = '<span class="wrap">' + this.txt + '</span>';

        // Calculate timing for next tick
        let delta = 200 - Math.random() * 100;
        if (this.isDeleting) {
            delta /= 2;
        }

        // Handle animation state transitions
        if (!this.isDeleting && this.txt === fullTxt) {
            delta = this.period;
            this.isDeleting = true;
        } else if (this.isDeleting && this.txt === '') {
            this.isDeleting = false;
            this.loopNum++;
            delta = 500;
        }

        // Schedule next tick
        setTimeout(() => this.tick(), delta);
    }
}

// Initialize typing animations when page loads
window.onload = function() {
    // Find all elements with typewrite class
    const elements = document.getElementsByClassName('typewrite');
    
    // Initialize typing animation for each element
    for (let i = 0; i < elements.length; i++) {
        const toRotate = elements[i].getAttribute('data-type');
        const period = elements[i].getAttribute('data-period');
        
        if (toRotate) {
            new TxtType(elements[i], JSON.parse(toRotate), period);
        }
    }

    // Add cursor styling
    const css = document.createElement("style");
    css.type = "text/css";
    css.innerHTML = ".typewrite > .wrap { border-right: 0.08em solid #fff}";
    document.body.appendChild(css);
};