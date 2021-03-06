/*!
 * Zource User Interface Library
 *
 * Date: 2016-07-17T17:23Z
 */

(function(global, factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        module.exports = global.document ? factory(global, true) : function(w) {
            if (!w.document) {
                throw new Error("ZUI requires a window with a document");
            }
            return factory(w);
        };
    } else {
        factory(global);
    }
}(typeof window !== "undefined" ? window : this, function(window, noGlobal) {
    

    

    var zui = window.zui = {
        version: "0.0.0 b3e316e251612093754e4e4d572409a52e3478e9"
    };

    zui.log = function() {
        if (window.console && window.console.log) {
            Function.prototype.apply.call(window.console.log, console, arguments);
        }
    };

    zui.warn = function() {
        if (window.console && window.console.warn) {
            Function.prototype.apply.call(window.console.warn, console, arguments);
        }
    };

    zui.error = function() {
        if (window.console && window.console.error) {
            Function.prototype.apply.call(window.console.error, console, arguments);
        }
    };

    

    zui.Aria = {
        isExpanded: function(element) {
            return $(element).attr("aria-expanded") === "true";
        },

        setExpanded: function(element, state) {
            $(element).attr("aria-expanded", state ? "true" : "false");
        },

        setVisibility: function(element, visible) {
            $(element).attr("aria-hidden", visible ? "false" : "true");
        },

        getOwnedValue: function(element) {
            var id = $(element).attr("aria-controls");

            if (!id) {
                id = $(element).attr("aria-owns");

                if (!id) {
                    zui.error("Expected an 'aria-controls' or 'aria-owns' attribute.");
                }
            }

            return id;
        },

        bind: function() {
            $("[aria-controls]").each(function() {
                var id = $(this).attr("id"), controls = zui.Aria.getOwnedValue(this);

                if (!id) {
                    zui.error("No id attribute found for element ", this);
                    return;
                }

                $("#" + controls).attr("aria-describedby", id);
            });
        }
    };

    

    zui.EventHandler = {
        lastMousePositionX: 0,
        lastMousePositionY: 0,

        installFilteredMouseMove: function(element) {
            element.on("mousemove", function(e) {
                var x = zui.EventHandler.lastMousePositionX;
                var y = zui.EventHandler.lastMousePositionY;

                if (x !== e.pageX || y !== e.pageY) {
                    $(e.target).trigger("mousemove-filtered", e);
                }
            });
        },

        installKeyUpChangeEvent: function(element) {
            var key = "keyup-change-value";

            element.on("keydown", function() {
                if ($.data(element, key) === undefined) {
                    $.data(element, key, element.val());
                }
            });

            element.on("keyup", function() {
                var val = $.data(element, key);
                if (val !== undefined && element.val() !== val) {
                    $.removeData(element, key);
                    element.trigger("keyup-change");
                }
            });
        },

        bind: function() {
            $(document).on("mousemove", function(e) {
                zui.EventHandler.lastMousePositionX = e.pageX;
                zui.EventHandler.lastMousePositionY = e.pageY;
            });
        }
    };

    

    zui.Keys = {
        ALT: 18,
        BACKSPACE: 8,
        DELETE: 46,
        END: 35,
        ENTER: 13,
        ESC: 27,
        HOME: 36,
        LEFT: 37,
        RIGHT: 39,
        SHIFT: 16,
        SPACE: 32,
        TAB: 9,
        UP: 38,
        DOWN: 40,
        CTRL: 17,
        PAGE_DOWN: 34,
        PAGE_UP: 33,

        isArrow: function(k) {
            k = k.which ? k.which : k;
            switch (k) {
                case zui.Keys.LEFT:
                case zui.Keys.RIGHT:
                case zui.Keys.UP:
                case zui.Keys.DOWN:
                    return true;
            }
            return false;
        },

        isControl: function(e) {
            var k = e.which;

            switch (k) {
                case zui.Keys.SHIFT:
                case zui.Keys.CTRL:
                case zui.Keys.ALT:
                    return true;
            }

            if (e.metaKey) {
                return true;
            }

            return false;
        },

        isFunctionKey: function(k) {
            k = k.which ? k.which : k;

            return k >= 112 && k <= 123;
        }
    };

    

    zui.Screen = {
        bind: function() {
            $(window).on("resize", function() {
                zui.Screen.update();
            });

            zui.Screen.update();
        },

        update: function() {
            zui.Screen.width = $(window).width();
            zui.Screen.height = $(window).height();
        },

        centerElement: function(element) {
            var x = Math.max(0, (zui.Screen.width - element.outerWidth()) / 2);
            var y = Math.max((zui.Screen.height - element.outerHeight()) / 2);

            element.css("position", "fixed");
            element.css("top", y);
            element.css("left", x);
        }
    };

    

    zui.LastPass = {
        bind: function() {


            $(document).ready(function() {
                setTimeout(function() {
                    $("input[type='password'].disable-lastpass")
                        .css("background-image", "none")
                        .on("mouseenter", function() {
                            $(this).css("background-image", "none");
                        })
                        .on("mouseleave", function() {
                            $(this).css("background-image", "none");
                        })
                        .on("click", function() {
                            $(this).css("background-image", "none");
                        });
                }, 100);
            });
        }
    };

    

    function removeAlert(alert) {
        var fadeOutSpeed = alert.data("zui-alert-fade-speed") || zui.Alert.fadeOutSpeed;

        alert.fadeOut(fadeOutSpeed, function() {
            alert.trigger("zui-alert-closed");
            alert.remove();
        });
    }

    zui.Alert = {
        fadeOutSpeed: 250,

        bind: function() {
            $("body").on("click", ".zui-alert .zui-icon-x", function() {
                var alert = $(this).closest(".zui-alert");

                removeAlert(alert);

                return false;
            });

            $("[data-zui-alert-timeout]").each(function() {
                var $this = $(this);

                setTimeout(function() {
                    removeAlert($this);
                }, $this.data("zui-alert-timeout"));
            });
        }
    };

    

    zui.Anchor = {
        bind: function() {
            $("body").on("click", "a.disabled", function() {
                return false;
            });
        }
    };

    

    zui.Button = {
        bind: function() {
            // Make sure that clicking on button links that are disabled, does not activate the link:
            $("a.zui-button.disabled").on("click", function(e) {
                e.preventDefault();
            });

            // Make sure that clicking on a dropdown button does not activate the link:
            $(".zui-button-dropdown").on("click", function() {
                var element = $(this);

                // When the button is disabled, do nothing:
                if (element.hasClass("disabled")) {
                    return false;
                }

                // Depending on the state of the button we show the drop down menu:
                zui.Dropdown.toggle(element, element);

                return false;
            });

            $(".zui-button-split-more").on("click", function(e) {
                e.preventDefault();

                zui.Dropdown.toggle(this, this);
            });

            $(".zui-button-loader").on("click", function() {
                var button = $(this),
                    timeout = button.data("zui-button-loader-timeout") || 1000;

                setTimeout(function() {
                    button.addClass("zui-button-loader-active");
                }, timeout);
            });
        }
    };

    

    var currentDialog;

    function loadAjaxContent(panelBody, url) {
        $.ajax({
            "type": "get",
            "url": url,
            "success": function(data) {
                panelBody.html(data);
            },
            "error": function(jqXHR, textStatus, errorThrown) {
                panelBody.html("An error did occur: " + errorThrown);
            }
        });
    }

    function loadContent(dialog) {
        $(".zui-dialog-panel", dialog).each(function() {
            var panelBody = $(this);
            if ($(this).data("zui-dialog-ajax")) {
                loadAjaxContent(panelBody, $(this).data("zui-dialog-ajax"));
            }
        });
    }

    function loadBody(panelBody, options, index) {
        if (options.panels[index].body) {
            panelBody.html(options.panels[index].body);
        } else if (options.panels[index].ajax) {
            loadAjaxContent(panelBody, options.panels[index].ajax);
        }
    }

    function updateDialogFooter(dialog) {
        var index = $(".zui-dialog-menu [aria-selected='true']", dialog).prevAll("li").length;
        var total = $(".zui-dialog-menu li", dialog).length;

        if (index === 0) {
            $("[data-zui-dialog-button='previous']", dialog).attr("disabled", true);
        } else {
            $("[data-zui-dialog-button='previous']", dialog).attr("disabled", false);
        }

        if (index === total - 1) {
            $("[data-zui-dialog-button='next']", dialog).attr("disabled", true);
        } else {
            $("[data-zui-dialog-button='next']", dialog).attr("disabled", false);
        }
    }

    function updateDialogSize(dialog, size) {
        var valid = ["tiny", "small", "medium", "large", "xlarge", "full"],
            index = valid.indexOf(size);

        if (index !== -1) {
            for (var i = 0; i < valid.length; ++i) {
                currentDialog.removeClass("zui-dialog-" + valid[i]);
            }

            currentDialog.addClass("zui-dialog-" + valid[index]);
        }
    }

    zui.Dialog = {
        bind: function() {
            $(document).ready(function() {
                loadContent($(".zui-dialog"));
                updateDialogFooter($(".zui-dialog"));

                $("body").on("click", ".zui-dialog-footer a, .zui-dialog-footer button", function() {
                    $(this).closest(".zui-dialog").trigger("zui-dialog-button-clicked", [this]);
                    return false;
                });

                $("body").on("click", ".zui-dialog-menu button", function() {
                    var dialog = $(this).closest(".zui-dialog");
                    var index = $(this).parent().prevAll("li").length;

                    zui.Dialog.activatePage(dialog, index);

                    return false;
                });

                $("body").on("keydown", function(e) {
                    if (e.which === zui.Keys.ESC) {
                        zui.Dialog.close();
                    }
                });

                $("body").on("click", "[data-zui-dialog-button='next']", function() {
                    var dialog = $(this).closest(".zui-dialog");
                    var index = $(".zui-dialog-menu  [aria-selected='true']", dialog).prevAll("li").length;

                    zui.Dialog.activatePage(dialog, index + 1);

                    if (currentDialog) {
                        currentDialog.trigger("zui-dialog-button-next-clicked", [this]);
                    }
                    return false;
                });

                $("body").on("click", "[data-zui-dialog-button='previous']", function() {
                    var dialog = $(this).closest(".zui-dialog");
                    var index = $(".zui-dialog-menu  [aria-selected='true']", dialog).prevAll("li").length;

                    zui.Dialog.activatePage(dialog, index - 1);

                    if (currentDialog) {
                        currentDialog.trigger("zui-dialog-button-previous-clicked", [this]);
                    }
                    return false;
                });

                $("body").on("click", "[data-zui-dialog-button='cancel']", function() {
                    if (currentDialog) {
                        currentDialog.trigger("zui-dialog-button-cancel-clicked", [this]);
                        zui.Dialog.close(this);
                    }
                    return false;
                });

                $("body").on("click", "[data-zui-dialog-trigger]", function() {
                    var selector = $(this).data("zui-dialog-trigger");

                    zui.Dialog.openSelector(selector);

                    return false;
                });

                $("body").on("click", ".zui-dialog .zui-icon-x", function() {
                    if (currentDialog) {
                        currentDialog.trigger("zui-dialog-button-cancel-clicked", [this]);
                        zui.Dialog.close(this);
                    }
                    return false;
                });
            });
        },

        load: function(target, url, callback) {
            $.ajax({
                "type": "get",
                "url": url,
                "success": function(data) {
                    var element = $(data).appendTo("body");
                    var dialog = zui.Dialog.open(target, element);

                    dialog.data("zui-dialog-remove-on-close", "true");

                    if (callback) {
                        callback(dialog);
                    }
                }
            });
        },

        activatePage: function(dialog, index) {
            var page = $(".zui-dialog-page", dialog);

            // Deactivate all panels:
            dialog.trigger("zui-dialog-panel-deactivate", []);
            $(".zui-dialog-panel", page).attr("aria-hidden", "true");
            dialog.trigger("zui-dialog-panel-deactivated", []);

            // Make sure the index is valid:
            index = Math.max(0, Math.min(index, $(".zui-dialog-menu li", page).length - 1));

            dialog.trigger("zui-dialog-panel-activating", [dialog, index]);

            // Activate the panel that was clicked:
            $($(".zui-dialog-panel", page).get(index)).attr("aria-hidden", "false");

            // Change the state of the menu items:
            $(".zui-dialog-menu li", page).attr("aria-selected", "false");
            $($(".zui-dialog-menu li", dialog).get(index)).attr("aria-selected", "true");

            dialog.trigger("zui-dialog-panel-activated", [dialog, index]);

            updateDialogFooter(dialog);
        },

        close: function(target) {
            if (currentDialog) {
                $("body").css("overflow", $("body").data("overflow-backup")).data("overflow-backup", null);

                currentDialog.trigger("zui-dialog-closing", [target, this]);

                if (currentDialog.data("zui-dialog-remove-on-close") === "true") {
                    currentDialog.remove();
                } else {
                    currentDialog.hide();
                }

                currentDialog.trigger("zui-dialog-closed", [target, this]);
            }

            $("#zui-blanket").remove();
        },

        open: function(target, id) {
            zui.Dialog.close(target);

            currentDialog = $(id);
            currentDialog.css("position", "fixed");

            updateDialogSize(currentDialog, $(target).data("zui-dialog-size"));

            currentDialog.trigger("zui-dialog-opening", [target, this]);

            $("<div id='zui-blanket' aria-hidden='false'>").appendTo("body").on("click", function() {
                zui.Dialog.close(this);
            });

            loadContent(currentDialog);

            currentDialog.show();
            currentDialog.trigger("zui-dialog-opened", [target, this]);

            // Place the dialog in the center of the screen
            zui.Screen.centerElement(currentDialog);
            currentDialog.trigger("zui-dialog-centered", [target, this]);

            updateDialogFooter(currentDialog);

            // Disable scrolling on the body
            var overflow = $("body").css("overflow");
            $("body").data("overflow-backup", overflow).css("overflow", "hidden");

            return currentDialog;
        },

        openSelector: function(selector, callback) {
            var element, dialog;

            try {
                element = $(selector);
            } catch (e) {

            } finally {
                if (element && element.length) {
                    dialog = zui.Dialog.open(this, element);

                    if (callback) {
                        callback(dialog);
                    }
                } else {
                    zui.Dialog.load(this, selector, callback);
                }
            }
        },

        create: function(options) {
            var i, panelBody;

            var dialog = $("<div>").addClass("zui-dialog").data("zui-dialog-remove-on-close", "true").appendTo("body");
            var dialogComponents = $("<div>").addClass("zui-dialog-components").appendTo(dialog);

            if (options.class) {
                dialog.addClass(options.class);
            }

            $("<h2>").addClass("zui-dialog-title").text(options.title).appendTo(dialogComponents);

            if (options.panels.length > 1) {
                var pageItem, pageMenu = $("<ul>").addClass("zui-dialog-menu").appendTo(dialogComponents);

                for (i = 0; i < options.panels.length; ++i) {
                    pageItem = $("<li>").appendTo(pageMenu);

                    if (i === 0) {
                        pageItem.addClass("selected");
                    }

                    $("<button>").addClass("zui-item-button").text(options.panels[i].label).appendTo(pageItem);
                }
            }

            var pageBody = $("<div>").addClass("zui-dialog-page").appendTo(dialogComponents);
            for (i = 0; i < options.panels.length; ++i) {
                panelBody = $("<div>").addClass("zui-dialog-panel").appendTo(pageBody);

                loadBody(panelBody, options, i);

                if (i !== 0) {
                    panelBody.attr("aria-hidden", "true");
                }
            }

            var buttonPanel = $("<div>").addClass("zui-dialog-footer").appendTo(dialogComponents);
            var buttonPanelLeft = $("<div>").addClass("zui-dialog-footer-left").appendTo(buttonPanel);
            var buttonPanelRight = $("<div>").addClass("zui-dialog-footer-right").appendTo(buttonPanel);

            if (options.hint) {
                $("<div>").addClass("zui-dialog-hint").html(options.hint).appendTo(buttonPanelLeft);
            }

            if (options.buttons) {
                for (i = 0; i < options.buttons.length; ++i) {
                    var button = $("<button>").appendTo(buttonPanelRight);

                    if (options.buttons[i].click) {
                        button.on("click", options.buttons[i].click);
                    }

                    button.text(options.buttons[i].label);

                    if (options.buttons[i].type) {
                        button.attr("data-zui-dialog-button", options.buttons[i].type);
                    }
                }
            }

            return zui.Dialog.open(null, dialog);
        },

        replaceWith: function(data) {
            var newDialog = $(data).attr("style", currentDialog.attr("style"));

            currentDialog.replaceWith(newDialog);
            currentDialog = newDialog;
        }
    };

    

    var isCurrentlyOpen = false;
    var activeElement = null;

    zui.Dropdown = {
        bind: function() {
            $(document).on("click", function(event) {
                if (!$(event.target).closest(".zui-dropdown-menu").length &&
                    !$(event.target).closest(".zui-button-split-more").length) {
                    zui.Dropdown.close();
                }
            });

            $("body").on("mouseenter", "[aria-expanded='false']", function() {
                if (isCurrentlyOpen) {
                    zui.Dropdown.open(this, this);
                }
            });

            $("body").on("mouseenter", ".zui-dropdown-menu li", function() {
                zui.Dropdown.clearSelectedElements();

                $(this).addClass("zui-dropdown-item-highlighted");

                activeElement = $(this);
            });

            $("body").on("mouseleave", ".zui-dropdown-menu li", function() {
                zui.Dropdown.clearSelectedElements();

                activeElement = null;
            });
        },

        clearSelectedElements: function() {
            $(".zui-dropdown-item-highlighted").removeClass("zui-dropdown-item-highlighted");
        },

        getSelectedElement: function() {
            var elements = zui.Dropdown.getSelectedElements();

            return elements.length === 0 ? null : elements[0];
        },

        getSelectedElements: function() {
            return $(".zui-dropdown-item-highlighted");
        },

        selectFirst: function() {
            zui.Dropdown.clearSelectedElements();

            activeElement = $(".zui-dropdown-menu[aria-hidden='false'] li:not(.zui-dropdown-item-hidden):first");
            activeElement.addClass("zui-dropdown-item-highlighted");
        },

        selectNext: function() {
            if (!activeElement) {
                zui.Dropdown.selectFirst();
                return;
            }

            var next = activeElement.nextAll(":not('.zui-dropdown-item-hidden'):first");
            if (next.length) {
                activeElement.removeClass("zui-dropdown-item-highlighted");
                activeElement = next;
                activeElement.addClass("zui-dropdown-item-highlighted");
            }
        },

        selectPrevious: function() {
            if (!activeElement) {
                zui.Dropdown.selectFirst();
                return;
            }

            var prev = activeElement.prevAll(":not('.zui-dropdown-item-hidden'):first");
            if (prev.length) {
                activeElement.removeClass("zui-dropdown-item-highlighted");
                activeElement = prev;
                activeElement.addClass("zui-dropdown-item-highlighted");
            }
        },

        close: function() {
            if (!isCurrentlyOpen) {
                return;
            }

            $(".zui-dropdown-menu").each(function() {
                var describedBy = $(this).attr("aria-describedby"), describedByElement;

                zui.Aria.setVisibility(this, false);

                if (describedBy) {
                    describedByElement = $("#" + describedBy);

                    zui.Aria.setExpanded(describedByElement, false);

                    describedByElement.removeClass("zui-button-active");
                    describedByElement.removeClass("zui-dropdown-item-highlighted");
                }
            });

            isCurrentlyOpen = false;

            if (activeElement) {
                zui.Dropdown.clearSelectedElements();

                activeElement = null;
            }
        },

        open: function(activatingElement, parentToElement) {
            var id, dropdown, pos, x, y;

            // Disable all current dropdown menus:
            zui.Dropdown.close();

            activatingElement = $(activatingElement);
            parentToElement = $(parentToElement);

            // Look up the dropdown that is controlled:
            id = zui.Aria.getOwnedValue(activatingElement);
            dropdown = $("#" + id).appendTo("body");
            dropdown.width(parentToElement.width());

            // Let's find the position of the element to position the dropdown to:
            pos = parentToElement.offset();

            // Update the position to show the menu on a nicer place:
            x = pos.left + 1;
            y = pos.top + parentToElement.outerHeight();

            // Check if the menu ends outside the screen. If so we move the menu to the left:
            if (x + dropdown.width() > zui.Screen.width) {
                x = pos.left + parentToElement.outerWidth(true) - dropdown.width();
            }

            // The button is now active, let's set a CSS class:
            activatingElement.addClass("zui-button-active");

            // Transform the dropdown menu:
            dropdown.css("top", "0");
            dropdown.css("left", "0");
            dropdown.css("position", "absolute");
            dropdown.css("transform", "translateX(" + x + "px) translateY(" + y + "px)");
            dropdown.css("z-index", "3000");

            // Update the aria- states:
            zui.Aria.setVisibility($(".zui-dropdown-menu"), false);
            zui.Aria.setVisibility(dropdown, true);
            zui.Aria.setExpanded(activatingElement, true);

            isCurrentlyOpen = true;
        },

        toggle: function(activatingElement, parentToElement) {
            activatingElement = $(activatingElement);

            if (activatingElement.attr("aria-expanded") === "true") {
                zui.Dropdown.close();
            } else {
                zui.Dropdown.open(activatingElement, parentToElement);
            }
        }
    };

    

    zui.FileSelection = {
        bind: function() {
            $("body").on("click", "[data-zui-file-selection-trigger]", function() {
                var trigger = this, selector = $(this).data("zui-file-selection-trigger");

                zui.Dialog.openSelector(selector, function(dialog) {
                    dialog.data("triggered-by", trigger);
                });

                return false;
            });

            $("body").on("keyup", ".zui-file-selection-toolbar input[type=text]", function() {
                var query = $(this).val().toLowerCase();
                var items = $(this).closest(".zui-dialog-panel").find("li");

                items.each(function() {
                    var label = $("div", this).text().toLowerCase();

                    if (query !== "" && label.indexOf(query) === -1) {
                        $(this).hide();
                    } else {
                        $(this).show();
                    }
                });
            });

            $("body").on("click", ".zui-file-selection li button", function() {
                var button = $(this);
                var triggeredBy = $(this).closest(".zui-file-selection").data("triggered-by");
                var triggeredByContainer = $(triggeredBy).closest(".zui-file-selection-trigger-container");

                var selectionThumb = $(".zui-file-selection-trigger-thumb", triggeredByContainer);
                selectionThumb.attr("src", button.data("zui-file-selection-preview"));

                var selectionLabel = $(".zui-file-selection-trigger-label", triggeredByContainer);
                selectionLabel.text(button.find("div").text());

                var selectionField = $("input[type=hidden]", triggeredByContainer);
                selectionField.val(button.data("zui-file-selection-id"));

                $("body").trigger("zui-file-selection-selected", [this]);

                zui.Dialog.close();

                return false;
            });

            $("body").on("submit", ".zui-file-selection-toolbar form", function(e) {
                $("button", this).click();
                e.preventDefault();
                return false;
            });

            $("body").on("zui-file-selection-upload-complete", function(e, form, jqXHR) {
                var status = $(".zui-file-selection-upload-status", form),
                    msgError = form.data("zui-file-selection-upload-error"),
                    msgSuccess = form.data("zui-file-selection-upload-success");

                if (jqXHR.status === 200) {
                    status.show().text(msgSuccess);
                } else {
                    status.show().text(msgError);
                }

                setTimeout(function() {
                    status.fadeOut();
                }, 1000);
            });

            $("body").on("zui-file-selection-upload-success", function(e, form, data) {
                var ul, item, template, populate;

                populate = function(item, data) {
                    $("button", item).attr({
                        "data-zui-file-selection-id": data.id,
                        "data-zui-file-selection-preview": data.preview
                    });

                    $(".zui-file-selection-label", item).text(data.label);
                    $("img", item).attr("src", data.explorer);
                };

                ul = $(".zui-file-selection-items", form.closest(".zui-dialog-panel"));
                template = $("li:first", ul);

                if (data.length) {
                    for (var i = 0; i < data.length; ++i) {
                        item = template.clone();

                        populate(item, data[i]);

                        ul.append(item);
                    }
                } else if (data.explorer) {
                    item = template.clone();

                    populate(item, data);

                    ul.append(item);
                }
            });

            $("body").on("change", ".zui-file-selection-toolbar input[type=file]", function() {
                var form = $(this.closest("form")),
                    formData = new FormData(),
                    files = this.files;

                for (var i = 0; i < files.length; i++) {
                    var file = files[i];

                    if (!file.type.match("image.*")) {
                        continue;
                    }

                    formData.append("file[]", file, file.name);
                }

                $.ajax({
                    type: "POST",
                    url: form.attr("action"),
                    data: formData,
                    processData: false,
                    contentType: false,
                    beforeSend: function(jqXHR, settings) {
                        $("body").trigger("zui-file-selection-upload-starting", [form, jqXHR, settings]);
                    },
                    complete: function(jqXHR) {
                        $("body").trigger("zui-file-selection-upload-complete", [form, jqXHR]);
                    },
                    success: function(data, textStatus, jqXHR) {
                        $("body").trigger("zui-file-selection-upload-success", [form, data, textStatus, jqXHR]);
                    }
                });
            });
        }
    };

    

    zui.Id = {
        create: (function() {
            var globalIdCounter = 0;

            return function(baseStr) {
                return (baseStr + globalIdCounter++);
            };
        })()
    };

    

    zui.Moment = {
        bind: function() {
            var selector = ".zui-momentjs";

            $("time[datetime]").each(function() {
                var m, date = $(this).attr("datetime");

                m = window.moment(date);

                $(this).text(m.fromNow());
            });

            $(selector).each(function() {
                var self = $(this), m, result, data = self.data();

                if (data.zuiMomentjsDate && data.zuiMomentjsFormat) {
                    m = window.moment(String(data.zuiMomentjsDate), data.zuiMomentjsFormat);
                } else if (data.zuiMomentjsDate) {
                    m = window.moment(data.zuiMomentjsDate);
                } else {
                    m = window.moment();
                }

                if (data.zuiMomentjsStartOf) {
                    m = m.startOf(data.zuiMomentjsStartOf);
                } else if (data.zuiMomentjsEndOf) {
                    m = m.startOf(data.zuiMomentjsEndOf);
                }

                if (data.zuiMomentjsRelative) {
                    result = m.fromNow();
                } else if (data.zuiMomentjsFormat) {
                    result = m.format(data.zuiMomentjsFormat);
                } else {
                    result = m.format();
                }

                self.text(result);
            });
        }
    };

    

    function removeNote(note) {
        var fadeOutSpeed = note.data("zui-note-fade-speed") || zui.Note.fadeOutSpeed;

        note.fadeOut(fadeOutSpeed, function() {
            note.trigger("zui-note-closed");
            note.remove();
        });
    }

    zui.Note = {
        fadeOutSpeed: 250,
        draggingElement: false,
        draggingX: 0,
        draggingY: 0,
        startX: 0,
        startY: 0,

        bind: function() {
            $("body").on("click", ".zui-note .zui-icon-x", function() {
                var alert = $(this).closest(".zui-note");

                removeNote(alert);

                return false;
            }).on("mousemove", function(e) {
                zui.Note.draggingX = e.pageX;
                zui.Note.draggingY = e.pageY;

                if (zui.Note.draggingElement) {
                    $(zui.Note.draggingElement).css({
                        left: zui.Note.draggingX - zui.Note.startX,
                        top: zui.Note.draggingY - zui.Note.startY
                    });
                }
            }).on("mouseup", function() {
                zui.Note.draggingElement = null;
            });

            $(".zui-note").on("mousedown", function() {
                zui.Note.draggingElement = this;
                zui.Note.startX = zui.Note.draggingX - $(this).offset().left;
                zui.Note.startY = zui.Note.draggingY - $(this).offset().top;
            });

            $("[data-zui-note-selector]").each(function() {
                var element = $($(this).attr("data-zui-note-selector"));
                var offsetX = parseInt($(this).attr("data-zui-note-offset-x")) || 10;
                var offsetY = parseInt($(this).attr("data-zui-note-offset-y")) || 10;

                // Add this element to the body so we can position it better.
                $(".zui-note").appendTo("body");

                $(this).css({
                    left: element.offset().left + offsetX,
                    top: element.offset().top + offsetY
                });
            });

            $("[data-zui-note-timeout]").each(function() {
                var $this = $(this);

                setTimeout(function() {
                    removeNote($this);
                }, $this.data("zui-note-timeout"));
            });

            $(".zui-note").fadeIn();
        }
    };

    

    var SelectContainerClass = function(element) {
        var self = this, isMultiple, container, selectMenu, searchInput, noMatchesFound;

        element = $(element);

        var canAddItems = element.data("zui-addable") !== undefined &&
            (element.data("zui-addable") === "" || !!element.data("zui-addable"));

        var toggleVisibleItems = function(selectedItems) {
            var key, item;

            if (typeof selectedItems === "string") {
                selectedItems = [selectedItems];
            }

            $("li", selectMenu).each(function() {
                item = $(this);
                key = String(item.data("key"));

                if (selectedItems && selectedItems.indexOf(key) !== -1) {
                    item.addClass("zui-dropdown-item-hidden");
                } else {
                    item.removeClass("zui-dropdown-item-hidden");
                }
            });
        };

        var findMatchedItem = function(query) {
            var items = $("li", selectMenu);

            for (var i = 0; i < items.length; ++i) {
                if ($(items[i]).text().toLowerCase() === query.toLowerCase()) {
                    return items[i];
                }
            }

            return null;
        };

        var filterMenuOptions = function(query) {
            query = query.toLowerCase();

            // Remove the no matches element:
            if (noMatchesFound) {
                noMatchesFound.remove();
            }

            // Deselect all elements:
            zui.Dropdown.clearSelectedElements();

            // Else filter out the elements that do not match the query. We also make sure that the items that are
            // already selected, are not shown again.
            var selectedOptions = element.val() || [];
            $("li", selectMenu).each(function() {
                var item = $(this);
                var key = item.data("key");
                var text = item.text().toLowerCase();

                if (selectedOptions.indexOf(key.toString()) !== -1 || text.indexOf(query) !== 0) {
                    item.addClass("zui-dropdown-item-hidden");
                } else {
                    item.removeClass("zui-dropdown-item-hidden");
                }
            });

            // Highlight the first visible item:
            var liCount = $("li:not(.zui-dropdown-item-hidden)", selectMenu).length;
            if (liCount === 0) {
                var noMatchesText = element.data("zui-no-matches") || "No matches found.";

                noMatchesFound = $("<li>").addClass("zui-dropdown-no-matches").appendTo(selectMenu);
                $("<span>").text(noMatchesText).appendTo(noMatchesFound);
            } else if (!canAddItems) {
                zui.Dropdown.selectFirst();
            }
        };

        var initializeSelectButton = function() {
            var selectButton = $("button", container);
            if (!selectButton.length) {
                return;
            }

            selectButton.on("keydown", function(e) {
                if (e.which === zui.Keys.TAB) {
                    self.close();
                } else if (e.which === zui.Keys.ENTER) {
                    element.trigger("zui-select-container-enter");

                    if ($(".zui-dropdown-item-highlighted").length) {
                        self.selectKey($(".zui-dropdown-item-highlighted").data("key"));

                        zui.Dropdown.close();

                        e.preventDefault();
                    }
                }
            });

            selectButton.on("keyup", function(e) {
                if (e.which === zui.Keys.DOWN) {
                    zui.Dropdown.selectNext();
                    e.preventDefault();
                    return false;
                } else if (e.which === zui.Keys.UP) {
                    zui.Dropdown.selectPrevious();
                    e.preventDefault();
                    return false;
                }
            });
        };

        var initializeSearchInput = function() {
            searchInput = container.find("input");

            searchInput.on("keydown", function(e) {
                if (e.which === zui.Keys.TAB) {
                    self.close();
                } else if (e.which === zui.Keys.ENTER) {
                    element.trigger("zui-select-container-enter");

                    if ($(".zui-dropdown-item-highlighted").length) {
                        self.selectKey($(".zui-dropdown-item-highlighted").data("key"));
                    } else if (canAddItems) {
                        var text = $(this).val();

                        // We only add the item if no option exists yet.
                        var matchingOption = $("option", element).filter(function() {
                            return $(this).text() === text;
                        });

                        if (matchingOption.length !== 0) {
                            e.preventDefault();
                            return;
                        }

                        $("<option>").text(text).attr("value", text).appendTo(element);

                        addItemToSelectMenu(text, text);

                        if (isMultiple) {
                            addMultiItem(text, text);

                            $(this).val("").width(10);
                        } else {
                            self.selectKey(text);
                        }
                    }

                    e.preventDefault();
                } else if (isMultiple) {
                    var width = $(this).outerWidth() + 25;
                    var maxWidth = $(this).closest("ul").width();

                    $(this).width(Math.min(width, maxWidth));
                }
            });

            searchInput.on("keyup", function(e) {
                if (e.which === zui.Keys.ESC || e.which === zui.Keys.TAB) {
                    self.close();

                    e.preventDefault();
                } else if (e.which === zui.Keys.DOWN) {
                    if (e.altKey && self.isOpen()) {
                        self.close();
                    } else if (e.altKey) {
                        self.open();
                    } else {
                        zui.Dropdown.selectNext();
                    }

                    e.preventDefault();
                    return false;
                } else if (e.which === zui.Keys.UP) {
                    zui.Dropdown.selectPrevious();
                    e.preventDefault();
                    return false;
                } else {
                    if (!self.isOpen()) {
                        self.open();
                    }

                    filterMenuOptions($(this).val());
                }
            });

            searchInput.on("blur", function() {
                if (!isMultiple) {
                    var value = $(this).val();

                    var matchingOption = $("option", element).attr("selected", false).filter(function() {
                        return $(this).text() === value;
                    });

                    if (matchingOption.length) {
                        matchingOption.attr("selected", true);
                    } else {
                        $(this).val($("option:selected", element).text());
                    }
                }
            });

            searchInput.val($("option:selected", element).text());
        };

        var addItemToSelectMenu = function(key, value) {
            var li = $("<li>").attr("data-key", key).appendTo(selectMenu);
            li.on("click", function() {
                self.selectKey($(this).data("key"));
                self.close();
            });

            $("<span>").addClass("zui-select-result-label").text(value).appendTo(li);
        };

        var initializeMenuOptions = function() {
            $("option", element).each(function() {
                if ($(this).text() === "") {
                    return;
                }

                addItemToSelectMenu($(this).val(), $(this).text());
            });
        };

        var initializeContainer = function() {
            isMultiple = element.attr("multiple") === "multiple";

            if (isMultiple) {
                container = initializeMultipleContainer();
            } else {
                container = initializeSingleContainer();
            }

            container.insertBefore(element);
        };

        var initializeMultipleContainer = function() {
            var dropdownId = zui.Id.create("zui-select-container-menu");
            var controllerId = zui.Id.create("zui-select-container-controller");

            var result = $("<span>").attr({
                "class": "zui-select-container zui-select-container-multi"
            }).html([
                "<ul class='zui-select-choices'>",
                "   <li class='zui-select-search-field'>",
                "       <input  type='text' " +
                    "           autocomplete='off' " +
                    "           autocorrect='off' " +
                    "           autocapitalize='off' " +
                    "           spellcheck='false' " +
                    "           class='zui-select-input' " +
                    "           aria-controls='" + dropdownId + "' " +
                    "           id='" + controllerId + "'>",
                "   </li>",
                "</ul>",
                "<span class='zui-dropdown-menu' id='" + dropdownId + "' aria-describedby='" + controllerId + "' " +
                    " aria-hidden='true'>",
                "   <ul class='zui-select-results'>",
                "   </ul>",
                "</span>"
            ].join(""));

            return result;
        };

        var initializeSingleContainer = function() {
            var dropdownId = zui.Id.create("zui-select-container-menu");
            var controllerId = zui.Id.create("zui-select-container-controller");

            var result = $("<span>").attr({
                "class": "zui-select-container zui-select-container-single"
            }).html([
                "<input type='text' autocomplete='off' autocorrect='off' autocapitalize='off' " +
                "               spellcheck='false' class='zui-select-input'>",
                "<button aria-controls='" + dropdownId + "' id='" + controllerId + "'>X</button>",
                "<span class='zui-dropdown-menu' id='" + dropdownId + "' aria-describedby='" + controllerId + "' " +
                    " aria-hidden='true'>",
                "   <ul class='zui-select-results'>",
                "   </ul>",
                "</span>"
            ].join(""));

            return result;
        };

        var addMultiItem = function(key, value) {
            var inputLi = container.find("input").parent();

            if (value === "") {
                value = "(empty)";
            }

            var li = $("<li>").addClass("zui-select-item-field zui-tag zui-tag-removable");
            li.attr("data-key", key);
            li.text(value);
            li.append($("<span>").addClass("zui-icon zui-icon-x"));
            li.insertBefore(inputLi);
            li.data("zui-select-container", self);

            $("option[value='" + key + "']", element).attr("selected", true);
        };

        var initializeMultipleSelect = function() {
            container.on("click", function() {
                searchInput.focus();
            });
        };

        var initializeSingleSelect = function() {
            // Retrieve the select dropdown and menu:
            var selectButton = $("button", container);

            // Bind to the button:
            selectButton.on("click", function() {
                self.toggle();
                return false;
            });
        };

        this.deselectKey = function(key) {
            $("option[value='" + key + "']", element).attr("selected", false);
        };

        this.selectOptions = function(options) {
            if (isMultiple) {
                $(".zui-select-item-field", container).remove();
                for (var i = 0; i < options.length; ++i) {
                    addMultiItem($(options[i]).attr("value"), $(options[i]).text());
                }
            } else {
                searchInput.val(options.text());
            }
        };

        this.create = function() {
            initializeContainer();

            // Retrieve the select dropdown and menu:
            selectMenu = $(".zui-dropdown-menu ul", container);

            // Update the ARIA states:
            zui.Aria.setVisibility(selectMenu, false);

            // Initialize the search input and menu options:
            initializeSearchInput();
            initializeSelectButton();
            initializeMenuOptions();

            if (isMultiple) {
                initializeMultipleSelect();
            } else {
                initializeSingleSelect();
            }

            // Let's make sure that when the element's value changes, we also update the box:
            element.on("change", function() {
                self.selectOptions($("option:selected", this));
            });

            // Hide the original element:
            element.hide();
            zui.Aria.setVisibility(element, false);
        };

        this.open = function() {
            // Update the ARIA states:
            zui.Aria.setVisibility(selectMenu, true);

            // Show the dropdown menu of this container:
            var activatingElement = isMultiple ? $("input", container) : $("button", container);
            zui.Dropdown.open(activatingElement, container);

            // Remove the no matches element:
            $(".zui-dropdown-no-matches", selectMenu).remove();

            // Toggle all visible items in the current menu:
            toggleVisibleItems(element.val());

            // Filter the elements based on the current search query:
            var matchedItem = findMatchedItem(searchInput.val());
            if (!matchedItem) {
                filterMenuOptions(searchInput.val());
            }
        };

        this.close = function() {
            // Mark the item as hidden:
            zui.Aria.setVisibility(selectMenu, false);

            // Hide the box:
            zui.Dropdown.close();
        };

        this.toggle = function() {
            if (this.isOpen()) {
                this.close();
            } else {
                this.open();
            }
        };

        this.isOpen = function() {
            var selectButton = $("button", container);

            return zui.Aria.isExpanded(selectButton);
        };

        this.remove = function() {
            // Remove our custom element:
            container.remove();

            // Show the original element:
            element.show();
        };

        this.selectIndex = function(index) {
            var key = $("option:nth-child(" + (index + 1) + ")", element).val();

            this.selectKey(key);
        };

        this.selectKey = function(key) {
            if (isMultiple) {
                addMultiItem(key, $("option[value='" + key + "']", element).text());

                searchInput.val("").width(10).focus();
            } else {
                element.val(key);

                searchInput.val($("option:selected", element).text());
            }
        };

        this.getLength = function() {
            return $("option", element).length;
        };
    };

    zui.SelectContainerClass = SelectContainerClass;
    zui.SelectContainer = {
        dataKey: "SelectContainerClass",

        bind: function() {
            $("select.zui-select-container").each(function() {
                zui.SelectContainer.create(this);
            });

            $("body").on("zui-tag-removed", ".zui-tag-removable", function() {
                var selectContainer = $(this).data("zui-select-container");

                selectContainer.deselectKey($(this).data("key"));
            });
        },

        create: function(element) {
            var instance;

            element = $(element);

            instance = element.data(zui.SelectContainer.dataKey);
            if (instance) {
                return;
            }

            instance = new SelectContainerClass(element);

            element.data(zui.SelectContainer.dataKey, instance);

            instance.create();

            return instance;
        },

        remove: function(element) {
            element = $(element);

            var instance = element.data(zui.SelectContainer.dataKey);
            if (!instance) {
                return;
            }

            element.removeData(zui.SelectContainer.dataKey);

            instance.remove();
        },

        selectIndex: function(element, index) {
            element = $(element);

            var instance = element.data(zui.SelectContainer.dataKey);
            if (!instance) {
                return;
            }

            instance.selectIndex(index);
        },

        selectKey: function(element, value) {
            element = $(element);

            var instance = element.data(zui.SelectContainer.dataKey);
            if (!instance) {
                return;
            }

            instance.selectKey(value);
        },

        getLength: function(element) {
            element = $(element);

            var instance = element.data(zui.SelectContainer.dataKey);
            if (!instance) {
                return -1;
            }

            return instance.getLength();
        }
    };

    

    zui.Select2 = {
        bind: function() {
            var selector = ".zui-select2";

            $(selector).each(function() {
                var self = $(this), options = {}, data = self.data();

                options.dir = self.attr("dir") || "ltr";
                options.language = self.attr("lang") || "en";

                if (data.zuiSelect2MaxSelection) {
                    options.maximumSelectionLength = data.zuiSelect2MaxSelection;
                }

                if (data.zuiSelect2Tags) {
                    options.tags = data.zuiSelect2Tags;
                }

                if (data.zuiSelect2TagsSeparators) {
                    options.tokenSeparators = data.zuiSelect2TagsSeparators.split("");
                }

                if (data.zuiSelect2Url) {
                    options.ajax = {
                        url: data.zuiSelect2Url,
                        dataType: data.zuiSelect2AjaxType || "json",
                        delay: data.zuiSelect2AjaxDelay || 250,
                        cache: data.zuiSelect2AjaxCache || true,
                        data: function(params) {
                            return {
                                q: params.term,
                                page: params.page
                            };
                        },
                        processResults: function(data, params) {
                            params.page = params.page || 1;

                            return {
                                results: data.items
                                /*pagination: {
                                    more: (params.page * 30) < data.totalCount
                                }*/
                            };
                        }
                    };
                }

                $(this).select2(options);
            });
        }
    };

    

    var shortcuts = [];
    var keyStrokes = [];

    function findShortcut(keyStrokes) {
        for (var i = 0; i < shortcuts.length; ++i) {
            if (shortcuts[i].matches(keyStrokes)) {
                return shortcuts[i];
            }
        }

        return null;
    }

    function keyMatches(keyEvent, keyCombination) {
        if (keyEvent.altKey !== keyCombination.alt) {
            return false;
        }

        if (keyEvent.ctrlKey !== keyCombination.ctrl) {
            return false;
        }

        if (keyEvent.shiftKey !== keyCombination.shift) {
            return false;
        }

        return keyEvent.key.toLowerCase() === keyCombination.key.toLowerCase();
    }

    function parseKeyCombination(line) {
        var parts = line.trim().split(","), result = [];

        parts.forEach(function(part) {
            var keys = part.trim().split("+"), combination = {
                alt: false,
                meta: false,
                ctrl: false,
                shift: false,
                key: null
            };

            keys.forEach(function(key) {
                switch (key.toLowerCase()) {
                    case "alt":
                        combination.alt = true;
                        break;

                    case "control":
                        combination.ctrl = true;
                        break;

                    case "meta":
                        combination.meta = true;
                        break;

                    case "shift":
                        combination.shift = true;
                        break;

                    default:
                        combination.key = key;
                        break;
                }
            });

            result.push(combination);
        });

        return result;
    }

    var Command = function(keyCombination) {
        var type, param;

        this.keyCombination = keyCombination;

        this.invoke = function(callback) {
            type = "invoke";
            param = callback;
        };

        this.redirect = function(url) {
            type = "redirect";
            param = url;
        };

        this.matches = function(keyStrokes) {
            if (keyCombination.length > keyStrokes.length) {
                return false;
            }

            var index = keyStrokes.length - 1;

            for (var i = keyCombination.length - 1; i >= 0; --i, --index) {
                if (!keyMatches(keyStrokes[index], keyCombination[i])) {
                    return false;
                }
            }

            return true;
        };

        this.run = function() {
            switch (type) {
                case "invoke":
                    param(this);
                    break;

                case "redirect":
                    window.location.href = param;
                    break;

                default:
                    throw "No valid command set.";
            }
        };
    };

    zui.Shortcut = {
        shortcuts: [],
        bind: function() {
            $("body").on("keyup", function(e) {
                var match;

                if (e.keyCode === 16 || e.keyCode === 17 || e.keyCode === 18) {
                    return;
                }

                keyStrokes.push(e);

                match = findShortcut(keyStrokes);

                if (match) {
                    match.run();
                    keyStrokes = [];
                }
            });
        },
        on: function(shortcut) {
            var keyCombination = parseKeyCombination(shortcut);
            var cmd = new Command(keyCombination);

            shortcuts.push(cmd);

            return cmd;
        }
    };

    

    var currentSplitterBar;

    zui.Splitter = {
        bind: function() {
            $(document.body).on("mousedown", ".splitter-bar", function(e) {
                currentSplitterBar = $(e.target);
                $("body").css("cursor", "ew-resize");
                return false;
            });

            $(document.body).on("mouseup", function() {
                if (currentSplitterBar) {
                    currentSplitterBar = null;
                    $("body").css("cursor", "");
                }
            });

            $(document.body).on("mousemove", function(e) {
                if (currentSplitterBar) {
                    var splitter = currentSplitterBar.closest(".splitter");
                    var splitterContainer = splitter.parent();

                    var pane1 = $(".splitter-pane1", splitter);
                    var pane2 = $(".splitter-pane2", splitter);

                    var pane1MinWidth = parseInt(pane1.css("min-width"));
                    var pane1MaxWidth = splitterContainer.width() - pane1MinWidth - currentSplitterBar.outerWidth();

                    // Update the width of the first pane:
                    var x = Math.max(pane1MinWidth, Math.min(pane1MaxWidth, e.pageX));
                    pane1.css("width", x);

                    // Update the position of the splitter:
                    currentSplitterBar.css("left", x);
                    x += currentSplitterBar.width();

                    // Update the position and width of the second pane:
                    pane2.css("left", x);
                    pane2.css("width", splitterContainer.width() - x);

                    return false;
                }
            });
        }
    };

    

    zui.Tabs = {
        dataKey: "TabsClass",

        bind: function() {
            // Make sure that the tab is selected when clicked:
            $(document).on("click", ".zui-tabs-menu .zui-menu-item", function(e) {
                zui.Tabs.selectTab($("a", this).attr("href"));

                e.preventDefault();
            });

            // Make sure that the tab is selected if targeted via the URL:
            zui.Tabs.selectTab(window.location.hash);
        },

        getSelectedTab: function(control) {
            return $(".zui-menu-item.zui-active-tab a", control).attr("href");
        },

        getTabPosition: function(tab) {
            var tabContainer = $(tab).closest(".zui-tabs");
            if (!tabContainer) {
                return;
            }

            var items = $("a[href='" + tab + "']", tabContainer).closest("li.zui-menu-item").prevAll(".zui-menu-item");

            return items.length;
        },

        getTabCount: function(control) {
            return $(".zui-menu-item", control).length;
        },

        addTab: function(element, id, title, pane) {
            var tabContainer = element.closest(".zui-tabs");
            if (!tabContainer) {
                return;
            }

            $(".zui-tabs-menu", tabContainer).append([
                "<li role='presentation' class='zui-menu-item'>",
                "   <a href='#" + id + "' role='tab' aria-selected='true'><strong>" + title + "</strong></a>",
                "</li>"
            ].join(""));

            $("<div>").attr({
                "role": "tabpanel",
                "aria-hidden": true,
                "id": id,
                "class": "zui-tabs-pane"
            }).html(pane).appendTo($(".zui-tabs-content", tabContainer));
        },

        insertTab: function(element, position, id, title, pane) {
            var tabContainer = element.closest(".zui-tabs");
            if (!tabContainer) {
                return;
            }

            var tabToInsertAfter = $(".zui-tabs-menu li.zui-menu-item", tabContainer).get(position);

            zui.Tabs.addTab(element, id, title, pane);

            $("a[href='#" + id + "']").closest("li.zui-menu-item").insertAfter(tabToInsertAfter);
        },

        removeTab: function(targetPane) {
            var targetMenu = $(".zui-tabs a[href='" + targetPane + "']").closest("li");
            var tabContainer = targetMenu.closest(".zui-tabs");
            var isSelected = targetMenu.hasClass("zui-active-tab");

            // Remove the menu option and the tab pane:
            $(targetMenu).remove();
            $(targetPane).remove();

            // If the menu option was selected, select the first item:
            if (isSelected) {
                zui.Tabs.selectTab($(".zui-menu-item:first a", tabContainer).attr("href"));
            }
        },

        selectTab: function(targetPane) {
            // Find the target menu item:
            var targetMenu = $(".zui-tabs a[href='" + targetPane + "']").closest("li");

            // Change the status of all tabs:
            $(targetPane).siblings(".zui-tabs-pane").removeClass("zui-active-pane").attr("aria-hidden", "true");
            $(targetPane).addClass("zui-active-pane").attr("aria-hidden", "false");

            // Now change the status of all menu items:
            targetMenu.siblings(".zui-menu-item").removeClass("zui-active-tab");
            targetMenu.addClass("zui-active-tab");

            // Change the status of all links:
            $("a", targetMenu.siblings(".zui-menu-item")).attr("aria-selected", "false");
            $("a", targetMenu).attr("aria-selected", "true");
        }
    };

    

    var columnIndexToSort = 0;

    function getSortMode(column) {
        if ($(column).hasClass("zui-table-col-asc")) {
            return "asc";
        } else if ($(column).hasClass("zui-table-col-desc")) {
            return "desc";
        } else {
            return "";
        }
    }

    function compareValuesDate(lft, rgt) {
        var lftDate = new Date(lft);
        var rgtDate = new Date(rgt);

        return compareValuesNumeric(lftDate, rgtDate);
    }

    function compareValuesNumeric(lft, rgt) {
        if (lft < rgt) {
            return -1;
        } else if (lft > rgt) {
            return 1;
        }

        return 0;
    }

    function compareValuesText(lft, rgt) {
        var lftVal = $(lft.cells[columnIndexToSort]).text().toLowerCase();
        var rgtVal = $(rgt.cells[columnIndexToSort]).text().toLowerCase();

        return lftVal.localeCompare(rgtVal);
    }

    function determineSortFunc(columns) {
        var item = $(columns[0]).text();

        if (item.match(/^\d\d[\/\.-][a-zA-z][a-zA-Z][a-zA-Z][\/\.-]\d\d\d\d$/)) {
            return compareValuesDate;
        } else if (item.match(/^-?[£$€Û¢´]\d/)) {
            return compareValuesNumeric;
        }

        return compareValuesText;
    }

    function sortTable(table, index, ascending) {
        // Find the tbody, when there is none, we cannot sort the table:
        var tbody = $("tbody", table);
        if (tbody.length === 0) {
            return;
        }

        // Build an array with all rows
        var rows = [], columns = [];
        $("tr", tbody).each(function() {
            rows.push(this);
            columns.push(this.cells.item(index));
        });

        // Sort the rows:
        var sortFunc = determineSortFunc(columns);
        columnIndexToSort = index;
        rows.sort(sortFunc);

        // When we are not sorting ascending, let's reverse the collection:
        if (!ascending) {
            rows.reverse();
        }

        // Rebuild the rows in the tbody:
        tbody.empty();
        for (var i = 0; i < rows.length; ++i) {
            tbody.append(rows[i]);
        }
    }

    zui.Table = {
        bind: function() {
            $(".zui-table-sortable thead th").wrapInner("<div class='zui-table-header-content'>");
            $(".zui-table-sortable thead th").addClass("zui-table-col-unsorted").on("click", function() {
                var sortMode = getSortMode(this);
                var index = this.cellIndex;

                $(".zui-table-sortable thead th")
                    .removeClass("zui-table-col-asc")
                    .removeClass("zui-table-col-desc")
                    .addClass("zui-table-col-unsorted");

                switch (sortMode) {
                    case "asc":
                        sortTable($(this).closest("table.zui-table-sortable"), index, false);
                        $(this).removeClass("zui-table-col-unsorted").addClass("zui-table-col-desc");
                        break;

                    case "desc":
                        sortTable($(this).closest("table.zui-table-sortable"), index, true);
                        $(this).removeClass("zui-table-col-unsorted").addClass("zui-table-col-asc");
                        break;

                    default:
                        sortTable($(this).closest("table.zui-table-sortable"), index, true);
                        $(this).removeClass("zui-table-col-unsorted").addClass("zui-table-col-asc");
                        break;
                }

                return false;
            });
        }
    };

    

    zui.Tag = {
        bind: function() {
            var selector = ".zui-tag-removable .zui-icon-x";

            $("body").on("click", selector, function() {
                var tag = $(this).closest(".zui-tag");

                tag.trigger("zui-tag-removed");

                tag.fadeOut(200, function() {
                    $(this).remove();
                });
            });
        }
    };

    if (typeof define === "function" && define.amd) {
        define("zui", [], function() {
            return zui;
        });
    }


    $("body").attr("data-zui-version", zui.version);

    // Core bindings:
    zui.EventHandler.bind();
    zui.Aria.bind();

    // Patterns:
    zui.Alert.bind();
    zui.Anchor.bind();
    zui.Button.bind();
    zui.Dialog.bind();
    zui.Dropdown.bind();
    zui.FileSelection.bind();
    zui.Moment.bind();
    zui.Note.bind();
    zui.Select2.bind();
    zui.SelectContainer.bind();
    zui.Screen.bind();
    zui.Shortcut.bind();
    zui.Splitter.bind();
    zui.Tabs.bind();
    zui.Table.bind();
    zui.Tag.bind();
    zui.LastPass.bind();
    return zui;
}));
