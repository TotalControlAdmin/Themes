var _Header = _Header || (function () {
    var _clickLogoMessage, _swipeRightMessage, _notificationUrl, _unreadMessagesFormat;

    return {
        Init: function (clickLogoMessage, swipeRightMessage, notificationUrl, unreadMessagesFormat) {
            _clickLogoMessage = clickLogoMessage;
            _swipeRightMessage = swipeRightMessage;
            _notificationUrl = notificationUrl;
            _unreadMessagesFormat = unreadMessagesFormat;
            $(document).ready(function () {
                _Header._configureNav();
                _Header._checkNotifications();
            }
            );
        },

        GetNotificationUrl: function() {
            return _notificationUrl;
        },

        _configureNav: function () {
            $('.navbar-fostrap').click(function () {
                $('.nav-fostrap').toggleClass('visible');
                createCookie("learnedNav", "1");
                _Header.HideSidebar();
            });

            if (window.matchMedia('(max-width: 900px)').matches && !readCookie("learnedNav")) {
                var popupNotification = $("#popupNotification").data("kendoNotification");
                popupNotification.show(_clickLogoMessage);
            }

            var mainelement = document.getElementById('wrapper');
            if (mainelement) {
                var mc = new Hammer(mainelement, {
                    cssProps: {
                        userSelect: true
                    }, inputClass: Hammer.TouchInput, direction: Hammer.DIRECTION_HORIZONTAL
                });

                // listen to events...
                mc.on("swipe", _Header.HandleSidebarSwipe);

                if (window.matchMedia('(max-width: 900px)').matches && document.getElementById('sidebar') && !readCookie("learnedSidebar")) {
                    var popupNotification = $("#popupNotification").data("kendoNotification");
                    popupNotification.show(_swipeRightMessage);
                }
            }

            var iframe = document.getElementById('aspxcontent');
            if (iframe) {
                iframe.onload = function () {
                    var iframeBody = iframe.contentWindow;
                    var mc3 = new Hammer(iframeBody, {
                        cssProps: {
                            userSelect: true
                        },
                        inputClass: Hammer.TouchInput,
                        direction: Hammer.DIRECTION_HORIZONTAL
                    });
                    mc3.on("swipe", _Header.HandleSidebarSwipe);

                    $(iframeBody).click(function (e) {
                        _Header.HideNavigation();
                        _Header.HideSidebar();
                    });
                }
            }

            $('body').click(function (e) {
                if ($(e.target).closest('.nav-fostrap').length === 0 && $(e.target).closest('.navbar-fostrap').length === 0) {
                    _Header.HideNavigation();
                }

                if ($(e.target).closest('#sidebar').length === 0) {
                    _Header.HideSidebar();
                }
            });
        },

        HandleSidebarSwipe: function (ev) {
            var sidebar = $('#sidebar');
            switch (ev.direction) {
                case Hammer.DIRECTION_LEFT:
                    if (sidebar.hasClass('visible')) {
                        sidebar.toggleClass('visible');
                    }
                    break;
                case Hammer.DIRECTION_RIGHT:
                    if (!sidebar.hasClass('visible')) {
                        sidebar.toggleClass('visible');
                        _Header.HideNavigation();
                        createCookie("learnedSidebar", "1");
                    }
                    break;
                case Hammer.DIRECTION_UP:
                    break;
                case Hammer.DIRECTION_DOWN:
                    break;
            }
        },

        HideNavigation: function () {
            var nav = $('.nav-fostrap');
            if (nav.hasClass('visible')) {
                nav.toggleClass('visible');
            }
        },

        HideSidebar: function () {
            var sidebar = $('#sidebar');
            if (sidebar.hasClass('visible')) {
                sidebar.toggleClass('visible');
            }
        },

        _checkNotifications: function () {
            $.getJSON(_notificationUrl, {}).done(function (data) {
                if (data.unread | data.unread==0) {
                    $("#UnreadMessageCount").html(_unreadMessagesFormat.format(data.unread));
                    $("#UnreadMessageCount").attr("unread", data.unread);
                }
                if (data.id) {
                    TCAdmin.Ajax.ShowBasicDialog(data.title, data.message, function () {
                        $.ajax({
                            type: "POST",
                            url: _notificationUrl,
                            data: { id: data.id }
                        });
                    });
                }
            });
        }
    }
}());