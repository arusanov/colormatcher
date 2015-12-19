(function(root, name, depend, definition) {
  'use strict';
  if (typeof module === 'object' && module.exports) module.exports = definition(require('./' + depend));
  else if (typeof define === 'function' && typeof define.amd === 'object') define([depend], definition);
  else root[name] = definition(root[depend]);
}(this, 'scheme', 'color', function(Color) {

  'use strict';

  var extend = function(child, parent) {
    for (var key in parent) {
      if (hasProp.call(parent, key)) {
        child[key] = parent[key];
      }
    }

    function ctor() {
      this.constructor = child;
    }

    ctor.prototype = parent.prototype;
    child.prototype = new ctor();
    child.__super__ = parent.prototype;
    return child;
  };

  var hasProp = {}.hasOwnProperty;
  var BaseTheme = (function() {
    function BaseTheme(baseColor) {
      this.baseColor = baseColor;
    }

    return BaseTheme;

  })();

  var LightTheme = (function(superClass) {
    extend(LightTheme, superClass);

    function LightTheme(baseColor) {
      LightTheme.__super__.constructor.apply(this, arguments);
      this.baseColor = baseColor;
    }

    return LightTheme;

  })(BaseTheme);

  var DarkTheme = (function(superClass) {
    extend(DarkTheme, superClass);

    function DarkTheme(baseColor) {
      DarkTheme.__super__.constructor.apply(this, arguments);
      this.baseColor = baseColor;
    }

    return DarkTheme;

  })(BaseTheme);

  var COLOR_NAMES = ['backColor',
    'buttonColor',
    'buttonHoverColor',
    'buttonHoverTextColor',
    'buttonTextColor',
    'labelColor',
    'labelTextColor',
    'labelHoverColor',
    'labelHoverTextColor',
    'closeColor',
    'closeHoverColor',
    'inactiveInputBackColor',
    'inactiveInputBorderColor',
    'inactiveInputTextColor',
    'inputBackColor',
    'inputBorderColor',
    'inputPlaceholderColor',
    'inputTextColor',
    'logoColor',
    'logoHoverColor',
    'minimizeColor',
    'minimizeHoverColor',
    'noteTextColor',
    'separatorColor',
    'panelColor',
    'panelHoverColor',
    'textColor',
    'validationErrorBackColor',
    'validationErrorTextColor',
    'barBackColor',
    'barTextColor',
    'barButtonColor',
    'barButtonHoverColor',
    'barButtonTextColor',
    'barButtonHoverTextColor',
    'barLogoColor',
    'barLogoHoverColor',
    'headerTextColor',
  ];

  var SECONDARY_COLOR_NAMES = [
    'Color',
    'BackColor',
    'HoverColor',
    'TextColor',
    'ButtonColor',
    'ButtonHoverColor',
    'TextColor',
    'HoverTextColor',
    'ButtonTextColor',
    'ButtonHoverTextColor',
    'LogoColor',
    'LogoHoverColor',
  ];

  var ACCENT_COLOR_NAMES = [
    'Color',
    'HoverColor',
    'HoverTextColor',
    'TextColor',
  ];

  var TEXT_COLOR_NAMES = [
    'labelTextColor',
    'labelHoverTextColor',
    'buttonTextColor',
    'buttonHoverTextColor',
    'barTextColor',
    'barButtonTextColor',
    'barButtonHoverTextColor',
    'noteTextColor',
    'textColor',
    'headerTextColor',
  ];

  var SECONDARY_TEXT_COLOR_NAMES = [
    'TextColor',
    'HoverTextColor',
    'ButtonTextColor',
    'ButtonHoverTextColor',
  ];

  var ACCENT_TEXT_COLOR_NAMES = [
    'buttonTextColor',
    'buttonHoverTextColor',
    'barButtonTextColor',
    'barButtonHoverTextColor',
  ];

  var SECONDARY_ACCENT_TEXT_COLOR_NAMES = [
    'ButtonTextColor',
    'ButtonHoverTextColor',
  ];

  var WHITE_COLOR = Color.rgb(255, 255, 255);

  BaseTheme.prototype.backColor = function() {
    return this.baseColor;
  };

  BaseTheme.prototype.barBackColor = function() {
    return this.backColor();
  };

  BaseTheme.prototype.headerTextColor = function() {
    return this.textColor();
  };

  BaseTheme.prototype.barTextColor = function() {
    return this.textColor();
  };

  BaseTheme.prototype.barButtonColor = function() {
    return this.buttonColor();
  };

  BaseTheme.prototype.barButtonHoverColor = function() {
    return this.buttonHoverColor();
  };

  BaseTheme.prototype.barButtonTextColor = function() {
    return this.buttonTextColor();
  };

  BaseTheme.prototype.barButtonHoverTextColor = function() {
    return this.buttonHoverTextColor();
  };

  BaseTheme.prototype.buttonHoverTextColor = function() {
    return this.buttonTextColor();
  };

  BaseTheme.prototype.closeColor = function() {
    return WHITE_COLOR;
  };

  BaseTheme.prototype.closeHoverColor = function() {
    return WHITE_COLOR;
  };

  BaseTheme.prototype.inactiveInputBackColor = function() {
    return this.buttonColor();
  };

  BaseTheme.prototype.inactiveInputBorderColor = function() {
    return this.backColor();
  };

  BaseTheme.prototype.inactiveInputTextColor = function() {
    return this.buttonTextColor();
  };

  BaseTheme.prototype.inputBackColor = function() {
    return WHITE_COLOR;
  };

  BaseTheme.prototype.inputPlaceholderColor = function() {
    return Color.rgb(202, 202, 202);
  };

  BaseTheme.prototype.inputTextColor = function() {
    return Color.rgb(51, 51, 51);
  };

  BaseTheme.prototype.minimizeColor = function() {
    return Color.rgb(94, 94, 94);
  };

  BaseTheme.prototype.minimizeHoverColor = function() {
    return Color.rgb(68, 68, 68);
  };

  BaseTheme.prototype.validationErrorBackColor = function() {
    return Color.rgb(241, 102, 69);
  };

  BaseTheme.prototype.validationErrorTextColor = function() {
    return WHITE_COLOR;
  };

  LightTheme.prototype.calcContrastColor = function(lumaDifference, lumaLowThreshold) {
    if (lumaDifference == null) {
      lumaDifference = 0.1;
    }

    if (lumaLowThreshold == null) {
      lumaLowThreshold = 0.1;
    }

    var hsv = this.baseColor.toHSV();
    var step = 0.01;
    var stepCount = Math.round(1 / (2 * step));
    var color = void 0;
    if (typeof lumaDifference === 'undefined') {
      lumaDifference = 0.1;
    }

    if (typeof lumaLowThreshold === 'undefined') {
      lumaLowThreshold = 0.1;
    }

    var i = 1;
    while (i < stepCount) {
      color = Color.hsv(hsv.h, hsv.s + (hsv.s > 0 ? step * i : 0), hsv.v - 2 * step * i);
      if (Math.abs(this.baseColor.luma() - color.luma()) > lumaDifference || color.luma() < lumaLowThreshold) {
        break;
      }

      i++;
    }

    return color;
  };

  LightTheme.prototype.buttonColor = function() {
    return this.calcContrastColor(0.38);
  };

  LightTheme.prototype.buttonHoverColor = function() {
    return Color.darken(this.buttonColor(), 2);
  };

  LightTheme.prototype.buttonTextColor = function() {
    return WHITE_COLOR;
  };

  LightTheme.prototype.textColor = function() {
    return this.calcContrastColor(0.9);
  };

  LightTheme.prototype.inputBorderColor = function() {
    return this.calcContrastColor(0.09);
  };

  LightTheme.prototype.logoColor = function() {
    return this.calcContrastColor(0.2);
  };

  LightTheme.prototype.logoHoverColor = function() {
    return this.calcContrastColor(0.3);
  };

  LightTheme.prototype.barLogoColor = function() {
    return this.calcContrastColor(0.2);
  };

  LightTheme.prototype.barLogoHoverColor = function() {
    return this.calcContrastColor(0.3);
  };

  LightTheme.prototype.noteTextColor = function() {
    return this.calcContrastColor(0.5);
  };

  LightTheme.prototype.separatorColor = function() {
    return this.calcContrastColor(0.1);
  };

  LightTheme.prototype.panelColor = function() {
    return this.calcContrastColor(0.05);
  };

  LightTheme.prototype.panelHoverColor = function() {
    return this.calcContrastColor(0.1);
  };

  LightTheme.prototype.labelColor = function() {
    return this.backColor();
  };

  LightTheme.prototype.labelHoverColor = function() {
    return Color.darken(this.labelColor(), 2);
  };

  LightTheme.prototype.labelTextColor = function() {
    return this.textColor();
  };

  LightTheme.prototype.labelHoverTextColor = function() {
    return this.labelTextColor();
  };

  DarkTheme.prototype.mixWhite = function(weight) {
    return Color.mix(this.baseColor, WHITE_COLOR, weight);
  };

  DarkTheme.prototype.buttonColor = function() {
    return this.mixWhite(0.7);
  };

  DarkTheme.prototype.buttonHoverColor = function() {
    return this.mixWhite(0.8);
  };

  DarkTheme.prototype.buttonTextColor = function() {
    return WHITE_COLOR;
  };

  DarkTheme.prototype.textColor = function() {
    return WHITE_COLOR;
  };

  DarkTheme.prototype.inputBorderColor = function() {
    return this.backColor();
  };

  DarkTheme.prototype.logoColor = function() {
    return this.mixWhite(0.7);
  };

  DarkTheme.prototype.logoHoverColor = function() {
    return this.mixWhite(0.6);
  };

  DarkTheme.prototype.barLogoColor = function() {
    return this.mixWhite(0.7);
  };

  DarkTheme.prototype.barLogoHoverColor = function() {
    return this.mixWhite(0.6);
  };

  DarkTheme.prototype.noteTextColor = function() {
    return this.mixWhite(0.5);
  };

  DarkTheme.prototype.separatorColor = function() {
    return this.mixWhite(0.8);
  };

  DarkTheme.prototype.panelColor = function() {
    return this.mixWhite(0.8);
  };

  DarkTheme.prototype.panelHoverColor = function() {
    return this.mixWhite(0.9);
  };

  DarkTheme.prototype.labelColor = function() {
    return this.backColor();
  };

  DarkTheme.prototype.labelHoverColor = function() {
    return this.mixWhite(0.9);
  };

  DarkTheme.prototype.labelTextColor = function() {
    return this.textColor();
  };

  DarkTheme.prototype.labelHoverTextColor = function() {
    return this.labelTextColor();
  };

  var animationMap = {
    zoomIn: 'zoomOut',
    slideInLeft: 'slideOutLeft',
    slideInRight: 'slideOutRight',
  };

  var animationOrigin = {
    swing: 'top center',
  };

  var animationDirectionIn = {};

  var animationDirectionOut = {};

  var animationDurationIn = {
    fadeInUp: 600,
    fadeInDown: 600,
    fadeInLeft: 600,
    fadeInRight: 600,
    zoomIn: 500,
    bounceIn: 600,
    slideInLeft: 300,
    slideInRight: 300,
  };

  var animationDurationOut = {
    fadeOut: 500,
    zoomOut: 500,
    slideOutLeft: 300,
    slideOutRight: 300,
  };

  var animationDelay = {
    swing: 300,
    bounceIn: 200,
  };

  var animationBackface = {};

  var getTheme = function(styleColor) {
    var color = new Color(styleColor);
    return color.isLight() ? new LightTheme(color) : new DarkTheme(color);
  };

  var getLayoutType = function(layout) {
    return /^.*(bar|modal|standalone|side|touch|flyby|sidebar|panel)$/i.exec(layout)[1].toLowerCase();
  };

  var generate = function(style, layout, widgetType) {

    var colorName;
    var i;
    var name;
    var secondaryPrefix;
    var shouldApplySecondary;
    var textColor;
    var theme;
    var themedStyle;
    var val;

    var layoutType = getLayoutType(layout);

    secondaryPrefix = layoutType === 'side' ? 'label' : layoutType;
    shouldApplySecondary = widgetType === 'contact' || widgetType === 'survey' || (widgetType === 'subscribe' && secondaryPrefix === 'label');
    themedStyle = {theme: !style.hasOwnProperty('accentColor')};
    if (style.baseColor) {
      theme = getTheme(style.baseColor);
      for (i = 0; i < COLOR_NAMES.length; i++) {
        colorName = COLOR_NAMES[i];
        themedStyle[colorName] = theme[colorName]().toRGB();
      }

      if (style.textColor) {
        textColor = new Color(style.textColor).toRGB();
        for (i = 0; i < TEXT_COLOR_NAMES.length; i++) {
          colorName = TEXT_COLOR_NAMES[i];
          themedStyle[colorName] = textColor;
        }
      }

      if (style.headerTextColor) {
        themedStyle.headerTextColor = style.headerTextColor;
      }
    }

    if (style.accentColor) {
      theme = getTheme(style.accentColor);
      for (i = 0; i < ACCENT_COLOR_NAMES.length; i++) {
        colorName = ACCENT_COLOR_NAMES[i];
        themedStyle['barButton' + colorName] = themedStyle['button' + colorName] = theme['label' + colorName]().toRGB();
      }

      if (style.accentTextColor) {
        textColor = new Color(style.accentTextColor).toRGB();
        for (i = 0; i < ACCENT_TEXT_COLOR_NAMES.length; i++) {
          colorName = ACCENT_TEXT_COLOR_NAMES[i];
          themedStyle[colorName] = textColor;
        }
      }
    }

    if ((secondaryPrefix === 'bar' || secondaryPrefix === 'label') && shouldApplySecondary) {
      if (style.secondaryColor) {
        theme = getTheme(style.secondaryColor);
        for (i = 0; i < SECONDARY_COLOR_NAMES.length; i++) {
          colorName = SECONDARY_COLOR_NAMES[i];
          colorName = colorName.replace(/^./g, function(m) {
            return m.toUpperCase();
          });

          val = typeof theme[name = secondaryPrefix + colorName] === 'function' ? theme[name]().toRGB() : void 0;
          if (val)
            themedStyle[secondaryPrefix + colorName] = val;
        }

        if (style.secondaryTextColor) {
          textColor = new Color(style.secondaryTextColor).toRGB();
          for (i = 0; i < SECONDARY_TEXT_COLOR_NAMES.length; i++) {
            colorName = SECONDARY_TEXT_COLOR_NAMES[i];
            themedStyle[secondaryPrefix + colorName] = textColor;
          }
        }
      }

      if (style.secondaryAccentColor && secondaryPrefix === 'bar') {
        theme = getTheme(style.secondaryAccentColor);
        for (i = 0; i < ACCENT_COLOR_NAMES.length; i++) {
          colorName = ACCENT_COLOR_NAMES[i];
          val = typeof theme[name = 'label' + colorName] === 'function' ? theme[name]().toRGB() : void 0;
          if (val)
            themedStyle[secondaryPrefix + 'Button' + colorName] = typeof theme[name = 'label' + colorName] === 'function' ? theme[name]().toRGB() : void 0;
        }

        if (style.secondaryAccentTextColor) {
          textColor = new Color(style.secondaryAccentTextColor).toRGB();
          for (i = 0; i < SECONDARY_ACCENT_TEXT_COLOR_NAMES.length; i++) {
            colorName = SECONDARY_ACCENT_TEXT_COLOR_NAMES[i];
            themedStyle[secondaryPrefix + colorName] = textColor;
          }
        }
      }
    }

    //Chat coloring
    if (widgetType === 'chat') {

      themedStyle.chatOperatorBubbleColor = style.chatOperatorBubbleColor || themedStyle.backColor || '#314d59';
      themedStyle.chatOperatorBubbleTextColor = style.chatOperatorBubbleTextColor || themedStyle.textColor || '#ffffff';
      themedStyle.chatMyBubbleColor = style.chatMyBubbleColor || '#f0f0f0';
      themedStyle.chatMyBubbleTextColor = style.chatMyBubbleTextColor || '#333333';
      themedStyle.chatColor = style.chatColor || '#ffffff';
      themedStyle.chatTextColor = style.chatTextColor || '#333333';
      themedStyle.chatOuterBorderColor = themedStyle.chatBorderColor = Color.blend(new Color(themedStyle.chatTextColor), new Color(themedStyle.chatColor), 0.8).toRGB();

      var chatColor = new Color(themedStyle.chatColor);
      if (!chatColor.isLight()) {
        //No border on dark scheme
        themedStyle.chatOuterBorderColor = new Color(themedStyle.chatColor).toRGB();
      }

      themedStyle.chatTypingColor = Color.blend(new Color(themedStyle.chatTextColor), chatColor, 0.3).toRGB();
      themedStyle.chatFormBorderColor = getTheme(themedStyle.chatOperatorBubbleColor).inputBorderColor().toRGB();
    }

    //Animations
    var animation = style.animation;
    if (animation) {
      themedStyle.animationRepeat = 1;
      themedStyle.animation = animation;
      themedStyle.animationIn = animation;
      themedStyle.animationOut = animationMap[themedStyle.animation] || 'fadeOut';
      themedStyle.animationDurationIn = (animationDurationIn[themedStyle.animation] || 800) + 'ms';
      themedStyle.animationDurationOut = (animationDurationOut[themedStyle.animationOut] || animationDurationIn[themedStyle.animation] || 500) + 'ms';
      themedStyle.animationDelay = (animationDelay[themedStyle.animation] || 0) + 'ms';
      themedStyle.animationOrigin = animationOrigin[themedStyle.animation] || 'center center';
      themedStyle.animationDirectionIn = animationDirectionIn[themedStyle.animation] || 'normal';
      themedStyle.animationBackface = animationBackface[themedStyle.animation] || 'initial';
      themedStyle.animationDirectionOut = animationDirectionOut[themedStyle.animation] || (themedStyle.animationOut !== themedStyle.animation ? 'normal' : 'reverse');
    }

    //Merge style into new object
    var outStyle = {};
    var key;
    for (key in style) {
      if (style.hasOwnProperty(key)) {
        outStyle[key] = style[key];
      }
    }

    for (key in themedStyle) {
      if (themedStyle.hasOwnProperty(key)) {
        outStyle[key] = themedStyle[key];
      }
    }

    //Set custom colors
    outStyle.textColor = outStyle.textColor || outStyle.labelTextColor;
    outStyle.headerTextColor = outStyle.headerTextColor || outStyle.textColor;
    outStyle.accentColor = outStyle.accentColor || outStyle.buttonColor;
    outStyle.accentTextColor = outStyle.accentTextColor || outStyle.buttonTextColor;
    outStyle.secondaryColor = outStyle.secondaryColor || outStyle.barBackColor || outStyle.labelColor;
    outStyle.secondaryTextColor = outStyle.secondaryTextColor || outStyle.barTextColor || outStyle.labelTextColor;
    outStyle.secondaryAccentColor = outStyle.secondaryAccentColor || outStyle.barButtonColor || outStyle.labelColor;
    outStyle.secondaryAccentTextColor = outStyle.secondaryAccentTextColor || outStyle.barButtonTextColor || outStyle.labelTextColor;

    return outStyle;
  };

  return {
    generate: generate,
  };
}));
