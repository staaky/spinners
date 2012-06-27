Spinners
=======

Spinners is a JavaScript library that creates pixel-perfect cross-browser loading icons through Canvas. Written for use in [Lightview][1] and [Tipped][2], feel free to use it in your own projects.

Demo (GUI): http://projects.nickstakenburg.com/spinners


## Installation

Spinners is based on jQuery, it also requires [ExplorerCanvas][3] to work in Internet Explorer 8 and below, include both scripts above Spinners.

    <script type="text/javascript" src="https://ajax.googleapis.com/ajax/libs/jquery/1.7/jquery.min.js"></script>
    
    <!--[if lt IE 9]>
      <script type="text/javascript" src="/js/excanvas.js"></script>
    <![endif]-->
    
    <script type="text/javascript" src="/js/spinners.min.js"></script>


## Usage

Spinners can be created using a DOM Node or a CSS Selector. Spinners start out in a paused state because animation takes up a small amount of browser resources, because of this it's recommended to only animate spinners when they are visible.

    var spinner = Spinners.create(document.getElementById('mySpinner')).play(); // will start the animation
    spinner.pause(); // pauses the spinner
    
    // multiple spinners using a CSS Selector
    var spinners = Spinners.create('.loading').play();
    spinners.pause();

Options can be used to customize the spinners:

    Spinners.create('.loading', {
      radius: 22,
      dashes: 30,
      width: 2.5,
      height: 10,
      opacity: 1,
      padding: 3,
      rotation: 600,
      color: '#000000'
    }).play();


### Collections

`Spinners.create` returns a Collection object that controls a number of spinners.

    var spinners = Spinners.create('.loading');
    spinners.play();

Spinners created using `Spinners.create` can be retrieved using `Spinners.get`, this removes the need to store the Collection.

    Spinners.create('.loading');
    Spinners.get('.loading').pause();


### Controls

The methods `play`, `pause`, `stop`, `toggle` and `remove` are available on Collections returned by `Spinners.create` and `Spinners.get`.

    Spinners.create('.loading').play();
    Spinners.get('.loading').pause();
    Spinners.get('.loading').stop();
    Spinners.get('.loading').remove();
    Spinners.get(document.getElementById('mySpinner')).toggle();

They can also be used directly on the `Spinners` object using a CSS Selector or a DOM Node, this allows chaining on different Collections.

    Spinners.create('#first .loading').play();
    Spinners.create('#second .loading');
    
    Spinners.play('#first .loading').pause('#second .loading');
    Spinners.remove('#first .loading').play('#second .loading');
    
    Spinners.toggle(document.getElementById('mySpinner'));


### Positioning

Options can be changed after initialization using `setOptions`.

    var spinners = Spinners.create('.loading');
    spinners.setOptions({ color: '#ff0000' });


### Removal

The `remove` method will remove the created spinners from the DOM.

    Spinners.get('.loading').remove();


It might be easier to just remove elements from the DOM followed by a call to `Spinners.removeDetached`, this function is also called automatically each time a new spinner is created.

    // after deleting elements with spinners or doing some ajax updates
    Spinners.removeDetached();


### Positioning

Use `center` to center the element that holds the spinner within its parent. This is done using absolute positioning, the parent element will be given `position:relative`. In this example #spinner will be given `position:absolute` and its parent `position:relative`.

    Spinners.create('#spinner').center().play();


### Dimensions

`Spinners.getDimensions` will return the dimensions of a created spinner. This could be useful when `center()` isn't used to position the spinner.

    var dimensions = Spinners.getDimensions(document.getElementById('mySpinner'));
    // dimensions; //--> { width: 28, height: 28 }


  [1]: http://projects.nickstakenburg.com/lightview
  [2]: http://projects.nickstakenburg.com/tipped
  [3]: http://explorercanvas.googlecode.com