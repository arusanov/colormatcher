(function(root, name, definition) {
  'use strict';
  if (typeof module === 'object' && module.exports) module.exports = definition();
  else if (typeof define == 'function' && typeof define.amd == 'object') define(definition);
  else root[name] = definition();
}(this, 'color', function() {

  'use strict';
  var clamp = function(v, max) {
    return Math.min(Math.max(v, 0), max);
  };

  var clamp01 = function(v) {
    return Math.min(1, Math.max(0, v));
  };

  var HEX3_REGEXP = /^([0-9a-fA-F])([0-9a-fA-F])([0-9a-fA-F])$/;
  var HEX6_REGEXP = /^([0-9a-fA-F]{2})([0-9a-fA-F]{2})([0-9a-fA-F]{2})$/;

  var hsla = function(color) {
    return Color.hsla(color.h, color.s, color.l, color.a);
  };

  var Color = function Color(rgb, alpha) {
    if (toString.call(rgb) === '[object Array]') {
      this.rgb = rgb;
    } else {
      if (toString.call(rgb) === '[object String]') {
        this.rgb = Color.parseString(rgb);
      }
    }

    if (!this.rgb) {
      throw new Error('Invalid color format: ' + rgb);
    }

    this.alpha = alpha || 1;
  };

  Color.prototype.toRGB = function() {
    return Color.toRGB(this.rgb);
  };

  Color.prototype.toRGBA = function(alpha) {
    return Color.toRGBA(this.rgb, alpha || this.alpha);
  };

  Color.prototype.toHSL = function() {
    var r = this.rgb[0] / 255;
    var g = this.rgb[1] / 255;
    var b = this.rgb[2] / 255;
    var a = this.alpha;

    var max = Math.max(r, g, b);
    var min = Math.min(r, g, b);
    var h;
    var s;
    var l = (max + min) / 2;
    var d = max - min;

    if (max === min) {
      h = s = 0;
    } else {
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

      switch (max) {
        case r:
          h = (g - b) / d + (g < b ? 6 : 0);
          break;
        case g:
          h = (b - r) / d + 2;
          break;
        case b:
          h = (r - g) / d + 4;
          break;
      }
      h /= 6;
    }

    return {h: h * 360, s: s, l: l, a: a};
  };

  Color.prototype.toHSV = function() {
    var r = this.rgb[0] / 255;
    var g = this.rgb[1] / 255;
    var b = this.rgb[2] / 255;
    var a = this.alpha;

    var max = Math.max(r, g, b);
    var min = Math.min(r, g, b);
    var h;
    var s;
    var v = max;

    var d = max - min;
    if (max === 0) {
      s = 0;
    } else {
      s = d / max;
    }

    if (max === min) {
      h = 0;
    } else {
      switch (max) {
        case r:
          h = (g - b) / d + (g < b ? 6 : 0);
          break;
        case g:
          h = (b - r) / d + 2;
          break;
        case b:
          h = (r - g) / d + 4;
          break;
      }
      h /= 6;
    }

    return {h: h * 360, s: s, v: v, a: a};
  };

  Color.prototype.luma = function() {
    var r = this.rgb[0] / 255;
    var g = this.rgb[1] / 255;
    var b = this.rgb[2] / 255;
    r = (r <= 0.03928 ? r / 12.92 : Math.pow((r + 0.055) / 1.055, 2.4));
    g = (g <= 0.03928 ? g / 12.92 : Math.pow((g + 0.055) / 1.055, 2.4));
    b = (b <= 0.03928 ? b / 12.92 : Math.pow((b + 0.055) / 1.055, 2.4));
    return 0.2126 * r + 0.7152 * g + 0.0722 * b;
  };

  /**
   * ,,,,,,,,,,,,,,,;+#+#+++:.,...,..........
   ,,,,,,,,,,,,,,@#'#@+#@#'#:..,,..........
   ,,,,,,,,,,,,,#@@##@+#@#@#'#,,...........
   ,,,,,,,,,,.,@@@@@######@@@#@:,..........
   ,,,,,,,,,,.@@@@@@@@#@##@@@@@#:,.........
   ,,,,,,,,,.@@@@@@@@@@@@@@@@@@@#..........
   ,,,,,,,,,'@@@@@@@+;,,:#@@@@@@@,.........
   ,,,,,,,,.@@@@@@@@#:.,,#@@@@@@@:.........
   ,,,,,,,,#@@@@@@@@@:,,,+##@@@@@;.........
   ,,,,,,..@@@@@#@@@@+;';#@';#@@@:.........
   ,,,,,,,+@@@@###@@@#;''#@#,;#@@..........
   ,,,,,,.#@@##@@@@@@#++'##+#++#;..........
   ,,,,,,.@@#@#@@@@@@@###@@@#;;+...........
   ,,,,,,..@@@+@@@@@@@#####@#';,...........
   ,,,,,,,,:#:'@@@@@@@#####@#+.............
   ,,,,,,,.,@#...,'+##+''';:` ,............
   ,,,,,,,.,#####@++';,,;;+++::............
   ,,,,,,,..:##+###########':;;............
   ,,,,,,,,#+##'+:+:+@##++#'';:............
   ,,,,,,,,#++#''+'''#+;++;;:,:............
   ,,,,,,..#+#+';;;''++',';;,.:............
   ,,,,,,,,:+##'''';++;,.:,:,:,............
   ,,,,,,,,.###+++''+##'#:::;;,............
   ,,,,,,,,,+###++'''++'::,,';,............
   ,,,,,,,,,`###+++'+@@@#;:,:::............
   ,,,,,,,,,`,##+++@+''';;'';::,...........
   ,,,,,,,,.,;####@##++++'##::,............
   ,,,,,,,,,,.'###@#+';:::;#::.............
   ,,,,,,,,,...###@##@@@@#'#;:.............
   ,,,,,,,,,,..#@@@@#++'';#@:,.........:;::
   ,,,,,,,:+####@@@@@@@@####;:++#;;,,;';;;:
   ,,,,:######+@#@@@@@@@@@@#;;;;::+:;+';;;:
   ,'#@@####+++##@@@@@@@@@+:'';;+@#+#';';;:
   @@@@@@@@#+++###@@@@@@##;++'+++@@':';::;;
   @@@@@@@@@#+##++++###+'''+'++++@#@#+;::,:
   @@@@@@@+''+;+@#++#+'';;;+++++'@+'';;::,.
   +'''''+@'#@@''+@''';;;;;'+++++@';';;:,,.
   '''''''+@#;+'+'''++'';;;'++++'+';';;::,.
   ;;;''''+#@@#++''''''';;;;'++++:;;';;:,,:
   ;;;;'''++#@@@@#+#+'';;;:::''+#;'+'';:,.;
   * @returns {black|{bias, weights}|Array}
   */
  Color.prototype.blackness = function() {
    var output =
      (function(input) {
        var i;
        var id;
        var iid;
        var layer;
        var node;
        var output;
        var sum;
        var net =
        {
          layers: [{r: {}, g: {}, b: {}},
            {
              0: {
                bias: 27.869338029499822,
                weights: {r: -17.923304218257385, g: -25.309264302926017, b: -1.959386680553379},
              },
              1: {
                bias: 17.541332236248646,
                weights: {r: -10.079706473211301, g: -23.546966284636863, b: 0.4305651251889337},
              },
              2: {
                bias: 0.8799573160325326,
                weights: {r: 26.653614867127054, g: -13.032682409263684, b: 2.125712137880285},
              },
            },
            {
              black: {
                bias: 23.9361558729889,
                weights: {0: -14.795952745081287, 1: -19.459614783632748, 2: -19.614640774892884},
              },
            },
          ],
          outputLookup: true, inputLookup: true,
        };
        i = 1;
        while (i < net.layers.length) {
          layer = net.layers[i];
          output = {};
          for (id in layer) {
            node = layer[id];
            sum = node.bias;
            for (iid in node.weights) {
              sum += node.weights[iid] * input[iid];
            }

            output[id] = 1 / (1 + Math.exp(-sum));
          }

          input = output;
          i++;
        }

        return output;
      })({

        r: this.rgb[0] / 255,
        g: this.rgb[1] / 255,
        b: this.rgb[2] / 255,
      });
    return output.black;
  };

  Color.prototype.isDark = function() {
    return this.blackness() <= 0.56;
  };

  Color.prototype.isLight = function() {
    return !this.isDark();
  };

  Color.parseString = function(color) {
    var c;
    var match = void 0;
    color = color.replace(/^[\s,#]+/, '').replace(/\s+$/, '').toLowerCase();
    match = HEX6_REGEXP.exec(color);
    if (match) {
      return (function() {
        var ref = match.slice(1, 4);
        var results = [];
        for (var j = 0; j < ref.length; j++) {
          c = ref[j];
          results.push(parseInt(c, 16));
        }

        return results;
      })();
    }

    match = HEX3_REGEXP.exec(color);
    if (match) {
      return (function() {
        var ref = match.slice(1, 4);
        var results = [];
        for (var j = 0; j < ref.length; j++) {
          c = ref[j];
          results.push(parseInt(c + c, 16));
        }

        return results;
      })();
    }
  };

  Color.toRGB = function(rgb) {
    var rgbHtml = '#';
    for (var i = 0; i < rgb.length; i++) {
      var c = clamp(Math.round(rgb[i]), 255);
      rgbHtml += (c < 16 ? '0' : '') + c.toString(16);
    }

    return rgbHtml;
  };

  Color.toRGBA = function(alpha) {
    var c = 'rgba(';
    for (var i = 0; i < this.rgb.length; i++) {
      c += clamp(Math.round(this.rgb[i]), 255) + ',';
    }

    return c + ',' + (alpha || this.alpha) + ')';
  };

  Color.rgb = function(r, g, b) {
    return Color.rgba(r, g, b, 1.0);
  };

  Color.rgba = function(r, g, b, a) {
    return new Color([r, g, b], a);
  };

  Color.hsl = function(h, s, l) {
    return Color.hsla(h, s, l, 1.0);
  };

  Color.hsla = function(h, s, l, a) {
    var m1;
    var m2;
    var hue = function(h) {
      h = (h < 0 ? h + 1 : (h > 1 ? h - 1 : h));
      if (h * 6 < 1) {
        return m1 + (m2 - m1) * h * 6;
      } else if (h * 2 < 1) {
        return m2;
      } else if (h * 3 < 2) {
        return m1 + (m2 - m1) * (2 / 3 - h) * 6;
      } else {
        return m1;
      }
    };

    h = (h % 360) / 360;
    s = clamp01(s);
    l = clamp01(l);
    a = clamp01(a);
    m2 = (l <= 0.5 ? l * (s + 1) : l + s - l * s);
    m1 = l * 2 - m2;
    return Color.rgba(hue(h + 1 / 3) * 255, hue(h) * 255, hue(h - 1 / 3) * 255, a);
  };

  Color.hsv = function(h, s, v) {
    return Color.hsva(h, s, v, 1.0);
  };

  Color.hsva = function(h, s, v, a) {
    h = ((h % 360) / 360) * 360;
    var i = Math.floor((h / 60) % 6);
    var f = (h / 60) - i;
    var vs = [v, v * (1 - s), v * (1 - f * s), v * (1 - (1 - f) * s)];
    var perm = [[0, 3, 1], [2, 0, 1], [1, 0, 3], [1, 2, 0], [3, 1, 0], [0, 1, 2]];
    return Color.rgba(vs[perm[i][0]] * 255, vs[perm[i][1]] * 255, vs[perm[i][2]] * 255, a);
  };

  Color.lighten = function(color, amount) {
    var hsl;
    hsl = color.toHSL();
    hsl.l += amount / 100;
    hsl.l = clamp01(hsl.l);
    return hsla(hsl);
  };

  Color.darken = function(color, amount) {
    var hsl;
    hsl = color.toHSL();
    hsl.l -= amount / 100;
    hsl.l = clamp01(hsl.l);
    return hsla(hsl);
  };

  Color.blend = function(color, backColor, alpha) {
    var rgb;
    if (alpha == null) {
      alpha = color.alpha;
    }

    rgb = [alpha * backColor.rgb[0] + (1 - alpha) * color.rgb[0], alpha * backColor.rgb[1] + (1 - alpha) * color.rgb[1], alpha * backColor.rgb[2] + (1 - alpha) * color.rgb[2]];
    return new Color(rgb);
  };

  Color.mix = function(color1, color2, weight) {
    var p = weight || 0.5;
    var w = p * 2 - 1;
    var a = color1.alpha - color2.alpha;
    var w1 = ((w * a === -1 ? w : (w + a) / (1 + w * a)) + 1) / 2.0;
    var w2 = 1 - w1;
    var rgb = [color1.rgb[0] * w1 + color2.rgb[0] * w2, color1.rgb[1] * w1 + color2.rgb[1] * w2, color1.rgb[2] * w1 + color2.rgb[2] * w2];
    var alpha = color1.alpha * p + color2.alpha * (1 - p);
    return new Color(rgb, alpha);
  };

  Color.contrast = function(color, dark, light, threshold) {
    var t;
    if (typeof light === 'undefined') {
      light = Color.rgba(255, 255, 255, 1.0);
    }

    if (typeof dark === 'undefined') {
      dark = Color.rgba(0, 0, 0, 1.0);
    }

    if (dark.luma() > light.luma()) {
      t = light;
      light = dark;
      dark = t;
    }

    if (typeof threshold === 'undefined') {
      threshold = 0.43;
    }

    if (color.luma() < threshold) {
      return light;
    } else {
      return dark;
    }
  };

  return Color;
}));
