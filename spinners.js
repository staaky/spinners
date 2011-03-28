/*  Spinners 1.3.0
 *  (c) 2010-2011 Nick Stakenburg - http://www.nickstakenburg.com
 *
 *  Spinners is freely distributable under the terms of an MIT-style license.
 *
 *  Works with your framework of choice using BridgeJS:
 *  http://www.github.com/staaky/bridgejs
 *
 *  Requires ExplorerCanvas to work in Internet Explorer:
 *  http://code.google.com/p/explorercanvas
 *
 *  GitHub: https://github.com/staaky/spinners
 */

var Spinners = {
  Version: '1.3.0'
};

(function($B) {
$B.Object.extend(Spinners, {
  spinners: [],
  enabled: false,

  Required: {
    Bridge: '1.1.0'
  },

  support: {
    canvas: (function() {
      var canvas = document.createElement('canvas');
      return !!(canvas.getContext && canvas.getContext('2d'));
    })()
  },

  insertScript: function(source) {
    try {
      document.write("<script type='text/javascript' src='" + source + "'><\/script>");
    } catch(e) {
      var head = document.head || Bridge.$$('head').source[0].source;
      head.appendChild(new Bridge.Element('script', {
          src: source,
          type: 'text/javascript'
      }));
    }
  },

  require: function(library, name) {
    if ((typeof window[library] == 'undefined') ||
      (this.convertVersionString(window[library].Version) <
       this.convertVersionString(this.Required[library])))
      alert('Spinners requires ' + (name || library) + ' >= ' + this.Required[library]);
  },

  convertVersionString: function(versionString) {
    var v = versionString.replace(/_.*|\./g, '');
    v = parseInt(v + Bridge.String.times('0', 4 - v.length));
    return versionString.indexOf('_') > -1 ? v - 1 : v;
  },

  start: function() {
    this.require('Bridge');

    // require excanvas
    if (!this.support.canvas && !window.G_vmlCanvasManager) {
      if (!!(window.attachEvent && navigator.userAgent.indexOf('Opera') === -1)) {
        alert('Spinners requires ExplorerCanvas (excanvas.js)');
      }
      else return;
    }

    this.enabled = true;
  },

  get: function(element) {
    element = $B.$(element).source;
    if (!element) return;
    var matched = null;
    $B._each(this.spinners, function(spinner) {
      if (spinner.element == element)
        matched = spinner;
    });
    return matched;
  },

  add: function(spinner) {
    this.spinners.push(spinner);
  },

  remove: function(element) {
    var spinner = this.get(element);
    if (spinner) {
      spinner.remove();
      this.spinners = $B.Array.without(this.spinners, spinner);
    }
  },

  // remove all spinners that are not attached to the DOM
  removeDetached: (function() {
    function isAttached(node) {
      var topAncestor = findTopAncestor(node);
      return !!(topAncestor && topAncestor.body);
    }

    function findTopAncestor(node) {
      var ancestor = node;
      while(ancestor && ancestor.parentNode) {
        ancestor = ancestor.parentNode;
      }
      return ancestor;
    }

    return function() {
      $B.each(this.spinners, function(spinner) {
        if (spinner.element && !isAttached(spinner.element)) {
          this.remove(spinner.element);
        }
      }, this);
    }
  })()
});


/*
 * Math
 */
function pyth(a,b) {
  return Math.sqrt(a*a + b*b);
}

function degrees(radian) {
  return (radian*180) / Math.PI;
}

function radian(degrees) {
  return (degrees*Math.PI) / 180;
}

function scrollArray(array, distance) {
  if (!distance) return array;
  var first = array.slice(0, distance),
      last  = array.slice(distance, array.length);
  return last.concat(first);
}
  
/*
 * Helpers
 */
var Canvas = {
  drawRoundedRectangle: function(ctx) {
    var options = $B.Object.extend({
      top:    0,
      left:   0,
      width:  0,
      height: 0,
      radius: 0
    }, arguments[1] || {});

    var o      = options,
        left   = o.left,
        top    = o.top,
        width  = o.width,
        height = o.height,
        radius = o.radius;

    ctx.beginPath();

    ctx.moveTo(left + radius, top);
    ctx.arc(left + width - radius, top + radius, radius, radian(-90), radian(0), false);
    ctx.arc(left + width - radius, top + height - radius, radius, radian(0), radian(90), false);
    ctx.arc(left + radius, top + height - radius, radius, radian(90), radian(180), false);
    ctx.arc(left + radius, top + radius, radius, radian(-180), radian(-90), false);

    ctx.closePath();

    ctx.fill();
  }
};


var Color = (function() {
  var hexNumber = '0123456789abcdef',
      hexRegExp = new RegExp('[' + hexNumber + ']', 'g');
  
  function returnRGB(rgb) {
    var result = rgb;
    result.red = rgb[0];
    result.green = rgb[1];
    result.blue = rgb[2];
    return result;
  }

  function h2d(h) { return parseInt(h,16); }

  function hex2rgb(hex) {
    var rgb = [];

    if (hex.indexOf('#') == 0) hex = hex.substring(1);
    hex = hex.toLowerCase();

    if (hex.replace(hexRegExp, '') != '')
    return null;

    if (hex.length == 3) {
      rgb[0] = hex.charAt(0) + hex.charAt(0);
      rgb[1] = hex.charAt(1) + hex.charAt(1);
      rgb[2] = hex.charAt(2) + hex.charAt(2);
    } else {
      rgb[0] = hex.substring(0, 2);
      rgb[1] = hex.substring(2, 4);
      rgb[2] = hex.substring(4);
    }
    for(var i = 0; i < rgb.length; i++)
      rgb[i] = h2d(rgb[i]);

    return returnRGB(rgb);
  }

  function hex2rgba(hex, opacity) {
    var rgba = hex2rgb(hex);
    rgba[3] = opacity;
    rgba.opacity = opacity;
    return rgba;
  }

  function hex2fill(hex, opacity) {
    if ($B.Object.isUndefined(opacity)) opacity = 1;
    return "rgba(" + hex2rgba(hex, opacity).join() + ")";
  }

  var rgb2hex = (function() {
    function toPaddedString(string, length, radix) {
      string = (string).toString(radix || 10);
      return $B.String.times('0', length - string.length) + string;
    }

    return function(red, green, blue) {
      return '#' + toPaddedString(red, 2, 16) +
                   toPaddedString(green, 2, 16) +
                   toPaddedString(blue, 2, 16);
    };
  })();

  return {
    hex2rgb:  hex2rgb,
    hex2fill: hex2fill,
    rgb2hex:  rgb2hex
  };
})();


/*
 * Spinner
 */
function Spinner(element) {
  element = $B.$(element);
  if (!element) return;

  this.element = element.source;

  Spinners.remove(element);
  Spinners.removeDetached();

  this.options = $B.Object.extend({
    radii: [5, 10],
    color: '#000',
    dashWidth: 1.8,
    dashes:  12,
    opacity: 1,
    padding: 3,
    speed:   .7,
    build:   true
  }, arguments[1]);

  this._position = 0;
  this._state = 'stopped';

  // IE VML needs the element build inside an element attached
  // to the DOM, this allows you to delay the build and do it manually
  if (this.options.build) this.build();

  Spinners.add(this);
}

$B.Object.extend(Spinner.prototype, (function() {
  function remove() {
    if (!this.canvas) return;

    this.stop();

    this.canvas.remove();

    this.canvas = null;
    this.ctx = null;
  }

  function build() {
    this.remove();

    var layout            = this.getLayout(),
        workspaceRadius   = layout.workspace.radius,
        workspaceDiameter = workspaceRadius * 2;

    $B.$(this.element).insert(
        this.canvas = new $B.Element('canvas', {
          height: workspaceDiameter,
          width:  workspaceDiameter
        }).setStyle({ zoom: 1 })
    );

    // init canvas
    if (window.G_vmlCanvasManager)
      G_vmlCanvasManager.initElement(this.canvas.source);

    this.ctx = this.canvas.source.getContext('2d');
    this.ctx.globalAlpha = this.options.opacity;

    this.ctx.translate(workspaceRadius, workspaceRadius);
    this.drawPosition(0);

    return this;
  }

  /*
   * Draw
   */
  function drawPosition(position) {
    var workspace          = this.getLayout().workspace,
        workspaceDiameter  = workspace.radius * 2,
        workspaceNegRadius = -1 * workspace.radius,
        dashes             = this.options.dashes;

    this.ctx.clearRect(workspaceNegRadius, workspaceNegRadius, workspaceDiameter, workspaceDiameter);

    var rotation  = radian(360 / dashes),
        opacities = scrollArray(workspace.opacities, position * -1);

    for (var i = 0, len = dashes; i < len; i++) {
      this.drawDash(opacities[i], this.options.color);
      this.ctx.rotate(rotation);
    }
  }

  function drawDash(opacity, color) {
    this.ctx.fillStyle = Color.hex2fill(color, opacity);

    var layout          = this.getLayout(),
        workspaceRadius = layout.workspace.radius,
        dashPosition    = layout.dash.position,
        dashDimensions  = layout.dash.dimensions;

    Canvas.drawRoundedRectangle(this.ctx, {
      top:    dashPosition.top - workspaceRadius,
      left:   dashPosition.left - workspaceRadius,
      width:  dashDimensions.width,
      height: dashDimensions.height,
      radius: Math.min(dashDimensions.height, dashDimensions.width) / 2
    });
  }

  /*
   * Position
   */
  function _nextPosition() {
    var ms = this.options.speed * 1000 / this.options.dashes;
    this.nextPosition();
    this._playTimer = window.setTimeout($B.Function.bind(_nextPosition, this), ms);
  }

  function nextPosition() {
    if (this._position == this.options.dashes - 1)
      this._position = -1;
    this._position++;
    this.drawPosition(this._position);
  }

  /*
   * Controls
   * play, pause, stop
   */
  function play() {
    if (this._state == 'playing') return;

    this._state = 'playing';

    var ms = this.options.speed * 1000 / this.options.dashes;
    this._playTimer = window.setTimeout($B.Function.bind(_nextPosition, this), ms);
    return this;
  }

  function pause() {
    if (this._state == 'paused') return;

    this._pause();

    this._state = 'paused';
    return this;
  }

  function _pause() {
    if (!this._playTimer) return;
    window.clearTimeout(this._playTimer);
    this._playTimer = null;
  }

  function stop() {
    if (this._state == 'stopped') return;

    this._pause();

    this._position = 0;
    this.drawPosition(0);

    this._state = 'stopped';
    return this;
  }

  function toggle() {
    this[this._state == 'playing' ? 'pause' : 'play']();
    return this;
  }

  /*
   * Layout
   */
  function getOpacityArray(dashes) {
    var step  = 1 / dashes, array = [];
    for (var i = 0;i<dashes;i++)
      array.push((i + 1) * step);
    return array;
  }

  function getLayout() {
    if (this._layout) return this._layout;

    var options   = this.options,
        dashes    = options.dashes,
        radii     = options.radii,
        dashWidth = options.dashWidth,
        minRadius = Math.min(radii[0], radii[1]),
        maxRadius = Math.max(radii[0], radii[1]),

        maxWorkspaceRadius = Math.max(dashWidth, maxRadius),
        workspaceRadius = Math.ceil(Math.max(
          maxWorkspaceRadius,
          // the hook created by dashWidth
          // could give a bigger radius
          pyth(maxRadius, dashWidth/2)
        ));

    workspaceRadius += options.padding;

    var layout = {
      workspace: {
        radius: workspaceRadius,
        opacities: getOpacityArray(dashes)
      },
      dash: {
        position: {
          top:  workspaceRadius - maxRadius,
          left: workspaceRadius - dashWidth / 2
        },
        dimensions: {
          width: dashWidth,
          height: maxRadius - minRadius
        }
      }
    };

    // cache
    this._layout = layout;

    return layout;
  } 

  return {
    remove:        remove,
    build:         build,
    getLayout:     getLayout,
    _nextPosition: _nextPosition,
    nextPosition:  nextPosition,
    drawPosition:  drawPosition,
    drawDash:      drawDash,
    play:          play,
    pause:         pause,
    _pause:        _pause,
    stop:          stop,
    toggle:        toggle
  };
})());

// expose
window.Spinner = Spinner;

Spinners.start();

// if there's no support for Canvas/VML, make sure everything dies silently
if (!Spinners.enabled) {
  $B.each($B.Object.keys(Spinner.prototype), function(name) {
    Spinner.prototype[name] = $B.K;
  });
  Spinner = $B.K;

  $B.each('get add remove removeDetached'.split(' '), function(name) {
    Spinners[name] = $B.K;
  });
}
})(Bridge);