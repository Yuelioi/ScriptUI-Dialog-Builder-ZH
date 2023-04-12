function structurePanelScroll(e, t) {
    var a = $('[data-panel="treeview"]'),
        i = a.find(".overflow-wrap"),
        n = a.find('[data-item-id="' + e + '"]').position().top,
        s = t.position().top,
        l = n + 9 - i.height() / 2,
        o = Math.abs(n - s);
    (o = (o <= 300 ? 300 : o >= 1e3 && 1e3) || o), i.animate({ scrollTop: l }, o);
}
function breadCrumbs(e, t) {
    e.find(".active-parent").removeClass("active-parent"),
        t.parentsUntil(".dialog.tree-root").filter('[data-parent="true"]').addClass("active-parent");
}
function lightThePath(e, t) {
    if (
        ($(".path-node").removeClass("path-node"),
        $(".path-item").removeClass("path-item"),
        $(".path-sibling-node").removeClass("path-sibling-node"),
        $(".path-end").removeClass("path-end"),
        $(".path-start").removeClass("path-start"),
        $(".path-start-last").removeClass("path-start-last"),
        $(".path-start-node").removeClass("path-start-node"),
        $(".path-parent-ul").removeClass("path-parent-ul"),
        "Dialog" !== t.data("item-type") && !t.parent().parent().hasClass("tree-root"))
    ) {
        e.find(".active-parent").first().addClass("path-end");
        var a = t;
        a.next().length < 1 ? a.addClass("path-start-last") : a.data("parent") ? a.addClass("path-start-node") : a.addClass("path-start"),
            e
                .find(".active-parent:not(:first)")
                .addClass("path-node")
                .add(a)
                .each(function () {
                    $(this)
                        .prevUntil(":first")
                        .each(function () {
                            $(this).data("parent")
                                ? ($(this).addClass("path-sibling-node"), $(this).parent("ul").addClass("path-parent-ul"))
                                : $(this).addClass("path-item");
                        });
                });
    }
}
function droplistOnWindowResize() {
    $(window).on("resize", function () {
        droplist.hide();
    });
}
function numberInputs() {
    function e(e, i, n, s) {
        var l = e.val(),
            o = parseInt(l.replace(/\D/g, ""), 10);
        o = o || 0;
        var r = $("#dialog .active"),
            d = e.hasClass("width"),
            p = e.hasClass("height"),
            c = {
                min: parseInt(e.attr("min"), 10),
                max: parseInt(e.attr("max"), 10),
                step: s || parseInt(e.attr("step"), 10),
                modifierStep: parseInt(e.attr("modifier-step"), 10),
            },
            m = (n ? c.modifierStep : c.step) || 1,
            u = o < c.min,
            f = o > c.max,
            g = u || f;
        if (a) {
            if (((a = !1), d)) o = Math.round(r.width()) + ("down" === i ? 1 : 0) - ("up" === i ? 1 : 0);
            else if (p) {
                var h = "Dialog" === $("#dialog .active").data("item-type") ? r.find("> .padding-box").outerHeight() : r.height();
                o = Math.round(h) + ("down" === i ? 1 : 0) - ("up" === i ? 1 : 0);
            }
        } else l !== o.toString() ? e.val(o) : o || e.val(0);
        switch (i) {
            case "up":
                o < c.max && ((o = o + m > c.max ? c.max : o + m), e.val(o), (t = o));
                break;
            case "down":
                o > c.min && ((o = o - m < c.min ? c.min : o - m), e.val(o), (t = o));
                break;
        }
        if (g) {
            var v = (u && c.min) || (f && c.max);
            e.val(v);
        }
        item.funnel.update(e.data("edit"));
    }
    $(".number").wrap('<div class="number-wrap">');
    var t,
        a,
        i = $(".number-wrap");
    $('<div class="arrow plus"></div><div class="arrow minus"></div><div class="number-overlay"></div>').appendTo(i);
    var n = i.find(".number"),
        s = i.find(".number-overlay");
    n.each(function () {
        "none" === $(this).css("display") && $(this).closest(".number-wrap").addClass("hide");
    });
    var l,
        o,
        r = !1,
        d = 0,
        p = null,
        c = null;
    $(window).on("mousedown mousemove mouseup", function (i) {
        if ("mousedown" === i.type) (r = !0), (l = $(i.target).parent()), (o = l.find("> .number")), (t = o.val()), (a = 0 == t);
        else if ("mousemove" === i.type) {
            if (r && mousemovePing && o.hasClass("number")) {
                if (((mousemovePing = !1), i.preventDefault(), null === p)) return (p = Date.now()), void (c = i.screenY);
                var n = Date.now(),
                    s = n - p,
                    m = i.screenY - c,
                    u = Math.abs(Math.round((m / s) * (i.shiftKey ? 200 : 40))),
                    f = u > 4 ? u : 0;
                (p = n), (c = i.screenY), i.pageY < d ? e(o, "up", i.shiftKey, f) : i.pageY > d && e(o, "down", i.shiftKey, f), (d = i.pageY);
            }
        } else if ("mouseup" === i.type) {
            r && o.length;
            r = !1;
        }
    }),
        s.on("click", function () {
            $(this).parent().find(".number").focus();
        }),
        n.on("focus blur", function (i) {
            var n = $(this);
            "focus" === i.type ? ((t = n.val()), (a = 0 == t), $(this).select()) : e(n, "blur");
        }),
        i.find(".arrow").on("click", function (i) {
            var n = $(this),
                s = n.parent().find(".number");
            (t = s.val()), (a = 0 == t), n.hasClass("plus") ? e(s, "up", i.shiftKey) : n.hasClass("minus") && e(s, "down", i.shiftKey);
        }),
        n.on("keyup", function (i) {
            var n = i.keyCode ? i.keyCode : i.which,
                s = $(this);
            (t = s.val()), (a = 0 == t), e(s, 38 === n ? "up" : 40 === n ? "down" : "numberEntry", i.shiftKey);
        }),
        s.on("wheel", function (i) {
            var n = i.originalEvent.deltaY,
                s = i.originalEvent.deltaX,
                l = n < 0 || s < 0,
                o = $(this).parent().find(".number");
            (t = o.val()), (a = 0 == t), e(o, l ? "up" : "down", i.shiftKey);
        });
}
function exportToClipboard(e) {
    var t;
    $("body").addClass("sdb-code-export");
    var a = $("#export-box"),
        i = "export-window" === e;
    if (i) {
        var n = a.find(".copy.btn");
        n.find(".fa-clipboard-list").hide(), n.find("img").show();
    }
    var s = $("#clipboard-export-spinner");
    s.show(),
        setTimeout(function () {
            var e,
                n,
                l = $(".l-export"),
                o = !1;
            try {
                document.execCommand("copy") && (o = !0);
            } catch (e) {}
            if ((i && a.find(".copy.btn img").hide(), s.hide(), o)) {
                if (i) {
                    var r = a.find(".btn.copy"),
                        d = r.find(".fa-check");
                    (t = r.find(".fa-clipboard-list")),
                        d.addClass("rotateIn"),
                        t.hide(),
                        setTimeout(function () {
                            d.removeClass("rotateIn"), t.show();
                        }, 750);
                }
                clearTimeout(e),
                    l.addClass("success"),
                    $("body").addClass("successful-shortcut-export"),
                    (e = setTimeout(function () {
                        l.removeClass("success"), $("body").removeClass("successful-shortcut-export");
                    }, 350)),
                    clearTimeout(n),
                    $("#dialog-section #export-success-icon").remove(),
                    $(
                        '<div id="export-success-icon"><div class="center-1"><div class="center-2"><div class="center-3"><div class="circle"><img src="assets/images/export-shortcut-icon.svg?' +
                            new Date().getTime() +
                            '" alt="" /></div></div></div></div></div>'
                    ).appendTo("#dialog-section"),
                    (n = setTimeout(function () {
                        $("#export-success-icon").remove(), i && $("#toolbar .export").trigger("click");
                    }, 950));
            } else {
                if (i) {
                    var p = a.find(".btn.copy"),
                        c = p.find(".fa-times");
                    (t = p.find(".fa-clipboard-list")),
                        c.addClass("tada"),
                        t.hide(),
                        setTimeout(function () {
                            myCodeMirror.execCommand("selectAll"), c.removeClass("tada"), t.show();
                        }, 750);
                }
                l.addClass("failure"),
                    $("body").addClass("shortcut-export-failure"),
                    setTimeout(function () {
                        l.removeClass("failure"),
                            $("body").removeClass("shortcut-export-failure"),
                            i
                                ? (notification("failure", "Try copying the code manually from the export window", 3),
                                  setTimeout(function () {
                                      $("#toolbar .export").trigger("click");
                                  }, 3e3))
                                : notification("failure", "Try copying the code manually from the export window.", 3);
                    }, 350);
            }
        }, 200);
}
function getExportCode() {
    (imageDuplicateCheck.images = []), droplist.onExport(), customVar.init();
    var e = local_storage.get("dialog"),
        t = e.settings.indentSize ? "  " : "    ",
        a = "",
        i = t;
    !e.settings.cepExport && e.settings.functionWrapper && (i = (a = "  ") + i);
    var n = getJSX(e, t, i, a),
        s = "\n" + a + "Code for Import https://scriptui.joonas.me — (Triple click to select): \n" + a + JSON.stringify(e) + "\n",
        l = {};
    if (e.settings.cepExport)
        (s = e.settings.importJSON ? "\x3c!-- " + s + "--\x3e \n\n" : ""),
            (l.code = settings.cepExport.onExport(e, s)),
            (l.language = "htmlmixed"),
            (l.filename = "ScriptUI Dialog Builder - Export.html");
    else {
        (l.code = ""),
            (s = e.settings.importJSON ? a + "/*" + s + a + "*/ \n\n" : ""),
            (l.language = "javascript"),
            (l.filename = "ScriptUI Dialog Builder - Export.jsx");
        var o = e.settings.afterEffectsDockable ? "var panelGlobal = this;\n" : "",
            r = e.settings.afterEffectsDockable
                ? a +
                  customVar.names[0] +
                  ".layout.layout(true);\n" +
                  a +
                  customVar.names[0] +
                  ".layout.resize();\n" +
                  a +
                  customVar.names[0] +
                  ".onResizing = " +
                  customVar.names[0] +
                  ".onResize = function () { this.layout.resize(); }\n\n"
                : "",
            d = e.settings.afterEffectsDockable ? "if ( " + customVar.names[0] + " instanceof Window ) " : "",
            p = e.settings.showDialog ? a + d + customVar.names[0] + ".show();" : "",
            c =
                n +
                r +
                (function () {
                    var t = e.settings.itemReferenceList.toLowerCase();
                    if ("none" === t || $.isEmptyObject(customVar.customNames)) return "";
                    var i = "",
                        n = [];
                    (i += a + "// ITEM REFERENCE LIST ( Info: http://jongware.mit.edu/Sui/index_1.html ) \n"),
                        (i += a + customVar.names[0] + ".items = { \n");
                    var s = 0,
                        l = e.items["item-0"].style.windowType.toLowerCase();
                    return (
                        $.each(customVar.customNames, function (e, o) {
                            e = e.replace("item-", "");
                            var r = Object.keys(customVar.customNames).length - 1 === s,
                                d = $('[data-panel="treeview"] [data-item-id="' + e + '"]');
                            i += a + "  " + o + ": ";
                            var p = "";
                            switch (t) {
                                case "var":
                                    p = "varName";
                                    break;
                                case "find":
                                    p = "findElement";
                                    break;
                                case "path":
                                    p = "path";
                                    break;
                            }
                            var c = contextMenu.get[p](!1, d, "export");
                            (i += c + (r ? "" : ",") + " // " + (0 == e ? l.toLowerCase() : d.data("item-type").toLowerCase())),
                                n.push(o),
                                (i += "\n"),
                                ++s;
                        }),
                        (i += a + "};\n"),
                        (i += a + customVar.names[0] + ".itemsArray = [" + n.join(", ") + "];\n") + "\n"
                    );
                })() +
                p +
                (e.settings.showDialog ? "\n\n" : "");
        e.settings.functionWrapper ? ((l.code += o), (l.code += "var " + customVar.names[0] + " = (function () {\n\n"), (o = "")) : (o += "\n"),
            (l.code += o + s + c),
            e.settings.functionWrapper && ((l.code += a + "return " + customVar.names[0] + ";"), (l.code += "\n\n}());"));
    }
    return l;
}
function getJSX(e, t, a, i) {
    var n = "",
        s = {},
        l = { name: "", parent: "" },
        o = [],
        r = $("#panel-tree-view-wrap .tree-dialog li"),
        d = r.length;
    return (
        r.each(function (r) {
            var p = r,
                c = $(this).data().itemId,
                m = e.items["item-" + c],
                u = m.parentId,
                f = 0 === u || !1 === u ? "Dialog" : e.items["item-" + u].type,
                g = m.type,
                h = m.id,
                v = m.style,
                b = !1;
            r === d - 1 && (b = !0), (n += makeJSXitem(p, e, s, g, h, u, f, v, l, o, b, t, a, i));
        }),
        n
    );
}
function getFonts() {
    return "@font-face {font-family: 'Source Sans Pro';src: url(data:application/font-woff2;charset=utf-8;base64,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) format('woff2');font-weight: normal;font-style: normal;}";
}
function makeJSXitem(e, t, a, i, n, s, l, o, r, d, p, c, m, u) {
    function f(e, t) {
        var a = item.list[y](!1).defaultStyle.creationProps,
            i = "";
        switch (("statictext" === y && v[0] && (o.creationProps = {}), y)) {
            case "iconbutton":
                if (a.style === o.creationProps.style) {
                    i += ", " + (o.iconButtonStroke ? 'style: "button"' : 'style: "toolbutton"');
                }
                break;
            case "dropdownlist":
                o.listItems && (i += ", items: " + w + "_array");
                break;
            case "listbox":
                o.listItems && (i += ", items: " + w + "_array"),
                    void 0 === o.selection || o.creationProps.multiselect || (o.selection.length > 1 && (i += ", multiselect: true"));
                break;
        }
        var n = "";
        return (
            $.each(o.creationProps, function (e, t) {
                if (a[e] != t) {
                    var i = "string" == typeof t && "numberOfColumns" !== e && "columnTitles" !== e && "columnWidths" !== e ? '"' : "";
                    n += ", " + e + ": " + i + t + i;
                }
            }),
            "dialog" === y
                ? "" === n
                    ? ""
                    : ", undefined, undefined, " + (t ? "" : "{") + n.replace(", ", "") + (t ? "" : "}")
                : (e ? ", undefined, undefined" : "") + (t ? "" : ", {") + 'name: "' + w + '"' + i + n + (t ? "" : "}")
        );
    }
    var g = hideItem.onExport(t.items["item-" + n]),
        h = t.items["item-0"].style.windowType.toLowerCase();
    t.settings.afterEffectsDockable && (h = "palette");
    var v = [!1],
        b = "",
        y = i.toLowerCase(),
        w = customVar.names[n];
    a[n] = w;
    var x = a[s];
    "TreeItem" !== i &&
        (item.list[y](!1).parent
            ? ((b += u + "// " + w.toUpperCase() + "\n"), (b += u + "// " + Array(w.length + 1).join("=") + "\n"))
            : r.parent !== x && r.name !== x && ((b += u + "// " + x.toUpperCase() + "\n"), (b += u + "// " + Array(x.length + 1).join("=") + "\n")));
    var C = $("#dialog");
    switch (i) {
        case "Dialog":
            var S = t.settings.afterEffectsDockable ? "(panelGlobal instanceof Panel) ? panelGlobal : " : "";
            b += u + g + "var " + w + " = " + S + 'new Window("' + h + '"' + f(!0) + "); \n";
            break;
        case "ListBox":
        case "DropDownList":
            if (o.listItems.trim()) {
                var k = o.listItems.split("\n").join("").split(",");
                $.each(k, function (e) {
                    k[e] = k[e].trim().replace(/\"/g, "\\u0022");
                }),
                    (b += u + g + "var " + w + '_array = ["' + k.join('","') + '"]; \n');
            }
            b += u + g + "var " + w + " = " + a[s] + '.add("' + y + '"' + f(!0) + "); \n";
            break;
        case "Divider":
            b += u + g + "var " + w + " = " + a[s] + '.add("panel"' + f(!0) + "); \n";
            break;
        case "TreeView":
            var I = C.find('[data-item-id="' + n + '"]'),
                A = o.preferredSize[0] > 0 ? o.preferredSize[0] : Math.round(I.width()) + 12,
                V = o.preferredSize[1] > 0 ? o.preferredSize[1] : Math.round(I.height()) + 12;
            b +=
                u +
                g +
                "var " +
                w +
                " = " +
                a[s] +
                '.add("' +
                i.toLowerCase() +
                '", [0,0,' +
                (A + 0) +
                "," +
                (V + 0) +
                "], undefined" +
                f() +
                "); \n";
            break;
        case "TreeItem":
            var B = C.find('[data-item-id="' + n + '"]').hasClass("tree-node") ? "node" : "item",
                T = o.text.replace(/\"/g, "\\u0022");
            b += u + g + "var " + w + " = " + a[s] + '.add("' + B + '", "' + T + '"); \n';
            break;
        case "StaticText":
            if ((v = multilineCheck(n))[0]) {
                if (
                    ((b += u + g + "var " + w + " = " + a[s] + '.add("group", undefined ' + f() + "); \n"),
                    (b +=
                        m +
                        g +
                        w +
                        ".getText = function() { var t=[]; for ( var n=0; n<" +
                        w +
                        ".children.length; n++ ) { var text = " +
                        w +
                        ".children[n].text || ''; if ( text === '' ) text = ' '; t.push( text ); } return t.join('\\n'); }; \n"),
                    void 0 !== o.preferredSize &&
                        (o.preferredSize[0] > 0 && (b += m + g + w + ".preferredSize.width = " + o.preferredSize[0] + "; \n"),
                        o.preferredSize[1] > 0 && (b += m + g + w + ".preferredSize.height = " + o.preferredSize[1] + "; \n")),
                    (b += m + g + w + '.orientation = "column"; \n'),
                    void 0 !== o.justify && (b += m + g + w + '.alignChildren = ["' + o.justify + '","center"]; \n'),
                    (b += m + g + w + ".spacing = 0; \n"),
                    null != o.alignment)
                ) {
                    var z = t.items["item-" + s].style.orientation,
                        U = "";
                    U =
                        "column" === z
                            ? ("top" === o.alignment ? "left" : "bottom" === o.alignment && "right") || o.alignment
                            : ("left" === o.alignment ? "top" : "right" === o.alignment && "bottom") || o.alignment;
                    var j = t.items["item-" + s].style.alignChildren;
                    (U = "column" === z ? '["' + U + '","' + j[1] + '"]' : '["' + j[0] + '","' + U + '"]'),
                        (b += m + g + w + ".alignment = " + U + "; \n");
                }
                b += "\n";
                var E = v[1].split("<br>");
                $.each(E, function (e, t) {
                    (t = t.replace(/\"/g, "\\u0022")), (b += m + g + w + '.add("statictext", undefined, "' + t + '"); \n');
                });
            } else b += u + g + "var " + w + " = " + a[s] + '.add("' + y + '"' + f(!0) + "); \n";
            break;
        case "EditText":
            v = multilineCheck(n);
            var P = $('#dialog [data-item-id="' + n + '"]'),
                W = P.width(),
                N = P.height(),
                Y = v[0] ? "size: [" + W + "," + N + "], " : "",
                M = v[0] && !o.creationProps.multiline ? ", multiline: true" : "",
                R =
                    (v[0] || o.creationProps.multiline) && "left" !== o.justify
                        ? "'+ (app.name === 'Adobe Photoshop' ? '' : 'justify: \"" + o.justify + "\", ') +'"
                        : 'justify: "' + o.justify + '", ',
                J = "left" === o.justify.toLowerCase() ? "" : R;
            b += u + g + "var " + w + " = " + a[s] + ".add('edittext {" + Y + J + "properties: {" + f(!1, !0) + M + "}}'); \n";
            break;
        case "Image":
        case "IconButton":
            if (o.image[0]) {
                var D = encodeURIComponent(atob(o.image[0].split(",")[1].replace(/=$/, "").replace(/=$/, "")));
                2 === (D = imageDuplicateCheck.init(w, D)).length && (b += u + g + "var " + w + '_imgString = "' + D[1] + '"; \n');
            }
            var Q = o.image[0] ? "File.decode(" + D[0] + "_imgString)" : "undefined";
            b +=
                "image" === y
                    ? u + g + "var " + w + " = " + a[s] + '.add("image", undefined, ' + Q + f() + "); \n"
                    : u + g + "var " + w + " = " + a[s] + '.add("iconbutton", undefined, ' + Q + f() + "); \n";
            break;
        case "Group":
            b += u + g + "var " + w + " = " + a[s] + '.add("' + y + '", undefined' + f() + "); \n";
            break;
        case "Slider":
            b += u + g + "var " + w + " = " + a[s] + '.add("' + y + '", undefined, undefined' + f(!0) + "); \n";
            break;
        case "VerticalTabbedPanel":
            (b += u + g + "var " + w + " = " + a[s] + '.add("group", undefined, undefined' + f() + "); \n"),
                (b += m + g + w + '.alignChildren = ["left","fill"]; \n');
            var Z = [];
            $('#dialog [data-item-id="' + n + '"] > .tab-container > .inner-wrap > ul > .tab').each(function () {
                Z.push("'" + $(this).find("span").text() + "'");
            }),
                (b += u + g + "var " + w + "_nav = " + w + '.add ("listbox", undefined, [' + Z.join(",") + "]); \n"),
                o.tabNavWidth > 0 && (b += m + g + w + "_nav.preferredSize.width = " + o.tabNavWidth + " \n"),
                (b += u + g + "var " + w + "_innerwrap = " + w + '.add("group") \n'),
                (b += m + g + w + '_innerwrap.alignment = ["fill","fill"]; \n'),
                (b += m + g + w + '_innerwrap.orientation = ["stack"]; \n');
            break;
        case "Tab":
            b +=
                "VerticalTabbedPanel" === l
                    ? u + g + "var " + w + " = " + a[s] + '_innerwrap.add("group", undefined' + f() + "); \n"
                    : u + g + "var " + w + " = " + a[s] + '.add("' + y + '"' + f(!0) + "); \n";
            break;
        default:
            b += u + g + "var " + w + " = " + a[s] + '.add("' + y + '"' + f(!0) + "); \n";
    }
    (r.name = w), (r.parent = a[s]);
    var F = "TreeItem" !== i || p ? "\n" : "";
    b += styleJSXitem(t, a, i, n, s, l, o, w, d, v, c, m, g) + F;
    var G = t.order[e + 1];
    if (void 0 !== G) {
        var L = t.items["item-" + G],
            K = "TreeItem" === i && "TreeItem" !== L.type;
        K && d.length > 0
            ? ((b += "\n"),
              $.each(d, function (e, t) {
                  b += t;
              }),
              (b += "\n"),
              (d = []))
            : K && (b += "\n");
    } else
        void 0 === G &&
            "TreeItem" === i &&
            ($.each(d, function (e, t) {
                b += t;
            }),
            (b += "\n"),
            (d = []));
    if ("Tab" === i && n === $('#dialog [data-item-id="' + s + '"] > .tab-container .tab:last').data("tab-id")) {
        (b += u + "// " + x.toUpperCase() + "\n"), (b += u + "// " + Array(x.length + 1).join("=") + "\n");
        var X = t.items["item-" + s].style.selection,
            q = t.items["item-" + X];
        if ("VerticalTabbedPanel" === l) {
            var H = t.items["item-" + s].hidden ? "// " : "",
                O = [];
            $('#dialog [data-item-id="' + s + '"] > .tab-container .tab').each(function () {
                O.push(customVar.names[$(this).data("tab-id")]);
            });
            var _ = "  ";
            (b += u + H + a[s] + "_tabs = [" + O.join(",") + "]; \n\n"),
                (b += u + H + "for (var i = 0; i < " + a[s] + "_tabs.length; i++) { \n"),
                (b += u + _ + H + a[s] + '_tabs[i].alignment = ["fill","fill"]; \n'),
                (b += u + _ + H + a[s] + "_tabs[i].visible = false; \n"),
                (b += u + H + "} \n\n");
            var ee = "showTab_" + a[s];
            (b += u + H + a[s] + "_nav.onChange = " + ee + "; \n\n"),
                (b += u + H + "function " + ee + "() { \n"),
                (b += u + _ + H + "if ( " + a[s] + "_nav.selection !== null ) { \n"),
                (b += u + _ + _ + H + "for (var i = " + a[s] + "_tabs.length-1; i >= 0; i--) { \n"),
                (b += u + _ + _ + _ + H + a[s] + "_tabs[i].visible = false; \n"),
                (b += u + _ + _ + H + "} \n"),
                (b += u + _ + _ + H + a[s] + "_tabs[" + a[s] + "_nav.selection.index].visible = true; \n"),
                (b += u + _ + H + "} \n"),
                (b += u + H + "} \n\n");
            var te = $('#dialog [data-item-id="' + s + '"] > .tab-container .tab.visible').index();
            (b += u + H + a[s] + "_nav.selection = " + te + "; \n"), (b += u + H + ee + "() \n\n");
        } else {
            var ae = q.hidden || $('[data-panel="treeview"] [data-item-id="' + X + '"]').closest(".sdb-hidden").length > 0 ? "// " : "";
            b += u + ae + a[s] + ".selection = " + a[X] + "; \n\n";
        }
    }
    return b;
}
function multilineCheck(e) {
    var t = !1,
        a = [],
        i = $('#dialog [data-item-id="' + e + '"]'),
        n = i.hasClass("sdb-hidden");
    n && i.removeClass("sdb-hidden");
    var s = i.parents(".sdb-hidden");
    s.length > 0 &&
        s.each(function () {
            $(this).removeClass("sdb-hidden");
        });
    var l = i.find(".text-container");
    l.find("br").replaceWith("<br>");
    var o = l.html();
    l.width(l.width());
    var r = o.replace(/<br>/g, " <br>").replace(/-/g, "- ").split(" ");
    return (
        l.html(""),
        $.each(r, function (e, i) {
            var n = l.height(),
                s = 0 === e ? "" : " ";
            l.html(l.html() + s + i), n < l.height() ? (a.push(i.replace("<br>", "")), (t = !0), a.splice(a.length - 1, 0, "<br>")) : a.push(s + i);
        }),
        l.width(""),
        l.html(o),
        n && i.addClass("sdb-hidden"),
        s.length > 0 &&
            s.each(function () {
                $(this).addClass("sdb-hidden");
            }),
        [
            t,
            a
                .join("")
                .replace(/- /g, "-")
                .replace(/&nbsp;/g, " "),
        ]
    );
}
function styleJSXitem(e, t, a, i, n, s, l, o, r, d, p, c, m) {
    var u = "";
    if (
        (l.enabled || (u += c + m + o + ".enabled = false; \n"),
        void 0 !== l.helpTip &&
            null !== l.helpTip &&
            l.helpTip.length > 0 &&
            (u += c + m + o + '.helpTip = "' + l.helpTip.replace(/(\s\\n\s|\\n\s|\s\\n|\\n)/g, "\\n").replace(/\"/g, "\\u0022") + '"; \n'),
        "TreeItem" === a)
    ) {
        var f = e.items["item-" + i].expanded,
            g = $('#dialog [data-item-id="' + i + '"]')
                .parentsUntil(".tree-view")
                .filter(".tree-view-item"),
            h = !1;
        $.each(g, function () {
            $(this).hasClass("expanded") || (h = !0);
        }),
            f && !1 === h && r.push(c + m + o + ".expanded = true; \n");
    } else if ("Divider" === a) u += c + m + o + '.alignment = "fill"; \n';
    else {
        if (
            ("Slider" === a
                ? ((u += c + m + o + ".minvalue = 0; \n"), (u += c + m + o + ".maxvalue = 100; \n"), (u += c + m + o + ".value = 50; \n"))
                : "Progressbar" === a && ((u += c + m + o + ".maxvalue = 100; \n"), (u += c + m + o + ".value = 50; \n")),
            "DropDownList" === a && void 0 !== l.selection && (u += c + m + o + ".selection = " + l.selection + "; \n"),
            "ListBox" === a && void 0 !== l.selection && l.selection.length > 0)
        )
            u += c + m + o + ".selection = " + (l.selection.length > 1 ? JSON.stringify(l.selection) : l.selection) + "; \n";
        "TabbedPanel" === a && (u += c + m + o + '.alignChildren = "fill"; \n');
        var v = !1;
        if ((void 0 !== l.text && l.text.length > 0 && ((v = !0), "StaticText" === a && d[0] && (v = !1), "DropDownList" === a && (v = !1)), v)) {
            var b = "EditText" === a && d[0] ? l.text.split("\n").join("\\r") : l.text;
            (b = b.replace(/\"/g, "\\u0022")),
                (u +=
                    c +
                    m +
                    (e.settings.afterEffectsDockable && "Dialog" === a ? "if ( !(panelGlobal instanceof Panel) ) " : "") +
                    o +
                    '.text = "' +
                    b +
                    '"; \n');
        }
        if ((!0 === l.checked && (u += c + m + o + ".value = " + l.checked + "; \n"), "TabbedPanel" === a && 0 === l.preferredSize[0]))
            u += c + m + o + ".preferredSize.width = " + $('#dialog [data-item-id="' + i + '"]').outerWidth() + "; \n";
        else if (void 0 !== l.preferredSize && "TreeView" !== a && ("StaticText" !== a || !d[0])) {
            var y = l.preferredSize[0],
                w = l.preferredSize[1];
            ("EditText" === a && d[0]) ||
                (y > 0 && (u += c + m + o + ".preferredSize.width = " + y + "; \n"),
                w > 0 && (u += c + m + o + ".preferredSize.height = " + w + "; \n"));
        }
        if (
            (("StaticText" === a && d[0]) ||
                ((("Button" === a && "center" !== l.justify) || ("StaticText" === a && !d[0] && "left" !== l.justify)) &&
                    (u += c + m + o + '.justify = "' + l.justify + '"; \n')),
            void 0 !== l.orientation && (u += c + m + o + '.orientation = "' + l.orientation + '"; \n'),
            void 0 !== l.alignChildren && (u += c + m + o + '.alignChildren = ["' + l.alignChildren[0] + '","' + l.alignChildren[1] + '"]; \n'),
            void 0 !== l.spacing && (u += c + m + o + ".spacing = " + l.spacing + "; \n"),
            void 0 !== l.margins && "TabbedPanel" !== a && "VerticalTabbedPanel" !== a)
        )
            u +=
                c +
                m +
                o +
                ".margins = " +
                ("object" == typeof l.margins ? "[" + l.margins[3] + "," + l.margins[0] + "," + l.margins[1] + "," + l.margins[2] + "]" : l.margins) +
                "; \n";
        else if ("Tab" === a && void 0 !== e.items["item-" + n].style.margins) {
            var x = e.items["item-" + n].style.margins;
            u += c + m + o + ".margins = " + ("object" == typeof x ? "[" + x[3] + "," + x[0] + "," + x[1] + "," + x[2] + "]" : x) + "; \n";
        } else "TabbedPanel" === a && (u += c + m + o + ".margins = 0; \n");
        if (null != l.alignment && !d[0]) {
            var C = e.items["item-" + n].style.orientation,
                S = "";
            S =
                "column" === C
                    ? ("top" === l.alignment ? "left" : "bottom" === l.alignment && "right") || l.alignment
                    : ("left" === l.alignment ? "top" : "right" === l.alignment && "bottom") || l.alignment;
            var k = e.items["item-" + n].style.alignChildren;
            u += c + m + o + ".alignment = " + (S = "column" === C ? '["' + S + '","' + k[1] + '"]' : '["' + k[0] + '","' + S + '"]') + "; \n";
        }
    }
    return u;
}
function resetDialog() {
    modal.init(
        '<div id="reset-box"><h2>删除 Dialog.jsx</h2><span class="text">这将会删除工程, <br /> 并且创建新的工程.</span><span class="yes" data-enter>删除</span><span class="no">取消</span></div>'
    );
    var e = $("#reset-box");
    e.find(".yes").on("click", function () {
        modal.remove(),
            setTimeout(function () {
                local_storage.remove("dialog"),
                    loadingScreen.init(null, function () {
                        location.reload();
                    });
            }, 300);
    }),
        e.find(".no").on("click", function () {
            modal.remove();
        });
}
function notification(e, t, a) {
    function i(e) {
        e.addClass("fadeOut"),
            setTimeout(function () {
                e.remove();
            }, 300);
    }
    var n = $(
            '<div class="notification ' +
                e +
                ' animated"><div>' +
                (function () {
                    var t = "";
                    switch (e) {
                        case "clipboard":
                            t = '<i class="fas fa-clipboard icon"></i>';
                            break;
                        default:
                            t = '<i class="fas fa-info-circle icon"></i>';
                    }
                    return t;
                })() +
                '<div class="msg">' +
                t +
                "<div></div></div>"
        ).appendTo("#notifications-wrap"),
        s = $("#notifications-wrap .notification").length;
    s >= 1 && i($("#notifications-wrap .notification").slice(0, s - 1));
    var l = n.height();
    n.css({ height: 0, visibility: "visible" }),
        n.animate({ height: l }, 300, "easeInOutBack"),
        $("#notifications-wrap .notification:last").addClass("last").prev().removeClass("last"),
        setTimeout(function () {
            i(n);
        }, 1e3 * a || 5e3);
}
function lineBreakIntercept(e) {
    var t = e.keyCode ? e.keyCode : e.which,
        a = $("#panel-tree-view-wrap .active").data("item-type"),
        i = item.list[a.toLowerCase()](!1).multiline;
    return !(13 === t && !i);
}
var local_storage = {
        set: function (e, t) {
            localStorage.setItem(e, JSON.stringify(t));
        },
        get: function (e) {
            return JSON.parse(localStorage.getItem(e));
        },
        remove: function (e) {
            localStorage.removeItem(e);
        },
    },
    reText = {
        tabs: " <br><br>You can nest VerticalTabbedPanels and TabbedPanels by inserting them inside a Tab item. <br><br>Visible tabs are selected on export (WYSIWYG).",
        images: "Image formats: <code>jpg, png</code><br><br> Images are never uploaded to any server, they are stored locally in your browser.<br><br> Resize images before adding them to the dialog.<br><br> I would recommend small icon sizes. Any number of images will bump up the script file size quite a bit so you should use minimal amount of images. <br><br><strong class='warning'><span>警告:</span> Photoshop CC 2015-219</strong> For some reason JPEG files don't work in some PS versions. PNG files seem to work fine.<br>",
    },
    item = { list: {} };
(item.list.dialog = function (e) {
    return {
        type: "Dialog",
        label: "对话框",
        parent: !0,
        addPanelIconClass: "fas fa-comment-alt",
        defaultStyle: {
            enabled: !0,
            varName: null,
            windowType: "Dialog",
            creationProps: {
                su1PanelCoordinates: !1,
                maximizeButton: !1,
                minimizeButton: !1,
                independent: !1,
                closeButton: !0,
                borderless: !1,
                resizeable: !1,
            },
            text: "Dialog",
            preferredSize: [0, 0],
            margins: 16,
            orientation: "column",
            spacing: 10,
            alignChildren: ["center", "top"],
        },
        previewHtml:
            '<div id="dialog-container" data-parent="true" data-parent="true" data-item-type="' +
            e.type +
            '" data-item-id="' +
            e.id +
            '" data-item-parent-id="' +
            e.parentId +
            '"><div id="dialog-title-bar"><div contenteditable="true">' +
            e.type +
            '</div></div><div class="padding-box"></div></div>',
    };
}),
    (item.list.group = function (e) {
        return {
            type: "Group",
            label: "分组",
            parent: !0,
            addPanelIconClass: "fas fa-object-group",
            defaultStyle: {
                enabled: !0,
                varName: null,
                preferredSize: [0, 0],
                margins: 0,
                orientation: "row",
                spacing: 10,
                alignChildren: ["left", "center"],
                alignment: null,
            },
            previewHtml:
                '<div class="group" data-parent="true" data-item-type="' +
                e.type +
                '" data-item-id="' +
                e.id +
                '" data-item-parent-id="' +
                e.parentId +
                '"><div class="padding-box"></div></div>',
        };
    }),
    (item.list.panel = function (e) {
        return {
            type: "Panel",
            label: "面板",
            parent: !0,
            addPanelDivider: "below",
            addPanelIconClass: "fas fa-columns",
            defaultStyle: {
                enabled: !0,
                varName: null,
                creationProps: { borderStyle: "etched", su1PanelCoordinates: !1 },
                text: "Panel",
                preferredSize: [0, 0],
                margins: 10,
                orientation: "column",
                spacing: 10,
                alignChildren: ["left", "top"],
                alignment: null,
            },
            previewHtml:
                '<div class="panel" data-parent="true" data-item-type="' +
                e.type +
                '" data-item-id="' +
                e.id +
                '" data-item-parent-id="' +
                e.parentId +
                '"><span class="title" contenteditable="true">' +
                e.type +
                '</span><div class="padding-box"></div></div>',
        };
    }),
    (item.list.statictext = function (e) {
        return {
            type: "StaticText",
            label: "静态文字",
            addPanelIconClass: "fas fa-font",
            multiline: !0,
            editInfo:
                "此项目支持多行文本。 <br><br>由于 ScriptUI 多行文本的问题，代码导出不会输出“true”多行。 <br><br>相反，多行 <code>statictext</code> 将被分割成多个 <code>statictext</code> 并放入一个 <code>group</code> 中。",
            defaultStyle: {
                enabled: !0,
                varName: null,
                creationProps: { truncate: "none", multiline: !1, scrolling: !1 },
                softWrap: !1,
                text: "StaticText",
                justify: "left",
                preferredSize: [0, 0],
                alignment: null,
                helpTip: null,
            },
            previewHtml:
                '<div class="static-text disable-soft-wrap" data-item-type="' +
                e.type +
                '" data-item-id="' +
                e.id +
                '" data-item-parent-id="' +
                e.parentId +
                '"><span class="text-container" contenteditable="true">' +
                e.type +
                "</span></div>",
        };
    }),
    (item.list.edittext = function (e) {
        return {
            type: "EditText",
            label: "可编辑文本",
            addPanelIconClass: "fas fa-i-cursor",
            multiline: !0,
            editInfo: "此项目支持多行文本。 <br><br>多行文本流可能与 ScriptUI 截然不同。",
            defaultStyle: {
                enabled: !0,
                varName: null,
                creationProps: { noecho: !1, readonly: !1, multiline: !1, scrollable: !1, borderless: !1, enterKeySignalsOnChange: !1 },
                softWrap: !1,
                text: "EditText",
                justify: "left",
                preferredSize: [0, 0],
                alignment: null,
                helpTip: null,
            },
            previewHtml:
                '<div class="edit-text disable-soft-wrap" data-item-type="' +
                e.type +
                '" data-item-id="' +
                e.id +
                '" data-item-parent-id="' +
                e.parentId +
                '"><span class="edit-text-inner-wrap"><span class="text-container edittext-text-cont" contenteditable="true">' +
                e.type +
                "</span></span></div>",
        };
    }),
    (item.list.button = function (e) {
        return {
            type: "Button",
            label: "按钮",
            addPanelIconClass: "fas fa-toggle-on",
            defaultStyle: { enabled: !0, varName: null, text: "Button", justify: "center", preferredSize: [0, 0], alignment: null, helpTip: null },
            previewHtml:
                '<div class="button" data-item-type="' +
                e.type +
                '" data-item-id="' +
                e.id +
                '" data-item-parent-id="' +
                e.parentId +
                '"><div class="button-border"><span class="text-container" contenteditable="true">' +
                e.type +
                "</span></div></div>",
        };
    }),
    (item.list.divider = function (e) {
        return {
            type: "Divider",
            label: "分割线",
            addPanelIconClass: "fas fa-strikethrough",
            defaultStyle: { enabled: !0, varName: null },
            stylePropInfo: "This item doesn't have any adjustable properties.",
            editInfo: "分隔线方向与父项方向一致",
            previewHtml:
                '<div class="panel divider-line" data-item-type="' +
                e.type +
                '" data-item-id="' +
                e.id +
                '" data-item-parent-id="' +
                e.parentId +
                '"><div class="padding-box"></div></div>',
        };
    }),
    (item.list.checkbox = function (e) {
        return {
            type: "Checkbox",
            label: "复选框",
            addPanelIconClass: "fas fa-check-square",
            editInfo: "你可以在对话框预览中选中该复选框。",
            defaultStyle: { enabled: !0, varName: null, text: "Checkbox", preferredSize: [0, 0], alignment: null, helpTip: null },
            previewHtml:
                '<div class="checkbox" data-item-type="' +
                e.type +
                '" data-item-id="' +
                e.id +
                '" data-item-parent-id="' +
                e.parentId +
                '"><div class="radiocheck checkbox">\n<svg class="font-awesome-check" enable-background="new 0 0 512 381.8" viewBox="0 0 512 381.8" xmlns="http://www.w3.org/2000/svg"><path d="m173.9 374.3-166.4-166.4c-10-10-10-26.2 0-36.2l36.2-36.2c10-10 26.2-10 36.2 0l112.1 112.1 240.1-240.1c10-10 26.2-10 36.2 0l36.2 36.2c10 10 10 26.2 0 36.2l-294.4 294.4c-10 10-26.2 10-36.2 0z" fill="#535353"/></svg>\n</div>\n<label contenteditable="true">' +
                e.type +
                "</label></div>",
        };
    }),
    (item.list.radiobutton = function (e) {
        return {
            type: "RadioButton",
            label: "单选按钮",
            addPanelIconClass: "fas fa-dot-circle",
            editInfo: "您可以在对话框预览中检查单选按钮。 <br><br> 如果单选按钮之间存在不同类型的项目，则单选按钮将分成不同的组。",
            defaultStyle: { enabled: !0, varName: null, text: "RadioButton", preferredSize: [0, 0], alignment: null, helpTip: null },
            previewHtml:
                '<div class="radiobutton" data-item-type="' +
                e.type +
                '" data-item-id="' +
                e.id +
                '" data-item-parent-id="' +
                e.parentId +
                '"><div class="radiocheck radiobutton">\n<svg class="font-awesome-circle" enable-background="new 0 0 496 496" viewBox="0 0 496 496" xmlns="http://www.w3.org/2000/svg"><path d="m248 0c-137 0-248 111-248 248s111 248 248 248 248-111 248-248-111-248-248-248z" fill="#535353"/></svg>\n</div>\n<label contenteditable="true">' +
                e.type +
                "</label></div>",
        };
    }),
    (item.list.dropdownlist = function (e) {
        return {
            type: "DropDownList",
            label: "下拉列表",
            addPanelIconClass: "fas fa-caret-square-down",
            editInfo: "您可以在对话框预览中选择一个下拉项。 <br><br>您可以通过添加一个单短划线字符的项目来制作分隔线：<code>-</code>。",
            defaultStyle: {
                enabled: !0,
                varName: null,
                text: "DropDownList",
                listItems: "Item 1, -, Item 2",
                preferredSize: [0, 0],
                alignment: null,
                selection: 0,
                helpTip: null,
            },
            previewHtml:
                '<div class="dropdownlist" data-item-type="' +
                e.type +
                '" data-item-id="' +
                e.id +
                '" data-item-parent-id="' +
                e.parentId +
                '"><div class="drop-list-wrap"><div class="items"><div class="selected">Item 1</div><div>-</div><div>Item 2</div></div><div class="arrow">\n<svg class="font-awesome-chevron-down" enable-background="new 0 0 436.7 265" viewBox="0 0 436.7 265" xmlns="http://www.w3.org/2000/svg"><path d="m201.4 258-194.4-194.4c-9.4-9.4-9.4-24.6 0-33.9l22.7-22.7c9.4-9.4 24.5-9.4 33.9 0l154.7 154 154.8-154c9.4-9.3 24.5-9.3 33.9 0l22.7 22.7c9.4 9.4 9.4 24.6 0 33.9l-194.4 194.4c-9.4 9.4-24.6 9.4-33.9 0z" fill="#d6d6d6"/></svg>\n</div></div></div>',
        };
    }),
    (item.list.slider = function (e) {
        return {
            type: "Slider",
            label: "滑块",
            addPanelIconClass: "fas fa-sliders-h",
            defaultStyle: { enabled: !0, varName: null, preferredSize: [0, 0], alignment: null, helpTip: null },
            stylePropInfo: "This item doesn't have any adjustable properties.",
            editInfo: "Export outputs a static range from 0 to 100 with current value of 50 every single time.",
            previewHtml:
                '<div class="slider" data-item-type="' +
                e.type +
                '" data-item-id="' +
                e.id +
                '" data-item-parent-id="' +
                e.parentId +
                '"><input type="range" min="0" max="100" value="" /></div>',
        };
    }),
    (item.list.listbox = function (e) {
        return {
            type: "ListBox",
            label: "列表框",
            addPanelIconClass: "fas fa-list-alt",
            editInfo: "您可以在对话框预览中选择项目。 <br><br> 如果您选择多个项目，<code>multiline</code> 属性将在导出时添加。",
            defaultStyle: {
                enabled: !0,
                varName: null,
                creationProps: { multiselect: !1, numberOfColumns: 1, columnWidths: "[]", columnTitles: "[]", showHeaders: !1 },
                listItems: "Item 1, Item 2",
                preferredSize: [0, 0],
                alignment: null,
                helpTip: null,
            },
            previewHtml:
                '<div class="list-box" data-item-type="' +
                e.type +
                '" data-item-id="' +
                e.id +
                '" data-item-parent-id="' +
                e.parentId +
                '"><div class="inner-wrap"><ul><li><span>项目 1</span></li><li><span>项目 2</span></li></ul></div></div>',
        };
    }),
    (item.list.image = function (e) {
        return {
            type: "Image",
            label: "图片",
            addPanelIconClass: "fas fa-image",
            editInfo: reText.images,
            defaultStyle: {
                enabled: !0,
                varName: null,
                image: [
                    "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB4AAAAeCAYAAAA7MK6iAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAQdJREFUeNrslv0NgyAQxcV0AEZwBEdoN3AEu0E7iSN0hW6gG9gRuoFuQB8NtGg9QSL4R33JixcUf3zcEZiAkg2UJhvpYMRX+BGYl8PVOxJfHV164rsc5j5UydCwdEGnAu4QtnCH+OY7AOcZ410moeJXVegZFzAn2jfJah4afF/Yvg6YMfbE4wz3RnOjSjBcchnfcpUgWbRyUjPv4UatgDmYWtZ3tORSdVzDcrUWwVPLjyu4tEBzI8Pd4dQeq5NJq5zY61ZMq6Pg5h5PgkfQAdwCnYXPggmo1sUBSsJJsAXqowGcArcijD5wE8wiXX3kiXfSmR/z6jMuvYT93WVvB+/gHbyaXgIMAHWCmD3KjfSwAAAAAElFTkSuQmCC",
                ],
                alignment: null,
                helpTip: null,
            },
            previewHtml:
                '<div class="image-item" data-item-type="' +
                e.type +
                '" data-item-id="' +
                e.id +
                '" data-item-parent-id="' +
                e.parentId +
                '"><img src="" alt="" /></div>',
        };
    }),
    (item.list.iconbutton = function (e) {
        return {
            type: "IconButton",
            label: "图标按钮",
            addPanelIconClass: "fas fa-times-circle",
            editInfo: reText.images,
            defaultStyle: {
                enabled: !0,
                varName: null,
                text: "IconButton",
                preferredSize: [0, 0],
                creationProps: { style: "toolbutton", toggle: !1 },
                iconButtonStroke: !1,
                image: [
                    "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABIAAAASCAYAAABWzo5XAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyhpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNi1jMTQ1IDc5LjE2MzQ5OSwgMjAxOC8wOC8xMy0xNjo0MDoyMiAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTkgKE1hY2ludG9zaCkiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6NjAwRDg1RUYzRkFBMTFFOTk3MzFGMDEyRjUzNjA4NTMiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6NjAwRDg1RjAzRkFBMTFFOTk3MzFGMDEyRjUzNjA4NTMiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDo2MDBEODVFRDNGQUExMUU5OTczMUYwMTJGNTM2MDg1MyIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDo2MDBEODVFRTNGQUExMUU5OTczMUYwMTJGNTM2MDg1MyIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/PhJ5d1kAAAIwSURBVHjarJQ9S1tRGMefnHvJktxC5TZxCVTikKUWYjpUY7+AFFpw76QObhbrN2h0qEPdmqlUnDqUFjcdNNS5taGTYjAmaBrsNYaCIUn7/1/OCZcQh4IP/OCc87zc87ycG5qbn5cB4oARMAqG9NkFOATH4Krfwe7b3wEPwTSYAck+/RH4CLbAd9AYFOgueApWbdsenpyYkAdjY3LPdX3lr3pdfhwcJL/u7y+32+0XOFoGX8Bv6kM6Nd7kGXifSCRkbnZWYrHYoJSlVqvJu3xeyuUytwz4iTdTWs90Vhnk1dLSjUEo1NGGtvTRvqJ0YaeZDm8SDod7X64jHSNcn+OMQhva0kfX01G6OzOsibkJg7zO5SS3siLVatWH6xzOTDDa0kc3ZcTWLU6ysEaUUmJZljSbTXmztuafcR2NRsVSqmdHn929PXZ2VJk5Md2huFi/XFz0HRGgRLjmmRuwC/gMKbklUXpi/TkJFpYp6XTuE5NmsAEBnwulx/4Iw9Yz6Ha70ul0xKRj0uRZBzoj2ofTfmiNZzJ/WJZKpZJ9lMlIJBLxSafT8mRqSuLxuDiOI+PYT2azEg909sPGBj+ax/az0g9wC2N/xolttVq99rp9DTBBaENb+uh3d8UbUeeB00aj8bxYLEoqlfJvddMTebu+bp7IAtgF1ybQNTgBPxHscaFQiF56iB0KyV/UhIU+LpVkZ3vbT8fzvDMdhI/2Mvhob/U3IlpRAN/A5v/82P4JMAC5N/hnHN2zDwAAAABJRU5ErkJggg==",
                ],
                alignment: null,
                helpTip: null,
            },
            previewHtml:
                '<div class="icon-button" data-item-type="' +
                e.type +
                '" data-item-id="' +
                e.id +
                '" data-item-parent-id="' +
                e.parentId +
                '"><div class="inner-wrap"><span class="text-container" contenteditable="true">' +
                e.type +
                '</span><img src="" alt="" /></div></div>',
        };
    }),
    (item.list.progressbar = function (e) {
        return {
            type: "Progressbar",
            label: "进度条",
            addPanelIconClass: "fas fa-percentage",
            defaultStyle: { enabled: !0, varName: null, preferredSize: [50, 4], alignment: null, helpTip: null },
            stylePropInfo: "This item doesn't have any adjustable properties.",
            editInfo: "输出一个静态值。",
            previewHtml:
                '<div class="progress-bar" data-item-type="' +
                e.type +
                '" data-item-id="' +
                e.id +
                '" data-item-parent-id="' +
                e.parentId +
                '"><div><div class="progress-indicator"></div></div></div>',
        };
    }),
    (item.list.verticaltabbedpanel = function (e) {
        return {
            type: "VerticalTabbedPanel",
            label: "垂直标签面板",
            parent: !0,
            addPanelDivider: "above",
            addPanelIconClass: "fas fa-bars",
            editInfo: '<strong>Valid child item:</strong> <br><i class="far fa-folder"></i> Tab.' + reText.tabs,
            defaultStyle: { enabled: !0, varName: null, preferredSize: [0, 0], tabNavWidth: 0, margins: 0, alignment: null },
            previewHtml:
                '<div class="group vertical-tabbed-panel orientation-row align-children-horizontal-left align-children-vertical-top" data-parent="true" data-item-type="' +
                e.type +
                '" data-item-id="' +
                e.id +
                '" data-item-parent-id="' +
                e.parentId +
                '"><div class="tab-container"><div class="inner-wrap"><ul></ul></div></div><div class="padding-box"></div></div>',
        };
    }),
    (item.list.tabbedpanel = function (e) {
        return {
            type: "TabbedPanel",
            label: "选项卡面板",
            parent: !0,
            addPanelIconClass: "fas fa-folder",
            editInfo: '<strong>Valid child item:</strong> <br><i class="far fa-folder"></i> Tab.' + reText.tabs,
            defaultStyle: { enabled: !0, varName: null, preferredSize: [0, 0], margins: 10, alignment: null },
            previewHtml:
                '<div class="panel tabbed-panel" data-parent="true" data-item-type="' +
                e.type +
                '" data-item-id="' +
                e.id +
                '" data-item-parent-id="' +
                e.parentId +
                '"><div class="tab-container"></div><div class="padding-box"></div></div>',
        };
    }),
    (item.list.tab = function (e) {
        return {
            type: "Tab",
            type: "Tab",
            parent: !0,
            addPanelDivider: "below",
            addPanelIconClass: "far fa-folder",
            editInfo:
                "Can be placed inside: <br><i class='fas fa-folder'></i> TabbedPanel, <br><i class='fas fa-bars'></i> VerticalTabbedPanel" +
                reText.tabs,
            defaultStyle: { enabled: !0, varName: null, text: "Tab", orientation: "column", spacing: 10, alignChildren: ["left", "top"] },
            previewHtml:
                '<div class="panel tab" data-parent="true" data-item-type="' +
                e.type +
                '" data-item-id="' +
                e.id +
                '" data-item-parent-id="' +
                e.parentId +
                '"><div class="padding-box"></div></div>',
        };
    }),
    (item.list.treeview = function (e) {
        return {
            type: "TreeView",
            label: "树状视图",
            parent: !0,
            addPanelIconClass: "fas fa-tree",
            editInfo: '<strong>Valid child item:</strong> <br> <i class="fas fa-leaf"></i> TreeItem.',
            defaultStyle: { enabled: !0, varName: null, preferredSize: [0, 0], alignment: null },
            previewHtml:
                '<div class="panel tree-view" data-parent="true" data-item-type="' +
                e.type +
                '" data-item-id="' +
                e.id +
                '" data-item-parent-id="' +
                e.parentId +
                '"><div class="padding-box"></div></div>',
        };
    }),
    (item.list.treeitem = function (e) {
        return {
            type: "TreeItem",
            label: "树状子项",
            parent: !0,
            addPanelDivider: "below",
            addPanelIconClass: "fas fa-leaf",
            editInfo:
                '<strong>Valid child item:</strong> <br> <i class="fas fa-leaf"></i> TreeItem. <br><br>You can expand or collapse these items in the dialog preview by clicking the arrows. <br><br> This item doesn&apos;t have creation properties, so unfortunately the variable name can&apos;t be used to find this item in the dialog object.',
            defaultStyle: { enabled: !0, varName: null, text: "TreeItem" },
            previewHtml:
                '<div class="tree-view-item" data-parent="true" data-item-type="' +
                e.type +
                '" data-item-id="' +
                e.id +
                '" data-item-parent-id="' +
                e.parentId +
                '"><div class="item-wrap">\n<span class="tree-view-arrow">\n<svg class="font-awesome-chevron-right" enable-background="new 0 0 265 436.7" viewBox="0 0 265 436.7" xmlns="http://www.w3.org/2000/svg"><path d="m258 235.3-194.4 194.4c-9.4 9.4-24.6 9.4-33.9 0l-22.7-22.7c-9.4-9.4-9.4-24.5 0-33.9l154-154.7-154-154.8c-9.3-9.4-9.3-24.5 0-33.9l22.7-22.7c9.4-9.4 24.6-9.4 33.9 0l194.4 194.4c9.4 9.3 9.4 24.5 0 33.9z" fill="#dadada"/></svg>\n</span>\n<span class="text-container" contenteditable="true">' +
                e.type +
                '</span>\n</div><div class="padding-box"></div></div>',
        };
    }),
    (item.funnel = {
        create: function (e) {
            ((e = tab.preCreate(e)).style = item.create.localStorage(e)),
                item.create.treeView(e),
                item.update.order(),
                item.create.dialogPreview(e),
                item.activate(e.id),
                tab.onCreate(e);
            item.funnel.update("all", "localStorage"),
                "loadFromLocalStorage" === e.event || edit_style_panel.build(e.style),
                "TabbedPanel" === e.type && tabbedPanel.onCreate(e.event),
                "VerticalTabbedPanel" === e.type && verticalTabbedPanel.onCreate(e.event),
                "TreeView" === e.type && treeView.onCreate(e.event),
                hideItem.onCreate(e.id),
                $("#dialog-section").backstretch("resize");
        },
        remove: function (e) {
            var t = $('#panel-tree-view-wrap [data-item-id="' + e + '"]'),
                a = t.prev(),
                i = t.next(),
                n = t.parent("ul").parent("li"),
                s = t.data("item-type");
            item.remove.treeView(e), item.remove.dialogPreview(e, s), item.remove.localStorage();
            var l = local_storage.get("dialog");
            item.update.style.treeViewAll(l),
                $("#panel-tree-view-wrap .active").length < 1 &&
                    ((e = (i.length > 0 && i.data("item-id")) || (a.length > 0 && a.data("item-id")) || n.data("item-id")),
                    item.activate(e),
                    edit_style_panel.build(l.items["item-" + e].style)),
                setTimeout(function () {
                    $("#dialog-section").backstretch("resize");
                }, 1);
        },
        update: function (e, t) {
            var a = local_storage.get("dialog"),
                i = (a = "localStorage" === t ? a : item.update.style.localStorage(e, a)).items["item-" + a.activeId];
            item.update.style.treeView(e, a, i),
                item.update.style.treeViewAll(a),
                "dialog" !== t && item.update.style.dialogPreview(e, a, i),
                treeViewItem.onUpdate(a, i),
                forceSize.onUpdate(e, a, i),
                setTimeout(function () {
                    $("#dialog-section").backstretch("resize");
                }, 10);
        },
        sort: function (e, t, a, i, n) {
            item.sort.dialogPreview(e, t, a, i, n), item.sort.localStorage(e, t), $("#dialog-section").backstretch("resize");
        },
    }),
    (item.create = {
        localStorage: function (e) {
            var t = local_storage.get("dialog"),
                a = (t = null === t ? {} : t).hasOwnProperty("items"),
                i = "item-" + e.id,
                n = !1;
            if ((a && (n = t.items.hasOwnProperty(i)), (t.activeId = e.id), !n)) {
                void 0 === t.items && (t.items = {}), void 0 === t.items[i] && (t.items[i] = {});
                var s = t.items[i];
                (s.id = e.id),
                    (s.type = e.type),
                    (s.parentId = e.parentId),
                    e.sourceId
                        ? (s.style = $.extend(!0, {}, t.items["item-" + e.sourceId].style))
                        : (s.style = e.defaultStyle || item.list[e.type.toLowerCase()](e).defaultStyle);
            }
            var l = ["varName", "helpTip", "softWrap", "typeName", "windowType", "creationProps", "enabled"];
            "EditText" === e.type ? l.push("justify") : "IconButton" === e.type && l.push("text");
            var o = item.list[e.type.toLowerCase()](!1).defaultStyle;
            return (
                $.each(l, function (a, i) {
                    !(function (a) {
                        var i = t.items["item-" + e.id];
                        void 0 === o[a] && void 0 !== i.style[a] && delete i.style[a],
                            void 0 !== o[a] && void 0 === i.style[a] && (i.style[a] = o[a]);
                    })(i);
                }),
                local_storage.set("dialog", t),
                t.items["item-" + e.id].style
            );
        },
        treeView: function (e) {
            var t = item.list[e.type.toLowerCase()](!1).parent ? 'data-parent="true"' : "",
                a = $(
                    "<li " +
                        t +
                        ' data-item-id="' +
                        e.id +
                        '" data-item-parent-id="' +
                        e.parentId +
                        '" data-item-type="' +
                        e.type +
                        '" class="' +
                        e.type.toLowerCase() +
                        '"><span class="remove-item"><i class="fas fa-times"></i></span><span class="item-text">' +
                        e.type +
                        "</span></li>"
                );
            "Dialog" === e.type && (a = $('<ul class="tree-dialog">' + a.prop("outerHTML") + "</ul>")).find("> li").addClass("tree-root");
            var i = e.type.toLowerCase();
            item.list[i](!1).parent && $("<ul></ul>").insertAfter(a.find(".item-text")),
                (t = (e.target.is("ul") ? e.target.parent("li") : e.target).data("parent"));
            var n,
                s = e.event.match(/^drag/);
            (n = t ? (s ? (e.previousIsParent ? "insertAfter" : "prependTo") : "appendTo") : "insertAfter"), $(a)[n](e.target);
        },
        dialogPreview: function (e) {
            var t,
                a,
                i = item.list[e.type.toLowerCase()](e).previewHtml,
                n = e.target.is("ul") ? e.target.parent("li") : e.target,
                s = n.data("parent"),
                l = n.data("item-id"),
                o = $("#dialog"),
                r = o.find('[data-item-id="' + l + '"]'),
                d = e.event.match(/^drag/);
            s
                ? ((t = d ? (e.previousIsParent ? "insertAfter" : "prependTo") : "appendTo"),
                  (a = "Dialog" === e.type ? o : d && e.previousIsParent ? r : r.find("> .padding-box")))
                : ((t = "insertAfter"), (a = o.find('[data-item-id="' + l + '"]'))),
                $(i)[t](a);
            var p = $('#dialog [data-item-id="' + e.id + '"]');
            "DropDownList" === e.type
                ? droplist.init(p, e.id)
                : "RadioButton" === e.type || "Checkbox" === e.type
                ? radiocheck.init(p, e.id, e.type)
                : "ListBox" === e.type && listbox.init(p, e.id);
        },
    }),
    (item.get = {}),
    (item.get.order = function () {
        var e = [];
        return (
            $("#panel-tree-view-wrap .contents [data-item-id]").each(function () {
                var t = $(this).data("item-id");
                e.push(t);
            }),
            e
        );
    }),
    (item.get.id = function () {
        var e = item.get.order();
        return Math.max.apply(null, e) + 1;
    }),
    (item.activate = function (e, t) {
        var a = local_storage.get("dialog");
        (a.activeId = e), local_storage.set("dialog", a);
        var i = $("#panel-tree-view-wrap"),
            n = i.find(".active");
        n.removeClass("active");
        var s = i.find('[data-item-id="' + e + '"]');
        s.addClass("active");
        var l = $("#dialog");
        l.find(".active").removeClass("active"),
            l.find('[data-item-id="' + e + '"]').addClass("active"),
            tab.onActivate(e),
            "dialog-preview" === t && structurePanelScroll(e, n),
            breadCrumbs(i, s),
            lightThePath(i, s);
    }),
    (item.remove = {
        localStorage: function () {
            var e = local_storage.get("dialog");
            (e.order = (function () {
                var e = [];
                return (
                    $("#tree-view-contents [data-item-id]").each(function () {
                        e.push($(this).data("item-id"));
                    }),
                    e
                );
            })()),
                $.each(
                    (function (e) {
                        var t = [];
                        return (
                            $.each(e.items, function (e, a) {
                                t.push(a.id);
                            }),
                            t
                        );
                    })(e),
                    function (t, a) {
                        $.inArray(a, e.order) < 0 && delete e.items["item-" + a];
                    }
                ),
                local_storage.set("dialog", e);
        },
        treeView: function (e) {
            $("#panel-tree-view-wrap")
                .find('[data-item-id="' + e + '"]')
                .remove();
        },
        dialogPreview: function (e, t) {
            tab.onRemove(e, t);
            var a = $("#dialog");
            a.find('[data-item-id="' + e + '"]').length > 0 && a.find('[data-item-id="' + e + '"]').remove();
        },
    }),
    (item.sort = {
        localStorage: function (e, t) {
            var a,
                i = local_storage.get("dialog");
            (i.order =
                ((a = []),
                $("#tree-view-contents [data-item-id]").each(function () {
                    var e = $(this).data("item-id");
                    a.push(e);
                }),
                a)),
                (i.items["item-" + e].parentId = t),
                local_storage.set("dialog", i);
        },
        dialogPreview: function (e, t, a, i, n) {
            var s = $("#dialog"),
                l = s.find('[data-item-id="' + e + '"]'),
                o = s.find('[data-item-id="' + n + '"]'),
                r = "insertAfter" === i ? o : o.find("> .padding-box");
            if ((l[i](r), "RadioButton" === a)) {
                var d = l.find(".radiobutton"),
                    p = d.hasClass("on"),
                    c = 0,
                    m = ':not([data-item-type="RadioButton"],.spacing)';
                if (
                    (l
                        .nextUntil(m)
                        .add(l.prevUntil(m))
                        .each(function () {
                            $(this).find(".radiobutton").hasClass("on") && ++c;
                        }),
                    c > 0 && p)
                ) {
                    d.removeClass("on");
                    var u = local_storage.get("dialog");
                    (u.items["item-" + e].style.checked = !1), local_storage.set("dialog", u);
                }
            }
        },
    }),
    (item.update = {}),
    (item.update.style = {}),
    (item.update.style.localStorage = function (e, t) {
        var a = item.update.get_values(t.items["item-" + t.activeId], e);
        return (
            $("#panel-edit-style-wrap")
                .find('[data-edit^="' + e + '"]')
                .closest(".creation-props-inner-wrap").length > 0
                ? (t.items["item-" + t.activeId].style.creationProps[e] = a[e])
                : (t.items["item-" + t.activeId].style[e] = a[e]),
            local_storage.set("dialog", t),
            t
        );
    }),
    (item.update.style.treeView = function (e, t, a) {
        if ("varName" === e || "text" === e || "all" === e) {
            var i = a.style.text,
                n = $('#panel-tree-view-wrap [data-item-id="' + a.id + '"] > .item-text'),
                s = a.type,
                l = void 0 === i ? s : i.trim();
            customVar.init();
            var o = customVar.names[a.id];
            if (o) {
                var r = o.toLowerCase();
                o || (r = r.replace(/\d+$/, "")),
                    n.html(
                        r === l.toLowerCase()
                            ? o
                            : '<span class="type">' + o + (i ? ":" : "") + "</span> " + (i ? '<span class="txt">' + i + "</span>" : "")
                    );
            } else n.html(s.toLowerCase() === l.toLowerCase() ? s : '<span class="type">' + s + ':</span> <span class="txt">' + i + "</span>");
        }
    }),
    (item.update.style.treeViewAll = function (e) {
        $.each(e.order, function (t, a) {
            item.update.style.treeView("varName", e, e.items["item-" + a]);
        });
    }),
    (item.update.style.dialogPreview = function (e, t, a, i) {
        var n = { property: e, value: a.style[e], data: t, dataItem: a, event: i };
        "all" === e
            ? $.each(a.style, function (e, t) {
                  (n.property = e), (n.value = t), item.update.set_values(n);
              })
            : item.update.set_values(n);
    }),
    (item.update.order = function () {
        var e = local_storage.get("dialog");
        (e.order = item.get.order()), local_storage.set("dialog", e);
    }),
    (item.update.get_values = function (e, t) {
        var a = {},
            i = $("#panel-edit-style-wrap"),
            n = i.find('[data-edit^="' + t + '"]');
        switch (t) {
            case "softWrap":
                a.softWrap = n.prop("checked");
                break;
            case "justify":
                a.justify = i.find('[data-edit^="justify"].active').data("value");
                break;
            case "typeName":
            case "windowType":
            case "orientation":
                a[t] = n.find("option:selected").val();
                break;
            case "margins":
                if (i.find(".n-3-4.hidden").length > 0) a.margins = parseInt(i.find(".margin-inputs .top").val(), 10);
                else {
                    var s = [];
                    i.find('[data-edit="margins"]').each(function () {
                        s.push(parseInt($(this).val(), 10));
                    }),
                        (a.margins = s);
                }
                break;
            case "preferredSize":
                var l = parseInt(i.find("input.width").val(), 10),
                    o = parseInt(i.find("input.height").val(), 10);
                a.preferredSize = [l, o];
                break;
            case "tabNavWidth":
                a.tabNavWidth = parseInt(i.find("input.tabNavWidth").val(), 10);
                break;
            case "spacing":
                a.spacing = parseInt(n.val(), 10);
                break;
            case "alignChildren":
                var r = i.find('#align-children-horizontal[data-edit="alignChildren"] option:selected').val(),
                    d = i.find('#align-children-vertical[data-edit="alignChildren"] option:selected').val();
                a.alignChildren = [r, d];
                break;
            case "image":
                a.image = [i.find(".base64-bin").attr("src")];
                break;
            case "alignment":
                !1 === n.prop("disabled") ? (a.alignment = n.find("option:selected").val()) : (a.alignment = null);
                break;
            default:
                "checkbox" === n.attr("type") ? (a[t] = n.prop("checked")) : (a[t] = n.val());
        }
        return a;
    }),
    (item.update.set_values = function (e) {
        var t = e.value,
            a = e.dataItem.type,
            i = e.dataItem.style,
            n = e.dataItem.id,
            s = $("#dialog .active"),
            l = s.find("> .padding-box");
        switch (e.property) {
            case "text":
                if ("Dialog" === a) s.find("#dialog-title-bar div").text(t);
                else if ("Panel" === a) {
                    var o = s.find("> .title");
                    o.text(t), l.css({ minWidth: o.width() + 22 });
                } else if ("DropDownList" === a);
                else if (s.find("> label").length > 0) s.find("label").text(t);
                else if ("Tab" === a) {
                    var r = s.parent().parent(),
                        d = r.data("item-type"),
                        p = r.find('> .tab-container [data-tab-id="' + n + '"]');
                    "TabbedPanel" === d ? p.text(t) : "VerticalTabbedPanel" === d && p.find("span").text(t);
                } else if ("TreeItem" === a) s.find("> .item-wrap .text-container").text(t);
                else if (item.list[a.toLowerCase()](!1).multiline) {
                    s.find(".text-container").html(t.split("\n").join("<br>"));
                } else s.find(".text-container").html(t);
                break;
            case "listItems":
                "DropDownList" === a ? droplist.set.items(s, t, i) : "ListBox" === a && listbox.set(s, t, i);
                break;
            case "checked":
                !0 === t && s.find("input").prop("checked", !0);
                break;
            case "justify":
                s.removeClass(function (e, t) {
                    return (t.match(/(^|\s)justify-\S+/g) || []).join(" ");
                }).addClass("justify-" + e.value);
                break;
            case "margins":
                var c = t[0],
                    m = t[1],
                    u = t[2],
                    f = t[3],
                    g = "object" != typeof t,
                    h = g ? t : c,
                    v = g ? t : m,
                    b = g ? t : u,
                    y = g ? t : f;
                "Dialog" === a
                    ? l.css({ paddingTop: h <= 6 ? 1 : h, paddingRight: v <= 1 ? 1 : v, paddingBottom: b <= 1 ? 1 : b, paddingLeft: y <= 1 ? 1 : y })
                    : "Panel" === a
                    ? l.css({ paddingTop: h <= 3 ? 3 : h, paddingRight: v <= 3 ? 3 : v, paddingBottom: b <= 1 ? 1 : b, paddingLeft: y <= 3 ? 3 : y })
                    : "TabbedPanel" === a || "VerticalTabbedPanel" === a
                    ? tabbedPanel.set.margins(h, v, b, y, n, l)
                    : l.css({ paddingTop: h, paddingRight: v, paddingBottom: b, paddingLeft: y });
                break;
            case "preferredSize":
                var w = 0 == t[0] ? "auto" : t[0],
                    x = 0 == t[1] ? "auto" : t[1] + ("Dialog" === a ? $("#dialog-title-bar").outerHeight() : 0);
                s.css({ minWidth: w, minHeight: x }),
                    item.list[a.toLowerCase()](!1).parent &&
                        (s.find("> .soft-wrap-guard").remove(),
                        t[0] > 0 &&
                            $(
                                '<style class="soft-wrap-guard"> \n#dialog [data-item-id="' +
                                    n +
                                    '"] .edit-text, \n#dialog [data-item-id="' +
                                    n +
                                    '"] .static-text {max-width: ' +
                                    t[0] +
                                    'px;}\n#dialog [data-item-id="' +
                                    n +
                                    '"] .edit-text.disable-soft-wrap, \n#dialog [data-item-id="' +
                                    n +
                                    '"] .static-text.disable-soft-wrap {max-width: none;}\n</style>'
                            ).prependTo(s)),
                    dangerZone.set(e, s),
                    droplist.set.size(s, t, i, a, w, x);
                break;
            case "tabNavWidth":
                var C = s.find(".tab-container");
                C.css({ minWidth: 0 == t ? "auto" : t }), dangerZone.set(e, C, ".number.tabNavWidth");
                break;
            case "orientation":
                s.removeClass(function (e, t) {
                    return (t.match(/(^|\s)orientation-\S+/g) || []).join(" ");
                }).addClass("orientation-" + t);
                break;
            case "spacing":
                s.find("> style.spacing").remove();
                var S = 0,
                    k = e.data.items["item-" + n].parentId;
                if (!1 !== k) "row" === e.data.items["item-" + k].style.orientation && (S = 2);
                (t += S),
                    $(
                        '<style class="spacing">#dialog [data-item-id="' +
                            s.data("item-id") +
                            '"].orientation-row ' +
                            '> .padding-box > div:not(.sdb-hidden) {padding-left: 0px;}\n#dialog [data-item-id="' +
                            s.data("item-id") +
                            '"].orientation-row ' +
                            "> .padding-box > div:not(.sdb-hidden) ~ div:not(.sdb-hidden) {padding-left: " +
                            t +
                            'px;}\n#dialog [data-item-id="' +
                            s.data("item-id") +
                            '"].orientation-column ' +
                            '> .padding-box > div:not(.sdb-hidden) {padding-top: 0px;}#dialog [data-item-id="' +
                            s.data("item-id") +
                            '"].orientation-column ' +
                            "> .padding-box > div:not(.sdb-hidden) ~ div:not(.sdb-hidden) {padding-top: " +
                            t +
                            "px;}\n</style>"
                    ).appendTo(s);
                break;
            case "alignChildren":
                s.removeClass(function (e, t) {
                    return (t.match(/(^|\s)align-children-\S+/g) || []).join(" ");
                }),
                    s.addClass("align-children-horizontal-" + t[0]),
                    s.addClass("align-children-vertical-" + t[1]);
                break;
            case "image":
                s.find("img").attr("src", t[0]);
                break;
            case "alignment":
                if (
                    (s.removeClass(function (e, t) {
                        return (t.match(/(^|\s)alignment-\S+/g) || []).join(" ");
                    }),
                    null !== t)
                ) {
                    var I = ("left" === t && ["left", "top"]) ||
                        ("top" === t && ["left", "top"]) ||
                        ("right" === t && ["right", "bottom"]) ||
                        ("bottom" === t && ["right", "bottom"]) || [t, t];
                    s.addClass("alignment-horizontal-" + I[0]), s.addClass("alignment-vertical-" + I[1]);
                }
                break;
            case "helpTip":
                null != t && s.attr("title", t.replace(/(\s\\n\s|\\n\s|\s\\n|\\n)/g, "\n"));
                break;
            case "softWrap":
                if (null != t) s[t ? "removeClass" : "addClass"]("disable-soft-wrap");
                break;
            case "varName":
                var A = "string" == typeof t ? t.toLowerCase() : t;
                "Button" === a &&
                    ("ok" === A ? s.addClass("default-button") : "ok" !== A && s.hasClass("default-button") && s.removeClass("default-button"));
                break;
            case "enabled":
                s[t ? "removeClass" : "addClass"]("disable-item");
                break;
        }
    });
var tabbedPanel = {
        onCreate: function (e) {
            if ("loadFromLocalStorage" !== e && "drag-duplicate" !== e) {
                var t = $("#panel-tree-view-wrap"),
                    a = t.find(".active"),
                    i = a.data("item-id"),
                    n = { id: item.get.id(), type: "Tab", parentId: a.data("item-id"), target: a.find("> ul"), event: "parent-propagation" };
                item.funnel.create(n);
                var s = t.find(".active").data("item-id");
                item.activate(i), (n.id = item.get.id()), item.funnel.create(n), item.activate(s);
            }
            var l = $("#panel-new-item-wrap .tab");
            l.hasClass("show") || l.addClass("show");
        },
        set: {
            margins: function (e, t, a, i, n, s) {
                s.find("> .margins").remove(),
                    $(
                        '<style class="margins">#dialog [data-item-id="' +
                            n +
                            '"] > .padding-box > .tab > .padding-box {padding: ' +
                            (e <= 3 ? 3 : e) +
                            "px " +
                            (t <= 3 ? 3 : t) +
                            "px " +
                            (a <= 1 ? 1 : a) +
                            "px " +
                            (i <= 3 ? 3 : i) +
                            "px;}\n</style>"
                    ).prependTo(s);
            },
        },
    },
    verticalTabbedPanel = {
        onCreate: function (e) {
            if ("loadFromLocalStorage" !== e && "drag-duplicate" !== e) {
                var t = $("#panel-tree-view-wrap"),
                    a = t.find(".active"),
                    i = a.data("item-id"),
                    n = { id: item.get.id(), type: "Tab", parentId: a.data("item-id"), target: a.find("> ul"), event: "parent-propagation" };
                item.funnel.create(n);
                var s = t.find(".active").data("item-id");
                item.activate(i), (n.id = item.get.id()), item.funnel.create(n), item.activate(s);
            }
            var l = $("#panel-new-item-wrap .tab");
            l.hasClass("show") || l.addClass("show");
        },
    },
    tab = {
        preCreate: function (e) {
            if ("Tab" === e.type && "VerticalTabbedPanel" === $('[data-panel="treeview"] [data-item-id="' + e.parentId + '"]').data("item-type")) {
                var t = item.list.tab(!1).defaultStyle;
                (t.alignChildren = ["fill", "top"]), (e.defaultStyle = t);
            }
            return e;
        },
        onCreate: function (e) {
            if ("Tab" === e.type) {
                var t = $('#dialog [data-item-id="' + e.parentId + '"]');
                if ("TabbedPanel" === t.data("item-type")) {
                    var a = t.find("> .tab-container");
                    $('<div class="tab" data-tab-id="' + e.id + '" contenteditable>' + e.style.text + "</div>").appendTo(a),
                        tab.containerSort(t.find("> .padding-box > .tab"), a);
                } else {
                    var i = t.find("> .tab-container > .inner-wrap > ul");
                    $('<li class="tab" data-tab-id="' + e.id + '"><span contenteditable>' + e.style.text + "</span></li>").appendTo(i),
                        tab.containerSort(t.find("> .padding-box > .tab"), i);
                }
                item.activate(e.id, "dialog-preview");
                var n = local_storage.get("dialog");
                edit_style_panel.build(n.items["item-" + e.id].style);
            }
        },
        onDragValid: function (e, t) {
            var a = t.target.parent("li"),
                i = e.hasClass("tab"),
                n = a.hasClass("tabbedpanel"),
                s = a.hasClass("verticaltabbedpanel");
            return (i && !n && !s) || (!i && (n || s));
        },
        onClick: function (e, t) {
            var a = t.data("item-type"),
                i = e.hasClass("tab"),
                n = "TabbedPanel" === a,
                s = "VerticalTabbedPanel" === a,
                l = (i && !n && !s) || (!i && (n || s));
            if (l) {
                notification("error", "This item can't be placed inside the active item!", 1.8);
                var o = "failure-info";
                e.removeClass(o),
                    e.addClass(o),
                    setTimeout(function () {
                        e.removeClass(o);
                    }, 1950);
            }
            return l;
        },
        onActivate: function (e) {
            var t = $('#panel-tree-view-wrap [data-item-id="' + e + '"]'),
                a = $('#dialog .tab-container [data-tab-id="' + e + '"]');
            if (
                ($("#dialog .currently-active-tab").removeClass("currently-active-tab"),
                a.addClass("currently-active-tab"),
                t.closest(".tabbedpanel").length > 0 || t.closest(".verticaltabbedpanel").length > 0)
            ) {
                var i = local_storage.get("dialog");
                t.parentsUntil(".dialog")
                    .filter(".tab")
                    .add("Tab" === t.data("item-type") && t)
                    .each(function () {
                        var e = i.items["item-" + $(this).data("item-id")],
                            t = i.items["item-" + $(this).data("item-parent-id")];
                        tab.show(e, t),
                            $(this).css({ minWidth: "", minHeight: "" }),
                            tab.resizeActive(e.id),
                            (t.style.selection = e.id),
                            local_storage.set("dialog", i);
                    });
            }
        },
        resizeActive: function (e) {
            var t = $('#dialog [data-item-id="' + e + '"]'),
                a = "visible-tab";
            t.addClass("tab-width-auto");
            var i = t.find("> .padding-box"),
                n = i.innerWidth(),
                s = i.innerHeight();
            t.removeClass("tab-width-auto");
            var l = 0,
                o = 0;
            t.removeClass(a),
                t.siblings(".tab").each(function () {
                    $(this).addClass(a + " tab-width-auto");
                    var e = $(this).find("> .padding-box"),
                        t = e.innerWidth(),
                        i = e.innerHeight();
                    t > l && (l = t), i > o && (o = i), $(this).removeClass(a + " tab-width-auto"), $(this).css({ minWidth: "", minHeight: "" });
                }),
                l > n ? t.css({ minWidth: l }) : t.css({ minWidth: "" }),
                o > s ? t.css({ minHeight: o }) : t.css({ minHeight: "" }),
                t.addClass(a);
        },
        show: function (e, t) {
            $('#dialog [data-item-id="' + t.id + '"] > .tab-container [data-tab-id="' + e.id + '"]')
                .addClass("visible")
                .siblings()
                .removeClass("visible"),
                $('#dialog [data-item-id="' + t.id + '"] > .padding-box > [data-item-id="' + e.id + '"]')
                    .addClass("visible-tab")
                    .siblings()
                    .removeClass("visible-tab");
        },
        onRemove: function (e, t) {
            var a,
                i = local_storage.get("dialog"),
                n = $('#dialog [data-item-id="' + e + '"]');
            if ("Tab" === t) {
                (a = e), $('#dialog [data-tab-id="' + a + '"]').remove();
                var s = i.items["item-" + e];
                a = $('#panel-tree-view-wrap [data-item-id="' + s.parentId + '"] > ul > li:first').data("item-id");
                var l = n.siblings(".visible-tab"),
                    o =
                        (n.prev().length > 0 && n.prev().data("item-id")) ||
                        (n.next().length > 0 && n.next().data("item-id")) ||
                        (n.closest(".panel.tab").length > 0 && n.closest(".panel.tab").data("item-id")) ||
                        !1;
                n.remove(), l.length > 0 && tab.resizeActive(l.data("item-id")), l.length < 1 && o && item.activate(o);
            } else n.closest(".tab").length > 0 && n.remove();
        },
        onStartSort: function (e) {
            if (e.hasClass("tab")) {
                $("body").addClass("dragging-tab");
                var t =
                    (e.prev().length > 0 && e.prev().data("item-id")) ||
                    (e.next().length > 0 && e.next().data("item-id")) ||
                    (e.closest(".tab").length > 0 && e.closest(".tab").data("item-id")) ||
                    !1;
                t && $('#dialog [data-item-id="' + t + '"]').addClass("dragged-tab-relative");
            }
        },
        onSort: function (e) {
            var t = e.hasClass("tab"),
                a = e.hasClass("tabbedpanel"),
                i = e.hasClass("verticaltabbedpanel");
            if (t || a || i || $('#dialog [data-item-id="' + e.data("item-id") + '"]').closest(".tab").length > 0) {
                $("body").removeClass("dragging-tab");
                var n,
                    s,
                    l = local_storage.get("dialog"),
                    o = e.data("item-id"),
                    r = l.items["item-" + o].parentId,
                    d = $("#dialog"),
                    p = d.find('[data-item-id="' + r + '"]');
                "VerticalTabbedPanel" === l.items["item-" + r].type
                    ? ((n = p.find("> .tab-container > .inner-wrap > ul")), (s = d.find('.tab-container [data-tab-id="' + o + '"]').parent("li")))
                    : ((n = p.find("> .tab-container")), (s = d.find('.tab-container [data-tab-id="' + o + '"]'))),
                    s.appendTo(n);
                var c = p.find("> .padding-box > .tab");
                tab.containerSort(c, n);
                var m = $("#dialog .dragged-tab-relative").removeClass("dragged-tab-relative");
                item.activate(m.data("item-id")), item.activate(o), edit_style_panel.build(l.items["item-" + o].style);
            }
        },
        containerSort: function (e, t) {
            e.each(function () {
                var e = $(this).data("item-id");
                t.find('[data-tab-id="' + e + '"]').appendTo(t);
            });
        },
        onHideToggle: function (e, t, a) {
            $('#dialog [data-tab-id="' + a.id + '"]')[e ? "removeClass" : "addClass"](t);
        },
    },
    treeView = {
        onCreate: function (e) {
            if ("loadFromLocalStorage" !== e && "drag-duplicate" !== e) {
                var t = $("#panel-tree-view-wrap"),
                    a = t.find(".active"),
                    i = a.data("item-id"),
                    n = { id: item.get.id(), type: "TreeItem", parentId: a.data("item-id"), target: a.find("> ul"), event: "parent-propagation" };
                item.funnel.create(n);
                var s = t.find(".active").data("item-id");
                item.activate(i), (n.id = item.get.id()), item.funnel.create(n), item.activate(s);
            }
            var l = $("#panel-new-item-wrap .treeitem");
            l.hasClass("show") || l.addClass("show");
        },
        onDragValid: function (e, t) {
            var a = t.target.parent("li"),
                i = e.hasClass("treeitem"),
                n = a.hasClass("treeview"),
                s = a.hasClass("treeitem");
            return (i && !n && !s) || (!i && (n || s));
        },
        onClick: function (e, t) {
            var a = t.data("item-type"),
                i = e.hasClass("treeitem"),
                n = "TreeView" === a,
                s = "TreeItem" === a,
                l = (i && !n && !s) || (!i && (n || s));
            if (l) {
                notification("error", "This item can't be placed inside the active item!", 1.8);
                var o = "failure-info";
                e.removeClass(o),
                    e.addClass(o),
                    setTimeout(function () {
                        e.removeClass(o);
                    }, 1950);
            }
            return l;
        },
    },
    treeViewItem = {
        onClick: function () {
            $("#dialog").on("click", ".tree-view-arrow", function () {
                var e = $(this).parent(".item-wrap").parent(".tree-view-item"),
                    t = e.data("item-id"),
                    a = local_storage.get("dialog"),
                    i = a.items["item-" + t];
                treeViewItem.expand(a, i, e, !0);
            });
        },
        onSort: function (e, t, a) {
            if ("TreeItem" === t) {
                $('#dialog [data-item-id="' + a + '"]')
                    .parent(".padding-box")
                    .parent(".tree-view-item")
                    .addClass("tree-node");
                var i = $("#dialog .tree-node > .padding-box:empty").parent().removeClass("tree-node expanded");
                if (i.length > 0) {
                    var n = i.data("item-id"),
                        s = local_storage.get("dialog");
                    delete s.items["item-" + n].expanded, local_storage.set("dialog", s);
                }
            }
        },
        onUpdate: function (e, t) {
            if ("TreeItem" === t.type) {
                var a = $('#dialog [data-item-id="' + t.id + '"]');
                a.parent(".padding-box").parent(".tree-view-item").length > 0 &&
                    a.parent(".padding-box").parent(".tree-view-item").addClass("tree-node"),
                    treeViewItem.expand(e, t, a);
            }
        },
        expand: function (e, t, a, i) {
            var n,
                s = "expanded";
            if (!0 !== i) n = t.expanded ? "addClass" : "removeClass";
            else {
                var l = a.hasClass(s);
                n = l ? "removeClass" : "addClass";
            }
            a[n](s), i && (l ? delete e.items["item-" + t.id].expanded : (e.items["item-" + t.id].expanded = !0), local_storage.set("dialog", e));
        },
    };
treeViewItem.onClick();
var listbox = {
    init: function (e, t) {
        e.on("click", "li", function () {
            var a = $(this);
            listbox.clickety(t, e, a);
        });
    },
    clickety: function (e, t, a) {
        var i = "selected",
            n = a.hasClass(i) ? "removeClass" : "addClass";
        a[n](i);
        var s = [];
        t.find("li").each(function () {
            $(this).hasClass(i) && s.push($(this).index());
        });
        var l = local_storage.get("dialog");
        (l.items["item-" + e].style.selection = s), local_storage.set("dialog", l);
    },
    set: function (e, t) {
        var a = e.find("ul");
        a.children().remove();
        var i,
            n,
            s = t.split(","),
            l = local_storage.get("dialog"),
            o = l.items["item-" + l.activeId];
        void 0 !== o.style.selection &&
            ((i = o.style.selection),
            (n = 0),
            $.each(i, function (e, t) {
                n < t && (n = t);
            }),
            n >= s.length && o.style.selection.pop(),
            local_storage.set("dialog", l)),
            $.each(s, function (e, t) {
                var i = t.trim(),
                    n = $.inArray(e, o.style.selection) >= 0;
                $("<li" + (n ? ' class="selected"' : "") + "><span>" + i + "</span></li>").appendTo(a);
            });
    },
};
droplistOnWindowResize();
var droplist = {
        init: function (e) {
            e.find(".drop-list-wrap").on("click", function () {
                $("#drop-list").remove();
                var e = $(this),
                    t = e.hasClass("open"),
                    a = e.parent().data("item-id"),
                    i = local_storage.get("dialog").items["item-" + a];
                if ((item.activate(a, "dialog-preview"), edit_style_panel.build(i.style), t)) droplist.hide();
                else {
                    e.addClass("open");
                    var n = droplist.inspector(a, e);
                    droplist.makeList(a, e, n),
                        $("#drop-list ul li").on("click", function () {
                            var t = $(this),
                                i = local_storage.get("dialog");
                            (i.items["item-" + a].style.selection = t.index()),
                                local_storage.set("dialog", i),
                                e.find(".selected").removeClass("selected"),
                                e.find(".items").children().eq(t.index()).addClass("selected"),
                                droplist.hide();
                        });
                }
            });
        },
        backbone: function (e) {
            var t = null,
                a = e.find(".items").children();
            a.each(function () {
                var e = $(this).width();
                e > t && (t = e);
            }),
                a.width(t);
        },
        inspector: function (e, t) {
            var a = "",
                i = t.find(".selected").index();
            return (
                t
                    .find(".items")
                    .children()
                    .each(function (e) {
                        var t = $(this).text();
                        a += '<li class="option' + ("-" === t ? " horizontal-line" : "") + (e === i ? " selected" : "") + '">' + t + "</li>";
                    }),
                a
            );
        },
        makeList: function (e, t, a) {
            var i = t.offset().top,
                n = t.offset().left,
                s = t.outerWidth(),
                l = t.outerHeight();
            $('<div id="drop-list"><ul>' + a + "</ul></div>").appendTo("#dialog-section");
            var o = $("#drop-list"),
                r = 2 * parseInt(o.css("border-left-width"), 10),
                d = 2 * parseInt(o.css("padding-left"), 10);
            o.css({ top: i + l, left: n - ($(window).width() - $("#dialog-overlay-wrap").width()), width: s - (r + d) });
        },
        set: {
            items: function (e, t, a) {
                var i = e.find(".items");
                i.children().remove();
                var n = !1;
                if (
                    ($.each(t.split(","), function (e, t) {
                        var s = t.trim(),
                            l = "-" == s ? " horizontal-line" : "",
                            o = e === a.selection ? " selected test" : "";
                        e === a.selection && (n = !0), $('<div class="' + o + l + '">' + s + "</div>").appendTo(i);
                    }),
                    !n)
                ) {
                    var s = local_storage.get("dialog");
                    (s.items["item-" + s.activeId].style.selection = 0), local_storage.set("dialog", s), i.find("> div:first").addClass("selected");
                }
                var l = e.find(".drop-list-wrap");
                droplist.backbone(l);
            },
            size: function (e, t, a, i, n) {
                if ("DropDownList" === i) {
                    var s = e.find(".drop-list-wrap"),
                        l = e.find("label");
                    e.removeClass("too-big"), e.removeClass("too-small"), e.addClass("get-width");
                    var o = e.width(),
                        r = l.outerWidth(!0),
                        d = s.outerWidth(!0);
                    e.removeClass("get-width");
                    var p = r + d;
                    n > p
                        ? (e.addClass("too-big"), d < o && s.width("auto"))
                        : n < p &&
                          (e.addClass("too-small"),
                          d > o && s.width(o - 16),
                          e.parent().parent().hasClass("orientation-row") && e.find("label").css({ marginLeft: e.css("padding-left") }));
                }
            },
        },
        hide: function () {
            $("#drop-list").remove(), $(".drop-list-wrap.open").removeClass("open");
        },
        onActivate: function (e) {
            "DropDownList" !== e.data("item-type") ||
                $('[data-panel="edit"] .target-text').is(":empty") ||
                $('<small title="Use staticText instead. For more info check issue: #56" style="color: red;"> Deprecated!</small>').appendTo(
                    '[data-panel="edit"] .target-text > h2'
                );
        },
        onExport: function () {
            var e = local_storage.get("dialog");
            $.each(e.items, function (e, t) {
                "DropDownList" === t.type && null != t.style.text && "" == t.style.text.trim() && delete t.style.text;
            }),
                local_storage.set("dialog", e);
        },
    },
    radiocheck = {
        init: function (e, t, a) {
            var i = this,
                n = e.find(".radiocheck");
            i.restore(e, t, a, n),
                n.on("click", function () {
                    var e = $(this),
                        a = local_storage.get("dialog"),
                        n = a.items["item-" + t],
                        s = e.hasClass("on");
                    e[s ? "removeClass" : "addClass"]("on");
                    var l = !s;
                    e.is(".radiobutton") ? (i.radio.clearSiblings(a, e), (n.style.checked = l)) : (n.style.checked = l),
                        local_storage.set("dialog", a);
                });
        },
        restore: function (e, t, a, i) {
            !0 === local_storage.get("dialog").items["item-" + t].style.checked && i.addClass("on");
        },
        radio: {
            clearSiblings: function (e, t) {
                var a = t.parent(),
                    i = ':not([data-item-type="RadioButton"],.spacing)';
                a.nextUntil(i)
                    .add(a.prevUntil(i))
                    .each(function () {
                        var t = $(this),
                            a = t.data("item-id"),
                            i = t.find(".radiocheck");
                        t.hasClass("radiobutton") && (i.removeClass("on"), (e.items["item-" + a].style.checked = !1));
                    });
            },
        },
    },
    addItemsPanel = {
        init: function () {
            this.generateHTML(),
                $("#panel-new-item-wrap li").on("click", function () {
                    var e = $("#panel-tree-view-wrap").find(".active"),
                        t = e.data("parent"),
                        a = {
                            id: item.get.id(),
                            type: $(this).data("item-type"),
                            parentId: t ? e.data("item-id") : e.data("item-parent-id"),
                            target: t ? e.find("> ul") : e,
                            event: "click",
                        },
                        i = tab.onClick($(this), e, a),
                        n = treeView.onClick($(this), e, a);
                    i || n || item.funnel.create(a);
                });
        },
        generateHTML: function () {
            var e = "";
            $.each(item.list, function (t) {
                var a = item.list[t](!1);
                a.addPanelIconClass &&
                    "Dialog" !== a.type &&
                    ("above" === a.addPanelDivider && (e += '<span class="gouping-divider"></span>'),
                    (e +=
                        '<li class="' +
                        t +
                        '" data-item-type="' +
                        a.type +
                        '"><i class="fas fa-exclamation-triangle failure-is-an-option"></i><i class="' +
                        a.addPanelIconClass +
                        '"></i><span>' +
                        a.type +
                        " | " +
                        a.label +
                        "</span></li>"),
                    "below" === a.addPanelDivider && (e += '<span class="gouping-divider"></span>'));
            }),
                (e += '<div class="disabled-overlay"></div>'),
                $("<ul>" + e + "<ul>").appendTo("#panel-new-item-wrap .contents");
        },
    };
addItemsPanel.init();
var edit_style_panel = {
        build: function (e, t) {
            var a = $("#edit-style-inner-container"),
                i = $("#panel-tree-view-wrap .active"),
                n = i.data("item-type").toLowerCase(),
                s = item.list[n](!1).addPanelIconClass,
                l = $('[data-panel="edit"] .item-prop-icon');
            l.html(""), $('<i class="' + s + '"></i>').appendTo(l);
            var o = "";
            (o += '<span class="target-item-type">' + n + "</span>"),
                $.each(
                    [
                        "varName",
                        "image",
                        "iconButtonStroke",
                        "softWrap",
                        "text",
                        "listItems",
                        "justify",
                        "typeName",
                        "tabNavWidth",
                        "preferredSize",
                        "margins",
                        "orientation",
                        "spacing",
                        "alignChildren",
                        "alignment",
                        "helpTip",
                        "windowType",
                        "enabled",
                        "creationProps",
                    ],
                    function (e, t) {
                        o += '<span class="target-' + t + '"></span>';
                    }
                ),
                a.html(o);
            var r = item.list[n](!1);
            if (!1 === e) $("<div class='no-properties'>" + r.stylePropInfo + "</div>").appendTo(a);
            else {
                $.each(e, function (e, s) {
                    var l = panel_edit_style_html.init(e, s, t, i, n, r);
                    if (void 0 !== l) {
                        var o = a.find(".target-" + e);
                        l.appendTo(o);
                    }
                }),
                    numberInputs();
                var d = item.list[n](!1).defaultStyle.text,
                    p = item.list[n](!1).multiline,
                    c = $('#panel-edit-style-wrap [data-edit="text"]'),
                    m = c.parent();
                !d || p || m.hasClass("is-not-multiline") || m.addClass("is-not-multiline"),
                    $(".pretty-classic").prettyDropdown({
                        hoverIntent: 1e3,
                        classic: !0,
                        customClass: "arrow triangle",
                        selectedMarker: '<i class="fas fa-check"></i>',
                    }),
                    $("#panel-edit-style-wrap textarea").each(function () {
                        autosize(this);
                    }),
                    "dialog" !== t && d && (c.focus(), c.select());
            }
            var u = r.editInfo;
            u && $('<div class="edit-info">' + u + "</div>").appendTo(a), droplist.onActivate(i, e);
        },
    },
    panel_edit_style_html = {
        init: function (e, t, a, i, n, s) {
            var l;
            switch (("creationProps" !== e && "alignment" !== e && (t = null == t ? "" : "string" == typeof t ? t.replace(/\"/g, "&quot;") : t), e)) {
                case "varName":
                    l = $(
                        '<h2 title="每个项目都有一个自动生成的变量名称。 有了这个，你可以用你自己的覆盖它。 这些也用作创建属性名称。 \n\n 按钮：你应该使用名称‘ok’ 或“取消” 使按钮成为默认或取消类型按钮。 用户通常可以通过单击“确定”或“取消”按钮或键入某些键盘快捷键来关闭模式对话框。 按照惯例，键入 ENTER 与单击“确定”或默认按钮相同，而键入 ESC 与单击“取消”相同。 键盘快捷键与调用关联按钮控件的通知具有相同的效果。">自定义名称</h2><input type="text" data-edit="varName" value="' +
                            (null == t ? "" : t) +
                            '">'
                    );
                    break;
                case "windowType":
                    l = $(
                        '<h2 title="dialog — 创建模态对话框。 \n\npalette — 创建无模式对话框，也称为浮动调色板。 （Photoshop CC 不支持。）\n\n窗口 — 创建一个简单的窗口，可用作应用程序的主窗口。 （Photoshop CC 不支持。）">Window Type</h2><select name="qty" class="pretty-classic" data-edit="' +
                            e +
                            '" ><option ' +
                            ("Dialog" == t ? "selected" : "") +
                            ' value="Dialog">Dialog</option><option ' +
                            ("Palette" == t ? "selected" : "") +
                            ' value="Palette">Palette</option><option ' +
                            ("Window" == t ? "selected" : "") +
                            ' value="Window">Window</option></select>'
                    );
                    break;
                case "creationProps":
                    var o = "",
                        r = {
                            su1PanelCoordinates:
                                "当您将面板添加到窗口时，可以选择设置一个创建属性（su1PanelCoordinates），这将导致该面板自动调整其子项的位置；请参阅面板的add方法。启用自动调整后，您提供的位置值对于Photoshop CS是正确的，而结果在Photoshop CS2、CS3、CS4、CS5或CC中相同。您还可以为窗口设置自动调整；在这种情况下，它适用于该窗口的所有子面板，除非在子面板中明确禁用。",
                            maximizeButton:
                                "当设置为true时，标题栏将包括一个按钮，用于将窗口展开到其最大尺寸（通常是整个屏幕），如果平台和窗口类型允许的话。当设置为false时，则不包括此按钮。对于调色板类型，默认值为false，对于窗口类型，默认值为true。不适用于对话框。",
                            minimizeButton:
                                "当设置为true时，标题栏将包括一个按钮，用于最小化或将窗口图标化，如果平台和窗口类型允许的话。当设置为false时，则不包括此按钮。对于调色板类型，默认值为false，对于窗口类型，默认值为true。在Mac OS中，主窗口不能有最小化按钮。不适用于对话框。",
                            independent:
                                "当设置为true时，窗口类型为window的窗口在Windows操作系统中是独立于其他应用程序窗口的，并且可以被隐藏在它们后面。在Mac OS中没有影响。默认值为false。",
                            closeButton:
                                "当设置为true时，窗口类型为window的窗口在Windows操作系统中是独立于其他应用程序窗口的，并且可以被隐藏在它们后面。在Mac OS中没有影响。默认值为false。",
                            resizeable:
                                "当设置为true时，标题栏将包括一个按钮，用于关闭窗口，如果平台和窗口类型允许的话。当设置为false时，则不包括此按钮。默认值为true。不适用于对话框。",
                            borderStyle:
                                "一个字符串，用于指定绘制在面板周围的边框的外观。可以选择以下值之一：black（黑色）、etched（凹陷）、gray（灰色）、raised（凸出）、sunken（下凹）。默认值为etched（凹陷）。",
                            truncate:
                                " 如果设置为middle或end，则定义从文本中的何处开始删除字符并用省略号替换它们，如果指定的标题不适合为其保留的空间。如果设置为none，并且文本不适合，则会从末尾删除字符，而不会替换省略号字符。",
                            scrolling:
                                "当设置为false（默认值）时，显示的文本无法滚动。当设置为true时，可以使用滚动条垂直滚动显示的文本；此情况意味着multiline属性为true。",
                            noecho: "当设置为false（默认值）时，控件显示输入文本。当设置为true时，控件不显示输入文本（用于密码输入字段）。",
                            readonly: "当设置为false（默认值）时，控件接受文本输入。当设置为true时，控件不接受输入，只显示文本属性的内容。",
                            multiline:
                                "当设置为false（默认值）时，控件只接受单行文本。当设置为true时，控件接受多行文本，此时文本将在控件的宽度内换行。",
                            scrollable:
                                "（仅适用于多行元素）当设置为true（默认值）时，文本字段具有垂直滚动条，当元素包含的文本超过可见区域时启用。当设置为false时，不会出现垂直滚动条；如果元素包含的文本超过可见区域，可以使用箭头键向上和向下滚动文本。",
                            borderless: "当设置为true时，窗口没有标题栏或边框。控制这些特征的属性将被忽略。",
                            enterKeySignalsOnChange:
                                "当设置为false（默认值）时，当可编辑文本发生更改并且控件失去键盘焦点时（即用户切换到另一个控件，单击控件外部或键入ENTER），控件会发出onChange事件。当设置为true时，仅当可编辑文本发生更改并且用户键入ENTER时，控件才会发出onChange事件；键盘焦点的其他更改不会触发事件。",
                            multiselect: "当设置为false（默认值）时，只能选择一个项目。当设置为true时，可以选择多个项目。",
                            numberOfColumns:
                                "指定显示项目的列数；默认值为1。当有多列时，每个ListItem对象表示一个可选择的行。它的文本和图像值为第一列提供标签，而subitems属性指定了其他列的标签。",
                            columnWidths: "一个由数字组成的数组，用于指定每个列的首选宽度（以像素为单位）。",
                            columnTitles: "一个相应的字符串数组，用于指定每个列的标题，如果showHeaders为true，则将显示这些标题。",
                            showHeaders: "True 表示显示列标题。",
                            style: "可视化样式的字符串，其中之一: 按钮（button）: 具有可见边框和凸起或3D外观。工具按钮（toolbutton）: 具有平面外观，适合包含在工具栏中。",
                            toggle: "对于按钮样式的控件，值为true时，将使其在第一次点击时获得按钮按下的外观，并在每次点击时与未按下的外观交替显示。切换状态会反映在控件的value属性中。",
                        };
                    $.each(t, function (e, t) {
                        switch (typeof (t = null == t ? "" : "string" == typeof t ? t.replace(/\"/g, "&quot;") : t)) {
                            case "string":
                            case "number":
                                o +=
                                    '<div class="creation-prop prop-' +
                                    e +
                                    '"><span title="' +
                                    r[e] +
                                    '">' +
                                    e +
                                    ': </span><input type="text" value="' +
                                    t +
                                    '" data-edit="' +
                                    e +
                                    '" /></div>';
                                break;
                            default:
                                o +=
                                    '<div class="creation-prop prop-' +
                                    e +
                                    '"><label for="' +
                                    e +
                                    '-input"><span title="' +
                                    r[e] +
                                    '">' +
                                    e +
                                    ': </span><input type="checkbox" ' +
                                    (t ? "checked" : "") +
                                    ' data-edit="' +
                                    e +
                                    '" id="' +
                                    e +
                                    '-input" style="display: none;" /><span class="input-sibling checkbox"></span></label></div>';
                        }
                    }),
                        (l = $(
                            '<div class="creation-props-outer-wrap"><h2 title="一些元素类型具有只能在创建元素时指定的属性。这些属性不是元素的普通属性，因为它们在元素的生命周期内无法更改，并且只需要一次。">创建属性</h2><div class="creation-props-inner-wrap">' +
                                o +
                                "</div></div>"
                        ));
                    break;
                case "helpTip":
                    l = $(
                        '<h2 title="当鼠标悬停在元素上方时显示的帮助文本。您可以通过添加 <br> 来添加换行。">Tooltip | 工具提示<span style="font-size: 12px; color: #b6c0c1;"> forced line break " \\n "</span></h2><input type="text" data-edit="helpTip" value="' +
                            (null == t ? "" : t) +
                            '">'
                    );
                    break;
                case "enabled":
                    l = $(
                        '<h2 title="当为 true 时，控件处于启用状态，可以接受输入。当为 false 时，控件元素不接受输入，所有类型的元素都呈现出灰暗的外观。在 ListBox、DropDownList 或 TreeView 列表中，禁用的 ListItem 不能被选择。">Enabled | 启用<label for="enabled-input"><input type="checkbox" ' +
                            (t ? "checked" : "") +
                            ' data-edit="enabled" id="enabled-input" style="display: none;" /><span class="input-sibling checkbox"></span></label></h2>'
                    );
                    break;
                case "softWrap":
                    break;
                case "text":
                    var d = s.defaultStyle.softWrap;
                    l =
                        "DropDownList" === t
                            ? $("")
                            : $(
                                  '<h2 title="控件中显示的初始文本，可以是标题、标签或内容，具体取决于控件类型。">Text' +
                                      (!0 === d || !1 === d
                                          ? '<label class="soft-wrap-wrap-wrap" style="color: #c1c1c1; font-size: 13px; float: right;" for="softWrapCheckbox">软包裹：<input id="softWrapCheckbox" style="display: none; position: relative; top: -1px;" type="checkbox" data-edit="softWrap"' +
                                            ($("#dialog .active").hasClass("disable-soft-wrap") ? "" : "checked") +
                                            '><span class="input-sibling checkbox"></span></label>'
                                          : "") +
                                      '</h2><div class="edit-text-wrap"><div class="no-linebreaks-icon" title="This item does not support multiline, so no line breaks."><img src="assets/images/no-line-break-icon.svg" alt="" /></div><textarea data-edit="text" class="textarea">' +
                                      t +
                                      "</textarea><div>"
                              );
                    break;
                case "listItems":
                    l = $(
                        '<h2 title="下拉或弹出列表中显示的选项数组。">List Items | 列表项目<span class="desc"> (Comma separated)</span></h2><textarea data-edit="listItems" class="textarea">' +
                            t +
                            "</textarea>"
                    );
                    break;
                case "exportChildren":
                    l = $(
                        '<h2 title="如果未选中，则子项将从导出中省略。这样，您可以在 SDB 中拥有占位符项目，并在以后的脚本中填充它们。">Export Child Items | 导出子项</h2><label for="' +
                            e +
                            '-input"><span title="' +
                            r[e] +
                            '">' +
                            e +
                            ': </span><input type="checkbox" ' +
                            (t ? "checked" : "") +
                            ' data-edit="' +
                            e +
                            '" id="' +
                            e +
                            '-input" style="display: none;" /><span class="input-sibling checkbox"></span></label>'
                    );
                    break;
                case "justify":
                    (l = $(
                        '<div class="justify-container"><h4>Justify:</h4><div class="justify-icon-wrap"><div class="justify-icon" data-edit="justify" data-value="left"><i class="icon fas fa-align-left"></i></div><div class="justify-icon" data-edit="justify" data-value="center"><i class="icon fas fa-align-center"></i></div><div class="justify-icon" data-edit="justify" data-value="right"><i class="icon fas fa-align-right"></i></div></div></div>'
                    ))
                        .find('[data-value="' + t + '"]')
                        .addClass("active");
                    break;
                case "margins":
                    var p = "object" != typeof t;
                    l = $(
                        '<h2 title="容器边缘和最外层子元素之间的像素数。\n\n您可以为容器的每个边缘指定不同的边距。默认值基于容器类型，并选择与标准 Adobe UI 指南相匹配的值。">边距<div class="link-icon ' +
                            (p ? "active" : "") +
                            '" title="Adjust each side individually..."><i class="fas fa-unlock-alt"></i><i class="fas fa-lock-open"></i></div></h2><span class="desc margins-desc ' +
                            (p ? "hide" : "") +
                            '"><span>top</span><span>right</span><span>bottom</span><span>left</span></span><div class="margin-inputs"><input class="number" style="display: none;"><div class="n-1-4"><input data-edit="margins" class="number top" value="' +
                            (p ? t : t[0]) +
                            '" min="0" max="300" step="1" modifier-step="10"></div><div class="n-3-4 ' +
                            (p ? "hidden" : "") +
                            '"><input data-edit="margins" class="number right" value="' +
                            (p ? t : t[1]) +
                            '" min="0" max="300" step="1" modifier-step="10"' +
                            (p ? "disabled" : "") +
                            '><input data-edit="margins" class="number bottom" value="' +
                            (p ? t : t[2]) +
                            '" min="0" max="300" step="1" modifier-step="10"' +
                            (p ? "disabled" : "") +
                            '><input data-edit="margins" class="number left" value="' +
                            (p ? t : t[3]) +
                            '" min="0" max="300" step="1" modifier-step="10"' +
                            (p ? "disabled" : "") +
                            '></div><input class="number" style="display: none;"></div>'
                    );
                    break;
                case "preferredSize":
                    l = $(
                        '<h2 title="首选尺寸，用于布局管理器确定每个元素的最佳大小。如果没有在脚本中明确设置，则值由ScriptUI所使用的UI框架确定，并基于元素的文本、字体、字号、图标大小和其他UI框架特定属性等属性。脚本可以在布局管理器调用之前显式设置preferredSize，以建立一个与默认值不同的元素大小。">首选尺寸<span class="preferred-size-auto" title="Reset to content size (0)"><i class="fas fa-compress"></i></span></h2><div class="dimensions-container linked"><input class="number" style="display: none;"><h4 class="width-heading">宽:</h4><input class="number width" data-edit="preferredSize" value="' +
                            t[0] +
                            '" min="0" max="2000" step="1" modifier-step="10"><h4 class="height-heading">高:</h4><input class="number height" data-edit="preferredSize" value="' +
                            t[1] +
                            '" min="0" max="2000" step="1" modifier-step="10"><input class="number" style="display: none;"></div>'
                    );
                    break;
                case "tabNavWidth":
                    l = $(
                        '<h2 title="T首选大小（preferredSize），由布局管理器用来确定每个元素的最佳大小。如果没有在脚本中显式设置，该值将由使用 ScriptUI 的 UI 框架建立，并基于元素的文本、字体、字号、图标大小和其他 UI 框架特定的属性等属性。脚本可以在布局管理器被调用之前显式设置 preferredSize，以建立一个与默认值不同的元素大小。">首选宽度 <small>(ListBox)</small></h2><div class="dimensions-container linked"><input class="number" style="display: none;"><h4 class="width-heading">Width:</h4><input class="number tabNavWidth" data-edit="tabNavWidth" value="' +
                            t +
                            '" min="0" max="2000" step="1" modifier-step="10"><input class="number" style="display: none;"></div>'
                    );
                    break;
                case "orientation":
                    (l = $(
                        '<h2 class="orientation-heading" title="子元素在容器中的布局方向。">方向</h2><h2 class="spacing-heading" title="相邻子元素之间的像素数。因为每个容器只包含单个子元素的行或列，所以容器只需要一个间距值。默认值基于容器类型，并选择与标准 Adobe UI 指南相匹配的值。">Spacing</h2><br><div class="orientation"><select name="qty" class="pretty-classic" data-edit="orientation"><option>row | 行</option><option>column | 列</option></select></div>'
                    ))
                        .last()
                        .find('option:contains("' + t + '")')
                        .prop("selected", !0);
                    break;
                case "spacing":
                    l = $(
                        '<input class="number" style="display: none;"><div class="spacing-container"><input class="number" data-edit="spacing" value="' +
                            t +
                            '" min="0" max="300" step="1" modifier-step="5"></div><input class="number" style="display: none;">'
                    );
                    break;
                case "alignChildren":
                    var c = $("#dialog .active").hasClass("orientation-column");
                    l = $(
                        '<h2 title="该属性告诉布局管理器如何在列或行中对不同大小的子元素进行对齐。\n\n创建顺序决定了哪些子元素位于列或行的顶部或左侧。子元素创建得越早，则越靠近其所在列或行的顶部或左侧。如果定义了子元素的对齐方式，则会覆盖父容器的alignChildren设置。有关值，请参见alignment属性。">Align Children | 子项对齐</h2><div class="align-children"><span class="x-axis">X:</span><select id="align-children-horizontal" data-edit="alignChildren" name="qty" class="pretty-classic"><option>left</option><option>center</option><option>right</option>' +
                            (c ? "<option>fill</option>" : "") +
                            '</select><span class="y-axis">Y:</span><select id="align-children-vertical" data-edit="alignChildren" name="qty" class="pretty-classic"><option>top</option><option>center</option><option>bottom</option>' +
                            (c ? "" : "<option>fill</option>") +
                            "</select></div>"
                    );
                    var m = t[0],
                        u = t[1];
                    l.find('#align-children-horizontal option:contains("' + m + '")').prop("selected", !0),
                        l.find('#align-children-vertical option:contains("' + u + '")').prop("selected", !0);
                    break;
                case "image":
                    l = $(
                        '<div class="image-edit"><div class="img-wrapper"><img class="base64-bin" src="' +
                            t[0] +
                            '" alt="" /></div><div class="custom-file-input"><div class="add"><i class="fas fa-upload"></i>Choose file...</div><div class="remove"><i class="fas fa-times"></i></div></div><input data-edit="image" type="file" accept="image/jpeg, image/png"></div>'
                    );
                    break;
                case "alignment":
                    var f,
                        g = $("#dialog .active").parent("div").parent("div").hasClass("orientation-column"),
                        h = g ? "column" : "row",
                        v = g ? "horizontal" : "vertical",
                        b = null === t,
                        y = g ? ["left", "center", "right", "fill"] : ["top", "center", "bottom", "fill"],
                        w = "";
                    $.each(y, function (e, t) {
                        (t = null == t ? "" : "string" == typeof t ? t.replace(/\"/g, "&quot;") : t),
                            (w += '<option value="' + t + '">' + t + "</option>");
                    }),
                        (l = $(
                            '<div class="alignment-container"><h2 title="此元素的对齐方式。如果已定义，则该值将覆盖父容器的alignChildren设置。">Alignment <span>(Self)</span></h2><div class="alignment-checkbox"><input type="checkbox" id="alignment-checkbox-input" name="" ' +
                                (b ? "" : "checked") +
                                ' /><label for="alignment-checkbox-input"></label></div><br>' +
                                ('<div id="alignment-' +
                                    v +
                                    '"><select name="qty" class="pretty-classic" data-edit="alignment"  data-edit-value="' +
                                    v +
                                    '" ' +
                                    (b ? "disabled" : "") +
                                    " >" +
                                    w +
                                    "</select></div>") +
                                "</div>"
                        )),
                        "column" === h
                            ? ((f = ("top" === t ? "left" : "bottom" === t && "right") || t),
                              l.find('#alignment-horizontal option:contains("' + (null === t ? "center" : f) + '")').prop("selected", !0))
                            : ((f = ("left" === t ? "top" : "right" === t && "bottom") || t),
                              l.find('#alignment-vertical option:contains("' + (null === t ? "center" : f) + '")').prop("selected", !0));
                    break;
            }
            return l;
        },
    },
    propsPanel = $("#panel-edit-style-wrap");
propsPanel.on("click", ".justify-icon", function () {
    $(this).addClass("active").siblings().removeClass("active");
}),
    propsPanel.on("change", ".alignment-checkbox input", function () {
        var e = $(this).prop("checked"),
            t = !e,
            a = e ? "removeClass" : "addClass";
        $(".alignment-container select").prop("disabled", t).trigger("change"), $(".alignment-container .prettydropdown")[a]("disabled");
    }),
    propsPanel.on("click", ".preferred-size-auto", function () {
        var e = propsPanel.find("input.width");
        e.val(0).change(), propsPanel.find("input.height").val(0).change(), item.funnel.update(e.data("edit"));
    }),
    propsPanel.on("dblclick", ".number-overlay", function () {
        var e = $(this).parent().find(".number");
        e.val(0).change(), item.funnel.update(e.data("edit"));
    }),
    propsPanel.on("click", ".link-icon", function () {
        var e = $(".margin-inputs .n-3-4");
        e.hasClass("hidden")
            ? ($(this).removeClass("active"),
              e.removeClass("hidden"),
              e.find("input").prop("disabled", !1).val($(".margin-inputs .n-1-4 input").val()),
              $("#panel-edit-style-wrap .margins-desc").removeClass("hide"))
            : ($(this).addClass("active"),
              e.addClass("hidden"),
              e.find("input").prop("disabled", !0),
              $("#panel-edit-style-wrap .margins-desc").addClass("hide")),
            item.funnel.update("margins");
    }),
    propsPanel.on("keydown", '[data-edit="text"]', function (e) {
        return lineBreakIntercept(e);
    }),
    propsPanel.on("keyup", '[data-edit="text"]', function (e) {
        18 != (e.keyCode ? e.keyCode : e.which) && item.funnel.update($(this).data("edit"));
        var t = $("#dialog .active"),
            a = t.find(".text-container"),
            i = t.data("item-type"),
            n = a.height(),
            s = !1;
        (("StaticText" === i && n > 25.5) || ("EditText" === i && n > 22.5)) && (s = !0), s ? a.addClass("multiline") : a.removeClass("multiline");
    }),
    propsPanel.on("change", 'input[type="checkbox"][data-edit]', function () {
        item.funnel.update($(this).data("edit"));
    }),
    propsPanel.on(
        "keyup",
        '[data-edit="listItems"], [data-edit="varName"], [data-edit="helpTip"], .creation-props-inner-wrap input[type="text"]',
        function () {
            if ("varName" === $(this).data("edit")) {
                $(this).val(
                    $(this)
                        .val()
                        .replace(/[-]+/g, " ")
                        .replace(/^[0-9]/g, "")
                        .replace(/[^\w\s]/g, "")
                        .replace(/ (.)/g, function (e) {
                            return e.toUpperCase();
                        })
                        .replace(/ /g, "")
                );
            }
            item.funnel.update($(this).data("edit"));
        }
    ),
    propsPanel.on("click", '[data-edit="justify"]', function () {
        item.funnel.update($(this).data("edit"));
    }),
    propsPanel.on("change", "select[data-edit]", function () {
        if ("orientation" === $(this).data("edit")) {
            var e = "column" === $(this).find("option:selected").val(),
                t = $("#align-children-horizontal"),
                a = $("#align-children-vertical");
            e
                ? (a.find("option:contains(fill)").remove(), $("<option>fill</option>").appendTo(t))
                : (t.find("option:contains(fill)").remove(), $("<option>fill</option>").appendTo(a)),
                $("#panel-edit-style-wrap .align-children select").each(function () {
                    $(this).trigger("change"),
                        $(this)
                            .prettyDropdown({ classic: !0, customClass: "arrow triangle", selectedMarker: '<i class="fas fa-check"></i>' })
                            .refresh();
                });
        }
        item.funnel.update($(this).data("edit"));
    }),
    propsPanel.on("click", ".custom-file-input > div", function () {
        $(this).hasClass("remove")
            ? (propsPanel.find(".base64-bin").attr("src", ""), item.funnel.update("image"))
            : propsPanel.find('[data-edit="image"]').trigger("click");
    }),
    propsPanel.on("change", '[data-edit="image"]', function () {
        var e = this.files[0],
            t = {
                render: function (e, t) {
                    var a = new FileReader();
                    (a.onload = function () {
                        t(a.result);
                    }),
                        a.readAsDataURL(e);
                },
                getBinary: function (e, t) {
                    var a = new FileReader();
                    (a.onload = function () {
                        t(encodeURIComponent(a.result));
                    }),
                        a.readAsBinaryString(e);
                },
            };
        t.render(e, function (e) {
            propsPanel.find(".base64-bin").attr("src", e), item.funnel.update("image");
        });
    });
var snapshot = {
    init: function () {
        snapshot.fetch_items_length();
    },
    openPanel: function () {
        var e = $('[data-panel="snapshots"]');
        if (e.data("lock")) {
            e.data({ lock: !1 });
            var t = snapshot.fetch_all_items();
            $(t).prependTo(e.find(".snapshots")),
                e.find(".take-snapshot").on("click", snapshot.capture),
                e.on("click", ".image", function () {
                    var e = $(this).closest(".snapshot").data("id"),
                        t = local_storage.get("dialog-snapshots").storage["dialog-" + e];
                    modal.init('<img src="' + t.image + '" alt="" />'), $("#modal-window-content").addClass("snapshot-preview");
                }),
                e.on("click", ".remove", function () {
                    snapshot.remove($(this).closest(".snapshot"));
                }),
                e.on("click", ".ss-label", function () {
                    snapshot.replace($(this).closest(".snapshot"));
                });
        }
    },
    replace: function (e) {
        var t = e.data("id"),
            a = local_storage.get("dialog-snapshots").storage["dialog-" + t],
            i =
                '<div id="snapshot-replace-box"><img src="' +
                a.image +
                '" alt="" /><div class="info-wrap" data-id="' +
                a.id +
                '"><span><strong>ID: </strong>' +
                a.id +
                "</span><span><strong>Date: </strong>" +
                new Date(a.date).toLocaleString() +
                '</span><br><div>Use left and right arrow keys to navigate between snapshots.</div><div>When you load a snapshot it overwrites your current dialog, so you should take a new snapshot first if it has changes you want to keep.</div><div>Sometimes these preview images have some weird clipping errors and such. Just wanted to acknowledge that it can happen, but it doesn\'t carry over to the loaded snapshot.</div></div><div class="btn-wrap"><span class="remove">删除</span><span class="yes" data-enter>Load this snapshot</span><span class="no">Close</span></div></div>';
        modal.init(i, "snapshot-replace");
        var n = $("#snapshot-replace-box");
        n.find(".yes").on("click", function () {
            modal.remove(),
                setTimeout(function () {
                    local_storage.remove("dialog"),
                        local_storage.set("dialog", a.json),
                        modal.remove(),
                        loadingScreen.init(null, function () {
                            location.reload();
                        });
                }, 300);
        }),
            n.find(".no").on("click", function () {
                modal.remove();
            }),
            n.find(".remove").on("click", function () {
                var e = $("#modal-window.snapshot-replace .info-wrap").data("id"),
                    t = $('[data-panel="snapshots"] .snapshot[data-id="' + e + '"]');
                modal.remove(function () {
                    (t.prev().length < 1 ? t.next() : t.prev()).find(".ss-label").trigger("click"), snapshot.remove(t);
                });
            });
    },
    remove: function (e) {
        var t = e.data("id"),
            a = local_storage.get("dialog-snapshots");
        delete a.storage["dialog-" + t], e.remove();
        var i = [];
        $('[data-panel="snapshots"] .snapshots')
            .children()
            .each(function () {
                i.push($(this).data("id"));
            }),
            (a.ids = i.reverse()),
            local_storage.set("dialog-snapshots", a),
            snapshot.fetch_items_length();
    },
    fetch_items_length: function () {
        var e = local_storage.get("dialog-snapshots"),
            t = null;
        if ((e && e.ids && (t = e.ids.length), null !== t)) {
            var a = $('[data-panel="snapshots"] .label .ss-number');
            e.ids.length > 0 ? a.html('<div style="display: inline-block; padding: 0 7px;">|</div>' + e.ids.length) : a.html("");
        }
    },
    fetch_all_items: function () {
        var e = local_storage.get("dialog-snapshots");
        null === e && ((e = { ids: [], storage: {} }), local_storage.set("dialog-snapshots", e));
        for (var t = "", a = e.ids.length; a--; ) {
            var i = e.storage["dialog-" + e.ids[a]];
            t += snapshot.make_html(i);
        }
        return t;
    },
    capture: function () {
        var e = $('<div class="snapshot temp"><img src="assets/images/snapshot-load.gif" alt="" /></div>').prependTo(
                '[data-panel="snapshots"] .snapshots'
            ),
            t = local_storage.get("dialog-snapshots"),
            a = local_storage.get("dialog"),
            i = $("#dialog-container");
        html2canvas(i[0], { backgroundColor: null, logging: !1 }).then(function (i) {
            var n = $('[data-panel="snapshots"]');
            e.remove();
            var s = t.ids.length > 0 ? Math.max.apply(null, t.ids) + 1 : 1,
                l = (t.storage["dialog-" + s] = {});
            (l.id = s),
                (l.date = new Date().getTime()),
                (l.image = i.toDataURL("image/png")),
                (l.json = a),
                t.ids.push(l.id),
                local_storage.set("dialog-snapshots", t);
            var o = snapshot.make_html(l);
            n.find('[data-id="' + s + '"]').length <= 0 && $(o).prependTo(n.find(".snapshots")), snapshot.fetch_items_length();
        });
    },
    make_html: function (e) {
        var t = new Date(e.date);
        return (
            '<div class="snapshot" data-id="' +
            e.id +
            '"><div class="ss-label"><span title="' +
            t +
            '">' +
            e.id +
            '</span><div class="text">Snapshot</div></div><div class="icons-wrap animated fadeIn"><div class="remove" title="移除快照..."><i class="fas fa-trash"></i></div></div></div>'
        );
    },
};
snapshot.init(),
    $(document).on("keydown", function (e) {
        if ($("#modal-window.snapshot-replace").length > 0) {
            var t = e.keyCode ? e.keyCode : e.which,
                a = 37 === t,
                i = 39 === t,
                n = $("#modal-window.snapshot-replace .info-wrap").data("id");
            (a || i) &&
                modal.remove(function () {
                    var e,
                        t = $('[data-panel="snapshots"] .snapshot[data-id="' + n + '"]');
                    a ? (e = t.next().length < 1 ? t.siblings().first() : t.next()) : i && (e = t.prev().length < 1 ? t.siblings().last() : t.prev()),
                        e.length < 1 && (e = t),
                        e.find(".ss-label").trigger("click");
                });
        }
    });
var mousemovePing,
    loadingScreen = {
        init: function (e, t) {
            (e = e || 0.1), $("body").addClass("loading");
            $('<div id="loader-bg"><div class="loader">Loading...</div></div>').appendTo("body"),
                $("#loader-bg").backstretch([{ url: "./assets/images/bg.jpg", alignX: "center" }]),
                setTimeout(function () {
                    t();
                }, this.secondsToMilliseconds(e));
        },
        secondsToMilliseconds: function (e) {
            return 1e3 * e;
        },
    },
    clipboard = {
        set: function (e, t) {
            var a = $("#clipboard-export-spinner");
            a.show(),
                $(
                    '<textarea id="clipboard-export-temp" style="opacity: 0; position: absolute; z-index: 9999999; top: -9999px; left: -9999px;"></textarea>'
                ).appendTo("body");
            var i = $("#clipboard-export-temp");
            i.val(e), i.select();
            var n = !1;
            try {
                document.execCommand("copy") && (n = !0);
            } catch (e) {}
            a.hide(), i.remove(), n ? t() : notification("failure", "Copy failed...", 2);
        },
    };
setInterval(function () {
    mousemovePing = !0;
}, 45);
var modal = {
    init: function (e, t) {
        $("#modal-window").remove(),
            modal.make(e, t),
            $("#modal-window-overlay").on("click", function () {
                modal.remove();
            });
    },
    make: function (e, t) {
        (e = void 0 === e ? "" : e),
            $(
                '<div id="modal-window" class="' +
                    (t || "") +
                    '"><div id="modal-window-overlay" data-esc></div><div id="modal-window-content" class="animated fadeIn">' +
                    e +
                    "</div></div>"
            ).appendTo("body"),
            $("body").addClass("modal-window-active");
    },
    remove: function (e) {
        $("#modal-window-content").addClass("fadeOut"),
            setTimeout(function () {
                $("#modal-window").remove(), $("body").removeClass("modal-window-active"), void 0 !== e && e();
            }, 100);
    },
};
$(document).on("keydown", function (e) {
    if ($("#modal-window").length > 0) {
        var t = e.keyCode ? e.keyCode : e.which,
            a = 13 === t;
        27 === t ? $("#modal-window").find("[data-esc]").trigger("click") : a && $("#modal-window").find("[data-enter]").trigger("click");
    }
}),
    document.addEventListener("copy", function (e) {
        $("body").hasClass("sdb-code-export") &&
            (e.preventDefault(), e.clipboardData.setData("text/plain", getExportCode().code), $("body").removeClass("sdb-code-export"));
    }),
    $(document).on("keydown", function (e) {
        69 == (e.keyCode ? e.keyCode : e.which) &&
            e.altKey &&
            (e.preventDefault(),
            $("#export-box").length < 1
                ? exportToClipboard("shortcut")
                : modal.remove(function () {
                      exportToClipboard("export-window");
                  }));
    });
var myCodeMirror,
    sdbExport,
    cmMode,
    customVar = {
        init: function () {
            var e = local_storage.get("dialog");
            (customVar.counters = {}), (customVar.names = {}), (customVar.customNames = {}), this.populate.counters(e), this.populate.names(e);
        },
        populate: {
            counters: function (e) {
                $.each(e.items, function (e, t) {
                    t.style.varName ? (customVar.counters[t.style.varName] = -1) : (customVar.counters[t.type] = 0);
                });
            },
            names: function (e) {
                $.each(e.order, function (t, a) {
                    var i = e.items["item-" + a];
                    customVar.update(i);
                    var n = i.style.varName,
                        s = customVar.counters[n];
                    if (n) (customVar.names[a] = customVar.incrementNumbering(n, s)), (customVar.customNames["item-" + a] = customVar.names[a]);
                    else {
                        var l = 0 == i.id ? "" : customVar.counters[i.type],
                            o = customVar.customType(i.type, i).toLowerCase();
                        customVar.names[a] = o + l;
                    }
                });
            },
        },
        incrementNumbering: function (e, t) {
            var a,
                i,
                n,
                s = "",
                l = e.match(/\d+$/);
            if (l) {
                var o = l[0],
                    r = o.length,
                    d = parseFloat(o);
                s =
                    e.replace(/\d+$/, "") +
                    ((a = d + t), (i = r), (n = n || "0"), (a += "").length >= i ? a : new Array(i - a.length + 1).join(n) + a);
            } else s = e + (t > 0 ? t : "");
            return s;
        },
        customType: function (e, t) {
            var a,
                i = e.toLowerCase();
            switch (i) {
                case "dropdownlist":
                    a = "dropdown";
                    break;
                case "tabbedpanel":
                    a = "tpanel";
                    break;
                case "dialog":
                    var n = t.style.windowType.toLowerCase();
                    a = "window" == n ? "win" : n;
                    break;
                default:
                    a = i;
            }
            return a;
        },
        update: function (e) {
            e.style.varName ? ++customVar.counters[e.style.varName] : ++customVar.counters[e.type];
        },
    },
    imageDuplicateCheck = {
        init: function (e, t) {
            var a = !1;
            return (
                $.each(this.images, function (e, i) {
                    var n = i[0],
                        s = i[1];
                    if (t === s) return (a = [n]), !1;
                }),
                !1 !== a ? a : (this.images.push([e, t]), [e, t])
            );
        },
        images: [],
    };
$("#toolbar .export").on("click", function () {
    var e =
        '<div id="export-box"><h2>Export.jsx</h2><div class="code"></div><div class="btns"><div class="download btn animated fadeInDown"><div class="icon"><i class="fas fa-check animated"></i><i class="fas fa-download"></i> <span>下载</span></div></div><div class="copy btn animated fadeInDown"><div class="icon"><i class="fas fa-check animated"></i><i class="fas fa-times animated"></i><i class="fas fa-clipboard-list"></i><img src="assets/images/clipboard-copy-spinner.gif" alt=""> <span>复制到剪切板</span></div></div><div class="settings btn animated fadeInDown"><div class="icon"><i class="fas fa-cog"></i> <span>设置</span></div></div><div class="settings-window"><div>' +
        settings.html() +
        "</div></div></div></div>";
    modal.init(e, "export-modal"),
        $("#modal-window-content").on("click", function (e) {
            "modal-window-content" === $(e.target).attr("id") && modal.remove();
        }),
        (sdbExport = getExportCode()),
        (cmMode = "javascript" === sdbExport.language ? { name: sdbExport.language, json: !0 } : sdbExport.language),
        (myCodeMirror = CodeMirror($("#export-box .code")[0], {
            mode: cmMode,
            theme: "monokai",
            autofocus: !0,
            lineNumbers: !0,
            value: sdbExport.code,
            readOnly: !0,
        }));
    var t = $("#export-box");
    t.find(".btn.copy").on("click", function () {
        modal.remove(function () {
            exportToClipboard("export-window");
        });
    }),
        t.find(".download").on("click", function () {
            download(sdbExport.code, sdbExport.filename, "text/" + sdbExport.language);
            var e = $(this),
                t = e.find(".fa-check"),
                a = e.find(".fa-download");
            t.addClass("rotateIn"),
                a.hide(),
                setTimeout(function () {
                    t.removeClass("rotateIn"), a.show();
                }, 750);
        }),
        t.find(".settings").on("click", function () {
            var e = t.find(".settings-window"),
                a = e.hasClass("open") ? "removeClass" : "addClass";
            e[a]("open");
        }),
        t.find(".settings-window input").on("change", function () {
            settings.toggleEvent($(this));
        }),
        t.find(".settings-window .setting-reference-list-dropdown .selected").on("click", function () {
            settings.referenceList($(this));
        });
});
var settings = {
    list: {
        importJSON: {
            divider: !0,
            status: !0,
            label: '导入JSON <span title="所有导出设置都随可导入的 JSON 一起传输。 如果您加载样本或重置对话框，导出设置将恢复为默认值。">?</span>',
            settingFor: "both",
        },
        indentSize: {
            status: !1,
            label: '缩进 2 个空格（默认为 4）<span title="建议 JSX 的缩进大小为 4，HTML 的缩进大小为 2">?</span>',
            settingFor: "both",
        },
        cepExport: {
            divider: !0,
            status: !1,
            label: 'CEP方式 导出 (HTML)<span title="当使用 CEP 导出打开时，对话框预览下方的背景为灰色。">?</span>',
            settingFor: "both",
        },
        includeCSSJS: {
            status: !0,
            label: 'CSS and Javascript  <span title="这些都是必需的。 如果您已经添加了 CSS 和 JS，则可以将其排除在导出之外。">?</span>',
            settingFor: "CEP",
        },
        showDialog: {
            divider: !0,
            status: !0,
            label: '显示 Dialog <span title="Places dialog.show(); at the end for easy testing.">?</span>',
            settingFor: "SUI",
        },
        functionWrapper: { divider: !1, status: !1, label: "函数包裹(建议)", settingFor: "SUI" },
        afterEffectsDockable: {
            divider: !1,
            status: !1,
            label: 'After Effects 中的可停靠面板<span title="If the script is put in the &quot;Scripts/ScriptUI Panels&quot; folder, the dialog will behave similar to native panels. Inside the regular scripts folder the window type &quot;palette&quot; is enforced as well.">?</span>',
        },
        itemReferenceList: {
            divider: !1,
            status: "None",
            label: 'Item reference list <span title="Places all the custom named items at the bottom of the code. If nothing shows up, you likely don&apos;t have any custom named items.">?</span>',
            settingFor: "SUI",
        },
    },
    html: function () {
        var e = local_storage.get("dialog"),
            t = "",
            a = 0;
        return (
            $.each(settings.list, function (i, n) {
                if (n.divider) {
                    a > 0 && (t += "</div>"),
                        (t += '<div class="settings-group">'),
                        (t += '<div class="heading">' + ["常规导出设置", "CEP", "SUI"][a] + ' <div class="settings-spinner"></div></div>'),
                        ++a;
                }
                var s = !1;
                ((e.settings.cepExport && "SUI" === n.settingFor) || (!e.settings.cepExport && "CEP" === n.settingFor)) && (s = !0);
                var l = "";
                "includeCSSJS" === i &&
                    (l =
                        '<ul class="settings-js-css-info"><li>CSS and JS <a href="https://scriptui.joonas.me/docs/CEP-export/getting-started/#the-required-css-and-js-files" target="_blank">download links</a></li><li><a href="https://scriptui.joonas.me/docs/CEP-export/getting-started" target="_blank">Documentation</a></li></ul>');
                var o = e.settings[i];
                switch (i) {
                    case "itemReferenceList":
                        t +=
                            '<section class="setting-reference-list-wrap setting-for-' +
                            n.settingFor +
                            '"><div class="setting-reference-list-dropdown" data-setting="' +
                            i +
                            '" id="scb-' +
                            i +
                            '"><div class="selected">' +
                            o +
                            '</div></div> <div class="label">' +
                            n.label +
                            "</div></section>";
                        break;
                    default:
                        t +=
                            '<section class="slider-checkbox' +
                            (s ? " setting-disabled" : "") +
                            " setting-for-" +
                            n.settingFor +
                            '"><input ' +
                            (o ? 'checked="true"' : "") +
                            (s ? 'disabled="true"' : "") +
                            ' data-setting="' +
                            i +
                            '" id="scb-' +
                            i +
                            '" type="checkbox" /><label class="label" for="scb-' +
                            i +
                            '">' +
                            n.label +
                            "</label>" +
                            l +
                            "</section>";
                }
            }),
            (t += "</div>")
        );
    },
    referenceList: function (e) {
        $(
            '<div class="options"><div data-value="none">None</div><div data-value="var">Variable name</div><div data-value="find">FindElement</div><div data-value="path">Item path</div></div>'
        ).insertAfter(e),
            e
                .next(".options")
                .children()
                .on("click", function () {
                    var t = $(this).data("value"),
                        a = $(this).html();
                    e.html(a), $(this).closest(".options").remove();
                    var i = e.closest(".settings-group").find(".settings-spinner");
                    i.stop().show(function () {
                        var a = e.closest("[data-setting]").data("setting"),
                            n = t,
                            s = local_storage.get("dialog");
                        (s.settings[a] = n),
                            local_storage.set("dialog", s),
                            (sdbExport = getExportCode()),
                            (cmMode = "javascript" === sdbExport.language ? { name: sdbExport.language, json: !0 } : sdbExport.language),
                            myCodeMirror.setOption("mode", cmMode),
                            myCodeMirror.setValue(getExportCode().code),
                            i.hide();
                    });
                });
    },
    toggleEvent: function (e) {
        if (e.data("setting")) {
            var t = e.closest(".settings-group").find(".settings-spinner");
            t.stop().show(function () {
                var a = e.data("setting"),
                    i = e.prop("checked"),
                    n = local_storage.get("dialog");
                if (((n.settings[a] = i), local_storage.set("dialog", n), "cepExport" === a)) {
                    $("html")[i ? "addClass" : "removeClass"]("cep-export-on");
                    var s = $(".settings-window " + (i ? ".setting-for-CEP" : ".setting-for-SUI"));
                    if (s.length > 0) {
                        var l = s.find("input");
                        s.removeClass("setting-disabled"), l.prop("disabled", !1);
                    }
                    var o = $(".settings-window " + (i ? ".setting-for-SUI" : ".setting-for-CEP"));
                    if (o.length > 0) {
                        var r = o.find("input");
                        o.addClass("setting-disabled"), r.prop("disabled", !0);
                    }
                }
                (sdbExport = getExportCode()),
                    (cmMode = "javascript" === sdbExport.language ? { name: sdbExport.language, json: !0 } : sdbExport.language),
                    myCodeMirror.setOption("mode", cmMode),
                    myCodeMirror.setValue(getExportCode().code),
                    t.hide();
            });
        }
    },
    setDefaults: function () {
        var e = local_storage.get("dialog");
        void 0 === e.settings
            ? ((e.settings = {}),
              $.each(settings.list, function (t, a) {
                  e.settings[t] = a.status;
              }))
            : ($.each(settings.list, function (t, a) {
                  t in e.settings || (e.settings[t] = a.status);
              }),
              e.settings.cepExport && $("html").addClass("cep-export-on")),
            local_storage.set("dialog", e);
    },
    cepExport: {
        onExport: function (e, t) {
            var a = "",
                i = $("<style/>");
            return (
                i.text(
                    "html, body { margin: 0; height: 100%; background: #535353; } \n#dialog { color: transparent; } \n#dialog svg { display: none; } \n::-webkit-scrollbar { width: 2px; height: 2px; } \n::-webkit-scrollbar-button { width: 0px; height: 0px; } \n::-webkit-scrollbar-thumb { background: #a0a0a0; border-radius: 50px; display: none; } \n::-webkit-scrollbar-corner { background: transparent; } \n*:hover::-webkit-scrollbar-thumb { display: block; } \nbody::-webkit-scrollbar-track { background: #535353; } "
                ),
                (a += i.prop("outerHTML")),
                (a += (function () {
                    var e = $("#dialog").clone().wrap("<div/>").parent();
                    e.find("#dialog").addClass("cep-mode").removeClass("animated fadeIn"),
                        e.find("#dialog-title-bar").remove(),
                        e.find(".active[data-item-type]").removeClass("active"),
                        e.find("[contenteditable]").filter(":not(.edittext-text-cont)").attr("contenteditable", !1),
                        e.find("[data-item-type]").each(function () {
                            $(this).attr("data-item-type", $(this).data("item-type").toLowerCase());
                            var e = $(this).data("item-id");
                            $(this).attr("data-item-name", customVar.names[e]);
                        });
                    var t = e.html();
                    return e.remove(), t;
                })()),
                (a = html_beautify(a, {
                    indent_size: e.settings.indentSize ? 2 : 4,
                    space_in_empty_paren: !0,
                    templating: null,
                    preserve_newlines: !0,
                })),
                e.settings.includeCSSJS &&
                    (a += (function () {
                        var e = local_storage.get("sdb-cep-dependencies");
                        return e ? "\n\n" + e.css + "\n\n" + e.js : "";
                    })()),
                t + a
            );
        },
    },
};
$("#toolbar .import").on("click", function () {
    var e;
    modal.init(
        '<div id="import-box"><h2>Import.jsx</h2><div class="ta"><div class="placeholder"><span class="important">The current dialog will be overwritten on a successful import.</span> <br><br>您应该能够从导出代码的顶部找到 JSON，除非它已在导出设置中被禁用。<br>您只能在导出时导入此工具生成的 JSON。 您用 Javascript 编写的旧对话代码将<strong>不能</strong>工作！<br><br>粘贴时对有效的 JSON 进行了美化，以便在必要时更易于阅读。<br></br><strong>Paste below</strong> <br><strong>↓</strong></div><div class="code"></div></div><div data-enter class="import-btn animated infinite"><i class="fas fa-arrow-right"></i><i class="fas fa-times"></i></div></div>'
    ),
        (function () {
            var t = CodeMirror($("#import-box .code")[0], {
                mode: { name: "javascript", json: !0 },
                theme: "monokai",
                autofocus: !0,
                lineNumbers: !0,
            });
            t.on("change", function (a, i) {
                if ("paste" === i.origin)
                    try {
                        var n = t.getValue();
                        (e = n), t.getDoc().setValue(js_beautify(n, { indent_size: 2 }));
                    } catch (e) {}
                setTimeout(function () {
                    var e = $(window).height(),
                        t = $("#import-box"),
                        a = t.outerHeight(!0);
                    if (e < a + 20) {
                        var i = $(window).height() - (a - t.find(".CodeMirror").height()),
                            n = i - 40,
                            s = e < n ? i - 20 : n;
                        t.find(".code").css({ maxHeight: s });
                    }
                }, 10);
            });
        })(),
        $("#import-box")
            .find(".import-btn")
            .on("click", function () {
                var t;
                try {
                    var a = e.trim();
                    t = JSON.parse(a);
                } catch (e) {}
                if (void 0 === t) {
                    var i = $("#import-box");
                    i.find(".fa-arrow-right").hide(),
                        i.find(".import-btn").addClass("tada"),
                        setTimeout(function () {
                            i.find(".fa-arrow-right").show(), i.find(".import-btn").removeClass("tada");
                        }, 1900);
                } else
                    local_storage.remove("dialog"),
                        local_storage.set("dialog", t),
                        modal.remove(),
                        loadingScreen.init(null, function () {
                            location.reload();
                        });
            });
}),
    $("#toolbar .reset").on("click", resetDialog);
var sampleDialogData =
    '{"activeId":38,"items":{"item-0":{"id":0,"type":"Dialog","parentId":false,"style":{"text":"导入多个PDF页面","preferredSize":[0,0],"margins":16,"orientation":"row","spacing":10,"alignChildren":["left","top"],"varName":null,"windowType":"Dialog","creationProps":{"su1PanelCoordinates":false,"maximizeButton":false,"minimizeButton":false,"independent":false,"closeButton":true,"borderless":false,"resizeable":false},"enabled":true}},"item-1":{"id":1,"type":"Panel","parentId":20,"style":{"text":"Page Selection","preferredSize":[0,205],"margins":10,"orientation":"column","spacing":10,"alignChildren":["left","top"],"alignment":null,"varName":null,"creationProps":{"borderStyle":"etched","su1PanelCoordinates":false},"enabled":true}},"item-2":{"id":2,"type":"StaticText","parentId":1,"style":{"text":"Import PDF Pages:","justify":"left","preferredSize":[0,0],"alignment":null,"varName":null,"helpTip":null,"softWrap":false,"creationProps":{"truncate":"none","multiline":false,"scrolling":false},"enabled":true}},"item-3":{"id":3,"type":"EditText","parentId":6,"style":{"text":"1","preferredSize":[60,0],"alignment":null,"varName":null,"helpTip":null,"softWrap":false,"creationProps":{"noecho":false,"readonly":false,"multiline":false,"scrollable":false,"borderless":false,"enterKeySignalsOnChange":false},"enabled":true,"justify":"left"}},"item-4":{"id":4,"type":"StaticText","parentId":6,"style":{"text":"thru","justify":"left","preferredSize":[0,0],"alignment":null,"varName":null,"helpTip":null,"softWrap":true,"creationProps":{"truncate":"none","multiline":false,"scrolling":false},"enabled":true}},"item-5":{"id":5,"type":"EditText","parentId":6,"style":{"text":"1","preferredSize":[60,0],"alignment":null,"varName":null,"helpTip":null,"softWrap":false,"creationProps":{"noecho":false,"readonly":false,"multiline":false,"scrollable":false,"borderless":false,"enterKeySignalsOnChange":false},"enabled":true,"justify":"left"}},"item-6":{"id":6,"type":"Group","parentId":1,"style":{"preferredSize":[0,0],"margins":0,"orientation":"row","spacing":10,"alignChildren":["left","center"],"alignment":null,"varName":null,"enabled":true}},"item-7":{"id":7,"type":"StaticText","parentId":1,"style":{"text":"Start Placing on Doc Page:","justify":"left","preferredSize":[0,0],"alignment":null,"varName":null,"helpTip":null,"softWrap":false,"creationProps":{"truncate":"none","multiline":false,"scrolling":false},"enabled":true}},"item-8":{"id":8,"type":"Checkbox","parentId":1,"style":{"text":"Reverse Page Order","preferredSize":[0,0],"alignment":null,"varName":null,"helpTip":null,"enabled":true}},"item-9":{"id":9,"type":"Panel","parentId":20,"style":{"text":"Sizing Options","preferredSize":[0,160],"margins":10,"orientation":"column","spacing":10,"alignChildren":["left","top"],"alignment":null,"varName":null,"creationProps":{"borderStyle":"etched","su1PanelCoordinates":false},"enabled":true}},"item-10":{"id":10,"type":"Checkbox","parentId":9,"style":{"text":"Fit to Page","preferredSize":[0,0],"alignment":null,"varName":null,"helpTip":null,"enabled":true}},"item-11":{"id":11,"type":"Checkbox","parentId":9,"style":{"text":"Keep Proportions","preferredSize":[0,0],"alignment":null,"varName":null,"helpTip":null,"enabled":true}},"item-12":{"id":12,"type":"Checkbox","parentId":9,"style":{"text":"Bleed the Fit Page","preferredSize":[0,0],"alignment":null,"checked":true,"varName":null,"helpTip":null,"enabled":true}},"item-13":{"id":13,"type":"StaticText","parentId":9,"style":{"text":"Scale of Imported Page","justify":"left","preferredSize":[0,0],"alignment":null,"varName":null,"helpTip":null,"softWrap":false,"creationProps":{"truncate":"none","multiline":false,"scrolling":false},"enabled":true}},"item-14":{"id":14,"type":"Group","parentId":9,"style":{"preferredSize":[0,0],"margins":0,"orientation":"row","spacing":10,"alignChildren":["left","center"],"alignment":null,"varName":null,"enabled":true}},"item-15":{"id":15,"type":"EditText","parentId":14,"style":{"text":"100","preferredSize":[40,0],"alignment":null,"varName":null,"helpTip":null,"softWrap":false,"creationProps":{"noecho":false,"readonly":false,"multiline":false,"scrollable":false,"borderless":false,"enterKeySignalsOnChange":false},"enabled":true,"justify":"left"}},"item-16":{"id":16,"type":"StaticText","parentId":14,"style":{"text":"Y%:","justify":"left","preferredSize":[0,0],"alignment":null,"varName":null,"helpTip":null,"softWrap":false,"creationProps":{"truncate":"none","multiline":false,"scrolling":false},"enabled":true}},"item-17":{"id":17,"type":"EditText","parentId":14,"style":{"text":"100","preferredSize":[40,0],"alignment":null,"varName":null,"helpTip":null,"softWrap":false,"creationProps":{"noecho":false,"readonly":false,"multiline":false,"scrollable":false,"borderless":false,"enterKeySignalsOnChange":false},"enabled":true,"justify":"left"}},"item-18":{"id":18,"type":"StaticText","parentId":14,"style":{"text":"X%:","justify":"left","preferredSize":[0,0],"alignment":null,"varName":null,"helpTip":null,"softWrap":false,"creationProps":{"truncate":"none","multiline":false,"scrolling":false},"enabled":true}},"item-19":{"id":19,"type":"Group","parentId":0,"style":{"preferredSize":[0,0],"margins":0,"orientation":"column","spacing":10,"alignChildren":["fill","top"],"alignment":null,"varName":null,"enabled":true}},"item-20":{"id":20,"type":"Group","parentId":0,"style":{"preferredSize":[0,0],"margins":0,"orientation":"column","spacing":10,"alignChildren":["fill","top"],"alignment":null,"varName":null,"enabled":true}},"item-21":{"id":21,"type":"Panel","parentId":19,"style":{"text":"Positioning Options","preferredSize":[0,205],"margins":10,"orientation":"column","spacing":10,"alignChildren":["fill","top"],"alignment":null,"varName":null,"creationProps":{"borderStyle":"etched","su1PanelCoordinates":false},"enabled":true}},"item-22":{"id":22,"type":"StaticText","parentId":21,"style":{"text":"Position on Page Aligned From:","justify":"left","preferredSize":[0,0],"alignment":null,"varName":null,"helpTip":null,"softWrap":false,"creationProps":{"truncate":"none","multiline":false,"scrolling":false},"enabled":true}},"item-23":{"id":23,"type":"DropDownList","parentId":21,"style":{"listItems":"Top Left, Top Center, Top Right, Center Left, Center, Center Right, Bottom Left, Bottom Center, Bottom Right, -, Top - Relative to spine,  Center  - Relative to spine,  Right  - Relative to spine","preferredSize":[0,0],"alignment":null,"selection":0,"varName":null,"helpTip":null,"enabled":true}},"item-24":{"id":24,"type":"DropDownList","parentId":41,"style":{"listItems":"0, 90, 180, 270","preferredSize":[130,0],"alignment":null,"selection":0,"varName":null,"helpTip":null,"enabled":true}},"item-25":{"id":25,"type":"StaticText","parentId":21,"style":{"text":"Offset by:","justify":"left","preferredSize":[0,0],"alignment":null,"varName":null,"helpTip":null,"softWrap":false,"creationProps":{"truncate":"none","multiline":false,"scrolling":false},"enabled":true}},"item-26":{"id":26,"type":"Group","parentId":21,"style":{"preferredSize":[0,0],"margins":0,"orientation":"row","spacing":10,"alignChildren":["left","center"],"alignment":null,"varName":null,"enabled":true}},"item-27":{"id":27,"type":"StaticText","parentId":26,"style":{"text":"X:","justify":"left","preferredSize":[0,0],"alignment":null,"varName":null,"helpTip":null,"softWrap":false,"creationProps":{"truncate":"none","multiline":false,"scrolling":false},"enabled":true}},"item-28":{"id":28,"type":"EditText","parentId":26,"style":{"text":"0","preferredSize":[40,0],"alignment":null,"varName":null,"helpTip":null,"softWrap":false,"creationProps":{"noecho":false,"readonly":false,"multiline":false,"scrollable":false,"borderless":false,"enterKeySignalsOnChange":false},"enabled":true,"justify":"left"}},"item-29":{"id":29,"type":"StaticText","parentId":26,"style":{"text":"Y:","justify":"left","preferredSize":[0,0],"alignment":null,"varName":null,"helpTip":null,"softWrap":false,"creationProps":{"truncate":"none","multiline":false,"scrolling":false},"enabled":true}},"item-30":{"id":30,"type":"EditText","parentId":26,"style":{"text":"0","preferredSize":[40,0],"alignment":null,"varName":null,"helpTip":null,"softWrap":false,"creationProps":{"noecho":false,"readonly":false,"multiline":false,"scrollable":false,"borderless":false,"enterKeySignalsOnChange":false},"enabled":true,"justify":"left"}},"item-31":{"id":31,"type":"Panel","parentId":19,"style":{"text":"Placement Options","preferredSize":[0,160],"margins":10,"orientation":"column","spacing":10,"alignChildren":["fill","top"],"alignment":null,"varName":null,"creationProps":{"borderStyle":"etched","su1PanelCoordinates":false},"enabled":true}},"item-32":{"id":32,"type":"DropDownList","parentId":43,"style":{"listItems":"Art, Crop, Trim, Bleed, Media","preferredSize":[136,0],"alignment":null,"selection":0,"varName":null,"helpTip":null,"enabled":true}},"item-33":{"id":33,"type":"Checkbox","parentId":31,"style":{"text":"Place Pages on a New Layer","preferredSize":[0,0],"alignment":null,"varName":null,"helpTip":null,"enabled":true}},"item-34":{"id":34,"type":"Checkbox","parentId":31,"style":{"text":"Ignore Font and Image Errors","preferredSize":[0,0],"alignment":null,"varName":null,"helpTip":null,"enabled":true}},"item-35":{"id":35,"type":"Checkbox","parentId":31,"style":{"text":"Transparent PDF Background","preferredSize":[0,0],"alignment":null,"checked":true,"varName":null,"helpTip":null,"enabled":true}},"item-36":{"id":36,"type":"Group","parentId":0,"style":{"preferredSize":[0,0],"margins":0,"orientation":"column","spacing":10,"alignChildren":["fill","top"],"alignment":null,"varName":null,"enabled":true}},"item-37":{"id":37,"type":"Button","parentId":36,"style":{"text":"OK","justify":"center","preferredSize":[0,0],"alignment":null,"varName":"ok","helpTip":null,"enabled":true}},"item-38":{"id":38,"type":"Button","parentId":36,"style":{"text":"Cancel","justify":"center","preferredSize":[0,0],"alignment":null,"varName":"cancel","helpTip":null,"enabled":true}},"item-39":{"id":39,"type":"EditText","parentId":1,"style":{"text":"1","preferredSize":[60,0],"alignment":null,"varName":null,"helpTip":null,"softWrap":false,"creationProps":{"noecho":false,"readonly":false,"multiline":false,"scrollable":false,"borderless":false,"enterKeySignalsOnChange":false},"enabled":true,"justify":"left"}},"item-40":{"id":40,"type":"Checkbox","parentId":1,"style":{"text":"Map to Doc Pages","preferredSize":[0,0],"alignment":null,"varName":null,"helpTip":null,"enabled":true}},"item-41":{"id":41,"type":"Group","parentId":21,"style":{"enabled":true,"varName":null,"preferredSize":[0,0],"margins":0,"orientation":"row","spacing":10,"alignChildren":["left","center"],"alignment":null}},"item-42":{"id":42,"type":"StaticText","parentId":41,"style":{"enabled":true,"varName":null,"creationProps":{"truncate":"none","multiline":false,"scrolling":false},"softWrap":false,"text":"Rotation:","justify":"left","preferredSize":[0,0],"alignment":null,"helpTip":null}},"item-43":{"id":43,"type":"Group","parentId":31,"style":{"enabled":true,"varName":null,"preferredSize":[0,0],"margins":0,"orientation":"row","spacing":10,"alignChildren":["left","center"],"alignment":null}},"item-44":{"id":44,"type":"StaticText","parentId":43,"style":{"enabled":true,"varName":null,"creationProps":{"truncate":"none","multiline":false,"scrolling":false},"softWrap":false,"text":"Crop to:","justify":"left","preferredSize":[0,0],"alignment":null,"helpTip":null}}},"order":[0,20,1,2,6,3,4,5,8,7,39,40,9,10,11,12,13,14,18,15,16,17,19,21,22,23,41,42,24,25,26,27,28,29,30,31,43,44,32,33,34,35,36,37,38],"settings":{"importJSON":true,"indentSize":false,"cepExport":false,"includeCSSJS":true,"functionWrapper":false,"compactCode":false,"showDialog":true}}';
$("#toolbar .sample-dialog").on("click", function () {
    modal.init(
        '<div id="reset-box"><h2>Sample Dialog.jsx</h2><span class="text">您确定要用示例<strong>替换</strong> <br>当前工程吗？</span><span class="yes" data-enter>加载示例</span><span class="no">取消</span></div>'
    );
    var e = $("#reset-box");
    e.find(".yes").on("click", function () {
        modal.remove(),
            setTimeout(function () {
                local_storage.remove("dialog"),
                    local_storage.set("dialog", JSON.parse(sampleDialogData)),
                    modal.remove(),
                    loadingScreen.init(null, function () {
                        location.reload();
                    });
            }, 300);
    }),
        e.find(".no").on("click", function () {
            modal.remove();
        });
}),
    $(".grey-out-active").on("click", function () {
        $(this).hasClass("off")
            ? ($(this).removeClass("off"),
              $("#dialog").removeClass("hide-active"),
              notification("info", "Active item highlighted in the dialog preview.", 3.5))
            : ($(this).addClass("off"),
              $("#dialog").addClass("hide-active"),
              notification("meh", "Active item grayed out in the dialog preview.", 3.5));
    }),
    $('<div id="notifications-wrap"></div>').appendTo("#dialog-overlay-wrap");
var contextMenu = {
    opt: {
        notificationTimer: function (e) {
            var t = 0.5 * e;
            return (t = (t < 2 ? 2 : t) + 0.4);
        },
    },
    init: function () {
        $(window)
            .on("contextmenu", function (e) {
                var t = $(e.target).closest("[data-item-id]");
                contextMenu.close(), t.length > 0 && (e.preventDefault(), contextMenu.create(e, t));
            })
            .on("click", function (e) {
                $("#context-menu").length > 0 && $(e.target).closest("#context-menu").length < 1 && contextMenu.close();
            });
    },
    create: function (e, t) {
        var a = $(contextMenu.menuHTML).appendTo("body");
        a.css({ top: e.pageY, left: e.pageX });
        var i = t.data("item-id");
        t.addClass("context-menu-target"),
            a.attr("data-context-id", i),
            hideItem.contextMenu.onShow(t.data("item-id")),
            a.find("li").on("click", function () {
                var e = $(this).data("action"),
                    a = $(this).data("func");
                contextMenu[e][a]($(this), t), contextMenu.close();
            }),
            a.show();
    },
    close: function () {
        var e = $("#context-menu");
        e.length > 0 && (e.remove(), $(".context-menu-target").removeClass("context-menu-target"));
    },
    menuHTML:
        '<ul id="context-menu" class="animated fadeInDown"><li class="item-hide" data-action="item" data-func="hide">Toggle visibility</li><li class="copy-find-element" data-action="get" data-func="findElement"><i class="far fa-clipboard"></i> Copy findElement()</li><li class="copy-variable-name" data-action="get" data-func="varName"><i class="far fa-clipboard"></i> Copy variable name</li><li class="copy-path" data-action="get" data-func="path"><i class="far fa-clipboard"></i> Copy item path</li></ul>',
    get: {
        path: function (e, t, a) {
            customVar.init();
            var i = "",
                n = "",
                s = t.parents("[data-item-id]"),
                l = s.add(t);
            if (
                (0 == t.data("item-id") && 0 === s.length
                    ? ((i += customVar.names[0]), (n += '<span class="highlight">' + customVar.names[0] + "</span>"))
                    : l.each(function (e) {
                          var t = $(this).data("item-id"),
                              a = 0 === e,
                              s = e === l.length - 1,
                              o = customVar.names[t];
                          "TreeItem" === $(this).data("item-type") && (o = "items[" + $(this).index() + "]"),
                              (i += (a ? "" : ".") + o),
                              (n +=
                                  (a ? "" : '<wbr><span class="fade">.</span>') +
                                  ((a && '<span class="highlight-3">' + o + "</span>") || (s && '<span class="highlight">' + o + "</span>") || o));
                      }),
                "export" === a)
            )
                return i;
            clipboard.set(i, function () {
                notification("clipboard", n, contextMenu.opt.notificationTimer(l.length));
            });
        },
        findElement: function (e, t, a) {
            customVar.init();
            var i = "",
                n = "",
                s = t.data("item-id"),
                l = customVar.names[0],
                o = customVar.names[s],
                r = contextMenu.get.familyTree(t);
            if (
                (0 == s
                    ? ((i = l), (n = '<span class="highlight">' + l + "</span>"))
                    : r
                    ? ((i = r[0]), (n = r[1]))
                    : ((i = l + '.findElement("' + o + '")'),
                      (n =
                          '<span class="highlight-3">' +
                          l +
                          '</span><wbr><span class="fade">.</span>findElement("<span class="highlight">' +
                          o +
                          '</span>")')),
                "export" === a)
            )
                return i;
            clipboard.set(i, function () {
                notification("clipboard", n, contextMenu.opt.notificationTimer(void 0 === r[2] ? (0 === s ? 1 : 3) : r[2]));
            });
        },
        varName: function (e, t, a) {
            customVar.init();
            var i = t.data("item-id"),
                n = customVar.names[i];
            if ("export" === a) return n;
            clipboard.set(n, function () {
                notification("clipboard", '<span class="highlight">' + n + "</span>", contextMenu.opt.notificationTimer(1));
            });
        },
        familyTree: function (e) {
            var t,
                a = 2,
                i = $('[data-panel="treeview"]'),
                n = e.data("item-id"),
                s = n,
                l = e.data("item-type"),
                o = "",
                r = "";
            return (
                "TreeItem" === l
                    ? (!(function e(t, n) {
                          ++a;
                          var l = i.find('li[data-item-id="' + n + '"]');
                          if (l.data("item-type") !== t) {
                              var d = n === s ? ['<span class="highlight">', "</span>"] : ["", ""];
                              (o = ".items[" + l.index() + "]" + o),
                                  (r = '<wbr><span class="fade">.</span>' + d[0] + "items[" + l.index() + "]" + d[1] + r),
                                  e(t, l.data("item-parent-id"));
                          } else
                              (o = customVar.names[0] + '.findElement("' + customVar.names[n] + '")' + o),
                                  (r =
                                      '<span class="highlight-3">' +
                                      customVar.names[0] +
                                      '</span><wbr><span class="fade">.</span>findElement("<span class="highlight-2">' +
                                      customVar.names[n] +
                                      '</span>")' +
                                      r);
                      })("TreeView", n),
                      (t = [o, r, a]))
                    : (t = !1),
                t
            );
        },
    },
    item: {
        hide: function (e, t) {
            hideItem.contextMenu.onClick(e, t);
        },
    },
};
contextMenu.init(),
    $(".panel-wrap .panel-title, .panel-wrap .collapse, .panel-wrap .label").on("click", function () {
        var e, t, a;
        (e = $(this)),
            (t = e.parent()),
            (a = t.hasClass("collapse") ? "removeClass" : "addClass"),
            t.hasClass("collapse") && snapshot.openPanel(),
            t[a]("collapse"),
            $("#dialog-section").backstretch("resize");
    });
var dangerZone = {
        set: function (e, t, a) {
            var i = e.dataItem.type,
                n = e.value,
                s = n[0] || n,
                l = n[1],
                o = s > 0,
                r = l > 0,
                d = t,
                p = Math.round(d.width()),
                c = Math.round(d.height()) - ("Dialog" === i ? Math.round($("#dialog-title-bar").outerHeight()) : 0),
                m = $("#panel-edit-style-wrap"),
                u = a ? m.find(a) : m.find(".number.width"),
                f = m.find(".number.height"),
                g = "danger-zone";
            o && !u.hasClass(g) && s < p ? u.addClass(g) : ((u.hasClass(g) && !o) || (u.hasClass(g) && s >= p)) && u.removeClass(g),
                r && !f.hasClass(g) && l < c ? f.addClass(g) : ((f.hasClass(g) && !r) || (f.hasClass(g) && l >= c)) && f.removeClass(g);
        },
    },
    forceSize = {
        onUpdate: function (e, t) {
            $("#dialog")
                .find([".static-text", ".edit-text", ".list-box", ".tree-view"].join(", "))
                .each(function () {
                    var e = $(this),
                        a = e.data("item-id"),
                        i = {};
                    (i.active = t.items["item-" + a]), (i.parent = t.items["item-" + i.active.parentId]);
                    var n = "fill" !== i.parent.style.alignChildren[0],
                        s = "fill" !== i.parent.style.alignChildren[1],
                        l = i.active.style.preferredSize[0],
                        o = i.active.style.preferredSize[1],
                        r = 0 !== l,
                        d = 0 !== o,
                        p = "fill" !== i.active.style.alignment;
                    r && n && p ? e.width(l) : "auto" !== e.width() && e.width("auto"),
                        d && s && p ? e.height(o) : "auto" !== e.height() && e.height("auto");
                });
        },
    },
    hideItem = {
        hiddenClass: "sdb-hidden",
        onCreate: function (e) {
            if (local_storage.get("dialog").items["item-" + e].hidden) {
                var t = $('#dialog [data-item-id="' + e + '"]');
                "Tab" === t.data("item-type") && $('#dialog [data-tab-id="' + e + '"]').addClass(hideItem.hiddenClass),
                    t.addClass(hideItem.hiddenClass),
                    $('[data-panel="treeview"] [data-item-id="' + e + '"]').addClass(hideItem.hiddenClass);
            }
        },
        contextMenu: {
            onShow: function (e) {
                if (0 != e) {
                    var t = local_storage.get("dialog").items["item-" + e].hidden
                        ? '<i class="far fa-eye"></i> Show'
                        : '<i class="far fa-eye-slash"></i> Hide';
                    $("#context-menu .item-hide").html(t + " item");
                } else $("#context-menu .item-hide").remove();
            },
            onClick: function (e, t) {
                var a = t.data("item-id");
                if (0 !== a) {
                    var i = "dialog",
                        n = local_storage.get(i),
                        s = n.items["item-" + a],
                        l = s.hidden,
                        o = $('#dialog [data-item-id="' + a + '"]'),
                        r = $('[data-panel="treeview"] [data-item-id="' + a + '"]');
                    l
                        ? (delete s.hidden, o.removeClass(hideItem.hiddenClass), r.removeClass(hideItem.hiddenClass))
                        : ((s.hidden = !0), o.addClass(hideItem.hiddenClass), r.addClass(hideItem.hiddenClass)),
                        "Tab" === s.type && tab.onHideToggle(l, hideItem.hiddenClass, s, n),
                        local_storage.set(i, n);
                }
            },
        },
        onExport: function (e) {
            return e.hidden || $('[data-panel="treeview"] [data-item-id="' + e.id + '"]').closest(".sdb-hidden").length > 0 ? "// " : "";
        },
    };
window.location.href.lastIndexOf("load=sample") > -1 && (local_storage.remove("dialog"), local_storage.set("dialog", JSON.parse(sampleDialogData)));
var data = local_storage.get("dialog");
if (null === data) {
    var params = { id: 0, type: "Dialog", parentId: !1, target: $("#panel-tree-view-wrap .contents"), event: "load" };
    item.funnel.create(params);
} else {
    $.inArray(data.activeId, data.order) < 0 && data.order.push(data.activeId);
    var oldActiveId = data.activeId;
    $.each(data.order, function (e, t) {
        var a = data.items["item-" + t],
            i = $("#panel-tree-view-wrap"),
            n = {
                id: t,
                type: a.type,
                parentId: a.parentId,
                target: 0 === t ? i.find(".contents") : i.find('[data-item-id="' + a.parentId + '"] > ul'),
                event: "loadFromLocalStorage",
            };
        item.funnel.create(n),
            a.collapsed &&
                ($('[data-panel="treeview"] [data-item-id="' + t + '"]').addClass("collapsed"),
                $('<img class="collapsed-icon" src="assets/images/parent-collapsed.svg">').appendTo(
                    '[data-panel="treeview"] [data-item-id="' + t + '"]'
                ));
    }),
        $.each(data.order, function (e, t) {
            void 0 !== data.items["item-" + t].style.preferredSize &&
                (item.activate(t), item.update.style.dialogPreview("preferredSize", data, data.items["item-" + t], "loadFromLocalStorage"));
        }),
        item.activate(oldActiveId);
    var oldItem = (data = local_storage.get("dialog")).items["item-" + oldActiveId];
    edit_style_panel.build(oldItem.style, "loadFromLocalStorage");
}
settings.setDefaults(data);
var cep = {
    fetch: {
        dependencies: function () {
            var e = { version: 2.1, cache: !0 },
                t = "sdb-cep-dependencies",
                a = local_storage.get(t) || {};
            cep.fetch.css(e, function (i) {
                cep.fetch.js(e, function (e) {
                    (a.css = i), (a.js = e), local_storage.set(t, a);
                });
            });
        },
        css: function (e, t) {
            var a = "";
            jQuery.ajax({
                cache: e.cache,
                url: "https://scriptui.joonas.me/assets/css/sdb.cep.css?v=" + e.version,
                success: function (e) {
                    var i = $("<style/>");
                    i.text(getFonts() + e), (a += i.prop("outerHTML").replace("\n", "")), i.remove(), t(a);
                },
                error: function () {
                    var e = $("<link/>");
                    e.attr("href", "ScriptUI-Dialog-Builder-Joonas-master/build/assets/css/sdb.cep.css"),
                        (a += e.prop("outerHTML")),
                        e.remove(),
                        t(a);
                },
            });
        },
        js: function (e, t) {
            var a = $("<script/>"),
                i = "";
            jQuery.ajax({
                cache: e.cache,
                url: "https://scriptui.joonas.me/assets/js/sdb.cep.js?v=" + e.version,
                success: function (e) {
                    a.text(e), (i += a.prop("outerHTML")), a.remove(), t(i);
                },
                error: function () {
                    a.attr("src", "ScriptUI-Dialog-Builder-Joonas-master/build/assets/js/sdb.cep.js"), (i += a.prop("outerHTML")), a.remove(), t(i);
                },
            });
        },
    },
};
if ((cep.fetch.dependencies(), "Google Inc." !== window.navigator.vendor)) {
    var chromeRestriction_modal =
        '<div id="chrome-restrictions-modal" style="max-width: 400px; border-radius: 4px; background-clip: padding-box; box-shadow: 0 0 30px rgba(0,0,0,0.5); background: #474747; text-align:center; color: #dedede; font-family: Source Sans Pro, sans-serif; font-size: 14px; line-height: 15px; font-weight: 400; color: #c7c6c6;"><h2>Browser Police.jsx</h2><div style="margin: 40px 60px;"><img style=" max-width: 50px;" src=" data:image/png;base64,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" alt="" /><h3 style=\'font-weight: normal; font-size: 20px; line-height: 24px; color: #fff;\'>Hold up! It looks like you are not using Google Chrome</span>!</h3><p>Unfortunately this web app is designed <br>to work in desktop <strong>Chrome only</strong>.</p><div style="background: #474747; display: inline-block; border-radius: 4px; padding: 20px; margin-top: 10px; border: 1px solid #383838; font-size: 12px; font-weight: normal;"><div><span style="color: #fee13c;">You should switch to Chrome</span><br /><span style="color: #a3a3a3;">or try the <a target="_blank" style="color: #a3a3a3; text-decoration: underline;" href="https://github.com/joonaspaakko/ScriptUI-Dialog-Builder-Joonas#desktop-applications--chrome-app">pseudo desktop app</a>.</span></div></div><br><a style="display: inline-block; margin-top: 10px; font-size: 12px; font-weight: normal; color: #a3a3a3; text-decoration: underline;" href="https://github.com/joonaspaakko/ScriptUI-Dialog-Builder-Joonas">SDB in Github</a></div></div>';
    modal.init(chromeRestriction_modal, "export-modal"),
        $("#modal-window-overlay").off("click"),
        $("#chrome-restriction").on("click", function () {
            modal.remove();
        });
}
var treeElem = $("#panel-tree-view-wrap"),
    dialog = $("#dialog");
$("#panel-tree-view-wrap").on("mouseenter mouseleave", ".item-text", function (e) {
    var t = $(this).parent("li"),
        a = t.data("item-id"),
        i = dialog.find('[data-item-id="' + a + '"]');
    "Tab" === t.data("item-type") &&
        ((i = dialog.find('[data-tab-id="' + a + '"]')),
        "VerticalTabbedPanel" === t.parent("ul").parent("li").data("item-type") && (i = i.add(dialog.find('[data-item-id="' + a + '"]'))));
    "mouseenter" === e.type ? i.addClass("ghosting") : i.removeClass("ghosting");
}),
    treeElem.on("dblclick", 'li[data-parent="true"] > .item-text, li[data-parent="true"] > .collapsed-icon', function () {
        var e = $(this).parent("li"),
            t = e.hasClass("collapsed"),
            a = e.data("item-id"),
            i = local_storage.get("dialog"),
            n = i.items["item-" + a];
        e[(t ? "remove" : "add") + "Class"]("collapsed"),
            t
                ? (e.find("> .collapsed-icon").remove(), null != n.collapsed && delete n.collapsed)
                : ((n.collapsed = !0), $('<img class="collapsed-icon" src="assets/images/parent-collapsed.svg">').appendTo(e)),
            local_storage.set("dialog", i),
            $("#dialog-section").backstretch("resize");
    }),
    treeElem.on("click", ".item-text", function () {
        var e = $(this).parent("li").data("item-id");
        item.activate(e);
        var t = local_storage.get("dialog");
        edit_style_panel.build(t.items["item-" + e].style);
    }),
    treeElem.on("click", ".remove-item", function () {
        var e = $(this).parent("li").data("item-id");
        0 === e ? resetDialog() : item.funnel.remove(e);
    });
var treeRootUl = $("#panel-tree-view-wrap .tree-root > ul"),
    treeDialog = $("#panel-tree-view-wrap .tree-dialog");
treeRootUl.sortable({
    group: "dialog-items",
    vertical: !0,
    distance: 4,
    delay: 100,
    tolerance: -3,
    isValidTarget: function (e, t) {
        var a = !0,
            i = tab.onDragValid(e, t),
            n = treeView.onDragValid(e, t);
        return (i || n) && (a = !1), t.el.parent("li").hasClass("collapsed") && (a = !1), a;
    },
    onDragStart: function (e, t, a, i) {
        treeDialog.width(treeDialog.width()),
            e.find(".item-text").length > 0
                ? (tab.onStartSort(e), i.altKey && (e.clone().insertAfter(e).addClass("dolly"), $("body").addClass("duplicate-item")))
                : t.options.drop || e.clone(!0).insertAfter(e),
            a(e, t);
    },
    onDrop: function (e, t, a) {
        if ((treeDialog.width("auto"), t.target.closest("#panel-new-item-wrap").length > 0)) e.remove();
        else {
            var i = e.find(".item-text").length > 0,
                n = $("body").hasClass("duplicate-item");
            i && !n ? item.drag.sort(e) : i && n ? item.drag.duplicate(e, t) : item.drag.make(e);
        }
        a(e, t);
    },
}),
    $("#panel-new-item-wrap ul").sortable({ drop: !1, group: "dialog-items" }),
    (item.drag = {}),
    (item.drag.sort = function (e) {
        var t = e.parent("ul").parent("li").data("item-id"),
            a = e.prev(),
            i = a.length > 0 ? "insertAfter" : "prependTo",
            n = a.length > 0 ? a.data("item-id") : t;
        e.attr("item-parent-id", t), e.data({ "item-parent-id": t });
        var s = e.data("item-type"),
            l = e.data("item-id");
        item.funnel.sort(l, t, s, i, n), item.activate(l);
        var o = local_storage.get("dialog");
        item.update.style.treeViewAll(o), edit_style_panel.build(o.items["item-" + l].style), tab.onSort(e), treeViewItem.onSort(e, s, l);
    }),
    (item.drag.make = function (e) {
        var t = e.prev(),
            a = e.parent("ul"),
            i = t.length < 1,
            n = t.data("parent"),
            s = i ? a : t,
            l = {
                id: item.get.id(),
                type: e.data("item-type"),
                parentId: i ? a.parent("li").data("item-id") : t.data("item-parent-id"),
                target: s,
                previousIsParent: n,
                event: "drag",
            };
        e.remove(), item.funnel.create(l);
    }),
    (item.drag.duplicate = function (e, t) {
        var a = e.prev(),
            i = e.parent("ul"),
            n = a.length < 1,
            s = a.data("parent"),
            l = n ? i : a;
        $("body").removeClass("duplicate-item"), $("#panel-tree-view-wrap .dolly").removeClass("dolly"), e.remove();
        var o,
            r = local_storage.get("dialog"),
            d = $("#panel-tree-view-wrap"),
            p = {};
        e
            .find("[data-item-id]")
            .add(e)
            .each(function (e) {
                var a = $(this).data("item-id"),
                    i = r.items["item-" + a],
                    n = item.get.id(),
                    c = 0 === e ? t.target.parent("li").data("item-id") : p["parent-" + i.parentId];
                $(this).data("parent") && (p["parent-" + a] = n);
                var m = {
                    id: n,
                    type: i.type,
                    parentId: c,
                    target: 0 === e ? l : d.find('[data-item-id="' + c + '"] > ul'),
                    event: 0 === e ? "drag-duplicate" : "loadFromLocalStorage",
                    previousIsParent: s,
                    sourceId: a,
                };
                0 === e && (o = m.id), item.funnel.create(m);
            }),
            item.activate(o),
            (r = local_storage.get("dialog")),
            item.update.style.treeViewAll(r);
        var c = r.items["item-" + o];
        edit_style_panel.build(c.style), $("body").removeClass("dragging");
    });
var dialogElem = $("#dialog");
dialogElem.on("focus", "[contenteditable]", function () {
    var e = $(this),
        t = (e.parent().attr("id"), e.hasClass("tab")),
        a = e.parent().hasClass("tab"),
        i = (t && e.data("tab-id")) || (a && e.parent().data("tab-id")) || e.closest("[data-item-id]").data("item-id");
    item.activate(i, "dialog-preview");
    var n = local_storage.get("dialog");
    edit_style_panel.build(n.items["item-" + i].style, "dialog");
}),
    dialogElem.on("focus blur", '[data-item-type="EditText"] [contenteditable]', function (e) {
        "focusin" === e.type ? $(this).parent().parent().addClass("focused") : dialogElem.find(".focused").removeClass("focused");
    }),
    dialogElem.on("click", '[data-item-type="EditText"]', function (e) {
        e.preventDefault(), $(this).find("[contenteditable]").focus();
    }),
    dialogElem.on(
        "click",
        '[data-item-type="Image"], [data-item-type="IconButton"] img, [data-item-type="Slider"], [data-item-type="Progressbar"]',
        function () {
            var e = $(this),
                t = $(this).closest("[data-item-type]");
            t.length > 0 && (e = t);
            var a = e.data("item-id");
            item.activate(a, "dialog-preview");
            var i = local_storage.get("dialog");
            edit_style_panel.build(i.items["item-" + a].style);
        }
    ),
    dialogElem
        .on("keydown", "[contenteditable]", function (e) {
            var t = 9 === (e.keyCode ? e.keyCode : e.which);
            return (
                (($(this).is("[contenteditable]:last") && !e.shiftKey && t) || ($(this).is("[contenteditable]:first") && e.shiftKey && t)) &&
                    e.preventDefault(),
                lineBreakIntercept(e)
            );
        })
        .on("keyup", "[contenteditable]", function () {
            var e = $('#panel-edit-style-wrap [data-edit="text"]'),
                t = $(this).html().replace(/<br>$/, "").split("<br>").join("\n");
            e.html(t);
            var a = $(this).closest("[data-item-type]").hasClass("static-text"),
                i = $(this).closest("[data-item-type]").hasClass("edit-text");
            if (a || i) {
                var n = $(this).height(),
                    s = !1;
                ((a && n > 25.5) || (i && n > 22.5)) && (s = !0), s ? $(this).addClass("multiline") : $(this).removeClass("multiline");
            }
            autosize.update(e);
            item.funnel.update("text", "dialog");
        })
        .on("paste", "[contenteditable]", function (e) {
            e.preventDefault(),
                notification(
                    "meh",
                    "Sorry, you can't paste text here. <br> The textarea in Item Properties Panel has been focused, paste there instead.",
                    5.5
                ),
                $('#panel-edit-style-wrap [data-edit="text"]').focus();
        }),
    $("#dialog-title-bar div").on("blur", function () {
        var e = $(this);
        e.css({ whiteSpace: "normal" }),
            setTimeout(function () {
                e.css({ whiteSpace: "nowrap" });
            }, 0.1);
    });
//# sourceMappingURL=dialog.builder.js.map