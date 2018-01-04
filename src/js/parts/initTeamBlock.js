import { $, $body } from "./_utility";

/*------------------------------------------------------------------

 Team Block

 -------------------------------------------------------------------*/
function initTeamBlock () {

    function activateMemberBlock ($item) {
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
                })
                .attr('data-bg-id', id)
                .appendTo($backgrounds);
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

export { initTeamBlock };
