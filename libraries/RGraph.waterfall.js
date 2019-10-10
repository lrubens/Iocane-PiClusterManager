// version: 2019-01-22
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
    RGraph.Waterfall = function (conf)
    {
        /**
        * Allow for object config style
        */
        if (   typeof conf === 'object'
            && typeof conf.data === 'object'
            && typeof conf.id === 'string') {

            var parseConfObjectForOptions = true; // Set this so the config is parsed (at the end of the constructor)
        
        } else {
        
            var conf = {
                id: conf,
                data: arguments[1]
            };
        }




        this.id                = conf.id;
        this.canvas            = document.getElementById(this.id);
        this.context           = this.canvas.getContext ? this.canvas.getContext("2d") : null;
        this.canvas.__object__ = this;
        this.type              = 'waterfall';
        this.max               = 0;
        this.data              = conf.data;
        this.isRGraph          = true;
        this.coords            = [];
        this.uid               = RGraph.CreateUID();
        this.canvas.uid        = this.canvas.uid ? this.canvas.uid : RGraph.CreateUID();
        this.colorsParsed      = false;
        this.coordsText        = [];
        this.original_colors   = [];
        this.firstDraw         = true; // After the first draw this will be false



        // This is a list of new property names that are used now in place of
        // the old names.
        //
        // *** When adding this list to a new chart library don't forget ***
        // *** the bit of code that also goes in the .set() function     ***
        this.propertyNameAliases = {
            /*
            'chart.yaxis.scale.min':             'chart.ymin',
            'chart.yaxis.scale.max':             'chart.ymax',
            'chart.yaxis.scale.units.post':      'chart.units.post',
            'chart.yaxis.scale.units.pre':       'chart.units.pre',
            'chart.yaxis.scale.zerostart':       'chart.scale.zerostart',
            'chart.yaxis.scale.formatter':       'chart.scale.formatter',
            'chart.yaxis.scale.thousand':        'chart.scale.thousand',
            'chart.yaxis.scale.point':           'chart.scale.point',
            'chart.yaxis.scale.decimals':        'chart.scale.decimals',
            'chart.yaxis.title.align':           'chart.title.yaxis.align',
            'chart.yaxis.title.position':        'chart.title.yaxis.pos',
            'chart.xaxis.title.position':        'chart.title.xaxis.pos',
            'chart.yaxis.title.color':           'chart.title.yaxis.color',
            'chart.yaxis.title.font':            'chart.title.yaxis.font',
            'chart.yaxis.title.size':            'chart.title.yaxis.size',
            'chart.yaxis.title.bold':            'chart.title.yaxis.bold',
            'chart.yaxis.title':                 'chart.title.yaxis',
            'chart.yaxis.title.x':               'chart.title.yaxis.x',
            'chart.yaxis.title.y':               'chart.title.yaxis.y',
            'chart.xaxis.title.y':               'chart.title.xaxis.y',
            'chart.xaxis.title.x':               'chart.title.xaxis.x',
            'chart.xaxis.title.bold':            'chart.title.xaxis.bold',
            'chart.xaxis.title.color':           'chart.title.xaxis.color',
            'chart.xaxis.title.font':            'chart.title.xaxis.font',
            'chart.xaxis.title.size':            'chart.title.xaxis.size',
            'chart.xaxis.title':                 'chart.title.xaxis',
            'chart.yaxis.tickmarks.count':       'chart.numyticks',
            'chart.yaxis.labels.offsety':        'chart.ylabels.offsety',
            'chart.yaxis.labels.offsetx':        'chart.ylabels.offsetx',
            'chart.yaxis.labels.count':          'chart.ylabels.count',
            'chart.xaxis.labels.offsety':        'chart.labels.offsety',
            'chart.xaxis.labels.offsetx':        'chart.labels.offsetx',
            'chart.xaxis.labels.bold':           'chart.labels.bold',
            'chart.xaxis.labels.color':          'chart.labels.color',
            'chart.xaxis.labels':                'chart.labels',
            'chart.colors.stroke':               'chart.strokestyle',
            'chart.xaxis.position':              'chart.xaxispos',
            'chart.yaxis':                       function (opt) {return {name:'chart.noyaxis',value:!opt.value}},
            'chart.xaxis':                       function (opt) {return {name:'chart.noxaxis',value:!opt.value}},
            'chart.axes':                        function (opt) {return {name:'chart.noaxes',value:!opt.value}},
            'chart.axes.color':                  'chart.axis.color',
            'chart.axes.linewidth':              'chart.axis.linewidth',
            'chart.colors.background':           'chart.background.color',
            'chart.background.grid.align':       'chart.background.grid.align',
            'chart.background.grid.vlines.count':'chart.background.grid.autofit.numvlines',
            'chart.background.grid.hlines.count':'chart.background.grid.autofit.numhlines',
            'chart.background.grid.linewidth':   'chart.background.grid.width',
            'chart.background.bars.count':       'chart.background.barcount',
            'chart.background.bars.color1':      'chart.background.barcolor1',
            'chart.background.bars.color2':      'chart.background.barcolor2',
            'chart.margin.left':                 'chart.gutter.left',
            'chart.margin.right':                'chart.gutter.right',
            'chart.margin.top':                  'chart.gutter.top',
            'chart.margin.bottom':               'chart.gutter.bottom',
            'chart.annotatable.color':           'chart.annotate.color',
            'chart.annotatable.linewidth':       'chart.annotate.linewidth',
            'chart.resizable.handle.background': 'chart.resize.handle.background',
            'chart.key.position.margin.boxed':   'chart.key.position.gutter.boxed'
            /* [NEW]:[OLD] */
        };





        // Various config
        this.properties =
        {
            'chart.background.bars.count':    null,
            'chart.background.bars.color1':   'rgba(0,0,0,0)',
            'chart.background.bars.color2':   'rgba(0,0,0,0)',
            'chart.background.grid':              true,
            'chart.background.grid.autofit':      true,
            'chart.background.grid.autofit.align':true,
            'chart.background.grid.color':  '#ddd',
            'chart.background.grid.linewidth':  1,
            'chart.background.grid.hsize':  20,
            'chart.background.grid.vsize':  20,
            'chart.background.grid.vlines': true,
            'chart.background.grid.hlines': true,
            'chart.background.grid.border': true,
            'chart.background.grid.align': true,
            'chart.background.grid.hlines.count': 5,
            'chart.background.grid.vlines.count': 20,
            'chart.background.image':       null,
            'chart.background.image.stretch': true,
            'chart.background.image.x':     null,
            'chart.background.image.y':     null,
            'chart.background.image.w':     null,
            'chart.background.image.h':     null,
            'chart.background.image.align': null,
            'chart.background.hbars':       null,

            'chart.linewidth':              1,

            'chart.axes':                   true,
            'chart.axes.linewidth':         1,
            'chart.axes.color':             'black',

            'chart.hmargin':                5,

            'chart.colors.stroke':            '#666',
            'chart.colors':                 ['green','red','blue'],
            'chart.colors.sequential':      false,

            'chart.margin.left':            35,
            'chart.margin.right':           35,
            'chart.margin.top':             35,
            'chart.margin.bottom':          35,

            'chart.xaxis':                  true,
            'chart.xaxis.position':         'bottom',
            'chart.xaxis.tickmarks.count':  null,
            'chart.xaxis.title':            '',
            'chart.xaxis.title.pos':        null,
            'chart.xaxis.title.bold':       null,
            'chart.xaxis.title.italic':     null,
            'chart.xaxis.title.size':       null,
            'chart.xaxis.title.font':       null,
            'chart.xaxis.title.color':      null,
            'chart.xaxis.title.x':          null,
            'chart.xaxis.title.y':          null,
            'chart.xaxis.labels':                 [],
            'chart.xaxis.labels.bold':            null,
            'chart.xaxis.labels.color':           null,
            'chart.xaxis.labels.font':            null,
            'chart.xaxis.labels.italic':          null,
            'chart.xaxis.labels.size':            null,
            'chart.xaxis.labels.offsetx':         0,
            'chart.xaxis.labels.offsety':         0,


            'chart.yaxis':                  true,
            'chart.yaxis.tickmarks.count':  10,
            'chart.yaxis.title':            '',
            'chart.yaxis.title.bold':       null,
            'chart.yaxis.title.italic':     null,
            'chart.yaxis.title.size':       null,
            'chart.yaxis.title.font':       null,
            'chart.yaxis.title.color':      null,
            'chart.yaxis.title.pos':        null,
            'chart.yaxis.title.align':      'left',
            'chart.yaxis.title.x':          null,
            'chart.yaxis.title.y':          null,
            'chart.yaxis.labels':                true,
            'chart.yaxis.labels.count':     5,
            'chart.yaxis.labels.offsetx':        0,
            'chart.yaxis.labels.offsety':        0,
            'chart.yaxis.labels.font':           null,
            'chart.yaxis.labels.size':           null,
            'chart.yaxis.labels.color':          null,
            'chart.yaxis.labels.bold':           null,
            'chart.yaxis.labels.italic':         null,
            'chart.yaxis.scale.max':             null,
            'chart.yaxis.scale.min':             0,
            'chart.yaxis.scale.units.pre':              '',
            'chart.yaxis.scale.units.post':             '',
            'chart.yaxis.scale.decimals':         0,
            'chart.yaxis.scale.point':            '.',
            'chart.yaxis.scale.thousand':         ',',
            'chart.yaxis.scale.zerostart':        true,

            'chart.labels.above':                  false,
            'chart.labels.above.font':             null,
            'chart.labels.above.size':             null,
            'chart.labels.above.bold':             null,
            'chart.labels.above.italic':           null,
            'chart.labels.above.color':            null,
            'chart.labels.above.offsetx':          0,
            'chart.labels.above.offsety':          0,
            'chart.labels.above.specific':         null,
            'chart.labels.above.decimals':         0,
            'chart.labels.above.units.pre':        '',
            'chart.labels.above.units.post':       '',
            'chart.labels.above.point':            '.',
            'chart.labels.above.thousand':         ',',
            'chart.labels.above.formatter':        null,
            'chart.labels.above.total.italic':     null,
            'chart.labels.above.total.bold':       null,
            'chart.labels.above.total.size':       null,
            'chart.labels.above.total.font':       null,
            'chart.labels.above.total.color':      null,
            'chart.labels.above.total.decimals':   null,
            'chart.labels.above.total.units.pre':  null,
            'chart.labels.above.total.units.post': null,
            'chart.labels.above.total.point':      null,
            'chart.labels.above.total.thousand':   null,
            'chart.labels.above.total.formatter':  null,

            'chart.text.color':             'black',
            'chart.text.size':              12,
            'chart.text.font':              'Arial, Verdana, sans-serif',
            'chart.text.bold':              false,
            'chart.text.italic':            false,
            'chart.text.angle':             0,
            'chart.text.accessible':               true,
            'chart.text.accessible.overflow':      'visible',
            'chart.text.accessible.pointerevents': false,


            'chart.title':                  '',
            'chart.title.color':            'black',
            'chart.title.background':       null,
            'chart.title.hpos':             null,
            'chart.title.vpos':             null,
            'chart.title.bold':             null,
            'chart.title.font':             null,
            'chart.title.size':             null,
            'chart.title.italic':             null,
            'chart.title.color':             null,
            'chart.title.x':                null,
            'chart.title.y':                null,
            'chart.title.halign':           null,
            'chart.title.valign':           null,


            'chart.shadow':                 false,
            'chart.shadow.color':           '#666',
            'chart.shadow.offsetx':         3,
            'chart.shadow.offsety':         3,
            'chart.shadow.blur':            3,

            'chart.tooltips':               null,
            'chart.tooltips.effect':        'fade',
            'chart.tooltips.css.class':     'RGraph_tooltip',
            'chart.tooltips.event':         'onclick',
            'chart.tooltips.highlight':     true,
            'chart.tooltips.override':     null,

            'chart.highlight.stroke':       'rgba(0,0,0,0)',
            'chart.highlight.fill':         'rgba(255,255,255,0.7)',

            'chart.contextmenu':            null,

            'chart.crosshairs':             false,
            'chart.crosshairs.color':       '#333',
            'chart.crosshairs.hline':       true,
            'chart.crosshairs.vline':       true,

            'chart.annotatable':            false,
            'chart.annotatable.linewidth':  1,
            'chart.annotatable.color':      'black',

            'chart.resizable':                   false,
            'chart.resizable.handle.background': null,

            'chart.total':                  true,

            'chart.multiplier.x':           1, // Used for animation
            'chart.multiplier.w':           1, // Used for animation

            'chart.events.click':           null,
            'chart.events.mousemove':       null,

            'chart.key':                    null,
            'chart.key.background':         'white',
            'chart.key.position':           'graph',
            'chart.key.halign':             'right',
            'chart.key.shadow':             false,
            'chart.key.shadow.color':       '#666',
            'chart.key.shadow.blur':        3,
            'chart.key.shadow.offsetx':     2,
            'chart.key.shadow.offsety':     2,
            'chart.key.position.gutter.boxed': false,
            'chart.key.position.x':         null,
            'chart.key.position.y':         null,
            'chart.key.color.shape':        'square',
            'chart.key.rounded':            true,
            'chart.key.linewidth':          1,
            'chart.key.colors':             null,
            'chart.key.interactive':        false,
            'chart.key.interactive.highlight.chart.stroke': '#000',
            'chart.key.interactive.highlight.chart.fill':   'rgba(255,255,255,0.7)',
            'chart.key.interactive.highlight.label':        'rgba(255,0,0,0.2)',
            'chart.key.labels.color':        null,
            'chart.key.labels.font':         null,
            'chart.key.labels.size':         null,
            'chart.key.labels.bold':         null,
            'chart.key.labels.italic':       null,
            'chart.key.labels.offsetx':      0,
            'chart.key.labels.offsety':      0,

            'chart.bar.offsetx':            0, // Used to facilitate multiple dataset Waterfall charts
            'chart.bar.offsety':            0, // Used to facilitate multiple dataset Waterfall charts

            'chart.clearto':                'rgba(0,0,0,0)'
        }

        // Check for support
        if (!this.canvas) {
            alert('[WATERFALL] No canvas support');
            return;
        }
        
        /**
        * Create the $ objects
        * 
        * 2/5/016: Now also use this loop to go through the dat conerting
        * strings to floats
        */
        for (var i=0,len=this.data.length; i<=len; ++i) {
            
            // Create the object for adding event listeners
            this['$' + i] = {}
            
            // Ensure that the data point is numeric
            if (typeof this.data[i] === 'string') {
                this.data[i] = parseFloat(this.data[i]);
            }
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
        * A setter
        * 
        * @param name  string The name of the property to set
        * @param value mixed  The value of the property
        */
        this.set =
        this.Set = function (name, value)
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



            prop[name.toLowerCase()] = value;
    
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

            return prop[name.toLowerCase()];
        };








        /**
        * The function you call to draw the bar chart
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
            * Draw the background image
            */
            RGraph.DrawBackgroundImage(this);



            /**
            * Make the margins easy ro access
            */            
            this.marginLeft   = prop['chart.margin.left'];
            this.marginRight  = prop['chart.margin.right'];
            this.marginTop    = prop['chart.margin.top'];
            this.marginBottom = prop['chart.margin.bottom'];

            /**
            * Stop the coords array from growing uncontrollably
            */
            this.coords = [];



            /**
            * Stop this growing uncontrollably
            */
            this.coordsText = [];




            /**
            * This gets used a lot
            */
            this.centery = ((ca.height - this.marginTop - this.marginBottom) / 2) + this.marginTop;

            /**
            * Work out a few things. They need to be here because they depend on things you can change after you instantiate the object
            */
            this.max            = 0;
            this.grapharea      = ca.height - this.marginTop - this.marginBottom;
            this.graphwidth     = ca.width - this.marginLeft - this.marginRight;
            this.halfTextHeight = prop['chart.text.size'] / 2;
    
    
            /**
            * Work out the maximum value
            */
            this.max     = this.getMax(this.data);

            var decimals = prop['chart.yaxis.scale.decimals'];

            this.scale2 = RG.getScale2(this, {
                'scale.max':          typeof(prop['chart.yaxis.scale.max']) == 'number' ? prop['chart.yaxis.scale.max'] : this.max,
                'scale.min':          prop['chart.yaxis.scale.min'],
                'scale.strict':       typeof(prop['chart.yaxis.scale.max']) === 'number' ? true : false,
                'scale.decimals':     Number(decimals),
                'scale.point':        prop['chart.yaxis.scale.point'],
                'scale.thousand':     prop['chart.yaxis.scale.thousand'],
                'scale.round':        prop['chart.yaxis.scale.round'],
                'scale.units.pre':    prop['chart.yaxis.scale.units.pre'],
                'scale.units.post':   prop['chart.yaxis.scale.units.post'],
                'scale.labels.count': prop['chart.yaxis.labels.count']
            });

            this.max = this.scale2.max;
            this.min = this.scale2.min;
    
            // Draw the background hbars
            RG.drawBars(this)

            // Progressively Draw the chart
            RG.Background.draw(this);
    
            this.DrawAxes();
            this.Drawbars();
            this.DrawLabels();
            
            /**
            * If the X axis is at the bottom AND ymin is 0 - draw the it
            * again so that it appears "on top" of the bars
            */
            if (   prop['chart.xaxis.position'] === 'bottom'
                && prop['chart.axes']
                && prop['chart.xaxis']
                && prop['chart.yaxis.scale.min'] === 0) {

                co.strokeStyle = prop['chart.axes.color'];
                co.strokeRect(
                    prop['chart.margin.left'],
                    ca.height - this.marginBottom,
                    ca.width - this.marginLeft - this.marginRight,
                    0
                );
            }
    
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
            
            
            // Draw a key if necessary
            if (prop['chart.key'] && prop['chart.key'].length) {
                RG.DrawKey(this, prop['chart.key'], prop['chart.colors']);
            }


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
        * Draws the charts axes
        */
        this.drawAxes =
        this.DrawAxes = function ()
        {
            if (!prop['chart.axes']) {
                return;
            }
    
            co.beginPath();
            co.strokeStyle = prop['chart.axes.color'];
            co.lineWidth   = prop['chart.axes.linewidth'] + 0.001;
    
            // Draw the Y axis
            if (prop['chart.yaxis']) {
                co.moveTo(ma.round(this.marginLeft), this.marginTop);
                co.lineTo(ma.round(this.marginLeft), ca.height - this.marginBottom);
            }

            // Draw the X axis
            if (prop['chart.xaxis']) {
                // Center X axis
                if (prop['chart.xaxis.position'] == 'center') {
                    co.moveTo(this.marginLeft, ma.round( ((ca.height - this.marginTop - this.marginBottom) / 2) + this.marginTop));
                    co.lineTo(ca.width - this.marginRight, ma.round( ((ca.height - this.marginTop - this.marginBottom) / 2) + this.marginTop));
                } else {
                
                    var y = ma.floor(this.getYCoord(0));

                    co.moveTo(this.marginLeft, y);
                    co.lineTo(ca.width - this.marginRight, y);
                }
            }

            var numYTicks = prop['chart.yaxis.tickmarks.count'];
    
            // Draw the Y tickmarks
            if (   prop['chart.yaxis']
                && prop['chart.yaxis.tickmarks.count'] > 0
               ) {
    
                var yTickGap = (ca.height - this.marginTop - this.marginBottom) / numYTicks;
        
                for (y=this.marginTop; y < (ca.height - this.marginBottom); y += yTickGap) {
                    if (prop['chart.xaxis.position'] == 'bottom' || (y != ((ca.height - this.marginTop - this.marginBottom) / 2) + this.marginTop)) {
                        co.moveTo(this.marginLeft, ma.round( y));
                        co.lineTo(this.marginLeft - 3, ma.round( y));
                    }
                }

                /**
                * If the X axis is not being shown, draw an extra tick
                */
                if (   !prop['chart.xaxis']
                    || prop['chart.xaxis.position'] == 'center'
                    || prop['chart.yaxis.scale.min'] !== 0
                   ) {
                    co.moveTo(this.marginLeft - 3, Math.round(ca.height - this.marginBottom));
                    co.lineTo(this.marginLeft, Math.round(ca.height - this.marginBottom));
                }
            }


            // Draw the X tickmarks
            if (prop['chart.xaxis.tickmarks.count'] == null) {
                prop['chart.xaxis.tickmarks.count'] = this.data.length + (prop['chart.total'] ? 1 : 0)
            }
    
            if (prop['chart.xaxis'] && prop['chart.xaxis.tickmarks.count'] > 0) {
    
                xTickGap = (ca.width - this.marginLeft - this.marginRight ) / prop['chart.xaxis.tickmarks.count'];
                
                if (prop['chart.xaxis.position'] == 'center') {
                    yStart   = ((ca.height - this.marginBottom - this.marginTop) / 2) + this.marginTop - 3;
                    yEnd     = ((ca.height - this.marginBottom - this.marginTop) / 2) + this.marginTop + 3;
                } else {
                    yStart   = this.getYCoord(0) - (this.scale2.min < 0 ? 3 : 0);
                    yEnd     = this.getYCoord(0) + 3;
                }
        
                for (x=this.marginLeft + xTickGap; x<=ca.width - this.marginRight + 1; x+=xTickGap) {
                    co.moveTo(ma.round(x), yStart);
                    co.lineTo(ma.round(x), yEnd);
                }
                
                if (!prop['chart.yaxis']) {
                    co.moveTo(ma.round( this.marginLeft), yStart);
                    co.lineTo(ma.round( this.marginLeft), yEnd);
                }
            }
    
            /**
            * If the Y axis is not being shown, draw an extra tick
            */
            if (!prop['chart.yaxis'] && prop['chart.xaxis']) {
                co.moveTo(ma.round(this.marginLeft), this.getYCoord(0));
                co.lineTo(ma.round(this.marginLeft), this.getYCoord(0));
            }
    
            co.stroke();
        };








        /**
        * Draws the labels for the graph
        */
        this.drawLabels =
        this.DrawLabels = function ()
        {
            var context    = co,
                numYLabels = 5, // TODO Make this configurable
                interval   = this.grapharea / numYLabels,
                italic     = prop['chart.text.italic'],
                bold       = prop['chart.text.bold'],
                font       = prop['chart.text.font'],
                size       = prop['chart.text.size'],
                color      = prop['chart.text.color'],
                units_pre  = prop['chart.yaxis.scale.units.pre'],
                units_post = prop['chart.yaxis.scale.units.post'],
                offsetx    = prop['chart.yaxis.labels.offsetx'],
                offsety    = prop['chart.yaxis.labels.offsety'];
            
            co.beginPath();
            co.fillStyle = color;

            var textConf = RG.getTextConf({
                object: this,
                prefix: 'chart.yaxis.labels'
            });
    
            /**
            * First, draw the Y labels
            */
            if (prop['chart.yaxis.labels']) {
                if (prop['chart.xaxis.position'] == 'center') {
    
                    var halfInterval = interval / 2;
                    var halfWay      = ((ca.height - this.marginTop - this.marginBottom) / 2) + this.marginTop;

                    for (var i=0,len=this.scale2.labels.length; i<len; ++i) {
                        RG.text2(this, {
                
                         font: textConf.font,
                         size: textConf.size,
                        color: textConf.color,
                         bold: textConf.bold,
                       italic: textConf.italic,

                            x:      this.marginLeft - 5 + offsetx,
                            y:      this.marginTop + (((this.grapharea/2) / len) * i) + offsety,
                            text:   this.scale2.labels[len - i - 1],
                            valign: 'center',
                            halign: 'right',
                            tag:    'scale'
                        });
                        
                        RG.text2(this, {
                
                         font: textConf.font,
                         size: textConf.size,
                        color: textConf.color,
                         bold: textConf.bold,
                       italic: textConf.italic,

                            x:      this.marginLeft - 5 + offsetx,
                            y:      halfWay + (((this.grapharea/2) / len) * (i + 1)) + offsety,
                            text:   this.scale2.labels[i],
                            valign: 'center',
                            halign: 'right',
                            tag:    'scale'
                        });
                    }
                    
                    // Draw zero if required
                    if (prop['chart.yaxis.scale.zerostart']) {
                        RG.text2(co, {

                         font: textConf.font,
                         size: textConf.size,
                        color: textConf.color,
                         bold: textConf.bold,
                       italic: textConf.italic,

                            x:      this.marginLeft - 5 + offsetx,
                            y:      halfWay,
                            text:   '0',
                            valign: 'center',
                            halign: 'right',
                            tag:    'scale'
                        });
                    }

                } else {

                    for (var i=0,len=this.scale2.values.length; i<len; ++i) {

                        var y = this.getYCoord(this.scale2.values[i]) + offsety;

                        RG.text2(this, {

                         font: textConf.font,
                         size: textConf.size,
                        color: textConf.color,
                         bold: textConf.bold,
                       italic: textConf.italic,

                            x:      this.marginLeft - 5 + offsetx,
                            y:      y,
                            text:   this.scale2.labels[i],
                            valign: 'center',
                            halign: 'right',
                            tag:    'scale'
                        });
                    }


                    // Draw zero if required
                    if (prop['chart.yaxis.scale.zerostart'] || prop['chart.yaxis.scale.min'] !== 0) {

                        RG.text2(co, {

                         font: textConf.font,
                         size: textConf.size,
                        color: textConf.color,
                         bold: textConf.bold,
                       italic: textConf.italic,
                            
                            x:      this.marginLeft - 5 + offsetx,
                            y:      this.getYCoord(prop['chart.yaxis.scale.min'] || 0),
                            text:   RG.numberFormat({
                                        object:    this,
                                        number:    String(Number(prop['chart.yaxis.scale.min'] || 0).toFixed(prop['chart.yaxis.scale.min'] === 0 ? 0 : prop['chart.yaxis.scale.decimals'])),
                                        unitspre:  prop['chart.yaxis.scale.units.pre'],
                                        unitspost: prop['chart.yaxis.scale.units.post']
                                    }),
                            valign: 'center',
                            halign: 'right',
                            tag:    'scale'
                        });
                    }
                }
            }
    
    
    

            // Now, draw the X axis labels
            if (prop['chart.xaxis.labels'].length > 0) {
            
                // Recalculate the interval for the X labels
                interval = (ca.width - this.marginLeft - this.marginRight) / prop['chart.xaxis.labels'].length;
                
                var halign = 'center',
                    valign = 'top',
                    angle  = prop['chart.text.angle'];
                
                if (angle) {
                    halign = 'right';
                    angle *= -1;
                }
    
                var labels      = prop['chart.xaxis.labels'],
                    offsetx     = prop['chart.xaxis.labels.offsetx'],
                    offsety     = prop['chart.xaxis.labels.offsety'];

                var textConf = RG.getTextConf({
                    object: this,
                    prefix: 'chart.xaxis.labels'
                });

                for (var i=0,len=labels.length; i<len; i+=1) {
                    RG.text2(this, {
                     
                     font: textConf.font,
                     size: textConf.size,
                    color: textConf.color,
                     bold: textConf.bold,
                   italic: textConf.italic,
   
                        x:      this.marginLeft + (i * interval) + (interval / 2) + offsetx,
                        y:      ca.height - this.marginBottom + this.halfTextHeight + offsety,
                        text:   labels[i],
                        valign: valign,
                        halign: halign,
                        angle:  angle,
                        tag:    'labels'
                    });
                }
            }
            
            co.stroke();
            co.fill();




            //
            // Draw the labelsAbove labels
            //
            if (prop['chart.labels.above']) {
                this.drawLabelsAbove();
            }
        };








        //
        // This function draws all of the above labels
        //
        this.drawLabelsAbove = function ()
        {
            var data      = this.data,
                unitsPre  = prop['chart.labels.above.units.pre'],
                unitsPost = prop['chart.labels.above.units.post'],
                decimals  = prop['chart.labels.above.decimals'],
                thousand  = prop['chart.labels.above.thousand'],
                point     = prop['chart.labels.above.point'],
                formatter = prop['chart.labels.above.formatter'];

            var textConf = RG.getTextConf({
                object: this,
                prefix: 'chart.labels.above'
            });

            for (var i=0; i<this.data.length + (prop['chart.total'] ? 1 : 0); ++i) {

                // Is this the "total" column
                if (prop['chart.total'] && i === this.data.length) {
                    var isTotal = true;
                }
                
                // Get the value
                var value = Number(isTotal ? this.total : this.data[i]);
                
                // Determine the color based on whether the value is positive,
                // negative or the total
                if (typeof prop['chart.labels.above.color'] === 'object' && prop['chart.labels.above.color']) {
                    if (isTotal && typeof prop['chart.labels.above.color'][2] === 'string') {
                        color = prop['chart.labels.above.color'][2];
                    } else if (this.data[i] < 0) {
                        color = prop['chart.labels.above.color'][1];
                    } else {
                        color = prop['chart.labels.above.color'][0];
                    }
                }
                
                
                // Do the color handling again if this is the last
                // label (and its an object) but using the
                // labelsAboveLastColor property if it's set
                if (typeof prop['chart.labels.above.total.color'] === 'object' && prop['chart.labels.above.total.color']) {
                    if (   isTotal
                        && typeof prop['chart.labels.above.total.color'][0] === 'string'
                        && typeof prop['chart.labels.above.total.color'][1] === 'string'
                        ) {

                        if (this.total < 0) {
                            color = prop['chart.labels.above.total.color'][1];
                        } else {
                            color = prop['chart.labels.above.total.color'][0];
                        }
                    }
                }

                var coords = this.coords[i];




                // This code is repeated below for the last label. Temporarily
                // set the point and thousand properies because the numberFormat
                // function is dumb. These properties are reset after the last
                // label has been formatted
                var tmpScaleThousand = prop['chart.yaxis.scale.thousand'],
                    tmpScalePoint    = prop['chart.yaxis.scale.decimal'];

                prop['chart.yaxis.scale.thousand'] = prop['chart.labels.above.thousand'];
                prop['chart.yaxis.scale.point']    = prop['chart.labels.above.point'];

                // Custom formatting or use the numberFormat function
                if (formatter) {
                    var str = (formatter)({
                        object: this,
                        value: value,
                        index: i
                    });
                } else {
                    var str = RG.numberFormat({
                        object:    this,
                        number:    String(value.toFixed(decimals)),
                        unitspre:  unitsPre,
                        unitspost: unitsPost,
                        point:     point,
                        thousand:  thousand
                    });
                }








                // Allow for the styling of the last label
                if (isTotal || i === this.data.length) {

                    if (typeof prop['chart.labels.above.total.font']       === 'string')    textConf.font   = prop['chart.labels.above.total.font'];
                    if (typeof prop['chart.labels.above.total.color']      === 'string')    textConf.color  = prop['chart.labels.above.total.color'];
                    if (typeof prop['chart.labels.above.total.size']       === 'number')    textConf.size   = prop['chart.labels.above.total.size'];
                    if (!RG.isNull(prop['chart.labels.above.total.bold']))                  textConf.bold   = prop['chart.labels.above.total.bold'];
                    if (!RG.isNull(prop['chart.labels.above.total.italic']))                textConf.italic = prop['chart.labels.above.total.italic'];
                    if (typeof prop['chart.labels.above.total.units.pre']  === 'string')    unitsPre        = prop['chart.labels.above.total.units.pre'];
                    if (typeof prop['chart.labels.above.total.units.post'] === 'string')    unitsPost       = prop['chart.labels.above.total.units.post'];
                    if (typeof prop['chart.labels.above.total.decimals']   === 'number')    decimals        = prop['chart.labels.above.total.decimals'];
                    if (typeof prop['chart.labels.above.total.formatter']  === 'function')  formatter       = prop['chart.labels.above.total.formatter'];
                    if (typeof prop['chart.labels.above.total.thousand']   === 'string')    thousand        = prop['chart.labels.above.total.thousand'];
                    if (typeof prop['chart.labels.above.total.point']      === 'string')    point           = prop['chart.labels.above.total.point'];




                    // Custom formatting or use the numberFormat function
                    // This code is repeated just up above
                    if (formatter) {
                        var str = (formatter)({
                            object: this,
                            value: value,
                            index: i
                        });
                    } else {

                        str = RG.numberFormat({
                            object:    this,
                            number:    String(value.toFixed(decimals)),
                            unitspre:  unitsPre,
                            unitspost: unitsPost,
                            point:     point,
                            thousand:  thousand
                        });
                    }



                    // These two variables can now be reset to what they were when we
                    // started
                    prop['chart.yaxis.scale.thousand'] = tmpScaleThousand;
                    prop['chart.yaxis.scale.point']    = tmpScalePoint;
                }

                // Allow for specific labels
                if (   typeof prop['chart.labels.above.specific'] === 'object'
                    && !RG.isNull(prop['chart.labels.above.specific'])
                    && (typeof prop['chart.labels.above.specific'][i] === 'string' || typeof prop['chart.labels.above.specific'][i] === 'number')
                   ) {
                   str = prop['chart.labels.above.specific'][i];
                }


                RG.text2(this, {

                 font: textConf.font,
                 size: textConf.size,
                color: textConf.color,
                 bold: textConf.bold,
               italic: textConf.italic,

                    x:      coords[0] + (coords[2] / 2) + prop['chart.labels.above.offsetx'],
                    y:      (isTotal ? this.total : this.data[i]) >= 0 ? (coords[1] - 3 - prop['chart.labels.above.offsety']) : (coords[1] + coords[3] + 3 + prop['chart.labels.above.offsety']),
                    text:   str,
                    valign: (isTotal ? this.total : this.data[i]) >= 0 ? 'bottom' : 'top',
                    halign: 'center',
                    tag:    'labels.above'
                });
            }
        };








        /**
        * Draws the bars on to the chart
        */
        this.drawbars =
        this.Drawbars = function ()
        {
            var context      = co,
                canvas       = ca,
                hmargin      = prop['chart.hmargin'],
                runningTotal = 0;
    
            co.lineWidth = prop['chart.linewidth'] + 0.001;

            for (var i=0,len=this.data.length,seq=0; i<len; ++i,++seq) {
                
                co.beginPath();
                    
                    co.strokeStyle = prop['chart.colors.stroke'];

                    var x = ma.round( this.marginLeft + hmargin + (((this.graphwidth / (this.data.length + (prop['chart.total'] ? 1 : 0))) * i) * prop['chart.multiplier.x']));
                    
                    // Must be before the y coord calculation
                    var h  = this.getYCoord(0) - this.getYCoord(ma.abs(this.data[i]));

                    
                    
                    // Work out the Y coordinate
                    if (i === 0) {
                        y = this.getYCoord(0) - h;
                    } else {
                        y = this.getYCoord(runningTotal) - h;
                    }
                    y = ma.round(y);
                    




                    var w = ((ca.width - this.marginLeft - this.marginRight) / (this.data.length + (prop['chart.total'] ? 1 : 0 )) ) - (2 * prop['chart.hmargin']);
                        w = w * prop['chart.multiplier.w'];


                    // Adjust the coords for negative values
                    if (this.data[i] < 0) {
                        y += h;
                    }

                    // Color
                    co.fillStyle = this.data[i] >= 0 ? prop['chart.colors'][0] : prop['chart.colors'][1];
                    
                    // Allow for sequential colors
                    if (prop['chart.colors.sequential']) {
                        co.fillStyle = prop['chart.colors'][seq];
                    }

                    
                    if (prop['chart.shadow']) {
                        RG.setShadow(
                            this,
                            prop['chart.shadow.color'],
                            prop['chart.shadow.offsetx'],
                            prop['chart.shadow.offsety'],
                            prop['chart.shadow.blur']
                        );
                    } else {
                        RG.noShadow(this);
                    }

                    //
                    // Draw the bar
                    //
                    co.rect(
                        x + prop['chart.bar.offsetx'],
                        ma.floor(y) + prop['chart.bar.offsety'],
                        w,
                        ma.floor(h)
                    );

                    this.coords.push([x, y, w, h]);
                    


                    runningTotal += this.data[i];

                co.stroke();
                co.fill();
            }

            // Store the total
            this.total = runningTotal;

            if (prop['chart.total']) {

                // This is the height of the final bar
                h = this.getYCoord(0) - this.getYCoord(ma.abs(runningTotal));

                // Set the Y (ie the start point) value
                if (prop['chart.xaxis.position'] == 'center') {
                    y = runningTotal > 0 ? this.getYCoord(0) - h : this.getYCoord(0);
                } else {
                    if (runningTotal > 0) {
                        y = this.getYCoord(0) - h;
                    } else {
                        y = this.getYCoord(0);
                    }
                }
            
                // This is the X position of the final bar
                x = x + (prop['chart.hmargin'] * 2) + w;
            
            
                // Final color
                co.fillStyle = prop['chart.colors'][2];
                
                // Allow for sequential colors
                if (prop['chart.colors.sequential']) {
                    co.fillStyle = prop['chart.colors'][seq]
                }
            
                pa2(co, 'b r % % % % s % f %',
                    x + prop['chart.bar.offsetx'], y + prop['chart.bar.offsety'], w, h,
                    co.strokeStyle,
                    co.fillStyle
                );

                // This is set so that the next iteration of the loop will be able to
                // access THIS iterations coordinates
                var previousCoords = [x, y, w, ma.abs(h)];

                // Add the coordinates to the coords array (the previousCooords array, at
                // this point, is actually THIS iterations coords 
                this.coords.push(previousCoords);
            }





            // Turn off the shadow
            RG.noShadow(this);






            /**
            * This draws the connecting lines
            */
            co.lineWidth   = 1;
            co.strokeStyle = '#666';
            
            co.beginPath();

            for (var i=1,len=this.coords.length; i<len; i+=1) {

                var prev     = this.coords[i - 1],
                    curr     = this.coords[i],
                    prevData = this.data[i-1];

                // CANNOT be a part of the var chain above
                var y = (prevData > 0 ? prev[1] : prev[1] + prev[3]);


                co.moveTo(
                    prev[0] + prev[2] + prop['chart.bar.offsetx'],
                    y + prop['chart.bar.offsety']
                );

                co.lineTo(
                    curr[0] + prop['chart.bar.offsetx'],
                    (prevData > 0 ? prev[1] : prev[1] + prev[3]) + prop['chart.bar.offsety']
                );

            }
            
            co.stroke();
        };








        /**
        * Not used by the class during creating the graph, but is used by event handlers
        * to get the coordinates (if any) of the selected bar
        * 
        * @param object e The event object
        */
        this.getShape =
        this.getBar = function (e)
        {
            /**
            * Loop through the bars determining if the mouse is over a bar
            */
            for (var i=0,len=this.coords.length; i<len; i++) {
    
                var mouseXY = RG.getMouseXY(e),
                    mouseX  = mouseXY[0],
                    mouseY  = mouseXY[1];
    
                var left   = this.coords[i][0],
                    top    = this.coords[i][1],
                    width  = this.coords[i][2],
                    height = this.coords[i][3];
    
                if (   mouseX >= left
                    && mouseX <= (left + width)
                    && mouseY >= top
                    && mouseY <= top + height) {
                    
                    var tooltip = RG.parseTooltipText(prop['chart.tooltips'], i);
    
                    return {
                        0: this,   object: this,
                        1: left,   x:      left,
                        2: top,    y:      top,
                        3: width,  width:  width,
                        4: height, height: height,
                        5: i,      index:  i,
                                   tooltip: tooltip
                    };
                }
            }
            
            return null;
        };








        /**
        * The Waterfall is slightly different to Bar/Line charts so has this function to get the max value
        */
        this.getMax = function (data)
        {
            var runningTotal = 0, max = 0;
    
            for (var i=0,len=data.length; i<len; i+=1) {
                runningTotal += data[i];
                
                max = ma.max(ma.abs(runningTotal), max);
            }

            return ma.abs(max);
        };








        /**
        * This function facilitates the installation of tooltip event listeners if
        * tooltips are defined.
        */
        this.allowTooltips =
        this.AllowTooltips = function ()
        {
            // Preload any tooltip images that are used in the tooltips
            RG.PreLoadTooltipImages(this);
    
    
            /**
            * This installs the window mousedown event listener that lears any
            * highlight that may be visible.
            */
            RG.InstallWindowMousedownTooltipListener(this);
    
    
            /**
            * This installs the canvas mousemove event listener. This function
            * controls the pointer shape.
            */
            RG.InstallCanvasMousemoveTooltipListener(this);
    
    
            /**
            * This installs the canvas mouseup event listener. This is the
            * function that actually shows the appropriate tooltip (if any).
            */
            RG.InstallCanvasMouseupTooltipListener(this);
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
        * The getObjectByXY() worker method. Don't call this call:
        * 
        * RGraph.ObjectRegistry.getObjectByXY(e)
        * 
        * @param object e The event object
        */
        this.getObjectByXY = function (e)
        {
            var mouseXY = RG.getMouseXY(e);
    
            if (
                   mouseXY[0] > this.marginLeft
                && mouseXY[0] < (ca.width - this.marginRight)
                && mouseXY[1] > this.marginTop
                && mouseXY[1] < (ca.height - this.marginBottom)
                ) {

                return this;
            }
        };








        /**
        * This method returns the appropriate Y coord for the given value
        * 
        * @param number value The value
        */
        this.getYCoord = function (value)
        {
            if (prop['chart.xaxis.position'] == 'center') {
    
                if (value < (-1 * this.max)) {
                    return null;
                }
            
                var coord = (value / this.max) * (this.grapharea / 2);    
                return this.marginTop + (this.grapharea / 2) - coord;
            
            } else {

                var coord = ( (value - this.scale2.min) / (this.max - this.scale2.min) ) * this.grapharea;
                    coord = coord + this.marginBottom;

                return ca.height - coord;
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
                this.original_colors['chart.crosshairs.color']       = RG.arrayClone(prop['chart.crosshairs.color']);
                this.original_colors['chart.highlight.stroke']       = RG.arrayClone(prop['chart.highlight.stroke']);
                this.original_colors['chart.highlight.fill']         = RG.arrayClone(prop['chart.highlight.fill']);
                this.original_colors['chart.background.bars.color1'] = RG.arrayClone(prop['chart.background.bars.color1']);
                this.original_colors['chart.background.bars.color2'] = RG.arrayClone(prop['chart.background.bars.color2']);
                this.original_colors['chart.background.grid.color']  = RG.arrayClone(prop['chart.background.grid.color']);
                this.original_colors['chart.colors.stroke']          = RG.arrayClone(prop['chart.colors.stroke']);
                this.original_colors['chart.axes.color']             = RG.arrayClone(prop['chart.axes.color']);
            }


            // chart.colors
            var colors = prop['chart.colors'];

            if (colors) {
                for (var i=0,len=colors.length; i<len; ++i) {
                    colors[i] = this.parseSingleColorForGradient(colors[i]);
                }
            }
    
            // chart.key.colors
            var colors = prop['chart.key.colors'];

            if (colors) {
                for (var i=0,len=colors.length; i<len; ++i) {
                    colors[i] = this.parseSingleColorForGradient(colors[i]);
                }
            }
    
             prop['chart.crosshairs.color']        = this.parseSingleColorForGradient(prop['chart.crosshairs.color']);
             prop['chart.highlight.stroke']        = this.parseSingleColorForGradient(prop['chart.highlight.stroke']);
             prop['chart.highlight.fill']          = this.parseSingleColorForGradient(prop['chart.highlight.fill']);
             prop['chart.background.bars.color1']  = this.parseSingleColorForGradient(prop['chart.background.bars.color1']);
             prop['chart.background.bars.color2']  = this.parseSingleColorForGradient(prop['chart.background.bars.color2']);
             prop['chart.background.grid.color']   = this.parseSingleColorForGradient(prop['chart.background.grid.color']);
             prop['chart.colors.stroke']           = this.parseSingleColorForGradient(prop['chart.colors.stroke']);
             prop['chart.axes.color']              = this.parseSingleColorForGradient(prop['chart.axes.color']);
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
        * 
        * @param string color The color to parse for gradients
        */
        this.parseSingleColorForGradient = function (color)
        {
            if (!color || typeof color != 'string') {
                return color;
            }

            if (typeof color === 'string' && color.match(/^gradient\((.*)\)$/i)) {

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








        /**
        * This function runs once only
        * (put at the end of the file (before any effects))
        */
        this.firstDrawFunc = function ()
        {
        };








        /**
        * Waterfall Grow
        * 
        * @param object Options. You can pass frames here - which should be a number
        * @param function An optional function which is called when the animation is finished
        */
        this.grow = function ()
        {
            var opt      = arguments[0] || {};
            var callback = arguments[1] || function () {};
            var frames   = opt.frames || 30;
            var numFrame = 0;
            var obj      = this;
            var data     = RG.array_clone(obj.data);
            
            //Reset The data to zeros
            for (var i=0,len=obj.data.length; i<len; ++i) {
                obj.data[i] /= frames;
            }
            
            /**
            * Fix the scale
            */
            if (obj.get('chart.yaxis.scale.max') == null) {
                var max   = obj.getMax(data);
                var scale2 = RG.getScale2(obj, {'scale.max':max});
                obj.Set('chart.yaxis.scale.max', scale2.max);
            }

            //obj.Set('chart.multiplier.x', 0);
            //obj.Set('chart.multiplier.w', 0);
    
            function iterator ()
            {
                for (var i=0; i<obj.data.length; ++i) {
                    
                    // This produces a very slight easing effect
                    obj.data[i] = data[i] * RG.Effects.getEasingMultiplier(frames, numFrame);
                }
                
                RG.clear(obj.canvas);
                RG.redrawCanvas(obj.canvas);
    
                if (++numFrame < frames) {
                    RGraph.Effects.updateCanvas(iterator);
                } else {
                    callback(obj);
                }
            }
            
            iterator();
            
            return this;
        };








        /**
        * Now, because canvases can support multiple charts, canvases must always be registered
        */
        RG.register(this);








        /**
        * This is the 'end' of the constructor so if the first argument
        * contains configuration data - handle that.
        */
        if (parseConfObjectForOptions) {
            RG.parseObjectStyleConfig(this, conf.options);
        }




        return this;
    };