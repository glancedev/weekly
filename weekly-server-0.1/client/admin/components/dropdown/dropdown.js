! function(e, t) {
    "use strict";
    var i = t.module("ng.bs.dropdown", []);
    i.constant("bsDropdownCfg", {
        display: "DropDown",
        disabled: !1,
        divider: [],
        disabledItems: []    
    }), i.run(["$templateCache", function(e) {
        e.put("bsDropdown/templates/defaultTemplate.html", ['<div class="dropdown">', '<button class="btn btn-default dropdown-toggle" style="width:160px; text-align:left;" type="button" id="bsDropDown" data-toggle="dropdown" aria-expanded="true">', "{{showText}}", '<span class="caret" style="float:right; margin-top:8px;"></span>', "</button>", '<ul class="dropdown-menu" role="menu" aria-labelledby="bsDropDown">', "<li role='presentation' ng-repeat='item in _bsDropdownItems' ng-class='{divider:item.isDivider, disabled: item.isDisabled}'>", '<a ng-if="!item.isDivider" role="menuitem" tabindex="-1" href="" ng-click="selectItem(item)">{{item.text}}</a>', "</li>", "</ul>", "</div>"].join("")), e.put("bsDropdown/templates/multiSelectTemplate.html", ['<div class="dropdown">', '<button class="btn btn-default dropdown-toggle" type="button" id="bsDropDown" data-toggle="dropdown" aria-expanded="true">', "{{showText}}", '<span class="caret"></span>', "</button>", '<ul class="dropdown-menu" role="menu" aria-labelledby="bsDropDown">', "<li role='presentation' ng-repeat='item in _bsDropdownItems' ng-class='{divider:item.isDivider, disabled: item.isDisabled}'>", '<a ng-if="!item.isDivider" role="menuitem" tabindex="-1" href="" ng-click="selectItem(item)">', '<input type="checkbox" ng-checked="item.checked"/> {{item.text}}', "</a>", "</li>", "</ul>", "</div>"].join(""))
    }]), i.controller("bsDropdownController", ["$scope", "$element", "$attrs", function(e) {
        var i, n = this;
        this.init = function(d) {
            i = d, i.$render = function() {
                var d = t.isDefined(e.selected);
                d && i.$setViewValue(e.selected), n.$render(i.$viewValue), e.multiSelect && (d || (e.selected = i.$viewValue), n.checkMultiOptions())
            }
        }, this.checkMultiOptions = function() {
            for (var t = 0; t < e._bsDropdownItems.length; t++) {
                var i = e._bsDropdownItems[t];
                e._bsDropdownItems[t].checked = -1 != e.selected.indexOf(i.text) ? !0 : !1
            }
        }, e.selectItem = function(t) {
            var n = t.text;
            if (!t.isDisabled) {
                if (e.multiSelect) {
                    var d = -1;
                    if (-1 == (d = e.selected.indexOf(n))) {
                        for (var s = [], o = 0; o < e.selected.length; o++) s.push(e.selected[o]);
                        s.push(n), e.selected = s
                    } else {
                        for (var s = [], o = 0; o < e.selected.length; o++) o != d && s.push(e.selected[o]);
                        e.selected = s
                    }
                } else e.selected = n;
                i.$render()
            }
        }
    }]), i.directive("bsDropdown", ["bsDropdownCfg", function(e) {
        return {
            scope: {
                bsDropdownItems: "="
            },
            require: ["bsDropdown", "?ngModel"],
            controller: "bsDropdownController",
            templateUrl: function(e, i) {
                return t.isDefined(i.bsDropdownMulti) ? "bsDropdown/templates/multiSelectTemplate.html" : "bsDropdown/templates/defaultTemplate.html"
            },
            link: function(i, n, d, s) {
                function o() {
                    var e = (+new Date + Math.floor(999999 * Math.random())).toString(36);
                    n.find("#bsDropDown").attr("id", e), n.find(".dropdown-menu").attr("aria-labelledby", e), l(c), i.disabled && n.find("button").addClass("disabled")
                }

                function l(e) {
                    var n = e;
                    t.isArray(n) && (n = 0 == n.length ? null : n.join()), i.showText = null !== n ? n : c
                }

                function r() {
                    for (var e = [], t = 0, n = 0; n < i.bsDropdownItems.length; n++) {
                        var d = -1 != i.divider.indexOf(n),
                            s = -1 != i.disabledItems.indexOf(n),
                            o = i.bsDropdownItems[n];
                        if (d) {
                            var l = a(t++, o, !d, s),
                                r = a(t++, null, d, !1);
                            e.push(l), e.push(r)
                        } else {
                            var l = a(t++, o, d, s);
                            e.push(l)
                        }
                    }
                    return e
                }

                function a(e, t, i, n) {
                    return {
                        _k: e,
                        text: t,
                        isDivider: i,
                        isDisabled: n
                    }
                }
                var p = s[0],
                    b = s[1],
                    c = t.isDefined(d.bsDropdownDisplay) ? d.bsDropdownDisplay : e.display;
                i._bsDropdownItems = i.bsDropdownItems, i.divider = t.isDefined(d.bsDropdownDivider) ? i.$eval(d.bsDropdownDivider) : e.divider, i.disabledItems = t.isDefined(d.bsDropdownItemDisabled) ? i.$eval(d.bsDropdownItemDisabled) : e.disabledItems, i.disabled = t.isDefined(d.bsDropdownDisabled) ? i.$eval(d.bsDropdownDisabled) : e.disabled, i.multiSelect = t.isDefined(d.bsDropdownMulti), p.init(b), p.$render = function(e) {
                    l(e)
                }, i._bsDropdownItems = r(), o()
            },
            restrict: "AE"
        }
    }])
}(window, window.angular);