/*  Spinners 2.0_b1
 *  (c) 2010-2011 Nick Stakenburg - http://www.nickstakenburg.com
 *
 *  Spinners is freely distributable under the terms of an MIT-style license.
 *
 *  Requires ExplorerCanvas to work in Internet Explorer:
 *  http://code.google.com/p/explorercanvas
 *
 *  GitHub: https://github.com/staaky/spinners
 */

(function() {

var Spinners = {
  Version: '2.0_b1'
};

// Helper methods based on Prototype and Underscore
var _slice = Array.prototype.slice;
var _ = {
  extend: function(destination, source) {
    for (var property in source)
      destination[property] = source[property];
    return destination;
  },

  'break': {},

  _each: function(array, iterator) {
    for (var i = 0, length = array.length; i < length; i++)
      iterator(array[i]);
  },

  each: function(array, iterator, context) {
    var index = 0;

    try {
      this._each(array, function(value) {
        iterator.call(context, value, index++);
      });
    } catch (e) {
      if (e != _['break']) throw e;
    }
  },

  bind: function(fn, object) {
    var args = _slice.call(arguments, 2);
    return function() {
      return fn.apply(object, args.concat(_slice.call(arguments)));
    };
  },
  
  scroll: function(array, distance) {
    if (!distance) return array;
    var first = array.slice(0, distance),
        last  = array.slice(distance, array.length);
    return last.concat(first);
  },

  any: function(object, iterator, context) {
    var result = false;
    _.each(object || [], function(value, index) {
      if (result |= iterator.call(context, value, index)) return _['break'];
    });
    return !!result;
  },

  member: function(object, target) {
    var found = false;
    _.any(object || [], function(value) {
      if (found = value === target) return true;
    });
    return found;
  },

  select: function(object, iterator, context) {
    var results = [];
    _.each(object || [], function(value, index) {
      if (iterator.call(context, value, index)) results[results.length] = value;
    });
    return results;
  },

  without: function(array) {
    var values = _slice.call(arguments, 1);
    return _.select(array, function(value){ return !_.member(values, value); });
  }
};

/*
 * Math
 */
function pyth(a,b) { return Math.sqrt(a*a + b*b); }
function degrees(radian) { return (radian*180) / Math.PI; }
function radian(degrees) { return (degrees*Math.PI) / 180; }

/*
 * Canvas
 */
var Canvas = {
  drawRoundedRectangle: function(ctx) {
    var options = _.extend({
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


/*
 * Color
 */
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
    if (typeof opacity == 'undefined') opacity = 1;
    return "rgba(" + hex2rgba(hex, opacity).join() + ")";
  }

  var rgb2hex = (function() {
    function toPaddedString(string, length, radix) {
      string = (string).toString(radix || 10);
      return (new Array(length - string.length).join('0')) + string;
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
 * Spinners
 */
_.extend(Spinners, {
  enabled: false,

  support: {
    canvas: (function() {
      var canvas = document.createElement('canvas');
      return !!(canvas.getContext && canvas.getContext('2d'));
    })()
  },

  dom: (function() {
    var select, match;
    select = match = function() {
      throw('Using Spinners with a CSS Selector requires a selector engine, include one of: Sizzle (jQuery 1.4+/Prototype 1.7+), NWMatcher or Slick (MooTools 1.3+).');  
    };

    if (window.Sizzle) {
      select = Sizzle;
      match = Sizzle.matches;
    }
    else if (window.jQuery) {
      select = jQuery.find;
      match = function(element, selector) {
        return jQuery(element).is(selector);
      }
    }
    else if (window.NWMatcher && NW.Dom) {
      select = NW.Dom.select;
      match  = NW.Dom.match;
    }
    else if (window.Prototype && Prototype.Selector) {
      select = Prototype.Selector.select;
      match  = Prototype.Selector.match;
    }
    else if (window.Slick) {
      select = function(selector, context) {
        return Slick.search(context || document, selector);
      };
      match = Slick.match;
    }
    
    return {
      select: select,
      match:  match
    };
  })(),

  init: function() {
    // require excanvas
    if (!this.support.canvas && !window.G_vmlCanvasManager) {
      if (!!(window.attachEvent && navigator.userAgent.indexOf('Opera') === -1)) {
        alert('Spinners requires ExplorerCanvas (excanvas.js)');
      }
      else return;
    }

    // make sure excanvas is initialized
    (window.G_vmlCanvasManager && window.G_vmlCanvasManager.init_(document));

    this.enabled = true;
  },

  create: function(element, options) {
    Collection.create(element, options);
    return this.get(element);
  },

  get: function(element) { return new Collection(element); },

  play: function(element)   { this.get(element).play(); return this; },
  pause: function(element)  { this.get(element).pause(); return this; },
  toggle: function(element) { this.get(element).toggle(); return this; },
  stop: function(element)   { this.get(element).stop(); return this; },

  remove: function(element) { this.get(element).remove(); return this; },

  removeDetached: function(element) {
    All.removeDetached();
    return this;
  },

  getDimensions: function(element) {
    var spinner   = All.get(element)[0],
        diameter  = spinner.getLayout().workspace.radius * 2;

    return { width: diameter, height: diameter };
  }
});


// We keep track spinners so things can be cleanup up when elements leave the DOM
var All = {
  spinners: [],

  get: function(element) {
    if (!element) return;
    var matched = [];
    _.each(this.spinners, function(spinner) {
      if (spinner &&
        (element.nodeType == 1 ? spinner.element == element : // element
        Spinners.dom.match(spinner.element, element) // selector
      )) {
        matched.push(spinner);
      }
    });
    return matched;
  },

  add: function(spinner) { this.spinners.push(spinner); },

  remove: function(element) {
    var elements = [];
    _.each(this.spinners, function(spinner) {
      if (element.nodeType == 1 ? spinner.element == element :
        Spinners.dom.match(spinner.element, element)
      ) {
        elements.push(spinner.element);
      }
    });
    _.each(elements, _.bind(function(r) { this.removeByElement(r); }, this));
  },

  removeByElement: function(element) {
    var spinner = this.get(element)[0];
    if (spinner) {
      spinner.remove();
      this.spinners = _.without(this.spinners, spinner);
    }
  },

  // remove all spinners that are not attached to the DOM
  removeDetached: (function() {
    return function() {
      _.each(this.spinners, function(spinner) {
        if (spinner && !spinner.isAttached())
          this.remove(spinner.element);
      }, this);
    };
  })()
};


/*
 * Collection
 */
function Collection(element) { this.element = element; };

_.extend(Collection, {
  create: function(element) {
    if (!element) return;
    var options = arguments[1] || {},
        spinners = [];
  
    if (element.nodeType == 1) {
      spinners.push(new Spinner(element, options));
    }
    else {
      // if it's not a string, they assume selector
      _.each(Spinners.dom.select(element) || [], function(el) {
        spinners.push(new Spinner(el, options));
      });
    }

    return spinners;
  }
});

_.extend(Collection.prototype, {
  items: function() {
    return All.get(this.element);
  },

  play: function() {
    _.each(this.items(), function(s) { s.play(); });
    return this;
  },

  stop: function() {
    _.each(this.items(), function(s) { s.stop(); });
    return this;
  },

  pause: function() {
    _.each(this.items(), function(s) { s.pause(); });
    return this;
  },
  
  toggle: function() {
    _.each(this.items(), function(s) { s.toggle(); });
    return this;
  },

  remove: function() {
    All.remove(this.element);
    return this;
  }
});


/*
 * Spinner
 */
function Spinner(element) {
  if (!element) return;

  this.element = element;

  All.remove(element);
  All.removeDetached();

  this.options = _.extend({
    radii: [5, 10],
    color: '#000',
    dashWidth: 1.8,
    dashes:  12,
    opacity: 1,
    padding: 3,
    speed:   .7,
    build:   true
  }, arguments[1] || {});

  this._position = 0;
  this._state = 'stopped';

  this.build();

  All.add(this);
}
_.extend(Spinner.prototype, (function() {
  function remove() {
    if (!this.canvas) return;

    this.stop();

    this.canvas.parentNode.removeChild(this.canvas);

    this.canvas = null;
    this.ctx = null;
  }

  function build() {
    this.remove();

    var layout            = this.getLayout(),
        workspaceRadius   = layout.workspace.radius,
        workspaceDiameter = workspaceRadius * 2;

    this.canvas = document.createElement('canvas');
    this.canvas.style.zoom = 1;
    this.canvas.height = workspaceDiameter;
    this.canvas.width = workspaceDiameter;

    // IE bug: append canvas to the body before getting context
    document.body.appendChild(this.canvas);

    // init canvas
    if (window.G_vmlCanvasManager)
      G_vmlCanvasManager.initElement(this.canvas);

    this.ctx = this.canvas.getContext('2d');
    this.ctx.globalAlpha = this.options.opacity;
  
    // IE: append to element after getting context
    this.element.appendChild(this.canvas);
    
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
        opacities = _.scroll(workspace.opacities, position * -1);

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
    this._playTimer = window.setTimeout(_.bind(_nextPosition, this), ms);
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
    this._playTimer = window.setTimeout(_.bind(_nextPosition, this), ms);
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

  function isAttached() {
    if (!this.element) return false;
    var topAncestor = findTopAncestor(this.element);
    return !!(topAncestor && topAncestor.body);
  }

  function findTopAncestor(node) {
    var ancestor = node;
    while(ancestor && ancestor.parentNode) {
      ancestor = ancestor.parentNode;
    }
    return ancestor;
  }

  return {
    remove:        remove,
    build:         build,
    getLayout:     getLayout,
    isAttached:    isAttached,
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
window.Spinners = Spinners;

// start
Spinners.init();

// if there's no support for Canvas/VML, make sure everything dies silently
if (!Spinners.enabled) {
  _.each('create get remove play stop pause toggle'.split(' '), function(name) {
    Spinners[name] = function() { return this; };
  });
}
})();