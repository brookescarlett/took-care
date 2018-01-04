(function ($) {
    var $navCart = $('.nk-drop-cart');
    var $navCartBadge = $navCart.find('.nk-badge');
    $('body').on('edd_quantity_updated', function (e, quantity) {
        if (quantity) {
            $navCartBadge.html(quantity);
        }
        $navCartBadge[quantity ? 'removeClass' : 'addClass']('hidden-xs-up');
    });
}(jQuery));