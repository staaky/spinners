Spinners
=======

Spinners is a JavaScript library that gives you highly configurable loading animations using nothing but Canvas (and VML on Internet Explorer).


## Installation

Spinners requires [ExplorerCanvas][1] to work with Canvas in Internet Explorer, download and include it using a conditional comment and include Spinners below it.

    <!--[if lt IE 9]>
      <script type="text/javascript" src="/js/excanvas.js"></script>
    <![endif]-->
    
    <script type="text/javascript" src="/js/spinners.min.js"></script>


## Usage

Creating one or more spinners can be done using a HTMLElement or a CSS Selector (if you've included a CSS Selector Engine). Spinners will start out in a paused state because animation takes up a small amount of browser resources, this is why it's recommended to only animate spinners when they are visible on the page and pause them once you hide them.

CSS Selectors are only available if you've included a CSS Selector Engine, Spinners supports Sizzle (jQuery 1.4+/Prototype 1.7+), NWMatcher and Slick (MooTools 1.3+).

    Spinners.create('#mySpinner');
    Spinners.create('#mySpinner').play();  // will start the animation
    Spinners.create('#mySpinner').pause(); // pauses the spinner
    
    // or provide a DOM node
    Spinners.create(document.getElementById('mySpinner')).play();
    
    // multiple spinners using a CSS Selector
    Spinners.create('.loading').play();

To create more advanced spinners you can provide an optional second parameter with options:

    Spinners.create('.loading', {
      radii:     [32, 42],
      color:     '#ed145b',
      dashWidth: 1,
      dashes:    20,
      opacity:   .8,
      speed:     .7
    }).play();


### Collections

`Spinners.create` returns a Collection object that controls a number of spinners.

    var spinners = Spinners.create('.loading');
    spinners.play();

Spinners created using `Spinners.create` can be retrieved using `Spinners.get`, this way you don't have to keep track of the Collection.

    Spinners.create('.loading');
    Spinners.get('.loading').pause();


### Controls

The methods `play`, `pause`, `stop`, `toggle` and `remove` are available on Collections returned by `Spinners.create` and `Spinners.get`.

    Spinners.create('.loading').play();
    Spinners.get('.loading').pause();
    Spinners.get('.loading').stop();
    Spinners.get('.loading').remove();
    Spinners.get(document.getElementById('mySpinner')).toggle();

They can also be used directly on the `Spinners` object using a CSS Selector or a HTMLElement, this allows chaining on different Collections.

    Spinners.create('#first .loading').play();
    Spinners.create('#second .loading');
    
    Spinners.play('#first .loading').pause('#second .loading');
    Spinners.remove('#first .loading').play('#second .loading');
    
    Spinners.toggle(document.getElementById('mySpinner'));


### Removal

The `remove` method will take the spinner out of the DOM when you no longer need it.

    Spinners.get('.loading').remove();

It might be easier to just remove the elements you've attached spinners to and use `Spinners.removeDetached`, this function is also called automatically each time you create a new spinner.

    // after deleting elements with spinners or doing some ajax updates it's recommended to call:
    Spinners.removeDetached();


### Dimensions

In case you need to work with the dimensions of a spinner you can get those using `Spinners.getDimensions`

    var dimensions = Spinners.getDimensions(document.getElementById('mySpinner'));
    // dimensions; //--> { width: 28, height: 28 }


  [1]: http://explorercanvas.googlecode.com