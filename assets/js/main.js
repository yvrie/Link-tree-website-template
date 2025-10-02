/**
 * Josee.moe - Modern Bio Page
 * A clean, accessible, and performant personal bio page
 * 
 * Features:
 * - Intersection Observer animations
 * - Mobile viewport handling
 * - Accessibility enhancements
 * - Performance optimizations
 * - Modern ES6+ JavaScript
 */

class JoseeBio {
    constructor() {
        this.config = {
            animationDelay: 100,
            animationThreshold: 0.1,
            mobileBreakpoint: 768,
            reducedMotion: window.matchMedia('(prefers-reduced-motion: reduce)').matches
        };
        
        this.state = {
            isLoaded: false,
            isMobile: this.detectMobile(),
            currentTheme: 'dark'
        };
        
        this.init();
    }

    /**
     * Initialize the application
     */
    init() {
        this.setupViewport();
        this.setupAnimations();
        this.setupInteractions();
        this.setupAccessibility();
        this.setupPerformance();
        
        // Mark as loaded
        this.state.isLoaded = true;
        document.body.classList.add('loaded');
        
        console.log('🌸 Josee.moe loaded successfully');
    }

    /**
     * Setup mobile viewport handling
     */
    setupViewport() {
        if (this.state.isMobile) {
            this.setupMobileViewport();
        }
        
        // Handle orientation changes
        window.addEventListener('orientationchange', () => {
            setTimeout(() => this.updateViewport(), 100);
        });
        
        // Handle resize events
        window.addEventListener('resize', this.debounce(() => {
            this.updateViewport();
            this.state.isMobile = this.detectMobile();
        }, 250));
    }

    /**
     * Setup mobile viewport height
     */
    setupMobileViewport() {
        const setViewportHeight = () => {
            const vh = window.innerHeight * 0.01;
            document.documentElement.style.setProperty('--vh', `${vh}px`);
        };

        setViewportHeight();
        window.addEventListener('resize', setViewportHeight);
    }

    /**
     * Update viewport on changes
     */
    updateViewport() {
        if (this.state.isMobile) {
            this.setupMobileViewport();
        }
    }

    /**
     * Setup scroll-triggered animations
     */
    setupAnimations() {
        if (this.config.reducedMotion) {
            // Skip animations for users who prefer reduced motion
            document.querySelectorAll('[data-animate]').forEach(el => {
                el.classList.add('animate-in');
            });
            return;
        }

        const observerOptions = {
            threshold: this.config.animationThreshold,
            rootMargin: '0px 0px -50px 0px'
        };

        this.animationObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const delay = parseInt(entry.target.dataset.delay) || 0;
                    const animationType = entry.target.dataset.animate;
                    
                    // Add staggered animation for stagger containers
                    if (animationType === 'stagger') {
                        this.animateStaggeredChildren(entry.target, delay);
                    } else {
                        setTimeout(() => {
                            entry.target.classList.add('animate-in');
                            this.addAnimationEffects(entry.target, animationType);
                        }, delay);
                    }
                    
                    // Unobserve after animation
                    this.animationObserver.unobserve(entry.target);
                }
            });
        }, observerOptions);

        // Observe all animated elements
        document.querySelectorAll('[data-animate]').forEach(el => {
            this.animationObserver.observe(el);
        });

        // Add continuous animations
        this.setupContinuousAnimations();
    }

    /**
     * Animate staggered children
     */
    animateStaggeredChildren(container, baseDelay) {
        const children = container.children;
        Array.from(children).forEach((child, index) => {
            const childDelay = baseDelay + (index * 100);
            setTimeout(() => {
                child.classList.add('animate-in');
                this.addAnimationEffects(child, child.dataset.animate);
            }, childDelay);
        });
    }

    /**
     * Add special animation effects
     */
    addAnimationEffects(element, animationType) {
        // Simple fade-up animation only - other animations removed for performance
        if (animationType === 'fade-up') {
            element.style.opacity = '1';
            element.style.transform = 'translateY(0)';
        }
    }

    /**
     * Setup continuous animations
     */
    setupContinuousAnimations() {
        // Setup enhanced interactions
        this.setupEnhancedInteractions();
    }


    /**
     * Setup enhanced interactions
     */
    setupEnhancedInteractions() {
        // Add smooth scrolling
        this.setupSmoothScrolling();
    }


    /**
     * Setup smooth scrolling
     */
    setupSmoothScrolling() {
        // Smooth scroll for anchor links
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', (e) => {
                e.preventDefault();
                const target = document.querySelector(anchor.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });

    }



    /**
     * Setup user interactions
     */
    setupInteractions() {
        this.setupButtonInteractions();
        this.setupKeyboardNavigation();
        this.setupTouchInteractions();
    }

    /**
     * Setup button hover and focus effects
     */
    setupButtonInteractions() {
        const buttons = document.querySelectorAll('.social-link');
        
        buttons.forEach(button => {
            // Mouse events
            button.addEventListener('mouseenter', this.handleButtonHover);
            button.addEventListener('mouseleave', this.handleButtonLeave);
            
            // Focus events
            button.addEventListener('focus', this.handleButtonFocus);
            button.addEventListener('blur', this.handleButtonBlur);
            
            // Click events
            button.addEventListener('click', this.handleButtonClick);
        });
    }

    /**
     * Handle button hover
     */
    handleButtonHover = (e) => {
        if (!this.config.reducedMotion) {
            e.target.style.transform = 'translateY(-2px) scale(1.02)';
        }
    }

    /**
     * Handle button leave
     */
    handleButtonLeave = (e) => {
        if (!this.config.reducedMotion) {
            e.target.style.transform = 'translateY(0) scale(1)';
        }
    }

    /**
     * Handle button focus
     */
    handleButtonFocus = (e) => {
        e.target.style.outline = '2px solid var(--color-accent)';
        e.target.style.outlineOffset = '2px';
    }

    /**
     * Handle button blur
     */
    handleButtonBlur = (e) => {
        e.target.style.outline = 'none';
    }

    /**
     * Handle button click
     */
    handleButtonClick = (e) => {
        // Add click animation
        e.target.style.transform = 'scale(0.98)';
        setTimeout(() => {
            e.target.style.transform = '';
        }, 150);
        
        // Analytics tracking
        this.trackEvent('social_link_click', {
            platform: e.target.classList[1], // e.g., 'spotify', 'github'
            url: e.target.href
        });
    }

    /**
     * Setup keyboard navigation
     */
    setupKeyboardNavigation() {
        document.addEventListener('keydown', this.handleKeyboardNavigation);
    }

    /**
     * Handle keyboard navigation
     */
    handleKeyboardNavigation = (e) => {
        // Allow standard keyboard shortcuts
        if (e.ctrlKey || e.metaKey || e.altKey) {
            return;
        }

        switch (e.key) {
            case 'Escape':
                document.activeElement.blur();
                break;
            case 'Enter':
            case ' ':
                if (document.activeElement.classList.contains('social-link')) {
                    e.preventDefault();
                    document.activeElement.click();
                }
                break;
        }
    }

    /**
     * Setup touch interactions for mobile
     */
    setupTouchInteractions() {
        if (!this.state.isMobile) return;

        // Add touch feedback
        document.querySelectorAll('.social-link').forEach(link => {
            link.addEventListener('touchstart', (e) => {
                e.target.style.transform = 'scale(0.98)';
            });
            
            link.addEventListener('touchend', (e) => {
                setTimeout(() => {
                    e.target.style.transform = '';
                }, 150);
            });
        });
    }

    /**
     * Setup accessibility features
     */
    setupAccessibility() {
        this.setupARIA();
        this.setupFocusManagement();
        this.setupScreenReaderSupport();
    }

    /**
     * Setup ARIA attributes
     */
    setupARIA() {
        const main = document.querySelector('#main');
        if (main) {
            main.setAttribute('role', 'main');
            main.setAttribute('aria-label', 'Josee\'s personal bio and social links');
        }

        const nav = document.querySelector('.links-grid');
        if (nav) {
            nav.setAttribute('role', 'navigation');
            nav.setAttribute('aria-label', 'Social media and platform links');
        }

        // Add live region for dynamic content
        const liveRegion = document.createElement('div');
        liveRegion.setAttribute('aria-live', 'polite');
        liveRegion.setAttribute('aria-atomic', 'true');
        liveRegion.className = 'sr-only';
        liveRegion.id = 'live-region';
        document.body.appendChild(liveRegion);
    }

    /**
     * Setup focus management
     */
    setupFocusManagement() {
        const focusableElements = document.querySelectorAll(
            'a[href], button, [tabindex]:not([tabindex="-1"])'
        );
        
        // Trap focus in social links
        focusableElements.forEach((el, index) => {
            el.addEventListener('keydown', (e) => {
                if (e.key === 'Tab') {
                    if (e.shiftKey && index === 0) {
                        e.preventDefault();
                        focusableElements[focusableElements.length - 1].focus();
                    } else if (!e.shiftKey && index === focusableElements.length - 1) {
                        e.preventDefault();
                        focusableElements[0].focus();
                    }
                }
            });
        });
    }

    /**
     * Setup screen reader support
     */
    setupScreenReaderSupport() {
        // Announce page load to screen readers
        this.announceToScreenReader('Josee\'s bio page loaded');
        
        // Add loading states
        document.querySelectorAll('img').forEach(img => {
            img.addEventListener('load', () => {
                img.setAttribute('aria-label', 'Image loaded');
            });
            
            img.addEventListener('error', () => {
                img.setAttribute('aria-label', 'Image failed to load');
            });
        });
    }

    /**
     * Setup performance optimizations
     */
    setupPerformance() {
        this.setupLazyLoading();
        this.setupPreloading();
        this.setupServiceWorker();
    }

    /**
     * Setup lazy loading for images
     */
    setupLazyLoading() {
        if ('IntersectionObserver' in window) {
            const imageObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        if (img.dataset.src) {
                            img.src = img.dataset.src;
                            img.removeAttribute('data-src');
                            imageObserver.unobserve(img);
                        }
                    }
                });
            });

            document.querySelectorAll('img[data-src]').forEach(img => {
                imageObserver.observe(img);
            });
        }
    }

    /**
     * Setup preloading for critical resources
     */
    setupPreloading() {
        // Preload critical images
        const criticalImages = [
            'assets/images/profile.png',
            'assets/images/874253.jpg'
        ];

        criticalImages.forEach(src => {
            const link = document.createElement('link');
            link.rel = 'preload';
            link.as = 'image';
            link.href = src;
            document.head.appendChild(link);
        });
    }

    /**
     * Setup service worker for offline support
     */
    setupServiceWorker() {
        if ('serviceWorker' in navigator) {
            window.addEventListener('load', () => {
                navigator.serviceWorker.register('/sw.js')
                    .then(registration => {
                        console.log('SW registered: ', registration);
                    })
                    .catch(registrationError => {
                        console.log('SW registration failed: ', registrationError);
                    });
            });
        }
    }

    /**
     * Detect if device is mobile
     */
    detectMobile() {
        return window.innerWidth <= this.config.mobileBreakpoint || 
               /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    }

    /**
     * Debounce function for performance
     */
    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    /**
     * Announce message to screen readers
     */
    announceToScreenReader(message) {
        const liveRegion = document.getElementById('live-region');
        if (liveRegion) {
            liveRegion.textContent = message;
            setTimeout(() => {
                liveRegion.textContent = '';
            }, 1000);
        }
    }

    /**
     * Track analytics events
     */
    trackEvent(eventName, eventData = {}) {
        if (typeof gtag !== 'undefined') {
            gtag('event', eventName, eventData);
        }
        
        // Also track in console for development
        if (process.env.NODE_ENV === 'development') {
            console.log('Analytics Event:', eventName, eventData);
        }
    }

    /**
     * Get current state
     */
    getState() {
        return { ...this.state };
    }

    /**
     * Update configuration
     */
    updateConfig(newConfig) {
        this.config = { ...this.config, ...newConfig };
    }
}

/**
 * Utility functions
 */
const Utils = {
    /**
     * Check if element is in viewport
     */
    isInViewport(element) {
        const rect = element.getBoundingClientRect();
        return (
            rect.top >= 0 &&
            rect.left >= 0 &&
            rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
            rect.right <= (window.innerWidth || document.documentElement.clientWidth)
        );
    },

    /**
     * Get element offset from top
     */
    getOffsetTop(element) {
        let offsetTop = 0;
        do {
            if (!isNaN(element.offsetTop)) {
                offsetTop += element.offsetTop;
            }
        } while (element = element.offsetParent);
        return offsetTop;
    },

    /**
     * Smooth scroll to element
     */
    smoothScrollTo(element, offset = 0) {
        const targetPosition = Utils.getOffsetTop(element) - offset;
        window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
        });
    },

    /**
     * Format date
     */
    formatDate(date) {
        return new Intl.DateTimeFormat('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        }).format(date);
    }
};

/**
 * Initialize application when DOM is ready
 */
document.addEventListener('DOMContentLoaded', () => {
    // Initialize the application
    window.joseeBio = new JoseeBio();
    
    // Make utilities available globally
    window.Utils = Utils;
});

/**
 * Handle page load
 */
window.addEventListener('load', () => {
    // Add loaded class for any load-based animations
    document.body.classList.add('page-loaded');
    
    // Track page load
    if (window.joseeBio) {
        window.joseeBio.trackEvent('page_load', {
            loadTime: performance.now(),
            userAgent: navigator.userAgent,
            viewport: {
                width: window.innerWidth,
                height: window.innerHeight
            }
        });
    }
});

/**
 * Handle page visibility changes
 */
document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        document.body.classList.add('page-hidden');
    } else {
        document.body.classList.remove('page-hidden');
    }
});

/**
 * Handle online/offline status
 */
window.addEventListener('online', () => {
    document.body.classList.remove('offline');
    if (window.joseeBio) {
        window.joseeBio.announceToScreenReader('Connection restored');
    }
});

window.addEventListener('offline', () => {
    document.body.classList.add('offline');
    if (window.joseeBio) {
        window.joseeBio.announceToScreenReader('Connection lost - some features may be limited');
    }
});


/**
 * Export for module systems
 */
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { JoseeBio, Utils };
}
