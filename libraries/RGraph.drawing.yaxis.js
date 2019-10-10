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

    /**
    * Having this here means that the RGraph libraries can be included in any order, instead of you having
    * to include the common core library first.
    */

    // Define the RGraph global variable
    RGraph = window.RGraph || {isRGraph: true};
    RGraph.Drawing = RGraph.Drawing || {};

    /**
    * The constructor. This function sets up the object. It takes the ID (the HTML attribute) of the canvas as the
    * first argument and the X coordinate of the axis as the second
    * 
    * @param string id The canvas tag ID
    * @param number x  The X coordinate of the Y axis
    */
    RGraph.Drawing.YAxis = function (conf)
    {

        /**
        * Allow for object config style
        */
        if (   typeof conf === 'object'
            && typeof conf.x === 'number'
            && typeof conf.id === 'string') {

            var id = conf.id
            var x  = conf.x;

            var parseConfObjectForOptions = true; // Set this so the config is parsed (at the end of the constructor)
        
        } else {

            var id = conf;
            var x  = arguments[1];
        }

        this.id                = id;
        this.canvas            = document.getElementById(this.id);
        this.context           = this.canvas.getContext("2d");
        this.canvas.__object__ = this;
        this.x                 = x;
        this.coords            = [];
        this.coordsText        = [];
        this.original_colors   = [];
        this.maxLabelLength    = 0;
        this.firstDraw         = true; // After the first draw this will be false
        
        // This is a list of new property names that are used now in place of
        // the old names.
        //
        // *** When adding this list to a new chart library don't forget ***
        // *** the bit of code that also goes in the .set() function     ***
        /*this.propertyNameAliases = {
            'chart.margin.top':                 'chart.gutter.top',
            'chart.margin.bottom':              'chart.gutter.bottom',
            'chart.yaxis.labels.count':         'chart.numlabels',
            'chart.yaxis.labels.specific':      'chart.labels.specific',
            'chart.yaxis.tickmarks.count':      'chart.numticks',
            'chart.yaxis.tickmarks.align':      'chart.align',
            'chart.xaxis.position':             'chart.xaxispos',
            'chart.yaxis.tickmarks.end.top':    function (opt) {return {name:'chart.noendtick.top',value:!opt.value}},
            'chart.yaxis.tickmarks.end.bottom': function (opt) {return {name:'chart.noendtick.bottom',value:!opt.value}},
            'chart.yaxis':                      function (opt) {return {name:'chart.noyaxis',value:!opt.value}},
            'chart.yaxis.scale.formatter':      'chart.scale.formatter',
            'chart.yaxis.scale.decimals':       'chart.scale.decimals',
            'chart.yaxis.scale.invert':         'chart.scale.invert',
            'chart.yaxis.scale.zerostart':      'chart.scale.zerostart',
            'chart.yaxis.scale.visible':        'chart.scale.visible',
            'chart.yaxis.scale.units.pre':      'chart.units.pre',
            'chart.yaxis.scale.units.post':     'chart.units.post',
            'chart.yaxis.scale.max':            'chart.max',
            'chart.yaxis.scale.min':            'chart.min'
        };*/


        /**
        * This defines the type of this shape
        */
        this.type = 'drawing.yaxis';


        /**
        * This facilitates easy object identification, and should always be true
        */
        this.isRGraph = true;


        /**
        * This adds a uid to the object that you can use for identification purposes
        */ 
        this.uid = RGraph.CreateUID();


        /**
        * This adds a UID to the canvas for identification purposes
        */
        this.canvas.uid = this.canvas.uid ? this.canvas.uid : RGraph.CreateUID();



        /**
        * Some example background properties
        */
        this.properties =
        {
            'chart.margin.top':       25,
            'chart.margin.bottom':    30,
            
            'chart.colors':           ['black'],
            
            'chart.title':            '',
            'chart.title.color':      null,
            'chart.title.font':       null,
            'chart.title.size':       null,
            'chart.title.bold':       null,
            'chart.title.italic':     null,
            
            'chart.text.font':        'Arial, Verdana, sans-serif',
            'chart.text.size':        12,
            'chart.text.color':       'black',
            'chart.text.bold':        false,
            'chart.text.italic':      false,
            'chart.text.accessible':  true,
            'chart.text.accessible.overflow':'visible',
            'chart.text.accessible.pointerevents': false,
            
            'chart.yaxis':                  true,
            'chart.yaxis.tickmarks.count':  5,
            'chart.yaxis.labels.count':     5,
            'chart.yaxis.labels.specific':  null,
            'chart.yaxis.labels.font':      null,
            'chart.yaxis.labels.size':      null,
            'chart.yaxis.labels.color':     null,
            'chart.yaxis.labels.bold':      null,
            'chart.yaxis.labels.italic':    null,
            'chart.yaxis.tickmarks.align':  'left',
            'chart.yaxis.scale.min':        0,
            'chart.yaxis.scale.max':        null,
            'chart.yaxis.scale.formatter':  null,
            'chart.yaxis.scale.decimals':   0,
            'chart.yaxis.scale.point':      '.',
            'chart.yaxis.scale.thousand':   ',',
            'chart.yaxis.scale.invert':     false,
            'chart.yaxis.scale.zerostart':  true,
            'chart.yaxis.scale.visible':    true,
            'chart.yaxis.scale.units.pre':        '',
            'chart.yaxis.scale.units.post':       '',
            'chart.yaxis.tickmarks.last.top':    true,
            'chart.yaxis.tickmarks.last.bottom': true,

            'chart.linewidth':        1,
            
            'chart.tooltips':         null,
            'chart.tooltips.effect':   'fade',
            'chart.tooltips.css.class':'RGraph_tooltip',
            'chart.tooltips.event':    'onclick',
            
            'chart.xaxis.position':   'bottom',
            
            'chart.events.click':     null,
            'chart.events.mousemove': null,

            'chart.clearto':   'rgba(0,0,0,0)'
        }


        /**
        * A simple check that the browser has canvas support
        */
        if (!this.canvas) {
            alert('[DRAWING.YAXIS] No canvas support');
            return;
        }
        
        /**
        * Create the dollar object so that functions can be added to them
        */
        this.$0 = {};


        /**
        * Translate half a pixel for antialiasing purposes - but only if it hasn't beeen
        * done already
        * 
        * ** Could use setTransform() here instead ?
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
        * A setter method for setting graph properties. It can be used like this: obj.Set('chart.strokestyle', '#666');
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
            * This should be done first - prepend the property name with "chart." if necessary
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
        * A getter method for retrieving graph properties. It can be used like this: obj.Get('chart.strokestyle');
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
        * Draws the axes
        */
        this.draw =
        this.Draw = function ()
        {
            /**
            * Fire the onbeforedraw event
            */
            RG.fireCustomEvent(this, 'onbeforedraw');
    
            /**
            * Some defaults
            */
            this.marginTop    = prop['chart.margin.top'];
            this.marginBottom = prop['chart.margin.bottom'];
            
            
            /**
            * Stop this growing uncntrollably
            */
            this.coordsText = [];
            
            
    
            if (!prop['chart.text.color'])  prop['chart.text.color']  = prop['chart.colors'][0];
            if (!prop['chart.title.color']) prop['chart.title.color'] = prop['chart.text.color'];
    
            /**
            * Parse the colors. This allows for simple gradient syntax
            */
            if (!this.colorsParsed) {
    
                this.parseColors();
    
                // Don't want to do this again
                this.colorsParsed = true;
            }
    
    
    
            // DRAW Y AXIS HERE
            this.drawYAxis();
    
    
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
            * Fire the ondraw event
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
        * The getObjectByXY() worker method
        */
        this.getObjectByXY = function (e)
        {
            if (this.getShape(e)) {
                return this;
            }
        };








        /**
        * Not used by the class during creating the axis, but is used by event handlers
        * to get the coordinates (if any) of the selected shape
        * 
        * @param object e The event object
        */
        this.getShape = function (e)
        {
            var mouseXY = RG.getMouseXY(e);
            var mouseX  = mouseXY[0];
            var mouseY  = mouseXY[1];
    
            if (   mouseX >= this.x - (prop['chart.tickmarks.align'] ==  'right' ? 0 : this.getWidth())
                && mouseX <= this.x + (prop['chart.tickmarks.align'] ==  'right' ? this.getWidth() : 0)
                && mouseY >= this.marginTop
                && mouseY <= (ca.height - this.marginBottom)
               ) {
                
                var x = this.x;
                var y = this.marginTop;
                var w = 15;;
                var h = ca.height - this.marginTop - this.marginBottom;
    
                return {
                    0: this, 1: x, 2: y, 3: w, 4: h, 5: 0,
                    'object': this, 'x': x, 'y': y, 'width': w, 'height': h, 'index': 0, 'tooltip': prop['chart.tooltips'] ? prop['chart.tooltips'][0] : null
                };
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
            }
        };








        /**
        * This allows for easy specification of gradients
        */
        this.parseColors = function ()
        {

            // Save the original colors so that they can be restored when the canvas is reset
            if (this.original_colors.length === 0) {
                this.original_colors['chart.yaxis.labels.color'] = RG.arrayClone(prop['chart.yaxis.labels.color']);
                this.original_colors['chart.title.color'] = RG.arrayClone(prop['chart.title.color']);
                this.original_colors['chart.text.color'] = RG.arrayClone(prop['chart.text.color']);
                this.original_colors['chart.colors']     = RG.arrayClone(prop['chart.colors']);
            }




            /**
            * Parse various properties for colors
            */
            prop['chart.yaxis.labels.color'] = this.parseSingleColorForGradient(prop['chart.yaxis.labels.color']);
            prop['chart.title.color']        = this.parseSingleColorForGradient(prop['chart.title.color']);
            prop['chart.text.color']         = this.parseSingleColorForGradient(prop['chart.text.color']);
            prop['chart.colors'][0]          = this.parseSingleColorForGradient(prop['chart.colors'][0]);
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
            if (!color) {
                return color;
            }
    
            if (typeof color === 'string' && color.match(/^gradient\((.*)\)$/i)) {



                // Allow for JSON gradients
                if (color.match(/^gradient\(({.*})\)$/i)) {
                    return RGraph.parseJSONGradient({object: this, def: RegExp.$1});
                }

                var parts = RegExp.$1.split(':');
    
                // Create the gradient
                var grad = co.createLinearGradient(0,prop['chart.margin.top'],0,ca.height - this.marginBottom);
    
                var diff = 1 / (parts.length - 1);
    
                grad.addColorStop(0, RG.trim(parts[0]));
    
                for (var j=1; j<parts.length; ++j) {
                    grad.addColorStop(j * diff, RG.trim(parts[j]));
                }
            }
    
            return grad ? grad : color;
        };








        /**
        * The function that draws the Y axis
        */
        this.drawYAxis =
        this.DrawYAxis = function ()
        {
            var x               = this.x,
                y               = this.marginTop,
                height          = ca.height - this.marginBottom - this.marginTop,
                min             = +prop['chart.yaxis.scale.min'] ? +prop['chart.yaxis.scale.min'] : 0,
                max             = +prop['chart.yaxis.scale.max'],
                title           = prop['chart.yaxis.title'] ? prop['chart.yaxis.title'] : '',
                color           = prop['chart.colors'] ? prop['chart.colors'][0] : 'black',
                title_color     = prop['chart.yaxis.title.color'] ? prop['chart.yaxis.title.color'] : color,
                label_color     = prop['chart.text.color'] ? prop['chart.text.color'] : color,
                numticks        = typeof(prop['chart.yaxis.tickmarks.count']) == 'number' ? prop['chart.yaxis.tickmarks.count'] : 10,
                labels_specific = prop['chart.yaxis.labels.specific'],
                numlabels       = prop['chart.yaxis.labels.count'] ? prop['chart.yaxis.labels.count'] : 5,
                font            = prop['chart.text.font'] ? prop['chart.text.font'] : 'Arial, Verdana, sans-serif',
                size            = prop['chart.text.size'] ? prop['chart.text.size'] : 12
                align           = typeof(prop['chart.yaxis.tickmarks.align']) == 'string'? prop['chart.yaxis.tickmarks.align'] : 'left',
                formatter       = prop['chart.yaxis.scale.formatter'],
                decimals        = prop['chart.yaxis.scale.decimals'],
                invert          = prop['chart.yaxis.scale.invert'],
                scale_visible   = prop['chart.yaxis.scale.visible'],
                units_pre       = prop['chart.yaxis.scale.units.pre'],
                units_post      = prop['chart.yaxis.scale.units.post'],
                linewidth       = prop['chart.linewidth'] ? prop['chart.linewidth'] : 1,
                notopendtick    = !prop['chart.yaxis.tickmarks.last.top'],
                nobottomendtick = !prop['chart.yaxis.tickmarks.last.bottom'],
                yaxis           = prop['chart.yaxis'],
                xaxispos        = prop['chart.xaxis.position']

    
            // This fixes missing corner pixels in Chrome
            co.lineWidth = linewidth + 0.001;
    
    
            /**
            * Set the color
            */
            co.strokeStyle = color;

            if (yaxis) {
                /**
                * Draw the main vertical line
                */

                pa2(co,
                    'b m % % l % % s %',
                    Math.round(x),
                    y,
                    Math.round(x),
                    y + height,
                    color
                );
    
                /**
                * Draw the axes tickmarks
                */
                if (numticks) {
                    
                    var gap = (xaxispos == 'center' ? height / 2 : height) / numticks;
                    var halfheight = height / 2;
    
                    co.beginPath();
                        for (var i=(notopendtick ? 1 : 0); i<=(numticks - (nobottomendtick || xaxispos == 'center'? 1 : 0)); ++i) {
                            pa2(co, ['m',align == 'right' ? x + 3 : x - 3, Math.round(y + (gap *i)),'l',x, Math.round(y + (gap *i))]);
                        }
                        
                        // Draw the bottom halves ticks if the X axis is in the center
                       if (xaxispos == 'center') {
                            for (var i=1; i<=numticks - (nobottomendtick ? 1 : 0); ++i) {
                                pa2(co, ['m',align == 'right' ? x + 3 : x - 3, Math.round(y + halfheight + (gap *i)),'l',x, Math.round(y + halfheight + (gap *i))]);
                            }
                        }
                    co.stroke();
                }
            }
    
    
            /**
            * Draw the scale for the axes
            */
            co.fillStyle = label_color;
            //co.beginPath();
            var text_len = 0;
                if (scale_visible) {
                    if (labels_specific && labels_specific.length) {
                    
                        var text_len = 0;
    
                        // First - gp through the labels to find the longest
                        for (var i=0,len=labels_specific.length; i<len; i+=1) {
                            text_len = ma.max(text_len, co.measureText(labels_specific[i]).width);
                        }

                        
                        // Get the text configuration
                        var textConf = RG.getTextConf({
                            object: this,
                            prefix: 'chart.yaxis.labels'
                        });

                        for (var i=0,len=labels_specific.length; i<len; ++i) {
                        
                            var gap = (len-1) > 0 ? (height / (len-1)) : 0;
                            
                            if (xaxispos == 'center') {
                                gap /= 2;
                            }

                            RG.text2(this, {

                                 font: textConf.font,
                                 size: textConf.size,
                                 bold: textConf.bold,
                               italic: textConf.italic,
                                color: textConf.color,

                                    x: x - (align == 'right' ? -5 : 5),
                                    y: (i * gap) + this.marginTop,
                                 text: labels_specific[i],
                               valign: 'center',
                               halign: align == 'right' ? 'left' : 'right',
                                  tag: 'scale'
                            });
                            
                            /**
                            * Store the max length so that it can be used if necessary to determine
                            * whether the mouse is over the axis.
                            */
                            this.maxLabelLength = ma.max(this.maxLabelLength, co.measureText(labels_specific[i]).width);
                        }
                        
                        if (xaxispos == 'center') {

                            // It's "-2" so that the center label isn't added twice
                            for (var i=(labels_specific.length-2); i>=0; --i) {
    
                                RG.text2(this, {

                                 font: textConf.font,
                                 size: textConf.size,
                                 bold: textConf.bold,
                               italic: textConf.italic,
                                color: textConf.color,

                                    x:      x - (align == 'right' ? -5 : 5),
                                    y:      ca.height - this.marginBottom - (i * gap),
                                    text:   labels_specific[i],
                                    valign: 'center',
                                    halign: align == 'right' ? 'left' : 'right',
                                    tag:    'scale'
                                });
                            }
                        }

                    } else {


                        // Get the text configuration
                        var textConf = RG.getTextConf({
                            object: this,
                            prefix: 'chart.yaxis.labels'
                        });

                        for (var i=0; i<=numlabels; ++i) {

                            var original = ((max - min) * ((numlabels-i) / numlabels)) + min;
                        
                            if (original == 0 && prop['chart.yaxis.scale.zerostart'] == false) {
                                continue;
                            }
            
                            var text = RG.numberFormat({
                                object:    this,
                                number:    original.toFixed(original === 0 ? 0 : decimals),
                                unitspre:  units_pre,
                                unitspost: units_post,
                                point:     prop['chart.yaxis.scale.point'],
                                thousand:  prop['chart.yaxis.scale.thousand']
                            });
                            var text = String(typeof(formatter) == 'function' ? formatter(this, original) : text);

                            // text_len is used below for positioning the title
                            var text_len = ma.max(text_len, co.measureText(text).width);
                            this.maxLabelLength = text_len;

                            if (invert) {
                                var y = height - ((height / numlabels)*i);
                            } else {
                                var y = (height / numlabels)*i;
                            }
                            
                            if (prop['chart.xaxis.position'] == 'center') {
                                y = y / 2;
                            }
                            
                            // This fixes a bug, Replace this: -,400 with this: -400
                            text = text.replace(/^-,([0-9])/, '-$1');
            

                            // Now - draw the labels
                            RG.text2(this, {

                                 font: textConf.font,
                                 size: textConf.size,
                                 bold: textConf.bold,
                               italic: textConf.italic,
                                color: textConf.color,

                                x:      x - (align == 'right' ? -5 : 5),
                                y:      y + this.marginTop,
                                text:   text,
                                valign: 'center',
                                halign: align == 'right' ? 'left' : 'right',
                                tag:    'scale'
                            });
            
            
            
                            /**
                            * Draw the bottom half of the labels if the X axis is in the center
                            */
                            if (prop['chart.xaxis.position'] == 'center' && i < numlabels) {
                                RG.Text2(this, {

                                 font: textConf.font,
                                 size: textConf.size,
                                 bold: textConf.bold,
                               italic: textConf.italic,
                                color: textConf.color,

                                    x:      x - (align == 'right' ? -5 : 5),
                                    y:ca.   height - this.marginBottom - y,
                                    text:   '-' + text,
                                    valign: 'center',
                                    halign: align == 'right' ? 'left' : 'right',
                                    tag:    'scale'
                                });
                            }
                        }
                    }
                }
            //co.stroke();

            /**
            * Draw the title for the axes
            */
            if (title) {
                co.beginPath();

                    co.fillStyle = title_color;
                    if (labels_specific) {
                        
                        var width = 0;
                        for (var i=0,len=labels_specific.length; i<len; i+=1) {
                            width = Math.max(width, co.measureText(labels_specific[i]).width);
                        }

                    } else {
                        var m =  RG.measureText(prop['chart.yaxis.scale.units.pre'] + prop['chart.yaxis.scale.max'].toFixed(prop['chart.yaxis.scale.decimals']) + prop['chart.yaxis.scale.units.post']),
                            width = m[0];
                    }

                        
                    // Get the text configuration
                    var textConf = RG.getTextConf({
                        object: this,
                        prefix: 'chart.yaxis.title'
                    });


                    RG.text2(this, {

                         font: textConf.font,
                         size: textConf.size,
                         bold: textConf.bold,
                       italic: textConf.italic,
                        color: textConf.color,

                        x:          align == 'right' ? x + width + 13 : x - width - 13,
                        y:          height / 2 + this.marginTop,
                        text:       title,
                        valign:     'bottom',
                        halign:     'center',
                        angle:      align == 'right' ? 90 : -90,
                        accessible: false
                    });
                co.stroke();
            }
        };








        /**
        * This detemines the maximum text width of either the scale or text
        * labels - whichever is given
        * 
        * @return number The maximum text width
        */
        this.getWidth = function ()
        {
            var width = this.maxLabelLength;
            
            // Add the title width if it's specified
            if (prop['chart.yaxis.title'] && prop['chart.yaxis.title'].length) {
                width += (prop['chart.text.size'] * 1.5);
            }

            this.width = width;
            
            return width;
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
        * Objects are now always registered so that the chart is redrawn if need be.
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