$(document).ready(function () {
    //Add breadcrumb
    var breadcrumb = $("#breadcrumb");
    if (window.BreadCrumbItems !== "undefined" & breadcrumb.length) {
        var bcitems = [];
        for (var i = window.BreadCrumbItems.length - 1; i >= 0; i--) {
            var item = window.BreadCrumbItems[i];

            if (i == window.BreadCrumbItems.length - 1) {
                bcitems.push({
                    type: "rootitem",
                    href: item.NavigateUrl,
                    text: item.Text,
                    showText: true,
                    icon: "home",
                    showIcon: true
                })
            } else {
                bcitems.push({
                    type: "item",
                    href: item.NavigateUrl,
                    text: item.Text,
                    showText: true
                })
            }
        }

        breadcrumb.kendoBreadcrumb(
            {
                navigational: true,
                items: bcitems
            }
        );
    }

    //Turn session menu into icons in the top (use the search in the top corner)
    if ($("#category_07405876-e8c2-4b24-a774-4ef57f596384_15").length) {
        sessionmenu = $(".logo-container > .search-container");
        $("#category_07405876-e8c2-4b24-a774-4ef57f596384_15").parent().css("display", "none");
        sessionmenu.empty();

        toolbaritems = [{ template: '<a class="k-button" id="toolbar-notifications" href="javascript:void(0)"><span class="k-icon k-i-notification"></span><span id="badge-notifications" style="display:none;">5</span></a>' }];

        if ($("#page_07405876-e8c2-4b24-a774-4ef57f596384_15").length) {
            toolbaritems.push({ template: '<a class="k-button" id="toolbar-profile" href="javascript:void(0)"><span class="k-icon k-i-user"></span>' })
        }
        if ($("#page_07405876-e8c2-4b24-a774-4ef57f596384_56").length) {
            toolbaritems.push({ template: '<a class="k-button" id="toolbar-security" href="javascript:void(0)"><span class="k-icon k-i-lock"></span>' })
        }
        toolbaritems.push({ template: '<a class="k-button" id="toolbar-logout" href="javascript:void(0)"><span class="k-icon k-i-logout"></span></a>' })

        sessionmenu.kendoToolBar({
            items: toolbaritems
        });

        $('#badge-notifications').kendoBadge({
            color: 'info',
            shape: 'rounded'
        });

        sidebarcount = $("#UnreadMessageCount");
        if (sidebarcount.length == 0) {
            sidebarcount = $('<div id="UnreadMessageCount" style="display:none;"></div>');
            $('body').append(sidebarcount);
        }

        sidebarcount.bind('DOMSubtreeModified', function () {
            if ($(this).attr("unread")) {
                $("#badge-notifications").css("display", "flex");
                $("#badge-notifications").html($(this).attr("unread"));
            }
        });

        $("#toolbar-logout").click(function () {
            document.getElementById('logoutForm').submit();
        })

        $("#toolbar-notifications").click(function () {
            window.location.href = $("#page_07405876-e8c2-4b24-a774-4ef57f596384_69").attr("href");
        })

        $("#toolbar-profile").click(function () {
            window.location.href = $("#page_07405876-e8c2-4b24-a774-4ef57f596384_15").attr("href");
        })

        $("#toolbar-security").click(function () {
            window.location.href = $("#page_07405876-e8c2-4b24-a774-4ef57f596384_56").attr("href");
        })

        sessionmenu.css("visibility", "visible");
    }

    //Turn service icons into drawer (skip in service home page and mobile)
    if ($("#serviceicons").length && (window.BreadCrumbItems[0].Id != "d3b2aa93-7e2b-4e0d-8080-67d14b2fa8a9_23" | $("#aspxcontent").length) && screen.width > 900) {
        sidebar = $("#serviceicons").parent();
        iconshead = $("#serviceicons");
        icons = $("#serviceicons > ul");
        iconlinks = icons.find(" li > a");
        legend = $("#serviceicons > legend");
        legendtext = legend.html();
        sidebarminwidth = sidebar.css("min-width");
        sidebar.css("min-width", "unset");
        sidebar.css("width", "58px");
        icons.css("width", "40px");
        icons.css("overflow", "hidden");
        legend.html("&nbsp;");

        allowcollapse = false;
        allowexpand = false;
        expandhandle = null;
        collapsehandle = null;
        iconlinks.mouseenter(function () {
            allowexpand = true;
            if (sidebar.hasClass("drawer-expanded")) {
                allowcollapse = false;
                return;
            }

            expandhandle = setTimeout(function () {
                if (!allowexpand | sidebar.hasClass("drawer-expanded")) {
                    return;
                }
                
                sidebar.addClass("drawer-expanded");
                allowcollapse = false;
                icons.css("overflow", "");
                icons.css("width", "");
                clone = sidebar.clone().css("width", "auto").appendTo(sidebar.parent());
                targetwidth = clone.width();
                clone.remove();
                sidebar.animate({ width: targetwidth }, 250);
                legend.html(legendtext);
            }, 500);
        });

        iconlinks.mousemove(function () {
            allowexpand = true;
            allowcollapse = false;
        });

        iconlinks.mouseout(function () {
            allowexpand = false;
            if (!sidebar.hasClass("drawer-expanded")) {
                return;
            }

            allowcollapse = true;

            if (expandhandle) { clearTimeout(expandhandle) }
            if (collapsehandle) { clearTimeout(collapsehandle) }
            collapsehandle = setTimeout(function () {
                if (!allowcollapse | !sidebar.hasClass("drawer-expanded")) {
                    return;
                }
                sidebar.removeClass("drawer-expanded");
                allowcollapse = false;

                sidebar.css("min-width", "unset");
                icons.css("overflow", "hidden");
                sidebar.animate({ width: 58 }, 250);
                icons.animate({ width: 40 }, 250);
                legend.html("&nbsp;");
            }, 500)
        });
    }
    //Hide sidebar on pages that don't need it
    hassidebar = ["07405876-e8c2-4b24-a774-4ef57f596384_1", "07405876-e8c2-4b24-a774-4ef57f596384_3", "07405876-e8c2-4b24-a774-4ef57f596384_9", "07405876-e8c2-4b24-a774-4ef57f596384_5", "f43151f2-0303-4a88-96f3-1381b79700f8_1", "07405876-e8c2-4b24-a774-4ef57f596384_64", "07405876-e8c2-4b24-a774-4ef57f596384_15", "07405876-e8c2-4b24-a774-4ef57f596384_56", "07405876-e8c2-4b24-a774-4ef57f596384_40", "07405876-e8c2-4b24-a774-4ef57f596384_29", "07405876-e8c2-4b24-a774-4ef57f596384_27"];

    if ( screen.width > 900 && window.BreadCrumbItems && hassidebar.indexOf(window.BreadCrumbItems[0].Id) == -1 & $("#serviceicons").length == 0 & $("#pageicons").length==0) {
        $("#sidebar > fieldset > legend").html("&nbsp;");
        $("#sidebar > fieldset ul").css("visibility", "hidden");
        $("#sidebar > fieldset li").css("visibility", "hidden");
        $("#sidebar > fieldset legend:gt(0)").css("visibility", "hidden");
        $("#sidebar").css("width", "0");
        $("#sidebar").css("min-width", "unset");
        //$("#main .header-text").css("padding-left", "0")
    }

    //disable default mouse hover on main menu
    $(".nav-fostrap > ul > li").addClass("nohover");

    //Restore last state
    expanded = readCookie("_sideBarState").split(",");
    $(".nav-fostrap > ul > li").each(function () {
        that = this;
        id = $(that).find(">a").attr("id");
        if (expanded.indexOf(id) != -1 | id=="page_07405876-e8c2-4b24-a774-4ef57f596384_1") {
            $($(that).children()[1]).slideDown(0);
            $(that).addClass("manual-hover");
        }
    });

    //Handle menu clicks
    $(".nav-fostrap > ul > li").click(function () {
        $this = $(this);

        //Must have children
        if ($this.find("ul").children().length == 0) {
            return;
        }

        if (!$this.hasClass('manual-hover')) {
            $($this.children()[1]).slideDown(350);
            $this.addClass('manual-hover');
        } else {
            $($this.children()[1]).slideUp(350);
            $this.removeClass('manual-hover');
        }

        var state = [];
        $('.nav-fostrap .manual-hover').each(function () {
            state.push($(this).find(">a").attr("id"));
        });

        createCookie("_sideBarState", state, 365);
    })

    $(".nav-fostrap > ul > li > ul").click(function (e) {
        e.stopPropagation();
    });
});