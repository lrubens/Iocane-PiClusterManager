// version: 2019-01-22
    /**
    /**
    * o--------------------------------------------------------------------------------o
    * | This file is part of the RGraph package - you can learn more at:               |
    * |                                                                                |
    * |                         https://www.rgraph.net                                 |
    * |                                                                                |
    * | RGraph is licensed under the Open Source MIT license. That means that it's     |
    * | totally free to use and there are no restrictions on what you can do with it!  |
    * o--------------------------------------------------------------------------------o
    */

    RGraph = window.RGraph || {isRGraph: true};




    /**
    * The bar chart constructor
    *
    * @param object canvas The canvas object
    * @param array  data   The chart data
    */
    RGraph.Bar = function (conf)
    {
        /**
        * Allow for object config style
        */
        if (typeof conf === 'object' && typeof conf.data === 'object'&& typeof conf.id === 'string') {
            var id                        = conf.id,
                canvas                    = document.getElementById(id),
                data                      = conf.data,
                parseConfObjectForOptions = true // Set this so the config is parsed (at the end of the constructor)
        } else {
            var id     = conf,
                canvas = document.getElementById(id),
                data   = arguments[1]
        }




        // Get the canvas and context objects
        this.id                     = id;
        this.canvas                 = canvas;
        this.context                = this.canvas.getContext('2d');
        this.canvas.__object__      = this;
        this.type                   = 'bar';
        this.max                    = 0;
        this.stackedOrGrouped       = false;
        this.isRGraph               = true;
        this.uid                    = RGraph.CreateUID();
        this.canvas.uid             = this.canvas.uid ? this.canvas.uid : RGraph.CreateUID();
        this.colorsParsed           = false;
        this.original_colors        = [];
        this.cachedBackgroundCanvas = null;
        this.firstDraw              = true; // After the first draw this will be false

        // This is a list of new property names that are used now in place of
        // the old names.
        //
        // *** When adding this list to a new chart library don't forget ***
        // *** the bit of code that also goes in the .set() function     ***
        this.propertyNameAliases = {
            //'chart.margin.left':                  'chart.gutter.left',
            //'chart.margin.right':                 'chart.gutter.right',
            //'chart.margin.top':                   'chart.gutter.top',
            //'chart.margin.bottom':                'chart.gutter.bottom',
            //'chart.background.bars.count':        'chart.background.barcount', //
            //'chart.background.bars.color1':       'chart.background.barcolor1', //
            //'chart.background.bars.color2':       'chart.background.barcolor2', //
            //'chart.background.grid.linewidth':    'chart.background.grid.width',
            //'chart.background.grid.hlines.count': 'chart.background.grid.autofit.numhlines',
            //'chart.background.grid.vlines.count': 'chart.background.grid.autofit.numvlines',
            //'chart.background.grid.align':        'chart.background.grid.autofit.align',
            //'chart.axes':                         function (opt) {return {name:'chart.noaxes',value:!opt.value}},
            //'chart.axes.color':                   'chart.axis.color',
            //'chart.axes.linewidth':               'chart.axis.linewidth',
            //'chart.colors.background':            'chart.backround.color',
            //'chart.colors.stroke':                'chart.strokestyle',
            //'chart.yaxis.tickmarks.count':        'chart.numyticks',
            //'chart.yaxis.labels':                 'chart.ylabels',
            //'chart.yaxis.labels.count':           'chart.ylabels.count',
            //'chart.yaxis.labels.specific':        'chart.ylabels.specific',
            //'chart.yaxis.title':                  'chart.title.yaxis',
            //'chart.yaxis.title.size':             'chart.title.yaxis.size',
            //'chart.yaxis.title.font':             'chart.title.yaxis.font',
            //'chart.yaxis.title.bold':             'chart.title.yaxis.bold',
            //'chart.yaxis.title.color':            'chart.title.yaxis.color',
            //'chart.yaxis.title.italic':           'chart.title.yaxis.italic',
            //'chart.yaxis.title.pos':              'chart.title.yaxis.pos',
            //'chart.yaxis.title.x':                'chart.title.yaxis.x',
            //'chart.yaxis.title.y':                'chart.title.yaxis.y',
            //'chart.yaxis.labels.offsetx':         'chart.ylabels.offsetx',
            //'chart.yaxis.labels.offsety':         'chart.ylabels.offsety',
            //'chart.yaxis.scale.max':              'chart.ymax',
            //'chart.yaxis.scale.min':              'chart.ymin',
            //'chart.yaxis.position':               'chart.yaxispos',
            //'chart.yaxis.scale.units.pre':        'chart.units.pre',
            //'chart.yaxis.scale.units.post':       'chart.units.post',
            //'chart.yaxis.scale.formatter':        'chart.scale.formatter',
            //'chart.yaxis.scale.decimals':         'chart.scale.decimals',
            //'chart.yaxis.scale.point':            'chart.scale.point',
            //'chart.yaxis.scale.thousand':         'chart.scale.thousand',
            //'chart.yaxis.scale.round':            'chart.scale.round',
            //'chart.yaxis.scale.zerostart':        'chart.scale.zerostart',
            //'chart.yaxis.scale.font':             'chart.scale.font',
            //'chart.yaxis.scale.size':             'chart.scale.size',
            //'chart.yaxis.scale.color':            'chart.scale.color',
            //'chart.yaxis.scale.italic':           'chart.scale.italic',
            //'chart.yaxis.scale.bold':             'chart.scale.bold',
            //'chart.yaxis':                        function (opt) {return {name:'chart.noyaxis',value:!opt.value}},
            //'chart.xaxis':                        function (opt) {return {name:'chart.noxaxis',value:!opt.value}},
            //'chart.xaxis.tickmarks.last':         function (opt) {return {name:'chart.noendxtick',value:!opt.value}},
            //'chart.xaxis.tickmarks.count':        'chart.numxticks',
            //'chart.xaxis.labels':                 'chart.labels',
            //'chart.xaxis.labels.angle':           'chart.text.angle',
            //'chart.xaxis.labels.bold':            'chart.labels.bold',
            //'chart.xaxis.labels.color':           'chart.labels.color',
            //'chart.xaxis.labels.offsetx':         'chart.labels.offsetx',
            //'chart.xaxis.labels.offsety':         'chart.labels.offsety',
            //'chart.xaxis.title':                  'chart.title.xaxis',
            //'chart.xaxis.title.font':             'chart.title.xaxis.font',
            //'chart.xaxis.title.size':             'chart.title.xaxis.size',
            //'chart.xaxis.title.bold':             'chart.title.xaxis.bold',
            //'chart.xaxis.title.color':            'chart.title.xaxis.color',
            //'chart.xaxis.title.italic':           'chart.title.xaxis.italic',
            //'chart.xaxis.title.x':                'chart.title.xaxis.x',
            //'chart.xaxis.title.y':                'chart.title.xaxis.y',
            //'chart.xaxis.position':               'chart.xaxispos',
            //'chart.annotatable.color':            'chart.annotate.color',
            //'chart.annotatable.linewidth':        'chart.annotate.linewidth',
            //'chart.resizable.handle.background':  'chart.resize.handle.background',
            //'chart.bevelled':                     'chart.bevel',
            //'chart.combined.effect':              'chart.combinedchart.effect',
            //'chart.combined.effect.options':      'chart.combinedchart.effect.options',
            //'chart.combined.effect.callback':     'chart.combinedchart.effect.callback',
            //'chart.key.position.margin.boxed':   'chart.key.position.gutter.boxed'
            
            /* [NEW]:[OLD] */
        };

        /**
        * Compatibility with older browsers
        */
        //RGraph.OldBrowserCompat(this.context);


        // Various config type stuff
        this.properties =
        {
            'chart.background.bars.count':    null,
            'chart.background.bars.color1':   'rgba(0,0,0,0)',
            'chart.background.bars.color2':   'rgba(0,0,0,0)',
            'chart.background.grid':        true,
            'chart.background.grid.color':  '#ddd',
            'chart.background.grid.linewidth':  1,
            'chart.background.grid.hsize':  20,
            'chart.background.grid.vsize':  20,
            'chart.background.grid.vlines': true,
            'chart.background.grid.hlines': true,
            'chart.background.grid.border': true,
            'chart.background.grid.autofit':true,
            'chart.background.grid.autofit.align': true,
            'chart.background.grid.hlines.count': 5,
            'chart.background.grid.dashed': false,
            'chart.background.grid.dotted': false,
            'chart.background.image':       null,
            'chart.background.image.stretch': true,
            'chart.background.image.x':     null,
            'chart.background.image.y':     null,
            'chart.background.image.w':     null,
            'chart.background.image.h':     null,
            'chart.background.image.align': null,
            'chart.background.color':       null,
            'chart.background.hbars':       null,

            'chart.hmargin':                5,
            'chart.hmargin.grouped':        1,

            'chart.axes':                   true,
            'chart.axes.color':             'black',
            'chart.axes.linewidth':         1,
            
            'chart.margin.top':             35,
            'chart.margin.bottom':          35,
            'chart.margin.left':            35,
            'chart.margin.right':           35,
            
            'chart.labels.ingraph':         null,
            'chart.labels.ingraph.font':    null,
            'chart.labels.ingraph.size':    null,
            'chart.labels.ingraph.color':   null,
            'chart.labels.ingraph.bold':    null,
            'chart.labels.ingraph.italic':  null,
            'chart.labels.above':           false,
            'chart.labels.above.decimals':  0,
            'chart.labels.above.size':      null,
            'chart.labels.above.color':     null,
            'chart.labels.above.bold':      null,
            'chart.labels.above.italic':    null,
            'chart.labels.above.font':      null,
            'chart.labels.above.point':     '.',
            'chart.labels.above.thousand':  ',',
            'chart.labels.above.background':'rgba(0,0,0,0)',
            'chart.labels.above.angle':     null,
            'chart.labels.above.offset':    4,
            'chart.labels.above.units.pre': '',
            'chart.labels.above.units.post':'',
            
            'chart.yaxis':                  true,
            'chart.yaxis.tickmarks.count':  10,
            'chart.yaxis.scale.min':        0,
            'chart.yaxis.scale.max':        null,
            'chart.yaxis.scale.units.pre':  '',
            'chart.yaxis.scale.units.post': '',
            'chart.yaxis.scale.decimals':         0,
            'chart.yaxis.scale.point':            '.',
            'chart.yaxis.scale.thousand':         ',',
            'chart.yaxis.scale.round':            false,
            'chart.yaxis.scale.zerostart':        true,
            'chart.yaxis.labels':                true,
            'chart.yaxis.labels.count':          5,
            'chart.yaxis.labels.inside':         false,
            'chart.yaxis.labels.offsetx':        0,
            'chart.yaxis.labels.offsety':        0,
            'chart.yaxis.labels.font':        null,
            'chart.yaxis.labels.size':        null,
            'chart.yaxis.labels.color':       null,
            'chart.yaxis.labels.bold':        null,
            'chart.yaxis.labels.italic':      null,
            'chart.yaxis.position':               'left',
            'chart.yaxis.title':            '',
            'chart.yaxis.title.bold':       null,
            'chart.yaxis.title.size':       null,
            'chart.yaxis.title.font':       null,
            'chart.yaxis.title.color':      null,
            'chart.yaxis.title.italic':     null,
            'chart.yaxis.title.pos':        null,
            'chart.yaxis.title.x':          null,
            'chart.yaxis.title.y':          null,

            'chart.xaxis':                        true,
            'chart.xaxis.tickmarks.count':        null,
            'chart.xaxis.labels':                 null,            
            'chart.xaxis.labels.size':            null,
            'chart.xaxis.labels.font':            null,
            'chart.xaxis.labels.italic':          null,
            'chart.xaxis.labels.bold':            null,
            'chart.xaxis.labels.color':           null,
            'chart.xaxis.labels.offsetx':         0,
            'chart.xaxis.labels.offsety':         0,
            'chart.xaxis.position':               'bottom',
            'chart.xaxis.labels.angle':             0,
            'chart.xaxis.title':            '',
            'chart.xaxis.title.bold':       null,
            'chart.xaxis.title.size':       null,
            'chart.xaxis.title.font':       null,
            'chart.xaxis.title.color':      null,
            'chart.xaxis.title.italic':     null,
            'chart.xaxis.title.pos':        null,
            'chart.xaxis.title.x':          null,
            'chart.xaxis.title.y':          null,
            
            'chart.text.italic':                   false,
            'chart.text.bold':                     false,
            'chart.text.color':                    'black',
            'chart.text.size':                     12,
            'chart.text.font':                     'Arial, Verdana, sans-serif',
            'chart.text.accessible':               true,
            'chart.text.accessible.overflow':      'visible',
            'chart.text.accessible.pointerevents': false,
            
            
            'chart.title':                  '',
            'chart.title.x':                null,
            'chart.title.y':                null,
            'chart.title.halign':           null,
            'chart.title.valign':           null,
            'chart.title.background':       null, // Gradients aren't supported for this color
            'chart.title.hpos':             null,
            'chart.title.vpos':             null,
            'chart.title.font':             null,
            'chart.title.size':             null,
            'chart.title.color':            null,
            'chart.title.bold':             null,
            'chart.title.italic':           null,

            'chart.colors.stroke':          'rgba(0,0,0,0)',
            'chart.colors':                 ['red','#0f0','blue','pink','orange','cyan','black','white','green','magenta'],
            'chart.colors.sequential':      false,
            'chart.colors.reverse':         false,

            'chart.grouping':               'grouped',

            'chart.variant':                'bar',
            'chart.variant.sketch.verticals': true,
            'chart.variant.threed.xaxis':   true,
            'chart.variant.threed.yaxis':   true,
            'chart.variant.threed.angle':   0.1,
            'chart.variant.threed.offsetx': 10,
            'chart.variant.threed.offsety': 5,

            'chart.shadow':                 false,
            'chart.shadow.color':           '#aaa',  // Gradients aren't supported for this color
            'chart.shadow.offsetx':         0,
            'chart.shadow.offsety':         0,
            'chart.shadow.blur':            15,

            'chart.tooltips':               null,
            'chart.tooltips.effect':        'fade',
            'chart.tooltips.css.class':     'RGraph_tooltip',
            'chart.tooltips.event':         'onclick',
            'chart.tooltips.highlight':     true,
            'chart.tooltips.hotspot.xonly': false,

            'chart.highlight.stroke':       'rgba(0,0,0,0)',
            'chart.highlight.fill':         'rgba(255,255,255,0.7)',

            'chart.key':                    null,
            'chart.key.background':         'white',
            'chart.key.position':           'graph',
            'chart.key.shadow':             false,
            'chart.key.shadow.color':       '#666',
            'chart.key.shadow.blur':        3,
            'chart.key.shadow.offsetx':     2,
            'chart.key.shadow.offsety':     2,
            'chart.key.position.margin.boxed':false,
            'chart.key.position.x':         null,
            'chart.key.position.y':         null,
            'chart.key.interactive':        false,
            'chart.key.interactive.highlight.chart.stroke':'black',
            'chart.key.interactive.highlight.chart.fill':'rgba(255,255,255,0.7)',
            'chart.key.interactive.highlight.label':'rgba(255,0,0,0.2)',
            'chart.key.halign':             'right',
            'chart.key.color.shape':        'square',
            'chart.key.rounded':            true,
            'chart.key.linewidth':          1,
            'chart.key.colors':             null,
            'chart.key.labels.color':       null,
            'chart.key.labels.size':        null,
            'chart.key.labels.font':        null,
            'chart.key.labels.bold':        null,
            'chart.key.labels.italic':      null,
            'chart.key.labels.offsetx':     0,
            'chart.key.labels.offsety':     0,

            'chart.contextmenu':            null,

            'chart.crosshairs':             false,
            'chart.crosshairs.color':       '#333',
            'chart.crosshairs.hline':       true,
            'chart.crosshairs.vline':       true,

            'chart.linewidth':              1,

            'chart.annotatable':            false,
            'chart.annotatable.linewidth':  1,
            'chart.annotatable.color':      'black',

            'chart.resizable':              false,
            'chart.resizable.handle.background': null,

            'chart.adjustable':             false,
            'chart.adjustable.only':        null,

            'chart.events.click':           null,
            'chart.events.mousemove':       null,
            
            'chart.bevelled':               false,

            'chart.errorbars':              false,
            'chart.errorbars.color':        'black',
            'chart.errorbars.capped':        true,
            'chart.errorbars.capped.width':  14,
            'chart.errorbars.linewidth':     1,

            'chart.combined.effect':    null,
            'chart.combined.effect.options':  null,
            'chart.combined.effect.callback': null,

            'chart.clearto':   'rgba(0,0,0,0)'
        }

        // Check for support
        if (!this.canvas) {
            alert('[BAR] No canvas support');
            return;
        }


        //
        // Convert strings into numbers. Also converts undefined elements to null
        //
        for (var i=0; i<data.length; ++i) {
            if (typeof data[i] === 'string') {
                data[i] = parseFloat(data[i]);
            } else if (typeof data[i] === 'object' && data[i]) {
                for (var j=0; j<data[i].length; ++j) {
                    if (typeof data[i][j] === 'string') {
                        data[i][j] = parseFloat(data[i][j]);
                    }
                }
            } else if (typeof data[i] === 'undefined') {
                data[i] = null;
            }
        }

        /**
        * Determine whether the chart will contain stacked or grouped bars
        */
        for (var i=0; i<data.length; ++i) {
            if (typeof data[i] === 'object' && !RGraph.is_null(data[i])) {
                this.stackedOrGrouped = true;
            }
        }


        /**
        * Create the dollar objects so that functions can be added to them
        */
        var linear_data = RGraph.arrayLinearize(data);

        for (var i=0; i<linear_data.length; ++i) {
            this['$' + i] = {};
        }


        // Store the data and set the orignal_data to it
        this.data = data;
        this.original_data = RGraph.arrayClone(data);


        // Used to store the coords of the bars
        this.coords     = [];
        this.coords2    = [];
        this.coordsText = [];



        /**
        * This linearises the data. Doing so can make it easier to pull
        * out the appropriate data from tooltips
        */
        this.data_arr = RGraph.arrayLinearize(this.data);


        /**
        * Translate half a pixel for antialiasing purposes - but only if it hasn't beeen
        * done already
        */
        if (!this.canvas.__rgraph_aa_translated__) {
            this.context.translate(0.5,0.5);

            this.canvas.__rgraph_aa_translated__ = true;
        }





        // Short variable names
        var RG   = RGraph,
            ca   = this.canvas,
            co   = ca.getContext('2d'),
            prop = this.properties,
            pa2  = RG.path2,
            win  = window,
            doc  = document,
            ma   = Math



        /**
        * "Decorate" the object with the generic effects if the effects library has been included
        */
        if (RG.Effects && typeof RG.Effects.decorate === 'function') {
            RG.Effects.decorate(this);
        }





        /**
        * A setter
        *
        * @param name  string The name of the property to set
        * @param value mixed  The value of the property
        */
        this.set =
        this.Set = function (name)
        {
            var value = typeof arguments[1] === 'undefined' ? null : arguments[1];

            /**
            * the number of arguments is only one and it's an
            * object - parse it for configuration data and return.
            */
            if (arguments.length === 1 && typeof arguments[0] === 'object') {
                RG.parseObjectStyleConfig(this, arguments[0]);
                return this;
            }







            /**
            * This should be done first - prepend the propertyy name with "chart." if necessary
            */
            if (name.substr(0,6) != 'chart.') {
                name = 'chart.' + name;
            }




            // Convert uppercase letters to dot+lower case letter
            while(name.match(/([A-Z])/)) {
                name = name.replace(/([A-Z])/, '.' + RegExp.$1.toLowerCase());
            }


            
            
            


            // BC accommodation
            if (name === 'chart.xlabels.offset') {
                name = 'chart.xaxis.labels.offsety';
            }

            if (name == 'chart.labels.abovebar') {
                name = 'chart.labels.above';
            }

            /**
            * Check for xaxispos
            */
            if (name == 'chart.xaxis.position' ) {
                if (value != 'bottom' && value != 'center' && value != 'top') {
                    alert('[BAR] (' + this.id + ') xaxisPosition should be top, center or bottom. Tried to set it to: ' + value + ' Changing it to center');
                    value = 'center';
                }

                if (value == 'top') {
                    for (var i=0; i<this.data.length; ++i) {
                        if (typeof this.data[i] === 'number' && this.data[i] > 0) {
                            alert('[BAR] The data element with index ' + i + ' should be negative');
                        }
                    }
                }
            }

            // lineWidth doesn't appear to like a zero setting
            if (name.toLowerCase() == 'chart.linewidth' && value == 0) {
                value = 0.0001;
            }






            prop[name] = value;

            return this;
        };








        /**
        * A getter
        *
        * @param name  string The name of the property to get
        */
        this.get =
        this.Get = function (name)
        {
            /**
            * This should be done first - prepend the property name with "chart." if necessary
            */
            if (name.substr(0,6) != 'chart.') {
                name = 'chart.' + name;
            }

            // Convert uppercase letters to dot+lower case letter
            while(name.match(/([A-Z])/)) {
                name = name.replace(/([A-Z])/, '.' + RegExp.$1.toLowerCase());
            }

            return prop[name];
        };








        /**
        * The function you call to draw the bar chart
        */
        this.draw =
        this.Draw = function ()
        {
            // MUST be the first thing done!
            if (typeof(prop['chart.background.image']) == 'string') {
                RG.DrawBackgroundImage(this);
            }

            /**
            * Fire the onbeforedraw event
            */
            RG.fireCustomEvent(this, 'onbeforedraw');



            //
            // If the chart is 3d then angle it it
            //
            if (prop['chart.variant'] === '3d') {
                if (prop['chart.text.accessible']) {
                    // Nada
                } else {
                    co.setTransform(1,prop['chart.variant.threed.angle'],0,1,0.5,0.5);
                }
            }



            /**
            * Parse the colors. This allows for simple gradient syntax
            */
            if (!this.colorsParsed) {
                this.parseColors();

                // Don't want to do this again
                this.colorsParsed = true;
            }



            /**
            * Make the margins easy ro access
            */
            this.marginLeft   = prop['chart.margin.left'];
            this.marginRight  = prop['chart.margin.right'];
            this.marginTop    = prop['chart.margin.top'];
            this.marginBottom = prop['chart.margin.bottom'];
            
            this.marginLeft   = prop['chart.margin.left'];
            this.marginRight  = prop['chart.margin.right'];
            this.marginTop    = prop['chart.margin.top'];
            this.marginBottom = prop['chart.margin.bottom'];




            /**
            * Check for tooltips and alert the user that they're not supported
            * with pyramid charts
            */
            if (   (prop['chart.variant'] == 'pyramid' || prop['chart.variant'] == 'dot')
                && typeof(prop['chart.tooltips']) == 'object'
                && prop['chart.tooltips']
                && prop['chart.tooltips'].length > 0) {

                alert('[BAR] (' + this.id + ') Sorry, tooltips are not supported with dot or pyramid charts');
            }

            /**
            * Stop the coords arrays from growing uncontrollably
            */
            this.coords     = [];
            this.coords2    = [];
            this.coordsText = [];

            /**
            * Work out a few things. They need to be here because they depend on things you can change before you
            * call Draw() but after you instantiate the object
            */
            this.max            = 0;
            this.grapharea      = ca.height - this.marginTop - this.marginBottom;
            this.halfgrapharea  = this.grapharea / 2;
            this.halfTextHeight = prop['chart.text.size'] / 2;





            // Now draw the background on to the main canvas
            RG.background.draw(this);




            //If it's a sketch chart variant, draw the axes first
            //if (prop['chart.variant'] == 'sketch') {
            //    this.DrawAxes();
            //    this.Drawbars();
            //} else {
                this.drawbars();
                this.drawAxes();
            //}

            this.DrawLabels();


            /**
            * Draw the bevel if required
            */
            if (prop['chart.bevelled'] || prop['chart.bevelled']) {
                this.DrawBevel();
            }


            // Draw the key if necessary
            if (prop['chart.key'] && prop['chart.key'].length) {
                RG.drawKey(this, prop['chart.key'], prop['chart.colors']);
            }


            /**
            * Setup the context menu if required
            */
            if (prop['chart.contextmenu']) {
                RG.ShowContext(this);
            }




            /**
            * Draw errorbars
            */
            if (prop['chart.errorbars']) {
                this.drawErrorbars();
            }




            /**
            * Draw "in graph" labels
            */
            if (prop['chart.labels.ingraph']) {
                RG.drawInGraphLabels(this);
            }




            /**
            * This function enables resizing
            */
            if (prop['chart.resizable']) {
                RG.AllowResizing(this);
            }


            /**
            * This installs the event listeners
            */
            RG.installEventListeners(this);


            /**
            * Fire the onfirstdraw event
            */
            if (this.firstDraw) {
                this.firstDraw = false;
                RG.fireCustomEvent(this, 'onfirstdraw');
                this.firstDrawFunc();
            }


            /**
            * Fire the RGraph ondraw event
            */
            RG.fireCustomEvent(this, 'ondraw');

            return this;
        };








        /**
        * Used in chaining. Runs a function there and then - not waiting for
        * the events to fire (eg the onbeforedraw event)
        *
        * @param function func The function to execute
        */
        this.exec = function (func)
        {
            func(this);

            return this;
        };








        /**
        * Draws the charts axes
        */
        this.drawAxes =
        this.DrawAxes = function ()
        {
            if (!prop['chart.axes']) {
                return;
            }

            var xaxispos = prop['chart.xaxis.position'];
            var yaxispos = prop['chart.yaxis.position'];
            var isSketch = prop['chart.variant'] == 'sketch';

            co.beginPath();
            co.strokeStyle = prop['chart.axes.color'];
            co.lineWidth   = prop['chart.axes.linewidth'] + 0.001;


            if (RG.ISSAFARI == -1) {
                co.lineCap = 'square';
            }


            // Draw the Y axis
            if (prop['chart.yaxis']) {
                if (yaxispos == 'right') {
                    co.moveTo(ca.width - this.marginRight + (isSketch ? 3 : 0), this.marginTop - (isSketch ? 3 : 0));
                    co.lineTo(ca.width - this.marginRight - (isSketch ? 2 : 0), ca.height - this.marginBottom + (isSketch ? 5 : 0));
                } else {
                    co.moveTo(this.marginLeft - (isSketch ? 2 : 0), this.marginTop - (isSketch ? 5 : 0));
                    co.lineTo(this.marginLeft - (isSketch ? 1 : 0), ca.height - this.marginBottom + (isSketch ? 5 : 0));
                }
            }

            // Draw the X axis
            if (prop['chart.xaxis']) {
                if (xaxispos == 'center') {
                    co.moveTo(this.marginLeft - (isSketch ? 5 : 0), Math.round(((ca.height - this.marginTop - this.marginBottom) / 2) + this.marginTop + (isSketch ? 2 : 0)));
                    co.lineTo(ca.width - this.marginRight + (isSketch ? 5 : 0), Math.round(((ca.height - this.marginTop - this.marginBottom) / 2) + this.marginTop - (isSketch ? 2 : 0)));
                } else if (xaxispos == 'top') {
                    co.moveTo(this.marginLeft - (isSketch ? 3 : 0), this.marginTop - (isSketch ? 3 : 0));
                    co.lineTo(ca.width - this.marginRight + (isSketch ? 5 : 0), this.marginTop + (isSketch ? 2 : 0));
                } else {

                    co.moveTo(
                        this.marginLeft - (isSketch ? 5 : 0),
                        ma.round(this.getYCoord(0) - (isSketch ? 2 : 0))
                    );
                    co.lineTo(
                        ca.width - this.marginRight + (isSketch ? 8 : 0),
                        ma.round(this.getYCoord(0) + (isSketch ? 2 : 0))
                    );

                }
            }

            var numYTicks = prop['chart.yaxis.tickmarks.count'];

            //
            // DRAW THE Y TICKMARKS
            //
            if (prop['chart.yaxis'] && !isSketch) {

                var yTickGap = (ca.height - this.marginTop - this.marginBottom) / numYTicks;
                var xpos     = yaxispos == 'left' ? this.marginLeft : ca.width - this.marginRight;

                if (this.properties['chart.yaxis.tickmarks.count'] > 0) {
                    for (y=this.marginTop;
                         xaxispos == 'center' ? y <= (ca.height - this.marginBottom) : y < (ca.height - this.marginBottom + (xaxispos == 'top' ? 1 : 0));
                         y += yTickGap) {

                        if (xaxispos == 'center' && y == (this.marginTop + (this.grapharea / 2))) {
                            continue;
                        }

                        // X axis at the top
                        if (xaxispos == 'top' && y == this.marginTop) {
                            continue;
                        }

                        co.moveTo(xpos + (yaxispos == 'left' ? 0 : 0), ma.round(y));
                        co.lineTo(xpos + (yaxispos == 'left' ? -3 : 3), ma.round(y));
                    }

                    //
                    // If the X axis is offset (ie not at the bottom when xaxispos
                    // is set to bottom) - draw an extra tick
                    //
                    if (xaxispos === 'bottom' && prop['chart.yaxis.scale.min'] !== 0) {
                        co.moveTo(xpos + (yaxispos == 'left' ? 0 : 0), ma.round(ca.height - prop['chart.margin.bottom']));
                        co.lineTo(xpos + (yaxispos == 'left' ? -3 : 3), ma.round(ca.height - prop['chart.margin.bottom']));
                    }
                }

                /**
                * If the X axis is not being shown, draw an extra tick
                */
                if (!prop['chart.xaxis']) {
                    if (xaxispos == 'center') {
                        co.moveTo(xpos + (yaxispos == 'left' ? -3 : 3), Math.round(ca.height / 2));
                        co.lineTo(xpos, Math.round(ca.height / 2));
                    } else if (xaxispos == 'top') {
                        co.moveTo(xpos + (yaxispos == 'left' ? -3 : 3), Math.round(this.marginTop));
                        co.lineTo(xpos, Math.round(this.marginTop));
                    } else {
                        co.moveTo(xpos + (yaxispos == 'left' ? -3 : 3), Math.round(ca.height - this.marginBottom));
                        co.lineTo(xpos, Math.round(ca.height - this.marginBottom));
                    }
                }
            }


            // Draw the X tickmarks
            if (prop['chart.xaxis'] && !isSketch) {

                if (typeof(prop['chart.xaxis.tickmarks.count']) == 'number') {
                    var xTickGap = (ca.width - this.marginLeft - this.marginRight) / prop['chart.xaxis.tickmarks.count'];
                } else {
                    var xTickGap = (ca.width - this.marginLeft - this.marginRight) / this.data.length;
                }

                if (xaxispos == 'bottom') {
                    yStart   = prop['chart.yaxis.scale.min'] < 0 ? this.getYCoord(0) - 3 : this.getYCoord(0);
                    yEnd     = this.getYCoord(0) + 3;
                } else if (xaxispos == 'top') {
                    yStart = this.marginTop - 3;
                    yEnd   = this.marginTop;
                } else if (xaxispos == 'center') {
                    yStart = ((ca.height - this.marginTop - this.marginBottom) / 2) + this.marginTop + 3;
                    yEnd   = ((ca.height - this.marginTop - this.marginBottom) / 2) + this.marginTop - 3;
                }

                //yStart = yStart;
                //yEnd   = yEnd;

                //////////////// X TICKS ////////////////
                var endXTick = prop['chart.xaxis.tickmarks.last'];

                for (x=this.marginLeft + (yaxispos == 'left' ? xTickGap : 0),len=(ca.width - this.marginRight + (yaxispos == 'left' ? 5 : 0)); x<len; x+=xTickGap) {

                    if (yaxispos == 'left' && endXTick && x > this.marginLeft) {
                        co.moveTo(ma.round(x), yStart);
                        co.lineTo(ma.round(x), yEnd);

                    } else if (yaxispos == 'left' && !endXTick && x > this.marginLeft && x < (ca.width - this.marginRight) ) {
                        co.moveTo(ma.round(x), yStart);
                        co.lineTo(ma.round(x), yEnd);

                    } else if (yaxispos == 'right' && x < (ca.width - this.marginRight) && endXTick) {
                        co.moveTo(ma.round(x), yStart);
                        co.lineTo(ma.round(x), yEnd);

                    } else if (yaxispos == 'right' && x < (ca.width - this.marginRight) && x > (this.marginLeft) && !endXTick) {
                        co.moveTo(ma.round(x), yStart);
                        co.lineTo(ma.round(x), yEnd);
                    }
                }

                if (!prop['chart.yaxis'] || prop['chart.xaxis.tickmarks.count'] == null) {
                    if (typeof(prop['chart.xaxis.tickmarks.count']) == 'number' && prop['chart.xaxis.tickmarks.count'] > 0) {
                        co.moveTo(Math.round(this.marginLeft), yStart);
                        co.lineTo(Math.round(this.marginLeft), yEnd);
                    }
                }

                //////////////// X TICKS ////////////////
            }

            /**
            * If the Y axis is not being shown, draw an extra tick
            */
            if (!prop['chart.yaxis'] && prop['chart.xaxis'] && RGraph.isNull(prop['chart.xaxis.tickmarks.count']) ) {
                if (xaxispos == 'center') {
                    co.moveTo(ma.round(this.marginLeft), (ca.height / 2) - 3);
                    co.lineTo(ma.round(this.marginLeft), (ca.height / 2) + 3);
                } else {
                    co.moveTo(ma.round(this.marginLeft), ca.height - this.marginBottom);
                    co.lineTo(ma.round(this.marginLeft), ca.height - this.marginBottom + 3);
                }
            }

            co.stroke();
        };








        /**
        * Draws the bars
        */
        this.drawbars =
        this.Drawbars = function ()
        {
            co.lineWidth   = prop['chart.linewidth'];
            co.strokeStyle = prop['chart.colors.stroke'];
            co.fillStyle   = prop['chart.colors'][0];

            var prevX    = 0,
                prevY    = 0,
                decimals = prop['chart.yaxis.scale.decimals'];


            /**
            * Work out the max value
            */
            if (prop['chart.yaxis.scale.max']) {

                this.scale2 = RG.getScale2(this, {
                    'scale.max':         prop['chart.yaxis.scale.max'],
                    'scale.strict':      prop['chart.yaxis.scale.round'] ? false : true,
                    'scale.min':         prop['chart.yaxis.scale.min'],
                    'scale.thousand':    prop['chart.yaxis.scale.thousand'],
                    'scale.point':       prop['chart.yaxis.scale.point'],
                    'scale.decimals':    prop['chart.yaxis.scale.decimals'],
                    'scale.labels.count':prop['chart.yaxis.labels.count'],
                    'scale.round':       prop['chart.yaxis.scale.round'],
                    'scale.units.pre':   prop['chart.yaxis.scale.units.pre'],
                    'scale.units.post':  prop['chart.yaxis.scale.units.post']
                });

            } else {

                //
                // If errorbars are given as a number then convert the nuumber to an
                // array.
                //
                var errorbars = prop['chart.errorbars'];

                if (typeof errorbars === 'number') {

                    var value = errorbars;

                    prop['chart.errorbars'] = [];

                    for (var i=0; i<this.data.length; ++i) {
                        if (typeof this.data[i] === 'number') {
                            prop['chart.errorbars'].push([value, null]);

                        } else if (typeof this.data[i] === 'object' && !RG.isNull(this.data[i])) {
                            for (var j=0; j<this.data[i].length; ++j) {
                                prop['chart.errorbars'].push([value, null]);
                            }
                        }
                    }

                    errorbars = prop['chart.errorbars'];
                }








                for (i=0; i<this.data.length; ++i) {
                    if (typeof(this.data[i]) == 'object') {
                        var value = prop['chart.grouping'] === 'grouped' ? Number(RG.arrayMax(this.data[i], true)) : Number(RG.array_sum(this.data[i]));

                    } else {
                        var value = Number(this.data[i]);
                    }

                    this.max = ma.max(ma.abs(this.max), ma.abs(value) +

                        Number(
                            (
                                   typeof prop['chart.errorbars'] === 'object'
                                && typeof prop['chart.errorbars'][i] === 'object'
                                && !RG.isNull(prop['chart.errorbars'][i])
                                && typeof prop['chart.errorbars'][i][0] === 'number'
                            ) ? prop['chart.errorbars'][i][0]  : 0
                        )
                    );
                }







                this.scale2 = RGraph.getScale2(this, {
                    'scale.max':         this.max,
                    'scale.min':         prop['chart.yaxis.scale.min'],
                    'scale.thousand':    prop['chart.yaxis.scale.thousand'],
                    'scale.point':       prop['chart.yaxis.scale.point'],
                    'scale.decimals':    prop['chart.yaxis.scale.decimals'],
                    'scale.labels.count':prop['chart.yaxis.labels.count'],
                    'scale.round':       prop['chart.yaxis.scale.round'],
                    'scale.units.pre':   prop['chart.yaxis.scale.units.pre'],
                    'scale.units.post':  prop['chart.yaxis.scale.units.post']
                });

                this.max = this.scale2.max;
            }

            /**
            * if the chart is adjustable fix the scale so that it doesn't change.
            */
            if (prop['chart.adjustable'] && !prop['chart.yaxis.scale.max']) {
                this.Set('chart.yaxis.scale.max', this.scale2.max);
            }

            /**
            * Draw horizontal bars here
            */
            if (prop['chart.background.hbars'] && prop['chart.background.hbars'].length > 0) {
                RGraph.DrawBars(this);
            }

            var variant = prop['chart.variant'];

            /**
            * Draw the 3D axes is necessary
            */
            if (variant === '3d') {
                RG.draw3DAxes(this);
            }

            /**
            * Get the variant once, and draw the bars, be they regular, stacked or grouped
            */

            // Get these variables outside of the loop
            var xaxispos      = prop['chart.xaxis.position'],
                width         = (ca.width - this.marginLeft - this.marginRight ) / this.data.length,
                orig_height   = height,
                hmargin       = prop['chart.hmargin'],
                shadow        = prop['chart.shadow'],
                shadowColor   = prop['chart.shadow.color'],
                shadowBlur    = prop['chart.shadow.blur'],
                shadowOffsetX = prop['chart.shadow.offsetx'],
                shadowOffsetY = prop['chart.shadow.offsety'],
                strokeStyle   = prop['chart.colors.stroke'],
                colors        = prop['chart.colors'],
                sequentialColorIndex = 0

            var height;

            for (i=0,len=this.data.length; i<len; i+=1) {





                // Work out the height
                //The width is up outside the loop
                if (RG.arraySum(this.data[i]) < 0) {
                    var height = (RG.arraySum(this.data[i]) + this.scale2.min)  / (this.scale2.max - this.scale2.min);
                } else {
                    var height = (RG.arraySum(this.data[i]) - this.scale2.min) / (this.scale2.max - this.scale2.min);
                }

                height *= ma.abs(this.getYCoord(this.scale2.max) - this.getYCoord(this.scale2.min));






                var x = (i * width) + this.marginLeft;
                var y = xaxispos == 'center' ? ((ca.height - this.marginTop - this.marginBottom) / 2) + this.marginTop - height
                                             : ca.height - height - this.marginBottom;

                // xaxispos is top
                if (xaxispos == 'top') {
                    y = this.marginTop + ma.abs(height);
                }


                // Account for negative lengths - Some browsers don't like a negative value
                if (height < 0) {
                    y += height;
                    height = ma.abs(height);
                }






                /**
                * Turn on the shadow if need be
                */
                if (shadow) {
                    co.shadowColor   = shadowColor;
                    co.shadowBlur    = shadowBlur;
                    co.shadowOffsetX = shadowOffsetX;
                    co.shadowOffsetY = shadowOffsetY;
                }

                /**
                * Draw the bar
                */
                co.beginPath();
                    if (typeof this.data[i] == 'number') {


                        // If the Y axis is offset change the bar start (the top of the bar)
                        if (xaxispos === 'bottom' && prop['chart.yaxis.scale.min'] < 0) {
                            if (this.data[i] >= 0) {
                                height = ma.abs(this.getYCoord(0) - this.getYCoord(this.data[i]));
                            } else {
                                y = this.getYCoord(0);
                                height = ma.abs(this.getYCoord(0) - this.getYCoord(this.data[i]));
                            }
                        }

                        var barWidth = width - (2 * hmargin);

                        /**
                        * Check for a negative bar width
                        */
                        if (barWidth < 0) {
                            alert('[RGRAPH] Warning: you have a negative bar width. This may be caused by the chart.hmargin being too high or the width of the canvas not being sufficient.');
                        }

                        // Set the fill color
                        co.strokeStyle = strokeStyle;
                        co.fillStyle = colors[0];

                        /**
                        * Sequential colors
                        */
                        if (prop['chart.colors.sequential']) {
                            co.fillStyle = colors[i];
                        }

                        if (variant == 'sketch') {

                            co.lineCap = 'round';

                            var sketchOffset = 3;

                            co.beginPath();

                            co.strokeStyle = colors[0];

                            /**
                            * Sequential colors
                            */
                            if (prop['chart.colors.sequential']) {
                                co.strokeStyle = colors[i];
                            }

                            // Left side
                            co.moveTo(x + hmargin + 2, y + height - 2);
                            co.lineTo(x + hmargin -    1, y - 4);

                            // The top
                            co.moveTo(x + hmargin - 3, y + -2 + (this.data[i] < 0 ? height : 0));
                            co.bezierCurveTo(
                                             x + ((hmargin + width) * 0.33),
                                             y + 15 + (this.data[i] < 0 ? height - 10: 0),
                                             x + ((hmargin + width) * 0.66),
                                             y + 5 + (this.data[i] < 0 ? height - 10 : 0),x + hmargin + width + -1, y + 0 + (this.data[i] < 0 ? height : 0)
                                            );


                            // The right side
                            co.moveTo(x + hmargin + width - 5, y  - 5);
                            co.lineTo(x + hmargin + width - 3, y + height - 3);

                            if (prop['chart.variant.sketch.verticals']) {
                                for (var r=0.2; r<=0.8; r+=0.2) {
                                    co.moveTo(x + hmargin + width + (r > 0.4 ? -1 : 3) - (r * width),y - 1);
                                    co.lineTo(x + hmargin + width - (r > 0.4 ? 1 : -1) - (r * width), y + height + (r == 0.2 ? 1 : -2));
                                }
                            }

                            co.stroke();

                        // Regular bar
                        } else if (variant == 'bar' || variant == '3d' || variant == 'glass' || variant == 'bevel') {

                            if (variant == 'glass') {
                                RGraph.filledCurvyRect(co, x + hmargin, y, barWidth, height, 3, this.data[i] > 0, this.data[i] > 0, this.data[i] < 0, this.data[i] < 0);
                                RGraph.strokedCurvyRect(co, x + hmargin, y, barWidth, height, 3, this.data[i] > 0, this.data[i] > 0, this.data[i] < 0, this.data[i] < 0);
                            } else {
                                // On 9th April 2013 these two were swapped around so that the stroke happens SECOND so that any
                                // shadow that is cast by the fill does not overwrite the stroke

                                co.beginPath();
                                co.rect(x + hmargin, y, barWidth, height);
                                co.fill();

                                // Turn the shadow off so that the stroke doesn't cast any "extra" shadow
                                // that would show inside the bar
                                RG.NoShadow(this);

                                co.beginPath();
                                co.lineJoin = 'miter';
                                co.lineCap  = 'square';
                                co.rect(
                                    x + hmargin,
                                    y,
                                    barWidth,
                                    height
                                );
                                co.stroke();
                            }

                            // 3D effect
                            if (variant == '3d') {

                                var prevStrokeStyle = co.strokeStyle;
                                var prevFillStyle   = co.fillStyle;

                                // Draw the top (if the value is positive - otherwise there's no point)
                                if (this.data[i] >= 0) {
                                    co.beginPath();
                                        co.moveTo(x + hmargin, y);
                                        co.lineTo(x + hmargin + prop['chart.variant.threed.offsetx'], y - prop['chart.variant.threed.offsety']);
                                        co.lineTo(x + hmargin + prop['chart.variant.threed.offsetx'] + barWidth, y - prop['chart.variant.threed.offsety']);
                                        co.lineTo(x + hmargin + barWidth, y);
                                    co.closePath();

                                    co.stroke();
                                    co.fill();
                                }

                                // Draw the right hand side
                                co.beginPath();
                                    co.moveTo(x + hmargin + barWidth, y);
                                    co.lineTo(
                                        x + hmargin + barWidth + prop['chart.variant.threed.offsetx'],
                                        this.data[i] < 0 && xaxispos === 'bottom' ?
                                            this.getYCoord(0) : (
                                                  this.data[i] < 0 && (y - prop['chart.variant.threed.offsety'])
                                                < (this.marginTop + this.halfgrapharea)

                                                ?

                                                (this.marginTop + this.halfgrapharea)

                                                : (y - prop['chart.variant.threed.offsety']))
                                    );

co.lineTo(
    x + hmargin + barWidth + prop['chart.variant.threed.offsetx'],


      this.data[i] < 0 && (y - prop['chart.variant.threed.offsety'] + height) < (this.marginTop + this.getYCoord(0))
    ? this.getYCoord(this.data[i]) - prop['chart.variant.threed.offsety']
    : (this.data[i] > 0 ?
        y - prop['chart.variant.threed.offsety'] + height :
        ma.min(y - prop['chart.variant.threed.offsety'] + height, ca.height - this.marginBottom)
       )
);
                                    co.lineTo(x + hmargin + barWidth, y + height);
                                co.closePath();
                                co.stroke();
                                co.fill();




                                // Draw the lighter top section
                                if (this.data[i] > 0) {
                                    co.beginPath();
                                        co.fillStyle = 'rgba(255,255,255,0.5)';
                                        co.moveTo(x + hmargin, y);
                                        co.lineTo(x + hmargin + prop['chart.variant.threed.offsetx'], y - prop['chart.variant.threed.offsety']);
                                        co.lineTo(x + hmargin + prop['chart.variant.threed.offsetx'] + barWidth, y - prop['chart.variant.threed.offsety']);
                                        co.lineTo(x + hmargin + barWidth, y);
                                        co.lineTo(x + hmargin, y);
                                    co.closePath();
                                    co.stroke();
                                    co.fill();
                                }




                                // Draw the darker right side section
                                co.beginPath();
                                    co.fillStyle = 'rgba(0,0,0,0.4)';
                                    // TL
                                    co.moveTo(x + hmargin + barWidth, y);

                                    // TR
                                    co.lineTo(
                                        x + hmargin + barWidth + prop['chart.variant.threed.offsetx'],
                                        this.data[i] < 0 && xaxispos === 'bottom' ? this.getYCoord(0) : (this.data[i] < 0 && (y - prop['chart.variant.threed.offsety']) < (this.marginTop + this.halfgrapharea) ? (this.marginTop + this.halfgrapharea) : y - prop['chart.variant.threed.offsety'])
                                    );

                                    // BR
                                    co.lineTo(
                                        x + hmargin + barWidth + prop['chart.variant.threed.offsetx'],

                                          this.data[i] < 0 && (y - prop['chart.variant.threed.offsety'] + height) < this.getYCoord(0)
                                        ? this.getYCoord(0)
                                        : this.data[i] > 0 ? y - prop['chart.variant.threed.offsety'] + height : ma.min(y - prop['chart.variant.threed.offsety'] + height, ca.height - this.marginBottom)
                                    );
                                    // BL
                                    co.lineTo(x + hmargin + barWidth, y + height);
                                    co.lineTo(x + hmargin + barWidth, y);
                                co.closePath();

                                co.stroke();
                                co.fill();

                                co.strokeStyle = prevStrokeStyle;
                                co.fillStyle   = prevFillStyle;

                            // Glass variant
                            } else if (variant == 'glass') {

                                var grad = co.createLinearGradient(x + hmargin,y,x + hmargin + (barWidth / 2),y);
                                grad.addColorStop(0, 'rgba(255,255,255,0.9)');
                                grad.addColorStop(1, 'rgba(255,255,255,0.5)');

                                co.beginPath();
                                co.fillStyle = grad;
                                co.fillRect(x + hmargin + 2,y + (this.data[i] > 0 ? 2 : 0),(barWidth / 2) - 2,height - 2);
                                co.fill();
                            }


                        // Dot chart
                        } else if (variant == 'dot') {

                            co.beginPath();
                            co.moveTo(x + (width / 2), y);
                            co.lineTo(x + (width / 2), y + height);
                            co.stroke();

                            co.beginPath();
                            co.fillStyle = this.properties['chart.colors'][i];
                            co.arc(x + (width / 2), y + (this.data[i] > 0 ? 0 : height), 2, 0, 6.28, 0);

                            // Set the colour for the dots
                            co.fillStyle = prop['chart.colors'][0];

                            /**
                            * Sequential colors
                            */
                            if (prop['chart.colors.sequential']) {
                                co.fillStyle = colors[i];
                            }

                            co.stroke();
                            co.fill();



                        // Unknown variant type
                        } else {
                            alert('[BAR] Warning! Unknown chart.variant: ' + variant);
                        }

                        this.coords.push([x + hmargin, y, width - (2 * hmargin), height]);

                            if (typeof this.coords2[i] == 'undefined') {
                                this.coords2[i] = [];
                            }
                            this.coords2[i].push([x + hmargin, y, width - (2 * hmargin), height]);


                    /**
                    * Stacked bar
                    */
                    } else if (this.data[i] && typeof(this.data[i]) == 'object' && prop['chart.grouping'] == 'stacked') {

                        if (this.scale2.min) {
                            alert("[ERROR] Stacked Bar charts with a Y min are not supported");
                        }

                        var barWidth     = width - (2 * hmargin);
                        var redrawCoords = [];// Necessary to draw if the shadow is enabled
                        var startY       = 0;
                        var dataset      = this.data[i];

                        /**
                        * Check for a negative bar width
                        */
                        if (barWidth < 0) {
                            alert('[RGRAPH] Warning: you have a negative bar width. This may be caused by the chart.hmargin being too high or the width of the canvas not being sufficient.');
                        }

                        for (j=0; j<dataset.length; ++j) {

                            // Stacked bar chart and X axis pos in the middle - poitless since negative values are not permitted
                            if (xaxispos == 'center') {
                                alert("[BAR] It's pointless having the X axis position at the center on a stacked bar chart.");
                                return;
                            }

                            // Negative values not permitted for the stacked chart
                            if (this.data[i][j] < 0) {
                                alert('[BAR] Negative values are not permitted with a stacked bar chart. Try a grouped one instead.');
                                return;
                            }

                            /**
                            * Set the fill and stroke colors
                            */
                            co.strokeStyle = strokeStyle
                            co.fillStyle = colors[j];

                            if (prop['chart.colors.reverse']) {
                                co.fillStyle = colors[this.data[i].length - j - 1];
                            }

                            if (prop['chart.colors.sequential'] && colors[sequentialColorIndex]) {
                                co.fillStyle = colors[sequentialColorIndex++];
                            } else if (prop['chart.colors.sequential']) {
                                co.fillStyle = colors[sequentialColorIndex - 1];
                            }

                            var height = (dataset[j] / this.scale2.max) * (ca.height - this.marginTop - this.marginBottom );

                            // If the X axis pos is in the center, we need to half the  height
                            if (xaxispos == 'center') {
                                height /= 2;
                            }

                            var totalHeight = (RGraph.array_sum(dataset) / this.scale2.max) * (ca.height - hmargin - this.marginTop - this.marginBottom);

                            /**
                            * Store the coords for tooltips
                            */
                            this.coords.push([x + hmargin, y, width - (2 * hmargin), height]);
                            if (typeof this.coords2[i] == 'undefined') {
                                this.coords2[i] = [];
                            }
                            this.coords2[i].push([x + hmargin, y, width - (2 * hmargin), height]);


                            if (height > 0) {
                                co.lineJoin = 'miter';
                                co.lineCap  = 'square';
                                co.strokeRect(x + hmargin, y, width - (2 * hmargin), height);
                                co.fillRect(x + hmargin, y, width - (2 * hmargin), height);
                            }


                            if (j == 0) {
                                var startY = y;
                                var startX = x;
                            }

                            /**
                            * Store the redraw coords if the shadow is enabled
                            */
                            if (shadow) {
                                redrawCoords.push([x + hmargin, y, width - (2 * hmargin), height, co.fillStyle]);
                            }

                            /**
                            * Stacked 3D effect
                            */
                            if (variant == '3d') {

                                var prevFillStyle = co.fillStyle;
                                var prevStrokeStyle = co.strokeStyle;


                                // Draw the top side
                                if (j == 0) {
                                    co.beginPath();
                                        co.moveTo(startX + hmargin, y);
                                        co.lineTo(startX + prop['chart.variant.threed.offsetx'] + hmargin, y - prop['chart.variant.threed.offsety']);
                                        co.lineTo(startX + prop['chart.variant.threed.offsetx'] + barWidth + hmargin, y - prop['chart.variant.threed.offsety']);
                                        co.lineTo(startX + barWidth + hmargin, y);
                                    co.closePath();

                                    co.fill();
                                    co.stroke();
                                }

                                // Draw the side section
                                co.beginPath();
                                    co.moveTo(startX + barWidth + hmargin, y);
                                    co.lineTo(startX + barWidth + hmargin + prop['chart.variant.threed.offsetx'], y - prop['chart.variant.threed.offsety']);
                                    co.lineTo(startX + barWidth + hmargin + prop['chart.variant.threed.offsetx'], y - prop['chart.variant.threed.offsety'] + height);
                                    co.lineTo(startX + barWidth + hmargin , y + height);
                                co.closePath();

                                co.fill();
                                co.stroke();

                                // Draw the lighter top side
                                if (j == 0) {
                                    co.fillStyle = 'rgba(255,255,255,0.5)';
                                    co.beginPath();
                                        co.moveTo(startX + hmargin, y);
                                        co.lineTo(startX + prop['chart.variant.threed.offsetx'] + hmargin, y - prop['chart.variant.threed.offsety']);
                                        co.lineTo(startX + prop['chart.variant.threed.offsetx'] + barWidth + hmargin, y - prop['chart.variant.threed.offsety']);
                                        co.lineTo(startX + barWidth + hmargin, y);
                                    co.closePath();

                                    co.fill();
                                    co.stroke();
                                }

                                // Draw the darker side section
                                co.fillStyle = 'rgba(0,0,0,0.4)';
                                co.beginPath();
                                    co.moveTo(startX + barWidth + hmargin, y);
                                    co.lineTo(startX + barWidth + hmargin + prop['chart.variant.threed.offsetx'], y - prop['chart.variant.threed.offsety']);
                                    co.lineTo(startX + barWidth + hmargin + prop['chart.variant.threed.offsetx'], y - prop['chart.variant.threed.offsety'] + height);
                                    co.lineTo(startX + barWidth + hmargin , y + height);
                                co.closePath();

                                co.fill();
                                co.stroke();

                                co.strokeStyle = prevStrokeStyle;
                                co.fillStyle = prevFillStyle;
                            }

                            y += height;
                        }



                        /**
                        * Redraw the bars if the shadow is enabled due to hem being drawn from the bottom up, and the
                        * shadow spilling over to higher up bars
                        */
                        if (shadow) {

                            RGraph.NoShadow(this);

                            for (k=0; k<redrawCoords.length; ++k) {
                                co.strokeStyle = strokeStyle;
                                co.fillStyle = redrawCoords[k][4];
                                co.strokeRect(redrawCoords[k][0], redrawCoords[k][1], redrawCoords[k][2], redrawCoords[k][3]);
                                co.fillRect(redrawCoords[k][0], redrawCoords[k][1], redrawCoords[k][2], redrawCoords[k][3]);

                                co.stroke();
                                co.fill();
                            }

                            // Reset the redraw coords to be empty
                            redrawCoords = [];
                        }

                    /**
                    * Grouped bar
                    */
                    } else if (this.data[i] && typeof(this.data[i]) == 'object' && prop['chart.grouping'] == 'grouped') {

                        var redrawCoords = [];
                        co.lineWidth = prop['chart.linewidth'];

                        for (j=0; j<this.data[i].length; ++j) {

                            // Set the fill and stroke colors
                            co.strokeStyle = strokeStyle;
                            co.fillStyle   = colors[j];

                            /**
                            * Sequential colors
                            */
                            if (prop['chart.colors.sequential'] && colors[sequentialColorIndex]) {
                                co.fillStyle = colors[sequentialColorIndex++];
                            } else if (prop['chart.colors.sequential']) {
                                co.fillStyle = colors[sequentialColorIndex - 1];
                            }

                            var individualBarWidth = (width - (2 * hmargin)) / this.data[i].length;
                            var height = ((this.data[i][j] + (this.data[i][j] < 0 ? this.scale2.min : (-1 * this.scale2.min) )) / (this.scale2.max - this.scale2.min) ) * (ca.height - this.marginTop - this.marginBottom );
                            var groupedMargin = prop['chart.hmargin.grouped'];
                            var startX = x + hmargin + (j * individualBarWidth);

                            /**
                            * Check for a negative bar width
                            */
                            if (individualBarWidth < 0) {
                                alert('[RGRAPH] Warning: you have a negative bar width. This may be caused by the chart.hmargin being too high or the width of the canvas not being sufficient.');
                            }

                            // If the X axis pos is in the center, we need to half the  height
                            if (xaxispos == 'center') {
                                height /= 2;
                            }

                            /**
                            * Determine the start positioning for the bar
                            */
                            if (xaxispos == 'top') {
                                var startY = this.marginTop;
                                var height = Math.abs(height);

                            } else if (xaxispos == 'center') {
                                var startY = this.marginTop + (this.grapharea / 2) - height;

                            } else {
                                var startY = this.getYCoord(0);//ca.height - this.marginBottom - height;
                                var height = ma.abs(ma.abs(this.getYCoord(this.data[i][j])) - this.getYCoord(0));

                                if (this.data[i][j] >= 0) {
                                    startY -= height;
                                }

                            }

                            co.lineJoin = 'miter';
                            co.lineCap  = 'square';
                            co.strokeRect(startX + groupedMargin, startY, individualBarWidth - (2 * groupedMargin), height);
                            co.fillRect(startX + groupedMargin, startY, individualBarWidth - (2 * groupedMargin), height);
                            y += height;



                            /**
                            * Grouped 3D effect
                            */
                            if (variant == '3d') {

                                var prevFillStyle   = co.fillStyle;
                                var prevStrokeStyle = co.strokeStyle;
                                var hmarginGrouped  = prop['chart.hmargin.grouped'];

                                // Draw the top side
                                if (this.data[i][j]  >= 0) {

                                    co.beginPath();
                                        co.moveTo(startX + hmarginGrouped, startY);
                                        co.lineTo(startX + hmarginGrouped + prop['chart.variant.threed.offsetx'], startY - prop['chart.variant.threed.offsety']);
                                        co.lineTo(startX + prop['chart.variant.threed.offsetx'] + individualBarWidth - hmarginGrouped, startY - prop['chart.variant.threed.offsety']);
                                        co.lineTo(startX + individualBarWidth - hmarginGrouped, startY);
                                    co.closePath();
                                    co.fill();
                                    co.stroke();
                                }

                                // Draw the side section
                                co.beginPath();
                                    co.moveTo(startX + individualBarWidth - hmarginGrouped - 1, startY);
                                    co.lineTo(
                                        startX + individualBarWidth - hmarginGrouped + prop['chart.variant.threed.offsetx'],
                                        this.data[i][j] < 0 ? (this.getYCoord(0) + ma.abs(height) - prop['chart.variant.threed.offsety']) : this.getYCoord(0) - height - prop['chart.variant.threed.offsety']
                                    );

                                    co.lineTo(
                                        startX + individualBarWidth - hmarginGrouped + prop['chart.variant.threed.offsetx'],
                                        this.data[i][j] < 0 && (startY + height - prop['chart.variant.threed.offsety']) < (this.marginTop + this.halfgrapharea) ? (this.marginTop + this.halfgrapharea) : (startY + height - prop['chart.variant.threed.offsety'])
                                    );
                                    co.lineTo(startX + individualBarWidth - hmarginGrouped - 1, startY + height);
                                co.closePath();
                                co.fill();
                                co.stroke();


                                // Draw the lighter top side - but only if the current value is positive
                                if (this.data[i][j] >= 0) {
                                    co.fillStyle = 'rgba(255,255,255,0.5)';
                                    co.beginPath();
                                        // BL
                                        co.moveTo(startX + hmarginGrouped, startY);

                                        // BR
                                        co.lineTo(startX + hmarginGrouped + prop['chart.variant.threed.offsetx'], startY - prop['chart.variant.threed.offsety']);

                                        // TR
                                        co.lineTo(startX + prop['chart.variant.threed.offsetx'] + individualBarWidth - hmarginGrouped, startY - prop['chart.variant.threed.offsety']);

                                        // TL
                                        co.lineTo(startX + individualBarWidth - hmarginGrouped, startY);
                                    co.closePath();

                                    co.fill();
                                    co.stroke();
                                }

                                // Draw the darker side section
                                co.fillStyle = 'rgba(0,0,0,0.4)';
                                co.beginPath();
                                    // TL corner
                                    co.moveTo(
                                        startX + individualBarWidth - hmarginGrouped,
                                        startY
                                    );


                                    co.lineTo(
                                        startX + individualBarWidth + prop['chart.variant.threed.offsetx'] - hmarginGrouped,
                                        this.data[i][j] < 0 ? (this.getYCoord(0) + ma.abs(height) - prop['chart.variant.threed.offsety']) : this.getYCoord(0) - height - prop['chart.variant.threed.offsety']
                                    );

                                    // TR corner
                                    co.lineTo(
                                        startX + individualBarWidth + prop['chart.variant.threed.offsetx'] - hmarginGrouped,
                                        this.data[i][j] < 0 && (startY + height - 5) < (this.marginTop + this.halfgrapharea) ? (this.marginTop + this.halfgrapharea) : (startY + height - prop['chart.variant.threed.offsety'])
                                    );

                                    // TL corner
                                    co.lineTo(startX + individualBarWidth - hmarginGrouped, startY + height);
                                co.closePath();

                                co.fill();
                                co.stroke();

                                co.strokeStyle = prevStrokeStyle;
                                co.fillStyle   = prevFillStyle;
                            }

                            if (height < 0) {
                                height = Math.abs(height);
                                startY = startY - height;
                            }

                            this.coords.push([startX + groupedMargin, startY, individualBarWidth - (2 * groupedMargin), height]);
                            if (typeof this.coords2[i] == 'undefined') {
                                this.coords2[i] = [];
                            }

                            this.coords2[i].push([startX + groupedMargin, startY, individualBarWidth - (2 * groupedMargin), height]);

                            // Facilitate shadows going to the left
                            if (prop['chart.shadow']) {
                                redrawCoords.push([startX + groupedMargin, startY, individualBarWidth - (2 * groupedMargin), height, co.fillStyle]);
                            }
                        }







                        /**
                        * Redraw the bar if shadows are going to the left
                        */
                        if (redrawCoords.length) {

                            RGraph.NoShadow(this);

                            co.lineWidth = prop['chart.linewidth'];

                            co.beginPath();
                                for (var j=0; j<redrawCoords.length; ++j) {

                                    co.fillStyle   = redrawCoords[j][4];
                                    co.strokeStyle = prop['chart.colors.stroke'];

                                    co.fillRect(redrawCoords[j][0], redrawCoords[j][1], redrawCoords[j][2], redrawCoords[j][3]);
                                    co.strokeRect(redrawCoords[j][0], redrawCoords[j][1], redrawCoords[j][2], redrawCoords[j][3]);
                                }
                            co.fill();
                            co.stroke();

                            redrawCoords = [];
                        }
                    } else {
                        this.coords.push([]);
                    }

                co.closePath();
            }

            // If 3D, redraw the right hand Y axis
            if (prop['chart.variant'] === '3d' && prop['chart.yaxis.position'] === 'right') {
                RG.draw3DYAxis(this);
            }





            /**
            * Turn off any shadow
            */
            RGraph.noShadow(this);
        };








        /**
        * Draws the labels for the graph
        */
        this.drawLabels =
        this.DrawLabels = function ()
        {
            var context = co;

            var text_angle = prop['chart.xaxis.labels.angle'],
                text_size  = prop['chart.xaxis.labels.size'] ? prop['chart.xaxis.labels.size'] : prop['chart.text.size'],
                labels     = prop['chart.xaxis.labels'];



            // Draw the Y axis labels:
            if (prop['chart.yaxis.labels']) {
                if (prop['chart.xaxis.position'] == 'top')    this.Drawlabels_top();
                if (prop['chart.xaxis.position'] == 'center') this.Drawlabels_center();
                if (prop['chart.xaxis.position'] == 'bottom') this.Drawlabels_bottom();
            }




            /**
            * The X axis labels
            */
            if (typeof labels == 'object' && labels) {

                var yOffset = Number(prop['chart.xaxis.labels.offsety']),
                    xOffset = Number(prop['chart.xaxis.labels.offsetx']),
                    bold    = typeof prop['chart.xaxis.labels.bold'] === 'boolean' ? prop['chart.xaxis.labels.bold'] : prop['chart.text.bold'],
                    italic  = typeof prop['chart.xaxis.labels.italic'] === 'boolean' ? prop['chart.xaxis.labels.italic'] : prop['chart.text.italic'],
                    font    = prop['chart.xaxis.labels.font'] || prop['chart.text.font'],
                    size    = typeof prop['chart.xaxis.labels.size'] === 'number' ? prop['chart.xaxis.labels.size'] : prop['chart.text.size'];

                /**
                * Text angle
                */
                if (prop['chart.xaxis.labels.angle'] != 0) {
                    var valign =  'center';
                    var halign =  'right';
                    var angle  = 0 - prop['chart.xaxis.labels.angle'];
                } else {
                    var valign =  'top';
                    var halign =  'center';
                    var angle  = 0;
                }

                var textConf = RG.getTextConf({
                    object: this,
                    prefix: 'chart.xaxis.labels'
                });

                // Draw the X axis labels
                co.fillStyle = textConf.color;

                // How wide is each bar
                var barWidth = (ca.width - this.marginRight - this.marginLeft) / labels.length;

                // Reset the xTickGap
                xTickGap = (ca.width - this.marginRight - this.marginLeft) / labels.length

                // Draw the X tickmarks
                var i=0;

                for (x=this.marginLeft + (xTickGap / 2); x<=ca.width - this.marginRight; x+=xTickGap) {

                    RG.text2(this, {

                        font:   textConf.font,
                        size:   textConf.size,
                        bold:   textConf.bold,
                        italic: textConf.italic,
                        color:  textConf.color,

                        x:      x + xOffset,
                        y:      prop['chart.xaxis.position'] == 'top' ? this.marginTop + yOffset - 5: (ca.height - this.marginBottom) + yOffset + 3,
                        text:   String(labels[i++]),
                        valign: prop['chart.xaxis.position'] == 'top' ? 'bottom' : valign,
                        halign: halign,
                        tag:    'label',
                        marker: false,
                        angle:  angle,
                        tag:    'labels'
                    });
                }
            }

            /**
            * Draw above labels
            */
            this.drawAboveLabels();
        };








        //
        // Draws the X axis at the top
        //
        this.drawlabels_top =
        this.Drawlabels_top = function ()
        {
            var ca   = this.canvas;
            var co   = this.context;
            var prop = this.properties;

            co.beginPath();
            co.fillStyle   = prop['chart.text.color'];
            co.strokeStyle = 'black';

            if (prop['chart.xaxis.position'] == 'top') {

                var context    = co;
                var text_size  = prop['chart.text.size'];
                var units_pre  = prop['chart.yaxis.scale.units.pre'];
                var units_post = prop['chart.yaxis.scale.units.post'];
                var align      = prop['chart.yaxis.position'] == 'left' ? 'right' : 'left';
                var font       = prop['chart.text.font'];
                var numYLabels = prop['chart.yaxis.labels.count'];
                var ymin       = prop['chart.yaxis.scale.min'];
                var offsetx     = prop['chart.yaxis.labels.offsetx'];
                var offsety     = prop['chart.yaxis.labels.offsety'];
                
                // Get the text configuration
                var textConf = RG.getTextConf({
                    object: this,
                    prefix: 'chart.yaxis.labels'
                });

                if (prop['chart.yaxis.labels.inside'] == true) {
                    var xpos  = prop['chart.yaxis.position'] == 'left' ? this.marginLeft + 5 : ca.width - this.marginRight - 5;
                    var align = prop['chart.yaxis.position'] == 'left' ? 'left' : 'right';
                    var boxed = true;
                } else {
                    var xpos  = prop['chart.yaxis.position'] == 'left' ? this.marginLeft - 5 : ca.width - this.marginRight + 5;
                    var boxed = false;
                }

                /**
                * Draw specific Y labels here so that the local variables can be reused
                */
                if (typeof(prop['chart.yaxis.labels.specific']) == 'object' && prop['chart.yaxis.labels.specific']) {

                    var labels = RGraph.array_reverse(prop['chart.yaxis.labels.specific']);
                    var grapharea = ca.height - this.marginTop - this.marginBottom;

                    for (var i=0; i<labels.length; ++i) {

                        var y = this.marginTop + (grapharea * (i / labels.length)) + (grapharea / labels.length);

                        RG.text2(this, {
                            
                            font:    textConf.font,
                            size:    textConf.size,
                            color:   textConf.color,
                            bold:    textConf.bold,
                            italic:  textConf.italic,
                            
                            x:       xpos + offsetx,
                            y:       y + offsety,
                            text:    String(labels[i]),
                            valign:  'center',
                            halign:  align,
                            bordered:boxed,
                            tag:     'scale'
                        });
                    }

                    return;
                }








                /**
                * Draw the scale
                */
                var labels = this.scale2.labels;
                for (var i=0; i<labels.length; ++i) {
                    RGraph.text2(this, {
                            
                        font:     textConf.font,
                        size:     textConf.size,
                        color:    textConf.color,
                        bold:     textConf.bold,
                        italic:   textConf.italic,

                        x:        xpos + offsetx,
                        y:        this.marginTop + ((this.grapharea / labels.length) * (i + 1)) + offsety,
                        text:     '-' + labels[i],
                        valign:   'center',
                        halign:   align,
                        bordered: boxed,
                        tag:       'scale'
                    });
                }








                /**
                * Show the minimum value if its not zero
                */
                if (prop['chart.yaxis.scale.min'] != 0 || !prop['chart.xaxis'] || prop['chart.yaxis.scale.zerostart']) {

                    RGraph.Text2(this, {
                            
                         font: textConf.font,
                         size: textConf.size,
                        color: textConf.color,
                         bold: textConf.bold,
                       italic: textConf.italic,
                            
                            x: xpos + offsetx,
                            y: this.marginTop + offsety,
                         text: (this.scale2.min != 0 ? '-' : '') + RG.numberFormat({
                            object:    this,
                            number:    (this.scale2.min.toFixed((this.scale2.min === 0 ? 0 : prop['chart.yaxis.scale.decimals']))),
                            unitspre:  units_pre,
                            unitspost: units_post
                        }),
                       valign: 'center',
                       halign: align,
                     bordered: boxed,
                          tag: 'scale'
                    });
                }

            }

            co.fill();
        };








        /**
        * Draws the X axis in the middle
        */
        this.drawlabels_center =
        this.Drawlabels_center = function ()
        {
            var ca   = this.canvas;
            var co   = this.context;
            var prop = this.properties;

            var textConf = RG.getTextConf({
                object: this,
                prefix: 'chart.scale'
            });
            var numYLabels = prop['chart.yaxis.labels.count'];

            co.fillStyle = textConf.color;

            if (prop['chart.xaxis.position'] == 'center') {

                /**
                * Draw the top labels
                */
                var text_size  = textConf.size;
                var units_pre  = prop['chart.yaxis.scale.units.pre'];
                var units_post = prop['chart.yaxis.scale.units.post'];
                var context = co;
                var align   = '';
                var xpos    = 0;
                var boxed   = false;
                var ymin    = prop['chart.yaxis.scale.min'];
                var offsetx = prop['chart.yaxis.labels.offsetx'];
                var offsety = prop['chart.yaxis.labels.offsety'];

                co.fillStyle   = textConf.color;
                co.strokeStyle = 'black';

                if (prop['chart.yaxis.labels.inside'] == true) {
                    var xpos  = prop['chart.yaxis.position'] == 'left' ? this.marginLeft + 5 : ca.width - this.marginRight - 5;
                    var align = prop['chart.yaxis.position'] == 'left' ? 'left' : 'right';
                    var boxed = true;
                } else {
                    var xpos  = prop['chart.yaxis.position'] == 'left' ? this.marginLeft - 5 : ca.width - this.marginRight + 5;
                    var align = prop['chart.yaxis.position'] == 'left' ? 'right' : 'left';
                    var boxed = false;
                }












                /**
                * Draw specific Y labels here so that the local variables can be reused
                */
                if (typeof(prop['chart.yaxis.labels.specific']) == 'object' && prop['chart.yaxis.labels.specific']) {

                    var labels    = prop['chart.yaxis.labels.specific'];
                    var grapharea = ca.height - this.marginTop - this.marginBottom;

                    // Draw the top halves labels
                    for (var i=0; i<labels.length; ++i) {

                        var y = this.marginTop + ((grapharea / 2) / (labels.length - 1)) * i;

                        RGraph.text2(this, {

                            font:    textConf.font,
                            size:    textConf.size,
                            bold:    textConf.bold,
                            italic:  textConf.italic,
                            color:   textConf.color,

                            x:       xpos + offsetx,
                            y:       y + offsety,
                            text:    String(labels[i]),
                            valign:  'center',
                            halign:  align,
                            bordered:boxed,
                            tag:     'scale'
                        });
                    }

                    // Draw the bottom halves labels
                    for (var i=labels.length-1; i>=1; --i) {

                        var y = this.marginTop  + (grapharea * (i / ((labels.length - 1) * 2) )) + (grapharea / 2);

                        RG.Text2(this, {
                            font:   textConf.font,
                            size:   textConf.size,
                            italic: textConf.italic,
                            bold:   textConf.bold,
                            color:  textConf.color,

                            'x':xpos + offsetx,
                            'y':y + offsety,
                            'text':String(labels[labels.length - i - 1]),
                            'valign':'center',
                            'halign':align,
                            'bordered':boxed,
                            'tag': 'scale'
                        });
                    }

                    return;
                }










                /**
                * Draw the top halfs labels
                */
                for (var i=0; i<this.scale2.labels.length; ++i) {
                    var y    = this.marginTop + this.halfgrapharea - ((this.halfgrapharea / numYLabels) * (i + 1));
                    var text = this.scale2.labels[i];
                    RG.text2(this, {

                        font:   textConf.font,
                        size:   textConf.size,
                        italic: textConf.italic,
                        bold:   textConf.bold,
                        color:  textConf.color,

                        'x':xpos + offsetx,
                        'y':y + offsety,
                        'text': text,
                        'valign':
                        'center',
                        'halign': align,
                        'bordered': boxed,
                        'tag':'scale'
                    });
                }

                /**
                * Draw the bottom halfs labels
                */
                for (var i=(this.scale2.labels.length - 1); i>=0; --i) {
                    var y = this.marginTop + ((this.halfgrapharea / numYLabels) * (i + 1)) + this.halfgrapharea;
                    var text = this.scale2.labels[i];
                    RG.Text2(this, {

                        font:   textConf.font,
                        size:   textConf.size,
                        italic: textConf.italic,
                        bold:   textConf.bold,
                        color:  textConf.color,

                        'x':xpos + offsetx,
                        'y':y + offsety,
                        'text': '-' + text,
                        'valign':'center',
                        'halign': align,
                        'bordered': boxed,
                        'tag':'scale'
                    });
                }





                /**
                * Show the minimum value if its not zero
                */
                if (this.scale2.min != 0 || prop['chart.yaxis.scale.zerostart']) {
                    RG.Text2(this, {

                        font:   textConf.font,
                        size:   textConf.size,
                        italic: textConf.italic,
                        bold:   textConf.bold,
                        color:  textConf.color,

                        x:          xpos + offsetx,
                        y:          this.marginTop + this.halfgrapharea + offsety,
                        text:       RG.numberFormat({
                            object:    this,
                            number:    (this.scale2.min.toFixed((this.scale2.min === 0 ? 0 : prop['chart.yaxis.scale.decimals']))),
                            unitspre:  units_pre,
                            unitspost: units_post
                        }),
                        valign:     'center',
                        valign:     'center',
                        halign:     align,
                        bordered:   boxed,
                        tag:        'scale'
                    });
                }
            }
        };








        /**
        * Draws the X axdis at the bottom (the default)
        */
        this.drawlabels_bottom =
        this.Drawlabels_bottom = function ()
        {
            var text_size  = prop['chart.text.size'],
                units_pre  = prop['chart.yaxis.scale.units.pre'],
                units_post = prop['chart.yaxis.scale.units.post'],
                context    = this.context,
                align      = prop['chart.yaxis.position'] == 'left' ? 'right' : 'left',

                numYLabels = prop['chart.yaxis.labels.count'],
                ymin       = prop['chart.yaxis.scale.min'],
                offsetx    = prop['chart.yaxis.labels.offsetx'],
                offsety    = prop['chart.yaxis.labels.offsety'];

                // Get the text configuration
                var textConf = RG.getTextConf({
                    object: this,
                    prefix: 'chart.yaxis.labels'
                });


            co.beginPath();

            co.fillStyle   = textConf.color;
            co.strokeStyle = 'black';

            if (prop['chart.yaxis.labels.inside'] == true) {
                var xpos  = prop['chart.yaxis.position'] == 'left' ? this.marginLeft + 5 : ca.width - this.marginRight - 5;
                var align = prop['chart.yaxis.position'] == 'left' ? 'left' : 'right';
                var boxed = true;
            } else {
                var xpos  = prop['chart.yaxis.position'] == 'left' ? this.marginLeft - 5 : ca.width - this.marginRight + 5;
                var boxed = false;
            }

            /**
            * Draw specific Y labels here so that the local variables can be reused
            */
            if (prop['chart.yaxis.labels.specific'] && typeof(prop['chart.yaxis.labels.specific']) == 'object') {

                var labels = prop['chart.yaxis.labels.specific'];
                var grapharea = ca.height - this.marginTop - this.marginBottom;

                for (var i=0; i<labels.length; ++i) {
                    
                    var y = this.marginTop + (grapharea * (i / (labels.length - 1)));

                    RGraph.text2(this, {

                        font:     textConf.font,
                        size:     textConf.size,
                        color:    textConf.color,
                        bold:     textConf.bold,
                        italic:   textConf.italic,

                        x:        xpos + offsetx,
                        y:        y + offsety,
                        text:     labels[i],
                        valign:   'center',
                        halign:   align,
                        bordered: boxed,
                        tag:      'scale'
                    });
                }

                return;
            }

            var marginTop      = this.marginTop;
            var halfTextHeight = this.halfTextHeight;
            var scale          = this.scale;


            for (var i=0; i<numYLabels; ++i) {
                
                var text = this.scale2.labels[i];

                RGraph.Text2(this, {

                    font:     textConf.font,
                    size:     textConf.size,
                    color:    textConf.color,
                    italic:   textConf.italic,
                    bold:     textConf.bold,

                    x:        xpos + offsetx,
                    y:        this.marginTop + this.grapharea - ((this.grapharea / numYLabels) * (i+1)) + offsety,
                    text:     text,
                    valign:   'center',
                    halign:   align,
                    bordered: boxed,
                    tag:      'scale'
                });
            }


            /**
            * Show the minimum value if its not zero
            */
            if (prop['chart.yaxis.scale.min'] != 0 || !prop['chart.xaxis'] || prop['chart.yaxis.scale.zerostart']) {
                RG.text2(this, {

                    font:     textConf.font,
                    size:     textConf.size,
                    color:    textConf.color,
                    italic:   textConf.italic,
                    bold:     textConf.bold,

                    x:        xpos + offsetx,
                    y:        ca.height - this.marginBottom + offsety,
                    text:     RG.numberFormat({
                        object:    this,
                        number:    (this.scale2.min.toFixed((this.scale2.min === 0 ? 0 : prop['chart.yaxis.scale.decimals']))),
                        unitspre:  units_pre,
                        unitspost: units_post
                    }),
                    valign:   'center',
                    halign:   align,
                    bordered: boxed,
                    tag:      'scale'
                });
            }

            co.fill();
        };








        /**
        * Not used by the class during creating the graph, but is used by event handlers
        * to get the coordinates (if any) of the selected bar
        *
        * @param object e The event object
        * @param object   OPTIONAL You can pass in the bar object instead of the
        *                          function using "this"
        */
        this.getShape =
        this.getBar = function (e)
        {
            // This facilitates you being able to pass in the bar object as a parameter instead of
            // the function getting it from itself
            var obj = arguments[1] ? arguments[1] : this;

            var mouseXY = RG.getMouseXY(e),
                mouseX  = mouseXY[0],
                mouseY  = mouseXY[1],
                canvas  = obj.canvas,
                context = obj.context,
                coords  = obj.coords

            for (var i=0,len=coords.length; i<len; i+=1) {

                if (obj.coords[i].length == 0) {
                    continue;
                }

                var left   = coords[i][0],
                    top    = coords[i][1],
                    width  = coords[i][2],
                    height = coords[i][3],
                    prop   = obj.properties

                // Old way of testing
                //if (mouseX >= left && mouseX <= (left + width) && mouseY >= top && mouseY <= (top + height)) {

                // Recreate the path/rectangle so that it can be tested
                //  ** DO NOT STROKE OR FILL IT **
                if (prop['chart.tooltips.hotspot.xonly']) {
                    pa2(co,
                        'b r % % % %',
                        left,
                        this.marginTop,
                        width,
                        ca.height - this.marginBottom
                    );
                } else {
                    pa2(co,
                        'b r % % % %',
                        left,
                        top,
                        width,
                        height
                    );
                }

                if (co.isPointInPath(mouseX, mouseY)) {


                    if (prop['chart.tooltips']) {
                        var tooltip = RG.parseTooltipText ? RG.parseTooltipText(prop['chart.tooltips'], i) : prop['chart.tooltips'][i];
                    }

                    // Work out the dataset
                    var dataset = 0,
                        idx     = i

                    while (idx >=  (typeof obj.data[dataset] === 'object' && obj.data[dataset] ? obj.data[dataset].length : 1)) {

                        if (typeof obj.data[dataset] === 'number') {
                            idx -= 1;
                        } else if (obj.data[dataset]) { // Accounts for null being an object
                            idx -= obj.data[dataset].length;
                        } else {
                            idx -= 1;
                        }

                        dataset++;
                    }

                    if (typeof(obj.data[dataset]) == 'number') {
                        idx = null;
                    }


                    return {
                        0: obj,
                        1: left,
                        2: top,
                        3: width,
                        4: height,
                        5: i,
                        
                    object: obj,
                         x: left,
                         y: top,
                     width: width,
                    height: height,
                     index: i,
                   tooltip: tooltip,
            index_adjusted: idx,
                   dataset: dataset
                    };
                }
            }

            return null;
        };








        /**
        * This retrives the bar based on the X coordinate only.
        *
        * @param object e The event object
        * @param object   OPTIONAL You can pass in the bar object instead of the
        *                          function using "this"
        */
        this.getShapeByX = function (e)
        {
            var canvas      = e.target;
            var mouseCoords = RGraph.getMouseXY(e);


            // This facilitates you being able to pass in the bar object as a parameter instead of
            // the function getting it from itself
            var obj = arguments[1] ? arguments[1] : this;


            /**
            * Loop through the bars determining if the mouse is over a bar
            */
            for (var i=0,len=obj.coords.length; i<len; i++) {

                if (obj.coords[i].length == 0) {
                    continue;
                }

                var mouseX = mouseCoords[0];
                var mouseY = mouseCoords[1];
                var left   = obj.coords[i][0];
                var top    = obj.coords[i][1];
                var width  = obj.coords[i][2];
                var height = obj.coords[i][3];
                var prop   = obj.properties;

                if (mouseX >= left && mouseX <= (left + width)) {

                    if (prop['chart.tooltips']) {
                        var tooltip = RGraph.parseTooltipText ? RGraph.parseTooltipText(prop['chart.tooltips'], i) : prop['chart.tooltips'][i];
                    }



                    return {
                        0: obj, 1: left, 2: top, 3: width, 4: height, 5: i,
                        'object': obj, 'x': left, 'y': top, 'width': width, 'height': height, 'index': i, 'tooltip': tooltip
                    };
                }
            }

            return null;
        };








        /**
        * When you click on the chart, this method can return the Y value at that point. It works for any point on the
        * chart (that is inside the margins) - not just points within the Bars.
        *
        * EITHER:
        *
        * @param object arg The event object
        *
        * OR:
        *
        * @param object arg A two element array containing the X and Y coordinates
        */
        this.getValue = function (arg)
        {
            var co   = this.context;
            var ca   = this.canvas;
            var prop = this.properties;

            if (arg.length == 2) {
                var mouseX = arg[0];
                var mouseY = arg[1];
            } else {
                var mouseCoords = RG.getMouseXY(arg);
                var mouseX      = mouseCoords[0];
                var mouseY      = mouseCoords[1];
            }

            if (   mouseY < prop['chart.margin.top']
                || mouseY > (ca.height - prop['chart.margin.bottom'])
                || mouseX < prop['chart.margin.left']
                || mouseX > (ca.width - prop['chart.margin.right'])
               ) {
                return null;
            }

            if (prop['chart.xaxis.position'] == 'center') {
                var value = (((this.grapharea / 2) - (mouseY - prop['chart.margin.top'])) / this.grapharea) * (this.scale2.max - this.scale2.min)
                value *= 2;

                if (value >= 0) {
                    value += this.scale2.min;
                } else {
                    value -= this.scale2.min;
                }

            } else if (prop['chart.xaxis.position'] == 'top') {
                var value = ((this.grapharea - (mouseY - prop['chart.margin.top'])) / this.grapharea) * (this.scale2.max - this.scale2.min)
                value = this.scale2.max - value;
                value = ma.abs(value) * -1;
            } else {
                var value = ((this.grapharea - (mouseY - prop['chart.margin.top'])) / this.grapharea) * (this.scale2.max - this.scale2.min)
                value += this.scale2.min;
            }




            return value;
        };








        /**
        * This function can be used when the canvas is clicked on (or similar - depending on the event)
        * to retrieve the relevant Y coordinate for a particular value.
        *
        * @param int value The value to get the Y coordinate for
        */
        this.getYCoord = function (value)
        {

            if (value > this.scale2.max) {
                return null;
            }

            var co   = this.context,
                ca   = this.canvas,
                prop = this.properties;

            var y, xaxispos = prop['chart.xaxis.position'];

            if (xaxispos == 'top') {

                // Account for negative numbers
                if (value < 0) {
                    value = ma.abs(value);
                }

                y = ((value - this.scale2.min) / (this.scale2.max - this.scale2.min)) * this.grapharea;
                y = y + this.marginTop

            } else if (xaxispos == 'center') {

                y = ((value - this.scale2.min) / (this.scale2.max - this.scale2.min)) * (this.grapharea / 2);
                y = (this.grapharea / 2) - y;
                y += this.marginTop;

            } else {

                if (value < this.scale2.min) {
                    value = this.scale2.min;
                }

                y  = ((value - this.scale2.min) / (this.scale2.max - this.scale2.min));
                y *= (ca.height - this.marginTop - this.marginBottom);

                y = ca.height - this.marginBottom - y;
            }

            return y;
        };



        /**
        * Each object type has its own Highlight() function which highlights the appropriate shape
        *
        * @param object shape The shape to highlight
        */
        this.highlight =
        this.Highlight = function (shape)
        {
            if (typeof prop['chart.highlight.style'] === 'function') {
                (prop['chart.highlight.style'])(shape);
            } else {
                // Add the new highlight
                RG.Highlight.Rect(this, shape);
            }
        };



        /**
        * The getObjectByXY() worker method
        */
        this.getObjectByXY = function (e)
        {
            var mouseXY = RG.getMouseXY(e);

            // Adjust the mouse Y coordinate for when the bar chart is
            // a 3D variant
            if (prop['chart.variant'] === '3d') {
                var adjustment = prop['chart.variant.threed.angle'] * mouseXY[0];
                mouseXY[1] -= adjustment;
            }



            if (
                   mouseXY[0] >= prop['chart.margin.left']
                && mouseXY[0] <= (ca.width - prop['chart.margin.right'])
                && mouseXY[1] >= prop['chart.margin.top']
                && mouseXY[1] <= (ca.height - prop['chart.margin.bottom'])
                ) {

                return this;
            }
        };








        /**
        * This method handles the adjusting calculation for when the mouse is moved
        *
        * @param object e The event object
        */
        this.adjusting_mousemove =
        this.Adjusting_mousemove = function (e)
        {
            /**
            * Handle adjusting for the Bar
            */
            if (prop['chart.adjustable'] && RG.Registry.get('chart.adjusting') && RG.Registry.get('chart.adjusting').uid == this.uid) {

                // Rounding the value to the given number of decimals make the chart step
                var value   = Number(this.getValue(e));
                var shape   = RG.Registry.get('chart.adjusting.shape')

                if (shape) {

                    RG.Registry.set('chart.adjusting.shape', shape);

                    if (this.stackedOrGrouped && prop['chart.grouping'] == 'grouped') {

                        var indexes = RG.sequentialIndexToGrouped(shape['index'], this.data);

                        if (typeof this.data[indexes[0]] == 'number') {
                            this.data[indexes[0]] = Number(value);
                        } else if (!RG.isNull(this.data[indexes[0]])) {
                            this.data[indexes[0]][indexes[1]] = Number(value);
                        }
                    } else if (typeof this.data[shape['index']] == 'number') {

                        this.data[shape['index']] = Number(value);
                    }

                    RG.redrawCanvas(e.target);
                    RG.fireCustomEvent(this, 'onadjust');
                }
            }
        };








        /**
        * This allows for easy specification of gradients
        */
        this.parseColors = function ()
        {
            // Save the original colors so that they can be restored when the canvas is reset
            if (this.original_colors.length === 0) {
                this.original_colors['chart.colors']                 = RG.arrayClone(prop['chart.colors']);
                this.original_colors['chart.key.colors']             = RG.arrayClone(prop['chart.key.colors']);
                this.original_colors['chart.crosshairs.color']       = prop['chart.crosshairs.color'];
                this.original_colors['chart.highlight.stroke']       = prop['chart.highlight.stroke'];
                this.original_colors['chart.highlight.fill']         = prop['chart.highlight.fill'];
                this.original_colors['chart.text.color']             = prop['chart.text.color'];
                this.original_colors['chart.background.bars.color1'] = prop['chart.background.bars.color1'];
                this.original_colors['chart.background.bars.color2'] = prop['chart.background.bars.color2'];
                this.original_colors['chart.background.grid.color']  = prop['chart.background.grid.color'];
                this.original_colors['chart.background.color']       = prop['chart.background.color'];
                this.original_colors['chart.colors.stroke']          = prop['chart.colors.stroke'];
                this.original_colors['chart.axes.color']             = prop['chart.axes.color'];
            }


            // chart.colors
            var colors = prop['chart.colors'];
            if (colors) {
                for (var i=0; i<colors.length; ++i) {
                    colors[i] = this.parseSingleColorForGradient(colors[i]);
                }
            }

            // chart.key.colors
            var colors = prop['chart.key.colors'];
            if (colors) {
                for (var i=0; i<colors.length; ++i) {
                    colors[i] = this.parseSingleColorForGradient(colors[i]);
                }
            }

             prop['chart.crosshairs.color']       = this.parseSingleColorForGradient(prop['chart.crosshairs.color']);
             prop['chart.highlight.stroke']       = this.parseSingleColorForGradient(prop['chart.highlight.stroke']);
             prop['chart.highlight.fill']         = this.parseSingleColorForGradient(prop['chart.highlight.fill']);
             prop['chart.text.color']             = this.parseSingleColorForGradient(prop['chart.text.color']);
             prop['chart.background.bars.color1'] = this.parseSingleColorForGradient(prop['chart.background.bars.color1']);
             prop['chart.background.bars.color2'] = this.parseSingleColorForGradient(prop['chart.background.bars.color2']);
             prop['chart.background.grid.color']  = this.parseSingleColorForGradient(prop['chart.background.grid.color']);
             prop['chart.background.color']       = this.parseSingleColorForGradient(prop['chart.background.color']);
             prop['chart.color.stroke']           = this.parseSingleColorForGradient(prop['chart.color.stroke']);
             prop['chart.axes.color']             = this.parseSingleColorForGradient(prop['chart.axes.color']);
        };








        /**
        * Use this function to reset the object to the post-constructor state. Eg reset colors if
        * need be etc
        */
        this.reset = function ()
        {
        };








        /**
        * This parses a single color value. This method can also parse the new
        * JSON gradient syntax.
        * 
        * @param string The color to parse
        */
        this.parseSingleColorForGradient = function (color)
        {
            if (!color || typeof(color) != 'string') {
                return color;
            }

            if (color.match(/^gradient\((.*)\)$/i)) {


                // Allow for JSON gradients
                if (color.match(/^gradient\(({.*})\)$/i)) {
                    return RGraph.parseJSONGradient({object: this, def: RegExp.$1});
                }


                var parts = RegExp.$1.split(':');

                // Create the gradient
                var grad = co.createLinearGradient(0,ca.height - prop['chart.margin.bottom'], 0, prop['chart.margin.top']);

                var diff = 1 / (parts.length - 1);

                grad.addColorStop(0, RG.trim(parts[0]));

                for (var j=1,len=parts.length; j<len; ++j) {
                    grad.addColorStop(j * diff, RGraph.trim(parts[j]));
                }
            }

            return grad ? grad : color;
        };








        this.drawBevel =
        this.DrawBevel = function ()
        {
            var coords  = this.coords,
                coords2 = this.coords2,
                prop    = this.properties,
                co      = this.context,
                ca      = this.canvas;

            if (prop['chart.grouping'] == 'stacked') {
                for (var i=0; i<coords2.length; ++i) {
                    if (coords2[i] && coords2[i][0] && coords2[i][0][0]) {

                        var x = coords2[i][0][0];
                        var y = coords2[i][0][1];
                        var w = coords2[i][0][2];

                        var arr = [];
                        for (var j=0; j<coords2[i].length; ++j) {
                            arr.push(coords2[i][j][3]);
                        }
                        var h = RGraph.array_sum(arr);


                        co.save();

                            co.strokeStyle = 'black';

                            // Clip to the rect
                            co.beginPath();
                            co.rect(x, y, w, h);
                            co.clip();

                            // Add the shadow
                            co.shadowColor = 'black';
                            co.shadowOffsetX = 0;
                            co.shadowOffsetY = 0;
                            co.shadowBlur = 20;

                            co.beginPath();
                            co.rect(x - 3, y - 3, w + 6, h + 100);
                            co.lineWidth = 5;
                            co.stroke();
                        co.restore();
                    }
                }
            } else {

                for (var i=0; i<coords.length; ++i) {
                    if (coords[i]) {

                        var x = coords[i][0];
                        var y = coords[i][1];
                        var w = coords[i][2];
                        var h = coords[i][3];

                        var xaxispos = prop['chart.xaxis.position'];
                        var xaxis_ycoord = ((ca.height - this.marginTop - this.marginBottom) / 2) + this.marginTop;


                        co.save();

                            co.strokeStyle = 'black';

                            // Clip to the rect
                            co.beginPath();
                            co.rect(x, y, w, h);

                            co.clip();

                            // Add the shadow
                            co.shadowColor = 'black';
                            co.shadowOffsetX = 0;
                            co.shadowOffsetY = 0;
                            co.shadowBlur =  20;

                            if (xaxispos == 'top' || (xaxispos == 'center' && (y + h) > xaxis_ycoord)) {
                                y = y - 100;
                                h = h + 100;
                            } else {
                                y = y;
                                h = h + 100;
                            }

                            co.beginPath();
                                co.rect(x - 3, y - 3, w + 6, h + 6);
                                co.lineWidth = 5;
                            co.stroke();
                        co.restore();
                    }
                }
            }
        };








        /**
        * This function handles highlighting an entire data-series for the interactive
        * key
        *
        * @param int index The index of the data series to be highlighted
        */
        this.interactiveKeyHighlight = function (index)
        {
            this.coords2.forEach(function (value, idx, arr)
            {
                if (typeof value[index] == 'object' && value[index]) {

                    var x = value[index][0]
                    var y = value[index][1]
                    var w = value[index][2]
                    var h = value[index][3]

                    co.fillStyle = prop['chart.key.interactive.highlight.chart.fill'];
                    co.strokeStyle = prop['chart.key.interactive.highlight.chart.stroke'];
                    co.lineWidth   = 2;
                    co.strokeRect(x, y, w, h);
                    co.fillRect(x, y, w, h);
                }
            });
        };








        /**
        * Using a function to add events makes it easier to facilitate method chaining
        *
        * @param string   type The type of even to add
        * @param function func
        */
        this.on = function (type, func)
        {
            if (type.substr(0,2) !== 'on') {
                type = 'on' + type;
              }

            if (typeof this[type] !== 'function') {
                this[type] = func;
            } else {
                RG.addCustomEventListener(this, type, func);
            }

            return this;
        };








        // Draws the above labels
        this.drawLabelsAbove =
        this.drawAboveLabels = function ()
        {
            var labels      = prop['chart.labels.above'],
                specific    = prop['chart.labels.above.specific'],
                bold        = typeof prop['chart.labels.above.bold'] === 'boolean' ? prop['chart.labels.above.bold'] : prop['chart.text.bold'],
                italic      = typeof prop['chart.labels.above.italic'] === 'boolean' ? prop['chart.labels.above.italic'] : prop['chart.text.italic'],
                color       = prop['chart.labels.above.color'] || prop['chart.text.color'],
                font        = prop['chart.labels.above.font'] || prop['chart.labels.above.font'],
                size        = typeof prop['chart.labels.above.size'] === 'number' ? prop['chart.labels.above.size'] : prop['chart.text.size'],
                background  = prop['chart.labels.above.background'],
                decimals    = prop['chart.labels.above.decimals'],
                angle       = -1 * prop['chart.labels.above.angle'],
                unitsPre    = prop['chart.labels.above.units.pre'],
                unitsPost   = prop['chart.labels.above.units.post'],
                point       = prop['chart.labels.above.point'],
                thousand    = prop['chart.labels.above.thousand'],
                coords      = this.coords,
                coords2     = this.coords2,
                data        = this.data,
                ldata       = RG.arrayLinearize(this.data),
                offset      = prop['chart.labels.above.offset'],
                text_italic = prop['chart.text.italic'],
                text_bold   = prop['chart.text.bold'],
                text_color  = prop['chart.text.color'],
                text_font   = prop['chart.text.font'],
                text_size   = prop['chart.text.size'],
                grouping    = prop['chart.grouping'];
            
            var textConf = RG.getTextConf({
                object: this,
                prefix: 'chart.labels.above'
            });

            // Turn off any shadow
            RG.noShadow(this);

            // Color
            co.fillStyle = textConf.color;


            // This bit draws the text labels that appear above the bars if requested
            if (labels && grouping === 'grouped') {
                for (var i=0,len=data.length,sequentialIndex=0; i<len; i+=1) {

                    // Alignment for regular, positive bars
                    if (typeof data[i] === 'number' && data[i] >= 0) {

                        var angle  = angle;
                        var halign = (angle ? 'left' : 'center');
                        var valign = angle !== 0 ? 'center' : 'bottom';

                        RG.text2(this, {

                            font:   textConf.font,
                            size:   textConf.size,
                            color:  textConf.color,
                            bold:   textConf.bold,
                            italic: textConf.italic,

                            x:    coords2[i][0][0] + (coords2[i][0][2] / 2),
                            y:    coords2[i][0][1] - offset,
                            text: specific ? (specific[sequentialIndex] || '') : RG.numberFormat({
                                object:    this,
                                number:    Number(typeof data[i] === 'object' ? data[i][0] : data[i]).toFixed(decimals),
                                unitspre:  unitsPre,
                                unitspost: unitsPost,
                                point:     point,
                                thousand:  thousand
                            }),
                            halign:            halign,
                            valign:            valign,
                            angle:             angle,
                            marker:            false,
                            bounding:          true,
                            'bounding.fill':   background,
                            'bounding.stroke': 'rgba(0,0,0,0)',
                            tag:               'labels.above'
                        });

                        sequentialIndex++;






                    // Alignment for regular, negative bars
                    } else if (typeof data[i] === 'number' && data[i] < 0) {

                        var angle  = angle;
                        var halign = angle ? 'right' : 'center';
                        var valign = angle !== 0 ? 'center' : 'top';


                        RG.text2(this, {

                            font:   textConf.font,
                            size:   textConf.size,
                            color:  textConf.color,
                            bold:   textConf.bold,
                            italic: textConf.italic,

                            x:              coords2[i][0][0] + (coords2[i][0][2] / 2),
                            y:              coords2[i][0][1] + coords2[i][0][3] + offset,
                            text: specific ? (specific[sequentialIndex] || '') : RG.numberFormat({
                                object:    this,
                                number:    Number(typeof data[i] === 'object' ? data[i][0] : data[i]).toFixed(decimals),
                                unitspre:  unitsPre,
                                unitspost: unitsPost
                            }),
                            halign:         halign,
                            valign:         valign,
                            angle:          angle,
                            bounding:       true,
                            'bounding.fill':background,
                            'bounding.stroke':'rgba(0,0,0,0)',
                            marker:         false,
                            tag:            'labels.above'
                        });

                        sequentialIndex++;






                    // Alignment for grouped bars
                    } else if (typeof data[i] === 'object') {

                            for (var j=0,len2=data[i].length; j<len2; j+=1) {

                                var angle  = angle;
                                var halign = data[i][j] < 0 ? 'right' : 'left';
                                    halign = angle === 0 ? 'center' : halign;
                                var valign = data[i][j] < 0 ? 'top' : 'bottom';
                                    valign = angle != 0 ? 'center' : valign;

                                RG.text2(this, {
        
                                    font:   textConf.font,
                                    size:   textConf.size,
                                    color:  textConf.color,
                                    bold:   textConf.bold,
                                    italic: textConf.italic,

                                    x:                  coords2[i][j][0] + (coords2[i][j][2] / 2),
                                    y:                  coords2[i][j][1] + (data[i][j] < 0 ? coords2[i][j][3] + offset: -offset),
                                    text:               specific ? (specific[sequentialIndex] || '') : RG.numberFormat({
                                                            object:    this,
                                                            number:    Number(data[i][j]).toFixed(decimals),
                                                            unitspre:  unitsPre,
                                                            unitspost: unitsPost
                                                        }),
                                    halign:             halign,
                                    valign:             valign,
                                    angle:              angle,
                                    bounding:           true,
                                    'bounding.fill':    background,
                                    'bounding.stroke':  'rgba(0,0,0,0)',
                                    marker:             false,
                                    tag:                'labels.above'
                                });
                                sequentialIndex++;
                            }
                    }
                }





            /**
            * STACKED bars
            */
            } else if (labels && grouping === 'stacked') {
                for (var i=0,len=data.length,sequentialIndex=0; i<len; i+=1) {
                    if (typeof data[i] === 'object') {

                        var angle  = angle;
                        var halign = angle != 0 ? 'left' : 'center';
                        var valign = angle != 0 ? 'center' : 'bottom';

                        RG.text2(this, {

                            font:   textConf.font,
                            size:   textConf.size,
                            color:  textConf.color,
                            bold:   textConf.bold,
                            italic: textConf.italic,

                            x:              coords2[i][0][0] + (coords2[i][0][2] / 2),
                            y:              coords2[i][0][1] + (data[i][0] < 0 ? coords2[i][0][3] : 0) - offset,
                            text:           specific ? (specific[sequentialIndex] || '') : RG.numberFormat({
                                                object:    this,
                                                number:    Number(RG.arraySum(data[i])).toFixed(decimals),
                                                unitspre:  unitsPre,
                                                unitspost: unitsPost
                                            }),
                            halign:         halign,
                            valign:         valign,
                            angle:          angle,
                            bounding:       true,
                            'bounding.fill':background,
                            'bounding.stroke': 'rgba(0,0,0,0)',
                            marker:         false,
                            tag:            'labels.above'
                        });

                        sequentialIndex += data[i].length;

                    /**
                    * Regular numbers but in a stacked grouping
                    */
                    } else {

                        var angle  = angle;
                        var halign = angle != 0 ? 'left' : 'center';
                        var valign = angle != 0 ? 'center' : 'bottom';

                        RG.text2(this, {

                            font:   textConf.font,
                            size:   textConf.size,
                            color:  textConf.color,
                            bold:   textConf.bold,
                            italic: textConf.italic,

                            x:                  coords2[i][0][0] + (coords2[i][0][2] / 2),
                            y:                  coords2[i][0][1] + (data[i][0] < 0 ? coords2[i][0][3] : 0) - offset,
                            text:               specific ? (specific[sequentialIndex] || '') : RG.numberFormat({
                                                    object:    this,
                                                    number:    Number(data[i]).toFixed(decimals),
                                                    unitspre:  unitsPre,
                                                    unitspost: unitsPost
                                                }),
                            halign:             halign,
                            valign:             valign,
                            angle:              angle,
                            bounding:           true,
                            'bounding.fill':    background,
                            'bounding.stroke':  'rgba(0,0,0,0)',
                            marker:             false,
                            tag:                'labels.above'
                        });

                        sequentialIndex++;
                    }
                }
            }
        };








        /**
        * This function runs once only
        */
        this.firstDrawFunc = function ()
        {
        };








        /**
        * (new) Bar chart Wave effect. This is a rewrite that should be smoother
        * because it just uses a single loop and not setTimeout
        *
        * @param object   OPTIONAL An object map of options. You specify 'frames' here to give the number of frames in the effect
        * @param function OPTIONAL A function that will be called when the effect is complete
        */
        this.wave = function ()
        {
            var obj = this,
                opt = arguments[0] || {},
                labelsAbove = this.get('chart.labels.above');

            opt.frames =  opt.frames || 60;
            opt.startFrames = [];
            opt.counters    = [];

            var framesperbar   = opt.frames / 3,
                frame          = -1,
                callback       = arguments[1] || function () {},
                original       = RG.arrayClone(this.original_data);

            //
            // turn off the labelsAbove option whilst animating
            //
            this.set('labelsAbove', false);

            for (var i=0,len=obj.data.length; i<len; i+=1) {
                opt.startFrames[i] = ((opt.frames / 2) / (obj.data.length - 1)) * i;

                if (typeof obj.data[i] === 'object' && obj.data[i]) {
                    opt.counters[i] = [];
                    for (var j=0; j<obj.data[i].length; j++) {
                        opt.counters[i][j] = 0;
                    }
                } else {
                    opt.counters[i]    = 0;
                }
            }

            /**
            * This stops the chart from jumping
            */
            obj.draw();
            obj.set('chart.yaxis.scale.max', obj.scale2.max);
            RG.clear(obj.canvas);


            function iterator ()
            {
                ++frame;

                for (var i=0,len=obj.data.length; i<len; i+=1) {
                        if (frame > opt.startFrames[i]) {
                            if (typeof obj.data[i] === 'number') {

                                obj.data[i] = ma.min(
                                    ma.abs(original[i]),
                                    ma.abs(original[i] * ( (opt.counters[i]++) / framesperbar))
                                );

                                // Make the number negative if the original was
                                if (original[i] < 0) {
                                    obj.data[i] *= -1;
                                }
                            } else if (!RG.isNull(obj.data[i])) {
                                for (var j=0,len2=obj.data[i].length; j<len2; j+=1) {

                                    obj.data[i][j] = ma.min(
                                        ma.abs(original[i][j]),
                                        ma.abs(original[i][j] * ( (opt.counters[i][j]++) / framesperbar))
                                    );

                                    // Make the number negative if the original was
                                    if (original[i][j] < 0) {
                                        obj.data[i][j] *= -1;
                                    }
                                }
                            }
                        } else {
                            obj.data[i] = typeof obj.data[i] === 'object' && obj.data[i] ? RG.arrayPad([], obj.data[i].length, 0) : (RG.isNull(obj.data[i]) ? null : 0);
                        }
                }


                if (frame >= opt.frames) {

                    if (labelsAbove) {
                        obj.set('chart.labels.above', true);
                        RG.redraw();
                    }

                    callback(obj);
                } else {
                    RG.redrawCanvas(obj.canvas);
                    RG.Effects.updateCanvas(iterator);
                }
            }

            iterator();

            return this;
        };








        /**
        * Color Wave effect. This fades in color sequentially like the wave effect
        * makes the bars grow.
        *
        * @param object   OPTIONAL An object map of options. You specify 'frames'
        *                          here to give the number of frames in the effect
        * @param function OPTIONAL A function that will be called when the effect
        *                          is complete
        */
        this.colorWave = function ()
        {
            var obj = this,
                opt = arguments[0] || {};
                opt.frames =  opt.frames || 60;
                opt.startFrames = [];
                opt.counters    = [],
                colors          = obj.properties['chart.colors'];

            // If just one color is specified and colorsSequential is not, then
            // pad the colors array out
            if (colors.length <= obj.data.length) {
                obj.set('chart.colors.sequential', true);
                colors =  RG.arrayPad(colors, obj.data.length, colors[colors.length - 1]);
            }

            var framesperbar   = opt.frames / 2,
                frame          = -1,
                callback       = arguments[1] || function () {},
                originalColors = RG.arrayClone(obj.properties['chart.colors']);



            for (var i=0,len=originalColors.length; i<len; i+=1) {
                opt.startFrames[i] = ((opt.frames / 2) / (originalColors.length - 1)) * i;
                opt.counters[i]    = 0;
            }


            function iterator ()
            {
                ++frame;

                for (var i=0,len=colors.length; i<len; i+=1) {
                    if (frame > opt.startFrames[i] && colors[i].match(/^rgba?\(([0-9 ]+),([0-9 ]+),([0-9 ]+)(,([ 0-9.]+)?)\)/)) {

                        // DO NOT USE SPACES!
                        colors[i] = 'rgba({1},{2},{3},{4})'.format(
                            RegExp.$1,
                            RegExp.$2,
                            RegExp.$3,
                            (frame - opt.startFrames[i]) / framesperbar
                        );
                    } else {
                        colors[i] = colors[i].replace(/,[0-9. ]+\)/, ',0)');
                    }
                }


                if (frame >= opt.frames) {
                    callback(obj);
                } else {
                    RG.redrawCanvas(obj.canvas);
                    RG.Effects.updateCanvas(iterator);
                }
            }

            iterator();

            return this;
        };








        /**
        * Grow
        *
        * The Bar chart Grow effect gradually increases the values of the bars
        *
        * @param object       An object of options - eg: {frames: 30}
        * @param function     A function to call when the effect is complete
        */
        this.grow = function ()
        {
            // Callback
            var opt         = arguments[0] || {},
                frames      = opt.frames || 30,
                frame       = 0,
                callback    = arguments[1] || function () {},
                obj         = this,
                labelsAbove = this.get('chart.labels.above')






            // Go through the data and change string arguments of the format +/-[0-9]
            // to absolute numbers
            if (RG.isArray(opt.data)) {

                var ymax = 0;

                for (var i=0; i<opt.data.length; ++i) {
                    if (typeof opt.data[i] === 'object') {
                        for (var j=0; j<opt.data[i].length; ++j) {
                            if (typeof opt.data[i][j] === 'string'&& opt.data[i][j].match(/(\+|\-)([0-9]+)/)) {
                                if (RegExp.$1 === '+') {
                                    opt.data[i][j] = this.original_data[i][j] + parseInt(RegExp.$2);
                                } else {
                                    opt.data[i][j] = this.original_data[i][j] - parseInt(RegExp.$2);
                                }
                            }

                            ymax = ma.max(ymax, opt.data[i][j]);
                        }
                    } else if (typeof opt.data[i] === 'string' && opt.data[i].match(/(\+|\-)([0-9]+)/)) {
                        if (RegExp.$1 === '+') {
                            opt.data[i] = this.original_data[i] + parseInt(RegExp.$2);
                        } else {
                            opt.data[i] = this.original_data[i] - parseInt(RegExp.$2);
                        }
                        ymax = ma.max(ymax, opt.data[i]);
                    } else {
                        ymax = ma.max(ymax, opt.data[i]);
                    }
                }


                var scale = RG.getScale2(this, {'scale.max':ymax});
                this.Set('chart.yaxis.scale.max', scale.max);
            }


            //
            // turn off the labelsAbove option whilst animating
            //
            this.set('chart.labels.above', false);


            // Stop the scale from changing by setting chart.yaxis.scale.max (if it's not already set)
            if (prop['chart.yaxis.scale.max'] == null) {

                var ymax = 0;

                for (var i=0; i<obj.data.length; ++i) {
                    if (RG.isArray(this.data[i]) && prop['chart.grouping'] === 'stacked') {
                        ymax = ma.max(ymax, ma.abs(RG.arraySum(this.data[i])));

                    } else if (RG.isArray(this.data[i]) && prop['chart.grouping'] === 'grouped') {

                        for (var j=0,group=[]; j<this.data[i].length; j++) {
                            group.push(ma.abs(this.data[i][j]));
                        }

                        ymax = ma.max(ymax, ma.abs(RG.arrayMax(group)));

                    } else {
                        ymax = ma.max(ymax, ma.abs(this.data[i]));
                    }
                }

                var scale = RG.getScale2(this, {'scale.max':ymax});
                this.Set('chart.yaxis.scale.max', scale.max);
            }

            // You can give a ymax to the grow function
            if (typeof opt.ymax === 'number') {
                obj.set('ymax', opt.ymax);
            }



            var iterator = function ()
            {
                var easingMultiplier = RG.Effects.getEasingMultiplier(frames, frame);

                // Alter the Bar chart data depending on the frame
                for (var j=0,len=obj.original_data.length; j<len; ++j) {
                    if (typeof obj.data[j] === 'object' && !RG.isNull(obj.data[j])) {
                        for (var k=0,len2=obj.data[j].length; k<len2; ++k) {
                            if (obj.firstDraw || !opt.data) {
                                obj.data[j][k] = easingMultiplier * obj.original_data[j][k];
                            } else if (opt.data && opt.data.length === obj.original_data.length) {
                                var diff    = opt.data[j][k] - obj.original_data[j][k];
                                obj.data[j][k] = (easingMultiplier * diff) + obj.original_data[j][k];
                            }
                        }
                    } else {

                        if (obj.firstDraw || !opt.data) {
                            obj.data[j] = easingMultiplier * obj.original_data[j];
                        } else if (opt.data && opt.data.length === obj.original_data.length) {
                            var diff    = opt.data[j] - obj.original_data[j];
                            obj.data[j] = (easingMultiplier * diff) + obj.original_data[j];
                        }
                    }
                }




                //RGraph.clear(obj.canvas);
                RG.redrawCanvas(obj.canvas);




                if (frame < frames) {
                    frame += 1;

                    RG.Effects.updateCanvas(iterator);

                // Call the callback function
                } else {

                    // Do some housekeeping if new data was specified thats done in
                    // the constructor - but needs to be redone because new data
                    // has been specified
                    if (RG.isArray(opt.data)) {

                        var linear_data = RG.arrayLinearize(data);

                        for (var i=0; i<linear_data.length; ++i) {
                            if (!obj['$' + i]) {
                                obj['$' + i] = {};
                            }
                        }
                    }



                    obj.data = data;
                    obj.original_data = RG.arrayClone(data);




                    if (labelsAbove) {
                        obj.set('chart.labels.above', true);
                        RG.redraw();
                    }
                    callback(obj);
                }
            };

            iterator();

            return this;
        };








        //
        // Draws error-bars for the Bar and Line charts
        //
        this.drawErrorbars = function ()
        {
            var coords = this.coords,
                 color = prop['chart.errorbars.color'] || 'black',
     default_halfwidth = ma.min(prop['chart.errorbars.capped.width'], coords[0][2]) / 2,
                     x = 0,
             errorbars = prop['chart.errorbars'],
                length = 0;


            // If not capped set the width of the cqap to zero
            if (!prop['chart.errorbars.capped']) {
                prop['chart.errorbars.capped.width'] = 0;
                halfwidth = 0;
            }

            // Set the linewidth
            co.lineWidth = prop['chart.errorbars.linewidth'];




            for (var i=0; i<coords.length; ++i) {
            
                var barX = coords[i][0],
                    barY = coords[i][1],
                    barW = coords[i][2],
                    barH = coords[i][3];

                // Get the grouped version of the index
                var groupedIndexes = RG.sequentialIndexToGrouped(i, this.data);

                // Determine if this is 
                if (typeof this.data[groupedIndexes[0]] === 'object' && !RG.isNull(this.data[groupedIndexes[0]])) {
                    var isGrouped = true,
                        group     = groupedIndexes[0],
                        subgroup  = groupedIndexes[1];
                }


                // Default to black
                color = prop['chart.errorbars.color'] || 'black';

                // Set the perbar linewidth if the fourth option in the array
                // is specified
                if (errorbars[i] && typeof errorbars[i][3] === 'number') {
                    co.lineWidth = errorbars[i][3];
                }

                // Set the halfwidth
                var halfwidth = (errorbars[i]&& typeof errorbars[i][4] === 'number') ? errorbars[i][4] / 2 : default_halfwidth;

                if (!prop['chart.errorbars.capped']) {
                    halfwidth = 0;
                }



                // Calulate the pixel size
                if (typeof errorbars[i] === 'number') {

                    length = ma.abs(this.getYCoord(errorbars[i]) - this.getYCoord(0));

                    if (length) {
                        pa2(
                            co,
                            'b m % % l % % l % % l % % s %',
                            barX + (barW / 2),
                            (typeof this.data[i] === 'number' && this.data[i] < 0 || (isGrouped && this.data[group][subgroup] < 0) ) ? barY + barH : barY,
                            barX + (barW / 2),
                            (typeof this.data[i] === 'number' && this.data[i] < 0  || (isGrouped && this.data[group][subgroup] < 0)) ? barY + barH + length : barY - length,
                            barX + (barW / 2) - halfwidth,
                            (typeof this.data[i] === 'number' && this.data[i] < 0 || (isGrouped && this.data[group][subgroup] < 0)) ? ma.round(barY + barH + length) : ma.round(barY - length),
                            barX + (barW / 2) + halfwidth,
                            (typeof this.data[i] === 'number' && this.data[i] < 0  || (isGrouped && this.data[group][subgroup] < 0)) ? ma.round(barY + barH + length)  : ma.round(barY - length),
                            color
                        );
                    }
                } else if (typeof errorbars[i] === 'object' && !RG.isNull(errorbars[i])) {

                    var positiveLength = ma.abs(this.getYCoord(errorbars[i][0]) - this.getYCoord(0));

                    // Color
                    if (typeof errorbars[i][1] === 'string') {
                        color = errorbars[i][1];

                    } else if (typeof errorbars[i][2] === 'string') {
                        color = errorbars[i][2];
                    }

                    // Cap width
                    halfwidth = typeof errorbars[i][4] === 'number' ? errorbars[i][4] / 2 : default_halfwidth;

                    if (!prop['chart.errorbars.capped']) {
                        halfwidth = 0;
                    }

                    if (!RG.isNull(errorbars[i][0])) {

                        pa2(
                            co,
                            'b m % % l % % l % % l % % s %',
                            barX + (barW / 2),
                            barY + (this.data[i] < 0 ? barH : 0) +  ((isGrouped && this.data[group][subgroup] < 0) ? barH : 0),
                            barX + (barW / 2),
                            barY - positiveLength + (this.data[i] < 0 ? barH : 0)+ ((isGrouped && this.data[group][subgroup] < 0) ? barH : 0),
                            barX + (barW / 2) - halfwidth,
                            ma.round(barY - positiveLength) + (this.data[i] < 0 ? barH : 0) + ((isGrouped && this.data[group][subgroup] < 0) ? barH : 0),
                            barX + (barW / 2) + halfwidth,
                            ma.round(barY - positiveLength) + (this.data[i] < 0 ? barH : 0) + ((isGrouped && this.data[group][subgroup] < 0) ? barH : 0),
                            color
                        );
                    }

                    if (typeof errorbars[i][1] === 'number') {

                        var negativeLength = ma.abs(this.getYCoord(errorbars[i][1]) - this.getYCoord(0));

                        pa2(
                            co,
                            'b m % % l % % l % % l % % s %',
                            barX + (barW / 2),
                            barY + (this.data[i] < 0 ? barH : 0)+ ((isGrouped && this.data[group][subgroup] < 0) ? barH : 0),
                            barX + (barW / 2),
                            barY + negativeLength + (this.data[i] < 0 ? barH : 0)+ ((isGrouped && this.data[group][subgroup] < 0) ? barH : 0),
                            barX + (barW / 2) - halfwidth,
                            ma.round(coords[i][1] + negativeLength) + (this.data[i] < 0 ? barH : 0)+ ((isGrouped && this.data[group][subgroup] < 0) ? barH : 0),
                            barX + (barW / 2) + halfwidth,
                            ma.round(barY + negativeLength) + (this.data[i] < 0 ? barH : 0)+ ((isGrouped && this.data[group][subgroup] < 0) ? barH : 0),
                            color
                        );
                    }
                }


                // Reset the perbar linewidth to the default if the fourth option
                // in the array was specified specified
                if (errorbars[i] && typeof errorbars[i][3] === 'number') {
                    co.lineWidth = prop['chart.errorbars.linewidth'];
                }
            }
        };








        //
        // A per-object to test whether a particular bar is adjustable or not
        //
        // @param shape The shape object
        //
        this.isAdjustable = function (shape)
        {
            if (RG.isNull(prop['chart.adjustable.only']) || !RG.isArray(prop['chart.adjustable.only'])) {
                return true;
            }

            if (RG.isArray(prop['chart.adjustable.only']) && prop['chart.adjustable.only'][shape.index]) {
                return true;
            }

            return false;
        };




        /**
        * Register the object
        */
        RG.register(this);




        /**
        * This is the 'end' of the constructor so if the first argument
        * contains configuration dsta - handle that.
        */
        if (parseConfObjectForOptions) {
            RG.parseObjectStyleConfig(this, conf.options);
        }
    };





    /*********************************************************************************************************
    * This is the combined bar and Line class which makes creating bar/line combo charts a little bit easier *
    /*********************************************************************************************************/







    RGraph.Combined      =
    RGraph.CombinedChart = function ()
    {
        /**
        * Create a default empty array for the objects
        */
        this.objects = [];
        var objects  = [];

        if (RGraph.isArray(arguments[0])) {
            objects = arguments[0];
        } else {
            for (var i=0; i<arguments.length; i+=1) {
                objects[i] = arguments[i];
            }
        }

        for (var i=0; i<objects.length; ++i) {

            this.objects[i] = objects[i];

            /**
            * Set the Line chart margins to match the Bar chart margins
            */
            this.objects[i].set({
                marginLeft:   this.objects[0].get('chart.margin.left'), // Needs to use the dot form to skirt an IE9 bug
                marginRight:  this.objects[0].get('chart.margin.right'), // Needs to use the dot form to skirt an IE9 bug
                marginTop:    this.objects[0].get('chart.margin.top'), // Needs to use the dot form to skirt an IE9 bug
                marginBottom: this.objects[0].get('chart.margin.bottom') // Needs to use the dot form to skirt an IE9 bug
            });

            if (this.objects[i].type == 'line') {

                var obj = this.objects[i];

                /**
                * Set the line chart hmargin
                */
                obj.set('hmargin', ((this.objects[0].canvas.width - this.objects[0].get('chart.margin.right') - this.objects[0].get('chart.margin.left')) / this.objects[0].data.length) / 2 );


                /**
                * No labels, axes or grid on the Line chart
                */
                obj.set('axes', false);
                obj.set('chart.background.grid', false);
                obj.set('chart.yaxis.labels', false);
            }

            /**
            * Resizing
            */
            if (this.objects[i].get('chart.resizable')) {
                var resizable_object = obj;
            }
        }

        /**
        * Resizing
        */
        if (resizable_object) {
            /**
            * This recalculates the Line chart hmargin when the chart is resized
            */
            function myOnresizebeforedraw (obj)
            {
                var marginLeft  = obj.get('chart.margin.left');
                var marginRight = obj.get('chart.margin.right');

                obj.set('hmargin', (obj.canvas.width - marginLeft - marginRight) / (obj.original_data[0].length * 2));
            }

            RGraph.AddCustomEventListener(
                resizable_object,
                'onresizebeforedraw',
                myOnresizebeforedraw
            );
        }
        
        return this;
    };








    /**
    * The Add method can be used to add methods to the CombinedChart object.
    */
    RGraph.Combined.prototype.add      =
    RGraph.CombinedChart.prototype.add =
    RGraph.CombinedChart.prototype.Add = function (obj)
    {
        this.objects.push(obj);
        
        return this;
    };








    /**
    * The Draw method goes through all of the objects drawing them (sequentially)
    */
    RGraph.Combined.prototype.draw      =
    RGraph.CombinedChart.prototype.draw =
    RGraph.CombinedChart.prototype.Draw = function ()
    {
        if (RGraph.isArray(this.objects)) {
            for (var i=0; i<this.objects.length; ++i) {
                if (this.objects[i].properties['chart.combined.effect']) {
    
                    // The options must be given as a string because of the
                    // RGraph configuration system
                    var options  = this.objects[i].properties['chart.combined.effect.options'] ? eval('(' + this.objects[i].properties['chart.combined.effect.options'] + ')') : null,
                        callback = this.objects[i].properties['chart.combined.effect.callback'],
                        func     = this.objects[i].properties['chart.combined.effect'];
    
                    (this.objects[i][func])(options, callback);
                } else {
                    this.objects[i].draw();
                }
            }
        }
        
        return this;
    };