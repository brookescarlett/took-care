+(function($) {

    var pending_ajax = false;

    function stripHash (href) {
        return href.replace(/#.*/, '');
    }

    var nkDocs = {
        initialize: function() {
            var self = this;
            var $body = $('body');

            $body.on('click', '.nkdocs-feedback-wrap a', self.feedback);
            $body.on('click', '#top-search-form .dropdown-menu a', self.searchForm);

            // modal
            $body.on('click', 'a#nkdocs-stuck-modal', self.showModal);
            $body.on('click', 'a#nkdocs-modal-close', self.closeModal);
            $body.on('click', '#nkdocs-modal-backdrop', self.closeModal);
            $body.on('submit', 'form#nkdocs-contact-modal-form', self.contactHelp);

            // ajax
            var $ajax = $('.nkdocs-single-ajax');
            if ($ajax.length) {
                // save current page data
                self.setCache(location.href, {
                    href: location.href,
                    title: document.title,
                    doc: $ajax.html(),
                    html: document.documentElement.outerHTML
                });

                // click on links
                $ajax.on('click', '.doc-nav-list a, .nkdocs-breadcrumb a, .nkdocs-doc-nav a', function (e) {
                    self.onDocLinksClick(e);
                });

                // on state change
                $(window).on('popstate', function(e) {
                    self.renderDoc(e.target.location.href);
                });
            }
        },

        feedback: function(e) {
            e.preventDefault();

            // return if any request is in process already
            if ( pending_ajax ) {
                return;
            }

            pending_ajax = true;

            var self = $(this),
                wrap = self.closest('.nkdocs-feedback-wrap'),
                data = {
                    post_id: self.data('id'),
                    type: self.data('type'),
                    action: 'nkdocs_ajax_feedback',
                    _wpnonce: nkDocs_Vars.nonce
                };

            wrap.append('&nbsp; <i class="nkdocs-icon nkdocs-icon-refresh nkdocs-icon-spin"></i>');
            $.post(nkDocs_Vars.ajaxurl, data, function(resp) {
                wrap.html(resp.data);

                pending_ajax = false;
            });
        },

        searchForm: function(e) {
            e.preventDefault();

            var param = $(this).attr("href").replace("#","");
            var concept = $(this).text();

            $('#top-search-form span#search_concept').text(concept);
            $('.input-group #search_param').val(param);
        },

        showModal: function(e) {
            e.preventDefault();

            $('#nkdocs-modal-backdrop').show();
            $('#nkdocs-contact-modal').show();
        },

        closeModal: function(e) {
            e.preventDefault();

            $('#nkdocs-modal-backdrop').hide();
            $('#nkdocs-contact-modal').hide();
        },

        contactHelp: function(e) {
            e.preventDefault();

            var self = $(this),
                submit = self.find('input[type=submit]'),
                body = self.closest('.nkdocs-modal-body'),
                data = self.serialize() + '&_wpnonce=' + nkDocs_Vars.nonce;

            submit.prop('disabled', true);

            $.post(nkDocs_Vars.ajaxurl, data, function(resp) {
                if ( resp.success === false ) {
                    submit.prop('disabled', false);
                    $('#nkdocs-modal-errors', body).empty().append('<div class="nkdocs-alert nkdocs-alert-danger">' + resp.data + '</div>')
                } else {
                    body.empty().append( '<div class="nkdocs-alert nkdocs-alert-success">' + resp.data + '</div>' );
                }
            });
        },

        // cache ajax pages
        cache: {},
        setCache: function setCache(key, data) {
            key = key || false;
            data = data || false;
            if(!key || !data || this.cache[key]) {
                return;
            }
            this.cache[key] = data;
        },
        getCache: function getCache(key) {
            key = key || false;
            if(!key || !this.cache[key]) {
                return false;
            }
            return this.cache[key];
        },

        renderDoc: function renderDoc (href) {
            var cached = this.getCache(href);
            $('.nkdocs-single-ajax').html(cached.doc);
            $('title').text(cached.title);
            $(document).trigger('nk_docs_ajax_loaded', cached);
        },

        onDocLinksClick: function onDocLinksClick (e) {
            var link = e.currentTarget;

            // Middle click, cmd click, and ctrl click should open
            // links in a new tab as normal.
            if (e.which > 1 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) {
                return;
            }

            // Ignore cross origin links
            if (location.protocol !== link.protocol || location.hostname !== link.hostname) {
                return;
            }

            // Ignore case when a hash is being tacked on the current URL
            if (link.href.indexOf('#') > -1 && stripHash(link.href) == stripHash(location.href)) {
                return;
            }

            // Ignore if local file protocol
            if(window.location.protocol === 'file:') {
                return;
            }

            // Ignore e with default prevented
            if (e.isDefaultPrevented()) {
                return;
            }

            e.preventDefault();

            this.loadDocPage(link.href);
        },

        loadDocPage: function loadDocPage (href) {
            var self = this;
            href = href || false;

            // stop when the same urls
            if (!href || stripHash(href) == stripHash(location.href)) {
                return;
            }

            // return cached version
            var cached = self.getCache(href);
            if (cached) {
                // render doc
                self.renderDoc(href);

                // push state for new page
                window.history.pushState(null, cached.title, href);
                return;
            }

            // stop previous request
            if(self.xhr && self.xhr.abort) {
                self.xhr.abort();
                self.xhr = {};
            }

            // new ajax request
            var $ajaxBlock = $('.nkdocs-single-ajax').addClass('nkdocs-single-ajax-loading');
            self.xhr = $.ajax({
                url: href,
                success: function success (responseHtml) {
                    if(!responseHtml) {
                        location = href;
                        return;
                    }

                    var $HTML = $('<div>').html(responseHtml);
                    var title = $HTML.find('title:eq(0)').text() || document.title;
                    var $newDocContent = $HTML.find('.nkdocs-single-ajax').html();

                    if (!$newDocContent) {
                        location = href;
                        return;
                    }

                    // save cache
                    self.setCache(href, {
                        href: href,
                        title: title,
                        doc: $newDocContent,
                        html: responseHtml
                    });

                    // render
                    self.renderDoc(href);

                    // push state for new page
                    window.history.pushState(null, title, href);

                    // clear
                    $HTML.remove();
                    $HTML = null;
                    $newAjaxBlock = null;

                    $ajaxBlock.removeClass('nkdocs-single-ajax-loading');
                },
                error: function error (msg) {
                    if(msg.status !== 0) {
                        console.log('error', msg);
                    } else {
                        location = href;
                    }

                    $ajaxBlock.removeClass('nkdocs-single-ajax-loading');
                }
            });
        }
    };

    $(function() {
        nkDocs.initialize();
    });

})(jQuery);
