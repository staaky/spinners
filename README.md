Spinners
=======

Throw out your animated gifs! Spinners is a JavaScript library that gives you highly configurable loading animations using nothing but Canvas and VML on Internet Explorer.


## Installation

Spinners uses [BridgeJS][1] to work with your JavaScript framework of choice. [Get BridgeJS][1], upload all the files and include bridge.js after one of the JavaScript libraries it supports.

Download [ExplorerCanvas][2] and include it.

Include spinners.js below these files.

        <script type="text/javascript" src="http://ajax.googleapis.com/ajax/libs/jquery/1/jquery.js"></script>
        <script type="text/javascript" src="/js/bridge/bridge.js"></script>
         
        <!--[if lt IE 9]>
          <script type="text/javascript" src="/js/excanvas.js"></script>
        <![endif]-->
         
        <script type="text/javascript" src="/js/spinners.js"></script>


## Usage

Creating a spinner is as easy as:

    new Spinner('id').play();
        
    // or provide a dom node
    new Spinner(document.getElementById('id')).play();

To create more advanced spinners you can provide an optional second parameter with options:

    new Spinner('insertSpinner', {
      radii:     [32, 42],
      dash: {
        width: 1,
        color: '#ed145b'
      },
      dashes:    75,
      opacity:   .8,
      speed:     .7
    }).play();

The radii option is an array containing the inner (empty) and outer radius of your spinner, you could say that they control the length of a dash. 

There are some controls available:

    var mySpinner = new Spinner().play();
    mySpinner.pause();
    mySpinner.toggle();
    mySpinner.stop();

Once you no longer need the spinner you can remove it using:

    mySpinner.remove();

It might be easier to just remove the elements you've attached spinners to and use `Spinners.removeDetached`, this function is also called automatically each time you create a new spinner.

    // after deleting elements with spinners or doing some ajax updates
    Spinners.removeDetached();


  [1]: http://www.github.com/staaky/bridgejs
  [2]: http://explorercanvas.googlecode.com