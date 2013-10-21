// emile.js (c) 2009 Thomas Fuchs
// Licensed under the terms of the MIT license.

(function (animate, container) {
    var parse = function (value) {
            value = value.toString();

            var v = parseFloat(value),
                    isVBad = isNaN(v),
                    u = value.replace(/^[-\d\.]+/, '');

            return { value: (isVBad) ? u : v, unit: (isVBad) ? 'color' : u };
        },
        normalize = function (style) {
            var css,
                rules = {},
                props = [
                    'backgroundColor',
                    'borderBottomColor',
                    'borderBottomWidth',
                    'borderLeftColor',
                    'borderLeftWidth',
                    'borderRightColor',
                    'borderRightWidth',
                    'borderSpacing',
                    'borderTopColor',
                    'borderTopWidth',
                    'bottom',
                    'color',
                    'filter',
                    'fontSize',
                    'fontWeight',
                    'height',
                    'left',
                    'letterSpacing',
                    'lineHeight',
                    'marginBottom',
                    'marginLeft',
                    'marginRight',
                    'marginTop',
                    'maxHeight',
                    'maxWidth',
                    'minHeight',
                    'minWidth',
                    'opacity',
                    'outlineColor',
                    'outlineOffset',
                    'outlineWidth',
                    'paddingBottom',
                    'paddingLeft',
                    'paddingRight',
                    'paddingTop',
                    'right',
                    'textIndent',
                    'top',
                    'width',
                    'wordSpacing',
                    'zIndex'
                ],
                i = props.length,
                v,
                parseEl = document.createElement('div');

            parseEl.innerHTML = '<div style="' + style + '"></div>';
            css = parseEl.childNodes[0].style;
            while (i--) {
                (v = css[props[i]]) && (rules[props[i]] = parse(v));
            }

            return rules;
        },
        color = function (source, target, pos) {
            var c,
                j,
                tmp,
                i = 2,
                v = [],
                r = [],
                s = function (s, p, c) { return s.substr(p, c || 1); };

            while (j = 3, c = arguments[i - 1], i--) {
                if (s(c, 0) === 'r') {
                    c = c.match(/\d+/g);
                    while (j--) {
                        v.push(~ ~c[j]);
                    }
                } else {
                    (c.length === 4) && (c = '#' + s(c, 1) + s(c, 1) + s(c, 2) + s(c, 2) + s(c, 3) + s(c, 3));
                    while (j--) {
                        v.push(parseInt(s(c, 1 + (j * 2), 2), 16));
                    }
                }
            }
            while (j--) {
                tmp = ~ ~(v[j + 3] + (v[j] - v[j + 3]) * pos);
                r.push(tmp < 0 ? 0 : tmp > 255 ? 255 : tmp);
            }

            return 'rgb(' + r.join(',') + ')';
        },
        filter = function (source, target, pos) {
            var strip = function (v) {
                return parseInt(v.replace('alpha(opacity=', ''), 10);
            },
                t = strip(target),
                s = strip(source),
                n = parseInt((t > s) ? (s + (pos * 100)) : (s - (pos * 100)), 10);

            return 'alpha(opacity=' + n + ');';
        };

    container[animate] = function (el, style, opts) {
        el = (typeof el == 'string') ? document.getElementById(el) : el;
        opts = opts || {};

        var target = normalize(style),
            comp = el.currentStyle || getComputedStyle(el, null),
            prop,
            current = {},
            start = (+new Date),
            dur = opts.duration || 200,
            finish = start + dur,
            interval,
            easings = {
                bounce: function (pos) {
                    if (pos < (1 / 2.75)) {
                        return (7.5625 * pos * pos);
                    } else if (pos < (1.5 / 2.75)) {
                        return (7.5625 * (pos -= (1.5 / 2.75)) * pos + 0.75);
                    } else if (pos < (2 / 2.75)) {
                        return (7.5625 * (pos -= (1.5 / 2.75)) * pos + 0.75);
                    } else if (pos < (2.5 / 2.75)) {
                        return (7.5625 * (pos -= (2.25 / 2.75)) * pos + 0.9375);
                    } else {
                        return (7.5625 * (pos -= (2.625 / 2.75)) * pos + 0.984375);
                    }
                },
                linear: function (pos) {
                    return pos;
                },
                powIn: function (pos) {
                    return Math.pow(pos, 6);
                },
                powOut: function (pos) {
                    return 1 - easings.powIn(1 - pos);
                },
                expoIn: function (pos) {
                    return Math.pow(2, 8 * (pos - 1));
                },
                expoOut: function (pos) {
                    return 1 - easings.expoIn(1 - pos);
                },
                circIn: function (pos) {
                    return 1 - Math.sin(Math.acos(pos));
                },
                circOut: function (pos) {
                    return 1 - easings.circIn(1 - pos);
                },
                sineIn: function (pos) {
                    return 1 - Math.sin((1 - pos) * Math.PI / 2);
                },
                sineOut: function (pos) {
                    return 1 - easings.sineIn(1 - pos);
                },
                backIn: function (pos) {
                    return Math.pow(pos, 2) * (2.618 * pos - 1.618);
                },
                backOut: function (pos) {
                    return 1 - easings.backIn(1 - pos);
                },
                elasticIn: function (pos) {
                    return Math.pow(2, 10 * --pos) * Math.cos(20 * pos * Math.PI * 1 / 3);
                },
                elasticOut: function (pos) {
                    return 1 - easings.elasticIn(1 - pos);
                },
                quadIn: function (pos) { return Math.pow(pos, [0 + 2]); },
                quadOut: function (pos) { return 1 - easings.quadIn(1 - pos); },
                cubicIn: function (pos) { return Math.pow(pos, [1 + 2]); },
                cubicOut: function (pos) { return 1 - easings.cubicIn(1 - pos); },
                quartIn: function (pos) { return Math.pow(pos, [2 + 2]); },
                quartOut: function (pos) { return 1 - easings.quartIn(1 - pos); },
                quintIn: function (pos) { return Math.pow(pos, [3 + 2]); },
                quintOut: function (pos) { return 1 - easings.quintIn(1 - pos); }
            },
            easing = easings[opts.easing] || function (pos) { return (-Math.cos(pos * Math.PI) / 2) + 0.5; };

        for (prop in target) {
            current[prop] = (prop === 'filter') ? { value: comp[prop], unit: prop} : parse(comp[prop]);
        }
        interval = setInterval(function () {
            var time = (+new Date),
                pos = (time > finish) ? 1 : (time - start) / dur,
                prop;

            for (prop in target) {
                var s = (current[prop].value === 'auto') ? el.offsetWidth : current[prop].value,
                    t = target[prop].value,
                    u = target[prop].unit,
                    p = easing(pos);

                el.style[prop] = (prop === 'filter') ?
                    filter(s, t, p) :
                    (u === 'color') ?
                        color(s, t, p) :
                        (s + (t - s) * p).toFixed(3) + u;
            }
            if (time > finish) {
                clearInterval(interval);
                (opts.after) && (opts.after());
            }
        }, 10);
    };
})('emile', this);
