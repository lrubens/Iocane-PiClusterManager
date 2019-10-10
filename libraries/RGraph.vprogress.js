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
    * The progress bar constructor
    * 
    * @param mixed conf This can either be an object that contains all of the configuration data
    *                   (the updated way of configuring the object) or it can be a string consisting of the
    *                   canvas ID
    * @param number     The minimum value (if using the older configuration style)
    * @param number     The maximum value (if using the older configuration style)
    * @param number     The represented value (if using the older configuration style)
    */
    RGraph.VProgress = function (conf)
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
        this.context           = this.canvas.getContext('2d');
        this.canvas.__object__ = this;

        this.min               = RGraph.stringsToNumbers(conf.min);
        this.max               = RGraph.stringsToNumbers(conf.max);
        this.value             = RGraph.stringsToNumbers(conf.value);
        this.type              = 'vprogress';
        this.coords            = [];
        this.isRGraph          = true;
        this.currentValue      = null;
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
            'chart.margin.left':                 'chart.gutter.left',
            'chart.margin.right':                'chart.gutter.right',
            'chart.margin.top':                  'chart.gutter.top',
            'chart.margin.bottom':               'chart.gutter.bottom',
            'chart.annotatable.color':           'chart.annotate.color',
            'chart.annotatable.linewidth':       'chart.annotate.linewidth',
            'chart.resizable.handle.background': 'chart.resize.handle.background',
            'chart.tickmarks.outer.count':       'chart.numticks',
            'chart.tickmarks.inner.count':       'chart.numticks.inner',
            'chart.colors.stroke.inner':         'chart.strokestyle.inner',
            'chart.colors.stroke.outer':         'chart.strokestyle.outer',
            'chart.scale.units.pre':             'chart.units.pre',
            'chart.scale.units.post':            'chart.units.post',
            'chart.key.position.margin.boxed':   'chart.key.position.gutter.boxed',
            'chart.bevelled':                    'chart.bevel'
            /* [NEW]:[OLD] */
        };





        /**
        * Compatibility with older browsers
        */
        //RGraph.OldBrowserCompat(this.context);

        this.properties =
        {
            'chart.colors':             ['Gradient(white:#0c0)','Gradient(white:red)','Gradient(white:green)','yellow','pink','cyan','black','white','gray'],
            'chart.colors.stroke.inner':  '#999',
            'chart.colors.stroke.outer':  '#999',

            'chart.tickmarks.outer':       true,
            'chart.tickmarks.inner':       false,
            'chart.tickmarks.outer.count': 0,
            'chart.tickmarks.inner.count': 0,
            'chart.tickmarks.outer.color': '#999',
            'chart.tickmarks.inner.color': '#999',
            
            'chart.margin.left':        25,
            'chart.margin.right':       25,
            'chart.margin.top':         25,
            'chart.margin.bottom':      25,
            'chart.margin.inner':       0,


            'chart.background.color':   'Gradient(#ccc:#eee:#efefef)',

            'chart.shadow':             false,
            'chart.shadow.color':       'rgba(0,0,0,0.5)',
            'chart.shadow.blur':        3,
            'chart.shadow.offsetx':     3,
            'chart.shadow.offsety':     3,

            'chart.title':              '',
            'chart.title.bold':         null,
            'chart.title.italic':       null,
            'chart.title.font':         null,
            'chart.title.size':         null,
            'chart.title.color':        null,
            'chart.title.side':         null,
            'chart.title.side.font':    null,
            'chart.title.side.size':    null,
            'chart.title.side.color':   null,
            'chart.title.side.bold':    null,
            'chart.title.side.italic':  null,

            'chart.text.size':          12,
            'chart.text.color':         'black',
            'chart.text.font':          'Arial, Verdana, sans-serif',
            'chart.text.bold':          false,
            'chart.text.italic':        false,
            'chart.text.accessible':           true,
            'chart.text.accessible.overflow':  'visible',
            'chart.text.accessible.pointerevents': false,

            'chart.contextmenu':        null,

            'chart.scale.decimals':     0,
            'chart.scale.thousand':     ',',
            'chart.scale.point':        '.',
            'chart.scale.units.pre':    '',
            'chart.scale.units.post':   '',

            'chart.tooltips':           null,
            'chart.tooltips.effect':    'fade',
            'chart.tooltips.css.class': 'RGraph_tooltip',
            'chart.tooltips.highlight': true,
            'chart.tooltips.event':     'onclick',

            'chart.highlight.stroke':   'rgba(0,0,0,0)',
            'chart.highlight.fill':     'rgba(255,255,255,0.7)',

            'chart.annotatable':        false,
            'chart.annotatable.color':  'black',

            'chart.arrows':             false,

            'chart.resizable':              false,
            'chart.resizable.handle.adjust':   [0,0],
            'chart.resizable.handle.background': null,

            'chart.labels.inner':                   false,
            'chart.labels.inner.font':              null,
            'chart.labels.inner.size':              null,
            'chart.labels.inner.color':             null,
            'chart.labels.inner.bold':              null,
            'chart.labels.inner.italic':            null,
            'chart.labels.inner.background.fill':   'rgba(255,255,255,0.75)',
            'chart.labels.inner.border':            true,
            'chart.labels.inner.border.linewidth':  1,
            'chart.labels.inner.border.color':      '#ccc',
            'chart.labels.inner.decimals':          0,
            'chart.labels.inner.units.pre':         '',
            'chart.labels.inner.units.post':        '',
            'chart.labels.inner.scale.thousand':    null,
            'chart.labels.inner.scale.point':       null,
            'chart.labels.inner.specific':          null,

            'chart.labels.count':       10,
            'chart.labels.position':    'right',
            'chart.labels.offsetx':    0,
            'chart.labels.offsety':    0,
            'chart.labels.font':       null,
            'chart.labels.size':       null,
            'chart.labels.color':      null,
            'chart.labels.bold':       null,
            'chart.labels.italic':     null,
            'chart.labels.specific':   null,

            'chart.adjustable':         false,

            'chart.key':                null,
            'chart.key.background':     'white',
            'chart.key.position':       'graph',
            'chart.key.halign':             'right',
            'chart.key.shadow':         false,
            'chart.key.shadow.color':   '#666',
            'chart.key.shadow.blur':    3,
            'chart.key.shadow.offsetx': 2,
            'chart.key.shadow.offsety': 2,
            'chart.key.position.gutter.boxed': false,
            'chart.key.position.x':     null,
            'chart.key.position.y':     null,
            'chart.key.color.shape':    'square',
            'chart.key.rounded':        true,
            'chart.key.linewidth':      1,
            'chart.key.colors':         null,
            'chart.key.interactive':    false,
            'chart.key.interactive.highlight.chart.stroke': '#000',
            'chart.key.interactive.highlight.chart.fill': 'rgba(255,255,255,0.7)',
            'chart.key.interactive.highlight.label': 'rgba(255,0,0,0.2)',
            'chart.key.labels.color':   null,
            'chart.key.labels.font':   null,
            'chart.key.labels.size':   null,
            'chart.key.labels.bold':   null,
            'chart.key.labels.italic':   null,
            'chart.key.labels.offsetx':      0,
            'chart.key.labels.offsety':      0,

            'chart.events.click':       null,
            'chart.events.mousemove':   null,

            'chart.border.inner':       true,

            'chart.bevelled':       false,

            'chart.clearto':   'rgba(0,0,0,0)'
        }

        // Check for support
        if (!this.canvas) {
            alert('[PROGRESS] No canvas support');
            return;
        }


        /**
        * Create the dollar objects so that functions can be added to them
        */
        var linear_data = RGraph.arrayLinearize(this.value);
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
        * A generic setter
        * 
        * @param string name  The name of the property to set or it can also be an object containing
        *                     object style configuration
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


            prop[name.toLowerCase()] = value;
    
            return this;
        };








        /**
        * A generic getter
        * 
        * @param string name  The name of the property to get
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
        * Draws the progress bar
        */
        this.draw =
        this.Draw = function ()
        {
            /**
            * Fire the onbeforedraw event
            */
            RG.FireCustomEvent(this, 'onbeforedraw');
    
    
    
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
            * Make the margins easy ro access
            */
            this.marginLeft   = prop['chart.margin.left'];
            this.marginRight  = prop['chart.margin.right'];
            this.marginTop    = prop['chart.margin.top'];
            this.marginBottom = prop['chart.margin.bottom'];
    
            // Figure out the width and height
            this.width  = ca.width - this.marginLeft - this.marginRight;
            this.height = ca.height - this.marginTop - this.marginBottom;
            this.coords = [];



            /**
            * Stop this growing uncontrollably
            */
            this.coordsText = [];




    
            this.Drawbar();
            this.DrawTickMarks();
            this.DrawLabels();
            this.DrawTitles();

            
            /**
            * Draw the bevel effect if requested
            */
            if (prop['chart.bevelled']) {
                this.DrawBevel();
            }
    
    
    
            /**
            * Setup the context menu if required
            */
            if (prop['chart.contextmenu']) {
                RG.ShowContext(this);
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
            * This function enables resizing
            */
            if (prop['chart.resizable']) {
                RG.AllowResizing(this);
            }
            
            /**
            * Instead of using RGraph.common.adjusting.js, handle them here
            */
            this.AllowAdjusting();


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
        * Draw the bar itself
        */
        this.drawbar =
        this.Drawbar = function ()
        {
            /**
            * First get the scale
            */
            this.scale2 = RG.getScale2(this, {
                'scale.max':          this.max,
                'scale.min':          this.min,
                'scale.strict':       true,
                'scale.thousand':     prop['chart.scale.thousand'],
                'scale.point':        prop['chart.scale.point'],
                'scale.decimals':     prop['chart.scale.decimals'],
                'scale.labels.count': prop['chart.labels.count'],
                'scale.round':        prop['chart.scale.round'],
                'scale.units.pre':    prop['chart.scale.units.pre'],
                'scale.units.post':   prop['chart.scale.units.post']
            });


            // Set a shadow if requested
            if (prop['chart.shadow']) {
                RG.setShadow(
                    this,
                    prop['chart.shadow.color'],
                    prop['chart.shadow.offsetx'],
                    prop['chart.shadow.offsety'],
                    prop['chart.shadow.blur']
                );
            }

            // Draw the outline
            co.fillStyle   = prop['chart.background.color'];
            co.strokeStyle = prop['chart.colors.stroke.outer'];

            co.strokeRect(
                this.marginLeft,
                this.marginTop,
                this.width,
                this.height
            );

            co.fillRect(
                this.marginLeft,
                this.marginTop,
                this.width,
                this.height
            );


            // Turn off any shadow
            RG.noShadow(this);

            co.strokeStyle = prop['chart.colors.stroke.outer'];
            co.fillStyle   = prop['chart.colors'][0];
            var margin     = prop['chart.margin.inner'];
            var barHeight  = (ca.height - this.marginTop - this.marginBottom) * ((RG.arraySum(this.value) - this.min) / (this.max - this.min));

            // Draw the actual bar itself
            if (typeof this.value === 'number') {

                co.lineWidth   = 1;
                co.strokeStyle = prop['chart.colors.stroke.inner'];

                if (prop['chart.border.inner']) {
                    this.drawCurvedBar({
                        x:      this.marginLeft + margin,
                        y:      this.marginTop + (this.height - barHeight),
                        width:  this.width - margin - margin,
                        height: barHeight,
                        stroke: prop['chart.colors.stroke.inner']
                    });
                }

                this.drawCurvedBar({
                    x:      this.marginLeft + margin,
                    y:      this.marginTop + (this.height - barHeight),
                    width:  this.width - margin - margin,
                    height: barHeight,
                    fill:   prop['chart.colors'][0]
                });

            } else if (typeof this.value == 'object') {

                co.beginPath();
                co.strokeStyle = prop['chart.colors.stroke.inner'];
    
                var startPoint = ca.height - this.marginBottom;
    
                for (var i=0,len=this.value.length; i<len; ++i) {

                    var segmentHeight = ( (this.value[i] - this.min) / (this.max - this.min) ) * (ca.height - this.marginBottom - this.marginTop);


                    co.beginPath();
                    co.fillStyle = prop['chart.colors'][i];

                    if (prop['chart.border.inner']) {
                        this.drawCurvedBar({
                            x:      this.marginLeft + margin,
                            y:      startPoint - segmentHeight,
                            width:  this.width - margin - margin,
                            height: segmentHeight,
                            stroke: co.strokeStyle
                        });
                    }

                    this.drawCurvedBar({
                       x:      this.marginLeft + margin,
                       y:      startPoint - segmentHeight,
                       width:  this.width - margin - margin,
                       height: segmentHeight,
                       fill: co.fillStyle
                    });
    
    
    
                    // Store the coords
                    this.coords.push([
                        this.marginLeft + margin,
                        startPoint - segmentHeight,
                        this.width - margin - margin,
                        segmentHeight
                    ]);
    
                    startPoint -= segmentHeight;
                }

                //co.stroke();
                co.fill();
            }



            /**
            * Inner inner tickmarks
            */
            if (prop['chart.tickmarks.inner.count'] > 0) {
            
                var spacing = (ca.height - this.marginTop - this.marginBottom) / prop['chart.tickmarks.inner.count'];
    
                co.lineWidth   = 1;
                co.strokeStyle = prop['chart.colors.stroke.inner'];

                co.beginPath();
    
                for (var y = this.marginTop; y<ca.height - this.marginBottom; y+=spacing) {
                    co.moveTo(this.marginLeft, Math.round(y));
                    co.lineTo(this.marginLeft + 3, Math.round(y));
    
                    co.moveTo(ca.width - this.marginRight, Math.round(y));
                    co.lineTo(ca.width - this.marginRight - 3, Math.round(y));
                }
    
                co.stroke();
            }

            co.beginPath();
            co.strokeStyle = prop['chart.colors.stroke.inner'];

            if (typeof this.value == 'number') {
                
                if (prop['chart.border.inner']) {
                    this.drawCurvedBar({
                        x:      this.marginLeft + margin,
                        y:      this.marginTop + this.height - barHeight,
                        width:  this.width - margin - margin,
                        height: barHeight
                    });
                }

                this.drawCurvedBar({
                    x:      this.marginLeft + margin,
                    y:      this.marginTop + this.height - barHeight,
                    width:  this.width - margin - margin,
                    height: barHeight
                });
    
                // Store the coords
                this.coords.push([
                    this.marginLeft + margin,
                    this.marginTop + this.height - barHeight,
                    this.width - margin - margin,
                    barHeight
                ]);
            }

    
            /**
            * Draw the arrows indicating the level if requested
            */
            if (prop['chart.arrows']) {
                var x = this.marginLeft - 4;
                var y = ca.height - this.marginBottom - barHeight;
                
                co.lineWidth = 1;
                co.fillStyle = 'black';
                co.strokeStyle = 'black';
    
                co.beginPath();
                    co.moveTo(x, y);
                    co.lineTo(x - 4, y - 2);
                    co.lineTo(x - 4, y + 2);
                co.closePath();
    
                co.stroke();
                co.fill();
    
                x +=  this.width + 8;
    
                co.beginPath();
                    co.moveTo(x, y);
                    co.lineTo(x + 4, y - 2);
                    co.lineTo(x + 4, y + 2);
                co.closePath();
    
                co.stroke();
                co.fill();
                
                pa2(co, 'b');
            }
    
    

    
            /**
            * Draw the "in-bar" label
            */
            if (prop['chart.labels.inner']) {

                var textConf = RG.getTextConf({
                    object: this,
                    prefix: 'chart.labels.inner'
                });

                RG.text2(this, {

                     font: textConf.font,
                     size: textConf.size,
                    color: textConf.color,
                     bold: textConf.bold,
                   italic: textConf.italic,

                    x:                 ((ca.width - this.marginLeft - this.marginRight) / 2) + this.marginLeft,
                    y:                 this.coords[this.coords.length - 1][1] - 5,
                    text:              typeof prop['chart.labels.inner.specific'] === 'string'
                                            ? 
                                            prop['chart.labels.inner.specific']
                                            :
                                            RG.numberFormat({
                                                object:    this,
                                                number:    RG.arraySum(this.value).toFixed(typeof prop['chart.labels.inner.decimals'] === 'number' ? prop['chart.labels.inner.decimals'] : prop['chart.scale.decimals']),
                                                unitspre:  typeof prop['chart.labels.inner.units.pre']  === 'string' ? prop['chart.labels.inner.units.pre']  : prop['chart.scale.units.pre'],
                                                unitspost: typeof prop['chart.labels.inner.units.post'] === 'string' ? prop['chart.labels.inner.units.post'] : prop['chart.scale.units.post'],
                                                point:     typeof prop['chart.labels.inner.point']      === 'string' ? prop['chart.labels.inner.point']      : prop['chart.scale.point'],
                                                thousand:  typeof prop['chart.labels.inner.thousand']   === 'string' ? prop['chart.labels.inner.thousand']   : prop['chart.scale.thousand']
                                            }),
                    valign:            'bottom',
                    halign:            'center',
                    bounding:          true,
                    boundingFill:      prop['chart.labels.inner.background.fill'],
                    boundingStroke:    prop['chart.labels.inner.border'] ? prop['chart.labels.inner.border.color'] : 'rgba(0,0,0,0)',
                    boundingLinewidth: prop['chart.labels.inner.border.linewidth'],
                    tag:               'labels.inner'
                });
            }
        };








        /**
        * The function that draws the OUTER tick marks.
        */
        this.drawTickMarks =
        this.DrawTickMarks = function ()
        {
            co.strokeStyle = prop['chart.colors.stroke.outer'];
    
            if (prop['chart.tickmarks.outer']) {
                co.beginPath();
                    for (var i=0; i<=prop['chart.tickmarks.outer.count']; i++) {
                        
                        var startX = prop['chart.labels.position'] === 'left' ? this.marginLeft : ca.width - prop['chart.margin.right'],
                            endX   = prop['chart.labels.position'] === 'left' ? startX - 4 : startX + 4,
                            yPos   = (this.height * (i / prop['chart.tickmarks.outer.count'])) + this.marginTop;
    
                        co.moveTo(startX, ma.round(yPos));
                        co.lineTo(endX, ma.round(yPos));
                    }
                co.stroke();
            }
        };








        /**
        * The function that draws the labels
        */
        this.drawLabels =
        this.DrawLabels = function ()
        {
            if (!RG.is_null(prop['chart.labels.specific'])) {
                return this.DrawSpecificLabels();
            }
    
            co.fillStyle = prop['chart.text.color'];

            var position   = prop['chart.labels.position'].toLowerCase();
            var xAlignment = position === 'left' ? 'right' : 'left';
            var yAlignment = 'center';
            var count      = prop['chart.labels.count'];
            var units_pre  = prop['chart.scale.units.pre'];
            var units_post = prop['chart.scale.units.post'];
            var text_size  = prop['chart.text.size'];
            var text_font  = prop['chart.text.font'];
            var decimals   = prop['chart.scale.decimals'];
            var offsetx    = prop['chart.labels.offsetx'];
            var offsety    = prop['chart.labels.offsety'];
    
            if (prop['chart.tickmarks.outer']) {

                var textConf = RG.getTextConf({
                    object: this,
                    prefix: 'chart.labels'
                });

                for (var i=0; i<count ; ++i) {
                    RG.text2(this, {

                     font: textConf.font,
                     size: textConf.size,
                    color: textConf.color,
                     bold: textConf.bold,
                   italic: textConf.italic,

                        x:      position == 'left' ? (this.marginLeft - 7 + offsetx) : (ca.width - this.marginRight + 7) + offsetx,
                        y:      (((ca.height - this.marginTop - this.marginBottom) / count) * i) + this.marginTop + offsety,
                        text:   this.scale2.labels[this.scale2.labels.length - (i+1)],
                        valign: yAlignment,
                        halign: xAlignment,
                        tag:    'scale'
                    });
                }
                
                /**
                * Show zero?
                */            
                if (this.min == 0) {

                    RG.text2(this, {

                     font: textConf.font,
                     size: textConf.size,
                    color: textConf.color,
                     bold: textConf.bold,
                   italic: textConf.italic,

                        x:      position == 'left' ? (this.marginLeft - 5 + offsetx) : (ca.width - this.marginRight + 5 + offsetx),
                        y:      ca.height - this.marginBottom + offsety,
                        text:   RG.numberFormat({
                                    object:    this,
                                    number:    this.min.toFixed(this.min === 0 ? 0 : decimals),
                                    unitspre:  units_pre,
                                    unitspost: units_post,
                                    point:     prop['chart.scale.point'],
                                    thousand:  prop['chart.scale.thousand'],
                                }),
                        valign: yAlignment,
                        halign: xAlignment,
                        tag:    'scale'
                    });
                }




                /**
                * min is set
                */
                if (this.min != 0) {
                    RG.text2(this, {

                     font: textConf.font,
                     size: textConf.size,
                    color: textConf.color,
                     bold: textConf.bold,
                   italic: textConf.italic,

                        x:      position == 'left' ? (this.marginLeft - 5 + offsetx) : (ca.width - this.marginRight + 5 + offsetx),
                        y:      ca.height - this.marginBottom + offsety,
                        text:   RG.number_format(this, this.min.toFixed(decimals), units_pre, units_post),
                        valign: yAlignment,
                        halign: xAlignment,
                        tag:    'scale'
                    });
                }
            }
        };








        /**
        * Draws titles
        */
        this.drawTitles =
        this.DrawTitles = function ()
        {
            // Draw the title text
            if (prop['chart.title']) {

                var textConf = RG.getTextConf({
                    object: this,
                    prefix: 'chart.title'
                });

                co.fillStyle = prop['chart.title.color'];
    
                RG.text2(this, {
                 
                 font: textConf.font,
                 size: textConf.size,
                color: textConf.color,
                 bold: textConf.bold,
               italic: textConf.italic,

                    x:      this.marginLeft + ((ca.width - this.marginLeft - this.marginRight) / 2),
                    y:      this.marginTop - 5,
                    text:   prop['chart.title'],
                    valign: 'bottom',
                    halign: 'center',
                    tag:    'title'
                });
            }





            // Draw side title
            if (prop['chart.title.side']) {
    
                co.fillStyle = prop['chart.title.side.color'];
    

                var textConf = RG.getTextConf({
                    object: this,
                    prefix: 'chart.title.side'
                });

                RG.text2(this, {
                 
                 font: textConf.font,
                 size: textConf.size,
                color: textConf.color,
                 bold: textConf.bold,
               italic: textConf.italic,

                    x:      prop['chart.labels.position'] == 'right' ? this.marginLeft - 10 : (ca.width - this.marginRight) + 10,
                    y:      this.marginTop + (this.height / 2),
                    text:   prop['chart.title.side'],
                    valign: 'bottom',
                    halign: 'center',
                    accessible: false,
                    angle:  prop['chart.labels.position'] == 'right' ? 270 : 90,
                    tag:    'title.side'
                });
            }
        };








        /**
        * Returns the focused bar
        * 
        * @param event e The event object
        */
        this.getShape =
        this.getBar = function (e)
        {
            var mouseXY = RG.getMouseXY(e),
                mouseX  = mouseXY[0],
                mouseY  = mouseXY[1]

            for (var i=0,len=this.coords.length; i<len; i++) {

                var x   = this.coords[i][0],
                    y   = this.coords[i][1],
                    w   = this.coords[i][2],
                    h   = this.coords[i][3],
                    idx = i;

                    co.beginPath();
                    this.drawCurvedBar({
                        x: x,
                        y: y,
                        width: w,
                        height: h
                    });

                if (co.isPointInPath(mouseX, mouseY)) {
                
                    var tooltip = RG.parseTooltipText(prop['chart.tooltips'], i);
                
                    return {
                        0: this, 'object': this,
                        1: x,    'x':      x,
                        2: y,    'y':      y,
                        3: w,    'width':  w,
                        4: h,    'height': h,
                        5: i,    'index':  i,
                                 'tooltip': tooltip
                    };
                }
            }
        };








        /**
        * This function returns the value that the mouse is positioned at, regardless of
        * the actual indicated value.
        * 
        * @param object e The event object
        */
        this.getValue = function (e)
        {
            var mouseCoords = RG.getMouseXY(e);
            var mouseX      = mouseCoords[0];
            var mouseY      = mouseCoords[1];
    
            var value = (this.height - (mouseY - this.marginTop)) / this.height;
                value *= this.max - this.min;
                value += this.min;

            // Bounds checking
            if (value > this.max) value = this.max;
            if (value < this.min) value = this.min;

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
            if (typeof prop['chart.highlight.style'] === 'function') {
                (prop['chart.highlight.style'])(shape);
            } else {
            
                var last = shape.index === this.coords.length - 1;

                this.drawCurvedBar({
                         x: shape.x,
                         y: shape.y,
                     width: shape.width,
                    height: shape.height,
                    stroke: prop['chart.highlight.stroke'],
                      fill: prop['chart.highlight.fill']
                });
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
                && mouseXY[1] >= this.marginTop
                && mouseXY[1] <= (ca.height - this.marginBottom)
                ) {

                return this;
            }
        };








        /**
        * This function allows the VProgress to be  adjustable.
        * UPDATE: Not any more
        */
        this.allowAdjusting =
        this.AllowAdjusting = function () {return;};








        /**
        * This method handles the adjusting calculation for when the mouse
        * is moved
        * 
        * @param object e The event object
        */
        this.adjusting_mousemove =
        this.Adjusting_mousemove = function (e)
        {
            /**
            * Handle adjusting for the HProgress
            */
            if (prop['chart.adjustable'] && RG.Registry.get('chart.adjusting') && RG.Registry.get('chart.adjusting').uid == this.uid) {
    
                var mouseXY = RG.getMouseXY(e);
                var value   = this.getValue(e);
                
                if (typeof value === 'number') {
    
                    // Fire the onadjust event
                    RG.FireCustomEvent(this, 'onadjust');
        
                    this.value = Number(value.toFixed(prop['chart.scale.decimals']));
                    RG.redrawCanvas(this.canvas);
                }
            }
        };








        /**
        * Draws chart.labels.specific
        */
        this.drawSpecificLabels =
        this.DrawSpecificLabels = function ()
        {
            var labels = prop['chart.labels.specific'];
    
            if (labels) {
    
                var halign = prop['chart.labels.position'] === 'right' ? 'left' : 'right';
                var step   = this.height / (labels.length - 1);
        
                co.beginPath();
    
                    co.fillStyle = prop['chart.text.color'];
    
                    for (var i=0; i<labels.length; ++i) {

                        var textConf = RG.getTextConf({
                            object: this,
                            prefix: 'chart.labels'
                        });

                        RG.text2(this,{

                         font: textConf.font,
                         size: textConf.size,
                        color: textConf.color,
                         bold: textConf.bold,
                       italic: textConf.italic,

                            x:          prop['chart.labels.position'] == 'right' ? ca.width - this.marginRight + 7 : this.marginLeft - 7,
                            y:          (this.height + this.marginTop) - (step * i),
                            text:       labels[i],
                            valign:     'center',
                            halign:     halign,
                            tag:        'labels.specific'
                        });
                    }
                co.fill();
            }
        };








        /**
        * This function returns the appropriate Y coordinate for the given Y value
        * 
        * @param  int value The Y value you want the coordinate for
        * @returm int       The coordinate
        */
        this.getYCoord = function (value)
        {
            if (value > this.max || value < this.min) {
                return null;
            }

            var barHeight = ca.height - prop['chart.margin.top'] - prop['chart.margin.bottom'];
            var coord = ((value - this.min) / (this.max - this.min)) * barHeight;
            coord = ca.height - coord - prop['chart.margin.bottom'];
            
            return coord;
        };








        /**
        * This returns true/false as to whether the cursor is over the chart area.
        * The cursor does not necessarily have to be over the bar itself.
        */
        this.overChartArea = function  (e)
        {
            var mouseXY = RGraph.getMouseXY(e);
            var mouseX  = mouseXY[0];
            var mouseY  = mouseXY[1];
    
            if (   mouseX >= this.marginLeft
                && mouseX <= (ca.width - this.marginRight)
                && mouseY >= this.marginTop
                && mouseY <= (ca.height - this.marginBottom)
                ) {
                
                return true;
            }
    
            return false;
        };








        /**
        * 
        */
        this.parseColors = function ()
        {
            // Save the original colors so that they can be restored when the canvas is reset
            if (this.original_colors.length === 0) {
                this.original_colors['chart.colors']                = RG.array_clone(prop['chart.colors']);
                this.original_colors['chart.tickmarks.inner.color'] = RG.array_clone(prop['chart.tickmarks.inner.color']);
                this.original_colors['chart.tickmarks.outer.color'] = RG.array_clone(prop['chart.tickmarks.outer.color']);
                this.original_colors['chart.colors.stroke.inner']   = RG.array_clone(prop['chart.colors.stroke.inner']);
                this.original_colors['chart.colors.stroke.outer']   = RG.array_clone(prop['chart.colors.stroke.outer']);
                this.original_colors['chart.highlight.fill']        = RG.array_clone(prop['chart.highlight.fill']);
                this.original_colors['chart.highlight.stroke']      = RG.array_clone(prop['chart.highlight.stroke']);
                this.original_colors['chart.background.color']      = RG.array_clone(prop['chart.background.color']);
            }

            var colors = prop['chart.colors'];
    
            for (var i=0,len=colors.length; i<len; ++i) {
                colors[i] = this.parseSingleColorForGradient(colors[i]);
            }
    
            prop['chart.tickmarks.inner.color'] = this.parseSingleColorForGradient(prop['chart.tickmarks.inner.color']);
            prop['chart.tickmarks.outer.color'] = this.parseSingleColorForGradient(prop['chart.tickmarks.outer.color']);
            prop['chart.colors.stroke.inner']   = this.parseSingleColorForGradient(prop['chart.colors.stroke.inner']);
            prop['chart.colors.stroke.outer']   = this.parseSingleColorForGradient(prop['chart.colors.stroke.outer']);
            prop['chart.highlight.fill']        = this.parseSingleColorForGradient(prop['chart.highlight.fill']);
            prop['chart.highlight.stroke']      = this.parseSingleColorForGradient(prop['chart.highlight.stroke']);
            prop['chart.background.color']      = this.parseSingleColorForGradient(prop['chart.background.color']);
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
                var grad = co.createLinearGradient(0, ca.height - prop['chart.margin.bottom'], 0, prop['chart.margin.top']);
    
                var diff = 1 / (parts.length - 1);
    
                grad.addColorStop(0, RG.trim(parts[0]));
    
                for (var j=1,len=parts.length; j<len; ++j) {
                    grad.addColorStop(j * diff, RG.trim(parts[j]));
                }
                
                return grad ? grad : color;
            }
    
            return grad ? grad : color;
        };








        /**
        * Draws the bevel effect
        */
        this.drawBevel =
        this.DrawBevel = function ()
        {
            // In case of multiple segments - this adds up all the lengths
            for (var i=0,height=0; i<this.coords.length; ++i) {
                height += this.coords[i][3];
            }
    
            co.save();
                co.beginPath();
                co.rect(
                    this.coords[0][0],
                    this.coords[this.coords.length - 1][1] - 1,
                    this.coords[0][2],
                    height
                );
                co.clip();

                co.save();
                    // Draw a path to clip to
                    co.beginPath();
                        this.drawCurvedBar({
                            x: this.coords[0][0],
                            y: this.coords[this.coords.length - 1][1] - 1,
                            width: this.coords[0][2],
                            height: height
                        });
                        co.clip();
                    
                    // Now draw the rect with a shadow
                    co.beginPath();
                        
                        co.shadowColor = 'black';
                        co.shadowOffsetX = 0;
                        co.shadowOffsetY = 0;
                        co.shadowBlur    = 15;
                        
                        co.lineWidth = 2;
    
                        this.drawCurvedBar({
                            x: this.coords[0][0] - 1,
                            y: this.coords[this.coords.length - 1][1] - 1,
                            width:  this.coords[0][2] + 2,
                            height: height + 2 + 100
                        });
                    
                    co.stroke();
        
                co.restore();
            co.restore();
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

            co.beginPath();

                co.strokeStyle = prop['chart.key.interactive.highlight.chart.stroke'];
                co.lineWidth    = 2;
                co.fillStyle   = prop['chart.key.interactive.highlight.chart.fill'];

                co.rect(coords[0], coords[1], coords[2], coords[3]);
            co.fill();
            co.stroke();
            
            // Reset the linewidth
            co.lineWidth    = 1;
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
        * Draws a bar with a curved end
        * 
        * DOESN'T DRAW A CURVED BAR ANY MORE - JUST A REGULAR SQUARE ENDED BAR
        * 
        * @param object opt The coords and colours
        */
        this.drawCurvedBar = function (opt)
        {
            pa2(co,
                'b r % % % %',
                opt.x,
                opt.y,
                opt.width,
                opt.height
            );

            if (opt.stroke) {
                co.strokeStyle = opt.stroke;
                co.stroke();
            }
            
            if (opt.fill) {
                co.fillStyle = opt.fill;
                co.fill();
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
        * HProgress Grow effect (which is also the VPogress Grow effect)
        * 
        * @param object obj The chart object
        */
        this.grow   = function ()
        {
            var obj           = this;
            var canvas        = obj.canvas;
            var context       = obj.context;
            var initial_value = obj.currentValue;
            var opt           = arguments[0] || {};
            var numFrames     = opt.frames || 30;
            var frame         = 0
            var callback      = arguments[1] || function () {};
    
            if (typeof obj.value === 'object') {
    
                if (RGraph.is_null(obj.currentValue)) {
                    obj.currentValue = [];
                    for (var i=0; i<obj.value.length; ++i) {
                        obj.currentValue[i] = 0;
                    }
                }
    
                var diff      = [];
                var increment = [];
    
                for (var i=0; i<obj.value.length; ++i) {
                    diff[i]      = obj.value[i] - Number(obj.currentValue[i]);
                    increment[i] = diff[i] / numFrames;
                }
                
                if (initial_value == null) {
                    initial_value = [];
                    for (var i=0; i< obj.value.length; ++i) {
                        initial_value[i] = 0;
                    }
                }
    
            } else {
    
                var diff = obj.value - Number(obj.currentValue);
                var increment = diff  / numFrames;
            }






            function iterator ()
            {
                frame++;
    
                if (frame <= numFrames) {
    
                    if (typeof obj.value == 'object') {
                        obj.value = [];
                        for (var i=0; i<initial_value.length; ++i) {
                            obj.value[i] = initial_value[i] + (increment[i] * frame);
                        }
                    } else {
                        obj.value = initial_value + (increment * frame);
                    }
    
                    RGraph.clear(obj.canvas);
                    RGraph.redrawCanvas(obj.canvas);
                    
                    RGraph.Effects.updateCanvas(iterator);
                } else {
                    callback();
                }
            }
            
            iterator();
            
            return this;
        };







        /**
        * The chart is now always registered
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