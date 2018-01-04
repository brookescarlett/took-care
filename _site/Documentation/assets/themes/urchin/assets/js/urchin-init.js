/*!-----------------------------------------------------------------
  Name: Urchin - Portfolio Theme
  Version: 
  Author: nK <https://nkdev.info>
  Website: 
  License: GNU General Public License v2 or later
  License: URI: http://www.gnu.org/licenses/gpl-2.0.html
  Copyright 2017.
-------------------------------------------------------------------*/
;(function() {
'use strict';

/*------------------------------------------------------------------

  Theme Options

-------------------------------------------------------------------*/
var options = {
    enableSearchAutofocus: true,
    enableShortcuts: true,
    scrollToAnchorSpeed: 700,
    parallaxSpeed: 0.6,

    templates: {
        secondaryNavbarBackItem: 'Back'
    },

    shortcuts: {
        toggleSearch: 's',
        showSearch: '',
        closeSearch: 'esc',

        toggleSideLeftNavbar: 'alt+l',
        openSideLeftNavbar: '',
        closeSideLeftNavbar: 'esc',

        toggleSideRightNavbar: 'alt+r',
        openSideRightNavbar: '',
        closeSideRightNavbar: 'esc'
    }
};

if (typeof Urchin !== 'undefined') {
    Urchin.setOptions(options);
    Urchin.init();
}
}());
