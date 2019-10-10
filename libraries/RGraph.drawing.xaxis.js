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
    * first argument and the Y coordinate of the axes as the second
    * 
    * @param string id The canvas tag ID
    * @param number y  The Y coordinate
    */
    RGraph.Drawing.XAxis = function (conf)
    {
        /**
        * Allow for object config style
        */
        if (   typeof conf === 'object'
            && typeof conf.y === 'number'
            && typeof conf.id === 'string') {

            var id = conf.id
            var y  = conf.y;

            var parseConfObjectForOptions = true; // Set this so the config is parsed (at the end of the constructor)
        
        } else {

            var id = conf;
            var y  = arguments[1];
        }




        this.id                = id;
        this.canvas            = document.getElementById(this.id);
        this.context           = this.canvas.getContext('2d');
        this.canvas.__object__ = this;
        this.y                 = y;
        this.coords            = [];
        this.coordsText        = [];
        this.original_colors   = [];
        this.firstDraw         = true; // After the first draw this will be false





        // This is a list of new property names that are used now in place of
        // the old names.
        //
        // *** When adding this list to a new chart library don't forget ***
        // *** the bit of code that also goes in the .set() function     ***
        /*this.propertyNameAliases = {
            'chart.margin.left':                'chart.gutter.left',
            'chart.margin.right':               'chart.gutter.right',
7            'chart.xaxis.labels':               'chart.labels',
            'chart.xaxis.labels.position':      'chart.labels.position',
            'chart.xaxis.labels.count':         'chart.numlabels',
            'chart.xaxis.tickmarks.count':      'chart.numticks',
            'chart.xaxis.tickmarks.align':      'chart.align',
            'chart.yaxis.position':             'chart.yaxispos',
            'chart.xaxis.tickmarks.end.left':   function (opt) {return {name:'chart.noendtick.left',value:!opt.value}},
            'chart.xaxis.tickmarks.end.right':  function (opt) {return {name:'chart.noendtick.right',value:!opt.value}},
            'chart.xaxis':                      function (opt) {return {name:'chart.noxaxis',value:!opt.value}},
            'chart.xaxis.position':             'chart.xaxispos',
            'chart.xaxis.scale.decimals':       'chart.scale.decimals',
            'chart.xaxis.scale.formatter':       'chart.scale.formatter',
            'chart.xaxis.scale.invert':         'chart.scale.invert',
            'chart.xaxis.scale.zerostart':      'chart.scale.zerostart',
            'chart.xaxis.scale.visible':        'chart.visible',
            'chart.xaxis.scale.units.pre':      'chart.units.pre',
            'chart.xaxis.scale.units.post':     'chart.units.post',
            'chart.xaxis.scale.max':            'chart.max',
            'chart.xaxis.scale.min':            'chart.min',
            // [NEW]:[OLD]
        };*/






        /**
        * This defines the type of this shape
        */
        this.type = 'drawing.xaxis';


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
            'chart.margin.left':     25,
            'chart.margin.right':    25,

            'chart.colors':          ['black'],
            
            'chart.text.color':      'black', // Defaults to same as chart.colors
            'chart.text.font':       'Arial, Verdana, sans-serif',
            'chart.text.size':       12,
            'chart.text.bold':       false,
            'chart.text.italic':     false,
            'chart.text.accessible':        true,
            'chart.text.accessible.overflow':'visible',
            'chart.text.accessible.pointerevents': false,

            'chart.xaxis.labels':          null,
            'chart.xaxis.labels.position': 'section',
            'chart.xaxis.labels.count': 5,
            'chart.xaxis.labels.font':   null,
            'chart.xaxis.labels.size':   null,
            'chart.xaxis.labels.color':  null,
            'chart.xaxis.labels.bold':   null,
            'chart.xaxis.labels.italic': null,
            'chart.xaxis.tickmarks.align': 'bottom',
            'chart.xaxis.tickmarks.count': 5,
            'chart.xaxis.tickmarks.last.left': true,
            'chart.xaxis.tickmarks.last.right': true,
            'chart.xaxis.scale.visible':   true,
            'chart.xaxis.scale.formatter': null,
            'chart.xaxis.scale.decimals':  0,
            'chart.xaxis.scale.point':     '.',
            'chart.xaxis.scale.thousand':  ',',
            'chart.xaxis.scale.invert':    false,
            'chart.xaxis.scale.zerostart': true,
            'chart.xaxis.scale.units.pre':       '',
            'chart.xaxis.scale.units.post':      '',
            'chart.xaxis.title':     '',
            'chart.xaxis.title.font':     null,
            'chart.xaxis.title.size':     null,
            'chart.xaxis.title.color':    null,
            'chart.xaxis.title.bold':     null,
            'chart.xaxis.title.italic':   null,
            'chart.xaxis.tickmarks.count': null,
            'chart.xaxis':           true,
            'chart.xaxis.scale.max': null,
            'chart.xaxis.scale.min': 0,
            'chart.xaxis.position':         'bottom',
            
            'chart.yaxis.position':         'left',

            'chart.hmargin':         0,

            'chart.linewidth':       1,
            
            'chart.tooltips':        null,
            'chart.tooltips.effect':   'fade',
            'chart.tooltips.css.class':'RGraph_tooltip',
            'chart.tooltips.event':    'onclick',
            
            'chart.events.click':     null,
            'chart.events.mousemove': null,

            'chart.clearto':   'rgba(0,0,0,0)'
        }

        /**
        * A simple check that the browser has canvas support
        */
        if (!this.canvas) {
            alert('[DRAWING.XAXIS] No canvas support');
            return;
        }
        
        /**
        * Create the dollar object so that functions can be added to them
        */
        this.$0 = {};


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
        * Draws the rectangle
        */
        this.draw =
        this.Draw = function ()
        {
            /**
            * Fire the onbeforedraw event
            */
            RG.FireCustomEvent(this, 'onbeforedraw');
            
            
            
            /**
            * Stop this growing uncntrollably
            */
            this.coordsText = [];







            /**
            * Make the margins easy ro access
            */
            this.marginLeft  = prop['chart.margin.left'];
            this.marginRight = prop['chart.margin.right'];

            /**
            * Parse the colors. This allows for simple gradient syntax
            */
            if (!this.colorsParsed) {
    
                this.parseColors();
    
                // Don't want to do this again
                this.colorsParsed = true;
            }
    
    
    
            // DRAW X AXIS HERE
            this.drawXAxis();
    
    
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
        * Not used by the class during creating the graph, but is used by event handlers
        * to get the coordinates (if any) of the selected shape
        * 
        * @param object e The event object
        */
        this.getShape = function (e)
        {
            var mouseXY = RG.getMouseXY(e);
            var mouseX  = mouseXY[0];
            var mouseY  = mouseXY[1];
    
            if (   mouseX >= this.marginLeft
                && mouseX <= (ca.width - this.marginRight)
                && mouseY >= this.y - (prop['chart.xaxis.tickmarks.align'] ==  'top' ? (prop['chart.text.size'] * 1.5) + 5 : 0)
                && mouseY <= (this.y + (prop['chart.xaxis.tickmarks.align'] ==  'top' ? 0 : (prop['chart.text.size'] * 1.5) + 5))
               ) {
                
                var x = this.marginLeft;
                var y = this.y;
                var w = ca.width - this.marginLeft - this.marginRight;
                var h = 15;
    
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
                this.original_colors['chart.colors']             = RG.arrayClone(prop['chart.colors']),
                this.original_colors['chart.text.color']         = RG.arrayClone(prop['chart.text.color']),
                this.original_colors['chart.xaxis.labels.color'] = RG.arrayClone(prop['chart.xaxis.labels.color']),
                this.original_colors['chart.xaxis.title.color']  = RG.arrayClone(prop['chart.xaxis.title.color'])
            }

            /**
            * Parse various properties for colors
            */
            prop['chart.colors'][0]          = this.parseSingleColorForGradient(prop['chart.colors'][0]);
            prop['chart.text.color']         = this.parseSingleColorForGradient(prop['chart.text.color']);
            prop['chart.xaxis.labels.color'] = this.parseSingleColorForGradient(prop['chart.xaxis.labels.color']);
            prop['chart.xaxis.title.color']  = this.parseSingleColorForGradient(prop['chart.xaxis.title.color']);
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
                var grad = co.createLinearGradient(prop['chart.margin.left'],0,ca.width - prop['chart.margin.right'],0);
    
                var diff = 1 / (parts.length - 1);
    
                grad.addColorStop(0, RG.trim(parts[0]));
    
                for (var j=1,len=parts.length; j<len; ++j) {
                    grad.addColorStop(j * diff, RG.trim(parts[j]));
                }
            }
    
            return grad ? grad : color;
        };








        /**
        * The function that draws the X axis
        */
        this.drawXAxis =
        this.DrawXAxis = function ()
        {
            var marginLeft      = prop['chart.margin.left'],
                marginRight     = prop['chart.margin.right'],
                x               = this.marginLeft,
                y               = this.y,
                min             = +prop['chart.xaxis.scale.min'],
                max             = +prop['chart.xaxis.scale.max'],
                labels          = prop['chart.xaxis.labels'],
                labels_position = prop['chart.xaxis.labels.position'],
                color           = prop['chart.colors'][0],
                title_color     = prop['chart.xaxis.title.color'],
                width           = ca.width - this.marginLeft - this.marginRight,
                align           = prop['chart.xaxis.tickmarks.align'],
                numlabels       = prop['chart.xaxis.labels.count'],
                formatter       = prop['chart.xaxis.scale.formatter'],
                decimals        = Number(prop['chart.xaxis.scale.decimals']),
                invert          = prop['chart.xaxis.scale.invert'],
                scale_visible   = prop['chart.xaxis.scale.visible'],
                units_pre       = prop['chart.xaxis.scale.units.pre'],
                units_post      = prop['chart.xaxis.scale.units.post'],
                title           = prop['chart.xaxis.title']
                numticks        = prop['chart.xaxis.tickmarks.count'],
                hmargin         = prop['chart.hmargin'],
                linewidth       = prop['chart.linewidth'],
                leftendtick     = prop['chart.xaxis.tickmarks.last.left'],
                rightendtick    = prop['chart.xaxis.tickmarks.last.right'],
                noxaxis         = !prop['chart.xaxis'],
                xaxispos        = prop['chart.xaxis.position'],
                yaxispos        = prop['chart.yaxis.position']

    
            if (RG.isNull(numticks)) {
                if (labels && labels.length) {
                    numticks = labels.length;
                } else if (!labels && max != 0) {
                    numticks = 10;
                } else {
                    numticks = numlabels;
                }
            }
    
            
    
            /**
            * Set the linewidth
            */
            co.lineWidth = linewidth + 0.001;
    
            /**
            * Set the color
            */
            co.strokeStyle = color;
    
            if (!noxaxis) {
                /**
                * Draw the main horizontal line
                */
                pa2(
                    co,
                    'b m % % l % % s %',
                    x, ma.round(y),
                    x + width, ma.round(y),
                    co.strokeStyle
                );
    
                /**
                * Draw the axis tickmarks
                */
                co.beginPath();
                    for (var i=(leftendtick ? 0 : 1); i<=(numticks - (rightendtick ? 0 : 1)); ++i) {
                        
                        if (yaxispos === 'center' && i === (numticks / 2) ) {
                            continue;
                        }
                        
                        co.moveTo(
                            ma.round(x + ((width / numticks) * i)),
                            xaxispos === 'center' ? (align === 'bottom' ? y - 3 : y + 3) : y
                        );
                        
                        co.lineTo(
                            ma.round(x + ((width / numticks) * i)),
                            y + (align == 'bottom' ? 3 : -3)
                        );
                    }
                co.stroke();
            }
    
    
    
            /**
            * Draw the labels
            */
            if (labels) {

                // Get the text configuration
                var textConf = RG.getTextConf({
                    object: this,
                    prefix: 'chart.xaxis.labels'
                });

                /**
                * Draw the labels
                */
                numlabels = labels.length;
                var h = 0;
                var l = 0;
                var single_line = RG.MeasureText(
                    'Mg',
                    false,
                    textConf.font,
                    textConf.size
                );
    
                // Measure the maximum height
                for (var i=0,len=labels.length; i<len; ++i) {
                    var dimensions = RG.measureText(labels[i], false, textConf.font, textConf.size);
                    var h = ma.max(h, dimensions[1]);
                    var l = ma.max(l, labels[i].split('\r\n').length);
                }

                for (var i=0,len=labels.length; i<len; ++i) {
                
                    if (labels_position == 'edge') {
                        var x = ((((width - hmargin - hmargin) / (labels.length - 1)) * i) + marginLeft + hmargin);
                    } else {
                        var graphWidth = (width - hmargin - hmargin);
                        var label_segment_width = (graphWidth / labels.length);

                        var x = ((label_segment_width * i) + (label_segment_width / 2) + marginLeft + hmargin);
                    }

                
                    RG.text2(this,{
                        
                        font:   textConf.font,
                        size:   textConf.size,
                        color:  textConf.color,
                        bold:   textConf.bold,
                        italic: textConf.italic,

                        x:      x,
                        y:      align == 'bottom' ? y + 5 : y - 5 - h + single_line[1],
                        text:   String(labels[i]),
                        valign: align == 'bottom' ? 'top' : 'bottom',
                        halign: 'center',
                        tag:    'labels'
                    });
                }
        
    
    
    
    
            /**
            * No specific labels - draw a scale
            */
            } else if (scale_visible){

                if (!max) {
                    alert('[DRAWING.XAXIS] If not specifying xaxisLabels you must specify xaxisScaleMax!');
                }

                // yaxispos
                if (yaxispos == 'center') {
                    width /= 2;
                    var additionalX = width;            
                } else {
                    var additionalX = 0;
                }
                    
                // Get the text configuration
                var textConf = RG.getTextConf({
                    object: this,
                    prefix: 'chart.xaxis.labels'
                });

                for (var i=0; i<=numlabels; ++i) {

                    // Don't show zero if the zerostart option is false
                    if (i == 0 && !prop['chart.xaxis.scale.zerostart']) {
                        continue;
                    }

                    var original = (((max - min) / numlabels) * i) + min;
                    var hmargin  = prop['chart.hmargin'];
    
                    if (typeof formatter === 'function') {
                        var text =  formatter(this, original)
                    } else {

                        text = RG.numberFormat({
                            object:    this,
                            number:    original.toFixed(original === 0 ? 0 : decimals),
                            unitspre:  units_pre,
                            unitspost: units_post,
                            point:     prop['chart.xaxis.scale.point'],
                            thousand:  prop['chart.xaxis.scale.thousand']
                        });
                    }

    
                    if (invert) {
                        var x = ((width - hmargin - ((width - hmargin - hmargin) / numlabels) * i)) + marginLeft + additionalX;
                    } else {
                        var x = (((width - hmargin - hmargin) / numlabels) * i) + marginLeft + hmargin + additionalX;
                    }

                    RG.text2(this,{
                        
                        font:   textConf.font,
                        size:   textConf.size,
                        color:  textConf.color,
                        bold:   textConf.bold,
                        italic: textConf.italic,

                        x:      x,
                        y:      align == 'bottom' ? y + 5 : y - 5,
                        text:   text,
                        valign: align == 'bottom' ? 'top' : 'bottom',
                        halign: 'center',
                        tag:    'scale'
                    });
                }



                /**
                * If the Y axis is in the center - this draws the left half of the labels
                */
                if (yaxispos == 'center') {
                  for (var i=0; i<numlabels; ++i) {
        
                        var original = (((max - min) / numlabels) * (numlabels - i)) + min;
                        var hmargin  = prop['chart.hmargin'];
        
                        var text = String(typeof(formatter) == 'function' ? formatter(this, original) : RG.numberFormat({object: this, number: original.toFixed(decimals), unitspre: units_pre, unitspost: units_post}));
        
                        if (invert) {
                            var x = ((width - hmargin - ((width - hmargin - hmargin) / numlabels) * i)) + marginLeft;
                        } else {
                            var x = (((width - hmargin - hmargin) / numlabels) * i) + marginLeft + hmargin;
                        }
        
                        RG.text2(this, {
                        
                            font:   textConf.font,
                            size:   textConf.size,
                            color:  textConf.color,
                            bold:   textConf.bold,
                            italic: textConf.italic,

                            x:      x,
                            y:      align == 'bottom' ? y + 5 : y - 5,'text':'-' + text,
                            valign: align == 'bottom' ? 'top' : 'bottom',
                            halign: 'center',
                            tag:    'scale'
                        });
                    }
                }
            }
    
    
    
            /**
            * Draw the title for the axes
            */

            if (title) {

                // Get the text configuration
                var textConf = RG.getTextConf({
                    object: this,
                    prefix: 'chart.xaxis.title'
                });

                var dimensions = RG.measureText({
                    text: title,
                    bold: textConf.bold,
                    font: textConf.font,
                    size: textConf.size
                });

                RG.text2(this,{

                    font:   textConf.font,
                    size:   textConf.size,
                    color:  textConf.color,
                    bold:   textConf.bold,
                    italic: textConf.italic,

                    x:      (ca.width - this.marginLeft - this.marginRight) / 2 + this.marginLeft,
                    y:      align == 'bottom' ? y + dimensions[1] + 5 : y - dimensions[1] - 5,
                    text:   title,
                    valign: 'top',
                    halign: 'center',
                    tag:    'title'
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
        * This function runs once only
        * (put at the end of the file (before any effects))
        */
        this.firstDrawFunc = function ()
        {
        };








        /**
        * Objects are now always registered so that the chart is redrawn if need be.
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