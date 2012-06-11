$(document).ready(function() {
  // TODO: add a list of preset spinners with examples that can be loaded as options 
  
  var vp_timer,
      spinner = Spinners.create('#spinner').center().play(),
      _code   = $('#gui .code code').html();

  // disable play button
  $("#gui .controls [data-control='play']").addClass('disabled');
  
  // prettify code
  if (!!window.prettyPrint) {
    $('pre').addClass('prettyprint');
    prettyPrint();
  }
  
  // sliders
  $('#gui .slider').each(function(i, element) {
    var options = {
      min:   parseFloat($(element).data('slider-min')),
      max:   parseFloat($(element).data('slider-max')),
      step:  parseFloat($(element).data('slider-step')) || 1,
      value: parseFloat($(element).next('input.value').val() || 1)
    };

    $(element).slider(options);
    
    $(element).bind('slidechange', function(event, ui) {
      $(element).next('input[type=text]').val(ui.value);
      
      update();
      Options.store();
      
      // visualize padding
      if ($(this).next('input').attr('name') == 'padding') { //is("[data-option='padding']")) {
        var se = $('#spinner').css({ backgroundColor: '#99ccff'});
        
        if (vp_timer) { window.clearTimeout(vp_timer); vp_timer = null; }
        vp_timer = window.setTimeout(function() {
          se.animate({ backgroundColor: '#ffffff' }, 400, function() {
            $(this).css({ backgroundColor: 'transparent' });
          });
        }, 1500);
      }
    });
  });
  
  // inputs
  $('#gui .option input').bind('keyup change', function() {
    var slider = $(this).prev('.slider');
    
    // increase slider min/max if required
    if (slider[0] && $(this).attr('name') != 'opacity') {
      var val = parseFloat($(this).val()),
          min = slider.slider('option', 'min'),
          max = slider.slider('option', 'max');
      if (val < min) slider.slider('option', 'min', val);
      if (val > max) slider.slider('option', 'max', val);
    }

    // colors should start with #
    if ($(this).attr('name') == 'color' && $(this).val().substr(0,1) != '#') {
      $(this).val('#' + $(this).val());
    }

    // update the slider
    // disabled because jquery-ui triggers slidechange before the value updates
    // slider.slider('value', parseFloat($(this).val()));
    
    update();
    Options.store();
  });
  
  // controls
  $("#gui .controls input").each(function(i, element) {
    $(element).bind('click', function(event) {
      event.preventDefault();
      
      spinner[$(this).data('control')]();
      
      $(this).addClass('disabled').siblings().removeClass('disabled');
    });
  })
  
  // collect the options
  function getOptions() {
    var options = {};

    $('.option .slider').each(function(i, element) {
      var input = $(element).next('input');
      options[input.attr('name')] = parseFloat(input.val());
    });

    // add color
    options.color = $("#gui input[name='color']").val();
    
    return options;
  }

  // update, syncs sliders and code with inputs
  function update() {
    var options = getOptions();
    
    // update code
    var code = _code;
    $.each(options, function(name, value) {
      code = code.replace('#{' + name + '}', value, 'g');
    });
    $('#gui .code code').html(code);
    if (!!window.prettyPrint) prettyPrint();
    
    // update spinners
    spinner.setOptions(options);
  }
  
  
  // options on #
  var Options = {
    fromHash: function() {
      var qs_hash = /#!(.*)/.exec(decodeURIComponent(location.href)),
          ho = qs_hash && qs_hash[1];
      if (!ho) return;
      
      var options = {};
      
      $.each(ho.split('&'), function(i, pair) {
        var p = pair.split('='), name = p[0], value = p[1];
        options[name] = value;
        if (name != 'color') options[name] = parseFloat(options[name]);
        else if (options[name].substr(0,1) != '#') options[name] = '#' + options[name];
      });
      return options;
    },

    toHash: function() {
      return '#!' + $('#gui form').serialize();
    },

    restore: function() {
      var options = this.fromHash();
      if (!options) return;
      
      $('#gui form input').each(function(i, element) {
        var name = $(element).attr('name');
        if (options[name]) $(element).val(options[name]);
      });
      
      update();
    },
  
    store: function() {
      var hash = this.toHash(),
          href = location.href;
      href = href.replace(/#!(.*)/, '');
      window.location.href = href + hash;
    }
  };
  
  // attempt to restore options from #
  Options.restore();

  //first render
  update();
});