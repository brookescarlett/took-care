/**
 * Demo Scripts. Remove it on Production
 */
;(function ($) {
    'use strict';

    /**
     * Click on load more works / posts button
     */
    $(document).on('click', '.nk-pagination > a', function (e) {
        var $this = $(this);
        var isWorks = $this.html() == 'Load More Works';
        var isPosts = $this.html() == 'Load More Posts';

        if (isWorks || isPosts) {
            e.preventDefault();
            $this.html('<i class="fa fa-cog fa-spin fa-fw"></i>');
            setTimeout(function () {
                $this.html(isWorks ? 'All Works Shown' : 'All Posts Shown');
            }, 1500);
        }
    });

    /**
     * Features Toggler
     */
    var featuresCSS =
        '<style>' +
        '.nk-theme-features {' +
        '   position: fixed;' +
        '   top: 120px;' +
        '   width: 205px;' +
        '   right: -205px;' +
        '   background-color: #fff;' +
        '   padding: 29px;' +
        '   text-align: center;' +
        '   border: 1px solid #f3f3f3;' +
        '   color: #404040;' +
        '   z-index: 2;' +
        '   -webkit-transition: .3s right;' +
        '   transition: .3s right;' +
        '}' +
        '.nk-theme-features.active {' +
        '   right: 0;' +
        '}' +
        '.nk-theme-features-toggler {' +
        '   position: absolute;' +
        '   font-size: 17px;' +
        '   top: -1px;' +
        '   left: -37px;' +
        '   width: 37px;' +
        '   height: 37px;' +
        '   line-height: 37px;' +
        '   cursor: pointer;' +
        '   background-color: #fff;' +
        '   border: 1px solid #f3f3f3;' +
        '   border-right: none;' +
        '}' +
        '.nk-theme-features [data-feature] {' +
        '   cursor: pointer;' +
        '   padding: 7px;' +
        '   border: 1px solid #e2e2e2;' +
        '}' +
        '.nk-theme-features [data-feature]:hover {' +
        '   border-color: #b9b9b9;' +
        '}' +
        '.nk-theme-features [data-feature] + [data-feature] {' +
        '   margin-top: 10px;' +
        '}' +
        '.nk-theme-features [data-feature].active {' +
        '   background-color: #171717;' +
        '   border-color: #171717;' +
        '   color: #fff;' +
        '}' +
        '.nk-theme-features .h5 {' +
        '   margin-top: 5px;' +
        '   margin-bottom: 21px;' +
        '}' +
        '.nk-theme-features [data-feature] + .h5 {' +
        '   margin-top: 28px;' +
        '}' +
        '</style>';
    var featuresHTML =
        '<div class="nk-theme-features">' +
        '   <div class="nk-theme-features-toggler"><i class="fa fa-cog fa-spin fa-fw"></i></div>' +
        '   <div class="nk-theme-features-cont">' +
        '      <div class="h5">Navigations</div>' +
        '      <div data-feature="nav" data-feature-val="default">Default</div>' +
        '      <div data-feature="nav" data-feature-val="fullscreen">Fullscreen</div>' +
        '      <div data-feature="nav" data-feature-val="side">Side</div>' +
        '      <div class="h5">Footer</div>' +
        '      <div data-feature="footer" data-feature-val="1">Style 1</div>' +
        '      <div data-feature="footer" data-feature-val="2">Style 2</div>' +
        '      <div data-feature="footer" data-feature-val="3">Style 3</div>' +
        '   </div>' +
        '</div>';

    $('body').append(featuresHTML);
    $('head').append(featuresCSS);
    var $features = $('.nk-theme-features');
    var URL = window.location.href.split('?')[0];
    var $_GET = {};
    window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function(m,key,value) {
        $_GET[key] = value;
    });

    // default features
    var $_GET_DEFAULTS = $_GET;
    if (typeof $_GET['nav'] === 'undefined') {
        if ($('.nk-navbar-side').length) {
            $_GET_DEFAULTS['nav'] = 'side';
        } else if ($('#nk-full').length) {
            $_GET_DEFAULTS['nav'] = 'fullscreen';
        } else {
            $_GET_DEFAULTS['nav'] = 'default';
        }
    }
    if (typeof $_GET['footer'] === 'undefined') {
        var $footer = $('.nk-footer');
        if ($footer.find('.nk-widget').length) {
            $_GET_DEFAULTS['footer'] = '3';
        } else if ($footer.find('.col-lg-8 .nk-footer-text').length) {
            $_GET_DEFAULTS['footer'] = '2';
        } else {
            $_GET_DEFAULTS['footer'] = '1';
        }
    }

    // activate current features
    if (!$.isEmptyObject($_GET_DEFAULTS)) {
        for (var featureName in $_GET_DEFAULTS) {
            var featureValue = $_GET_DEFAULTS[featureName];
            $features.find('[data-feature="' + featureName + '"][data-feature-val="' + featureValue + '"]').addClass('active');
        }
    }

    // parse new values and apply new navs and footers
    if (!$.isEmptyObject($_GET)) {
        for (var featureName in $_GET) {
            var featureValue = $_GET[featureName];

            if (featureName == 'nav') {
                var $currentUL = $('#nk-full ul.nk-nav, #nk-side ul.nk-nav, .nk-navbar-top [data-nav-mobile="#nk-nav-mobile"]').eq(0).html();
                var $topNav = $('.nk-navbar-top');

                $topNav.find('[data-nav-mobile="#nk-nav-mobile"]').remove();
                $('#nk-nav-mobile').remove();
                switch (featureValue) {
                    case 'fullscreen':
                        $topNav.find('.nk-nav-icons').html('<li class="single-icon"><a href="#" class="nk-navbar-full-toggle"><span class="nk-icon-burger"><span class="nk-t-1"></span><span class="nk-t-2"></span><span class="nk-t-3"></span></span></a></li>');
                        $('body').append('<nav class="nk-navbar nk-navbar-full nk-navbar-align-center" id="nk-full"><div class="nk-navbar-bg"><div class="bg-image" style="background-image: url(\'assets/images/bg-menu.jpg\')"></div></div><div class="nk-nav-table"><div class="nk-nav-row"><div class="container"><div class="nk-nav-header"><div class="nk-nav-logo"><a href="index.html" class="nk-nav-logo"><img src="assets/images/logo-light.svg" alt="" width="85"></a></div><div class="nk-nav-close nk-navbar-full-toggle"><span class="nk-icon-close"></span></div></div></div></div><div class="nk-nav-row-full nk-nav-row"><div class="nano"><div class="nano-content"><div class="nk-nav-table"><div class="nk-nav-row nk-nav-row-full nk-nav-row-center"><ul class="nk-nav">' + $currentUL + '</ul></div></div></div></div></div><div class="nk-nav-row"><div class="container"><div class="nk-nav-social"><ul><li><a href="https://twitter.com/nkdevv"><i class="fa fa-twitter"></i></a></li> <li><a href="https://www.facebook.com/unvabdesign/"><i class="fa fa-facebook"></i></a></li> <li><a href="https://dribbble.com/_nK"><i class="fa fa-dribbble"></i></a></li> <li><a href="https://www.instagram.com/unvab/"><i class="fa fa-instagram"></i></a></li></ul></div></div></div></div></nav>');
                        break;
                    case 'side':
                        $topNav.find('.nk-nav-icons').html('<li class="single-icon"><a href="#" data-nav-toggle="#nk-side"><span class="nk-icon-burger"><span class="nk-t-1"></span><span class="nk-t-2"></span><span class="nk-t-3"></span></span></a></li>');
                        $('body').append('<nav class="nk-navbar nk-navbar-side nk-navbar-right-side nk-navbar-lg nk-navbar-align-left nk-navbar-overlay-content" id="nk-side"><div class="nk-navbar-bg"><div class="bg-image" style="background-image: url(\'assets/images/bg-menu.jpg\')"></div></div><span class="nk-navbar-side-close" data-nav-toggle="#nk-side"><span class="nk-icon-close"></span></span><div class="nano"><div class="nano-content"><div class="nk-nav-table"><div class="nk-nav-row nk-nav-row-full nk-nav-row-center"><ul class="nk-nav">' + $currentUL + '</ul></div><div class="nk-nav-row"><div class="nk-nav-social"><ul><li><a href="https://twitter.com/nkdevv"><i class="fa fa-twitter"></i></a></li> <li><a href="https://www.facebook.com/unvabdesign/"><i class="fa fa-facebook"></i></a></li> <li><a href="https://dribbble.com/_nK"><i class="fa fa-dribbble"></i></a></li> <li><a href="https://www.instagram.com/unvab/"><i class="fa fa-instagram"></i></a></li></ul></div></div></div></div></div></nav>');
                        break;
                    default: // default
                        $topNav.find('.nk-nav-logo').after('<ul class="nk-nav nk-nav-right hidden-md-down" data-nav-mobile="#nk-nav-mobile">' + $currentUL + '</ul>');
                        $topNav.find('.nk-nav-icons').html('<li class="single-icon hidden-lg-up"><a href="#" class="nk-navbar-full-toggle"><span class="nk-icon-burger"><span class="nk-t-1"></span><span class="nk-t-2"></span><span class="nk-t-3"></span></span></a></li>');
                        $('body').append('<nav class="nk-navbar nk-navbar-full nk-navbar-align-center" id="nk-nav-mobile"><div class="nk-navbar-bg"><div class="bg-image" style="background-image: url(\'assets/images/bg-menu.jpg\')"></div></div><div class="nk-nav-table"><div class="nk-nav-row"><div class="container"><div class="nk-nav-header"><div class="nk-nav-logo"><a href="index.html" class="nk-nav-logo"><img src="assets/images/logo-light.svg" alt="" width="85"></a></div><div class="nk-nav-close nk-navbar-full-toggle"><span class="nk-icon-close"></span></div></div></div></div><div class="nk-nav-row-full nk-nav-row"><div class="nano"><div class="nano-content"><div class="nk-nav-table"><div class="nk-nav-row nk-nav-row-full nk-nav-row-center nk-navbar-mobile-content"><ul class="nk-nav"> </ul></div></div></div></div></div><div class="nk-nav-row"><div class="container"><div class="nk-nav-social"><ul><li><a href="https://twitter.com/nkdevv"><i class="fa fa-twitter"></i></a></li> <li><a href="https://www.facebook.com/unvabdesign/"><i class="fa fa-facebook"></i></a></li> <li><a href="https://dribbble.com/_nK"><i class="fa fa-dribbble"></i></a></li> <li><a href="https://www.instagram.com/unvab/"><i class="fa fa-instagram"></i></a></li></ul></div></div></div></div></nav>');
                        break;
                }
            }
            if (featureName == 'footer') {
                var footerString = '';
                var $footer = $('.nk-footer');
                switch (featureValue) {
                    case '2':
                        footerString = '<footer class="nk-footer nk-footer-transparent"><div class="nk-footer-cont"><div class="container text-center"><div class="row"><div class="col-lg-4 push-lg-8 text-lg-right"><div class="nk-footer-social"><ul><li><a href="https://twitter.com/nkdevv"><i class="fa fa-twitter"></i></a></li> <li><a href="https://www.facebook.com/unvabdesign/"><i class="fa fa-facebook"></i></a></li> <li><a href="https://dribbble.com/_nK"><i class="fa fa-dribbble"></i></a></li> <li><a href="https://www.instagram.com/unvab/"><i class="fa fa-instagram"></i></a></li></ul></div></div><div class="col-lg-8 pull-lg-4 text-lg-left"><div class="nk-footer-text"><p>2016 &copy; Design by Unvab. Code by nK</p></div></div></div></div></div></footer>';
                        break;
                    case '3':
                        footerString = '<footer class="nk-footer"><div class="bg-image"><div style="background-image: url(\'assets/images/footer-1.jpg\');"></div><div class="bg-image-overlay" style="background-color: rgba(12, 12, 12, 0.9);"></div></div><div class="nk-footer-widgets text-white"><div class="container"><div class="row vertical-gap"><div class="col-lg-4"><div class="nk-widget"><h4 class="nk-widget-title text-white">About Us</h4><p class="nk-heading-font">Aenean mattis augue in arcu tempor bibendum. Nam euismod facilisis magna, quis pharetra turpis molestie eu. Integer feugiat arcu sit amet leo ullamcorper feugiat efficitur.</p><div class="nk-footer-social text-white"><ul><li><a href="https://twitter.com/nkdevv"><i class="fa fa-twitter"></i></a></li> <li><a href="https://www.facebook.com/unvabdesign/"><i class="fa fa-facebook"></i></a></li> <li><a href="https://dribbble.com/_nK"><i class="fa fa-dribbble"></i></a></li> <li><a href="https://www.instagram.com/unvab/"><i class="fa fa-instagram"></i></a></li></ul></div></div></div><div class="col-lg-4"><div class="nk-widget"><h4 class="nk-widget-title text-white">Latest Tweets</h4><div class="nk-twitter-list" data-twitter-count="2"></div></div></div><div class="col-lg-4"><div class="nk-widget"><h4 class="nk-widget-title text-white">Instagram</h4><div class="nk-instagram row xs-gap vertical-gap multi-column"></div></div></div></div></div></div><div class="nk-footer-cont nk-footer-cont-sm"><div class="container text-center"><div class="nk-footer-text text-white"><p>2016 &copy; Design by Unvab. Code by nK</p></div></div></div></footer>';
                        break;
                    default: // 1
                        footerString = '<footer class="nk-footer"><div class="nk-footer-cont"><div class="container text-center"><div class="nk-footer-social"><ul><li><a href="https://twitter.com/nkdevv"><i class="fa fa-twitter"></i></a></li> <li><a href="https://www.facebook.com/unvabdesign/"><i class="fa fa-facebook"></i></a></li> <li><a href="https://dribbble.com/_nK"><i class="fa fa-dribbble"></i></a></li> <li><a href="https://www.instagram.com/unvab/"><i class="fa fa-instagram"></i></a></li></ul></div><div class="nk-footer-text"><p>2016 &copy; Design by Unvab. Code by nK</p></div></div></div></footer>';
                        break;
                }
                $footer.replaceWith(footerString);
            }
        }
    }

    // reload page with get parameters
    function reloadPage () {
        $features.find('[data-feature].active').each(function () {
            $_GET[$(this).attr('data-feature')] = $(this).attr('data-feature-val');
        });

        var getURL = '';
        for(var k in $_GET) {
            getURL += getURL.length ? '&' : '?';
            getURL += k + '=' + $_GET[k];
        }

        window.location = URL + getURL;
    }

    // toggle features panel
    $features.on('click', '.nk-theme-features-toggler', function () {
        $features.toggleClass('active');
    });

    // select feature
    $features.on('click', '[data-feature]:not(.active)', function () {
        var feature = $(this).attr('data-feature');
        $(this).addClass('active').siblings('[data-feature="' + feature + '"]').removeClass('active');
        reloadPage();
    });
}(jQuery));