// version: 2019-01-22
    /**
    * o--------------------------------------------------------------------------------o
    * | This file is part of the RGraph package - you can learn more at:               |
    * |                                                                                |
    * |                          https://www.rgraph.net                                |
    * |                                                                                |
    * | RGraph is licensed under the Open Source MIT license. That means that it's     |
    * | totally free to use and there are no restrictions on what you can do with it!  |
    * o--------------------------------------------------------------------------------o
    */

    RGraph = window.RGraph || {isRGraph: true};

    /**
    * The bi-polar/age frequency constructor.
    * 
    * @param string id The id of the canvas
    * @param array  left  The left set of data points
    * @param array  right The right set of data points
    * 
    * REMEMBER If ymin is implemented you need to update the .getValue() method
    */
    RGraph.Bipolar = function (conf)
    {
        /**
        * Allow for object config style
        */
        if (   typeof conf === 'object'
            && typeof conf.left === 'object'
            && typeof conf.right === 'object'
            && typeof conf.id === 'string') {

            var id                        = conf.id,
                canvas                    = document.getElementById(id),
                left                      = conf.left,
                right                     = conf.right,
                parseConfObjectForOptions = true // Set this so the config is parsed (at the end of the constructor)
        
        } else {
        
            var id     = conf,
                canvas = document.getElementById(id),
                left   = arguments[1],
                right  = arguments[2]
        }



        // Get the canvas and context objects
        this.id                = id;
        this.canvas            = canvas;
        this.context           = this.canvas.getContext('2d');
        this.canvas.__object__ = this;
        this.type              = 'bipolar';
        this.coords            = [];
        this.coords2           = [];
        this.coordsLeft        = [];
        this.coordsRight       = [];
        this.coords2Left       = [];
        this.coords2Right      = [];
        this.max               = 0;
        this.isRGraph          = true;
        this.uid               = RGraph.CreateUID();
        this.canvas.uid        = this.canvas.uid ? this.canvas.uid : RGraph.CreateUID();
        this.coordsText        = [];
        this.original_colors   = [];
        this.firstDraw         = true; // After the first draw this will be false

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
            //'chart.margin.center':                'chart.gutter.center',
            //'chart.margin.center.autosize':       'chart.gutter.center.autosize',
            //'chart.margin.center.auto':           'chart.gutter.center.autosize',
            //'chart.vmargin':                      'chart.margin',
            //'chart.background.grid.hlines.count': 'chart.background.grid.autofit.numhlines',
            //'chart.background.grid.vlines.count': 'chart.background.grid.autofit.numvlines',
            //'chart.colors.stroke':                'chart.strokestyle',
            //'chart.xaxis.tickmarks.interval':     'chart.xtickinterval',
            //'chart.axes.color':                   'chart.axis.color',
            //'chart.axes':                         function (opt) {return {name:'chart.noaxes',value:!opt.value}},
            //'chart.xaxis':                        function (opt) {return {name:'chart.noxaxis',value:!opt.value}},
            //'chart.yaxis':                        function (opt) {return {name:'chart.noyaxis',value:!opt.value}},
            //'chart.xaxis.labels.count':           'chart.labels.count',
            //'chart.xaxis.labels':                 'chart.xlabels',
            //'chart.xaxis.scale.units.pre':        'chart.units.pre',
            //'chart.xaxis.scale.units.post':       'chart.units.post',
            //'chart.xaxis.scale.max':              'chart.xmax',
            //'chart.yaxis.labels':                 'chart.labels',
            //'chart.yaxis.labels.font':            'chart.labels.font',
            //'chart.yaxis.labels.size':            'chart.labels.size',
            //'chart.yaxis.labels.color':           'chart.labels.color',
            //'chart.yaxis.labels.bold':            'chart.labels.bold',
            //'chart.yaxis.labels.italic':          'chart.labels.italic',
            //'chart.annotatable.color':            'chart.annotate.color',
            //'chart.annotatable.linewidth':        'chart.annotate.linewidth',
            //'chart.resizable.handle.background':  'chart.resize.handle.background',
            //'chart.xaxis.scale.formatter':        'chart.scale.formatter',
            //'chart.xaxis.scale.decimals':         'chart.scale.decimals',
            //'chart.xaxis.scale.point':            'chart.scale.point',
            //'chart.xaxis.scale.thousand':         'chart.scale.thousand',
            //'chart.xaxis.scale.round':            'chart.scale.round',
            //'chart.xaxis.scale.zerostart':        'chart.scale.zerostart',
            //'chart.xaxis.tickmarks.count':          'chart.numxticks',
            //'chart.yaxis.tickmarks.count':          'chart.numyticks'
            /* [NEW]:[OLD] */
        };

        /**
        * Compatibility with older browsers
        */
        //RGraph.OldBrowserCompat(this.context);

        
        // The left and right data respectively. Ensure that the data is an array
        // of numbers
        var data = [left, right];
        
        for (var i=0; i<2; ++i) {
            data[i].forEach(function (v,k,arr)
            {
                if (RGraph.isNull(v)) {
                    // Nada
                } else if (typeof v === 'object') {
                    v.forEach (function (v2,k2,arr2)
                    {
                        arr[k][k2] = parseFloat(v2);
                    });
                } else {
                    arr[k] = parseFloat(v);
                }
                
                arr[k] = RGraph.stringsToNumbers(arr[k]);
            });
        }

        this.left  = left;
        this.right = right;
        this.data  = [left, right];

        this.properties =
        {
            'chart.background.grid':        true,
            'chart.background.grid.color':  '#ddd',
            'chart.background.grid.vlines': true,
            'chart.background.grid.hlines': true,
            'chart.background.grid.linewidth': 1,
            'chart.background.grid.vlines.count': null,
            'chart.background.grid.hlines.count': null,

            'chart.vmargin':                 5,
            'chart.vmargin.grouped':         3,

            'chart.xaxis':                        true,
            'chart.xaxis.tickmarks.count':        5,
            'chart.xaxis.tickmarks.interval':     null,
            'chart.xaxis.scale.units.pre':        '',
            'chart.xaxis.scale.units.post':       '',
            'chart.xaxis.scale.max':              null,
            'chart.xaxis.scale.min':              0,
            'chart.xaxis.scale.zerostart':        true,
            'chart.xaxis.scale.decimals':         null,
            'chart.xaxis.scale.point':            '.',
            'chart.xaxis.scale.thousand':         ',',
            'chart.xaxis.labels':           true,
            'chart.xaxis.labels.font':      null,
            'chart.xaxis.labels.size':      null,
            'chart.xaxis.labels.color':     null,
            'chart.xaxis.labels.bold':      null,
            'chart.xaxis.labels.italic':    null,
            'chart.xaxis.labels.count':     5,

            'chart.yaxis':                true,
            'chart.yaxis.tickmarks.count':  null,
            'chart.yaxis.labels':            [],
            'chart.yaxis.labels.font':       null,
            'chart.yaxis.labels.size':       null,
            'chart.yaxis.labels.color':      null,
            'chart.yaxis.labels.bold':       null,
            'chart.yaxis.labels.italic':     null,
            
            'chart.labels.above':           false,
            'chart.labels.above.font':       null,
            'chart.labels.above.size':       null,
            'chart.labels.above.bold':       null,
            'chart.labels.above.italic':     null,
            'chart.labels.above.color':      null,
            'chart.labels.above.units.pre':  '',
            'chart.labels.above.units.post': '',
            'chart.labels.above.decimals':   0,
            'chart.labels.above.formatter':  null,
            
            'chart.text.bold':                     false,
            'chart.text.italic':                   false,
            'chart.text.size':                     12,
            'chart.text.color':                    'black',
            'chart.text.font':                     'Arial, Verdana, sans-serif',
            'chart.text.accessible':               true,
            'chart.text.accessible.overflow':      'visible',
            'chart.text.accessible.pointerevents': false,
            
            'chart.title.left':             null,
            'chart.title.left.font':        null,
            'chart.title.left.size':        null,
            'chart.title.left.bold':        null,
            'chart.title.left.italic':      null,
            'chart.title.left.color':       null,
            
            'chart.title.right':            null,
            'chart.title.right.font':       null,
            'chart.title.right.size':       null,
            'chart.title.right.bold':       null,
            'chart.title.right.italic':     null,
            'chart.title.right.color':      null,
            
            'chart.margin.center':          0,
            'chart.margin.center.auto':     true,
            'chart.margin.left':            25,
            'chart.margin.right':           25,
            'chart.margin.top':             25,
            'chart.margin.bottom':          30,
            
            'chart.title':                  null,
            'chart.title.font':             null,
            'chart.title.size':             null,
            'chart.title.bold':             null,
            'chart.title.italic':           null,
            'chart.title.color':            null,
            'chart.title.background':       null,
            'chart.title.hpos':             null,
            'chart.title.vpos':             null,
            'chart.title.x':                null,
            'chart.title.y':                null,
            'chart.title.halign':           null,
            'chart.title.valign':           null,


            'chart.colors.stroke':          'rgba(0,0,0,0)',
            'chart.colors':                 ['#afa','#faa','#aaf','#aff','#ffa','#faf','cyan','brown','gray','black','pink','#afa','#faa','#aaf','#aff','#ffa','#faf','cyan','brown','gray','black','pink'],
            'chart.colors.sequential':      false,

            'chart.contextmenu':            null,

            'chart.tooltips':               null,
            'chart.tooltips.effect':        'fade',
            'chart.tooltips.css.class':     'RGraph_tooltip',
            'chart.tooltips.highlight':     true,
            'chart.tooltips.event':         'onclick',

            'chart.highlight.stroke':       'rgba(0,0,0,0)',
            'chart.highlight.fill':         'rgba(255,255,255,0.7)',

            
            'chart.shadow':                 false,
            'chart.shadow.color':           '#ccc',
            'chart.shadow.offsetx':         3,
            'chart.shadow.offsety':         3,
            'chart.shadow.blur':            3,
            
            'chart.annotatable':            false,
            'chart.annotatable.color':         'black',

            'chart.axes':                   true,
            'chart.axes.color':             'black',
            'chart.axes.linewidth':         1,

            'chart.resizable':              false,
            'chart.resizable.handle.background': null,

            'chart.events.mousemove':       null,
            'chart.events.click':           null,

            'chart.linewidth':              1,
            
            'chart.variant.threed.offsetx': 10,
            'chart.variant.threed.offsety': 5,
            'chart.variant.threed.angle':   0.1,
            
            'chart.grouping':               'grouped',
            
            'chart.clearto':                'rgba(0,0,0,0)'
        }

        // Pad the arrays so they're the same size
        //
        // DON'T DO THIS NOW - 3/9/17
        //while (this.left.length < this.right.length) this.left.push(null);
        //while (this.left.length > this.right.length) this.right.push(null);
        
        /**
        * Set the default for the number of Y tickmarks
        */
        this.properties['chart.yaxis.tickmarks.count'] = this.left.length;

        


        /**
        * Create the dollar objects so that functions can be added to them
        */
        var linear_data = RGraph.arrayLinearize(this.left, this.right);

        for (var i=0; i<linear_data.length; ++i) {
            this['$' + i] = {};
        }


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
        * The setter
        * 
        * @param name  string The name of the parameter to set
        * @param value mixed  The value of the paraneter 
        */
        this.set =
        this.Set = function (name)
        {
            var value = typeof arguments[1] === 'undefined' ? null : arguments[1];
            


            /**
            * the number of arguments is only one and it's an
            * object - parse it for configuration data and return.
            */
            if (arguments.length === 1 && typeof name === 'object') {
                RG.parseObjectStyleConfig(this, name);
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

    
            prop[name] = value;
    
            return this;
        };








        /**
        * The getter
        * 
        * @param name string The name of the parameter to get
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

            return this.properties[name.toLowerCase()];
        };








        /**
        * Draws the graph
        */
        this.draw =
        this.Draw = function ()
        {
            /**
            * Fire the onbeforedraw event
            */
            RG.fireCustomEvent(this, 'onbeforedraw');
    
    
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
            this.marginLeft       = prop['chart.margin.left'];
            this.marginRight      = prop['chart.margin.right'];
            this.marginTop        = prop['chart.margin.top'];
            this.marginBottom     = prop['chart.margin.bottom'];
            this.marginCenter     = prop['chart.margin.center'];
            this.marginCenterAuto = prop['chart.margin.center.auto'];


            //
            // Autosize the center margin to allow for big labels
            //
            if (prop['chart.margin.center.auto'] && !prop['chart.margin.center']) {
                prop['chart.margin.center'] = this.getMarginCenter();
            }

            this.marginCenter = prop['chart.margin.center'];

    
    
            // Reset the data to what was initially supplied
            this.left  = this.data[0];
            this.right = this.data[1];

    
            /**
            * Reset the coords array
            */
            this.coords       = [];
            this.coords2      = [];
            this.coordsLeft   = [];
            this.coordsRight  = [];
            this.coords2Left  = [];
            this.coords2Right = [];



            /**
            * Stop this growing uncontrollably
            */
            this.coordsText = [];
            
            
            if (prop['chart.variant'] === '3d') {
                if (prop['chart.text.accessible']) {
                    // Nada
                } else {
                    co.setTransform(1,prop['chart.variant.threed.angle'],0,1,0.5,0.5);
                }
            }



            // Some necessary variables
            this.axisWidth  = (ca.width - prop['chart.margin.center'] - this.marginLeft - this.marginRight) / 2;
            this.axisHeight = ca.height - this.marginTop - this.marginBottom;


            // Reset the sequential index
            this.sequentialFullIndex = 0;



            this.getMax();
            this.drawBackgroundGrid();
            this.draw3DAxes();
            this.drawAxes();
            this.drawTicks();

            // Why was this clipping around the graphArea here?
            //
            //co.save();
            //co.beginPath();
            //    co.rect(
            //        this.marginLeft,
            //        this.marginTop - (prop['chart.variant.threed.offsety'] || 0),
            //        ca.width - this.marginLeft - this.marginRight,
            //        ca.height - this.marginTop - this.marginBottom + (2 * (prop['chart.variant.threed.offsety'] || 0))
            //    );
            //    co.clip();
                
            this.drawLeftBars();
            this.drawRightBars();

            // Redraw the bars so that shadows on not on top
            this.drawLeftBars({shadow: false});
            this.drawRightBars({shadow: false});
            // End clipping
            //
            //co.restore();

            this.drawAxes();
    
            this.drawLabels();
            this.drawTitles();
    
    
            /**
            * Setup the context menu if required
            */
            if (prop['chart.contextmenu']) {
                RG.ShowContext(this);
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
            RG.InstallEventListeners(this);
    

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
            RG.FireCustomEvent(this, 'ondraw');

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
        * Draws the axes
        */
        this.draw3DAxes = function ()
        {
            if (prop['chart.variant'] === '3d') {
                var offsetx = prop['chart.variant.threed.offsetx'],
                    offsety = prop['chart.variant.threed.offsety'];
    
                // Set the linewidth
                co.lineWidth = prop['chart.axes.linewidth'] + 0.001;
    
        
                // Draw the left set of axes
                co.beginPath();
                co.strokeStyle = prop['chart.axes.color'];
                
                // Draw the horizontal 3d axis
                // The left horizontal axis
                pa2(co,
                    'b m % % l % % l % % l % % s #aaa f #ddd',
                    this.marginLeft, ca.height - this.marginBottom,
                    this.marginLeft + offsetx, ca.height - this.marginBottom - offsety,
                    this.marginLeft + offsetx + this.axisWidth, ca.height - this.marginBottom - offsety,
                    this.marginLeft + this.axisWidth, ca.height - this.marginBottom
                );
                
                // The left vertical axis
                this.draw3DLeftVerticalAxis();
                
                
                
                
                // Draw the right horizontal axes
                pa2(co,
                    'b m % % l % % l % % l % % s #aaa f #ddd',
                    this.marginLeft + this.marginCenter + this.axisWidth, ca.height - this.marginBottom,
                    this.marginLeft + this.marginCenter + this.axisWidth + offsetx, ca.height - this.marginBottom - offsety,
                    this.marginLeft + this.marginCenter + this.axisWidth + this.axisWidth + offsetx, ca.height - this.marginBottom - offsety,
                    this.marginLeft + this.marginCenter + this.axisWidth + this.axisWidth, ca.height - this.marginBottom
                );
                
                
                
                
                // Draw the right vertical axes
                pa2(co,
                    'b m % % l % % l % % l % % s #aaa f #ddd',
                    this.marginLeft + this.marginCenter + this.axisWidth, ca.height - this.marginBottom,
                    this.marginLeft + this.marginCenter + this.axisWidth, ca.height - this.marginBottom - this.axisHeight,
                    this.marginLeft + this.marginCenter + this.axisWidth + offsetx, ca.height - this.marginBottom - this.axisHeight - offsety,
                    this.marginLeft + this.marginCenter + this.axisWidth + offsetx, ca.height - this.marginBottom - offsety
                );
            }
        }








        //
        // Redraws the left vertical axis
        //
        this.draw3DLeftVerticalAxis = function ()
        {
            if (prop['chart.variant'] === '3d') {
                var offsetx = prop['chart.variant.threed.offsetx'],
                    offsety = prop['chart.variant.threed.offsety'];
    
                // The left vertical axis
                pa2(co,
                    'b m % % l % % l % % l % % s #aaa f #ddd',
                    this.marginLeft + this.axisWidth, this.marginTop,
                    this.marginLeft + this.axisWidth + offsetx, this.marginTop - offsety,
                    this.marginLeft + this.axisWidth + offsetx, ca.height - this.marginBottom - offsety,
                    this.marginLeft + this.axisWidth, ca.height - this.marginBottom
                );
            }
        };








        /**
        * Draws the axes
        */
        this.drawAxes =
        this.DrawAxes = function ()
        {
            // Set the linewidth
            co.lineWidth = prop['chart.axes.linewidth'] + 0.001;

    
            // Draw the left set of axes
            co.beginPath();
            co.strokeStyle = prop['chart.axes.color'];
    
            this.axisWidth  = (ca.width - prop['chart.margin.center'] - this.marginLeft - this.marginRight) / 2;
            this.axisHeight = ca.height - this.marginTop - this.marginBottom;
            
            
            // This must be here so that the two above variables are calculated
            if (!prop['chart.axes']) {
                return;
            }
    
            if (prop['chart.xaxis']) {
                co.moveTo(this.marginLeft, ca.height - this.marginBottom);
                co.lineTo(this.marginLeft + this.axisWidth, ca.height - this.marginBottom);
            }
            
            if (prop['chart.yaxis']) {
                co.moveTo(this.marginLeft + this.axisWidth, ca.height - this.marginBottom);
                co.lineTo(this.marginLeft + this.axisWidth, this.marginTop);
            }
            
            co.stroke();
    
    
            // Draw the right set of axes
            co.beginPath();
    
            var x = this.marginLeft + this.axisWidth + prop['chart.margin.center'];
            
            if (prop['chart.yaxis']) {
                co.moveTo(x, this.marginTop);
                co.lineTo(x, ca.height - this.marginBottom);
            }
            
            if (prop['chart.xaxis']) {
                co.moveTo(x, ca.height - this.marginBottom);
                co.lineTo(ca.width - this.marginRight, ca.height - this.marginBottom);
            }
    
            co.stroke();
        };








        /**
        * Draws the tick marks on the axes
        */
        this.drawTicks =
        this.DrawTicks = function ()
        {
            // Set the linewidth
            co.lineWidth = prop['chart.axes.linewidth'] + 0.001;
    
            var numDataPoints = this.left.length;
            var barHeight     = ( (ca.height - this.marginTop - this.marginBottom)- (this.left.length * (prop['chart.vmargin'] * 2) )) / numDataPoints;
    
            // Store this for later
            this.barHeight = barHeight;
    
            // If no axes - no tickmarks
            if (!prop['chart.axes']) {
                return;
            }
    
            // Draw the left Y tick marks
            if (prop['chart.yaxis'] && prop['chart.yaxis.tickmarks.count'] > 0) {
                co.beginPath();
                    for (var i=0; i<prop['chart.yaxis.tickmarks.count']; ++i) {
                        var y = prop['chart.margin.top'] + (((ca.height - this.marginTop - this.marginBottom) / prop['chart.yaxis.tickmarks.count']) * i);
                        co.moveTo(this.marginLeft + this.axisWidth , y);
                        co.lineTo(this.marginLeft + this.axisWidth + 3, y);
                    }
                co.stroke();


                //Draw the right axis Y tick marks
                co.beginPath();
                    for (var i=0; i<prop['chart.yaxis.tickmarks.count']; ++i) {
                        var y = prop['chart.margin.top'] + (((ca.height - this.marginTop - this.marginBottom) / prop['chart.yaxis.tickmarks.count']) * i);
                        co.moveTo(this.marginLeft + this.axisWidth + prop['chart.margin.center'], y);
                        co.lineTo(this.marginLeft + this.axisWidth + prop['chart.margin.center'] - 3, y);
                    }
                co.stroke();




                // Draw an exra tick if the Y axis isn't being shown
                // on each of the sides
                if (!prop['chart.xaxis']) {
                    pa2(
                        co,
                        'b m % % l % % s %',
                        this.marginLeft + this.axisWidth,
                        ca.height - this.marginBottom,
                        this.marginLeft + this.axisWidth + 4,
                        (ca.height - this.marginBottom),
                        co.strokeStyle
                    );

                    pa2(
                        co,
                        'b m % % l % % s %',
                        this.marginLeft + this.axisWidth + prop['chart.margin.center'],
                        ca.height - this.marginBottom,
                        this.marginLeft + this.axisWidth + prop['chart.margin.center'] - 4,
                        ca.height - this.marginBottom,
                        co.strokeStyle
                    );
                }
            }
            
            
            
            /**
            * X tickmarks
            */
            if (prop['chart.xaxis'] && prop['chart.xaxis.tickmarks.count'] > 0) {
                var xInterval = this.axisWidth / prop['chart.xaxis.tickmarks.count'];
        
                // Is chart.xtickinterval specified ? If so, use that.
                if (typeof(prop['chart.xaxis.tickmarks.interval']) == 'number') {
                    xInterval = prop['chart.xaxis.tickmarks.interval'];
                }
        
                
                // Draw the left sides X tick marks
                for (i=this.marginLeft; i<(this.marginLeft + this.axisWidth); i+=xInterval) {
                    co.beginPath();
                    co.moveTo(i, ca.height - this.marginBottom);
                    co.lineTo(i, (ca.height - this.marginBottom) + 4);
                    co.closePath();
                    
                    co.stroke();
                }
        
                // Draw the right sides X tick marks
                var stoppingPoint = ca.width - this.marginRight;
        
                for (i=(this.marginLeft + this.axisWidth + prop['chart.margin.center'] + xInterval); i<=stoppingPoint; i+=xInterval) {
                    co.beginPath();
                        co.moveTo(i, ca.height - this.marginBottom);
                        co.lineTo(i, (ca.height - this.marginBottom) + 4);
                    co.closePath();
                    co.stroke();
                }
                
                
                // Draw an exra tick if the Y axis isn't being shown
                // on each of the sides
                if (!prop['chart.yaxis']) {
                    pa2(
                        co,
                        'b m % % l % % s %',
                        this.marginLeft + this.axisWidth,
                        ca.height - this.marginBottom,
                        this.marginLeft + this.axisWidth,
                        (ca.height - this.marginBottom) + 4,
                        co.strokeStyle
                    );

                    pa2(
                        co,
                        'b m % % l % % s %',
                        this.marginLeft + this.axisWidth + prop['chart.margin.center'],
                        ca.height - this.marginBottom,
                        this.marginLeft + this.axisWidth + prop['chart.margin.center'],
                        (ca.height - this.marginBottom) + 4,
                        co.strokeStyle
                    );
                }
            }
        };








        /**
        * Figures out the maximum value, or if defined, uses chart.xaxis.scale.max
        */
        this.getMax =
        this.GetMax = function()
        {
            var dec  = prop['chart.xaxis.scale.decimals'];
            
            // chart.xaxis.scale.max defined
            if (prop['chart.xaxis.scale.max']) {
    
                var max = prop['chart.xaxis.scale.max'];
                var min = prop['chart.xaxis.scale.min'];

                this.scale2 = RG.getScale2(this, {
                    'scale.max':          max,
                    'scale.min':          min,
                    'scale.strict':       true,
                    'scale.thousand':     prop['chart.xaxis.scale.thousand'],
                    'scale.point':        prop['chart.xaxis.scale.point'],
                    'scale.decimals':     prop['chart.xaxis.scale.decimals'],
                    'scale.labels.count': prop['chart.xaxis.labels.count'],
                    'scale.round':        prop['chart.xaxis.scale.round'],
                    'scale.units.pre':    prop['chart.xaxis.scale.units.pre'],
                    'scale.units.post':   prop['chart.xaxis.scale.units.post']
                });

                this.max = this.scale2.max;
                this.min = this.scale2.min;

    
            /**
            * Generate the scale ourselves
            */
            } else {

                var max = 1;

                // Work out the max value for the left hand side
                for (var i=0; i<this.left.length; ++i) {
                    if (typeof this.left[i] === 'number') {
                        max = ma.max(max, this.left[i]);
                    } else if (RG.isNull(this.left[i])) {
                        // Nada
                    } else {
                        max = ma.max(max, prop['chart.grouping'] === 'stacked' ? RG.arraySum(this.left[i]) : RG.arrayMax(this.left[i]));
                    }
                }

                // Work out the max value for the right hand side
                for (var i=0; i<this.right.length; ++i) {
                    if (typeof this.right[i] === 'number') {
                        max = ma.max(max, this.right[i]);
                    } else if (RG.isNull(this.right[i])) {
                        // Nada
                    } else {
                        max = ma.max(max, prop['chart.grouping'] === 'stacked' ? RG.arraySum(this.right[i]) : RG.arrayMax(this.right[i]));
                    }
                }

                this.scale2 = RG.getScale2(this, {
                    'scale.max':          max,
                    'scale.min':          prop['chart.xsxis.scale.min'],
                    'scale.thousand':     prop['chart.xaxis.scale.thousand'],
                    'scale.point':        prop['chart.xaxis.scale.point'],
                    'scale.decimals':     prop['chart.xaxis.scale.decimals'],
                    'scale.labels.count': prop['chart.xaxis.labels.count'],
                    'scale.round':        prop['chart.xaxis.scale.round'],
                    'scale.units.pre':    prop['chart.xaxis.scale.units.pre'],
                    'scale.units.post':   prop['chart.xaxis.scale.units.post']
                });
    

                this.max = this.scale2.max;
                this.min = this.scale2.min;
            }
    
            // Don't need to return it as it is stored in this.max
        };








        // Function to draw the left hand bars
        this.drawLeftBars =
        this.DrawLeftBars = function ()
        {
            var opt = {};

            if (typeof arguments[0] === 'object') {
                opt.shadow = arguments[0].shadow;
            } else {
                opt.shadow = true;
            }

            var offsetx = prop['chart.variant.threed.offsetx'],
                offsety = prop['chart.variant.threed.offsety'];

            // Set the stroke colour
            co.strokeStyle = prop['chart.colors.stroke'];
            
            // Set the linewidth
            co.lineWidth = prop['chart.linewidth'];
    
            for (var i=0,sequentialColorIndex=0; i<this.left.length; ++i) {


                /**
                * Turn on a shadow if requested
                */
                if (prop['chart.shadow'] && prop['chart.variant'] !== '3d' && opt.shadow) {
                    RG.setShadow({
                        object: this,
                        prefix: 'chart.shadow'
                    });
                }



                if (typeof this.left[i] === 'number') {

                    // If chart.colors.sequential is specified - handle that
                    // ** There's another instance of this further down **
                    if (prop['chart.colors.sequential']) {
                        co.fillStyle = prop['chart.colors'][sequentialColorIndex];
                    } else {
                        co.fillStyle = prop['chart.colors'][0];
                    
                        // If there's only two colors then use them in the format of
                        // one for each side. This facilitates easy coloring.
                        if (prop['chart.colors'].length === 2) {
                            co.fillStyle = prop['chart.colors'][0];
                        }
                    }
    
    
    
    
                    /**
                    * Work out the coordinates
                    */
                    var width = (( (this.left[i] - this.min) / (this.max - this.min)) *  this.axisWidth);
    
                    var coords = [
                        this.marginLeft + this.axisWidth - width,
                        this.marginTop + (i * ( this.axisHeight / this.left.length)) + prop['chart.vmargin'],
                        width,
                        this.barHeight
                    ];
        
                    
                    if (this.left[i] !== null) {
                        co.strokeRect(
                            coords[0],
                            coords[1],
                            coords[2],
                            coords[3]
                        );
                        
                        co.fillRect(
                            coords[0],
                            coords[1],
                            coords[2],
                            coords[3]
                        );
                    }


                    // Draw the 3D sides if required
                    if (prop['chart.variant'] === '3d' && this.left[i] !== null) {
    
                        // If the shadow is enabled draw the backface for
                        // (that we don't actually see
                        if (prop['chart.shadow'] && opt.shadow) {
    
                            co.shadowColor   = prop['chart.shadow.color'];
                            co.shadowBlur    = prop['chart.shadow.blur'];
                            co.shadowOffsetX = prop['chart.shadow.offsetx'];
                            co.shadowOffsetY = prop['chart.shadow.offsety'];
    
    
                            pa2(co,
                                'b m % % l % % l % % l % % f black sc rgba(0,0,0,0) sx 0 sy 0 sb 0',
                                coords[0] + offsetx, coords[1] - offsety,
                                coords[0] + offsetx + coords[2], coords[1] - offsety,
                                coords[0] + offsetx + coords[2], coords[1] - offsety + coords[3],
                                coords[0] + offsetx,coords[1] - offsety + coords[3]
                            );
                        }
    
    
    
                        // If chart.colors.sequential is specified - handle that (again)
                        //
                        // ** There's another instance of this further up **
                        if (prop['chart.colors.sequential']) {
                            co.fillStyle = prop['chart.colors'][i];
        
                        } else {
                            co.fillStyle = prop['chart.colors'][0];
                        }
    
                        pa2(co,
                            'b m % % l % % l % % l % % f %',
                            coords[0],coords[1],
                            coords[0] + offsetx, coords[1] - offsety,
                            coords[0] + offsetx + coords[2], coords[1] - offsety,
                            coords[0] + coords[2], coords[1]
                        );

                        pa2(co,
                            'b m % % l % % l % % l % % f rgba(255,255,255,0.4)',
                            coords[0],coords[1],
                            coords[0] + offsetx, coords[1] - offsety,
                            coords[0] + offsetx + coords[2], coords[1] - offsety,
                            coords[0] + coords[2], coords[1]
                        );
                    }
                    
                    // Only store coordinates if this isn't a shadow iteration
                    if (!opt.shadow) {

                        // Add the coordinates to the coords array
                        this.coords.push([
                            coords[0],
                            coords[1],
                            coords[2],
                            coords[3]
                        ]);
                        
                        this.coordsLeft.push([
                            coords[0],
                            coords[1],
                            coords[2],
                            coords[3]
                        ]);
                    }
                    
                    sequentialColorIndex++;








                // A stacked Bipolar chart
                } else if (typeof this.left[i] === 'object' && prop['chart.grouping'] === 'stacked') {

                    for (var j=0,accumulatedWidth=0; j<this.left[i].length; ++j) {

                        // If chart.colors.sequential is specified - handle that
                        // ** There's another instance of this further down **
                        if (prop['chart.colors.sequential']) {
                            co.fillStyle = prop['chart.colors'][sequentialColorIndex];
        
                        } else {
                            co.fillStyle = prop['chart.colors'][j];
                        }

    
    
    
                        /**
                        * Work out the coordinates
                        */
                        var value         = this.left[i][j],
                            min           = this.min,
                            max           = this.max,
                            margin        = prop['chart.vmargin'],

                            width         = (( (value - min) / (max - min)) *  this.axisWidth),
                            sectionHeight = (this.axisHeight / this.left.length),
                            height        = (sectionHeight - (2 * margin)),
                            x             = this.marginLeft + this.axisWidth - width - accumulatedWidth,
                            y             = this.marginTop + margin + (i * sectionHeight);

                        accumulatedWidth += width;


                        if (this.left[i] !== null) {
                            co.strokeRect(x, y, width, height);
                            co.fillRect(x, y, width, height);
                        }




                        // Draw the 3D sides if required =========================
                        if (prop['chart.variant'] === '3d' && this.left[i] !== null) {
                        
                            // If the shadow is enabled draw the backface for
                            // (that we don't actually see
                            if (prop['chart.shadow'] && opt.shadow) {
                        
                                co.shadowColor   = prop['chart.shadow.color'];
                                co.shadowBlur    = prop['chart.shadow.blur'];
                                co.shadowOffsetX = prop['chart.shadow.offsetx'];
                                co.shadowOffsetY = prop['chart.shadow.offsety'];
                        
                        
                                pa2(co,
                                    'b m % % l % % l % % l % % f black sc rgba(0,0,0,0) sx 0 sy 0 sb 0',
                                    x + offsetx, y - offsety,
                                    x + offsetx + width, y - offsety,
                                    x + offsetx + width, y - offsety + height,
                                    x + offsetx,y - offsety + height
                                );
                            }
                        
                        
                        
                            // If chart.colors.sequential is specified - handle that (again)
                            //
                            // ** There's another instance of this further up **
                            if (prop['chart.colors.sequential']) {
                                co.fillStyle = prop['chart.colors'][sequentialColorIndex];
                            } else {
                                co.fillStyle = prop['chart.colors'][j];
                            }
                        
                            // Top side
                            pa2(co,
                                'b m % % l % % l % % l % % f %',
                                x,y,
                                x + offsetx, y - offsety,
                                x + offsetx + width, y - offsety,
                                x + width, y
                            );
                        
                            // top side again (to lighten it)
                            pa2(co,
                                'b m % % l % % l % % l % % f rgba(255,255,255,0.4)',
                                x,y,
                                x + offsetx, y - offsety,
                                x + offsetx + width, y - offsety,
                                x + width, y
                            );
                        }
                        // ===== 3D ==========================================



                        // Only store coordinates if this isn't a shadow iteration
                        if (!opt.shadow) {
                        
                            //
                            // Add the coordinates to the coords arrays
                            //



                            // The .coords array
                            this.coords.push([
                                x,
                                y,
                                width,
                                height
                            ]);



                            // The .coordsLeft array
                            this.coordsLeft.push([
                                x,
                                y,
                                width,
                                height
                            ]);
    
    
    
                            // The .coords2 array
                            if (!RG.isArray(this.coords2[i])) {
                                this.coords2[i] = [];
                            }
    
                            this.coords2[i].push([
                                x,
                                y,
                                width,
                                height
                            ]);



                            // The .coords2Left array
                            if (!RG.isArray(this.coords2Left[i])) {
                                this.coords2Left[i] = [];
                            }
    
                            this.coords2Left[i].push([
                                x,
                                y,
                                width,
                                height
                            ]);
                        }

                        sequentialColorIndex++;
                    }
                // A grouped Bipolar chart - and this is also the default
                } else if (typeof this.left[i] === 'object' && !RG.isNull(this.left[i])) {

                    for (var j=0; j<this.left[i].length; ++j) {

                        // If chart.colors.sequential is specified - handle that
                        // ** There's another instance of this further down **
                        if (prop['chart.colors.sequential']) {
                            co.fillStyle = prop['chart.colors'][sequentialColorIndex];

                        } else {
                            co.fillStyle = prop['chart.colors'][j];
                        }




                        /**
                        * Work out the coordinates
                        */
                        var value         = this.left[i][j],
                            min           = this.min,
                            max           = this.max,
                            margin        = prop['chart.vmargin'],
                            marginGrouped = prop['chart.vmargin.grouped'],

                            width         = (( (value - min) / (max - min)) *  this.axisWidth),
                            sectionHeight = (this.axisHeight / this.left.length),
                            height        = (sectionHeight - (2 * margin) - ( (this.left[i].length - 1) * marginGrouped)) / this.left[i].length,
                            x             = this.marginLeft + this.axisWidth - width,
                            y             = this.marginTop + margin + (i * sectionHeight) + (height * j) + (j * marginGrouped);


                        if (this.left[i] !== null) {
                            co.strokeRect(x, y, width, height);
                            co.fillRect(x, y, width, height);
                        }



                        // Draw the 3D sides if required
                        if (prop['chart.variant'] === '3d' && this.left[i] !== null) {
                        
                            // If the shadow is enabled draw the backface for
                            // (that we don't actually see
                            if (prop['chart.shadow'] && opt.shadow) {
                        
                                co.shadowColor   = prop['chart.shadow.color'];
                                co.shadowBlur    = prop['chart.shadow.blur'];
                                co.shadowOffsetX = prop['chart.shadow.offsetx'];
                                co.shadowOffsetY = prop['chart.shadow.offsety'];
                        
                        
                                pa2(co,
                                    'b m % % l % % l % % l % % f black sc rgba(0,0,0,0) sx 0 sy 0 sb 0',
                                    x + offsetx, y - offsety,
                                    x + offsetx + width, y - offsety,
                                    x + offsetx + width, y - offsety + height,
                                    x + offsetx,y - offsety + height
                                );
                            }
                        
                        
                        
                            // If chart.colors.sequential is specified - handle that (again)
                            //
                            // ** There's another instance of this further up **
                            if (prop['chart.colors.sequential']) {
                                co.fillStyle = prop['chart.colors'][sequentialColorIndex];
                            } else {
                                co.fillStyle = prop['chart.colors'][j];
                            }
                        
                            // Top side
                            pa2(co,
                                'b m % % l % % l % % l % % f %',
                                x,y,
                                x + offsetx, y - offsety,
                                x + offsetx + width, y - offsety,
                                x + width, y
                            );
                        
                            // top side again (to lighten it)
                            pa2(co,
                                'b m % % l % % l % % l % % f rgba(255,255,255,0.4)',
                                x,y,
                                x + offsetx, y - offsety,
                                x + offsetx + width, y - offsety,
                                x + width, y
                            );
                        }



                        // Only store coordinates if this isn't a shadow iteration
                        if (!opt.shadow) {



                            // Add the coordinates to the coords arrays
                            this.coords.push([
                                x,
                                y,
                                width,
                                height
                            ]);



                            this.coordsLeft.push([
                                x,
                                y,
                                width,
                                height
                            ]);
    
    
    
                            if (!RG.isArray(this.coords2[i])) {
                                this.coords2[i] = [];
                            }
    
                            this.coords2[i].push([
                                x,
                                y,
                                width,
                                height
                            ]);
    
    
    
                            if (!RG.isArray(this.coords2Left[i])) {
                                this.coords2Left[i] = [];
                            }
    
                            this.coords2Left[i].push([
                                x,
                                y,
                                width,
                                height
                            ]);
                        }
                        
                        sequentialColorIndex++;
                    }
                }
                
                
                
                // Now draw the left vertical axis again so that it appears
                // over the bars
                this.draw3DLeftVerticalAxis();
            }
    
            /**
            * Turn off any shadow
            */
            RG.noShadow(this);
            
            // Reset the linewidth
            co.lineWidth = 1;
        };








        /**
        * Function to draw the right hand bars
        */
        this.drawRightBars =
        this.DrawRightBars = function ()
        {
            var opt = {};
            
            if (typeof arguments[0] === 'object') {
                opt.shadow = arguments[0].shadow;
            } else {
                opt.shadow = true;
            }

            var offsetx = prop['chart.variant.threed.offsetx'],
                offsety = prop['chart.variant.threed.offsety'];




            // Set the stroke colour
            co.strokeStyle = prop['chart.colors.stroke'];
            
            // Set the linewidth
            co.lineWidth = prop['chart.linewidth'];
                
            /**
            * Turn on a shadow if requested
            */
            if (prop['chart.shadow'] && prop['chart.variant'] !== '3d' && opt.shadow) {
                co.shadowColor   = prop['chart.shadow.color'];
                co.shadowBlur    = prop['chart.shadow.blur'];
                co.shadowOffsetX = prop['chart.shadow.offsetx'];
                co.shadowOffsetY = prop['chart.shadow.offsety'];
            }

            for (var i=0,sequentialColorIndex=RG.arrayLinearize(this.left).length; i<this.right.length; ++i) {

                if (typeof this.right[i] === 'number') {
                        // If chart.colors.sequential is specified - handle that
                        if (prop['chart.colors.sequential']) {
                            co.fillStyle = prop['chart.colors'][sequentialColorIndex];
                        } else {
                            co.fillStyle = prop['chart.colors'][0];

                            // If there's only two colors then use them in the format of
                            // one for each side. This facilitates easy coloring.
                            if (prop['chart.colors'].length === 2) {
                                co.fillStyle = prop['chart.colors'][1];
                            }
                        }
        
            
                        var width = (((this.right[i] - this.min) / (this.max - this.min)) * this.axisWidth);
        
                        var coords = [
                            this.marginLeft + this.axisWidth + prop['chart.margin.center'],
                            prop['chart.vmargin'] + (i * (this.axisHeight / this.right.length)) + this.marginTop,
                            width,
                            this.barHeight
                        ];

        
                        if (this.right[i] !== null) {
                            co.strokeRect(
                                coords[0],
                                coords[1],
                                coords[2],
                                coords[3]
                            );
                            co.fillRect(
                                coords[0],
                                coords[1],
                                coords[2],
                                coords[3]
                            );
                        }
        
        
        
        
        
        
        
        
        
        
        
        
        
                        // Draw the 3D sides if required
                        if (prop['chart.variant'] === '3d' && this.right[i] !== null) {
        
                            var color = co.fillStyle;
                            
        
                            // If the shadow is enabled draw the backface for
                            // (that we don't actually see
                            if (prop['chart.shadow'] && opt.shadow) {
        
                                co.shadowColor   = prop['chart.shadow.color'];
                                co.shadowBlur    = prop['chart.shadow.blur'];
                                co.shadowOffsetX = prop['chart.shadow.offsetx'];
                                co.shadowOffsetY = prop['chart.shadow.offsety'];
        
                                pa2(co,
                                    'b m % % l % % l % % l % % f black sc rgba(0,0,0,0) sx 0 sy 0 sb 0',
                                    coords[0] + offsetx, coords[1] - offsety,
                                    coords[0] + offsetx + coords[2], coords[1] - offsety,
                                    coords[0] + offsetx + coords[2], coords[1] - offsety + coords[3],
                                    coords[0] + offsetx,coords[1] - offsety + coords[3]
                                );
                            }
        
                            // Draw the top
                            pa2(co,
                                'b m % % l % % l % % l % % f %',
                                coords[0],coords[1],
                                coords[0] + offsetx, coords[1] - offsety,
                                coords[0] + offsetx + coords[2], coords[1] - offsety,
                                coords[0] + coords[2], coords[1],
                                color
                            );
        
        
                            // Draw the right hand side
                            pa2(co,
                                'b m % % l % % l % % l % % f %',
                                coords[0] + coords[2],coords[1],
                                coords[0] + coords[2] + offsetx, coords[1] - offsety,
                                coords[0] + coords[2] + offsetx, coords[1] - offsety + coords[3],
                                coords[0] + coords[2],coords[1] + coords[3],
                                color
                            );
        
                            // Draw the LIGHTER top
                            pa2(co,
                                'b m % % l % % l % % l % % f rgba(255,255,255,0.6)',
                                coords[0],coords[1],
                                coords[0] + offsetx, coords[1] - offsety,
                                coords[0] + offsetx + coords[2], coords[1] - offsety,
                                coords[0] + coords[2], coords[1]
                            );
        
        
                            // Draw the DARKER right hand side
                            pa2(co,
                                'b m % % l % % l % % l % % f rgba(0,0,0,0.3)',
                                coords[0] + coords[2],coords[1],
                                coords[0] + coords[2] + offsetx, coords[1] - offsety,
                                coords[0] + coords[2] + offsetx, coords[1] - offsety + coords[3],
                                coords[0] + coords[2],coords[1] + coords[3]
                            );
                        }
        
        
        
        
        
        
        
        
        
        
        
        
                        // Only store coordinates if this isn't a shadow iteration
                        if (!opt.shadow) {

                            /**
                            * Add the coordinates to the coords array
                            */
                            
                            // The .coords array
                            this.coords.push([
                                coords[0],
                                coords[1],
                                coords[2],
                                coords[3]
                            ]);
                            
                            // The .coordsRight array
                            this.coordsRight.push([
                                coords[0],
                                coords[1],
                                coords[2],
                                coords[3]
                            ]);
                        }
                    
                    // Does this need to be here?
                    sequentialColorIndex++;







                // A stacked Bipolar chart
                } else if (typeof this.left === 'object' && prop['chart.grouping'] === 'stacked') {

                    for (var j=0,accumulatedWidth=0; j<this.right[i].length; ++j) {

                        // If chart.colors.sequential is specified - handle that
                        // ** There's another instance of this further down **
                        if (prop['chart.colors.sequential']) {
                            co.fillStyle = prop['chart.colors'][sequentialColorIndex];
        
                        } else {
                            co.fillStyle = prop['chart.colors'][j];
                        }

    
    
    
                        /**
                        * Work out the coordinates
                        */
                        var value         = this.right[i][j],
                            min           = this.min,
                            max           = this.max,
                            margin        = prop['chart.vmargin'],

                            width         = (( (value - min) / (max - min)) *  this.axisWidth),
                            sectionHeight = (this.axisHeight / this.right.length),
                            height        = (sectionHeight - (2 * margin)),
                            x             = this.marginLeft + this.axisWidth +prop['chart.margin.center'] + accumulatedWidth,
                            y             = this.marginTop + margin + (i * sectionHeight);

                        accumulatedWidth += width;


                        if (this.right[i] !== null) {
                            co.strokeRect(x, y, width, height);
                            co.fillRect(x, y, width, height);
                        }



                        // Draw the 3D sides if required
                        if (prop['chart.variant'] === '3d' && this.right[i] !== null) {
                        
                            var color = co.fillStyle;
                            
                        
                            // If the shadow is enabled draw the backface for
                            // (that we don't actually see
                            if (prop['chart.shadow'] && opt.shadow) {
                            
                                RG.setShadow({
                                    object: this,
                                    prefix: 'chart.shadow'
                                });
                        
                                pa2(co,
                                    'b m % % l % % l % % l % % f black sc rgba(0,0,0,0) sx 0 sy 0 sb 0',
                                    x + offsetx, y - offsety,
                                    x + offsetx + width, y - offsety,
                                    x + offsetx + width, y - offsety + height,
                                    x + offsetx, y - offsety + height
                                );
                            }
                        
                            // Draw the top
                            pa2(co,
                                'b m % % l % % l % % l % % f %',
                                x, y,
                                x + offsetx, y - offsety,
                                x + offsetx + width, y - offsety,
                                x + width, y,
                                color
                            );
                        
                        
                            // Draw the right hand side - but only
                            // if this the most right hand side segment
                            if (j === (this.right[i].length - 1)) {
                                pa2(co,
                                    'b m % % l % % l % % l % % f %',
                                    x + width,y,
                                    x + width + offsetx, y - offsety,
                                    x + width + offsetx, y - offsety + height,
                                    x + width,y + height,
                                    color
                                );

                                // Draw the DARKER right hand side
                                pa2(co,
                                    'b m % % l % % l % % l % % f rgba(0,0,0,0.3)',
                                    x + width,y,
                                    x + width + offsetx, y - offsety,
                                    x + width + offsetx, y - offsety + height,
                                    x + width,y + height
                                );
                            }
                        
                            // Draw the LIGHTER top
                            pa2(co,
                                'b m % % l % % l % % l % % f rgba(255,255,255,0.6)',
                                x,y,
                                x + offsetx, y - offsety,
                                x + offsetx + width, y - offsety,
                                x + width, y
                            );
                        }


                        // Only store coordinates if this isn't a shadow iteration
                        if (!opt.shadow) {
                            
                            // Add the coordinates to the coords arrays
                            this.coords.push([
                                x,
                                y,
                                width,
                                height
                            ]);



                           // The .coords2 array
                            if (!RG.isArray(this.coords2[sequentialColorIndex])) {
                                this.coords2[sequentialColorIndex] = [];
                            }

                            this.coords2[sequentialColorIndex].push([
                                x,
                                y,
                                width,
                                height
                            ]);



                            this.coordsRight.push([
                                x,
                                y,
                                width,
                                height
                            ]);



                            // The .coords2Right array
                            if (!RG.isArray(this.coords2Right[i])) {
                                this.coords2Right[i] = [];
                            }
    
                            this.coords2Right[i].push([
                                x,
                                y,
                                width,
                                height
                            ]);
                        }
                        
                        sequentialColorIndex++;
                    }








                // Draw a grouped Bipolar chart. This is also the default
                } else if (typeof this.right[i] === 'object') {

                    for (var j=0; j<this.right[i].length; ++j) {

                        // If chart.colors.sequential is specified - handle that
                        // ** There's another instance of this further down **
                        if (prop['chart.colors.sequential']) {
                            co.fillStyle = prop['chart.colors'][sequentialColorIndex];

                        } else {
                            co.fillStyle = prop['chart.colors'][j];
                        }

    
    
    
                        /**
                        * Work out the coordinates
                        */

                        var value         = this.right[i][j],
                            min           = this.min,
                            max           = this.max,
                            margin        = prop['chart.vmargin'],
                            marginGrouped = prop['chart.vmargin.grouped'],

                            width         = ( (value - min) / (max - min)) *  this.axisWidth,
                            sectionHeight = (this.axisHeight / this.right.length),
                            height        = (sectionHeight - (2 * margin) - ( (this.right[i].length - 1) * marginGrouped)) / this.right[i].length,
                            x             = this.marginLeft + this.axisWidth + prop['chart.margin.center'],
                            y             = this.marginTop + margin + (i * sectionHeight) + (height * j) + (j * marginGrouped);


                        if (this.right[i] !== null) {
                            co.strokeRect(x, y, width, height);
                            co.fillRect(x, y, width, height);
                        }













                        // Only store coordinates if this isn't a shadow iteration
                        if (!opt.shadow) {



                            // Add the coordinates to the coords arrays
                            this.coords.push([
                                x,
                                y,
                                width,
                                height
                            ]);
                            



                            this.coordsRight.push([
                                x,
                                y,
                                width,
                                height
                            ]);



                           // The .coords2 array
                            if (!RG.isArray(this.coords2[this.left.length + i])) {
                                this.coords2[this.left.length + i] = [];
                            }
    
                            this.coords2[this.left.length + i].push([
                                x,
                                y,
                                width,
                                height
                            ]);



                            if (!RG.isArray(this.coords2Right[i])) {
                                this.coords2Right[i] = [];
                            }

                            this.coords2Right[i].push([
                                x,
                                y,
                                width,
                                height
                            ]);
                        }
                        
                        sequentialColorIndex++;

















                        // Draw the 3D sides if required
                        if (prop['chart.variant'] === '3d' && this.right[i] !== null) {
                        
                            var color = co.fillStyle;
                            
                        
                            // If the shadow is enabled draw the backface for
                            // (that we don't actually see
                            if (prop['chart.shadow'] && opt.shadow) {
                        
                                co.shadowColor   = prop['chart.shadow.color'];
                                co.shadowBlur    = prop['chart.shadow.blur'];
                                co.shadowOffsetX = prop['chart.shadow.offsetx'];
                                co.shadowOffsetY = prop['chart.shadow.offsety'];
                        
                                pa2(co,
                                    'b m % % l % % l % % l % % f black sc rgba(0,0,0,0) sx 0 sy 0 sb 0',
                                    x + offsetx, y - offsety,
                                    x + offsetx + width, y - offsety,
                                    x + offsetx + width, y - offsety + height,
                                    x + offsetx, y - offsety + height
                                );
                            }
                        
                            // Draw the top
                            pa2(co,
                                'b m % % l % % l % % l % % f %',
                                x, y,
                                x + offsetx, y - offsety,
                                x + offsetx + width, y - offsety,
                                x + width, y,
                                color
                            );
                        
                        
                            // Draw the right hand side
                            pa2(co,
                                'b m % % l % % l % % l % % f %',
                                x + width,y,
                                x + width + offsetx, y - offsety,
                                x + width + offsetx, y - offsety + height,
                                x + width,y + height,
                                color
                            );
                        
                            // Draw the LIGHTER top
                            pa2(co,
                                'b m % % l % % l % % l % % f rgba(255,255,255,0.6)',
                                x,y,
                                x + offsetx, y - offsety,
                                x + offsetx + width, y - offsety,
                                x + width, y
                            );
                        
                        
                            // Draw the DARKER right hand side
                            pa2(co,
                                'b m % % l % % l % % l % % f rgba(0,0,0,0.3)',
                                x + width,y,
                                x + width + offsetx, y - offsety,
                                x + width + offsetx, y - offsety + height,
                                x + width,y + height
                            );
                        }
                    }
                }
            }









            /**
            * Turn off any shadow
            */
            RG.noShadow(this);
            
            // Reset the linewidth
            co.lineWidth = 1;
        };








        /**
        * Draws the titles
        */
        this.drawLabels =
        this.DrawLabels = function ()
        {
            //var //font          = prop['chart.labels.font'] || prop['chart.text.font'],
                //color         = prop['chart.labels.color'] || prop['chart.text.color'],
                //size          = prop['chart.labels.size'] || prop['chart.text.size'],
                //bold          = typeof prop['chart.labels.bold'] === 'boolean' ? prop['chart.labels.bold'] : prop['chart.text.bold'],
                //italic        = typeof prop['chart.labels.italic'] === 'boolean' ? prop['chart.labels.italic'] : prop['chart.text.italic'],
            var labels        = prop['chart.yaxis.labels'],
                barAreaHeight = ca.height - this.marginTop - this.marginBottom
                
                // Get the text configuration
                var textConf = RG.getTextConf({
                    object: this,
                    prefix: 'chart.yaxis.labels'
                });

            co.fillStyle = textConf.color;

            for (var i=0,len=labels.length; i<len; ++i) {
                RG.text2(this, {
                    
                    color:  textConf.color,
                    font:   textConf.font,
                    size:   textConf.size,
                    bold:   textConf.bold,
                    italic: textConf.italic,
                    
                    x:      this.marginLeft + this.axisWidth + (prop['chart.margin.center'] / 2),
                    y:      this.marginTop + ((barAreaHeight / labels.length) * (i)) + ((barAreaHeight / labels.length) / 2),
                    text:   String(labels[i] ? String(labels[i]) : ''),
                    halign: 'center',
                    valign: 'center',
                    marker: false,
                    tag:    'labels'
                });
            }



            co.fillStyle = prop['chart.text.color'];



            if (prop['chart.xaxis.labels']) {

                // Determine a ew things
                var grapharea = (ca.width - prop['chart.margin.center'] - this.marginLeft - this.marginRight) / 2;
                
                var textConf = RG.getTextConf({
                    object: this,
                    prefix: 'chart.xaxis.labels'
                });

                // Now draw the X labels for the left hand side
                for (var i=0; i<this.scale2.labels.length; ++i) {
                    RG.text2(this, {

                        font:   textConf.font,
                        size:   textConf.size,
                        bold:   textConf.bold,
                        italic: textConf.italic,
                        color:  textConf.color,

                        x:      this.marginLeft + ((grapharea / this.scale2.labels.length) * i),
                        y:      ca.height - this.marginBottom + 3,
                        text:   typeof prop['chart.xaxis.scale.formatter'] === 'function' ? (prop['chart.xaxis.scale.formatter'])(this, this.scale2.values[this.scale2.values.length - i - 1]) : this.scale2.labels[this.scale2.labels.length - i - 1],
                        valign: 'top',
                        halign: 'center',
                        tag:    'scale'
                    });




                    // Draw the scale for the right hand side
                    RG.text2(this, {

                        font:   textConf.font,
                        size:   textConf.size,
                        bold:   textConf.bold,
                        italic: textConf.italic,
                        color:  textConf.color,

                        x:      this.marginLeft+ grapharea + prop['chart.margin.center'] + ((grapharea / this.scale2.labels.length) * (i + 1)),
                        y:      ca.height - this.marginBottom + 3,
                        text:   this.scale2.labels[i],
                        text:   typeof prop['chart.xaxis.scale.formatter'] === 'function' ? (prop['chart.xaxis.scale.formatter'])(this, this.scale2.values[i]) : this.scale2.labels[i],
                        valign: 'top',
                        halign: 'center',
                        tag:    'scale'
                    });
                }




                // Draw zero?
                if (prop['chart.xaxis.scale.zerostart']) {
                    RG.text2(this, {

                        font:   textConf.font,
                        size:   textConf.size,
                        bold:   textConf.bold,
                        italic: textConf.italic,
                        color:  textConf.color,

                        x:      this.marginLeft + this.axisWidth,
                        y:      ca.height - this.marginBottom + 3,
                        text:   typeof prop['chart.xaxis.scale.formatter'] === 'function' ? (prop['chart.xaxis.scale.formatter'])(this, 0) : RG.numberFormat({
                            object:    this,
                            number:    (0).toFixed(prop['chart.xaxis.scale.decimals']),
                            unitspre:  prop['chart.xaxis.scale.units.pre'],
                            unitspost: prop['chart.xaxis.scale.units.post']
                        }),
                        valign: 'top',
                        halign: 'center',
                        tag:    'scale'
                    });


                    RG.text2(this, {

                        font:   textConf.font,
                        size:   textConf.size,
                        bold:   textConf.bold,
                        italic: textConf.italic,
                        color:  textConf.color,

                        x:      this.marginLeft + this.axisWidth + this.marginCenter,
                        y:      ca.height - this.marginBottom + 3,
                        text:   typeof prop['chart.xaxis.scale.formatter'] === 'function' ? (prop['chart.xaxis.scale.formatter'])(this, 0) :RG.numberFormat({
                            object: this,
                            number: (0).toFixed(prop['chart.xaxis.scale.decimals']),
                            unitspre: prop['chart.xaxis.scale.units.pre'],
                            unitspost: prop['chart.xaxis.scale.units.post']
                        }),
                        valign: 'top',
                        halign: 'center',
                        tag:     'scale'
                    });
                }
            }





            //
            // Draw above labels
            //
            if (prop['chart.labels.above']) {
                this.drawLabelsAbove();
            }
        };








        // This function draws the above labels
        this.drawLabelsAbove = function ()
        {
            var coordsLeft  = this.coordsLeft,
                coordsRight = this.coordsRight;

                // Get the text configuration
                var textConf = RG.getTextConf({
                    object: this,
                    prefix: 'chart.labels.above'
                });

            // Draw the left sides above labels
            for (var i=0,seq=0; i<coordsLeft.length; ++i, ++seq) {

                if (typeof this.left[i] == 'number') {

                    var coords = this.coords[seq];

                    RG.text2(this, {
                        
                        font:   textConf.font,
                        size:   textConf.size,
                        bold:   textConf.bold,
                        italic: textConf.italic,
                        color:  textConf.color,

                        x:      coords[0] - 5,
                        y:      coords[1] + (coords[3] / 2),
                        text:   typeof prop['chart.labels.above.formatter'] === 'function' ? prop['chart.labels.above.formatter'](this, this.left[i]) : RG.numberFormat({
                            object:    this,
                            number:    this.left[i].toFixed(typeof prop['chart.labels.above.decimals'] === 'number' ? prop['chart.labels.above.decimals'] : 0),
                            unitspre:  prop['chart.labels.above.units.pre'],
                            unitspost: prop['chart.labels.above.units.post']
                        }),
                        valign: 'center',
                        halign: 'right',
                        tag:     'labels.above'
                    });



                    


                // A grouped or stacked chart
                } else if (typeof this.left[i] === 'object') {

                    // Loop through the group

                    for (var j=0; j<this.left[i].length; ++j,++seq) {

                        // Stacked charts only show the above label on the last
                        // segment of the bar
                        if (prop['chart.grouping'] === 'stacked' && j !== (this.left[i].length - 1) ) {
                            continue;
                        }


                        var coords = coordsLeft[seq];


                        RG.text2(this, {
                        
                            font:   textConf.font,
                            size:   textConf.size,
                            bold:   textConf.bold,
                            italic: textConf.italic,
                            color:  textConf.color,

                            x:      coords[0] - 5,
                            y:      coords[1] + (coords[3] / 2),
                            text:   typeof prop['chart.labels.above.formatter'] === 'function' ? prop['chart.labels.above.formatter'](this, this.left[i][j]) : RG.numberFormat({
                                object:    this,
                                number:    RG.isNull(this.left[i][j]) || isNaN(this.left[i][j]) ? '' : (prop['chart.grouping'] === 'stacked' ? RG.arraySum(this.left[i]): Number(this.left[i][j])).toFixed(typeof prop['chart.labels.above.decimals'] === 'number' ? prop['chart.labels.above.decimals'] : 0),
                                unitspre:  prop['chart.labels.above.units.pre'],
                                unitspost: prop['chart.labels.above.units.post']
                            }),
                            valign: 'center',
                            halign: 'right',
                            tag:     'labels.above'
                        });
                    }
                    
                    seq--;
                }
            }







            // Draw the right sides above labels
            for (i=0,seq=0; i<coordsRight.length; ++i,++seq) {

                if (typeof this.right[i] === 'number') {

                    var coords = coordsRight[seq];

                    RG.text2(this, {
                        
                        font:   textConf.font,
                        size:   textConf.size,
                        bold:   textConf.bold,
                        italic: textConf.italic,
                        color:  textConf.color,

                        x:          coords[0] + coords[2] + 5 + (prop['chart.variant'] === '3d' ? 10 : 0),
                        y:          coords[1] + (coords[3] / 2) + (prop['chart.variant'] === '3d' ? -5 : 0),
                        text:       typeof prop['chart.labels.above.formatter'] === 'function' ? prop['chart.labels.above.formatter'](this, this.right[i]) : RG.numberFormat({
                                        object:    this,
                                        number:    this.right[i].toFixed(typeof prop['chart.labels.above.decimals'] === 'number' ? prop['chart.labels.above.decimals'] : 0),
                                        unitspre:  prop['chart.labels.above.units.pre'],
                                        unitspost: prop['chart.labels.above.units.post']
                                    }),
                        valign:     'center',
                        halign:     'left',
                        tag:        'labels.above'
                    });





                // A grouped/stacked chart
                } else if (typeof this.right[i] === 'object') {

                    // Loop through the group
                    for (var j=0; j<this.right[i].length; ++j,++seq) {

                        // Stacked charts only show the above label on the last
                        // segment of the bar
                        if (prop['chart.grouping'] === 'stacked' && j !== (this.right[i].length - 1)) {
                            continue;
                        }

                        var coords = coordsRight[seq];

                        RG.text2(this, {
                        
                            font:   textConf.font,
                            size:   textConf.size,
                            bold:   textConf.bold,
                            italic: textConf.italic,
                            color:  textConf.color,

                            x:      coords[0] + coords[2] + 5 + (prop['chart.variant'] === '3d' ? 10 : 0),
                            y:      coords[1] + (coords[3] / 2) + (prop['chart.variant'] === '3d' ? -5 : 0),
                            text:   typeof prop['chart.labels.above.formatter'] === 'function' ? prop['chart.labels.above.formatter'](this, this.right[i][j]) : RG.numberFormat({
                                        object:    this,
                                        number:    RG.isNull(this.right[i][j]) || isNaN(this.right[i][j]) ? '' : prop['chart.grouping'] === 'stacked' ? RG.arraySum(this.right[i]).toFixed(prop['chart.labels.above.decimals']) : Number(this.right[i][j]).toFixed(typeof prop['chart.labels.above.decimals'] === 'number' ? prop['chart.labels.above.decimals'] : 0),
                                        unitspre:  prop['chart.labels.above.units.pre'],
                                        unitspost: prop['chart.labels.above.units.post']
                                    }),
                            valign: 'center',
                            halign: 'left',
                            tag:     'labels.above'
                        });
                    }
                    
                    --seq;
                }
            }
        };








        /**
        * Draws the titles
        */
        this.drawTitles =
        this.DrawTitles = function ()
        {
            // Get the text configuration
            var textConf = RG.getTextConf({
                object: this,
                prefix: 'chart.title.left'
            });

            // Draw the left title
            if (typeof prop['chart.title.left'] === 'string') {
                RG.text2(this, {
                        
                    font:   textConf.font,
                    size:   textConf.size,
                    bold:   textConf.bold,
                    italic: textConf.italic,
                    color:  textConf.color,

                    x:      this.marginLeft + 5,
                    y:      this.marginTop - 5,
                    text:   prop['chart.title.left'],
                    halign:'left',
                    valign: 'bottom',
                    tag:    'title.left'
                });
            }

            // Get the text configuration
            var textConf = RG.getTextConf({
                object: this,
                prefix: 'chart.title.right'
            });

            // Draw the right title
            if (typeof prop['chart.title.right'] === 'string') {
                RG.text2(this, {
                        
                    font:   textConf.font,
                    size:   textConf.size,
                    bold:   textConf.bold,
                    italic: textConf.italic,
                    color:  textConf.color,

                    x:      ca.width - this.marginRight - 5,
                    y:      this.marginTop - 5,
                    text:   prop['chart.title.right'],
                    halign: 'right',
                    valign: 'bottom',
                    tag:    'title.right'
                });
            }


            // Draw the main title for the whole chart
            if (typeof prop['chart.title'] === 'string') {
                RG.drawTitle(
                    this,
                    prop['chart.title'],
                    this.marginTop,
                    null,
                    typeof prop['chart.title.size'] === 'number' ? prop['chart.title.size'] : null
                );
            }
        };








        /**
        * Returns the appropriate focussed bar coordinates
        * 
        * @param e object The event object
        */
        this.getShape = 
        this.getBar = function (e)
        {
            var canvas  = this.canvas,
                context = this.context,
                mouseXY = RG.getMouseXY(e)

            /**
            * Loop through the bars determining if the mouse is over a bar
            */
            for (var i=0; i<this.coords.length; i++) {

                var mouseX = mouseXY[0],
                    mouseY = mouseXY[1],
                    left   = this.coords[i][0],
                    top    = this.coords[i][1],
                    width  = this.coords[i][2],
                    height = this.coords[i][3]


                if (prop['chart.variant'] === '3d') {
                    pa2(co,
                        'b r % % % %',
                        left,
                        top,
                        width,
                        height
                    );

                    var over = co.isPointInPath(mouseX, mouseY);
                } else {
                    var over =  (mouseX >= left && mouseX <= (left + width) && mouseY >= top && mouseY <= (top + height) );
                }
                
                
                // Is the mouse cursor over a shape?
                if (over) {

                    var tooltip = RG.parseTooltipText(prop['chart.tooltips'], i);

                    return {
                        0: this,
                        1: left,
                        2: top,
                        3: width,
                        4: height,
                        5: i,
                        
                        object: this,
                             x: left,
                             y: top,
                         width: width,
                        height: height,
                         index: i,
                       tooltip: tooltip
                    };
                }
            }
    
            return null;
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
                RG.Highlight.Rect(this, shape);
            }
        };








        /**
        * When you click on the canvas, this will return the relevant value (if any)
        * 
        * REMEMBER This function will need updating if the Bipolar ever gets chart.ymin
        * 
        * @param object e The event object
        */
        this.getValue = function (e)
        {
            var obj     = e.target.__object__;
            var mouseXY = RG.getMouseXY(e);
            var mouseX  = mouseXY[0];
            
            /**
            * Left hand side
            */
            if (mouseX > this.marginLeft && mouseX < ( (ca.width / 2) - (prop['chart.margin.center'] / 2) )) {
                var value = (mouseX - prop['chart.margin.left']) / this.axisWidth;
                    value = this.max - (value * this.max);
            }
            
            /**
            * Right hand side
            */
            if (mouseX < (ca.width -  this.marginRight) && mouseX > ( (ca.width / 2) + (prop['chart.margin.center'] / 2) )) {
                var value = (mouseX - prop['chart.margin.left'] - this.axisWidth - prop['chart.margin.center']) / this.axisWidth;
                    value = (value * this.max);
            }
            
            return value;
        };








        /**
        * The getObjectByXY() worker method. Don't call this call:
        * 
        * RGraph.ObjectRegistry.getObjectByXY(e)
        * 
        * @param object e The event object
        */
        this.getObjectByXY = function (e)
        {
            var mouseXY = RG.getMouseXY(e);

            // Adjust the mouse Y coordinate for when the bar chart is
            // a 3D variant
            //
            // 4/9/17
            //
            // Don't need this - breaks tooltips when in 3D mode
            //
            //if (prop['chart.variant'] === '3d') {
            //    var adjustment = prop['chart.variant.threed.angle'] * mouseXY[0];
            //    mouseXY[1] -= adjustment;
            //}



            if (
                   mouseXY[0] > prop['chart.margin.left']
                && mouseXY[0] < (ca.width - prop['chart.margin.right'])
                && mouseXY[1] > prop['chart.margin.top']
                && mouseXY[1] < (ca.height - prop['chart.margin.bottom'])
                ) {
    
                return this;
            }
        };








        /**
        * Returns the X coords for a value. Returns two coords because there are... two scales.
        * 
        * @param number value The value to get the coord for
        */
        this.getXCoord = function (value)
        {
            if (value > this.max || value < 0) {
                return null;
            }
    
            var ret = [];
            
            // The offset into the graph area
            var offset = ((value / this.max) * this.axisWidth);
            
            // Get the coords (one fo each side)
            ret[0] = (this.marginLeft + this.axisWidth) - offset;
            ret[1] = (ca.width - this.marginRight - this.axisWidth) + offset;
            
            return ret;
        };








        /**
        * This allows for easy specification of gradients
        */
        this.parseColors = function ()
        {
            // Save the original colors so that they can be restored when the canvas is reset
            if (this.original_colors.length === 0) {
                this.original_colors['chart.colors']           = RG.arrayClone(prop['chart.colors']);
                this.original_colors['chart.highlight.stroke'] = RG.arrayClone(prop['chart.highlight.fill']);
                this.original_colors['chart.highlight.fill']   = RG.arrayClone(prop['chart.highlight.fill']);
                this.original_colors['chart.axes.color']       = RG.arrayClone(prop['chart.axes.color']);
                this.original_colors['chart.colors.stroke']    = RG.arrayClone(prop['chart.colors.stroke']);
            }

            var props = this.properties;
            var colors = props['chart.colors'];
    
            for (var i=0; i<colors.length; ++i) {
                colors[i] = this.parseSingleColorForGradient(colors[i]);
            }
            
            props['chart.highlight.stroke'] = this.parseSingleColorForGradient(props['chart.highlight.stroke']);
            props['chart.highlight.fill']   = this.parseSingleColorForGradient(props['chart.highlight.fill']);
            props['chart.axes.color']       = this.parseSingleColorForGradient(props['chart.axes.color']);
            props['chart.color.stroke']     = this.parseSingleColorForGradient(props['chart.colors.stroke']);
        };








        /**
        * Use this function to reset the object to the post-constructor state. Eg reset colors if
        * need be etc
        */
        this.reset = function ()
        {
        };








        /**
        * This parses a single color value
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
                var grad = co.createLinearGradient(prop['chart.margin.left'],0,ca.width - prop['chart.margin.right'],0);
    
                var diff = 1 / (parts.length - 1);
    
                grad.addColorStop(0, RG.trim(parts[0]));
    
                for (var j=1; j<parts.length; ++j) {
                    grad.addColorStop(j * diff, RG.trim(parts[j]));
                }
            }
                
            return grad ? grad : color;
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








        //
        // Draw the background grid
        //
        this.drawBackgroundGrid = function ()
        {
            if (prop['chart.background.grid']) {

                var variant   = prop['chart.variant'],
                    color     = prop['chart.background.grid.color'],
                    numvlines = prop['chart.xaxis.labels.count'], // TODO Should this be based on the data - not the labels...?
                    numhlines = this.left.length,
                    vlines    = prop['chart.background.grid.vlines'],
                    hlines    = prop['chart.background.grid.hlines'],
                    linewidth = prop['chart.background.grid.linewidth'];
                
                // Autofit
                if (typeof prop['chart.background.grid.hlines.count'] === 'number') {
                    numhlines = prop['chart.background.grid.hlines.count'];
                }

                if (typeof prop['chart.background.grid.vlines.count'] === 'number') {
                    numvlines = prop['chart.background.grid.vlines.count'];
                }
                
                co.lineWidth = linewidth;
                
                // If it's a bar and 3D variant, translate
                if (variant == '3d') {
                    co.save();
                    co.translate(
                        prop['chart.variant.threed.offsetx'],
                        -1 * prop['chart.variant.threed.offsety']
                    );
                }

                // Draw vertical grid lines for the left side
                if (vlines) {
                    for (var i=0; i<=numvlines; i+=1) {
                        pa2(co,
                            'b m % % l % % s %',
                            this.marginLeft + (this.axisWidth / numvlines) * i, this.marginTop,
                            this.marginLeft + (this.axisWidth / numvlines) * i, this.marginTop + this.axisHeight,
                            color
                        );

                    }
                }
                
                // Draw horizontal grid lines for the left side
                if (hlines) {
                    for (var i=0; i<=numhlines; i+=1) {
                        pa2(co,
                            'b m % % l % % s %',
                            this.marginLeft, this.marginTop + (this.axisHeight / numhlines) * i,
                            this.marginLeft + this.axisWidth, this.marginTop + (this.axisHeight / numhlines) * i,
                            color
                        );
                    }
                }
    
                
                // Draw vertical grid lines for the right side
                if (vlines) {
                    for (var i=0; i<=numvlines; i+=1) {
                        pa2(co,
                            'b m % % l % % s %',
                            this.marginLeft + this.marginCenter + this.axisWidth + (this.axisWidth / numvlines) * i, this.marginTop,
                            this.marginLeft + this.marginCenter + this.axisWidth + (this.axisWidth / numvlines) * i, this.marginTop + this.axisHeight,
                            color
                        );
                    }
                }
                
                // Draw horizontal grid lines for the right side
                if (hlines) {
                    for (var i=0; i<=numhlines; i+=1) {
                        pa2(co,
                            'b m % % l % % s %',
                            this.marginLeft + this.axisWidth + this.marginCenter, this.marginTop + (this.axisHeight / numhlines) * i,
                            this.marginLeft + this.axisWidth + this.marginCenter + this.axisWidth, this.marginTop + (this.axisHeight / numhlines) * i,
                            color
                        );
                    }
                }
                
                
                // If it's a bar and 3D variant, translate
                if (variant == '3d') {
                    co.restore();
                }
            }
        };








        /**
        * This function runs once only
        * (put at the end of the file (before any effects))
        */
        this.firstDrawFunc = function ()
        {
        };








        //
        // Calulate the center margin size
        //
        this.getGutterCenter =
        this.getMarginCenter = function ()
        {
            var bold = typeof prop['chart.yaxis.labels.bold'] === 'boolean' ? prop['chart.yaxis.labels.bold'] : prop['chart.text.bold'],
                font = typeof prop['chart.yaxis.labels.font'] === 'string'  ? prop['chart.yaxis.labels.font'] : prop['chart.text.font'],
                size = typeof prop['chart.yaxis.labels.size'] === 'number'  ? prop['chart.yaxis.labels.size'] : prop['chart.text.size'];

            // Loop through the labels measuring them
            for (var i=0,len=0; i<prop['chart.yaxis.labels'].length; ++i) {

                len = ma.max(len, RG.measureText(
                    prop['chart.yaxis.labels'][i],
                    bold,
                    font,
                    size
                )[0]);
            }

            return len + 15;
        };








        /**
        * Objects are now always registered so that when RGraph.Redraw()
        * is called this chart will be redrawn.
        */
        RG.Register(this);




        /**
        * This is the 'end' of the constructor so if the first argument
        * contains configuration dsta - handle that.
        */
        if (parseConfObjectForOptions) {
            RG.parseObjectStyleConfig(this, conf.options);
        }








        /**
        * Grow
        * 
        * The Bipolar chart Grow effect gradually increases the values of the bars
        * 
        * @param object       An object of options - eg: {frames: 30}
        * @param function     A function to call when the effect is complete
        */
        this.grow = function ()
        {
            // Callback
            var opt      = arguments[0] || {},
                frames   = opt.frames || 30,
                frame    = 0,
                callback = arguments[1] || function () {},
                obj      = this;
    
            // Save the data
            var originalLeft  = RG.arrayClone(this.left),
                originalRight = RG.arrayClone(this.right);

    
            // Stop the scale from changing by setting chart.xaxis.scale.max (if it's
            // not already set)
            if (RG.isNull(prop['chart.xaxis.scale.max'])) {
    
                var xmax = 0;
    
                // Get the max values
                this.getMax();

                this.Set('chart.xaxis.scale.max', this.scale2.max);
            }

            var iterator = function ()
            {
                var easingMultiplier = RG.Effects.getEasingMultiplier(frames, frame);

                // Left hand side
                for (var i=0; i<obj.left.length; i+=1) {
                    if (typeof obj.left[i] === 'number') {
                        obj.left[i] = easingMultiplier * originalLeft[i];
                    } else {
                        for (var j=0; j<obj.left[i].length; ++j) {
                            obj.left[i][j] = easingMultiplier * originalLeft[i][j];
                        }
                    }
                }
                
                // Right hand side
                for (var i=0; i<obj.right.length; i+=1) {
                    if (typeof obj.right[i] === 'number') {
                        obj.right[i] = easingMultiplier * originalRight[i];
                    } else {
                        for (var j=0; j<obj.right[i].length; ++j) {
                            obj.right[i][j] = easingMultiplier * originalRight[i][j];
                        }
                    }
                }

                RG.redrawCanvas(obj.canvas);

                // Repeat or call the end function if one is defined
                if (frame < frames) {
                    frame += 1;
                    RG.Effects.updateCanvas(iterator);
                } else {
                    callback(obj);
                }
            };
    
            iterator();
            
            return this;
        };








        /**
        * Bipolar chart Wave effect.
        * 
        * @param object   OPTIONAL An object map of options. You specify 'frames' here to give the number of frames in the effect
        * @param function OPTIONAL A function that will be called when the effect is complete
        */
        this.wave = function ()
        {
            var obj                   = this,
                opt                   = arguments[0] || {};
                opt.frames            =  opt.frames || 120;
                opt.startFrames_left  = [];
                opt.startFrames_right = [];
                opt.counters_left     = [];
                opt.counters_right    = [];

            var framesperbar    = opt.frames / 3,
                frame_left      = -1,
                frame_right     = -1,
                callback        = arguments[1] || function () {},
                original_left   = RG.arrayClone(obj.left),
                original_right  = RG.arrayClone(obj.right);

            for (var i=0,len=obj.left.length; i<len; i+=1) {
                opt.startFrames_left[i]  = ((opt.frames / 3) / (obj.left.length - 1)) * i;
                opt.startFrames_right[i] = ((opt.frames / 3) / (obj.right.length - 1)) * i;
                opt.counters_left[i]     = 0;
                opt.counters_right[i]    = 0;
            }

            // This stops the chart from jumping
            obj.draw();
            obj.set('chart.xaxis.scale.max', obj.scale2.max);
            RG.clear(obj.canvas);


            // Zero all of the data
            for (var i=0,len=obj.left.length; i<len; i+=1) {
                if (typeof obj.left[i] === 'number') obj.left[i] = 0;
                if (typeof obj.right[i] === 'number') obj.right[i] = 0;
            }

            //
            // Iterate over the left side
            //
            function iteratorLeft ()
            {
                ++frame_left;

                for (var i=0,len=obj.left.length; i<len; i+=1) {
                        if (frame_left > opt.startFrames_left[i]) {
                        
                        var isNull = RG.isNull(obj.left[i]);
                        
                        // Regular bars
                        if (typeof obj.left[i] === 'number') {
                            obj.left[i] = ma.min(
                                ma.abs(original_left[i]),
                                ma.abs(original_left[i] * ( (opt.counters_left[i]++) / framesperbar))
                            );
                            
                            // Make the number negative if the original was
                            if (original_left[i] < 0) {
                                obj.left[i] *= -1;
                            }


                            // Stacked or grouped bars
                            } else if (RG.isArray(obj.left[i])) {
                                for (var j=0; j<obj.left[i].length; ++j) {
                                    obj.left[i][j] = ma.min(
                                        ma.abs(original_left[i][j]),
                                        ma.abs(original_left[i][j] * ( (opt.counters_left[i]++) / framesperbar))
                                    );
                                    
                                    // Make the number negative if the original was
                                    if (original_left[i][j] < 0) {
                                        obj.left[i][j] *= -1;
                                    }
                                }
                            }
                            
                            if (isNull) {
                                obj.left[i] = null;
                            }
                        } else {
                            obj.left[i] = typeof obj.left[i] === 'object' && obj.left[i] ? RG.arrayPad([], obj.left[i].length, 0) : (RG.isNull(obj.left[i]) ? null : 0);
                        }

                }


                // No callback here - only called by the right function
                if (frame_left < opt.frames) {
                    RG.redrawCanvas(obj.canvas);
                    RG.Effects.updateCanvas(iteratorLeft);
                }
            }




            //
            // Iterate over the right side
            //
            function iteratorRight ()
            {
                ++frame_right;

                for (var i=0,len=obj.right.length; i<len; i+=1) {
                        if (frame_right > opt.startFrames_right[i]) {
                        
                            var isNull = RG.isNull(obj.right[i]);
                        
                            if (typeof obj.left[i] === 'number') {
                                obj.right[i] = ma.min(
                                    ma.abs(original_right[i]),
                                    ma.abs(original_right[i] * ( (opt.counters_right[i]++) / framesperbar))
                                );
                                
                                // Make the number negative if the original was
                                if (original_right[i] < 0) {
                                    obj.right[i] *= -1;
                                }

                                if (isNull) {
                                    obj.right[i] = null;
                                }
                            } else if (RG.isArray(obj.right[i])) {
                                for (var j=0; j<obj.right[i].length; ++j) {
                                    obj.right[i][j] = ma.min(
                                        ma.abs(original_right[i][j]),
                                        ma.abs(original_right[i][j] * ( (opt.counters_right[i]++) / framesperbar))
                                    );
                                    
                                    // Make the number negative if the original was
                                    if (original_right[i][j] < 0) {
                                        obj.right[i][j] *= -1;
                                    }
                                }
                            }

                        } else {
                            obj.right[i] = typeof obj.right[i] === 'object' && obj.right[i] ? RG.arrayPad([], obj.right[i].length, 0) : (RG.isNull(obj.right[i]) ? null : 0);
                        }
                }


                // No callback here - only called by the right function
                if (frame_right < opt.frames) {
                    RG.redrawCanvas(obj.canvas);
                    RG.Effects.updateCanvas(iteratorRight);
                } else {
                    callback(this);
                }
            }




            iteratorLeft();
            iteratorRight();

            return this;
        };
    };