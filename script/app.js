'use strict';
angular.module('app', [])
  .controller('AppCtrl', ['$scope', '$window', AppCtrl])
  .directive("loaderSrc", function() {
    return {
      link: function(scope, element, attrs) {
        var img = null;
        var loadImage = function() {
          element[0].src = "styles/balls.svg";
          element.addClass('loading');
          img = new Image();
          img.src = attrs.loaderSrc;
          img.onload = function() {
            element[0].src = attrs.loaderSrc;
            element.removeClass('loading');
          };
        };
        scope.$watch((function() {
          return attrs.loaderSrc;
        }), function(newVal, oldVal) {
          if (oldVal !== newVal) {
            loadImage();
          }
        });
        loadImage();
      }
    };
  });

function AppCtrl($scope, $window) {
  this.$scope = $scope;
  this.sitesSchemes = $window.siteColors;
  this.generateScheme = $window.scheme.generate;

  var savedData = localStorage.trainData;
  this.trainData = savedData ? JSON.parse(savedData) : {};
  var netData = localStorage.netData;
  this.nets = savedData ? JSON.parse(netData) : {};

  this.activateSite(0);
}

AppCtrl.prototype.activateSite = function(idx) {
  this.activeSiteIdx = idx;
  var colors = this.activeSite().colors;
  this.hueVariations = this.buildHUEVariations(colors);
  this.neuralVariations = this.buildVariations(colors);
  this.activeNeuralVariationIdx = 0;
  this.schemeFrom(this.activeNeuralVariation());
  this.refreshNetworkResults();
};

AppCtrl.prototype.refreshNetworkResults = function() {
  this.netSelectedPairs = {};
  for (var k in this.nets) {
    (key=> {
      var variations = this.neuralVariations.map(v=> this.normalizeColorPair(v)[key]);
      this.netSelectedPairs[key] = this.selectNetworkPair(variations, this.nets[key])
        .map(pair=>this.convertColorPairsToRGB(key, pair));
    })(k);
  }
};

AppCtrl.prototype.convertColorPairsToRGB = function(from, pair) {
  switch (from) {
    case 'rgb':
      return [
        colorJs({red: pair.r1, green: pair.g1, blue: pair.b1}).toCSS(),
        colorJs({red: pair.r2, green: pair.g2, blue: pair.b2}).toCSS(),
        pair.match
      ];
    case 'hsv':
      return [
        colorJs({hue: pair.h1, saturation: pair.s1, value: pair.v1}).toCSS(),
        colorJs({hue: pair.h2, saturation: pair.s2, value: pair.v2}).toCSS(),
        pair.match
      ];
    case 'lab':
      var c1 = lab2rgb([pair.L1, pair.a1, pair.b1]);
      var c2 = lab2rgb([pair.L2, pair.a2, pair.b2]);
      return [
        colorJs({red: c1[0] / 255, green: c1[1] / 255, blue: c1[2] / 255}).toCSS(),
        colorJs({red: c2[0] / 255, green: c2[1] / 255, blue: c2[2] / 255}).toCSS(),
        pair.match
      ];
  }
};

AppCtrl.prototype.selectNetworkPair = function(colorPairs, networkData) {
  var netFn = new brain.NeuralNetwork().fromJSON(networkData).toFunction();
  return colorPairs.map(v=> {
    v.match = (netFn(v).match * 100).toFixed(2);
    return v;
  }).sort((a, b)=>b.match - a.match).filter((v, i)=>i < 5);
};

AppCtrl.prototype.sampleCount = function() {
  return Object.keys(this.trainData).length;
};

AppCtrl.prototype.activeNeuralVariation = function() {
  return this.neuralVariations[this.activeNeuralVariationIdx];
};

AppCtrl.prototype.isNeuralActive = function() {
  return this.activeNeuralVariation() == this.activePair;
};

AppCtrl.prototype.normalizeColorPair = function(pair) {
  var c1 = colorJs(pair[0]).toRGB();
  var c2 = colorJs(pair[1]).toRGB();
  var rgb = {
    r1: c1.red,
    r2: c2.red,
    g1: c1.green,
    g2: c2.green,
    b1: c1.blue,
    b2: c2.blue
  };

  var lab1 = rgb2lab([c1.red * 255, c1.green * 255, c1.blue * 255]);
  var lab2 = rgb2lab([c2.red * 255, c2.green * 255, c2.blue * 255]);
  var lab = {
    L1: lab1[0],
    L2: lab2[0],
    a1: lab1[1],
    a2: lab2[1],
    b1: lab1[2],
    b2: lab2[2]
  };

  c1 = c1.toHSV();
  c2 = c2.toHSV();
  var hsv = {
    h1: c1.hue,
    h2: c2.hue,
    s1: c1.saturation,
    s2: c2.saturation,
    v1: c1.value,
    v2: c2.value
  };


  return {
    rgb: rgb,
    hsv: hsv,
    lab: lab
  };
};

AppCtrl.prototype.feedback = function(pair, feedbackScore) {
  var key = pair.join('-');

  this.trainData[key] = this.normalizeColorPair(pair);
  this.trainData[key].feedback = feedbackScore;
  localStorage.trainData = JSON.stringify(this.trainData);
  //Next
  this.activeNeuralVariationIdx++;
  if (this.activeNeuralVariationIdx >= this.neuralVariations.length) {
    //Next site
    this.nextSite();
  } else {
    this.schemeFrom(this.activeNeuralVariation());
  }
};


AppCtrl.prototype.trainNetwork = function() {
  this.isTraining = true;
  this.percentTrained = 0;
  var dataSets = Object.keys(this.trainData).map(key=> {
    return this.trainData[key];
  }).reduce((p, c)=> {
    p.rgb.push({input: c.rgb, output: {match: c.feedback}});
    p.hsv.push({input: c.hsv, output: {match: c.feedback}});
    p.lab.push({input: c.lab, output: {match: c.feedback}});
    return p;
  }, {rgb: [], hsv: [], lab: []});

  var remainingWorkers = Object.keys(dataSets).length;
  for (var k in dataSets) {
    ((key)=> {
      var worker = new Worker("script/worker.js");
      var iteration = 9000;
      worker.onmessage = (msg)=> {
        var data = JSON.parse(msg.data);
        if (data.type === 'progress') {
          //Show progress
          var completed = data.iterations / iteration * 100;
          this.$scope.$apply(()=> {
            this.percentTrained = completed;
          })
        } else if (data.type == 'result') {
          this.nets[key] = data.net;
          localStorage.netData = JSON.stringify(this.nets);
          if (--remainingWorkers == 0) {
            this.$scope.$apply(()=> {
              this.isTraining = false;
              this.refreshNetworkResults();
            })
          }
        }
      };
      worker.onerror = (error)=> {
        console.error(error);
      };
      worker.postMessage(JSON.stringify(dataSets[key]));
    })(k);
  }
};

AppCtrl.prototype.nextSite = function() {
  this.activateSite(++this.activeSiteIdx % this.sitesSchemes.length);
};

AppCtrl.prototype.randomSite = function() {
  this.activeSiteIdx = ~~(Math.random() * this.sitesSchemes.length);
  this.activateSite(this.activeSiteIdx % this.sitesSchemes.length);
};

AppCtrl.prototype.schemeFrom = function(colorPair) {
  this.activePair = colorPair;
  this.scheme = this.generateScheme({
    baseColor: colorPair[0],
    accentColor: colorPair[1]
  }, 'rightFlyBy', 'promo');
};

AppCtrl.prototype.buildHUEVariations = function(colors) {
  return colors.map((color)=> {
    var mainColor = colorJs(color);
    var complimentaryColor = mainColor.complementaryScheme()[1].toRGB();
    complimentaryColor = {
      R: complimentaryColor.red * 255,
      G: complimentaryColor.green * 255,
      B: complimentaryColor.blue * 255
    };
    //Find closest complimentary color
    var closest = colorDiff.closest(complimentaryColor, colors.map(c=> {
      c = colorJs(c);
      return {R: c.red * 255, G: c.green * 255, B: c.blue * 255};
    }));
    //Map back
    closest = colorJs({red: closest.R / 255, green: closest.G / 255, blue: closest.B / 255});
    return [mainColor.toCSS(), closest.toCSS()];
  }).filter(colorPair=> {
    return colorPair[0] != colorPair[1]
  });
};

AppCtrl.prototype.buildVariations = function(colors) {
  var pairs = colors.map(c1=> {
    return colors.map(c2=>[c1, c2]).filter(colorPair=> {
      return colorPair[0] != colorPair[1]
    })
  });
  return _.shuffle(_.uniq([].concat.apply([], pairs), (p)=> {
    return p[0] + '-' + p[1];
  }));
};

AppCtrl.prototype.activeSite = function() {
  return this.sitesSchemes[this.activeSiteIdx];
};