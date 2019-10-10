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
    RGraph.Funnel = function (conf)
    {
        /**
        * Allow for object config style
        */
        if (   typeof conf === 'object'
            && typeof conf.data === 'object'
            && typeof conf.id === 'string') {

            var id                        = conf.id
            var canvas                    = document.getElementById(id);
            var data                      = conf.data;
            var parseConfObjectForOptions = true; // Set this so the config is parsed (at the end of the constructor)
        
        } else {
        
            var id     = conf;
            var canvas = document.getElementById(id);
            var data   = arguments[1];
        }


        this.id                = id;
        this.canvas            = canvas;
        this.context           = this.canvas.getContext ? this.canvas.getContext("2d", {alpha: (typeof id === 'object' && id.alpha === false) ? false : true}) : null;
        this.canvas.__object__ = this;
        this.type              = 'funnel';
        this.coords            = [];
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
            //'chart.margin.left':                 'chart.gutter.left',
            //'chart.margin.right':                'chart.gutter.right',
            //'chart.margin.top':                  'chart.gutter.top',
            //'chart.margin.bottom':               'chart.gutter.bottom',
            //'chart.annotatable.color':           'chart.annotate.color',
            //'chart.annotatable.linewidth':       'chart.annotate.linewidth',
            //'chart.resizable.handle.background': 'chart.resize.handle.background',
            //'chart.key.position.margin.boxed':   'chart.key.position.gutter.boxed'
            /* [NEW]:[OLD] */
        };










        // Check for support
        if (!this.canvas) {
            alert('[FUNNEL] No canvas support');
            return;
        }

        /**
        * The funnel charts properties
        */
        this.properties =
        {
            'chart.colors.stroke': 'rgba(0,0,0,0)',
            'chart.colors': [
                'Gradient(white:red)',
                'Gradient(white:green)',
                'Gradient(white:gray)',
                'Gradient(white:blue)',
                'Gradient(white:black)',
                'Gradient(white:gray)',
                'Gradient(white:pink)',
                'Gradient(white:blue)',
                'Gradient(white:yellow)',
                'Gradient(white:green)',
                'Gradient(white:red)'
            ],

            'chart.margin.left':           25,
            'chart.margin.right':          25,
            'chart.margin.top':            25,
            'chart.margin.bottom':         25,
            
            'chart.labels':                null,
            'chart.labels.font':           null,
            'chart.labels.size':           null,
            'chart.labels.color':          null,
            'chart.labels.bold':           null,
            'chart.labels.italic':         null,
            'chart.labels.sticks':         false,
            'chart.labels.x':              null,

            'chart.title':                  '',
            'chart.title.background':       null,
            'chart.title.hpos':             null,
            'chart.title.vpos':             null,
            'chart.title.italic':           null,
            'chart.title.bold':             null,
            'chart.title.font':             null,
            'chart.title.size':             null,
            'chart.title.color':            null,
            'chart.title.x':                null,
            'chart.title.y':                null,
            'chart.title.halign':           null,
            'chart.title.valign':           null,

            'chart.text.size':             12,
            'chart.text.color':            'black',
            'chart.text.font':             'Arial, Verdana, sans-serif',
            'chart.text.bold':             false,
            'chart.text.italic':           false,
            'chart.text.halign':           'left',
            'chart.text.accessible':               true,
            'chart.text.accessible.overflow':      'visible',
            'chart.text.accessible.pointerevents': false,

            'chart.contextmenu':           null,

            'chart.shadow':                false,
            'chart.shadow.color':          '#666',
            'chart.shadow.blur':           3,
            'chart.shadow.offsetx':        3,
            'chart.shadow.offsety':        3,

            'chart.key':                    null,
            'chart.key.background':         'white',
            'chart.key.position':           'graph',
            'chart.key.halign':             'right',
            'chart.key.shadow':             false,
            'chart.key.shadow.color':       '#666',
            'chart.key.shadow.blur':        3,
            'chart.key.shadow.offsetx':     2,
            'chart.key.shadow.offsety':     2,
            'chart.key.position.margin.boxed': false,
            'chart.key.position.x':         null,
            'chart.key.position.y':         null,
            'chart.key.color.shape':        'square',
            'chart.key.rounded':            true,
            'chart.key.linewidth':          1,
            'chart.key.colors':             null,
            'chart.key.interactive':        false,
            'chart.key.interactive.highlight.chart.stroke': 'black',
            'chart.key.interactive.highlight.chart.fill':   'rgba(255,255,255,0.7)',
            'chart.key.interactive.highlight.label':        'rgba(255,0,0,0.2)',
            'chart.key.labels.font':         null,
            'chart.key.labels.size':         null,
            'chart.key.labels.color':        null,
            'chart.key.labels.bold':         null,
            'chart.key.labels.italic':       null,
            'chart.key.labels.offsetx':      0,
            'chart.key.labels.offsety':      0,

            'chart.tooltips.highlight':     true,

            'chart.tooltips':               null,
            'chart.tooltips.effect':        'fade',
            'chart.tooltips.css.class':     'RGraph_tooltip',
            'chart.tooltips.event':         'onclick',

            'chart.highlight.stroke':       'rgba(0,0,0,0)',
            'chart.highlight.fill':         'rgba(255,255,255,0.7)',

            'chart.annotatable':           false,
            'chart.annotatable.color':     'black',

            'chart.resizable':                   false,
            'chart.resizable.handle.background': null,

            'chart.events.click':           null,
            'chart.events.mousemove':       null,

            'chart.clearto':   'rgba(0,0,0,0)'
        }

        // Store the data
        for (var i=0; i<data.length; ++i) {
            data[i] = parseFloat(data[i]);
        }
        this.data = data;


        /**
        * Create the dollar objects so that functions can be added to them
        */
        for (var i=0; i<data.length; ++i) {
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
            // Fire the onbeforedraw event
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
            this.marginLeft   = prop['chart.margin.left'];
            this.marginRight  = prop['chart.margin.right'];
            this.marginTop    = prop['chart.margin.top'];
            this.marginBottom = prop['chart.margin.bottom'];
    
            // This stops the coords array from growing
            this.coords = [];
            
            /**
            * Stop this growing uncntrollably
            */
            this.coordsText = [];
    
            RG.drawTitle(
                this,
                prop['chart.title'],
                this.marginTop,
                null,
                typeof prop['chart.title.size'] === 'number' ? prop['chart.title.size'] : prop['chart.text.size']
            );
            
            this.drawFunnel();

            
            /**
            * Setup the context menu if required
            */
            if (prop['chart.contextmenu']) {
                RG.showContext(this);
            }
    
    
    
            /**
            * Draw the labels on the chart
            */
            this.drawLabels();

            
            /**
            * This function enables resizing
            */
            if (prop['chart.resizable']) {
                RG.allowResizing(this);
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
        * This function actually draws the chart
        */
        this.drawFunnel =
        this.DrawFunnel = function ()
        {
            var width     = ca.width - this.marginLeft - this.marginRight;
            var height    = ca.height - this.marginTop - this.marginBottom;
            var max       = RG.arrayMax(this.data);
            var accheight = this.marginTop;

    
            /**
            * Loop through each segment to draw
            */

            // Set a shadow if it's been requested
            if (prop['chart.shadow']) {
                co.shadowColor   = prop['chart.shadow.color'];
                co.shadowBlur    = prop['chart.shadow.blur'];
                co.shadowOffsetX = prop['chart.shadow.offsetx'];
                co.shadowOffsetY = prop['chart.shadow.offsety'];
            }

            for (i=0,len=this.data.length; i<len; ++i) {

                var firstvalue = this.data[0];
                var firstwidth = (firstvalue / max) * width;
                var curvalue   = this.data[i];
                var curwidth   = (curvalue / max) * width;
                var curheight  = height / (this.data.length - 1);
                var halfCurWidth = (curwidth / 2);
                var nextvalue  = this.data[i + 1];
                var nextwidth  = this.data[i + 1] ? (nextvalue / max) * width : null;
                var halfNextWidth = (nextwidth / 2);
                var center        = this.marginLeft + (firstwidth / 2);

                var x1 = center - halfCurWidth;
                var y1 = accheight;
                var x2 = center + halfCurWidth;
                var y2 = accheight;
                var x3 = center + halfNextWidth;
                var y3 = accheight + curheight;
                var x4 = center - halfNextWidth;
                var y4 = accheight + curheight;
    
                if (nextwidth && i < this.data.length - 1) {

                    co.beginPath();
    
                        co.strokeStyle = prop['chart.colors.stroke'];
                        co.fillStyle   = prop['chart.colors'][i];
    
                        co.moveTo(x1, y1);
                        co.lineTo(x2, y2);
                        co.lineTo(x3, y3);
                        co.lineTo(x4, y4);
    
                    co.closePath();

                    /**
                    * Store the coordinates
                    */
                    this.coords.push([x1, y1, x2, y2, x3, y3, x4, y4]);
                }
    
    
                // The redrawing if the shadow is on will do the stroke
                if (!prop['chart.shadow']) {
                    co.stroke();
                }
    
                co.fill();
    
                accheight += curheight;
            }

            /**
            * If the shadow is enabled, redraw every segment, in order to allow for shadows going upwards
            */
            if (prop['chart.shadow']) {
            
                RG.noShadow(this);
            
                for (i=0; i<this.coords.length; ++i) {
                
                    co.strokeStyle = prop['chart.colors.stroke'];
                    co.fillStyle = prop['chart.colors'][i];
            
                    co.beginPath();
                        co.moveTo(this.coords[i][0], this.coords[i][1]);
                        co.lineTo(this.coords[i][2], this.coords[i][3]);
                        co.lineTo(this.coords[i][4], this.coords[i][5]);
                        co.lineTo(this.coords[i][6], this.coords[i][7]);
                    co.closePath();

                    co.stroke();
                    co.fill();
                }
            }

            /**
            * Lastly, draw the key if necessary
            */
            if (prop['chart.key'] && prop['chart.key'].length) {
                RG.drawKey(this, prop['chart.key'], prop['chart.colors']);
            }
        };








        /**
        * Draws the labels
        */
        this.drawLabels =
        this.DrawLabels = function ()
        {
            /**
            * Draws the labels
            */
            if (prop['chart.labels'] && prop['chart.labels'].length > 0) {

                var font    = prop['chart.text.font'];
                var size    = prop['chart.text.size'];
                var color   = prop['chart.text.color'];
                var labels  = prop['chart.labels'];
                var halign  = prop['chart.text.halign'] == 'left' ? 'left' : 'center';
    
                // Get the text configuration
                var textConf = RG.getTextConf({
                    object: this,
                    prefix: 'chart.labels'
                });

                if (typeof prop['chart.labels.x'] == 'number') {
                    var x = prop['chart.labels.x'];
                } else {
                    var x = halign == 'left' ? (this.marginLeft - 15) : ((ca.width - this.marginLeft - this.marginRight) / 2) + this.marginLeft;
                }

                for (var j=0; j<this.coords.length; ++j) {  // MUST be "j"
    
                    co.beginPath();
                    
                    // Set the color back to black
                    co.strokeStyle = 'black';
                    co.fillStyle = color;
                    
                    // Turn off any shadow
                    RG.noShadow(this);
                    
                    var label = labels[j] || '';
    
                    RG.text2(this,{

                        font:   textConf.font,
                        size:   textConf.size,
                        color:  textConf.color,
                        bold:   textConf.bold,
                        italic: textConf.italic,

                        x:              x,
                        y:              this.coords[j][1],
                        text:           label,
                        valign:         'center',
                        halign:         halign,
                        bounding:       true,
                        boundingFill:   'rgba(255,255,255,0.7)',
                        boundingStroke: 'rgba(0,0,0,0)',
                        tag:            'labels'
                    });
                    
                    if (prop['chart.labels.sticks'] && labels[j]) {
                        /**
                        * Measure the text
                        */
                        co.font = size + 'pt ' + font;
                        var labelWidth    = co.measureText(label).width;
        
                        /**
                        * Draw the horizontal indicator line
                        */
                        co.beginPath();
                            co.strokeStyle = 'gray';
                            co.moveTo(x + labelWidth + 10, ma.round(this.coords[j][1]));
                            co.lineTo(this.coords[j][0] - 10, ma.round(this.coords[j][1]));
                        co.stroke();
                    }
                }

                // This draws the last labels if defined
                var lastLabel = labels[j];
    
                if (lastLabel) {

                    RG.text2(this,{

                        font:   textConf.font,
                        size:   textConf.size,
                        color:  textConf.color,
                        bold:   textConf.bold,
                        italic: textConf.italic,

                        x:              x,
                        y:              this.coords[j - 1][5],
                        text:           lastLabel,
                        valign:         'center',
                        halign:         halign,
                        bounding:       true,
                        boundingFill:   'rgba(255,255,255,0.7)',
                        boundingStroke: 'rgba(0,0,0,0)',
                        tag:            'labels'
                    });
    
                    if (prop['chart.labels.sticks']) {

                        // Measure the text
                        co.font = size + 'pt ' + font;
                        var labelWidth    = co.measureText(lastLabel).width;

                        // Draw the horizontal indicator line
                        co.beginPath();
                            co.strokeStyle = 'gray';

                            //co.moveTo(x + labelWidth + 10, ma.round(this.coords[j][1]));
                            //co.lineTo(this.coords[j][0] - 10, ma.round(this.coords[j][1]));
                            
                            co.moveTo(x + labelWidth + 10, Math.round(this.coords[j - 1][7]));
                            co.lineTo(this.coords[j - 1][6] - 10, Math.round(this.coords[j - 1][7]));
                        co.stroke();
                    }
                }
            }
        };








        /**
        * Gets the appropriate segment that has been highlighted
        */
        this.getShape =
        this.getSegment = function (e)
        {
            //var canvas = ca = e.target;
            //var co          = this.context;
            //var prop        = this.properties;
            var coords      = this.coords;
            var mouseCoords = RG.getMouseXY(e);
            var x           = mouseCoords[0];
            var y           = mouseCoords[1];        
    
            for (i=0,len=coords.length; i<len; ++i) {
            
                var segment = coords[i]
    
                // Path testing
                co.beginPath();
                    co.moveTo(segment[0], segment[1]);
                    co.lineTo(segment[2], segment[3]);
                    co.lineTo(segment[4], segment[5]);
                    co.lineTo(segment[6], segment[7]);
                    co.lineTo(segment[8], segment[9]);
    
                if (co.isPointInPath(x, y)) {
                    var tooltip = RGraph.parseTooltipText(prop['chart.tooltips'], i);
                    return {0: this, 1: coords, 2: i, 'object': this, 'coords': segment, 'index': i, 'tooltip': tooltip};
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
            if (prop['chart.tooltips.highlight']) {
            
                if (typeof prop['chart.highlight.style'] === 'function') {
                    (prop['chart.highlight.style'])(shape);
                    return;
                }



                var coords = shape['coords'];
                
                pa2(
                    co,
                    'b m % % l % % l % % l % % c s % f %',
                    coords[0], coords[1],
                    coords[2], coords[3],
                    coords[4], coords[5],
                    coords[6], coords[7],
                    prop['chart.highlight.stroke'],
                    prop['chart.highlight.fill']
                );
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
            var mouseXY = RGraph.getMouseXY(e);
    
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
        * This allows for easy specification of gradients
        */
        this.parseColors = function ()
        {
            // Save the original colors so that they can be restored when the canvas is reset
            if (this.original_colors.length === 0) {
                this.original_colors['chart.colors']           = RG.array_clone(prop['chart.colors']);
                this.original_colors['chart.key.colors']       = RG.array_clone(prop['chart.key.colors']);
                this.original_colors['chart.highlight.fill']   = RG.array_clone(prop['chart.highlight.fill']);
                this.original_colors['chart.highlight.stroke'] = RG.array_clone(prop['chart.highlight.stroke']);
                this.original_colors['chart.colors.stroke']    = RG.array_clone(prop['chart.colors.stroke']);
            }

            var colors = prop['chart.colors'];
    
            for (var i=0; i<colors.length; ++i) {
                colors[i] = this.parseSingleColorForHorizontalGradient(colors[i]);
            }
            
            var keyColors = prop['chart.key.colors'];
            if (keyColors) {
                for (var i=0; i<keyColors.length; ++i) {
                    keyColors[i] = this.parseSingleColorForHorizontalGradient(keyColors[i]);
                }
            }
            
            
            prop['chart.colors.stroke']    = this.parseSingleColorForVerticalGradient(prop['chart.colors.stroke']);
            prop['chart.highlight.stroke'] = this.parseSingleColorForHorizontalGradient(prop['chart.highlight.stroke']);
            prop['chart.highlight.fill']   = this.parseSingleColorForHorizontalGradient(prop['chart.highlight.fill']);
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
        this.parseSingleColorForHorizontalGradient = function (color)
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
    
                grad.addColorStop(0, RGraph.trim(parts[0]));
    
                for (var j=1; j<parts.length; ++j) {
                    grad.addColorStop(j * diff, RG.trim(parts[j]));
                }
            }
                
            return grad ? grad : color;
        };








        /**
        * This parses a single color value
        */
        this.parseSingleColorForVerticalGradient = function (color)
        {
            if (!color || typeof(color) != 'string') {
                return color;
            }
    
            if (color.match(/^gradient\((.*)\)$/i)) {
                
                var parts = RegExp.$1.split(':');
    
                // Create the gradient
                var grad = co.createLinearGradient(0, prop['chart.margin.top'],0,ca.height - prop['chart.margin.bottom']);
    
                var diff = 1 / (parts.length - 1);
    
                grad.addColorStop(0, RGraph.trim(parts[0]));
    
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
            var coords = this.coords[index];
            
            if (coords && coords.length == 8) {
                var pre_linewidth = co.lineWidth;

                co.lineWidth   = 2;
                co.strokeStyle = prop['chart.key.interactive.highlight.chart.stroke'];
                co.fillStyle   = prop['chart.key.interactive.highlight.chart.fill'];
                
                co.beginPath();
                    co.moveTo(coords[0], coords[1]);
                    co.lineTo(coords[2], coords[3]);
                    co.lineTo(coords[4], coords[5]);
                    co.lineTo(coords[6], coords[7]);
                co.closePath();
                co.fill();
                co.stroke();
                
                // Reset the linewidth
                co.lineWidth = pre_linewidth;
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
        * This function runs once only
        * (put at the end of the file (before any effects))
        */
        this.firstDrawFunc = function ()
        {
        };








        /**
        * Always now regsiter the object
        */
        RG.Register(this);








        /**
        * This is the 'end' of the constructor so if the first argument
        * contains configuration data - handle that.
        */
        if (parseConfObjectForOptions) {
            RG.parseObjectStyleConfig(this, conf.options);
        }
    };