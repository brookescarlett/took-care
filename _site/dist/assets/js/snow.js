/*!-----------------------------------------------------------------
  Name: Snow - Minimal & Clean Portfolio HTML Template
  Version: 1.1.0
  Author: nK, unvab
  Website: https://nkdev.info, http://unvab.com/
  Purchase: https://nkdev.info
  Support: https://nk.ticksy.com
  License: You must have a valid license purchased only from ThemeForest (the above link) in order to legally use the theme for your project.
  Copyright 2017.
-------------------------------------------------------------------*/
;(function() {
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/*------------------------------------------------------------------

  Theme Options

-------------------------------------------------------------------*/
var options = {
    enableShortcuts: true,
    scrollToAnchorSpeed: 700,
    parallaxSpeed: 0.8,

    templates: {
        secondaryNavbarBackItem: 'Back',

        plainVideoIcon: '<span class="nk-video-icon"><span><span class="nk-play-icon"></span></span></span>',
        plainVideoLoadIcon: '<span class="nk-loading-spinner"><i></i></span>',
        fullscreenVideoClose: '<span class="nk-icon-close"></span>',

        instagram: '<div class="col-3">\n                <a href="{{link}}" target="_blank">\n                    <img src="{{image}}" alt="{{caption}}" class="nk-img-stretch">\n                </a>\n            </div>',
        instagramLoadingText: 'Loading...',
        instagramFailText: 'Failed to fetch data',
        instagramApiPath: 'php/instagram/instagram.php',

        twitter: '<div class="nk-twitter">\n                <span class="nk-twitter-icon fa fa-twitter"></span>\n                <div class="nk-twitter-text">\n                   {{tweet}}\n                </div>\n            </div>',
        twitterLoadingText: 'Loading...',
        twitterFailText: 'Failed to fetch data',
        twitterApiPath: 'php/twitter/tweet.php'
    },

    shortcuts: {
        closeFullscreenVideo: 'esc',

        postScrollToComments: 'c',

        toggleSideLeftNavbar: 'alt+l',
        openSideLeftNavbar: '',
        closeSideLeftNavbar: 'esc',

        toggleSideRightNavbar: 'alt+r',
        openSideRightNavbar: '',
        closeSideRightNavbar: 'esc',

        toggleFullscreenNavbar: 'alt+f',
        openFullscreenNavbar: '',
        closeFullscreenNavbar: 'esc'
    }
};

/*------------------------------------------------------------------

  Utility

-------------------------------------------------------------------*/
var $ = jQuery;
var tween = window.TweenMax;
var isIOs = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
var isMobile = /Android|iPhone|iPad|iPod|BlackBerry|Windows Phone/g.test(navigator.userAgent || navigator.vendor || window.opera);
var isTouch = 'ontouchstart' in window || window.DocumentTouch && document instanceof DocumentTouch;

// add 'is-mobile' or 'is-desktop' classname to html tag
$('html').addClass(isMobile ? 'is-mobile' : 'is-desktop');

/**
 * window size
 */
var $wnd = $(window);
var $doc = $(document);
var $body = $('body');
var wndW = 0;
var wndH = 0;
var docH = 0;
function getWndSize() {
    wndW = $wnd.width();
    wndH = $wnd.height();
    docH = $doc.height();
}
getWndSize();
$wnd.on('resize load orientationchange', getWndSize);

/**
 * Debounce resize
 */
var resizeArr = [];
var resizeTimeout = void 0;
$wnd.on('load resize orientationchange', function (e) {
    if (resizeArr.length) {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(function () {
            for (var k = 0; k < resizeArr.length; k++) {
                resizeArr[k](e);
            }
        }, 50);
    }
});
function _debounceResize(func) {
    if (typeof func === 'function') {
        resizeArr.push(func);
    } else {
        window.dispatchEvent(new Event('resize'));
    }
}

/**
 * Throttle scroll
 * thanks: https://jsfiddle.net/mariusc23/s6mLJ/31/
 */
var hideOnScrollList = [];
var didScroll = void 0;
var lastST = 0;

$wnd.on('scroll load resize orientationchange', function () {
    if (hideOnScrollList.length) {
        didScroll = true;
    }
});

function hasScrolled() {
    var ST = $wnd.scrollTop();

    var type = ''; // [up, down, end, start]

    if (ST > lastST) {
        type = 'down';
    } else if (ST < lastST) {
        type = 'up';
    } else {
        type = 'none';
    }

    if (ST === 0) {
        type = 'start';
    } else if (ST >= docH - wndH) {
        type = 'end';
    }

    for (var k in hideOnScrollList) {
        if (typeof hideOnScrollList[k] === 'function') {
            hideOnScrollList[k](type, ST, lastST, $wnd);
        }
    }

    lastST = ST;
}

setInterval(function () {
    if (didScroll) {
        didScroll = false;
        window.requestAnimationFrame(hasScrolled);
    }
}, 250);

function _throttleScroll(callback) {
    hideOnScrollList.push(callback);
}

/**
 * Body Overflow
 * Thanks https://jsfiddle.net/mariusc23/s6mLJ/31/
 * Usage:
 *    // enable
 *    bodyOverflow(1);
 *
 *    // disable
 *    bodyOverflow(0);
 */
var bodyOverflowEnabled = void 0;
var isBodyOverflowing = void 0;
var scrollbarWidth = void 0;
var originalBodyPadding = void 0;
var $fullNavbar = $('.nk-navbar-full');
function bodyGetScrollbarWidth() {
    // thx d.walsh
    var scrollDiv = document.createElement('div');
    scrollDiv.className = 'nk-body-scrollbar-measure';
    $body[0].appendChild(scrollDiv);
    var result = scrollDiv.offsetWidth - scrollDiv.clientWidth;
    $body[0].removeChild(scrollDiv);
    return result;
}
function bodyCheckScrollbar() {
    var fullWindowWidth = window.innerWidth;
    if (!fullWindowWidth) {
        // workaround for missing window.innerWidth in IE8
        var documentElementRect = document.documentElement.getBoundingClientRect();
        fullWindowWidth = documentElementRect.right - Math.abs(documentElementRect.left);
    }
    isBodyOverflowing = $body[0].clientWidth < fullWindowWidth;
    scrollbarWidth = bodyGetScrollbarWidth();
}
function bodySetScrollbar() {
    if (typeof originalBodyPadding === 'undefined') {
        originalBodyPadding = $body.css('padding-right') || '';
    }

    if (isBodyOverflowing) {
        $body.add($fullNavbar).css('paddingRight', scrollbarWidth + 'px');
    }
}
function bodyResetScrollbar() {
    $body.css('paddingRight', originalBodyPadding);
    $fullNavbar.css('paddingRight', '');
}
function _bodyOverflow(enable) {
    if (enable && !bodyOverflowEnabled) {
        bodyOverflowEnabled = 1;
        bodyCheckScrollbar();
        bodySetScrollbar();
        $body.css('overflow', 'hidden');
    } else if (!enable && bodyOverflowEnabled) {
        bodyOverflowEnabled = 0;
        $body.css('overflow', '');
        bodyResetScrollbar();
    }
}

/**
 * In Viewport checker
 * return visible percent from 0 to 1
 */
function _isInViewport($item, returnRect) {
    var rect = $item[0].getBoundingClientRect();
    var result = 1;

    if (rect.right <= 0 || rect.left >= wndW) {
        result = 0;
    } else if (rect.bottom < 0 && rect.top <= wndH) {
        result = 0;
    } else {
        var beforeTopEnd = Math.max(0, rect.height + rect.top);
        var beforeBottomEnd = Math.max(0, rect.height - (rect.top + rect.height - wndH));
        var afterTop = Math.max(0, -rect.top);
        var beforeBottom = Math.max(0, rect.top + rect.height - wndH);
        if (rect.height < wndH) {
            result = 1 - (afterTop || beforeBottom) / rect.height;
        } else {
            if (beforeTopEnd <= wndH) {
                result = beforeTopEnd / wndH;
            } else if (beforeBottomEnd <= wndH) {
                result = beforeBottomEnd / wndH;
            }
        }
        result = result < 0 ? 0 : result;
    }
    if (returnRect) {
        return [result, rect];
    }
    return result;
}

/**
 * Scroll To
 */
function _scrollTo($to, callback) {
    var scrollPos = false;
    var speed = this.options.scrollToAnchorSpeed / 1000;

    if ($to === 'top') {
        scrollPos = 0;
    } else if ($to === 'bottom') {
        scrollPos = Math.max(0, docH - wndH);
    } else if (typeof $to === 'number') {
        scrollPos = $to;
    } else {
        scrollPos = $to.offset ? $to.offset().top : false;
    }

    if (scrollPos !== false && $wnd.scrollTop() !== scrollPos) {
        tween.to($wnd, speed, {
            scrollTo: {
                y: scrollPos,
                autoKill: true
            },
            ease: Power2.easeOut,
            autoKill: true,
            overwrite: 5
        });
        if (callback) {
            tween.delayedCall(speed, callback);
        }
    } else if (typeof callback === 'function') {
        callback();
    }
}

/*------------------------------------------------------------------

  Set Custom Options

-------------------------------------------------------------------*/
function _setOptions(newOpts) {
    var self = this;

    var optsTemplates = $.extend({}, this.options.templates, newOpts && newOpts.templates || {});
    var optsShortcuts = $.extend({}, this.options.shortcuts, newOpts && newOpts.shortcuts || {});

    self.options = $.extend({}, self.options, newOpts);
    self.options.templates = optsTemplates;
    self.options.shortcuts = optsShortcuts;
}

/*------------------------------------------------------------------

  Shortcuts
  https://github.com/madrobby/keymaster

-------------------------------------------------------------------*/
function _key(name, fn) {
    if (typeof window.key === 'undefined') {
        return;
    }
    name = this.options && this.options.shortcuts && this.options.shortcuts[name];

    if (name) {
        window.key(name, fn);
    }
}
function _initShortcuts() {
    if (typeof window.key === 'undefined' || !this.options.enableShortcuts) {
        return;
    }

    var self = this;

    // FullScreen Video
    self.key('closeFullscreenVideo', function () {
        self.closeFullScreenVideo && self.closeFullScreenVideo();
    });

    // post single
    self.key('postScrollToComments', function () {
        var $comments = $('#comments');
        if ($comments.length) {
            self.scrollTo($comments);
        }
    });

    // Side Left Navbar
    var $leftSide = $('.nk-navbar-left-side');
    self.key('toggleSideLeftNavbar', function () {
        self.toggleSide($leftSide);
    });
    self.key('openSideLeftNavbar', function () {
        self.openSide($leftSide);
    });
    self.key('closeSideLeftNavbar', function () {
        self.closeSide($leftSide);
    });

    // Side Right Navbar
    var $rightSide = $('.nk-navbar-right-side');
    self.key('toggleSideRightNavbar', function () {
        self.toggleSide($rightSide);
    });
    self.key('openSideRightNavbar', function () {
        self.openSide($rightSide);
    });
    self.key('closeSideRightNavbar', function () {
        self.closeSide($rightSide);
    });

    // Fullscreen Navbar
    self.key('toggleFullscreenNavbar', function () {
        self.toggleFullscreenNavbar();
    });
    self.key('openFullscreenNavbar', function () {
        self.openFullscreenNavbar();
    });
    self.key('closeFullscreenNavbar', function () {
        self.closeFullscreenNavbar();
    });

    // ESC - use also inside form elements
    window.key.filter = function (event) {
        var tagName = (event.target || event.srcElement).tagName;
        var isContentEditable = (event.target || event.srcElement).getAttribute('contenteditable');
        var isESC = window.key.isPressed('esc');
        return isESC || !(isContentEditable || tagName === 'INPUT' || tagName === 'SELECT' || tagName === 'TEXTAREA');
    };
}

/*------------------------------------------------------------------

  Init Navbar

-------------------------------------------------------------------*/
function _initNavbar() {
    var self = this;
    var $navbarTop = $('.nk-navbar-top');

    // add mobile navbar
    var $mobileNavItems = $('[data-nav-mobile]');
    if ($mobileNavItems.length) {
        $mobileNavItems.each(function () {
            var $nav = $($(this).html());
            var $mobileNav = $($(this).attr('data-nav-mobile'));

            // insert into mobile nav
            $mobileNav.find('.nk-navbar-mobile-content > ul.nk-nav').append($nav);
        });

        var $nav = $('.nk-navbar-mobile-content > ul.nk-nav');

        // remove background images
        $nav.find('.bg-image, .bg-video').remove();

        // remove mega menus
        $nav.find('.nk-mega-item > .dropdown').each(function () {
            var $drop = $(this).children('ul').addClass('dropdown');

            // fix mega menu columns
            $drop.find('> li > label').each(function () {
                $(this).next().addClass('dropdown');
                $(this).parent().addClass('nk-drop-item');
                $(this).replaceWith($('<a href="#"></a>').html($(this).html()));
            });

            $(this).replaceWith($drop);
        });
        $nav.find('.nk-mega-item').removeClass('nk-mega-item');
    }

    // sticky navbar
    var navbarTop = $navbarTop.length ? $navbarTop.offset().top : 0;
    // fake hidden navbar to prevent page jumping on stick
    var $navbarFake = $('<div>').hide();
    function onScrollNav() {
        var stickyOn = $wnd.scrollTop() >= navbarTop;

        if (stickyOn) {
            $navbarTop.addClass('nk-navbar-fixed');
            $navbarFake.show();
        } else {
            $navbarTop.removeClass('nk-navbar-fixed');
            $navbarFake.hide();
        }
    }
    if ($navbarTop.hasClass('nk-navbar-sticky')) {
        $wnd.on('scroll resize', onScrollNav);
        onScrollNav();

        $navbarTop.after($navbarFake);
        self.debounceResize(function () {
            $navbarFake.height($navbarTop.innerHeight());
        });
    }

    // correct dropdown position
    function correctDropdown($item) {
        if ($item.parent().is('.nk-nav')) {
            var $dropdown = $item.children('.dropdown');
            var $parent = $item.parents('.nk-navbar:eq(0)');
            var isRight = $dropdown.css('right') !== 'auto';
            var css = {
                marginLeft: '',
                marginRight: '',
                marginTop: 0,
                display: 'block'
            };

            $dropdown.css(css);

            var rect = $dropdown[0].getBoundingClientRect();
            var itemRect = $item[0].getBoundingClientRect();

            // move dropdown from left corner
            if (rect.left < 0) {
                css.marginLeft = -rect.left;
            }

            // move dropdown from right corner
            else if (rect.right > wndW) {
                    css.marginLeft = wndW - rect.right;
                }

            // check if dropdown not under item
            var currentLeftPost = rect.left + (css.marginLeft || 0);
            if (currentLeftPost > itemRect.left) {
                css.marginLeft = (css.marginLeft || 0) - (currentLeftPost - itemRect.left);
            }

            // change to margin-right. In some cases left margin isn't working, for ex. in mega menu
            if (isRight) {
                css.marginRight = -1 * css.marginLeft;
                css.marginLeft = '';
            }

            // correct top position
            css.marginTop = $parent.innerHeight() - $dropdown.offset().top + $parent.offset().top;

            // hide menu
            css.display = 'none';

            $dropdown.css(css);
        }
    }

    // toggle dropdown
    function closeSubmenu($item) {
        if ($item.length) {
            $item.removeClass('open');
            tween.to($item.children('.dropdown'), 0.3, {
                opacity: 0,
                display: 'none'
            });
            $wnd.trigger('nk-closed-submenu', [$item]);
        }
    }
    function openSubmenu($item) {
        if (!$item.hasClass('open')) {
            correctDropdown($item);
            tween.to($item.children('.dropdown'), 0.3, {
                opacity: 1,
                display: 'block'
            });
            $item.addClass('open');
            $wnd.trigger('nk-opened-submenu', [$item]);
        }
    }
    var dropdownTimeout = void 0;
    $navbarTop.on('mouseenter', 'li.nk-drop-item', function () {
        var $item = $(this);
        var $openedSiblings = $item.siblings('.open').add($item.siblings().find('.open')).add($item.parents('.nk-nav:eq(0)').siblings().find('.open')).add($item.parents('.nk-nav:eq(0)').siblings('.open')).add($item.parents('.nk-nav:eq(0)').parent().siblings().find('.open'));

        clearTimeout(dropdownTimeout);
        closeSubmenu($openedSiblings);
        openSubmenu($item);
    }).on('mouseleave', 'li.nk-drop-item', function () {
        var $item = $(this);
        clearTimeout(dropdownTimeout);
        dropdownTimeout = setTimeout(function () {
            closeSubmenu($item);
        }, 200);
    });
    $navbarTop.on('mouseleave', function () {
        clearTimeout(dropdownTimeout);
        dropdownTimeout = setTimeout(function () {
            closeSubmenu($navbarTop.find('.open'));
        }, 400);
    });

    // hide / show
    // add / remove solid color
    var $autohide_nav = $navbarTop.filter('.nk-navbar-autohide');
    self.throttleScroll(function (type, scroll) {
        var start = 400;
        var hideClass = 'nk-onscroll-hide';
        var showClass = 'nk-onscroll-show';

        // hide / show
        if (type === 'down' && scroll > start) {
            $autohide_nav.removeClass(showClass).addClass(hideClass);
        } else if (type === 'up' || type === 'end' || type === 'start') {
            $autohide_nav.removeClass(hideClass).addClass(showClass);
        }

        // add solid color
        if ($navbarTop.hasClass('nk-navbar-transparent') && $navbarTop.hasClass('nk-navbar-sticky')) {
            $navbarTop[(scroll > 70 ? 'add' : 'remove') + 'Class']('nk-navbar-solid');
        }
    });
}

/*------------------------------------------------------------------

  Init Navbar Side

-------------------------------------------------------------------*/
function _initNavbarSide() {
    var self = this;
    var $overlay = $('<div class="nk-navbar-overlay">').appendTo($body);

    // side navbars
    var $leftSide = $('.nk-navbar-left-side');
    var $rightSide = $('.nk-navbar-right-side');
    var $sideNavs = $('.nk-navbar-side');

    self.sideNavbarIsOpened = function () {
        return $sideNavs.hasClass('open');
    };

    // toggle navbars
    function updateTogglers() {
        $('[data-nav-toggle]').each(function () {
            var active = $($(this).attr('data-nav-toggle')).hasClass('open');
            $(this)[(active ? 'add' : 'remove') + 'Class']('active');
        });
    }
    self.toggleSide = function ($side, speed) {
        self[$side.hasClass('open') ? 'closeSide' : 'openSide']($side, speed);
    };
    self.openSide = function ($side, speed) {
        if ($side.css('display') === 'none') {
            return;
        }

        $side.addClass('open');

        // show sidebar
        tween.to($side, speed || 0.4, {
            x: $side.hasClass('nk-navbar-left-side') ? '100%' : '-100%'
        });

        // show overlay
        if ($side.hasClass('nk-navbar-overlay-content')) {
            tween.to($overlay, 0.3, {
                opacity: 0.6,
                display: 'block'
            });
        }

        updateTogglers();
    };
    self.closeSide = function ($side, speed) {
        $side.each(function () {
            $(this).removeClass('open');

            // hide sidebar
            tween.to(this, speed || 0.4, {
                x: '0%'
            });

            updateTogglers();
        });

        if (!$sideNavs.filter('.nk-navbar-overlay-content.open').length) {
            // hide overlay
            tween.to($overlay, 0.3, {
                opacity: 0,
                display: 'none'
            });
        }
    };
    $doc.on('click', '[data-nav-toggle]', function (e) {
        var $nav = $($(this).attr('data-nav-toggle'));
        if ($nav.hasClass('open')) {
            self.closeSide($nav);
        } else {
            // hide another navigations
            $('[data-nav-toggle]').each(function () {
                self.closeSide($($(this).attr('data-nav-toggle')));
            });

            self.openSide($nav);
        }
        e.preventDefault();
    });

    // overlay
    $doc.on('click', '.nk-navbar-overlay', function () {
        self.closeSide($sideNavs);
    });

    // hide sidebar if it invisible
    self.debounceResize(function () {
        $sideNavs.filter('.open').each(function () {
            if (!$(this).is(':visible')) {
                self.closeSide($(this));
            }
        });
    });

    // swipe side navbars
    if (!isTouch || typeof Hammer === 'undefined') {
        return;
    }
    var swipeStartSize = 50;
    var $swipeItem = void 0;
    var navSize = void 0;
    var openNav = void 0;
    var closeNav = void 0;
    var isRightSide = void 0;
    var isLeftSide = void 0;
    var isScrolling = 0;
    var swipeDir = void 0;
    var sidePos = false;
    var startSwipe = false;
    var endSwipe = false;
    var mc = Hammer(document, {
        touchAction: 'pan-x pan-y'
    });
    mc.add(new Hammer.Pan({
        pointers: 1,
        threshold: 0
    }));
    // If we detect a scroll before a panleft/panright, disable panning
    // thanks: https://github.com/hammerjs/hammer.js/issues/771
    mc.on('panstart', function (e) {
        if (e.additionalEvent === 'panup' || e.additionalEvent === 'pandown') {
            isScrolling = 1;
        }
    });
    // Reenable panning
    mc.on('panend', function (e) {
        if (!isScrolling) {
            if ($swipeItem) {
                var swipeSize = sidePos ? openNav ? sidePos : closeNav ? navSize - sidePos : 0 : 0;
                var transitionTime = Math.max(0.15, 0.4 * (navSize - swipeSize) / navSize);
                var swiped = 0;

                if (swipeSize && swipeSize > 10) {
                    var velocityTest = Math.abs(e.velocityX) > 0.7;
                    if (swipeSize >= navSize / 3 || velocityTest) {
                        swiped = 1;
                        if (openNav) {
                            self.openSide($swipeItem, transitionTime);
                        } else {
                            self.closeSide($swipeItem, transitionTime);
                        }
                    }
                }
                if (!swiped) {
                    if (openNav) {
                        self.closeSide($swipeItem, transitionTime);
                    } else {
                        self.openSide($swipeItem, transitionTime);
                    }
                }
            }
            openNav = closeNav = isRightSide = isLeftSide = swipeDir = sidePos = $swipeItem = startSwipe = endSwipe = false;
        }
        isScrolling = 0;
    });
    mc.on('panleft panright panup pandown', function (e) {
        if (isScrolling) {
            return;
        }

        var isFirst = false;
        var isFinal = e.isFinal;

        if (startSwipe === false) {
            startSwipe = e.center.x;
            isFirst = true;
        }
        endSwipe = e.center.x;

        // init
        if (isFirst) {
            swipeDir = e.direction === 2 ? 'left' : e.direction === 4 ? 'right' : false;

            // right side
            if ($rightSide && $rightSide.length) {
                navSize = $rightSide.width();

                // open
                if (wndW - startSwipe <= swipeStartSize && !$rightSide.hasClass('open') && !$leftSide.hasClass('open')) {
                    openNav = isRightSide = 1;
                }

                // close
                else if (wndW - startSwipe >= navSize - 100 && $rightSide.hasClass('open')) {
                        closeNav = isRightSide = 1;
                    }
            }

            // left side
            if ($leftSide && $leftSide.length && !isRightSide && $leftSide.is(':visible')) {
                navSize = $leftSide.width();

                // open
                if (startSwipe <= swipeStartSize && !$rightSide.hasClass('open') && !$leftSide.hasClass('open')) {
                    openNav = isLeftSide = 1;
                }

                // close
                else if (startSwipe >= navSize - 100 && $leftSide.hasClass('open')) {
                        closeNav = isLeftSide = 1;
                    }
            }

            // swipe item
            $swipeItem = isLeftSide ? $leftSide : isRightSide ? $rightSide : false;

            // move
        } else if (!isFinal && $swipeItem) {
            if (isRightSide && (openNav && swipeDir === 'left' || closeNav && swipeDir === 'right')) {
                // open side navbar
                if (openNav) {
                    sidePos = Math.min(navSize, Math.max(0, startSwipe - endSwipe));
                }

                // close side navbar
                if (closeNav) {
                    var curPos = startSwipe - endSwipe;
                    if (startSwipe < wndW - navSize) {
                        curPos = wndW - navSize - endSwipe;
                    }
                    sidePos = navSize - Math.abs(Math.max(-navSize, Math.min(0, curPos)));
                }

                tween.set($swipeItem, {
                    x: -100 * sidePos / navSize + '%'
                });
            } else if (isLeftSide && (openNav && swipeDir === 'right' || closeNav && swipeDir === 'left')) {
                // open mobile navbar
                if (openNav) {
                    sidePos = Math.min(navSize, Math.max(0, endSwipe - startSwipe));
                }

                // close mobile navbar
                if (closeNav) {
                    var curPos2 = endSwipe - startSwipe;
                    if (startSwipe > navSize) {
                        curPos2 = endSwipe - navSize;
                    }
                    sidePos = navSize - Math.abs(Math.max(-navSize, Math.min(0, curPos2)));
                }

                tween.set($swipeItem, {
                    x: 100 * sidePos / navSize + '%'
                });
            }
        }

        if (isRightSide || isLeftSide) {
            e.srcEvent.preventDefault();
        }
    });
}

/*------------------------------------------------------------------

  Init Navbar Fullscreen

-------------------------------------------------------------------*/
function _initNavbarFullscreen() {
    var self = this;
    var $navbar = $('.nk-navbar-full');
    var $navbarTop = $('.nk-navbar-top');
    var $navbarSocial = $navbar.find('.nk-nav-social');
    var isOpened = void 0;

    self.fullscreenNavbarIsOpened = function () {
        return isOpened;
    };

    self.toggleFullscreenNavbar = function () {
        self[isOpened ? 'closeFullscreenNavbar' : 'openFullscreenNavbar']();
    };
    self.openFullscreenNavbar = function () {
        if (isOpened || !$navbar.length) {
            return;
        }
        isOpened = 1;

        var $navbarMenuItems = $navbar.find('.nk-nav .nk-drop-item.open > .dropdown:not(.closed) > li > a');
        if (!$navbarMenuItems.length) {
            $navbarMenuItems = $navbar.find('.nk-nav > li > a');
        }

        // active all togglers
        $('.nk-navbar-full-toggle').addClass('active');

        // set top position and animate
        tween.set($navbarMenuItems, {
            opacity: 0,
            force3D: true
        });
        tween.set($navbarSocial, {
            opacity: 0,
            force3D: true
        });
        tween.to($navbar, 0.5, {
            opacity: 1,
            force3D: true,
            display: 'block',
            onComplete: function onComplete() {
                self.initPluginNano($navbar);
            }
        });
        tween.staggerTo($navbarMenuItems, 0.3, {
            y: 0,
            opacity: 1,
            delay: 0.2
        }, 0.05);
        tween.to($navbarSocial, 0.3, {
            y: 0,
            opacity: 1,
            delay: 0.4
        });

        $navbar.addClass('open');

        // prevent body scrolling
        self.bodyOverflow(1);

        // trigger event
        $wnd.trigger('nk-open-full-navbar', [$navbar]);
    };

    self.closeFullscreenNavbar = function (dontTouchBody) {
        if (!isOpened || !$navbar.length) {
            return;
        }
        isOpened = 0;

        // disactive all togglers
        $('.nk-navbar-full-toggle').removeClass('active');

        // set top position and animate
        tween.to($navbar, 0.5, {
            opacity: 0,
            force3D: true,
            display: 'none',
            onComplete: function onComplete() {
                if (!dontTouchBody) {
                    // restore body scrolling
                    self.bodyOverflow(0);
                }
            }
        });

        // open navbar block
        $navbar.removeClass('open');

        // trigger event
        $wnd.trigger('nk-close-full-navbar', [$navbar]);
    };

    $doc.on('click', '.nk-navbar-full-toggle', function (e) {
        self.toggleFullscreenNavbar();
        e.preventDefault();
    });

    $wnd.on('nk-open-search-block', function () {
        self.closeFullscreenNavbar(1);
    });
    $wnd.on('nk-open-share-place', self.closeFullscreenNavbar);
}

/*------------------------------------------------------------------

  Init Dropdown Effect 1 for side navbars and fullscreen

-------------------------------------------------------------------*/
function _initNavbarDropEffect() {
    var self = this;
    var $navbars = $('.nk-navbar-side, .nk-navbar-full');

    // add back item for dropdowns
    $navbars.find('.dropdown').prepend('<li class="bropdown-back"><a href="#">' + self.options.templates.secondaryNavbarBackItem + '</a></li>');

    // change height of opened dropdown
    function updateSideNavDropdown($item) {
        var $nav = $item.parents('.nk-navbar:eq(0)');
        var $khNav = $nav.find('.nk-nav');
        var $drop = $nav.find('.nk-drop-item.open > .dropdown:not(.closed)');
        var $parentDrop = $drop.parents('.dropdown.closed:eq(0)');
        var $nano = $item.parents('.nano:eq(0)');
        var $nanoCont = $nano.children('.nano-content');
        var $navRow = $item.parents('.nk-nav-row:eq(0)');
        var $rows = $navRow.siblings('.nk-nav-row');
        if ($drop.length) {
            var dropHeight = $drop.innerHeight();

            // vertical center for dropdown
            if ($navRow.hasClass('nk-nav-row-center')) {
                (function () {
                    $drop.css({
                        top: 0
                    });

                    var nanoHeight = $nano.innerHeight();
                    var nanoNavRowHeight = nanoHeight;
                    var nanoTop = $nano.offset().top;
                    var dropTop = $drop.offset().top;

                    // remove additional rows size
                    if ($rows.length) {
                        $rows.each(function () {
                            nanoNavRowHeight = nanoNavRowHeight - $(this).innerHeight();
                        });
                    }

                    var top = 0;
                    if (dropHeight < nanoNavRowHeight) {
                        top = nanoTop - dropTop - $nanoCont.scrollTop();
                        top += (nanoHeight - dropHeight) / 2;
                    } else {
                        top = -parseFloat($parentDrop.css('top')) || 0;
                    }

                    $drop.css({
                        top: top
                    });
                })();
            }

            $khNav.css('height', dropHeight);
            self.initPluginNano($nav);

            // scroll to top
            tween.to($nanoCont, 0.3, {
                scrollTo: { y: 0 },
                delay: 0.2
            });
        } else {
            $khNav.css('height', '');
        }
        self.initPluginNano($nav);
    }

    // open / close submenu
    function toggleSubmenu(open, $drop) {
        var $newItems = $drop.find('> .dropdown > li > a');
        var $oldItems = $drop.parent().find('> li > a');

        if (open) {
            $drop.addClass('open').parent().addClass('closed');
        } else {
            $drop.removeClass('open').parent().removeClass('closed');

            var tmp = $newItems;
            $newItems = $oldItems;
            $oldItems = tmp;
        }

        // show items
        tween.set($newItems, {
            x: open ? '15%' : '-15%',
            opacity: 0,
            display: 'block'
        }, 0.1);
        tween.staggerTo($newItems, 0.2, {
            x: '0%',
            opacity: 1,
            delay: 0.1
        }, 0.03);

        // hide items
        tween.staggerTo($oldItems, 0.2, {
            x: open ? '-15%' : '15%',
            opacity: 0
        }, 0.03, function () {
            $oldItems.css('display', 'none');
        });
    }

    $navbars.on('click', '.nk-drop-item > a', function (e) {
        toggleSubmenu(true, $(this).parent());
        updateSideNavDropdown($(this));
        e.preventDefault();
    });
    $navbars.on('click', '.bropdown-back > a', function (e) {
        toggleSubmenu(false, $(this).parent().parent().parent());
        updateSideNavDropdown($(this));
        e.preventDefault();
    });
}

/*------------------------------------------------------------------

  Init Header Title

-------------------------------------------------------------------*/
function _initHeaderTitle() {
    var self = this;
    var $navbarHeader = $('.nk-header');
    var isNavbarOpaque = $navbarHeader.hasClass('nk-header-opaque');
    var isNavbarTransparent = $('.nk-navbar-top').hasClass('nk-header-transparent');
    var $fullHeaderTitle = $('.nk-header-title-full');

    // remove header title padding if navbar opaque
    if (isNavbarOpaque) {
        $('.nk-header-title').css('padding-top', 0);
    }

    self.debounceResize(function () {
        if ((isNavbarTransparent || isNavbarOpaque) && (!$fullHeaderTitle.length || !isNavbarOpaque)) {
            return;
        }

        var navH = $navbarHeader.outerHeight() || 0;

        // add header title padding
        if (!isNavbarTransparent && !isNavbarOpaque) {
            $('.nk-header-title').css('padding-top', navH);
        }

        // fix header title height
        if ($fullHeaderTitle.length) {
            var headerH = '100vh';

            $fullHeaderTitle.css('height', 'auto');

            if (isNavbarOpaque) {
                headerH = 'calc(100vh - ' + navH + 'px)';
            }

            if ($fullHeaderTitle[0].scrollHeight < wndH) {
                $fullHeaderTitle.css('height', headerH);
            }
        }
    });
}

/*------------------------------------------------------------------

  Init Counters

-------------------------------------------------------------------*/
function _initCounters() {
    var self = this;
    var $progressCount = $('.nk-progress.nk-count');
    var $numberCount = $('.nk-count:not(.nk-progress)');

    // set default progress
    $progressCount.each(function () {
        $(this).attr('data-nk-count', $(this).attr('data-progress')).find('.nk-progress-line > div').css('width', ($(this).attr('data-nk-count-from') || '0') + '%').find('.nk-progress-percent').html('');
    });

    // set default numbers
    $numberCount.each(function () {
        $(this).attr('data-nk-count', $(this).attr('data-nk-count') || parseInt($(this).text(), 10)).html($(this).attr('data-nk-count-from') || '0');
    });

    var countersNum = 1;
    function runCounters() {
        if (!countersNum) {
            return;
        }

        var progress = $progressCount.filter('[data-nk-count]');
        var numbers = $numberCount.filter('[data-nk-count]');
        countersNum = progress.length + numbers.length;

        // progress
        $progressCount.filter('[data-nk-count]').each(function () {
            var $item = $(this);
            if (self.isInViewport($item)) {
                (function () {
                    var count = {
                        curr: $item.attr('data-nk-count-from') || '0',
                        to: $item.attr('data-nk-count')
                    };
                    var $itemLine = $item.find('.nk-progress-line > div');
                    var $itemLabel = $item.find('.nk-progress-percent');

                    tween.to($itemLine, 1, {
                        width: count.to + '%'
                    });
                    tween.to(count, 1, {
                        curr: count.to,
                        roundProps: 'curr',
                        ease: Circ.easeIn,
                        onUpdate: function onUpdate() {
                            $itemLabel.text(count.curr + '%');
                        }
                    });
                    $item.removeAttr('data-nk-count');
                })();
            }
        });

        // number
        $numberCount.filter('[data-nk-count]').each(function () {
            var $item = $(this);
            if (self.isInViewport($item)) {
                (function () {
                    var count = {
                        curr: $item.text(),
                        to: $item.attr('data-nk-count')
                    };
                    $item.removeAttr('data-nk-count data-nk-count-from');
                    tween.to(count, 1, {
                        curr: count.to,
                        roundProps: 'curr',
                        ease: Circ.easeIn,
                        onUpdate: function onUpdate() {
                            $item.text(count.curr);
                        }
                    });
                })();
            }
        });
    }

    self.throttleScroll(runCounters);
    runCounters();
}

/*------------------------------------------------------------------

  Anchors

-------------------------------------------------------------------*/
function _initAnchors() {
    var self = this;

    // click on anchors
    var $leftSideNav = $('.nk-navbar-left-side');
    var $rightSideNav = $('.nk-navbar-right-side');
    function closeNavs() {
        self.closeSide($leftSideNav);
        self.closeSide($rightSideNav);
        self.closeFullscreenNavbar();
    }
    $doc.on('click', '.navbar a, .nk-navbar a, a.btn, a.nk-btn, a.nk-anchor, a.nk-header-title-scroll-down', function (e) {
        var isHash = this.hash;
        var isURIsame = this.baseURI === window.location.href;

        if (isHash && isURIsame) {
            // sometimes hashs have no valid selector like ##hash, it will throw errors
            try {
                var $hashBlock = $(isHash);
                var hash = isHash.replace(/^#/, '');
                if ($hashBlock.length || hash === 'top' || hash === 'bottom') {
                    // close navigations
                    closeNavs();

                    // add hash to address bar
                    if ($hashBlock.length) {
                        $hashBlock.attr('id', '');
                        document.location.hash = hash;
                        $hashBlock.attr('id', hash);
                    }

                    // scroll to block
                    self.scrollTo($hashBlock.length ? $hashBlock : hash);

                    e.preventDefault();
                }
            } catch (e) {}
        }
    });

    // add active class on navbar items
    var $anchorItems = $('.nk-navbar .nk-nav > li > a[href*="#"]');
    var anchorBlocks = [];
    function hashInArray(item) {
        for (var k = 0; k < anchorBlocks.length; k++) {
            if (anchorBlocks[k].hash === item) {
                return k;
            }
        }
        return false;
    }
    // get all anchors + blocks on the page
    $anchorItems.each(function () {
        var hash = this.hash.replace(/^#/, '');
        if (!hash) {
            return;
        }

        var $item = $(this).parent();
        var $block = $('#' + hash);

        if (hash && $block.length || hash === 'top') {
            var inArray = hashInArray(hash);
            if (inArray === false) {
                anchorBlocks.push({
                    hash: hash,
                    $item: $item,
                    $block: $block
                });
            } else {
                anchorBlocks[inArray].$item = anchorBlocks[inArray].$item.add($item);
            }
        }
    });
    // prepare anchor list and listen for scroll to activate items in navbar
    function updateAnchorItemsPositions() {
        for (var k = 0; k < anchorBlocks.length; k++) {
            var item = anchorBlocks[k];
            var blockTop = 0;
            var blockH = wndH;
            if (item.$block.length) {
                blockTop = item.$block.offset().top;
                blockH = item.$block.innerHeight();
            }
            item.activate = blockTop - wndH / 2;
            item.deactivate = blockTop + blockH - wndH / 2;
        }
    }
    function setAnchorActiveItem(type, ST) {
        for (var k = 0; k < anchorBlocks.length; k++) {
            var item = anchorBlocks[k];
            var active = ST >= item.activate && ST < item.deactivate;
            item.$item[active ? 'addClass' : 'removeClass']('active');
        }
    }
    if (anchorBlocks.length) {
        updateAnchorItemsPositions();
        setAnchorActiveItem('static', $wnd.scrollTop());
        self.throttleScroll(setAnchorActiveItem);
        self.debounceResize(updateAnchorItemsPositions);
    }
}

/*------------------------------------------------------------------

 Init Video Blocks

 -------------------------------------------------------------------*/
function _initVideoBlocks() {
    if (typeof window.VideoWorker === 'undefined') {
        return;
    }
    var self = this;

    // open fullscreen videos
    var openedFSVideo = void 0;
    self.openFullScreenVideo = function (url) {
        if (openedFSVideo) {
            return;
        }
        openedFSVideo = 1;

        // get api for this video
        self.FullScreenVideoApi = new VideoWorker(url, {
            autoplay: 1,
            loop: 0,
            mute: 0,
            controls: 1
        });

        // set video size
        function setVideoSize() {
            var ratio = 16 / 9;
            var resultW = void 0;
            var resultH = void 0;

            if (ratio > wndW / wndH) {
                resultW = wndW * 0.9;
                resultH = resultW / ratio;
            } else {
                resultH = wndH * 0.9;
                resultW = resultH * ratio;
            }
            self.FullScreenVideoWrapper.css({
                width: resultW,
                height: resultH,
                top: (wndH - resultH) / 2,
                left: (wndW - resultW) / 2
            });
        }

        // create fullscreen video wrapper if doesn't exist
        if (!self.FullScreenVideo) {
            self.FullScreenVideo = $('<div class="nk-video-fullscreen"></div>').appendTo($body);

            self.closeFullScreenVideo = function () {
                if (openedFSVideo) {
                    openedFSVideo = 0;

                    self.FullScreenVideoApi.pause();

                    // hide animation
                    tween.to(self.FullScreenVideo, 0.4, {
                        opacity: 0,
                        display: 'none',
                        onComplete: function onComplete() {
                            self.FullScreenVideoWrapper.html('');
                        }
                    });
                    tween.to(self.FullScreenVideoWrapper, 0.4, {
                        scale: 0.9
                    });

                    // restore body scrolling
                    self.bodyOverflow(0);
                }
            };

            // close icon
            $('<div class="nk-video-fullscreen-close">' + self.options.templates.fullscreenVideoClose + '</div>').on('click', self.closeFullScreenVideo).appendTo(self.FullScreenVideo);

            // video container
            self.FullScreenVideoWrapper = $('<div class="nk-video-fullscreen-cont"></div>').appendTo(self.FullScreenVideo);

            setVideoSize();
            self.debounceResize(setVideoSize);
        }

        // check api and run fullscreen
        if (self.FullScreenVideoApi && self.FullScreenVideoApi.isValid()) {
            self.FullScreenVideoApi.getIframe(function (iframe) {
                var $parent = $(iframe).parent();
                self.FullScreenVideoWrapper.append(iframe);
                $parent.remove();

                // pause audio
                if (typeof soundManager !== 'undefined') {
                    soundManager.pauseAll();
                }

                // show animation
                tween.fromTo(self.FullScreenVideo, 0.4, {
                    opacity: 0
                }, {
                    opacity: 1,
                    display: 'block'
                });
                tween.fromTo(self.FullScreenVideoWrapper, 0.4, {
                    opacity: 0,
                    scale: 0.9
                }, {
                    opacity: 1,
                    scale: 1,
                    delay: 0.3
                });

                // prevent body scrolling
                self.bodyOverflow(1);
            });
        }
    };
    $doc.on('click', '.nk-video-fullscreen-toggle', function (e) {
        e.preventDefault();
        self.openFullScreenVideo($(this).attr('href'));
    });

    // init plain video
    function addPlainPlayButton($plainCont) {
        $plainCont.find('.nk-video-plain-toggle').html(self.options.templates.plainVideoIcon);
    }
    function addPlainLoadButton($plainCont) {
        $plainCont.find('.nk-video-plain-toggle').html(self.options.templates.plainVideoLoadIcon || self.options.templates.plainVideoIcon);
    }
    $('.nk-plain-video[data-video]').each(function () {
        var $plainCont = $(this);
        var $plainIframe = void 0;
        var url = $(this).attr('data-video');
        var thumb = $(this).attr('data-video-thumb');
        var api = new VideoWorker(url, {
            autoplay: 0,
            loop: 0,
            mute: 0,
            controls: 1
        });

        if (api && api.isValid()) {
            var loaded = 0;
            api.getIframe(function (iframe) {
                // add iframe
                $plainIframe = $(iframe);
                var $parent = $plainIframe.parent();
                tween.set(iframe, {
                    opacity: 0,
                    display: 'none'
                });
                $plainIframe.appendTo($plainCont);
                $parent.remove();

                // add play button
                $plainCont.append('<span class="nk-video-plain-toggle"></span>');
                addPlainPlayButton($plainCont);

                // add play event
                $plainCont.on('click', function () {
                    if (isMobile) {
                        window.open(api.url);
                        return;
                    }

                    api.play();

                    // add loading button
                    if (!loaded) {
                        addPlainLoadButton($plainCont);
                    }
                });
            });
            // set thumb
            if (thumb) {
                $plainCont.css('background-image', 'url("' + thumb + '")');
            } else {
                api.getImageURL(function (imgSrc) {
                    $plainCont.css('background-image', 'url("' + imgSrc + '")');
                });
            }
            if (isMobile) {
                return;
            }
            api.on('play', function () {
                tween.to($plainIframe, 0.5, {
                    opacity: 1,
                    display: 'block',
                    onComplete: function onComplete() {
                        // add play button
                        if (!loaded) {
                            addPlainPlayButton($plainCont);
                            loaded = 1;
                        }
                    }
                });

                // pause audio
                if (typeof soundManager !== 'undefined') {
                    soundManager.pauseAll();
                }
            });
            api.on('pause', function () {
                tween.to($plainIframe, 0.5, {
                    opacity: 0,
                    display: 'none'
                });
            });
        }
    });
}

/*------------------------------------------------------------------

  Init Fullpage

-------------------------------------------------------------------*/
function _initFullPage() {
    var $fullPage = $('.nk-fullpage-portfolio:eq(0)');
    var $eachItems = $fullPage.find('.nk-fullpage-item');
    if (!$fullPage.length || !$eachItems.length) {
        return;
    }

    $('html').css('overflow', 'hidden');
    $('.nk-main').css('overflow', 'visible');

    var self = this;

    // parse slides
    var slides = [];
    $eachItems.each(function () {
        var $this = $(this);
        slides.push({
            $item: $this,
            $viewBtn: $this.find('.nk-fullpage-view-button').html(),
            $content: $this.find('.nk-fullpage-content').html(),
            img: $this.find('.nk-fullpage-image').attr('src'),
            letter: $this.attr('data-letter'),
            number: $this.attr('data-number')
        });
    });

    // image blocks
    var $image1 = $('<div class="nk-fullpage-bg-image">').appendTo($fullPage);
    var $image2 = $('<div class="nk-fullpage-bg-image">').appendTo($fullPage);

    // content
    var $content = $('<div class="nk-fullpage-content">');
    var $content2 = $('<div class="nk-fullpage-content">');
    var $content_button = $('<div class="nk-fullpage-view-button">');
    $fullPage.append($content);
    $fullPage.append($content2);
    $fullPage.append($content_button);

    // bullet navigation
    var $bullets = '<ul class="nk-fullpage-nav active">';
    for (var k = 0; k < slides.length; k++) {
        $bullets += '<li>' + slides[k].letter + '</li>';
    }
    $bullets += '</ul>';
    $bullets = $($bullets);
    $fullPage.append($bullets);
    var $bulletsItems = $bullets.children('li');

    // numbers
    var $numbers = $('<div class="nk-fullpage-number">');
    var $numbers2 = $('<div class="nk-fullpage-number">');
    $fullPage.append($numbers);
    $fullPage.append($numbers2);

    var isBusy = 0;
    var curIndex = 0;

    // show new slide
    // effect: fade, up, down
    function slideShow(index) {
        var effect = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'fade';
        var force = arguments[2];

        if (typeof slides[index] !== 'undefined' && curIndex != index && !isBusy || force) {
            isBusy = 1;

            // animate image background
            switch (effect) {
                case 'up':
                case 'down':
                    tween.set($image2, {
                        y: effect == 'down' ? '100%' : '-100%',
                        display: 'block'
                    });
                    $image2.css('background-image', 'url("' + slides[index].img + '")');
                    tween.to($image2, 0.8, {
                        y: '0%',
                        force3D: true,
                        ease: Power1.easeInOut
                    });
                    tween.to($image1, 0.8, {
                        opacity: 0,
                        scale: 0.9,
                        force3D: true,
                        ease: Power1.easeInOut,
                        onComplete: function onComplete() {
                            $image1.css('background-image', 'url("' + slides[index].img + '")');
                            tween.set($image1, {
                                scale: 1,
                                opacity: 1
                            });
                            $image2.css('background-image', '');
                            tween.set($image2, {
                                display: 'none'
                            });
                            isBusy = 0;
                        }
                    });
                    break;
                default:
                    // fade
                    tween.set($image2, {
                        opacity: 0,
                        display: 'block'
                    });
                    $image2.css('background-image', 'url("' + slides[index].img + '")');
                    tween.to($image2, 0.8, {
                        opacity: 1,
                        force3D: true,
                        onComplete: function onComplete() {
                            $image1.css('background-image', 'url("' + slides[index].img + '")');
                            $image2.css('background-image', '');
                            tween.set($image2, {
                                display: 'none'
                            });
                            isBusy = 0;
                        }
                    });
                    break;
            }

            // activate bullet
            $bulletsItems.removeClass('active');
            $bulletsItems.eq(index).addClass('active');

            // show slide number
            tween.set($numbers2, {
                opacity: 0,
                y: 0,
                display: 'block'
            });
            $numbers2.html(slides[index].number);
            tween.to($numbers, 0.5, {
                opacity: 0,
                y: -50,
                force3D: true
            });
            tween.to($numbers2, 0.5, {
                opacity: 1,
                y: 0,
                force3D: true,
                delay: 0.1,
                onComplete: function onComplete() {
                    $numbers.html(slides[index].number);
                    tween.set($numbers, {
                        opacity: 1,
                        y: 0
                    });
                    tween.set($numbers2, {
                        display: 'none'
                    });
                }
            });

            // set new content
            tween.set($content2, {
                opacity: 0,
                y: effect == 'down' ? 100 : -100,
                display: 'flex'
            });
            $content2.html(slides[index].$content);
            tween.to($content, 0.5, {
                opacity: 0,
                y: effect == 'down' ? -100 : 100,
                force3D: true
            });
            tween.to($content2, 0.5, {
                opacity: 1,
                y: 0,
                force3D: true,
                delay: 0.1,
                onComplete: function onComplete() {
                    $content.html(slides[index].$content);
                    tween.set($content, {
                        opacity: 1,
                        clearProps: 'transform'
                    });
                    tween.set($content2, {
                        display: 'none'
                    });
                }
            });

            // set new button
            $content_button.html(slides[index].$viewBtn);

            curIndex = index;
        }
    }
    slideShow(curIndex, 'fade', 1);
    $bullets.on('click', '> li', function () {
        var index = $(this).index();
        if (index > curIndex) {
            slideShow(index, 'down');
        } else if (index < curIndex) {
            slideShow(index, 'up');
        }
    });

    // show next / previous slider
    function slideShowNext() {
        if (curIndex != slides.length - 1) {
            slideShow(curIndex + 1, 'down');
        }
    }
    function slideShowPrev() {
        if (curIndex != 0) {
            slideShow(curIndex - 1, 'up');
        }
    }

    var wheelEvent = void 0;
    if ('onwheel' in document.createElement('div')) {
        wheelEvent = 'wheel';
    } else if ('onmousewheel' in document.createElement('div')) {
        wheelEvent = 'mousewheel';
    }
    if (wheelEvent) {
        // mouse wheel scroll
        $wnd.on(wheelEvent, function (e) {
            // check if delta >= 2 and mouse under slider
            if (Math.abs(e.originalEvent.deltaY) < 2 || !$(e.target).parents('.nk-fullpage-portfolio').length) {
                return;
            }

            if (e.originalEvent.deltaY > 0) {
                slideShowNext();
            } else if (e.originalEvent.deltaY < 0) {
                slideShowPrev();
            }
        });
    }

    // touch swipe
    var touchStart = 0;
    var touchDelta = 0;
    $wnd.on('touchstart', function (e) {
        touchStart = e.originalEvent.touches[0].screenY;
        touchDelta = 0;
    });
    $wnd.on('touchmove touchend', function (e) {
        var y = e.originalEvent.touches && e.originalEvent.touches.length ? e.originalEvent.touches[0].screenY : false;
        touchDelta = y === false ? touchDelta : touchStart - y;

        // check if delta >= 2 and mouse under slider
        if (Math.abs(touchDelta) < 2 || !$(e.target).parents('.nk-fullpage-portfolio').length) {
            return;
        }

        if (e.type === 'touchend') {
            if (touchDelta > 0) {
                slideShowNext();
            } else if (touchDelta < 0) {
                slideShowPrev();
            }
        }
    });
}

/*------------------------------------------------------------------

  Init AJAX Forms

-------------------------------------------------------------------*/
function _initForms() {
    if (typeof $.fn.ajaxSubmit === 'undefined' || typeof $.validator === 'undefined') {
        return;
    }
    var self = this;

    // Validate Forms
    $('form:not(.nk-form-ajax):not([novalidate])').each(function () {
        $(this).validate({
            errorClass: 'nk-error',
            errorElement: 'div',
            errorPlacement: function errorPlacement(error, element) {
                var $parent = element.parent('.input-group');
                if ($parent.length) {
                    $parent.after(error);
                } else {
                    element.after(error);
                }
                self.debounceResize();
            }
        });
    });
    // ajax form
    $('form.nk-form-ajax:not([novalidate])').each(function () {
        $(this).validate({
            errorClass: 'nk-error',
            errorElement: 'div',
            errorPlacement: function errorPlacement(error, element) {
                var $parent = element.parent('.input-group');
                if ($parent.length) {
                    $parent.after(error);
                } else {
                    element.after(error);
                }
                self.debounceResize();
            },

            // Submit the form via ajax (see: jQuery Form plugin)
            submitHandler: function submitHandler(form) {
                var $responseSuccess = $(form).find('.nk-form-response-success');
                var $responseError = $(form).find('.nk-form-response-error');
                $(form).ajaxSubmit({
                    type: 'POST',
                    success: function success(response) {
                        response = JSON.parse(response);
                        if (response.type && response.type === 'success') {
                            $responseError.hide();
                            $responseSuccess.html(response.response).show();
                            form.reset();
                        } else {
                            $responseSuccess.hide();
                            $responseError.html(response.response).show();
                        }
                        self.debounceResize();
                    },
                    error: function error(response) {
                        $responseSuccess.hide();
                        $responseError.html(response.responseText).show();
                        self.debounceResize();
                    }
                });
            }
        });
    });
}

/*------------------------------------------------------------------

 Team Block

 -------------------------------------------------------------------*/
function _initTeamBlock() {

    function activateMemberBlock($item) {
        var id = $item.attr('data-item-id');

        // add active class to item
        $item.siblings().removeClass('active');
        $item.addClass('active');

        // add class to item background
        $item.siblings('.nk-team-block-backgrounds:eq(0)').find('[data-bg-id="' + id + '"]').addClass('active').siblings().removeClass('active');
    }

    // prepare team blocks
    $('.nk-team-block').each(function () {
        var $this = $(this);

        // prepare backgrounds
        var $backgrounds = $('<div class="nk-team-block-backgrounds">');
        $this.find('.nk-team-member img.nk-team-member-photo').each(function () {
            var $img = $(this);
            var $parent = $img.parent();
            var id = $parent.index();

            $parent.attr('data-item-id', id);
            $('<div>').css({
                'background-image': 'url("' + $img.attr('src') + '")'
            }).attr('data-bg-id', id).appendTo($backgrounds);
        });
        $this.append($backgrounds);

        // activate item
        var $active_member = $this.children('.nk-team-member.active:eq(0)');
        if (!$active_member.length) {
            $active_member = $this.children('.nk-team-member:eq(0)');
        }
        activateMemberBlock($active_member);
    });

    // hover activation
    $body.on('click', '.nk-team-block .nk-team-member', function () {
        activateMemberBlock($(this));
    });
}

/*------------------------------------------------------------------

  Init Instagram

-------------------------------------------------------------------*/
function _initInstagram() {
    var self = this;
    var $instagram = $('.nk-instagram');
    if (!$instagram.length || !self.options.templates.instagram) {
        return;
    }

    /**
     * Templating a instagram item using '{{ }}' braces
     * @param  {Object} data Instagram item details are passed
     * @return {String} Templated string
     */
    function templating(data, temp) {
        var temp_variables = ['link', 'image', 'caption'];

        for (var i = 0, len = temp_variables.length; i < len; i++) {
            temp = temp.replace(new RegExp('{{' + temp_variables[i] + '}}', 'gi'), data[temp_variables[i]]);
        }

        return temp;
    }

    $instagram.each(function () {
        var $this = $(this);
        var options = {
            userID: $this.attr('data-instagram-user-id') || null,
            count: $this.attr('data-instagram-count') || 8,
            template: $this.attr('data-instagram-template') || self.options.templates.instagram,
            quality: $this.attr('data-instagram-quality') || 'sm', // sm, md, lg
            loadingText: self.options.templates.instagramLoadingText,
            failText: self.options.templates.instagramFailText,
            apiPath: self.options.templates.instagramApiPath
        };

        // stop if running in file protocol
        if (window.location.protocol === 'file:') {
            $this.html('<div class="col-12">' + options.failText + '</div>');
            console.error('You should run you website on webserver with PHP to get working Instagram');
            return;
        }

        $this.html('<div class="col-12">' + options.loadingText + '</div>');

        // Fetch instagram images
        $.getJSON(options.apiPath, {
            userID: options.userID,
            count: options.count
        }, function (response) {
            $this.html('');

            for (var i = 0; i < options.count; i++) {
                var instaItem = false;
                if (response[i]) {
                    instaItem = response[i];
                } else if (response.statuses && response.statuses[i]) {
                    instaItem = response.statuses[i];
                } else {
                    break;
                }

                var resolution = 'thumbnail';
                if (options.quality === 'md') {
                    resolution = 'low_resolution';
                }
                if (options.quality === 'lg') {
                    resolution = 'standard_resolution';
                }

                var temp_data = {
                    link: instaItem.link,
                    image: instaItem.images[resolution].url,
                    caption: instaItem.caption
                };

                $this.append(templating(temp_data, options.template));
            }

            // resize window
            self.debounceResize();
        }).fail(function (a) {
            $this.html('<div class="col-12">' + options.failText + '</div>');
            $.error(a.responseText);
        });
    });
}

/*------------------------------------------------------------------

  Init Twitter

-------------------------------------------------------------------*/
function _initTwitter() {
    var self = this;
    var $twtFeeds = $('.nk-twitter-list');
    if (!$twtFeeds.length || !self.options.templates.twitter) {
        return;
    }

    /**
     * Templating a tweet using '{{ }}' braces
     * @param  {Object} data Tweet details are passed
     * @return {String}      Templated string
     */
    function templating(data, temp) {
        var temp_variables = ['date', 'tweet', 'avatar', 'url', 'retweeted', 'screen_name', 'user_name'];

        for (var i = 0, len = temp_variables.length; i < len; i++) {
            temp = temp.replace(new RegExp('{{' + temp_variables[i] + '}}', 'gi'), data[temp_variables[i]]);
        }

        return temp;
    }

    $twtFeeds.each(function () {
        var $this = $(this);
        var options = {
            username: $this.attr('data-twitter-user-name') || null,
            list: null,
            hashtag: $this.attr('data-twitter-hashtag') || null,
            count: $this.attr('data-twitter-count') || 2,
            hideReplies: $this.attr('data-twitter-hide-replies') === 'true' ? true : false,
            template: $this.attr('data-twitter-template') || self.options.templates.twitter,
            loadingText: self.options.templates.twitterLoadingText,
            failText: self.options.templates.twitterFailText,
            apiPath: self.options.templates.twitterApiPath
        };

        // stop if running in file protocol
        if (window.location.protocol === 'file:') {
            $this.html(options.failText);
            console.error('You should run you website on webserver with PHP to get working Twitter');
            return;
        }

        // Set loading
        $this.html('<span>' + options.loadingText + '</span>');

        // Fetch tweets
        $.getJSON(options.apiPath, {
            username: options.username,
            list: options.list,
            hashtag: options.hashtag,
            count: options.count,
            exclude_replies: options.hideReplies
        }, function (twt) {
            $this.html('');

            for (var i = 0; i < options.count; i++) {
                var tweet = false;
                if (twt[i]) {
                    tweet = twt[i];
                } else if (twt.statuses && twt.statuses[i]) {
                    tweet = twt.statuses[i];
                } else {
                    break;
                }

                var temp_data = {
                    user_name: tweet.user.name,
                    date: tweet.date_formatted,
                    tweet: tweet.text_entitled,
                    avatar: '<img src="' + tweet.user.profile_image_url + '" />',
                    url: 'https://twitter.com/' + tweet.user.screen_name + '/status/' + tweet.id_str,
                    retweeted: tweet.retweeted,
                    screen_name: '@' + tweet.user.screen_name
                };

                $this.append(templating(temp_data, options.template));
            }

            // resize window
            self.debounceResize();
        }).fail(function (a) {
            $this.html(options.failText);
            $.error(a.responseText);
        });
    });
}

/*------------------------------------------------------------------

  Init Documentation

-------------------------------------------------------------------*/
function _initDoc() {
    var self = this;
    var $menu = $('.nk-doc-links');
    var $firstBlocks = $('.nk-doc > .nk-doc-item');
    var $childBlocks = $('.nk-doc > .nk-doc-item > .nk-doc-item');
    var $blocks = $firstBlocks.add($childBlocks);
    var blocks = [];

    if (!$blocks.length) {
        return;
    }

    // get block by attr
    function getBlocksBy(by, val, getFrom) {
        var result = [];
        getFrom = getFrom || blocks;
        for (var k = 0; k < getFrom.length; k++) {
            if (getFrom[k] && typeof getFrom[k][by] !== 'undefined' && getFrom[k][by] === val) {
                result.push(getFrom[k]);
            }
        }
        return result;
    }

    // prepare links
    var uniqID = 0;
    var hashID = 0;
    function prepareLinks($block) {
        if (!hashID) {
            uniqID++;
        }
        var title = $block.find('> h2, > h3').eq(0).text();
        var hash = 'doc-' + title.replace(/\s+/g, '-').toLowerCase() + (hashID ? '-' + hashID : '');

        if (getBlocksBy('hash', hash).length) {
            hashID++;
            return prepareLinks($block);
        }

        $block.attr('data-id', uniqID);

        // add parent value if this is child
        var parent = false;
        var $parent = $block.parents('.nk-doc-item:eq(0)');
        if ($parent.length) {
            parent = parseInt($parent.attr('data-id'), 10);
        }

        hashID = 0;

        return {
            id: uniqID,
            title: title,
            hash: hash,
            $block: $block,
            parent: parent
        };
    }
    $firstBlocks.each(function () {
        var block = prepareLinks($(this));
        blocks.push(block);
    });
    $childBlocks.each(function () {
        var block = prepareLinks($(this));
        blocks.push(block);
    });

    // activate block
    var firstRun = 1;
    function activeBlock(id) {
        // add hash
        var selectedBlock = getBlocksBy('id', id)[0];
        var issetChilds = getBlocksBy('parent', id)[0];
        if (issetChilds) {
            activeBlock(issetChilds.id);
            return;
        }
        if (selectedBlock) {
            // hide all blocks
            $blocks.hide();

            // activate menu item
            $menu.find('[data-id]').removeClass('active');
            $menu.find('[data-id=' + id + ']').addClass('active');

            // activate parent menu item
            var parentBlock = getBlocksBy('id', selectedBlock.parent)[0];
            if (parentBlock) {
                $menu.find('[data-id=' + selectedBlock.parent + ']').addClass('active');

                // show parent
                parentBlock.$block.show();
            }

            // show submenu
            var $sub_menus = $menu.find('[data-id] + ul');
            $sub_menus.each(function () {
                var $this = $(this);
                var isActive = !!$this.find('[data-id].active').length;
                var isOpened = $this.hasClass('opened');

                // open
                if (isActive && !isOpened) {
                    $this.css('height', '');
                    $this.show();
                    var h = $this.innerHeight();
                    $this.hide();
                    tween.set($this, {
                        height: 0
                    });
                    tween.to($this, 0.4, {
                        height: h,
                        display: 'block',
                        onComplete: function onComplete() {
                            self.debounceResize();
                        }
                    });
                    $this.addClass('opened');

                    // close
                }

                if (!isActive && isOpened) {
                    tween.to($this, 0.4, {
                        height: 0,
                        display: 'none',
                        onComplete: function onComplete() {
                            self.debounceResize();
                        }
                    });
                    $this.removeClass('opened');
                }
            });

            // show current
            selectedBlock.$block.show();

            location.hash = selectedBlock.hash;

            // resize and scroll to top
            if (!firstRun) {
                self.debounceResize();
                self.scrollTo($('.nk-header-title').next());
            }
            firstRun = 0;
        }
    }

    // create side menu
    var menuTemplate = '';
    for (var k = 0; k < blocks.length; k++) {
        if (blocks[k].parent === false) {
            var childs = getBlocksBy('parent', blocks[k].id);

            menuTemplate += '<li><div data-id="' + blocks[k].id + '">' + blocks[k].title + (childs.length ? ' <sup>[' + childs.length + ']</sup>' : '') + '</div>';

            // add childs
            if (childs.length) {
                menuTemplate += '<ul>';
                for (var i = 0; i < childs.length; i++) {
                    menuTemplate += '<li><div data-id="' + childs[i].id + '">' + childs[i].title + '</div>';
                }
                menuTemplate += '</ul>';
            }

            menuTemplate += '</li>';
        }
    }
    $menu.html('<ul>' + menuTemplate + '</ul>');
    $menu.on('click', '[data-id]:not(.active)', function () {
        activeBlock(parseInt($(this).attr('data-id'), 10));
    });

    // activate default block
    if (location.hash) {
        var curBlock = getBlocksBy('hash', location.hash.replace('#', ''));
        if (curBlock[0]) {
            activeBlock(curBlock[0].id);
        }
    } else {
        activeBlock(blocks[0].id);
    }
}

/*------------------------------------------------------------------

  Init Plugin Sticky Sidebar

-------------------------------------------------------------------*/
function _initPluginStickySidebar() {
    if (typeof $.fn.stick_in_parent === 'undefined') {
        return;
    }

    $('.nk-sidebar-sticky').each(function () {
        var $this = $(this);
        var $parent = $this.parent();

        $parent.addClass('nk-sidebar-sticky-parent');

        $this.wrapInner('<div>').children().stick_in_parent({
            parent: $parent,
            recalc_every: 50,
            offset_top: parseInt($this.attr('data-offset-top'), 10) || 0,

            // fixed ADS reloading issue https://github.com/leafo/sticky-kit/issues/45
            spacer: false
        })

        // we need to set min height on parent block (in theme it is equal height column) to prevent sidebar content jumping
        .on('sticky_kit:unbottom sticky_kit:stick sticky_kit:bottom', function () {
            $parent.css('min-height', $(this).height());
        }).on('sticky_kit:unstick', function () {
            $parent.css('min-height', '');
        });
    });
}

/* Nano Scroller */
function _initPluginNano($context) {
    if (typeof $.fn.nanoScroller !== 'undefined') {
        ($context || $doc).find('.nano').nanoScroller();
    }
}

/* Jarallax */
function _initPluginJarallax() {
    if (typeof $.fn.jarallax === 'undefined') {
        return;
    }
    var self = this;

    // header parallax
    var $parallaxHeader = $('.nk-header-title-parallax, .nk-header-title-parallax-opacity').eq(0);
    if ($parallaxHeader.length) {
        (function () {
            var $headerImage = $parallaxHeader.find('> .bg-image > div:eq(0)');
            var $headerContent = $parallaxHeader.find('> .bg-image ~ *');
            var headerParallaxScroll = $parallaxHeader.hasClass('nk-header-title-parallax');
            var headerParallaxOpacity = $parallaxHeader.hasClass('nk-header-title-parallax-opacity');
            $parallaxHeader.jarallax({
                type: 'custom',
                imgSrc: 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7',
                imgWidth: 1,
                imgHeight: 1,
                onScroll: function onScroll(calc) {
                    var scrollImg = Math.min(100, 100 * (1 - calc.visiblePercent));
                    var scrollInfo = Math.min(50, 50 * (1 - calc.visiblePercent));

                    // fix if top banner not on top
                    if (calc.beforeTop > 0) {
                        scrollImg = 0;
                        scrollInfo = 0;
                    }

                    if (headerParallaxScroll) {
                        $headerImage.css({
                            transform: 'translateY(' + scrollImg + 'px) translateZ(0)'
                        });
                        $headerContent.css({
                            transform: 'translateY(' + scrollInfo + 'px) translateZ(0)'
                        });
                    }
                    if (headerParallaxOpacity) {
                        $headerContent.css({
                            opacity: calc.visiblePercent < 0 || calc.beforeTop > 0 ? 1 : calc.visiblePercent
                        });
                    }
                }
            });
        })();
    }

    // footer parallax
    var $parallaxFooter = $('.nk-footer-parallax, .nk-footer-parallax-opacity').eq(0);
    if ($parallaxFooter.length) {
        (function () {
            var $footerImage = $parallaxFooter.find('> .bg-image > div');
            var $footerContent = $parallaxFooter.find('> .bg-image ~ *');
            var footerParallaxScroll = $parallaxFooter.hasClass('nk-footer-parallax');
            var footerParallaxOpacity = $parallaxFooter.hasClass('nk-footer-parallax-opacity');
            $parallaxFooter.jarallax({
                type: 'custom',
                imgSrc: 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7',
                imgWidth: 1,
                imgHeight: 1,
                onScroll: function onScroll(calc) {
                    var scrollImg = -Math.min(100, 100 * (1 - calc.visiblePercent));
                    var scrollInfo = -Math.min(50, 50 * (1 - calc.visiblePercent));
                    if (footerParallaxScroll) {
                        $footerImage.css({
                            transform: 'translateY(' + scrollImg + 'px) translateZ(0)'
                        });
                        $footerContent.css({
                            transform: 'translateY(' + scrollInfo + 'px) translateZ(0)'
                        });
                    }
                    if (footerParallaxOpacity) {
                        $footerContent.css({
                            opacity: calc.visiblePercent < 0 ? 1 : calc.visiblePercent
                        });
                    }
                }
            });
        })();
    }

    // video backgrounds
    $('.bg-video[data-video]').each(function () {
        $(this).attr('data-jarallax-video', $(this).attr('data-video'));
        $(this).removeAttr('data-video');
    });

    // primary parallax
    $('.bg-image-parallax, .bg-video-parallax').jarallax({
        speed: self.options.parallaxSpeed
    });

    // video without parallax
    $('.bg-video:not(.bg-video-parallax)').jarallax({
        speed: 1
    });
}

/* Flickity */
function _initPluginFlickity() {
    if (typeof window.Flickity === 'undefined') {
        return;
    }

    var self = this;

    function addDefaultArrows($carousel) {
        $('<div class="nk-flickity-arrow nk-flickity-arrow-prev"><span class="pe-7s-angle-left"></span></div>').on('click', function () {
            $carousel.flickity('previous');
        }).appendTo($carousel);

        $('<div class="nk-flickity-arrow nk-flickity-arrow-next"><span class="pe-7s-angle-right"></span></div>').on('click', function () {
            $carousel.flickity('next');
        }).appendTo($carousel);
    }

    function updateCustomArrows($carousel) {
        var data = $carousel.children('.nk-carousel-inner').data('flickity');
        var currIndex = data.selectedIndex;
        var nextIndex = void 0;
        var prevIndex = void 0;

        // get next and prev cells
        if (currIndex === 0) {
            nextIndex = 1;
            prevIndex = data.cells.length - 1;
        } else if (currIndex === data.cells.length - 1) {
            nextIndex = 0;
            prevIndex = data.cells.length - 2;
        } else {
            nextIndex = currIndex + 1;
            prevIndex = currIndex - 1;
        }
        var $nextCell = $(data.cells[nextIndex].element);
        var $prevCell = $(data.cells[prevIndex].element);
        var $currCell = $(data.cells[currIndex].element);

        // get name and sources
        var nextName = $nextCell.find('.nk-carousel-item-name').text();
        var prevName = $prevCell.find('.nk-carousel-item-name').text();
        var currName = $currCell.find('.nk-carousel-item-name').html();
        var currLinks = $currCell.find('.nk-carousel-item-links').html();

        // add info to buttons
        $carousel.find('.nk-carousel-next > .nk-carousel-arrow-name').html(nextName);
        $carousel.find('.nk-carousel-prev > .nk-carousel-arrow-name').html(prevName);
        $carousel.find('.nk-carousel-current > .nk-carousel-name').html(currName);
        $carousel.find('.nk-carousel-current > .nk-carousel-links').html(currLinks);
    }

    // prevent click event fire when drag carousel
    function noClickEventOnDrag($carousel) {
        $carousel.on('dragStart', function () {
            $(this).find('.flickity-viewport').addClass('is-dragging');
        });
        $carousel.on('dragEnd', function () {
            $(this).find('.flickity-viewport').removeClass('is-dragging');
        });
    }

    // carousel 1
    var $carousel1 = $('.nk-carousel');
    if ($carousel1.length) {
        $carousel1.children('.nk-carousel-inner').each(function () {
            $(this).flickity({
                pageDots: $(this).parent().attr('data-dots') === 'true' || false,
                autoPlay: parseFloat($(this).parent().attr('data-autoplay')) || false,
                prevNextButtons: false,
                wrapAround: true,
                cellAlign: $(this).parent().attr('data-cell-align') || 'center'
            });
            if ($(this).parent().attr('data-arrows') === 'true') {
                addDefaultArrows($(this));
            }
            updateCustomArrows($(this).parent());
        }).on('cellSelect', function () {
            updateCustomArrows($(this).parent());
        });
        $carousel1.on('click', '.nk-carousel-next', function () {
            $(this).parent().children('.nk-carousel-inner').flickity('next');
        });
        $carousel1.on('click', '.nk-carousel-prev', function () {
            $(this).parent().children('.nk-carousel-inner').flickity('previous');
        });
        noClickEventOnDrag($carousel1.children('.nk-carousel-inner'));
    }

    // carousel 2
    $('.nk-carousel-2 > .nk-carousel-inner').each(function () {
        $(this).flickity({
            pageDots: $(this).parent().attr('data-dots') === 'true' || false,
            autoPlay: parseFloat($(this).parent().attr('data-autoplay')) || false,
            prevNextButtons: false,
            wrapAround: true,
            imagesLoaded: true,
            cellAlign: $(this).parent().attr('data-cell-align') || 'center'
        });
        if ($(this).parent().attr('data-arrows') === 'true') {
            addDefaultArrows($(this));
        }
        noClickEventOnDrag($(this));
    });

    // carousel 3
    var $carousel3 = $('.nk-carousel-3');
    // set height for items
    function setHeightCarousel3() {
        $carousel3.each(function () {
            var $allImages = $(this).find('img');
            var size = $(this).attr('data-size') || 0.8;
            var resultH = wndH * size;
            var maxItemW = Math.min($(this).parent().width(), wndW) * size;
            $allImages.each(function () {
                if (this.naturalWidth && this.naturalHeight && resultH * this.naturalWidth / this.naturalHeight > maxItemW) {
                    resultH = maxItemW * this.naturalHeight / this.naturalWidth;
                }
            });
            $allImages.css('height', resultH);
            $(this).children('.nk-carousel-inner').flickity('reposition');
        });
    }
    if ($carousel3.length) {
        $carousel3.children('.nk-carousel-inner').each(function () {
            $(this).flickity({
                pageDots: $(this).parent().attr('data-dots') === 'true' || false,
                autoPlay: parseFloat($(this).parent().attr('data-autoplay')) || false,
                prevNextButtons: false,
                wrapAround: true,
                imagesLoaded: true,
                cellAlign: $(this).parent().attr('data-cell-align') || 'center'
            });
            updateCustomArrows($(this).parent());
            if ($(this).parent().attr('data-arrows') === 'true') {
                addDefaultArrows($(this));
            }
        }).on('cellSelect', function () {
            updateCustomArrows($(this).parent());
        });
        $carousel3.on('click', '.nk-carousel-next', function () {
            $(this).parents('.nk-carousel-3:eq(0)').children('.nk-carousel-inner').flickity('next');
        });
        $carousel3.on('click', '.nk-carousel-prev', function () {
            $(this).parents('.nk-carousel-3:eq(0)').children('.nk-carousel-inner').flickity('previous');
        });
        setHeightCarousel3();
        self.debounceResize(setHeightCarousel3);
        noClickEventOnDrag($carousel3.children('.nk-carousel-inner'));
    }

    // update products carousel
    var $storeCarousel = $('.nk-carousel-1, .nk-carousel-2, .nk-carousel-3').filter('.nk-store');
    function updateStoreProducts() {
        $storeCarousel.each(function () {
            var currentTallest = 0;
            var currentRowStart = 0;
            var rowDivs = [];
            var topPosition = 0;
            var currentDiv = 0;
            var $el = void 0;
            $(this).find('.nk-product').each(function () {
                $el = $(this);
                $el.css('height', '');
                topPosition = $el.position().top;

                if (currentRowStart !== topPosition) {
                    for (currentDiv = 0; currentDiv < rowDivs.length; currentDiv++) {
                        rowDivs[currentDiv].css('height', currentTallest);
                    }
                    rowDivs.length = 0; // empty the array
                    currentRowStart = topPosition;
                    currentTallest = $el.innerHeight();
                    rowDivs.push($el);
                } else {
                    rowDivs.push($el);
                    currentTallest = currentTallest < $el.innerHeight() ? $el.innerHeight() : currentTallest;
                }
                for (currentDiv = 0; currentDiv < rowDivs.length; currentDiv++) {
                    rowDivs[currentDiv].css('height', currentTallest);
                }
            });
        });
    }
    if ($storeCarousel.length) {
        self.debounceResize(updateStoreProducts);
        updateStoreProducts();
    }
}

/* Isotope */
function _initPluginIsotope() {
    if (typeof window.Isotope === 'undefined') {
        return;
    }
    var self = this;

    $('.nk-isotope').each(function () {
        var $this = $(this);
        var $grid = $this.isotope({
            itemSelector: '.nk-isotope-item'
        });
        $grid.imagesLoaded().progress(function () {
            $grid.isotope('layout');
        });
        $grid.on('arrangeComplete', function () {
            self.debounceResize();
        });

        // filter
        var $filter = [];
        if ($this.parent().hasClass('nk-portfolio-list')) {
            $filter = $this.parent().prev('.nk-isotope-filter');
        } else {
            $filter = $this.prev('.nk-isotope-filter');
        }
        if ($filter.length) {
            $filter.on('click', '[data-filter]', function (e) {
                e.preventDefault();
                var filter = $(this).attr('data-filter');

                $(this).addClass('active').siblings().removeClass('active');

                $grid.isotope({
                    filter: filter === '*' ? '' : '[data-filter*=' + filter + ']'
                });
            });
        }
    });

    // filter toggler
    $body.on('click', '[href="#nk-toggle-filter"]:not(.busy)', function (e) {
        var $pagination = $(this).parent('.nk-pagination');
        var $filter = $pagination.next('.nk-isotope-filter');
        var isActive = $filter.hasClass('nk-isotope-filter-active');

        if (!$pagination.length || !$filter.length) {
            return;
        }

        e.preventDefault();
        e.stopPropagation();

        $pagination.addClass('busy');

        if (isActive) {
            tween.staggerTo($filter.children(), 0.2, {
                y: -10,
                opacity: 0
            }, 0.04, function () {
                tween.to($filter, 0.4, {
                    height: 0,
                    marginBottom: 0,
                    marginTop: 0,
                    force3D: true,
                    display: 'none',
                    onComplete: function onComplete() {
                        $pagination.removeClass('nk-isotope-filter-active');
                        $filter.removeClass('nk-isotope-filter-active');
                        $pagination.removeClass('busy');
                        _debounceResize();
                    }
                });
            });
        } else {
            $filter.css('height', 'auto');
            var filterHeight = $filter.height();
            $filter.css('height', 0);
            tween.set($filter.children(), {
                y: -10,
                opacity: 0
            });
            tween.to($filter, 0.4, {
                height: filterHeight,
                marginBottom: 30,
                marginTop: -23,
                force3D: true,
                display: 'block',
                onComplete: function onComplete() {
                    tween.staggerTo($filter.children(), 0.2, {
                        y: 0,
                        opacity: 1
                    }, 0.04, function () {
                        $pagination.addClass('nk-isotope-filter-active');
                        $filter.addClass('nk-isotope-filter-active');
                        $pagination.removeClass('busy');
                        _debounceResize();
                    });
                }
            });
        }
    });
}

/* PhotoSwipe */
function _initPluginPhotoswipe() {
    var $gallery = $('.nk-popup-gallery');
    if (typeof PhotoSwipe === 'undefined' || !$gallery.length) {
        return;
    }

    // prepare photoswipe markup
    var markup = '<div id="gallery" class="pswp" tabindex="-1" role="dialog" aria-hidden="true">\n          <div class="pswp__bg"></div>\n          <div class="pswp__scroll-wrap">\n            <div class="pswp__container">\n              <div class="pswp__item"></div>\n              <div class="pswp__item"></div>\n              <div class="pswp__item"></div>\n            </div>\n            <div class="pswp__ui pswp__ui--hidden">\n              <div class="pswp__top-bar">\n                <div class="pswp__counter"></div>\n                <button class="pswp__button pswp__button--close" title="Close (Esc)"></button>\n                <button class="pswp__button pswp__button--zoom" title="Zoom in/out"></button>\n                <div class="pswp__preloader">\n                  <div class="pswp__preloader__icn">\n                    <div class="pswp__preloader__cut">\n                      <div class="pswp__preloader__donut"></div>\n                    </div>\n                  </div>\n                </div>\n              </div>\n              <div class="pswp__loading-indicator"><div class="pswp__loading-indicator__line"></div></div>\n              <button class="pswp__button pswp__button--arrow--left" title="Previous (arrow left)"></button>\n              <button class="pswp__button pswp__button--arrow--right" title="Next (arrow right)"></button>\n              <div class="pswp__caption">\n                <div class="pswp__caption__center">\n                </div>\n              </div>\n            </div>\n          </div>\n        </div>';
    $body.append(markup);

    // init code
    var parseThumbnailElements = function parseThumbnailElements(el) {
        var thumbElements = $(el).find('a.nk-gallery-item'),
            items = [],
            childElements = void 0,
            descrElement = void 0,
            size = void 0,
            item = void 0;

        thumbElements.each(function () {
            childElements = $(this).find('img');
            descrElement = $(this).next('.nk-gallery-item-description');
            size = (this.getAttribute('data-size') || '1920x1080').split('x');

            // create slide object
            item = {
                src: this.getAttribute('href'),
                w: parseInt(size[0], 10),
                h: parseInt(size[1], 10),
                author: this.getAttribute('data-author')
            };

            if (descrElement.length) {
                item.title = descrElement.html();
            }

            // save link to element for getThumbBoundsFn
            item.el = this;

            if (childElements.length > 0) {
                // thumbnail url
                item.msrc = item.src;
                if (childElements.length > 1) {
                    item.title = $(childElements).filter('.photoswipe-description').html();
                }
            }

            var mediumSrc = this.getAttribute('data-med') || item.src;
            if (mediumSrc) {
                size = (this.getAttribute('data-med-size') || this.getAttribute('data-size') || '1920x1080').split('x');
                // "medium-sized" image
                item.m = {
                    src: mediumSrc,
                    w: parseInt(size[0], 10),
                    h: parseInt(size[1], 10)
                };
            }

            // original image
            item.o = {
                src: item.src,
                w: item.w,
                h: item.h
            };
            items.push(item);
        });

        return items;
    };

    var openPhotoSwipe = function openPhotoSwipe(index, galleryElement, disableAnimation, fromURL) {
        var pswpElement = $('.pswp')[0],
            gallery = void 0,
            options = void 0,
            items = void 0;

        items = parseThumbnailElements(galleryElement);

        // define options (if needed)
        options = {
            captionAndToolbarShowEmptyCaptions: false,
            mainClass: 'pswp--minimal--dark',
            barsSize: { top: 0, bottom: 0 },
            captionEl: true,
            fullscreenEl: false,
            shareEl: false,
            bgOpacity: 0.85,
            tapToClose: true,
            tapToToggleControls: false,
            showHideOpacity: true,

            // Function builds caption markup
            addCaptionHTMLFn: function addCaptionHTMLFn(item, captionEl) {
                // item      - slide object
                // captionEl - caption DOM element
                // isFake    - true when content is added to fake caption container
                //             (used to get size of next or previous caption)

                if (!item.title && !item.author) {
                    captionEl.children[0].innerHTML = '';
                    return false;
                }
                var caption = '';
                if (item.title) {
                    caption += item.title;
                }
                if (item.author) {
                    if (item.title) {
                        caption += '<br>';
                    }
                    caption += '<small>' + item.author + '</small>';
                }
                captionEl.children[0].innerHTML = caption;
                return true;
            },

            galleryUID: galleryElement.getAttribute('data-pswp-uid')
        };

        if (fromURL) {
            if (options.galleryPIDs) {
                // parse real index when custom PIDs are used
                // http://photoswipe.com/documentation/faq.html#custom-pid-in-url
                for (var j = 0; j < items.length; j++) {
                    if (items[j].pid === index) {
                        options.index = j;
                        break;
                    }
                }
            } else {
                options.index = parseInt(index, 10) - 1;
            }
        } else {
            options.index = parseInt(index, 10);
        }

        // exit if index not found
        if (isNaN(options.index)) {
            return;
        }

        if (disableAnimation) {
            options.showAnimationDuration = 0;
        }

        // Pass data to PhotoSwipe and initialize it
        gallery = new PhotoSwipe(pswpElement, PhotoSwipeUI_Default, items, options);

        // see: http://photoswipe.com/documentation/responsive-images.html
        var realViewportWidth = void 0,
            useLargeImages = false,
            firstResize = true,
            imageSrcWillChange = void 0;

        gallery.listen('beforeResize', function () {
            var dpiRatio = window.devicePixelRatio ? window.devicePixelRatio : 1;
            dpiRatio = Math.min(dpiRatio, 2.5);
            realViewportWidth = gallery.viewportSize.x * dpiRatio;

            if (realViewportWidth >= 1200 || !gallery.likelyTouchDevice && realViewportWidth > 800 || screen.width > 1200) {
                if (!useLargeImages) {
                    useLargeImages = true;
                    imageSrcWillChange = true;
                }
            } else {
                if (useLargeImages) {
                    useLargeImages = false;
                    imageSrcWillChange = true;
                }
            }

            if (imageSrcWillChange && !firstResize) {
                gallery.invalidateCurrItems();
            }

            if (firstResize) {
                firstResize = false;
            }

            imageSrcWillChange = false;
        });

        gallery.listen('gettingData', function (idx, item) {
            if (useLargeImages) {
                item.src = item.o.src;
                item.w = item.o.w;
                item.h = item.o.h;
            } else {
                item.src = item.m.src;
                item.w = item.m.w;
                item.h = item.m.h;
            }
        });

        gallery.init();
    };

    var photoswipeParseHash = function photoswipeParseHash() {
        var hash = window.location.hash.substring(1),
            params = {};

        if (hash.length < 5) {
            // pid=1
            return params;
        }

        var vars = hash.split('&');
        for (var _i = 0; _i < vars.length; _i++) {
            if (!vars[_i]) {
                continue;
            }
            var pair = vars[_i].split('=');
            if (pair.length < 2) {
                continue;
            }
            params[pair[0]] = pair[1];
        }

        if (params.gid) {
            params.gid = parseInt(params.gid, 10);
        }

        return params;
    };

    // select all gallery elements
    var i = 0;
    $gallery.each(function () {
        var $thisGallery = $(this);
        $thisGallery.attr('data-pswp-uid', i + 1);

        $thisGallery.on('click', 'a.nk-gallery-item', function (e) {
            e.preventDefault();
            var index = 0;
            var clicked = this;
            $thisGallery.find('a.nk-gallery-item').each(function (idx) {
                if (this === clicked) {
                    index = idx;
                    return false;
                }
                return true;
            });
            openPhotoSwipe(index, $thisGallery[0]);
        });
        i++;
    });

    // Parse URL and open gallery if it contains #&pid=3&gid=1
    var hashData = photoswipeParseHash();
    if (hashData.pid && hashData.gid) {
        openPhotoSwipe(hashData.pid, $gallery.get(hashData.gid - 1), true, true);
    }
}

/* Bootstrap Tabs */
function _initPluginTabs() {
    var self = this;
    $wnd.on('shown.bs.tab', function () {
        self.debounceResize();
    });
}

/*------------------------------------------------------------------

  Snow Class

-------------------------------------------------------------------*/

var SNOW = function () {
    function SNOW() {
        _classCallCheck(this, SNOW);

        this.options = options;
    }

    _createClass(SNOW, [{
        key: 'init',
        value: function init() {
            var self = this;
            self.initNavbar();
            self.initNavbarSide();
            self.initNavbarFullscreen();
            self.initNavbarDropEffect1();
            self.initHeaderTitle();
            self.initCounters();
            self.initAnchors();
            self.initVideoBlocks();
            self.initFullPage();
            self.initForms();
            self.initTeamBlock();
            self.initInstagram();
            self.initTwitter();
            self.initShortcuts();
            self.initDoc();

            // init plugins
            self.initPluginStickySidebar();
            self.initPluginNano();
            self.initPluginJarallax();
            self.initPluginFlickity();
            self.initPluginIsotope();
            self.initPluginPhotoswipe();
            self.initPluginTabs();

            return self;
        }
    }, {
        key: 'setOptions',
        value: function setOptions(newOpts) {
            return _setOptions.call(this, newOpts);
        }
    }, {
        key: 'debounceResize',
        value: function debounceResize(func) {
            return _debounceResize.call(this, func);
        }
    }, {
        key: 'throttleScroll',
        value: function throttleScroll(callback) {
            return _throttleScroll.call(this, callback);
        }
    }, {
        key: 'bodyOverflow',
        value: function bodyOverflow(type) {
            return _bodyOverflow.call(this, type);
        }
    }, {
        key: 'isInViewport',
        value: function isInViewport($item, returnRect) {
            return _isInViewport.call(this, $item, returnRect);
        }
    }, {
        key: 'scrollTo',
        value: function scrollTo($to, callback) {
            return _scrollTo.call(this, $to, callback);
        }
    }, {
        key: 'key',
        value: function key(name, callback) {
            return _key.call(this, name, callback);
        }
    }, {
        key: 'initShortcuts',
        value: function initShortcuts() {
            return _initShortcuts.call(this);
        }
    }, {
        key: 'initHeaderTitle',
        value: function initHeaderTitle() {
            return _initHeaderTitle.call(this);
        }
    }, {
        key: 'initNavbar',
        value: function initNavbar() {
            return _initNavbar.call(this);
        }
    }, {
        key: 'initNavbarSide',
        value: function initNavbarSide() {
            return _initNavbarSide.call(this);
        }
    }, {
        key: 'initNavbarFullscreen',
        value: function initNavbarFullscreen() {
            return _initNavbarFullscreen.call(this);
        }
    }, {
        key: 'initNavbarDropEffect1',
        value: function initNavbarDropEffect1() {
            return _initNavbarDropEffect.call(this);
        }
    }, {
        key: 'initCounters',
        value: function initCounters() {
            return _initCounters.call(this);
        }
    }, {
        key: 'initAnchors',
        value: function initAnchors() {
            return _initAnchors.call(this);
        }
    }, {
        key: 'initVideoBlocks',
        value: function initVideoBlocks() {
            return _initVideoBlocks.call(this);
        }
    }, {
        key: 'initFullPage',
        value: function initFullPage() {
            return _initFullPage.call(this);
        }
    }, {
        key: 'initForms',
        value: function initForms() {
            return _initForms.call(this);
        }
    }, {
        key: 'initTeamBlock',
        value: function initTeamBlock() {
            return _initTeamBlock.call(this);
        }
    }, {
        key: 'initInstagram',
        value: function initInstagram() {
            return _initInstagram.call(this);
        }
    }, {
        key: 'initTwitter',
        value: function initTwitter() {
            return _initTwitter.call(this);
        }
    }, {
        key: 'initDoc',
        value: function initDoc() {
            return _initDoc.call(this);
        }
    }, {
        key: 'initPluginStickySidebar',
        value: function initPluginStickySidebar() {
            return _initPluginStickySidebar.call(this);
        }
    }, {
        key: 'initPluginNano',
        value: function initPluginNano($context) {
            return _initPluginNano.call(this, $context);
        }
    }, {
        key: 'initPluginJarallax',
        value: function initPluginJarallax($context) {
            return _initPluginJarallax.call(this, $context);
        }
    }, {
        key: 'initPluginFlickity',
        value: function initPluginFlickity($context) {
            return _initPluginFlickity.call(this, $context);
        }
    }, {
        key: 'initPluginIsotope',
        value: function initPluginIsotope($context) {
            return _initPluginIsotope.call(this, $context);
        }
    }, {
        key: 'initPluginPhotoswipe',
        value: function initPluginPhotoswipe($context) {
            return _initPluginPhotoswipe.call(this, $context);
        }
    }, {
        key: 'initPluginTabs',
        value: function initPluginTabs($context) {
            return _initPluginTabs.call(this, $context);
        }
    }]);

    return SNOW;
}();

/*------------------------------------------------------------------

  Init Snow

-------------------------------------------------------------------*/


window.Snow = new SNOW();
}());
