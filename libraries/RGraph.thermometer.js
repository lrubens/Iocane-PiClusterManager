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
    * The chart constructor. This function sets up the object. It takes the ID (the HTML attribute) of the canvas as the
    * first argument and the data as the second. If you need to change this, you can.
    * 
    * NB: If tooltips are ever implemented they must go below the use event listeners!!
    * 
    * @param string id    The canvas tag ID
    * @param number min   The minimum value
    * @param number max   The maximum value
    * @param number value The value reported by the thermometer
    */
    RGraph.Thermometer = function (conf)
    {
        /**
        * Allow for object config style
        */
        if (   typeof conf === 'object'
            && typeof conf.id === 'string') {

            var parseConfObjectForOptions = true; // Set this so the config is parsed (at the end of the constructor)
        
        } else {

            var conf = {
                   id: arguments[0],
                  min: arguments[1],
                  max: arguments[2],
                value: arguments[3]
            }
        }




        this.id                = conf.id;
        this.canvas            = document.getElementById(this.id);
        this.context           = this.canvas.getContext ? this.canvas.getContext('2d') : null;
        this.canvas.__object__ = this;
        this.uid               = RGraph.CreateUID();
        this.canvas.uid        = this.canvas.uid ? this.canvas.uid : RGraph.CreateUID();
        this.colorsParsed      = false;
        this.type              = 'thermometer';
        this.isRGraph          = true;
        this.min               = RGraph.stringsToNumbers(conf.min);
        this.max               = RGraph.stringsToNumbers(conf.max);
        this.value             = RGraph.stringsToNumbers(conf.value);
        this.coords            = [];
        this.graphArea         = [];
        this.currentValue      = null;
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
            'chart.margin.left':                 'chart.gutter.left',
            'chart.margin.right':                'chart.gutter.right',
            'chart.margin.top':                  'chart.gutter.top',
            'chart.margin.bottom':               'chart.gutter.bottom',
            'chart.colors.stroke':               'chart.strokestyle',
            'chart.scale.units.pre':             'chart.units.pre',
            'chart.scale.units.post':            'chart.units.post',
            'chart.annotatable.color':           'chart.annotate.color',
            'chart.annotatable.linewidth':       'chart.annotate.linewidth',
            'chart.resizable.handle.background': 'chart.resize.handle.background',
            'chart.labels.value':                'chart.value.label',
            'chart.labels.value.decimals':       'chart.value.label.decimals',
            'chart.labels.value.font':           'chart.value.label.font',
            'chart.labels.value.size':           'chart.value.label.size',
            'chart.labels.value.color':          'chart.value.label.color',
            'chart.labels.value.italic':         'chart.value.label.italic',
            'chart.labels.value.bold':           'chart.value.label.bold',
            /* [NEW]:[OLD] */
        };







        this.properties =
        {
            'chart.linewidth':              1,

            'chart.background.color':       'white',

            'chart.colors.stroke':            'black',
            'chart.colors':                 ['Gradient(#c00:red:#f66:#fcc)'],

            'chart.margin.left':            25,
            'chart.margin.right':           25,
            'chart.margin.top':             25,
            'chart.margin.bottom':          25,

            'chart.tickmarks.size':         2,
            'chart.tickmarks.count':        10,

            'chart.text.color':             'black',
            'chart.text.font':              'Arial, Verdana, sans-serif',
            'chart.text.size':              12,
            'chart.text.bold':              false,
            'chart.text.italic':            false,
            'chart.text.accessible':               true,
            'chart.text.accessible.overflow':      'visible',
            'chart.text.accessible.pointerevents': false,

            'chart.scale.visible':          false,
            'chart.scale.units.pre':        '',
            'chart.scale.units.post':       '',
            'chart.scale.decimals':         0,
            'chart.scale.thousand':         ',',
            'chart.scale.point':            '.',
            
            'chart.title':                  '',
            'chart.title.font':             null,
            'chart.title.size':             null,
            'chart.title.color':            null,
            'chart.title.bold':             null,
            'chart.title.italic':           null,
            'chart.title.side':             '',
            'chart.title.side.bold':        null,
            'chart.title.side.font':        null,
            'chart.title.side.size':        null,
            'chart.title.side.color':       null,
            'chart.title.side.italic':      null,

            'chart.shadow':                 true,
            'chart.shadow.offsetx':         0,
            'chart.shadow.offsety':         0,
            'chart.shadow.blur':            15,
            'chart.shadow.color':           '#ddd',

            'chart.resizable':                   false,
            'chart.resizable.handle.background': null,
            
            'chart.contextmenu':            null,

            'chart.adjustable':             false,

            'chart.labels.value':            true,
            'chart.labels.value.color':      null,
            'chart.labels.value.font':       null,
            'chart.labels.value.size':       null,
            'chart.labels.value.bold':       null,
            'chart.labels.value.italic':     null,
            'chart.labels.value.decimals':   null,
            'chart.labels.value.thousand':   null,
            'chart.labels.value.point':      null,
            'chart.labels.value.units.pre':  null,
            'chart.labels.value.units.post': null,
            
            'chart.labels.count':           5,
            'chart.labels.decimals':        null,
            'chart.labels.units.pre':       null,
            'chart.labels.units.post':      null,
            'chart.labels.point':           null,
            'chart.labels.thousand':        null,
            'chart.labels.color':           null,
            'chart.labels.font':            null,
            'chart.labels.size':            null,
            'chart.labels.bold':            null,
            'chart.labels.italic':          null,

            'chart.annotatable':            false,
            'chart.annotatable.color':         'black',
            'chart.annotatable.linewidth':     1,

            'chart.tooltips':               null,
            'chart.tooltips.highlight':     true,
            'chart.tooltips.effect':        'fade',
            'chart.tooltips.event':         'onclick',

            'chart.highlight.stroke':       'rgba(0,0,0,0)',
            'chart.highlight.fill':         'rgba(255,255,255,0.7)',

            'chart.clearto':                'rgba(0,0,0,0)',

            'chart.bulb.bottom.radius.adjust': 0,
            'chart.bulb.bottom.radius':        null
        }



        /**
        * A simple check that the browser has canvas support
        */
        if (!this.canvas) {
            alert('[THERMOMETER] No canvas support');
            return;
        }
        
        /**
        * The thermometer can only have one data point so only this.$0 needs to be created
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
        * A setter.
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


            
            /**
            * Change of name
            */
            if (name == 'chart.ylabels.count') {
                name = 'chart.labels.count';
            }
            prop[name.toLowerCase()] = value;
    
            return this;
        };








        /**
        * A getter.
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
        * Draws the thermometer
        */
        this.draw =
        this.Draw = function ()
        {
            // Fire the custom RGraph onbeforedraw event (which should be fired before the chart is drawn)
            RG.fireCustomEvent(this, 'onbeforedraw');
            
            // Max/min boundary constraints
            this.value = ma.min(this.max, this.value);
            this.value = ma.max(this.min, this.value);
    
            /**
            * Parse the colors. This allows for simple gradient syntax
            */
            if (!this.colorsParsed) {
                this.parseColors();
                
                // Don't want to do this again
                this.colorsParsed = true;
            }
    
            /**
            * Set the current value
            */
            this.currentValue = this.value;



            /**
            * Stop this growing uncontrollably
            */
            this.coordsText = [];



            /**
            * Make the margins easy to access
            */
            this.marginLeft   = prop['chart.margin.left'];
            this.marginRight  = prop['chart.margin.right'];
            this.marginTop    = prop['chart.margin.top'];
            this.marginBottom = prop['chart.margin.bottom'];
            

            // Get the scale
            this.scale2 = RG.getScale2(
                this, {
                    'scale.max':        this.max,
                    'scale.min':        this.min,
                    'scale.strict':     true,
                    'scale.thousand':   prop['chart.scale.thousand'],
                    'scale.point':      prop['chart.scale.point'],
                    'scale.decimals':   prop['chart.scale.decimals'],
                    'ylabels.count':    prop['chart.labels.count'],
                    'scale.round':      prop['chart.scale.round'],
                    'scale.units.pre':  prop['chart.scale.units.pre'],
                    'scale.units.post': prop['chart.scale.units.post']
                }
            );



            // Work out the coordinates and positions

            this.x      = this.marginLeft;
            this.width  = ca.width - this.marginLeft - this.marginRight;
            this.y      = this.marginTop + (this.width / 2);


            this.halfWidth = this.width / 2;

            this.bulbTopCenterx    = this.marginLeft + (this.width / 2);
            this.bulbTopCentery    = this.marginTop + (this.width / 2);
            this.bulbTopRadius     = this.width / 2;
            this.bulbBottomCenterx = this.marginLeft + (this.width / 2);
            this.bulbBottomRadius  = typeof prop['chart.bulb.bottom.radius'] === 'number' ? prop['chart.bulb.bottom.radius'] : this.width * 0.75 + prop['chart.bulb.bottom.radius.adjust'];
            this.bulbBottomCentery = ca.height - this.marginBottom - this.bulbBottomRadius;

            this.scaleTopY    = this.bulbTopCentery;
            this.scaleBottomY = this.bulbBottomCentery - this.bulbBottomRadius;
            this.scaleHeight  = this.scaleBottomY - this.scaleTopY;
            
            this.height = this.getYCoord(this.min) - this.getYCoord(this.value);

            this.coords[0] = [
                this.x,
                this.getYCoord(this.value),
                this.width,
                this.height
            ];

            // Draw the background
            this.drawBackground();
    
            // Draw the bar that represents the value
            this.drawBar();
    
            // Draw the tickmarks
            this.drawTickMarks();

            /**
            * Draw the label
            */
            this.drawLabels();



            /**
            * Draw the title
            */
            if (prop['chart.title']) {
                this.drawTitle();
            }
            
            /**
            * Draw the side title
            */
            if (prop['chart.title.side']) {
                this.drawSideTitle();
            }
            
            /**
            * This function enables resizing
            */
            if (prop['chart.resizable']) {
                RG.allowResizing(this);
            }
    
    
    
            
            /**
            * Setup the context menu if required
            */
            if (prop['chart.contextmenu']) {
                RG.showContext(this);
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
            * Fire the custom RGraph ondraw event (which should be fired when you have drawn the chart)
            */
            RG.fireCustomEvent(this, 'ondraw');

            return this;
        };








        /**
        * Draws the thermometer itself
        */
        this.drawBackground =
        this.DrawBackground = function ()
        {
            if (prop['chart.shadow']) {
                RG.setShadow(
                    this,
                    prop['chart.shadow.color'],
                    prop['chart.shadow.offsetx'],
                    prop['chart.shadow.offsety'],
                    prop['chart.shadow.blur']
                );
            }

            // Draw the outline and background
            this.pathBackground();
            
            co.strokeStyle = prop['chart.colors.stroke'];
            co.fillStyle   = prop['chart.background.color'];
            co.lineWidth   = 1 + prop['chart.linewidth'];
            
            co.stroke();
            co.fill();
            
            co.lineWidth = 1;
        };


    





        /**
        * This draws the bar that indicates the value of the thermometer. It makes use
        * of the .pathBar() function.
        */
        this.drawBar =
        this.DrawBar = function ()
        {
            this.pathBar();
            
            pa2(co, 'f %', prop['chart.colors'][0]);
        };








        //
        // This function draws the path that indicates the specified value. It
        // doesn't stroke or fill the path.
        //
        this.pathBar = function ()
        {
            var barHeight = this.coords[0][3],
                y         = (this.coords[0][1] + this.coords[0][3]) - barHeight

            RG.noShadow(this);

            // Draw the actual bar that indicates the value
            pa2(co, 
                'b r % % % % a % % % 0 6.28 false',
                
                this.coords[0][0],
                y,
                this.coords[0][2],
                this.bulbBottomCentery - y,
                
                this.bulbBottomCenterx,
                this.bulbBottomCentery,
                this.bulbBottomRadius
            );
        };








        //
        // This function draws the path that indicates that encompasses the
        // background. It's used by the overChartArea() function.
        //
        this.pathBackground = function ()
        {
            pa2(
                this.context,
                'b   r % % % %   a % % % 0 6.28 false   m % %   a % % % 0 6.28 false',
                
                this.x,
                this.scaleTopY,
                this.coords[0][2],
                this.bulbBottomCentery - this.scaleTopY,
                
                this.bulbTopCenterx,
                this.bulbTopCentery,
                this.bulbTopRadius,
                
                this.bulbBottomCenterx,
                this.bulbBottomCentery,
                
                this.bulbBottomCenterx,
                this.bulbBottomCentery,
                this.bulbBottomRadius
            );
        };








        /**
        * Draws the tickmarks of the thermometer
        */
        this.drawTickMarks =
        this.DrawTickMarks = function ()
        {
            if (prop['chart.numticks']) {
                
                var ticksize = prop['chart.tickmarks.size'];
    
                co.strokeStyle = prop['chart.colors.stroke'];
                co.lineWidth   = prop['chart.linewidth'] / 2;
        
                // Left hand side tickmarks
                co.beginPath();
                    for (var i=0; i<=prop['chart.tickmarks.count']; ++i) {
                        
                        var y = this.scaleBottomY - ((this.scaleHeight / prop['chart.tickmarks.count']) * i);

                        co.moveTo(this.marginLeft, ma.round(y));
                        co.lineTo(this.marginLeft + ticksize, ma.round(y));
    
                        // Right hand side tickmarks
                        co.moveTo(ca.width - this.marginRight, ma.round(y));
                        co.lineTo(ca.width - this.marginRight - ticksize, ma.round(y));
                    }
                co.stroke();
                
                co.lineWidth = 1;
            }
        };








        /**
        * Draws the labels of the thermometer. Now (4th August 2011) draws
        * the scale too
        */
        this.drawLabels =
        this.DrawLabels = function ()
        {
            /**
            * This draws draws the label that sits at the top of the chart
            */
            if (prop['chart.labels.value']) {

                // Weird...
                var text = prop['chart.scale.visible'] ?
                           RG.numberFormat({
                                object: this,
                                number: this.value.toFixed(typeof prop['chart.labels.value.decimals'] === 'number' ? prop['chart.labels.value.decimals'] : prop['chart.scale.decimals']),
                                unitspre:  typeof prop['chart.labels.value.units.pre'] === 'string' ? prop['chart.labels.value.units.pre'] : prop['chart.scale.units.pre'],
                                unitspost: typeof prop['chart.labels.value.units.post'] === 'string' ? prop['chart.labels.value.units.post'] : prop['chart.scale.units.post'],
                                point:     typeof prop['chart.labels.value.point'] === 'string' ? prop['chart.labels.value.point'] : prop['chart.scale.point'],
                                thousand:  typeof prop['chart.labels.value.thousand'] === 'string' ? prop['chart.labels.value.thousand'] : prop['chart.scale.thousand']
                           })
                           :
                           RG.numberFormat({
                                object:    this,
                                number:    this.value.toFixed(typeof prop['chart.labels.value.decimals'] === 'number' ? prop['chart.labels.value.decimals'] : prop['chart.scale.decimals']),
                                unitspre:  typeof prop['chart.labels.value.units.pre'] === 'string' ? prop['chart.labels.value.units.pre'] : prop['chart.scale.units.pre'],
                                unitspost: typeof prop['chart.labels.value.units.post'] === 'string' ? prop['chart.labels.value.units.post'] : prop['chart.scale.units.post'],
                                point:     typeof prop['chart.labels.value.point'] === 'string' ? prop['chart.labels.value.point'] : prop['chart.scale.point'],
                                thousand:  typeof prop['chart.labels.value.thousand'] === 'string' ? prop['chart.labels.value.thousand'] : prop['chart.scale.thousand']
                           });

                var textConf = RG.getTextConf({
                    object: this,
                    prefix: 'chart.labels.value'
                });

                RG.text2(this, {

                   font:   textConf.font,
                   size:   textConf.size,
                   color:  textConf.color,
                   bold:   textConf.bold,
                   italic: textConf.italic,

                    x:          this.coords[0][0] + (this.coords[0][2] / 2),
                    y:          this.coords[0][1] + 7,
                    text:       text,
                    valign:     'top',
                    halign:     'center',
                    bounding:   true,
                    boundingFill:'white',
                    tag:        'labels.value'
                });
            }
    
    
            /**
            * Draw the scale if requested
            */
            if (prop['chart.scale.visible']) {
                this.drawScale();
            }
        };








        /**
        * Draws the title
        */
        this.drawTitle =
        this.DrawTitle = function ()
        {
            var textConf = RG.getTextConf({
                object: this,
                prefix: 'chart.title'
            });


            RG.text2(this, {

               font:   textConf.font,
               size:   textConf.size,
               color:  textConf.color,
               bold:   textConf.bold,
               italic: textConf.italic,

                x:      this.marginLeft + (this.width / 2),
                y:      this.marginTop - 3,
                text:   String(prop['chart.title']),
                valign: 'bottom',
                halign: 'center',
                bold:   true,
                tag:   'title'
            });
        };








        /**
        * Draws the title
        */
        this.drawSideTitle =
        this.DrawSideTitle = function ()
        {
            var textConf = RG.getTextConf({
                object: this,
                prefix: 'chart.title.side'
            });

            co.fillStyle = prop['chart.text.color'];
            RG.text2(this, {

               font:   textConf.font,
               size:   textConf.size,
               color:  textConf.color,
               bold:   textConf.bold,
               italic: textConf.italic,

                x:          this.marginLeft - 3,
                y:          (this.scaleHeight / 2) + this.marginTop + this.bulbTopRadius,
                text:       String(prop['chart.title.side']),
                valign:     'bottom',
                halign:     'center',
                angle:      270,
                tag:        'title.side',
                accessible: false
            });
        };








        /**
        * Draw the scale if requested
        */
        this.drawScale =
        this.DrawScale = function ()
        {
            co.fillStyle = prop['chart.text.color'];
            
            var units_pre  = prop['chart.scale.units.pre'],
                units_post = prop['chart.scale.units.post'],
                decimals   = typeof prop['chart.labels.decimals'] === 'number' ? prop['chart.labels.decimals'] : prop['chart.scale.decimals'],
                numLabels  = prop['chart.labels.count'],
                step       = (this.max - this.min) / numLabels;

            for (var i=1; i<=numLabels; ++i) {
    
                var x    = ca.width - this.marginRight + (prop['chart.linewidth'] / 2),
                    y    = ca.height - this.marginBottom - (2 * this.bulbBottomRadius) - ((this.scaleHeight / numLabels) * i),
                    text = RG.numberFormat({
                        object:    this,
                        number:    String((this.min + (i * step)).toFixed(decimals)),
                        unitspre:  typeof prop['chart.labels.units.pre']  === 'string' ? prop['chart.labels.units.pre']  : prop['chart.scale.units.pre'],
                        unitspost: typeof prop['chart.labels.units.post'] === 'string' ? prop['chart.labels.units.post'] : prop['chart.scale.units.post'],
                        point:     typeof prop['chart.labels.point']      === 'string' ? prop['chart.labels.point']      : prop['chart.scale.point'],
                        thousand:  typeof prop['chart.labels.thousand']   === 'string' ? prop['chart.labels.thousand']   : prop['chart.scale.thousand']
                    });

                var textConf = RG.getTextConf({
                    object: this,
                    prefix: 'chart.labels'
                });

                RG.text2(this, {

               font:        textConf.font,
               size:        textConf.size,
               color:       textConf.color,
               bold:        textConf.bold,
               italic:      textConf.italic,

                    x:      x + 6,
                    y:      y,
                    text:   text,
                    valign: 'center',
                    tag:    'scale'
                });
            }
            
            // Draw zero
            RG.text2(this, {

               font:        textConf.font,
               size:        textConf.size,
               color:       textConf.color,
               bold:        textConf.bold,
               italic:      textConf.italic,

                x:      x + 6,
                y:      this.bulbBottomCentery - this.bulbBottomRadius,
                text:   RG.numberFormat({
                    object:    this,
                    number:    this.min.toFixed(decimals),
                    unitspre:  typeof prop['chart.labels.units.pre']  === 'string' ? prop['chart.labels.units.pre']  : prop['chart.scale.units.pre'],
                    unitspost: typeof prop['chart.labels.units.post'] === 'string' ? prop['chart.labels.units.post'] : prop['chart.scale.units.post'],
                    point:     typeof prop['chart.labels.point']      === 'string' ? prop['chart.labels.point']      : prop['chart.scale.point'],
                    thousand:  typeof prop['chart.labels.thousand']   === 'string' ? prop['chart.labels.thousand']   : prop['chart.scale.thousand']
                }),
                valign: 'center',
                tag:    'scale'
            });
        };








        /**
        * Returns the focused/clicked bar
        * 
        * @param event  e The event object
        */
        this.getShape =
        this.getBar = function (e)
        {
            var mouseXY = RG.getMouseXY(e),
                mouseX  = mouseXY[0],
                mouseY  = mouseXY[1];

            for (var i=0; i<this.coords.length; i++) {

                var coords  = this.coords[i],
                    left    = coords[0],
                    top     = coords[1],
                    width   = coords[2],
                    height  = coords[3];
                
                this.pathBar();
    
                if (co.isPointInPath(mouseX, mouseY)) {    
                
                    var tooltip = RG.parseTooltipText ? RG.parseTooltipText(prop['chart.tooltips'], i) : '';
    
                    return {
                        0: this,   object:  this,
                        1: left,   x:       left,
                        2: top,    y:       top,
                        3: width,  width:   width,
                        4: height, height:  height,
                        5: i,      index:   i,
                                   tooltip: tooltip
                    };
                }
            }
            
            return null;
        };








        /**
        * This function returns the value that the mouse is positioned t, regardless of
        * the actual indicated value.
        * 
        * @param object e The event object (or it can also be an two element array containing the X/Y coords)
        */
        this.getValue = function (arg)
        {
            if (arg.length === 2) {
                var mouseX = arg[0],
                    mouseY = arg[1];
            } else {
                var mouseXY = RG.getMouseXY(arg),
                    mouseX  = mouseXY[0],
                    mouseY  = mouseXY[1];
            }

            var value  = (this.scaleHeight - (mouseY - this.scaleTopY)) / this.scaleHeight;
                value *= (this.max - this.min);
                value += this.min;

            value = ma.max(value, this.min);
            value = ma.min(value, this.max);

            return value;
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
                
                this.pathBar();
            
                pa2(co, 's % f %',
                    prop['chart.highlight.stroke'],
                    prop['chart.highlight.fill']
                );
            }
        };








        /**
        * The getObjectByXY() worker method. Don't call this - call:
        * 
        * RGraph.ObjectRegistry.getObjectByXY(e)
        * 
        * @param object e The event object
        */
        this.getObjectByXY = function (e)
        {

            var mouseXY = RG.getMouseXY(e),
                mouseX  = mouseXY[0],
                mouseY  = mouseXY[1]
            
            // Draw the background shape (don't stroke or fill it)
            this.pathBackground();

            if (co.isPointInPath(mouseX, mouseY)) {
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
            * Handle adjusting for the Thermometer
            */
            if (prop['chart.adjustable'] && RG.Registry.get('chart.adjusting') && RG.Registry.get('chart.adjusting').uid == this.uid) {
    
                var mouseXY = RG.getMouseXY(e),
                    value   = this.getValue(e);

                if (typeof(value) == 'number') {
    
                    // Fire the onadjust event
                    RG.fireCustomEvent(this, 'onadjust');
    
                    this.value = Number(value.toFixed(prop['chart.scale.decimals']));
    
                    RG.redrawCanvas(ca);
                }
            }
        };








        /**
        * Returns the appropriate Y coord for a value
        * 
        * @param number value The value to return the coord for
        */
        this.getYCoord = function (value)
        {
            if (value > this.max || value < this.min) {
                return null;
            }

            var y = ma.abs(value - this.min) / ma.abs(this.max - this.min)
                y = y * (this.scaleBottomY - this.scaleTopY);


            return this.scaleBottomY - y;
        };








        /**
        * This returns true/false as to whether the cursor is over the chart area.
        * The cursor does not necessarily have to be over the bar itself.
        */
        this.overChartArea = function  (e)
        {
            var mouseXY = RG.getMouseXY(e),
                mouseX  = mouseXY[0],
                mouseY  = mouseXY[1];
            
            this.pathBackground();
            
            return co.isPointInPath(mouseX, mouseY);
        };








        /**
        * This allows for easy specification of gradients
        */
        this.parseColors = function ()
        {
            // Save the original colors so that they can be restored when the canvas is reset
            if (this.original_colors.length === 0) {
                this.original_colors['chart.colors'] = RG.arrayClone(prop['chart.colors']);
            }





            var colors = prop['chart.colors'];
    
            for (var i=0; i<colors.length; ++i) {
                colors[i] = this.parseSingleColorForGradient(colors[i]);
            }
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
                var grad = co.createLinearGradient(
                    prop['chart.margin.left'],
                    0,
                    ca.width - prop['chart.margin.right'],
                    0
                );
    
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








        /**
        * This function runs once only
        * (put at the end of the file (before any effects))
        */
        this.firstDrawFunc = function ()
        {
        };








        /**
        * Gauge Grow
        * 
        * This effect gradually increases the represented value
        * 
        * @param object   obj The chart object
        * @param              Not used - pass null
        * @param function     An optional callback function
        */
        this.grow = function ()
        {
            var obj       = this,
                callback  = arguments[1] || function () {},
                opt       = arguments[0] || {},
                frames    = opt.frames ? opt.frames : 30,
                origValue = Number(obj.currentValue),
                newValue  = obj.value;

            newValue = ma.min(newValue, this.max);
            newValue = ma.max(newValue, this.min);
            
            var diff      = newValue - origValue,
                step      = (diff / frames),
                frame     = 0;
            

            function iterate ()
            {
                // Set the new value
                obj.value = (step * frame) + origValue;

                RG.clear(obj.canvas);
                RG.redrawCanvas(obj.canvas);
    
                if (frame < frames) {
                    frame++;
                    RG.Effects.updateCanvas(iterate);
                } else {
                    callback(obj);
                }
            }
    
            iterate();
            
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
    };