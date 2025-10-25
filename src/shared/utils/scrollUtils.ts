/**
 * Utility functions for scroll behavior
 */

/**
 * Scrolls the window to the top with smooth animation
 * Also handles scrollable containers like main content areas
 */
export const scrollToTop = () => {
    // Use setTimeout to ensure DOM has updated
    setTimeout(() => {
        // First try to scroll the main scrollable container
        const mainElement = document.querySelector('main[class*="overflow-y-auto"]');
        if (mainElement) {
            mainElement.scrollTo({ top: 0, behavior: "smooth" });
        } else {
            // Fallback to window scroll
            window.scrollTo({ top: 0, behavior: "smooth" });
        }
    }, 0);
};

/**
 * Scrolls the window to the top without animation (instant)
 * Also handles scrollable containers like main content areas
 */
export const scrollToTopInstant = () => {
    // First try to scroll the main scrollable container
    const mainElement = document.querySelector('main[class*="overflow-y-auto"]');
    if (mainElement) {
        mainElement.scrollTo({ top: 0, behavior: "auto" });
    } else {
        // Fallback to window scroll
        window.scrollTo({ top: 0, behavior: "auto" });
    }
};

/**
 * Scrolls a specific element to the top with smooth animation
 */
export const scrollElementToTop = (element: HTMLElement | null) => {
    if (element) {
        element.scrollTo({ top: 0, behavior: "smooth" });
    }
};

/**
 * Scrolls a specific element to the top without animation (instant)
 */
export const scrollElementToTopInstant = (element: HTMLElement | null) => {
    if (element) {
        element.scrollTo({ top: 0, behavior: "auto" });
    }
};

/**
 * Comprehensive scroll to top function that tries multiple approaches
 */
export const scrollToTopRobust = () => {
    setTimeout(() => {
        // Try multiple selectors for the main scrollable container
        const selectors = [
            'main[class*="overflow-y-auto"]',
            'main',
            '[data-scroll-container]',
            '.main-content',
            '#main-content'
        ];

        let scrolled = false;

        for (const selector of selectors) {
            const element = document.querySelector(selector);
            if (element && element.scrollHeight > element.clientHeight) {
                element.scrollTo({ top: 0, behavior: "smooth" });
                scrolled = true;
                break;
            }
        }

        // Fallback to window scroll if no scrollable container found
        if (!scrolled) {
            window.scrollTo({ top: 0, behavior: "smooth" });
        }
    }, 0);
};
