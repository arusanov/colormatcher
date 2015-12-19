## Color scheme generator

Install with bower 

Include 2 file on page
```
color.js
scheme.js
```

If not using any module system they will register in `window.color` and `window.scheme`

### Usage

```
var widgetFullyGeneratedStyle = window.scheme.generate(widget.style, widget.layout, widget.type);
```

### Converting existing widgets

```
node convert.js < fileWithWidget.json
```

Convert script read data from stdin and outputs to stdout.
It can read a single json object or array of widgets. 
In array order of widgets stays untouched.
Output of script is modified `widget.style`

Assuming input

```json
{
"type": "follow",
"style": {
    "baseColor": "#9A9A9A",
    "font": "\"Helvetica Neue\", Helvetica, Arial, sans-serif",
    "animation": "slideIn",
    "nativeColors": false
},
"layout": "rightSide",
"id": 41635
}
```

output will be

```json
{
"type": "follow",
"style": {
    "baseColor": "#9A9A9A",
    "font": "\"Helvetica Neue\", Helvetica, Arial, sans-serif",
    "animation": "slideIn",
    "nativeColors": false,
    "backColor": "#9a9a9a",
    "buttonColor": "#b8b8b8",
    "buttonHoverColor": "#aeaeae",
    "buttonHoverTextColor": "#ffffff",
    "buttonTextColor": "#ffffff",
    "labelColor": "#9a9a9a",
    "labelTextColor": "#ffffff",
    "labelHoverColor": "#a4a4a4",
    "labelHoverTextColor": "#ffffff",
    "closeColor": "#ffffff",
    "closeHoverColor": "#ffffff",
    "inactiveInputBackColor": "#b8b8b8",
    "inactiveInputBorderColor": "#9a9a9a",
    "inactiveInputTextColor": "#ffffff",
    "inputBackColor": "#ffffff",
    "inputBorderColor": "#9a9a9a",
    "inputPlaceholderColor": "#cacaca",
    "inputTextColor": "#333333",
    "logoColor": "#b8b8b8",
    "logoHoverColor": "#c2c2c2",
    "minimizeColor": "#5e5e5e",
    "minimizeHoverColor": "#444444",
    "noteTextColor": "#cdcdcd",
    "separatorColor": "#aeaeae",
    "panelColor": "#aeaeae",
    "panelHoverColor": "#a4a4a4",
    "textColor": "#ffffff",
    "validationErrorBackColor": "#f16645",
    "validationErrorTextColor": "#ffffff",
    "barBackColor": "#9a9a9a",
    "barTextColor": "#ffffff",
    "barButtonColor": "#b8b8b8",
    "barButtonHoverColor": "#aeaeae",
    "barButtonTextColor": "#ffffff",
    "barButtonHoverTextColor": "#ffffff",
    "barLogoColor": "#b8b8b8",
    "barLogoHoverColor": "#c2c2c2",
    "headerTextColor": "#ffffff",
    "image": {
        "backColor": "#9a9a9a",
        "valign": "middle",
        "halign": "center"
    },
    "animationRepeat": 1,
    "animationIn": "slideIn",
    "animationOut": "fadeOut",
    "animationDurationIn": "800ms",
    "animationDurationOut": "500ms",
    "animationDelay": "0ms",
    "animationOrigin": "center center",
    "animationDirectionIn": "normal",
    "animationBackface": "initial",
    "animationDirectionOut": "normal"
},
"layout": "rightSide",
"id": 41635
}
```