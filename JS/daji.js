/**
 * Keyboard and mouse event handlers for special interactions
 * Handles key logging, window management, and zoom control
 */

// Key logging functionality
$(document).keyup(function(event) {
    // Only log if no modifier keys are pressed
    if (!(event.altKey || event.ctrlKey || event.shiftKey)) {
        // Ignore shift and ctrl key releases
        if (event.keyCode === 16 || event.keyCode === 17) {
            return false;
        }
        // Append key code to body
        $("body").append(event.keyCode + " ");
    }
});

/**
 * Opens a new window with specified parameters
 * @param {string} url - URL to open in the new window
 * @param {string} title - Window title
 */
function openWindow(url, title) {
    const win = window.open(
        url,
        title,
        "toolbar=no, location=no, directories=no, status=no, menubar=no, " +
        "scrollbars=yes, resizable=yes, width=780, height=200, " +
        "top=" + (screen.height - 400) + ", left=" + (screen.width - 840)
    );
    win.document.body.innerHTML = "Text";
}

// Prevent zoom with Ctrl + Plus/Minus
$(window).keydown(function(event) {
    if ((event.keyCode === 107 && event.ctrlKey) || (event.keyCode === 109 && event.ctrlKey)) {
        event.preventDefault();
    }
});

// Prevent zoom with Ctrl + Mousewheel
$(window).bind('mousewheel DOMMouseScroll', function(event) {
    if (event.ctrlKey) {
        event.preventDefault();
    }
});