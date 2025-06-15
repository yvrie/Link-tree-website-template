/**
 * Main application initialization and utilities
 * Handles browser detection, DOM manipulation, and core functionality
 */
(function() {
	// DOM utility functions
	const on = addEventListener;
	const off = removeEventListener;
	const $ = (selector) => document.querySelector(selector);
	const $$ = (selector) => document.querySelectorAll(selector);
	const $body = document.body;
	const $inner = $('.inner');

	// Browser and device detection
	const client = (function() {
		const clientInfo = {
			browser: 'other',
			browserVersion: 0,
			os: 'other',
			osVersion: 0,
			mobile: false,
			canUse: null,
			flags: {
				lsdUnits: false,
			},
		};

		const userAgent = navigator.userAgent;
		
		// Browser detection patterns
		const browserPatterns = [
			['firefox', /Firefox\/([0-9\.]+)/],
			['edge', /Edge\/([0-9\.]+)/],
			['safari', /Version\/([0-9\.]+).+Safari/],
			['chrome', /Chrome\/([0-9\.]+)/],
			['chrome', /CriOS\/([0-9\.]+)/],
			['ie', /Trident\/.+rv:([0-9]+)/]
		];

		// Detect browser and version
		for (const [browser, pattern] of browserPatterns) {
			if (userAgent.match(pattern)) {
				clientInfo.browser = browser;
				clientInfo.browserVersion = parseFloat(RegExp.$1);
				break;
			}
		}

		// OS detection patterns
		const osPatterns = [
			['ios', /([0-9_]+) like Mac OS X/, v => v.replace('_', '.').replace('_', '')],
			['ios', /CPU like Mac OS X/, () => 0],
			['ios', /iPad; CPU/, () => 0],
			['android', /Android ([0-9\.]+)/, null],
			['mac', /Macintosh.+Mac OS X ([0-9_]+)/, v => v.replace('_', '.').replace('_', '')],
			['windows', /Windows NT ([0-9\.]+)/, null],
			['undefined', /Undefined/, null]
		];

		// Detect OS and version
		for (const [os, pattern, versionParser] of osPatterns) {
			if (userAgent.match(pattern)) {
				clientInfo.os = os;
				clientInfo.osVersion = parseFloat(versionParser ? versionParser(RegExp.$1) : RegExp.$1);
				break;
			}
		}

		// iPad detection hack
		if (clientInfo.os === 'mac' && 'ontouchstart' in window) {
			const isIPad = (
				(screen.width === 1024 && screen.height === 1366) || // 12.9"
				(screen.width === 834 && screen.height === 1112) ||  // 10.2"
				(screen.width === 810 && screen.height === 1080) ||  // 9.7"
				(screen.width === 768 && screen.height === 1024)     // Legacy
			);
			if (isIPad) clientInfo.os = 'ios';
		}

		// Mobile detection
		clientInfo.mobile = (clientInfo.os === 'android' || clientInfo.os === 'ios');

		// Feature detection utility
		const testElement = document.createElement('div');
		clientInfo.canUse = (property, value) => {
			const style = testElement.style;
			if (!(property in style)) return false;
			if (typeof value !== 'undefined') {
				style[property] = value;
				if (style[property] === '') return false;
			}
			return true;
		};

		// Set feature flags
		clientInfo.flags.lsdUnits = clientInfo.canUse('width', '100dvw');

		return clientInfo;
	})();

	// Event utilities
	const trigger = (eventName) => dispatchEvent(new Event(eventName));

	// CSS utilities
	const cssRules = (selectorText) => {
		const rules = [];
		const processStylesheet = (stylesheet) => {
			const rules = stylesheet.cssRules;
			for (let i = 0; i < rules.length; i++) {
				if (rules[i] instanceof CSSMediaRule && matchMedia(rules[i].conditionText).matches) {
					processStylesheet(rules[i]);
				} else if (rules[i] instanceof CSSStyleRule && rules[i].selectorText === selectorText) {
					rules.push(rules[i]);
				}
			}
		};

		for (const stylesheet of document.styleSheets) {
			processStylesheet(stylesheet);
		}
		return rules;
	};

	// HTML utilities
	const escapeHtml = (str) => {
		if (str === '' || str === null || str === undefined) return '';
		
		const htmlEntities = {
			'&': '&amp;',
			'<': '&lt;',
			'>': '&gt;',
			'"': '&quot;',
			"'": '&#39;',
		};

		return str.replace(/[&<>"']/g, char => htmlEntities[char]);
	};

	// Hash utilities
	const thisHash = () => {
		const hash = location.hash ? location.hash.substring(1) : null;
		if (!hash) return null;

		if (hash.match(/\?/)) {
			const [hashPart, queryPart] = hash.split('?');
			history.replaceState(undefined, undefined, '#' + hashPart);
			window.location.search = queryPart;
			return hashPart;
		}

		return hash;
	};

	// Load elements.
	// Load elements (if needed).
		loadElements(document.body);

	// Browser hacks.
	// Init.
		var style, sheet, rule;
	
	// Mobile.
	if (client.mobile) {

		// Prevent overscrolling on Safari/other mobile browsers.
		// 'vh' units don't factor in the heights of various browser UI elements so our page ends up being
		// a lot taller than it needs to be (resulting in overscroll and issues with vertical centering).
			(function() {

				// Lsd units available?
					if (client.flags.lsdUnits) {

						document.documentElement.style.setProperty('--viewport-height', '100svh');
						document.documentElement.style.setProperty('--background-height', '100lvh');

					}

				// Otherwise, use innerHeight hack.
					else {

						var f = function() {
							document.documentElement.style.setProperty('--viewport-height', window.innerHeight + 'px');
							document.documentElement.style.setProperty('--background-height', (window.innerHeight + 250) + 'px');
						};

						on('load', f);
						on('orientationchange', function() {

							// Update after brief delay.
								setTimeout(function() {
									(f)();
								}, 100);

						});

					}

			})();

	}

	// Android.
	if (client.os == 'android') {

		// Prevent background "jump" when address bar shrinks.
		// Specifically, this fix forces the background pseudoelement to a fixed height based on the physical
		// screen size instead of relying on "vh" (which is subject to change when the scrollbar shrinks/grows).
			(function() {

				// Insert and get rule.
					sheet.insertRule('body::after { }', 0);
					rule = sheet.cssRules[0];

				// Event.
					var f = function() {
						rule.style.cssText = 'height: ' + (Math.max(screen.width, screen.height)) + 'px';
					};

					on('load', f);
					on('orientationchange', f);
					on('touchmove', f);

			})();

		// Apply "is-touch" class to body.
			$body.classList.add('is-touch');

	}

	// iOS.
	else if (client.os == 'ios') {

		// <=11: Prevent white bar below background when address bar shrinks.
		// For some reason, simply forcing GPU acceleration on the background pseudoelement fixes this.
			if (client.osVersion <= 11)
				(function() {

					// Insert and get rule.
						sheet.insertRule('body::after { }', 0);
						rule = sheet.cssRules[0];

					// Set rule.
						rule.style.cssText = '-webkit-transform: scale(1.0)';

				})();

		// <=11: Prevent white bar below background when form inputs are focused.
		// Fixed-position elements seem to lose their fixed-ness when this happens, which is a problem
		// because our backgrounds fall into this category.
			if (client.osVersion <= 11)
				(function() {

					// Insert and get rule.
						sheet.insertRule('body.ios-focus-fix::before { }', 0);
						rule = sheet.cssRules[0];

					// Set rule.
						rule.style.cssText = 'height: calc(100% + 60px)';

					// Add event listeners.
						on('focus', function(event) {
							$body.classList.add('ios-focus-fix');
						}, true);

							on('blur', function(event) {
								$body.classList.remove('ios-focus-fix');
							}, true);

				})();

		// Apply "is-touch" class to body.
			$body.classList.add('is-touch');

	}

	// Scroll events.
	var scrollEvents = {
	
		/**
		 * Items.
		 * @var {array}
		 */
		items: [],
	
		/**
		 * Adds an event.
		 * @param {object} o Options.
		 */
		add: function(o) {

			this.items.push({
				element: o.element,
				triggerElement: (('triggerElement' in o && o.triggerElement) ? o.triggerElement : o.element),
				enter: ('enter' in o ? o.enter : null),
				leave: ('leave' in o ? o.leave : null),
				mode: ('mode' in o ? o.mode : 4),
				threshold: ('threshold' in o ? o.threshold : 0.25),
				offset: ('offset' in o ? o.offset : 0),
				initialState: ('initialState' in o ? o.initialState : null),
				state: false,
			});

		},
	
		/**
		 * Handler.
		 */
		handler: function() {

			var	height, top, bottom, scrollPad;

			// Determine values.
				if (client.os == 'ios') {

					height = document.documentElement.clientHeight;
					top = document.body.scrollTop + window.scrollY;
					bottom = top + height;
					scrollPad = 125;

				}
				else {

					height = document.documentElement.clientHeight;
					top = document.documentElement.scrollTop;
					bottom = top + height;
					scrollPad = 0;

				}

			// Step through items.
				scrollEvents.items.forEach(function(item) {

					var	elementTop, elementBottom, viewportTop, viewportBottom,
						bcr, pad, state, a, b;

					// No enter/leave handlers? Bail.
						if (!item.enter
						&&	!item.leave)
							return true;

					// No trigger element? Bail.
						if (!item.triggerElement)
							return true;

					// Trigger element not visible?
						if (item.triggerElement.offsetParent === null) {

							// Current state is active *and* leave handler exists?
								if (item.state == true
								&&	item.leave) {

									// Reset state to false.
										item.state = false;

									// Call it.
										(item.leave).apply(item.element);

									// No enter handler? Unbind leave handler (so we don't check this element again).
										if (!item.enter)
											item.leave = null;

								}

							// Bail.
								return true;

						}

					// Get element position.
						bcr = item.triggerElement.getBoundingClientRect();
						elementTop = top + Math.floor(bcr.top);
						elementBottom = elementTop + bcr.height;

					// Determine state.

						// Initial state exists?
							if (item.initialState !== null) {

								// Use it for this check.
									state = item.initialState;

								// Clear it.
									item.initialState = null;

							}

						// Otherwise, determine state from mode/position.
							else {

								switch (item.mode) {

									// Element falls within viewport.
										case 1:
										default:

											// State.
												state = (bottom > (elementTop - item.offset) && top < (elementBottom + item.offset));

											break;

									// Viewport midpoint falls within element.
										case 2:

											// Midpoint.
												a = (top + (height * 0.5));

											// State.
												state = (a > (elementTop - item.offset) && a < (elementBottom + item.offset));

											break;

									// Viewport midsection falls within element.
										case 3:

											// Upper limit (25%-).
												a = top + (height * (item.threshold));

												if (a - (height * 0.375) <= 0)
													a = 0;

											// Lower limit (-75%).
												b = top + (height * (1 - item.threshold));

												if (b + (height * 0.375) >= document.body.scrollHeight - scrollPad)
													b = document.body.scrollHeight + scrollPad;

											// State.
												state = (b > (elementTop - item.offset) && a < (elementBottom + item.offset));

											break;

									// Viewport intersects with element.
										case 4:

											// Calculate pad, viewport top, viewport bottom.
												pad = height * item.threshold;
												viewportTop = (top + pad);
												viewportBottom = (bottom - pad);

											// Compensate for elements at the very top or bottom of the page.
												if (Math.floor(top) <= pad)
													viewportTop = top;

												if (Math.ceil(bottom) >= (document.body.scrollHeight - pad))
													viewportBottom = bottom;

											// Element is smaller than viewport?
												if ((viewportBottom - viewportTop) >= (elementBottom - elementTop)) {

													state =	(
															(elementTop >= viewportTop && elementBottom <= viewportBottom)
														||	(elementTop >= viewportTop && elementTop <= viewportBottom)
														||	(elementBottom >= viewportTop && elementBottom <= viewportBottom)
													);

												}

											// Otherwise, viewport is smaller than element.
												else
													state =	(
															(viewportTop >= elementTop && viewportBottom <= elementBottom)
														||	(elementTop >= viewportTop && elementTop <= viewportBottom)
														||	(elementBottom >= viewportTop && elementBottom <= viewportBottom)
													);

											break;

								}

							}

					// State changed?
						if (state != item.state) {

							// Update state.
								item.state = state;

							// Call handler.
								if (item.state) {

									// Enter handler exists?
										if (item.enter) {

											// Call it.
												(item.enter).apply(item.element);

											// No leave handler? Unbind enter handler (so we don't check this element again).
												if (!item.leave)
													item.enter = null;

										}

								}
								else {

									// Leave handler exists?
										if (item.leave) {

											// Call it.
												(item.leave).apply(item.element);

											// No enter handler? Unbind leave handler (so we don't check this element again).
												if (!item.enter)
													item.leave = null;

										}

								}

						}

				});

		},
	
		/**
		 * Initializes scroll events.
		 */
		init: function() {

			// Bind handler to events.
				on('load', this.handler);
				on('resize', this.handler);
				on('scroll', this.handler);

			// Do initial handler call.
				(this.handler)();

		}
	};
	
	// Initialize.
		scrollEvents.init();

	// "On Visible" animation.
	var onvisible = {
	
		/**
		 * Effects.
		 * @var {object}
		 */
		effects: {
			'blur-in': {
				transition: function (speed, delay) {
					return  'opacity ' + speed + 's ease' + (delay ? ' ' + delay + 's' : '') + ', ' +
							'filter ' + speed + 's ease' + (delay ? ' ' + delay + 's' : '');
				},
				rewind: function(intensity) {
					this.style.opacity = 0;
					this.style.filter = 'blur(' + (0.25 * intensity) + 'rem)';
				},
				play: function() {
					this.style.opacity = 1;
					this.style.filter = 'none';
				},
			},
			'zoom-in': {
				transition: function (speed, delay) {
					return  'opacity ' + speed + 's ease' + (delay ? ' ' + delay + 's' : '') + ', ' +
							'transform ' + speed + 's ease' + (delay ? ' ' + delay + 's' : '');
				},
				rewind: function(intensity, alt) {
					this.style.opacity = 0;
					this.style.transform = 'scale(' + (1 - ((alt ? 0.25 : 0.05) * intensity)) + ')';
				},
				play: function() {
					this.style.opacity = 1;
					this.style.transform = 'none';
				},
			},
			'zoom-out': {
				transition: function (speed, delay) {
					return  'opacity ' + speed + 's ease' + (delay ? ' ' + delay + 's' : '') + ', ' +
							'transform ' + speed + 's ease' + (delay ? ' ' + delay + 's' : '');
				},
				rewind: function(intensity, alt) {
					this.style.opacity = 0;
					this.style.transform = 'scale(' + (1 + ((alt ? 0.25 : 0.05) * intensity)) + ')';
				},
				play: function() {
					this.style.opacity = 1;
					this.style.transform = 'none';
				},
			},
			'slide-left': {
				transition: function (speed, delay) {
					return 'transform ' + speed + 's ease' + (delay ? ' ' + delay + 's' : '');
				},
				rewind: function() {
					this.style.transform = 'translateX(100vw)';
				},
				play: function() {
					this.style.transform = 'none';
				},
			},
			'slide-right': {
				transition: function (speed, delay) {
					return 'transform ' + speed + 's ease' + (delay ? ' ' + delay + 's' : '');
				},
				rewind: function() {
					this.style.transform = 'translateX(-100vw)';
				},
				play: function() {
					this.style.transform = 'none';
				},
			},
			'flip-forward': {
				transition: function (speed, delay) {
					return  'opacity ' + speed + 's ease' + (delay ? ' ' + delay + 's' : '') + ', ' +
							'transform ' + speed + 's ease' + (delay ? ' ' + delay + 's' : '');
				},
				rewind: function(intensity, alt) {
					this.style.opacity = 0;
					this.style.transformOrigin = '50% 50%';
					this.style.transform = 'perspective(1000px) rotateX(' + ((alt ? 45 : 15) * intensity) + 'deg)';
				},
				play: function() {
					this.style.opacity = 1;
					this.style.transform = 'none';
				},
			},
			'flip-backward': {
				transition: function (speed, delay) {
					return  'opacity ' + speed + 's ease' + (delay ? ' ' + delay + 's' : '') + ', ' +
							'transform ' + speed + 's ease' + (delay ? ' ' + delay + 's' : '');
				},
				rewind: function(intensity, alt) {
					this.style.opacity = 0;
					this.style.transformOrigin = '50% 50%';
					this.style.transform = 'perspective(1000px) rotateX(' + ((alt ? -45 : -15) * intensity) + 'deg)';
				},
				play: function() {
					this.style.opacity = 1;
					this.style.transform = 'none';
				},
			},
			'flip-left': {
				transition: function (speed, delay) {
					return  'opacity ' + speed + 's ease' + (delay ? ' ' + delay + 's' : '') + ', ' +
							'transform ' + speed + 's ease' + (delay ? ' ' + delay + 's' : '');
				},
				rewind: function(intensity, alt) {
					this.style.opacity = 0;
					this.style.transformOrigin = '50% 50%';
					this.style.transform = 'perspective(1000px) rotateY(' + ((alt ? 45 : 15) * intensity) + 'deg)';
				},
				play: function() {
					this.style.opacity = 1;
					this.style.transform = 'none';
				},
			},
			'flip-right': {
				transition: function (speed, delay) {
					return  'opacity ' + speed + 's ease' + (delay ? ' ' + delay + 's' : '') + ', ' +
							'transform ' + speed + 's ease' + (delay ? ' ' + delay + 's' : '');
				},
				rewind: function(intensity, alt) {
					this.style.opacity = 0;
					this.style.transformOrigin = '50% 50%';
					this.style.transform = 'perspective(1000px) rotateY(' + ((alt ? -45 : -15) * intensity) + 'deg)';
				},
				play: function() {
					this.style.opacity = 1;
					this.style.transform = 'none';
				},
			},
			'tilt-left': {
				transition: function (speed, delay) {
					return  'opacity ' + speed + 's ease' + (delay ? ' ' + delay + 's' : '') + ', ' +
							'transform ' + speed + 's ease' + (delay ? ' ' + delay + 's' : '');
				},
				rewind: function(intensity, alt) {
					this.style.opacity = 0;
					this.style.transform = 'rotate(' + ((alt ? 45 : 5) * intensity) + 'deg)';
				},
				play: function() {
					this.style.opacity = 1;
					this.style.transform = 'none';
				},
			},
			'tilt-right': {
				transition: function (speed, delay) {
					return  'opacity ' + speed + 's ease' + (delay ? ' ' + delay + 's' : '') + ', ' +
							'transform ' + speed + 's ease' + (delay ? ' ' + delay + 's' : '');
				},
				rewind: function(intensity, alt) {
					this.style.opacity = 0;
					this.style.transform = 'rotate(' + ((alt ? -45 : -5) * intensity) + 'deg)';
				},
				play: function() {
					this.style.opacity = 1;
					this.style.transform = 'none';
				},
			},
			'fade-right': {
				transition: function (speed, delay) {
					return  'opacity ' + speed + 's ease' + (delay ? ' ' + delay + 's' : '') + ', ' +
							'transform ' + speed + 's ease' + (delay ? ' ' + delay + 's' : '');
				},
				rewind: function(intensity) {
					this.style.opacity = 0;
					this.style.transform = 'translateX(' + (-1.5 * intensity) + 'rem)';
				},
				play: function() {
					this.style.opacity = 1;
					this.style.transform = 'none';
				},
			},
			'fade-left': {
				transition: function (speed, delay) {
					return  'opacity ' + speed + 's ease' + (delay ? ' ' + delay + 's' : '') + ', ' +
							'transform ' + speed + 's ease' + (delay ? ' ' + delay + 's' : '');
				},
				rewind: function(intensity) {
					this.style.opacity = 0;
					this.style.transform = 'translateX(' + (1.5 * intensity) + 'rem)';
				},
				play: function() {
					this.style.opacity = 1;
					this.style.transform = 'none';
				},
			},
			'fade-down': {
				transition: function (speed, delay) {
					return  'opacity ' + speed + 's ease' + (delay ? ' ' + delay + 's' : '') + ', ' +
							'transform ' + speed + 's ease' + (delay ? ' ' + delay + 's' : '');
				},
				rewind: function(intensity) {
					this.style.opacity = 0;
					this.style.transform = 'translateY(' + (-1.5 * intensity) + 'rem)';
				},
				play: function() {
					this.style.opacity = 1;
					this.style.transform = 'none';
				},
			},
			'fade-up': {
				transition: function (speed, delay) {
					return  'opacity ' + speed + 's ease' + (delay ? ' ' + delay + 's' : '') + ', ' +
							'transform ' + speed + 's ease' + (delay ? ' ' + delay + 's' : '');
				},
				rewind: function(intensity) {
					this.style.opacity = 0;
					this.style.transform = 'translateY(' + (1.5 * intensity) + 'rem)';
				},
				play: function() {
					this.style.opacity = 1;
					this.style.transform = 'none';
				},
			},
			'fade-in': {
				transition: function (speed, delay) {
					return 'opacity ' + speed + 's ease' + (delay ? ' ' + delay + 's' : '');
				},
				rewind: function() {
					this.style.opacity = 0;
				},
				play: function() {
					this.style.opacity = 1;
				},
			},
			'fade-in-background': {
				custom: true,
				transition: function (speed, delay) {

					this.style.setProperty('--onvisible-speed', speed + 's');

					if (delay)
						this.style.setProperty('--onvisible-delay', delay + 's');

				},
				rewind: function() {
					this.style.removeProperty('--onvisible-background-color');
				},
				play: function() {
					this.style.setProperty('--onvisible-background-color', 'rgba(0,0,0,0.001)');
				},
			},
			'zoom-in-image': {
				target: 'img',
				transition: function (speed, delay) {
					return 'transform ' + speed + 's ease' + (delay ? ' ' + delay + 's' : '');
				},
				rewind: function() {
					this.style.transform = 'scale(1)';
				},
				play: function(intensity) {
					this.style.transform = 'scale(' + (1 + (0.1 * intensity)) + ')';
				},
			},
			'zoom-out-image': {
				target: 'img',
				transition: function (speed, delay) {
					return 'transform ' + speed + 's ease' + (delay ? ' ' + delay + 's' : '');
				},
				rewind: function(intensity) {
					this.style.transform = 'scale(' + (1 + (0.1 * intensity)) + ')';
				},
				play: function() {
					this.style.transform = 'none';
				},
			},
			'focus-image': {
				target: 'img',
				transition: function (speed, delay) {
					return  'transform ' + speed + 's ease' + (delay ? ' ' + delay + 's' : '') + ', ' +
							'filter ' + speed + 's ease' + (delay ? ' ' + delay + 's' : '');
				},
				rewind: function(intensity) {
					this.style.transform = 'scale(' + (1 + (0.05 * intensity)) + ')';
					this.style.filter = 'blur(' + (0.25 * intensity) + 'rem)';
				},
				play: function(intensity) {
					this.style.transform = 'none';
					this.style.filter = 'none';
				},
			},
			'wipe-up': {
				transition: function (speed, delay) {
					return	'mask-size ' + speed + 's ease' + (delay ? ' ' + delay + 's' : '');
				},
				rewind: function(intensity) {
					this.style.maskComposite = 'exclude';
					this.style.maskRepeat = 'no-repeat';
					this.style.maskImage = 'linear-gradient(0deg, black 100%, transparent 100%)';
					this.style.maskPosition = '0% 100%';
					this.style.maskSize = '100% 0%';
				},
				play: function() {
					this.style.maskSize = '110% 110%';
				},
			},
			'wipe-down': {
				transition: function (speed, delay) {
					return	'mask-size ' + speed + 's ease' + (delay ? ' ' + delay + 's' : '');
				},
				rewind: function(intensity) {
					this.style.maskComposite = 'exclude';
					this.style.maskRepeat = 'no-repeat';
					this.style.maskImage = 'linear-gradient(0deg, black 100%, transparent 100%)';
					this.style.maskPosition = '0% 0%';
					this.style.maskSize = '100% 0%';
				},
				play: function() {
					this.style.maskSize = '110% 110%';
				},
			},
			'wipe-left': {
				transition: function (speed, delay) {
					return	'mask-size ' + speed + 's ease' + (delay ? ' ' + delay + 's' : '');
				},
				rewind: function(intensity) {
					this.style.maskComposite = 'exclude';
					this.style.maskRepeat = 'no-repeat';
					this.style.maskImage = 'linear-gradient(90deg, black 100%, transparent 100%)';
					this.style.maskPosition = '100% 0%';
					this.style.maskSize = '0% 100%';
				},
				play: function() {
					this.style.maskSize = '110% 110%';
				},
			},
			'wipe-right': {
				transition: function (speed, delay) {
					return	'mask-size ' + speed + 's ease' + (delay ? ' ' + delay + 's' : '');
				},
				rewind: function(intensity) {
					this.style.maskComposite = 'exclude';
					this.style.maskRepeat = 'no-repeat';
					this.style.maskImage = 'linear-gradient(90deg, black 100%, transparent 100%)';
					this.style.maskPosition = '0% 0%';
					this.style.maskSize = '0% 100%';
				},
				play: function() {
					this.style.maskSize = '110% 110%';
				},
			},
			'wipe-diagonal': {
				transition: function (speed, delay) {
					return	'mask-size ' + speed + 's ease' + (delay ? ' ' + delay + 's' : '');
				},
				rewind: function(intensity) {
					this.style.maskComposite = 'exclude';
					this.style.maskRepeat = 'no-repeat';
					this.style.maskImage = 'linear-gradient(45deg, black 50%, transparent 50%)';
					this.style.maskPosition = '0% 100%';
					this.style.maskSize = '0% 0%';
				},
				play: function() {
					this.style.maskSize = '220% 220%';
				},
			},
			'wipe-reverse-diagonal': {
				transition: function (speed, delay) {
					return	'mask-size ' + speed + 's ease' + (delay ? ' ' + delay + 's' : '');
				},
				rewind: function(intensity) {
					this.style.maskComposite = 'exclude';
					this.style.maskRepeat = 'no-repeat';
					this.style.maskImage = 'linear-gradient(135deg, transparent 50%, black 50%)';
					this.style.maskPosition = '100% 100%';
					this.style.maskSize = '0% 0%';
				},
				play: function() {
					this.style.maskSize = '220% 220%';
				},
			},
		},
	
		/**
		 * Regex.
		 * @var {RegExp}
		 */
		regex: new RegExp('([a-zA-Z0-9\.\,\-\_\"\'\?\!\:\;\#\@\#$\%\&\(\)\{\}]+)', 'g'),
	
		/**
		 * Adds one or more animatable elements.
		 * @param {string} selector Selector.
		 * @param {object} settings Settings.
		 */
		add: function(selector, settings) {

			var	_this = this,
				style = settings.style in this.effects ? settings.style : 'fade',
				speed = parseInt('speed' in settings ? settings.speed : 1000) / 1000,
				intensity = ((parseInt('intensity' in settings ? settings.intensity : 5) / 10) * 1.75) + 0.25,
				delay = parseInt('delay' in settings ? settings.delay : 0) / 1000,
				replay = 'replay' in settings ? settings.replay : false,
				stagger = 'stagger' in settings ? (parseInt(settings.stagger) >= 0 ? (parseInt(settings.stagger) / 1000) : false) : false,
				staggerOrder = 'staggerOrder' in settings ? settings.staggerOrder : 'default',
				staggerSelector = 'staggerSelector' in settings ? settings.staggerSelector : null,
				threshold = parseInt('threshold' in settings ? settings.threshold : 3),
				state = 'state' in settings ? settings.state : null,
				effect = this.effects[style],
				scrollEventThreshold;

			// Determine scroll event threshold.
				switch (threshold) {

					case 1:
						scrollEventThreshold = 0;
						break;

					case 2:
						scrollEventThreshold = 0.125;
						break;

					default:
					case 3:
						scrollEventThreshold = 0.25;
						break;

					case 4:
						scrollEventThreshold = 0.375;
						break;

					case 5:
						scrollEventThreshold = 0.475;
						break;

				}

			// Step through selected elements.
				$$(selector).forEach(function(e) {

					var children, enter, leave, targetElement, triggerElement;

					// Stagger in use, and stagger selector is "all children"? Expand text nodes.
						if (stagger !== false
						&&	staggerSelector == ':scope > *')
							_this.expandTextNodes(e);

					// Get children.
						children = (stagger !== false && staggerSelector) ? e.querySelectorAll(staggerSelector) : null;

					// Define handlers.
						enter = function(staggerDelay=0) {

							var _this = this,
								transitionOrig;

							// Target provided? Use it instead of element.
								if (effect.target)
									_this = this.querySelector(effect.target);

							// Not a custom effect?
								if (!effect.custom) {

									// Save original transition.
										transitionOrig = _this.style.transition;

									// Apply temporary styles.
										_this.style.setProperty('backface-visibility', 'hidden');

									// Apply transition.
										_this.style.transition = effect.transition(speed, delay + staggerDelay);

								}

							// Otherwise, call custom transition handler.
								else
									effect.transition.apply(_this, [speed, delay + staggerDelay]);

							// Play.
								effect.play.apply(_this, [intensity, !!children]);

							// Not a custom effect?
								if (!effect.custom)
									setTimeout(function() {

										// Remove temporary styles.
											_this.style.removeProperty('backface-visibility');

										// Restore original transition.
											_this.style.transition = transitionOrig;

									}, (speed + delay + staggerDelay) * 1000 * 2);

						};

						leave = function() {

							var _this = this,
								transitionOrig;

							// Target provided? Use it instead of element.
								if (effect.target)
									_this = this.querySelector(effect.target);

							// Not a custom effect?
								if (!effect.custom) {

									// Save original transition.
										transitionOrig = _this.style.transition;

									// Apply temporary styles.
										_this.style.setProperty('backface-visibility', 'hidden');

									// Apply transition.
										_this.style.transition = effect.transition(speed);

								}

							// Otherwise, call custom transition handler.
								else
									effect.transition.apply(_this, [speed]);

							// Rewind.
								effect.rewind.apply(_this, [intensity, !!children]);

							// Not a custom effect?
								if (!effect.custom)
									setTimeout(function() {

										// Remove temporary styles.
											_this.style.removeProperty('backface-visibility');

										// Restore original transition.
											_this.style.transition = transitionOrig;

									}, speed * 1000 * 2);

						};

					// Initial rewind.

						// Determine target element.
							if (effect.target)
								targetElement = e.querySelector(effect.target);
							else
								targetElement = e;

						// Children? Rewind each individually.
							if (children)
								children.forEach(function(targetElement) {
									effect.rewind.apply(targetElement, [intensity, true]);
								});

						// Otherwise. just rewind element.
							else
								effect.rewind.apply(targetElement, [intensity]);

					// Determine trigger element.
						triggerElement = e;

						// Has a parent?
							if (e.parentNode) {

								// Parent is an onvisible trigger? Use it.
									if (e.parentNode.dataset.onvisibleTrigger)
										triggerElement = e.parentNode;

								// Otherwise, has a grandparent?
									else if (e.parentNode.parentNode) {

										// Grandparent is an onvisible trigger? Use it.
											if (e.parentNode.parentNode.dataset.onvisibleTrigger)
												triggerElement = e.parentNode.parentNode;

									}

							}

					// Add scroll event.
						scrollEvents.add({
							element: e,
							triggerElement: triggerElement,
							initialState: state,
							threshold: scrollEventThreshold,
							enter: children ? function() {

								var staggerDelay = 0,
									childHandler = function(e) {

										// Apply enter handler.
											enter.apply(e, [staggerDelay]);

										// Increment stagger delay.
											staggerDelay += stagger;

									},
									a;

								// Default stagger order?
									if (staggerOrder == 'default') {

										// Apply child handler to children.
											children.forEach(childHandler);

									}

								// Otherwise ...
									else {

										// Convert children to an array.
											a = Array.from(children);

										// Sort array based on stagger order.
											switch (staggerOrder) {

												case 'reverse':

													// Reverse array.
														a.reverse();

													break;

												case 'random':

													// Randomly sort array.
														a.sort(function() {
															return Math.random() - 0.5;
														});

													break;

											}

										// Apply child handler to array.
											a.forEach(childHandler);

									}

							} : enter,
							leave: (replay ? (children ? function() {

								// Step through children.
									children.forEach(function(e) {

										// Apply leave handler.
											leave.apply(e);

									});

							} : leave) : null),
						});

				});

		},
	
		/**
		 * Expand text nodes within an element into <text-node> elements.
		 * @param {DOMElement} e Element.
		 */
		expandTextNodes: function(e) {

			var s, i, w, x;

			// Step through child nodes.
				for (i = 0; i < e.childNodes.length; i++) {

					// Get child node.
						x = e.childNodes[i];

					// Not a text node? Skip.
						if (x.nodeType != Node.TEXT_NODE)
							continue;

					// Get node value.
						s = x.nodeValue;

					// Convert to <text-node>.
						s = s.replace(
							this.regex,
							function(x, a) {
								return '<text-node>' + escapeHtml(a) + '</text-node>';
							}
						);

					// Update.

						// Create wrapper.
							w = document.createElement('text-node');

						// Populate with processed text.
						// This converts our processed text into a series of new text and element nodes.
							w.innerHTML = s;

						// Replace original element with wrapper.
							x.replaceWith(w);

						// Step through wrapper's children.
							while (w.childNodes.length > 0) {

								// Move child after wrapper.
									w.parentNode.insertBefore(
										w.childNodes[0],
										w
									);

							}

						// Remove wrapper (now that it's no longer needed).
							w.parentNode.removeChild(w);

					}

			},
	
	};

	// Initialize "On Visible" animations.
		onvisible.add('#image01', { style: 'fade-in', speed: 1000, intensity: 5, threshold: 3, delay: 0, replay: false });
		onvisible.add('#text03', { style: 'fade-up', speed: 1000, intensity: 7, threshold: 3, delay: 1000, stagger: 1750, staggerSelector: ':scope > *', replay: false });
		onvisible.add('#text04', { style: 'fade-up', speed: 1250, intensity: 5, threshold: 3, delay: 1250, replay: false });
		onvisible.add('#divider02', { style: 'fade-in', speed: 1500, intensity: 5, threshold: 3, delay: 1500, replay: false });
		onvisible.add('#buttons01', { style: 'fade-up', speed: 1500, intensity: 5, threshold: 3, delay: 1500, replay: false });

})();