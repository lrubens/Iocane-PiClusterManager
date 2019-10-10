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
    * The chart constuctor
    * 
    * @param object canvas
    * @param array data
    */
    RGraph.RScatter =
    RGraph.Rscatter = function (conf)
    {
        /**
        * Allow for object config style
        */
        if (   typeof conf === 'object'
            && typeof conf.data === 'object'
            && typeof conf.id === 'string') {

            var parseConfObjectForOptions = true; // Set this so the config is parsed (at the end of the constructor)

            this.data = new Array(conf.data.length);

           // Store the data set(s)
            this.data = RGraph.arrayClone(conf.data);


            // Account for just one dataset being given
            if (typeof conf.data === 'object' && typeof conf.data[0] === 'object' && typeof conf.data[0][0] === 'number') {
                var tmp = RGraph.arrayClone(conf.data);
                conf.data = new Array();
                conf.data[0] = RGraph.arrayClone(tmp);
                
                this.data = RGraph.arrayClone(conf.data);
            }

        } else {
        
            var conf      = {id: conf};
                conf.data = arguments[1];


            this.data = [];

            // Handle multiple datasets being given as one argument
            if (arguments[1][0] && arguments[1][0][0] && typeof arguments[1][0][0] == 'object') {
                // Store the data set(s)
                for (var i=0; i<arguments[1].length; ++i) {
                    this.data[i] = arguments[1][i];
                }
    
            // Handle multiple data sets being supplied as seperate arguments
            } else {

                // Store the data set(s)
                for (var i=1; i<arguments.length; ++i) {
                    this.data[i - 1] = RGraph.arrayClone(arguments[i]);
                }
            }
        }




        this.id                = conf.id
        this.canvas            = document.getElementById(this.id)
        this.context           = this.canvas.getContext ? this.canvas.getContext("2d") : null;
        this.canvas.__object__ = this;
        this.type              = 'rscatter';
        this.hasTooltips       = false;
        this.isRGraph          = true;
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
            'chart.scale.units.pre':             'chart.units.pre',
            'chart.scale.units.post':            'chart.units.post',
            'chart.margin.left':                 'chart.gutter.left',
            'chart.margin.right':                'chart.gutter.right',
            'chart.margin.top':                  'chart.gutter.top',
            'chart.margin.bottom':               'chart.gutter.bottom',
            'chart.annotatable.color':           'chart.annotate.color',
            'chart.annotatable.linewidth':       'chart.annotate.linewidth',
            'chart.resizable.handle.background': 'chart.resize.handle.background',
            'chart.key.position.margin.boxed':   'chart.key.position.gutter.boxed',
            /* [NEW]:[OLD] */
        };





        this.centerx = 0;
        this.centery = 0;
        this.radius  = 0;
        this.max     = 0;

        // Convert all of the data pieces to numbers
        for (var i=0; i<this.data.length; ++i) {
            for (var j=0; j<this.data[i].length; ++j) {
                if (typeof this.data[i][j][0] === 'string') {
                    this.data[i][j][0] = parseFloat(this.data[i][j][0]);
                }

                if (typeof this.data[i][j][1] === 'string') {
                    this.data[i][j][1] = parseFloat(this.data[i][j][1]);
                }
            }
        }


        this.properties =
        {
            'chart.background.color':               'transparent',
            'chart.background.grid':                true,
            'chart.background.grid.radials':        true,
            'chart.background.grid.radials.count':  null,
            'chart.background.grid.circles':        true,
            'chart.background.grid.circles.count':  null,
            'chart.background.grid.linewidth':      1,
            'chart.background.grid.color':          '#ccc',

            'chart.centerx':                null,
            'chart.centery':                null,
            'chart.radius':                 null,

            'chart.colors':                 [], // This is used internally for the key
            'chart.colors.default':         'black',

            'chart.margin.left':            25,
            'chart.margin.right':           25,
            'chart.margin.top':             25,
            'chart.margin.bottom':          25,

            'chart.title':                  '',
            'chart.title.background':       null,
            'chart.title.hpos':             null,
            'chart.title.vpos':             null,
            'chart.title.bold':             true,
            'chart.title.font':             null,
            'chart.title.size':             null,
            'chart.title.italic':           null,
            'chart.title.color':            null,
            'chart.title.x':                null,
            'chart.title.y':                null,
            'chart.title.halign':           null,
            'chart.title.valign':           null,

            'chart.labels':                 null,
            'chart.labels.color':           null,
            'chart.labels.font':            null,
            'chart.labels.size':            null,
            'chart.labels.italic':          null,
            'chart.labels.bold':            null,
            'chart.labels.axes':            'n',
            'chart.labels.axes.background': 'rgba(255,255,255,0.7)',
            'chart.labels.axes.count':           5,
            'chart.labels.axes.font':            null,
            'chart.labels.axes.size':            null,
            'chart.labels.axes.color':           null,
            'chart.labels.axes.bold':            null,
            'chart.labels.axes.italic':          null,

            'chart.text.color':               'black',
            'chart.text.font':                'Arial, Verdana, sans-serif',
            'chart.text.size':                12,
            'chart.text.bold':                false,
            'chart.text.italic':              false,
            'chart.text.accessible':               true,
            'chart.text.accessible.overflow':      'visible',
            'chart.text.accessible.pointerevents': false,

            'chart.key':                    null,
            'chart.key.background':         'white',
            'chart.key.position':           'graph',
            'chart.key.halign':             'right',
            'chart.key.shadow':             false,
            'chart.key.shadow.color':       '#666',
            'chart.key.shadow.blur':        3,
            'chart.key.shadow.offsetx':     2,
            'chart.key.shadow.offsety':     2,
            'chart.key.position.gutter.boxed':false,
            'chart.key.position.x':         null,
            'chart.key.position.y':         null,
            'chart.key.color.shape':        'square',
            'chart.key.rounded':            true,
            'chart.key.linewidth':          1,
            'chart.key.colors':             null,
            'chart.key.interactive':        false,
            'chart.key.interactive.highlight.chart.fill':'rgba(255,0,0,0.9)',
            'chart.key.interactive.highlight.label':'rgba(255,0,0,0.2)',
            'chart.key.labels.color':          null,
            'chart.key.labels.font':           null,
            'chart.key.labels.size':           null,
            'chart.key.labels.bold':           null,
            'chart.key.labels.italic':         null,
            'chart.key.labels.offsetx':      0,
            'chart.key.labels.offsety':      0,

            'chart.contextmenu':            null,

            'chart.tooltips':               null,
            'chart.tooltips.event':        'onmousemove',
            'chart.tooltips.effect':        'fade',
            'chart.tooltips.css.class':     'RGraph_tooltip',
            'chart.tooltips.highlight':     true,
            'chart.tooltips.hotspot':       3,
            'chart.tooltips.coords.page':   false,

            'chart.annotatable':                 false,
            'chart.annotatable.color':           'black',
            'chart.annotatable.linewidth':        1,

            'chart.resizable':              false,
            'chart.resizable.handle.background': null,

            'chart.scale.max':              null,
            'chart.scale.min':              0, // TODO Not fully implemented
            'chart.scale.decimals':         null,
            'chart.scale.point':            '.',
            'chart.scale.thousand':         ',',
            'chart.scale.round':            false,
            'chart.scale.zerostart':        true,
            'chart.scale.units.pre':        '',
            'chart.scale.units.post':       '',

            'chart.tickmarks':              'cross',
            'chart.tickmarks.size':         3,

            'chart.axes.color':             'transparent',

            'chart.events.mousemove':       null,
            'chart.events.click':           null,

            'chart.highlight.stroke':       'transparent',
            'chart.highlight.fill':         'rgba(255,255,255,0.7)',
            'chart.highlight.point.radius': 3,

            'chart.segment.highlight':       false,
            'chart.segment.highlight.count': null,
            'chart.segment.highlight.fill':  'rgba(0,255,0,0.5)',
            'chart.segment.highlight.stroke':'rgba(0,0,0,0)',

            'chart.line':                    false,
            'chart.line.close':              false,
            'chart.line.linewidth':          1,
            'chart.line.colors':             ['black'],
            'chart.line.shadow':             false,
            'chart.line.shadow.color':       'black',
            'chart.line.shadow.blur':        2,
            'chart.line.shadow.offsetx':     3,
            'chart.line.shadow.offsety':     3,

            'chart.clearto':   'rgba(0,0,0,0)'
        }
        



        /**
        * Create the $ objects so that functions can be added to them
        */

        for (var i=0,idx=0; i<this.data.length; ++i) {
            for (var j=0,len=this.data[i].length; j<len; j+=1,idx+=1) {
                this['$' + idx] = {}
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
        * A simple setter
        * 
        * @param string name  The name of the property to set
        * @param string value The value of the property
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
            * This should be done first - prepend the property name with "chart." if necessary
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
        * A simple getter
        * 
        * @param string name The name of the property to get
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
        * This method draws the rose chart
        */
        this.draw =
        this.Draw = function ()
        {
            /**
            * Fire the onbeforedraw event
            */
            RG.FireCustomEvent(this, 'onbeforedraw');



            /**
            * Make the margins easy ro access
            */            
            this.marginLeft   = prop['chart.margin.left'];
            this.marginRight  = prop['chart.margin.right'];
            this.marginTop    = prop['chart.margin.top'];
            this.marginBottom = prop['chart.margin.bottom'];
    
            // Calculate the radius
            this.radius  = (Math.min(ca.width - this.marginLeft - this.marginRight, ca.height - this.marginTop - this.marginBottom) / 2);
            this.centerx = ((ca.width - this.marginLeft - this.marginRight) / 2) + this.marginLeft;
            this.centery = ((ca.height - this.marginTop - this.marginBottom) / 2) + this.marginTop;
            this.coords  = [];
            this.coords2 = [];



            /**
            * Stop this growing uncontrollably
            */
            this.coordsText = [];




            /**
            * If there's a user specified radius/centerx/centery, use them
            */
            if (typeof(prop['chart.centerx']) == 'number') this.centerx = prop['chart.centerx'];
            if (typeof(prop['chart.centery']) == 'number') this.centery = prop['chart.centery'];
            if (typeof(prop['chart.radius'])  == 'number') this.radius  = prop['chart.radius'];
    
    
    
            /**
            * Parse the colors for gradients. Its down here so that the center X/Y can be used
            */
            if (!this.colorsParsed) {
    
                this.parseColors();
    
                // Don't want to do this again
                this.colorsParsed = true;
            }
    
    
            /**
            * Work out the scale
            */
            var max = prop['chart.scale.max'];
            var min = prop['chart.scalemin'];
            
            if (typeof(max) == 'number') {
                this.max    = max;
                this.scale2 = RG.getScale2(this, {
                    'scale.max':          max,
                    'scale.min':          min,
                    'scale.strict':       true,
                    'scale.decimals':     Number(prop['chart.scale.decimals']),
                    'scale.point':        prop['chart.scale.point'],
                    'scale.thousand':     prop['chart.scale.thousand'],
                    'scale.round':        prop['chart.scale.round'],
                    'scale.units.pre':    prop['chart.scale.units.pre'],
                    'scale.units.post':   prop['chart.scale.units.post'],
                    'scale.labels.count': prop['chart.labels.axes.count']
                });
            } else {
    
                for (var i=0; i<this.data.length; i+=1) {
                    for (var j=0,len=this.data[i].length; j<len; j+=1) {
                        this.max = Math.max(this.max, this.data[i][j][1]);
                    }
                }

                this.min = prop['chart.ymin'];
    
                this.scale2 = RG.getScale2(this, {
                    'scale.max':            this.max,
                    'scale.min':            min,
                    'scale.decimals':     Number(prop['chart.scale.decimals']),
                    'scale.point':        prop['chart.scale.point'],
                    'scale.thousand':     prop['chart.scale.thousand'],
                    'scale.round':        prop['chart.scale.round'],
                    'scale.units.pre':    prop['chart.scale.units.pre'],
                    'scale.units.post':   prop['chart.scale.units.post'],
                    'scale.labels.count': prop['chart.labels.axes.count']
                });
                this.max = this.scale2.max;
            }
    
            /**
            * Change the centerx marginally if the key is defined
            */
            if (prop['chart.key'] && prop['chart.key'].length > 0 && prop['chart.key'].length >= 3) {
                this.centerx = this.centerx - prop['chart.margin.right'] + 5;
            }

            /**
            * Populate the colors array for the purposes of generating the key
            */
            if (typeof prop['chart.key'] === 'object' && RG.isArray(prop['chart.key']) && prop['chart.key'][0]) {

                // Reset the colors array
                prop['chart.colors'] = [];

                for (var i=0; i<this.data.length; i+=1) {
                    for (var j=0,len=this.data[i].length; j<len; j+=1) {
                        if (typeof this.data[i][j][2] == 'string') {
                            prop['chart.colors'].push(this.data[i][j][2]);
                        }
                    }
                }
            }

    
    
    
            /**
            * Populate the chart.tooltips array
            */
            this.set('chart.tooltips', []);

            for (var i=0; i<this.data.length; i+=1) {
                for (var j=0,len=this.data[i].length; j<len; j+=1) {
                    prop['chart.tooltips'].push(this.data[i][j][3]);
                }
            }
    
    
    
            // This resets the chart drawing state
            co.beginPath();
    
            this.DrawBackground();
            this.DrawRscatter();
            this.DrawLabels();
            
    
            /**
            * Draw the key
            */
            var key = prop['chart.key'];

            if (key && key.length) {
                RG.drawKey(this, prop['chart.key'], prop['chart.colors']);
            }
    
    
    
    
            /**
            * Setup the context menu if required
            */
            if (prop['chart.contextmenu']) {
                RG.showContext(this);
            }
    
    
    
            // Draw the title if any has been set
            if (prop['chart.title']) {
                RG.DrawTitle(
                    this,
                    prop['chart.title'],
                    this.centery - this.radius - 10,
                    this.centerx,
                    prop['chart.title.size'] ? prop['chart.title.size'] : prop['chart.text.size'] + 2
                );
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






            //
            // Allow the segments to be highlighted
            //
            if (prop['chart.segment.highlight']) {
                RG.allowSegmentHighlight({
                    object: this,

                    // This is duplicated in the drawBackground function
                    count:  typeof prop['chart.segment.highlight.count'] === 'number' ? prop['chart.segment.highlight.count'] : ((prop['chart.background.grid.diagonals.count'] ? prop['chart.background.grid.diagonals.count'] : (prop['chart.labels'] ? prop['chart.labels'].length : 8))),

                    fill:   prop['chart.segment.highlight.fill'],
                    stroke: prop['chart.segment.highlight.stroke']
                });
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
        * This method draws the rscatter charts background
        */
        this.drawBackground =
        this.DrawBackground = function ()
        {
            // Draw the background color first
            if (prop['chart.background.color'] != 'transparent') {
                pa2(co, ['b','a', this.centerx, this.centery, this.radius, 0, 2 * ma.PI, -1, 'f', prop['chart.background.color']]);
            }


            var gridEnabled  = prop['chart.background.grid'];


            if (gridEnabled) {
                
                co.lineWidth = prop['chart.background.grid.linewidth'];
        
        
                // Draw the background grey circles
                if (prop['chart.background.grid.circles']) {

                    co.strokeStyle = prop['chart.background.grid.color'];
                    co.beginPath();
                    
                    if (RG.isNull(prop['chart.background.grid.circles.count'])) {
                        prop['chart.background.grid.circles.count'] = prop['chart.labels.axes.count'];
                    }

                    // Radius must be greater than 0 for Opera to work
                    
                    var r = this.radius / prop['chart.background.grid.circles.count'];

                    for (var i=0,len=this.radius; i<=len; i+=r) {
                
                        // Radius must be greater than 0 for Opera to work
                        co.moveTo(this.centerx + i, this.centery);
                        co.arc(
                            this.centerx,
                            this.centery,
                            i,
                            0,
                            RG.TWOPI,
                            0
                        );
                    }
                    co.stroke();
                }
        
        
        
        
        
        
        
                // Draw the background lines that go from the center outwards
                if (prop['chart.background.grid.radials']) {

                    co.strokeStyle = prop['chart.background.grid.color'];
                
                    co.beginPath();
                    
                    // This is duplicated in the allowSegmentHighlight call
                    if (typeof prop['chart.background.grid.radials.count'] === 'number') {
                        var inc = 360 / prop['chart.background.grid.radials.count'];
                    } else if (prop['chart.labels'] && prop['chart.labels'].length) {
                        var inc = 360 / prop['chart.labels'].length;
                    } else {
                        var inc = 45; //360 / 8
                    }


                    for (var i=0; i<360; i+=inc) {
                    
                        // Radius must be greater than 0 for Opera to work
                        co.arc(
                            this.centerx,
                            this.centery,
                            this.radius,
                            (i / (180 / RG.PI)) - RG.HALFPI,
                            ((i + 0.01) / (180 / RG.PI)) - RG.HALFPI,
                            0
                        );
                    
                        co.lineTo(this.centerx, this.centery);
                    }
                    co.stroke();
                }
            }
            
            // Reset the linewidth
            co.lineWidth = 1;
    
    
    
    
    
    
    
    
    
    
    
    
    
            co.beginPath();
            co.strokeStyle = prop['chart.axes.color'];
        
            // Draw the X axis
            co.moveTo(this.centerx - this.radius, Math.round(this.centery));
            co.lineTo(this.centerx + this.radius, Math.round(this.centery));
        
            // Draw the X ends
            co.moveTo(ma.round(this.centerx - this.radius), this.centery - 5);
            co.lineTo(ma.round(this.centerx - this.radius), this.centery + 5);
            co.moveTo(ma.round(this.centerx + this.radius), this.centery - 5);
            co.lineTo(ma.round(this.centerx + this.radius), this.centery + 5);
            
            
            var numticks = prop['chart.labels.axes.count'];
            
            if (numticks) {
                // Draw the X check marks
                for (var i=(this.centerx - this.radius); i<(this.centerx + this.radius); i+=(this.radius / numticks)) {
                    co.moveTo(ma.round(i),  this.centery - 3);
                    co.lineTo(ma.round(i),  this.centery + 3);
                }
                
                // Draw the Y check marks
                for (var i=(this.centery - this.radius); i<(this.centery + this.radius); i+=(this.radius / numticks)) {
                    co.moveTo(this.centerx - 3, ma.round(i));
                    co.lineTo(this.centerx + 3, ma.round(i));
                }
            }
        
            // Draw the Y axis
            co.moveTo(ma.round(this.centerx), this.centery - this.radius);
            co.lineTo(ma.round(this.centerx), this.centery + this.radius);
        
            // Draw the Y ends
            if (prop['chart.axes.caps']) {
                co.moveTo(this.centerx - 5, ma.round(this.centery - this.radius));
                co.lineTo(this.centerx + 5, ma.round(this.centery - this.radius));

                co.moveTo(this.centerx - 5, ma.round(this.centery + this.radius));
                co.lineTo(this.centerx + 5, ma.round(this.centery + this.radius));
            }
            
            // Stroke it
            co.closePath();
            co.stroke();
        };








        /**
        * This method draws a set of data on the graph
        */
        this.drawRscatter =
        this.DrawRscatter = function ()
        {
            for (var dataset=0; dataset<this.data.length; dataset+=1) {

                var data = this.data[dataset];

                // Don't do this
                // this.coords = [];

                this.coords2[dataset] = [];

                var drawPoints = function (obj)
                {
                    for (var i=0; i<data.length; ++i) {

                        var d1      = data[i][0],
                            d2      = data[i][1],
                            a       = d1 / (180 / RG.PI), // RADIANS
                            r       = ( (d2 - prop['chart.scale.min']) / (obj.scale2.max - obj.scale2.min) ) * obj.radius,
                            x       = ma.sin(a) * r,
                            y       = ma.cos(a) * r,
                            color   = data[i][2] ? data[i][2] : prop['chart.colors.default'],
                            tooltip = data[i][3] ? data[i][3] : null
            
                        if (tooltip && String(tooltip).length) {
                            obj.hasTooltips = true;
                        }
            
                        /**
                        * Account for the correct quadrant
                        */
                        x = x + obj.centerx;
                        y = obj.centery - y;
            
            
                        obj.drawTick(x, y, color);
                        
                        // Populate the coords array with the coordinates and the tooltip

                        obj.coords.push([x, y, color, tooltip]);
                        obj.coords2[dataset].push([x, y, color, tooltip]);
                    }
                }

                drawPoints(this);

                if (prop['chart.line']) {
                    this.drawLine(dataset);
                }

                // Causes tooltips not to appear sometimes on this demo page:
                // /demos/rscatter-multiple-datasets-single-array.html
                //
                //drawPoints(this);
            }
        };








        /*
        * Draws a connecting line through the points if requested
        * 
        * @param object opt The options to the line
        */
        this.drawLine = function (idx)
        {
            var opt = {
                dataset:        idx,
                coords:        this.coords2[idx],
                color:         prop['chart.line.colors'][idx],
                shadow:        prop['chart.line.shadow'],
                shadowColor:   prop['chart.line.shadow.color'],
                shadowOffsetX: prop['chart.line.shadow.offsetx'],
                shadowOffsetY: prop['chart.line.shadow.offsety'],
                shadowBlur:    prop['chart.line.shadow.blur'],
                linewidth:     prop['chart.line.linewidth']
            };

            co.beginPath();

            co.strokeStyle = this.parseSingleColorForGradient(opt.color);
              co.lineWidth = typeof prop['chart.line.linewidth'] === 'object' ? prop['chart.line.linewidth'][idx] : prop['chart.line.linewidth'];
                co.lineCap = 'round';

            if (opt.shadow) {
                RG.setShadow(
                    this,
                    opt.shadowColor,
                    opt.shadowOffsetX,
                    opt.shadowOffsetY,
                    opt.shadowBlur
                );
            }

            for (var i=0; i<this.coords2[idx].length; ++i) {
                if (i === 0) {
                    co.moveTo(this.coords2[idx][i][0], this.coords2[idx][i][1]);
                    
                    var startCoords = RG.arrayClone(this.coords2[idx]);

                } else {
                    co.lineTo(this.coords2[idx][i][0], this.coords2[idx][i][1]);
                }
            }
            
            // Draw the line back to the start?
            if (
                   (typeof prop['chart.line.close'] === 'boolean' && prop['chart.line.close'])
                || (typeof prop['chart.line.close'] === 'object' && prop['chart.line.close'][idx])
                ) {
                co.lineTo(this.coords2[idx][0][0], this.coords2[idx][0][1]);
            }
            
            co.stroke();
            
            RG.noShadow(this);
        };








        /**
        * Unsuprisingly, draws the labels
        */
        this.drawLabels =
        this.DrawLabels = function ()
        {
            co.lineWidth = 1;
            
            // Default the color to black
            co.fillStyle = 'black';
            co.strokeStyle = 'black';
            
            var key        = prop['chart.key'];
            var r          = this.radius;
            var axesColor  = prop['chart.axes.color'];
            var italic     = prop['chart.text.italic'];
            var bold       = prop['chart.text.bold'];
            var color      = prop['chart.text.color'];
            var font       = prop['chart.text.font'];
            var size       = prop['chart.text.size'];
            var axes       = prop['chart.labels.axes'].toLowerCase();
            var units_pre  = prop['chart.scale.units.pre'];
            var units_post = prop['chart.scale.units.post'];
            var decimals   = prop['chart.scale.decimals'];
            var centerx    = this.centerx;
            var centery    = this.centery;
            
            co.fillStyle = prop['chart.text.color'];
    
            // Draw any labels
            if (typeof prop['chart.labels'] == 'object' && prop['chart.labels']) {
                this.DrawCircularLabels(co, prop['chart.labels'], font , size, r);
            }
    

            //
            // If the axes are transparent - then the labels should have no offset,
            // otherwise it defaults to true. Similarly the labels can or can't be
            // centered if there's no axes
            //
            var offset   = 10;
            var centered = false;

            if (   axesColor === 'rgba(0,0,0,0)'
                || axesColor === 'rgb(0,0,0)'
                || axesColor === 'transparent') {
                
                offset = 0;
                centered = true;
            }


                var textConf = RG.getTextConf({
                    object: this,
                    prefix: 'chart.labels.axes'
                });

    
            // Draw the axis labels
            for (var i=0,len=this.scale2.labels.length; i<len; ++i) {
                if (axes.indexOf('n') > -1) RG.text2(this, {'tag': 'scale',font: textConf.font,size: textConf.size,color: textConf.color,bold: textConf.bold,italic: textConf.italic,'x':centerx - offset,'y':centery - (r * ((i+1) / len)),'text':this.scale2.labels[i],'valign':'center','halign':centered ? 'center' : 'right',bounding: true, boundingFill: prop['chart.labels.axes.background'], boundingStroke: 'rgba(0,0,0,0)'});
                if (axes.indexOf('s') > -1) RG.text2(this, {'tag': 'scale',font: textConf.font,size: textConf.size,color: textConf.color,bold: textConf.bold,italic: textConf.italic,'x':centerx - offset,'y':centery + (r * ((i+1) / len)),'text':this.scale2.labels[i],'valign':'center','halign':centered ? 'center' : 'right',bounding: true, boundingFill: prop['chart.labels.axes.background'], boundingStroke: 'rgba(0,0,0,0)'});
                if (axes.indexOf('e') > -1) RG.text2(this, {'tag': 'scale',font: textConf.font,size: textConf.size,color: textConf.color,bold: textConf.bold,italic: textConf.italic,'x':centerx + (r * ((i+1) / len)),'y':centery + offset,'text':this.scale2.labels[i],'valign':centered ? 'center' : 'top','halign':'center',bounding: true, boundingFill: prop['chart.labels.axes.background'], boundingStroke: 'rgba(0,0,0,0)'});
                if (axes.indexOf('w') > -1) RG.text2(this, {'tag': 'scale',font: textConf.font,size: textConf.size,color: textConf.color,bold: textConf.bold,italic: textConf.italic,'x':centerx - (r * ((i+1) / len)),'y':centery + offset,'text':this.scale2.labels[i],'valign':centered ? 'center' : 'top','halign':'center',bounding: true, boundingFill: prop['chart.labels.axes.background'], boundingStroke: 'rgba(0,0,0,0)'});
            }
    
            // Draw the center minimum value (but only if there's at least one axes labels stipulated)
            if (prop['chart.labels.axes'].length > 0 && prop['chart.scale.zerostart']) {
                RG.text2(this, {
                    font:           textConf.font,
                    size:           textConf.size,
                    color:          textConf.color,
                    bold:           textConf.bold,
                    italic:         textConf.italic,
                    'x':            centerx,
                    'y':            centery,
                    'text':         RG.numberFormat({
                                        object:    this,
                                        number:    Number(this.scale2.min).toFixed(this.scale2.decimals),
                                        unitspre:  this.scale2.units_pre,
                                        unitspost: this.scale2.units_post
                                    }),
                    'valign':       'center',
                    'halign':       'center',
                    'bounding':     true,
                    'boundingFill': prop['chart.labels.axes.background'],
                    'boundingStroke':'rgba(0,0,0,0)',
                    'tag':          'scale'
                });
            }
        };








        /**
        * Draws the circular labels that go around the charts
        * 
        * @param labels array The labels that go around the chart
        */
        this.drawCircularLabels =
        this.DrawCircularLabels = function (context, labels, font_face, font_size, r)
        {
            var r = r + 10,
                color = prop['chart.labels.color'];
    
            for (var i=0; i<labels.length; ++i) {

                var a = (360 / labels.length) * (i + 1) - (360 / (labels.length * 2));
                var a = a - 90 + (prop['chart.labels.position'] == 'edge' ? ((360 / labels.length) / 2) : 0);
    
                var x = ma.cos(a / (180/RG.PI) ) * r;
                var y = ma.sin(a / (180/RG.PI)) * r;
    
                var textConf = RG.getTextConf({
                    object: this,
                    prefix: 'chart.labels'
                });


                RG.Text2(this, {

                     font: textConf.font,
                     size: textConf.size,
                    color: textConf.color,
                     bold: textConf.bold,
                   italic: textConf.italic,

                    'x':this.centerx + x,
                    'y':this.centery + y,
                    'text':String(labels[i]),
                    'valign':'center',
                    'halign':( (this.centerx + x) > this.centerx) ? 'left' : 'right',
                    'tag': 'labels'
                });
            }
        };








        /**
        * Draws a single tickmark
        */
        this.drawTick =
        this.DrawTick = function (x, y, color)
        {
            var tickmarks = prop['chart.tickmarks'];
            var ticksize  = prop['chart.tickmarks.size'];
    
            co.strokeStyle = color;
            co.fillStyle   = color;
    
            // Set the linewidth for the tickmark to 1
            var prevLinewidth = co.lineWidth;
            co.lineWidth = 1;
    
            // Cross
            if (tickmarks == 'cross') {
    
                co.beginPath();
                co.moveTo(x + ticksize, y + ticksize);
                co.lineTo(x - ticksize, y - ticksize);
                co.stroke();
        
                co.beginPath();
                co.moveTo(x - ticksize, y + ticksize);
                co.lineTo(x + ticksize, y - ticksize);
                co.stroke();
            
            // Circle
            } else if (tickmarks == 'circle') {
    
                co.beginPath();
                co.arc(x, y, ticksize, 0, 6.2830, false);
                co.fill();
    
            // Square
            } else if (tickmarks == 'square') {
    
                co.beginPath();
                co.fillRect(x - ticksize, y - ticksize, 2 * ticksize, 2 * ticksize);
                co.fill();
            
            // Diamond shape tickmarks
             } else if (tickmarks == 'diamond') {
    
                co.beginPath();
                    co.moveTo(x, y - ticksize);
                    co.lineTo(x + ticksize, y);
                    co.lineTo(x, y + ticksize);
                    co.lineTo(x - ticksize, y);
                co.closePath();
                co.fill();
    
            // Plus style tickmarks
            } else if (tickmarks == 'plus') {
            
                co.lineWidth = 1;
    
                co.beginPath();
                    co.moveTo(x, y - ticksize);
                    co.lineTo(x, y + ticksize);
                    co.moveTo(x - ticksize, y);
                    co.lineTo(x + ticksize, y);
                co.stroke();
            }
            
            
            co.lineWidth = prevLinewidth;
        };








        /**
        * This function makes it much easier to get the (if any) point that is currently being hovered over.
        * 
        * @param object e The event object
        */
        this.getShape =
        this.getPoint = function (e)
        {
            var mouseXY     = RG.getMouseXY(e);
            var mouseX      = mouseXY[0];
            var mouseY      = mouseXY[1];
            var overHotspot = false;
            var offset      = prop['chart.tooltips.hotspot']; // This is how far the hotspot extends
    
            for (var i=0,len=this.coords.length; i<len; ++i) {

                var x       = this.coords[i][0];
                var y       = this.coords[i][1];
                var tooltip = this.coords[i][3];
    
                if (
                    mouseX < (x + offset) &&
                    mouseX > (x - offset) &&
                    mouseY < (y + offset) &&
                    mouseY > (y - offset)
                   ) {

                    var tooltip = RG.parseTooltipText(prop['chart.tooltips'], i);

                    return {0:this,1:x,2:y,3:i,'object':this, 'x':x, 'y':y, 'index':i, 'tooltip': tooltip};
                }
            }
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
                RG.Highlight.Point(this, shape);
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
            var mouseX  = mouseXY[0];
            var mouseY  = mouseXY[1];
            var centerx = this.centerx;
            var centery = this.centery;
            var radius  = this.radius;
    
            if (
                   mouseX > (centerx - radius)
                && mouseX < (centerx + radius)
                && mouseY > (centery - radius)
                && mouseY < (centery + radius)
                ) {
    
                return this;
            }
        };








        /**
        * This function returns the radius (ie the distance from the center) for a particular
        * value.
        * 
        * @param number value The value you want the radius for
        */
        this.getRadius = function (value)
        {
            var max = this.max;

            if (value < 0 || value > max) {
                return null;
            }
            
            var r = (value / max) * this.radius;
            
            return r;
        };








        /**
        * This allows for easy specification of gradients
        */
        this.parseColors = function ()
        {
            // Save the original colors so that they can be restored when the canvas is reset
            if (this.original_colors.length === 0) {
                this.original_colors['data'] = RG.array_clone(this.data);
                this.original_colors['chart.highlight.stroke']         = RG.arrayClone(prop['chart.highlight.stroke']);
                this.original_colors['chart.highlight.fill']           = RG.arrayClone(prop['chart.highlight.fill']);
                this.original_colors['chart.colors.default']           = RG.arrayClone(prop['chart.colors.default']);
                this.original_colors['chart.background.grid.color']    = RG.arrayClone(prop['chart.background.grid.color']);
                this.original_colors['chart.background.color']         = RG.arrayClone(prop['chart.background.color']);
                this.original_colors['chart.segment.highlight.stroke'] = RG.arrayClone(prop['chart.segment.highlight.stroke']);
                this.original_colors['chart.segment.highlight.fill']   = RG.arrayClone(prop['chart.segment.highlight.fill']);
            }






            // Go through the data
            for (var i=0; i<this.data.length; i+=1) {
                for (var j=0,len=this.data[i].length; j<len; j+=1) {
                    this.data[i][j][2] = this.parseSingleColorForGradient(this.data[i][j][2]);
                }
            }
    
            prop['chart.highlight.stroke']         = this.parseSingleColorForGradient(prop['chart.highlight.stroke']);
            prop['chart.highlight.fill']           = this.parseSingleColorForGradient(prop['chart.highlight.fill']);
            prop['chart.colors.default']           = this.parseSingleColorForGradient(prop['chart.colors.default']);
            prop['chart.background.grid.color']    = this.parseSingleColorForGradient(prop['chart.background.grid.color']);
            prop['chart.background.color']         = this.parseSingleColorForGradient(prop['chart.background.color']);
            prop['chart.segment.highlight.stroke'] = this.parseSingleColorForGradient(prop['chart.segment.highlight.stroke']);
            prop['chart.segment.highlight.fill']   = this.parseSingleColorForGradient(prop['chart.segment.highlight.fill']);
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
            if (!color || typeof color != 'string') {
                return color;
            }

            if (color.match(/^gradient\((.*)\)$/i)) {

                // Allow for JSON gradients
                if (color.match(/^gradient\(({.*})\)$/i)) {
                    return RGraph.parseJSONGradient({object: this, def: RegExp.$1});
                }

                var parts = RegExp.$1.split(':');
    
                // Create the gradient
                var grad = co.createRadialGradient(this.centerx, this.centery, 0, this.centerx, this.centery, this.radius);
    
                var diff = 1 / (parts.length - 1);
    
                grad.addColorStop(0, RG.trim(parts[0]));
    
                for (var j=1; j<parts.length; ++j) {
                    grad.addColorStop(j * diff, RG.trim(parts[j]));
                }
            }
    
            return grad ? grad : color;
        };








        /**
        * This function handles highlighting an entire data-series for the interactive
        * key
        * 
        * @param int index The index of the data series to be highlighted
        */
        this.interactiveKeyHighlight = function (index)
        {
            if (this.coords2 && this.coords2[index] && this.coords2[index].length) {
                this.coords2[index].forEach(function (value, idx, arr)
                {
                    co.beginPath();
                    co.fillStyle = prop['chart.key.interactive.highlight.chart.fill'];
                    co.arc(value[0], value[1], prop['chart.tickmarks.size'] + 2, 0, RG.TWOPI, false);
                    co.fill();
                });
            }
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
        * This helps the Gantt reset colors when the reset function is called.
        * It handles going through the data and resetting the colors.
        */
        this.resetColorsToOriginalValues = function ()
        {
            /**
            * Copy the original colors over for single-event-per-line data
            */
            for (var i=0,len=this.original_colors['data'].length; i<len; ++i) {
                for (var j=0,len2=this.original_colors['data'][i].length; j<len2;++j) {
                    this.data[i][j][2] = RG.array_clone(this.original_colors['data'][i][j][2]);
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








        /**
        * Register the object
        */
        RG.register(this);








        /**
        * This is the 'end' of the constructor so if the first argument
        * contains configuration data - handle that.
        */
        if (parseConfObjectForOptions) {
            RG.parseObjectStyleConfig(this, conf.options);
        }
    };