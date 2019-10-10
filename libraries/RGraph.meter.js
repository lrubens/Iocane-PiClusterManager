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
    * @param string canvas The canvas ID
    * @param min    integer The minimum value
    * @param max    integer The maximum value
    * @param value  integer The indicated value
    */
    RGraph.Meter = function (conf)
    {
        /**
        * Allow for object config style
        */
        if (   typeof conf === 'object'
            && typeof conf.value !== 'undefined'
            && typeof conf.id === 'string') {

            var id                        = conf.id
            var canvas                    = document.getElementById(id);
            var min                       = conf.min;
            var max                       = conf.max;
            var value                     = conf.value;
            var parseConfObjectForOptions = true; // Set this so the config is parsed (at the end of the constructor)

        } else {
        
            var id     = conf;
            var canvas = document.getElementById(id);
            var min    = arguments[1];
            var max    = arguments[2];
            var value  = arguments[3];
        }




        // id, min, max, value
        // Get the canvas and context objects
        this.id                = id;
        this.canvas            = canvas;
        this.context           = this.canvas.getContext ? this.canvas.getContext("2d", {alpha: (typeof id === 'object' && id.alpha === false) ? false : true}) : null;
        this.canvas.__object__ = this;
        this.type              = 'meter';
        this.min               = RGraph.stringsToNumbers(min);
        this.max               = RGraph.stringsToNumbers(max);
        this.value             = RGraph.stringsToNumbers(value);
        this.centerx           = null;
        this.centery           = null;
        this.radius            = null;
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
            'chart.margin.left':                        'chart.gutter.left',
            'chart.margin.right':                       'chart.gutter.right',
            'chart.margin.top':                         'chart.gutter.top',
            'chart.margin.bottom':                      'chart.gutter.bottom',
            'chart.colors.stroke':                      'chart.strokestyle',
            'chart.colors.red.start':                   'chart.red.start',
            'chart.colors.red.end':                     'chart.red.end',
            'chart.colors.red.color':                   'chart.red.color',
            'chart.colors.green.start':                 'chart.green.start',
            'chart.colors.green.end':                   'chart.green.end',
            'chart.colors.green.color':                 'chart.green.color',
            'chart.colors.yellow.start':                'chart.yellow.start',
            'chart.colors.yellow.end':                  'chart.yellow.end',
            'chart.colors.yellow.color':                'chart.yellow.color',
            'chart.colors.background':                  'chart.background.color',
            'chart.scale.units.pre':                    'chart.units.pre',
            'chart.scale.units.post':                   'chart.units.post',
            'chart.resizable.handle.background':        'chart.resize.handle.background',
            'chart.annotatable.color':                  'chart.annotate.color',
            'chart.annotatable.linewidth':              'chart.annotate.linewidth',
            'chart.tickmarks.small.count':              'chart.tickmarks.small.num',
            'chart.tickmarks.large.count':              'chart.tickmarks.big.num',
            'chart.tickmarks.large.color':              'chart.tickmarks.big.color',
            'chart.segments.radius.start':              'chart.segment.radius.start',
            'chart.labels.value.text':                  'chart.value.text',
            'chart.labels.value.text.decimals':         'chart.value.text.decimals',
            'chart.labels.value.text.units.pre':        'chart.value.text.units.pre',
            'chart.labels.value.text.units.post':       'chart.value.text.units.post',
            'chart.labels.value.text.font':             'chart.value.text.font',
            'chart.labels.value.text.size':             'chart.value.text.size',
            'chart.labels.value.text.bold':             'chart.value.text.bold',
            'chart.labels.value.text.italic':           'chart.value.text.italic',
            'chart.labels.value.text.color':            'chart.value.text.color',
            'chart.labels.value.text.background':       'chart.value.text.background',
            'chart.labels.value.text.background.fill':  'chart.value.text.background.fill',
            'chart.labels.value.text.background.stroke':'chart.value.text.background.stroke',
            'chart.scale.units.pre':                    'chart.units.pre',
            'chart.scale.units.post':                   'chart.units.post'
            /* [NEW]:[OLD] */
        };





        /**
        * Compatibility with older browsers
        */
        //RGraph.OldBrowserCompat(this.context);


        // Various config type stuff
        this.properties =
        {
            'chart.background.image.url':     null,
            'chart.background.image.offsetx': 0,
            'chart.background.image.offsety': 0,
            'chart.background.image.stretch': true,
            'chart.background.color':       'white',

            'chart.margin.left':            15,
            'chart.margin.right':           15,
            'chart.margin.top':             15,
            'chart.margin.bottom':          20,

            'chart.linewidth':              1,
            'chart.linewidth.segments':     0,

            'chart.colors.stroke':            null,
            
            'chart.border':                 true,
            'chart.border.color':           'black',
            
            'chart.text.font':              'Arial, Verdana, sans-serif',
            'chart.text.size':              12,
            'chart.text.color':             'black',
            'chart.text.bold':              false,
            'chart.text.italic':            false,
            'chart.text.valign':            'center',
            'chart.text.accessible':               false,
            'chart.text.accessible.overflow':      'visible',
            'chart.text.accessible.pointerevents': false,
            
            'chart.labels':                              true,
            'chart.labels.count':                        10,
            'chart.labels.specific':                     null,
            'chart.labels.radius.offset':                0,
            'chart.labels.font':                         null,
            'chart.labels.size':                         null,
            'chart.labels.color':                        null,
            'chart.labels.bold':                         null,
            'chart.labels.italic':                       null,
            'chart.labels.value.text':                   false,
            'chart.labels.value.text.font':              null,
            'chart.labels.value.text.size':              null,
            'chart.labels.value.text.bold':              null,
            'chart.labels.value.text.italic':            null,
            'chart.labels.value.text.color':             null,
            'chart.labels.value.text.decimals':          0,
            'chart.labels.value.text.units.pre':         '',
            'chart.labels.value.text.units.post':        '',
            'chart.labels.value.text.background':        true,
            'chart.labels.value.text.background.fill':   'rgba(255,255,255,0.75)',
            'chart.labels.value.text.background.stroke': 'rgba(0,0,0,0)',
            'chart.labels.value.text.specific':          null,
            'chart.labels.value.text.accessible':        true,
            
            'chart.title':                  '',
            'chart.title.background':       null,
            'chart.title.hpos':             null,
            'chart.title.vpos':             null,
            'chart.title.color':            null,
            'chart.title.bold':             null,
            'chart.title.font':             null,
            'chart.title.italic':           null,
            'chart.title.size':             null,
            'chart.title.x':                null,
            'chart.title.y':                null,
            'chart.title.halign':           null,
            'chart.title.valign':           null,

            'chart.colors.green.start':            ((this.max - this.min) * 0.35) + this.min,
            'chart.colors.green.end':              this.max,
            'chart.colors.green.color':            '#207A20',
            'chart.colors.yellow.start':           ((this.max - this.min) * 0.1) + this.min,
            'chart.colors.yellow.end':             ((this.max - this.min) * 0.35) + this.min,
            'chart.colors.yellow.color':           '#D0AC41',
            'chart.colors.red.start':              this.min,
            'chart.colors.red.end':                ((this.max - this.min) * 0.1) + this.min,
            'chart.colors.red.color':              '#9E1E1E',
            'chart.colors.ranges':          null,

            'chart.contextmenu':            null,

            'chart.annotatable':            false,
            'chart.annotatable.color':      'black',

            'chart.shadow':                 false,
            'chart.shadow.color':           'rgba(0,0,0,0.5)',
            'chart.shadow.blur':            3,
            'chart.shadow.offsetx':         3,
            'chart.shadow.offsety':         3,

            'chart.resizable':                   false,
            'chart.resizable.handle.adjust':     [0,0],
            'chart.resizable.handle.background': null,

            'chart.tickmarks.small.count':      100,
            'chart.tickmarks.small.color':    '#bbb',
            'chart.tickmarks.large.count':      10,
            'chart.tickmarks.large.color':    'black',

            'chart.scale.units.pre':          '',
            'chart.scale.units.post':         '',
            'chart.scale.decimals':           0,
            'chart.scale.point':              '.',
            'chart.scale.thousand':           ',',

            'chart.radius':                   null,
            'chart.centerx':                  null,
            'chart.centery':                  null,

            'chart.segments.radius.start':     0,

            'chart.needle.radius':            null,
            'chart.needle.type':              'normal',
            'chart.needle.tail':              false,
            'chart.needle.head':              true,
            'chart.needle.color':             'black',
            'chart.needle.image.url':         null,
            'chart.needle.image.offsetx':     0,
            'chart.needle.image.offsety':     0,

            'chart.adjustable':               false,

            'chart.angles.start':             RGraph.PI,
            'chart.angles.end':               RGraph.TWOPI,

            'chart.centerpin.stroke':         'black',
            'chart.centerpin.fill':           'white',

            'chart.clearto':   'rgba(0,0,0,0)'
        }


        // Check for support
        if (!this.canvas) {
            alert('[METER] No canvas support');
            return;
        }



        /*
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
            var value = arguments[1] || null;

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




            if (name == 'chart.value') {
                this.value = value;
                return;
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

    
            if (name == 'chart.value') {
                return this.value;
            }
    
            return prop[name];
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
            * Constrain the value to be within the min and max
            */
            if (this.value > this.max) this.value = this.max;
            if (this.value < this.min) this.value = this.min;
    
            /**
            * Set the current value
            */
            this.currentValue = this.value;



            /**
            * Make the margins easy to access
            */
            this.marginLeft   = prop['chart.margin.left'];
            this.marginRight  = prop['chart.margin.right'];
            this.marginTop    = prop['chart.margin.top'];
            this.marginBottom = prop['chart.margin.bottom'];
            
            this.centerx = ((ca.width - this.marginLeft - this.marginRight) / 2) + this.marginLeft;
            this.centery = ca.height - this.marginBottom;
            this.radius  = Math.min(
                (ca.width - this.marginLeft - this.marginRight) / 2,
                (ca.height - this.marginTop - this.marginBottom)
            );
                
            /**
            * Stop this growing uncontrollably
            */
            this.coordsText = [];
    
    
    
            /**
            * Custom centerx, centery and radius
            */
            if (typeof prop['chart.centerx'] === 'number') this.centerx = prop['chart.centerx'];
            if (typeof prop['chart.centery'] === 'number') this.centery = prop['chart.centery'];
            if (typeof prop['chart.radius']  === 'number') this.radius  = prop['chart.radius'];
    
    
            /**
            * Parse the colors for gradients. Its down here so that the center X/Y can be used
            */
            if (!this.colorsParsed) {
    
                this.parseColors();
    
                // Don't want to do this again
                this.colorsParsed = true;
            }
    
    
            this.drawBackground();
            this.drawLabels();
            this.drawNeedle();
            this.drawReadout();
            
            /**
            * Draw the title
            */
            RG.drawTitle(
                this,
                prop['chart.title'],
                this.marginTop,
                null,
                typeof prop['chart.title.size'] === 'boolean' ? prop['chart.title.size'] : prop['chart.text.size']);

            /**
            * Setup the context menu if required
            */
            if (prop['chart.contextmenu']) {
                RG.showContext(this);
            }
    
            
            /**
            * This function enables resizing
            */
            if (prop['chart.resizable']) {
                RG.allowResizing(this);
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
        * Draws the background of the chart
        */
        this.drawBackground =
        this.DrawBackground = function ()
        {
            /**
            * First draw the background image if it's defined
            */
            if (typeof prop['chart.background.image.url'] === 'string' && !this.__background_image__) {
                
                var x   = 0 + prop['chart.background.image.offsetx'];
                var y   = 0 + prop['chart.background.image.offsety'];
                var img = new Image();

                this.__background_image__ = img;
                img.src = prop['chart.background.image.url'];

                img.onload = function ()
                {
                    if (prop['chart.background.image.stretch']) {
                        co.drawImage(this, x,y,ca.width, ca.height);
                    } else {
                        co.drawImage(this, x,y);
                    }
                    RG.redraw();
                }
            
            } else if (this.__background_image__) {
            
                var x   = 0 + prop['chart.background.image.offsetx'];
                var y   = 0 + prop['chart.background.image.offsety'];

                if (prop['chart.background.image.stretch']) {
                    co.drawImage(this.__background_image__, x,y,ca.width, ca.height);
                } else {
                    co.drawImage(this.__background_image__, x,y);
                }
            }



            /**
            * Draw the white background
            */
            co.beginPath();
    
                co.fillStyle = prop['chart.background.color'];
                
                if (prop['chart.shadow']) {
                    RG.setShadow(
                        this,
                        prop['chart.shadow.color'],
                        prop['chart.shadow.offsetx'],
                        prop['chart.shadow.offsety'],
                        prop['chart.shadow.blur']
                    );
                }

                co.moveTo(this.centerx,this.centery);
                co.arc(
                    this.centerx,
                    this.centery,
                    this.radius,
                    prop['chart.angles.start'],
                    prop['chart.angles.end'],
                    false
                );
    
            co.fill();
            
            RG.noShadow(this);
    
            
            // Draw the shadow
            if (prop['chart.shadow']) {
    
                co.beginPath();
                    var r = (this.radius * 0.06) > 40 ? 40 : (this.radius * 0.06);
                    co.arc(this.centerx, this.centery, r, 0, RG.TWOPI, 0);
                co.fill();
    
                RG.noShadow(this);
            }



            // First, draw the grey tickmarks
            if (prop['chart.tickmarks.small.count']) {
                for (var i=0; i<(prop['chart.angles.end'] - prop['chart.angles.start']); i+=(RG.PI / prop['chart.tickmarks.small.count'])) {
                    co.beginPath();
                        co.strokeStyle = prop['chart.tickmarks.small.color'];
                        co.arc(this.centerx, this.centery, this.radius, prop['chart.angles.start'] + i, prop['chart.angles.start'] + i + 0.00001, 0);
                        co.arc(this.centerx, this.centery, this.radius - 5, prop['chart.angles.start'] + i, prop['chart.angles.start'] + i + 0.00001, 0);
                    co.stroke();
                }
    
                // Draw the semi-circle that makes the tickmarks
                co.beginPath();
                    co.fillStyle = prop['chart.background.color'];
                    co.arc(this.centerx, this.centery, this.radius - 4, prop['chart.angles.start'], prop['chart.angles.end'], false);
                co.closePath();
                co.fill();
            }
    
    
            // Second, draw the darker tickmarks. First run draws them in white to get rid of the existing tickmark,
            // then the second run draws them in the requested color
            
            
            if (prop['chart.tickmarks.large.count']) {
                
                var colors = ['white','white',prop['chart.tickmarks.large.color']];
                
                for (var j=0; j<colors.length; ++j) {
                    for (var i=0; i<(prop['chart.angles.end'] - prop['chart.angles.start']); i+=((prop['chart.angles.end'] - prop['chart.angles.start']) / prop['chart.tickmarks.large.count'])) {
                        co.beginPath();
                            co.strokeStyle = colors[j];
                            co.arc(this.centerx, this.centery, this.radius, prop['chart.angles.start'] +  i, prop['chart.angles.start'] + i + 0.001, 0);
                            co.arc(this.centerx, this.centery, this.radius - 5, prop['chart.angles.start'] + i, prop['chart.angles.start'] + i + 0.0001, 0);
                        co.stroke();
                    }
                }
            }
    
            // Draw the white circle that makes the tickmarks
            co.beginPath();
            co.fillStyle = prop['chart.background.color'];
            co.moveTo(this.centerx, this.centery);
            co.arc(
                this.centerx,
                this.centery,
                this.radius - 7,
                prop['chart.angles.start'],
                prop['chart.angles.end'],
                false
            );
            co.closePath();
            co.fill();
    
            /**
            * Color ranges - either green/yellow/red or an arbitrary number of ranges
            */
            var ranges = prop['chart.colors.ranges'];
    
            if (RG.isArray(prop['chart.colors.ranges'])) {
    
                var ranges = prop['chart.colors.ranges'];
    
                for (var i=0; i<ranges.length; ++i) {
    
                    co.strokeStyle = prop['chart.colors.stroke'] ? prop['chart.colors.stroke'] : ranges[i][2];
                    co.fillStyle = ranges[i][2];
                    co.lineWidth = prop['chart.linewidth.segments'];
    
                    co.beginPath();
                        co.arc(
                            this.centerx,
                            this.centery,
                            this.radius * 0.85,
                            (((ranges[i][0] - this.min) / (this.max - this.min)) * (prop['chart.angles.end'] - prop['chart.angles.start'])) + prop['chart.angles.start'],
                            (((ranges[i][1] - this.min) / (this.max - this.min)) * (prop['chart.angles.end'] - prop['chart.angles.start'])) + prop['chart.angles.start'],
                            false
                        );
    
                        if (prop['chart.segments.radius.start'] > 0) {
                            co.arc(
                                this.centerx,
                                this.centery,
                                prop['chart.segments.radius.start'],
                                (((ranges[i][1] - this.min) / (this.max - this.min)) * (prop['chart.angles.end'] - prop['chart.angles.start'])) + prop['chart.angles.start'],
                                (((ranges[i][0] - this.min) / (this.max - this.min)) * (prop['chart.angles.end'] - prop['chart.angles.start'])) + prop['chart.angles.start'],
                                true
                            );
                        } else {
                            co.lineTo(this.centerx, this.centery);
                        }
    
                    co.closePath();
                    co.stroke();
                    co.fill();
                }
    
                // Stops the last line from being changed to a big linewidth.
                co.beginPath();
    
            } else {
                co.lineWidth = prop['chart.linewidth'];
    
                // Draw the green area
                co.strokeStyle = prop['chart.colors.stroke'] ? prop['chart.colors.stroke'] : prop['chart.colors.green.color'];
                co.fillStyle   = prop['chart.colors.green.color'];
                co.lineWidth   = prop['chart.linewidth.segments'];
                
                co.beginPath();
                    co.arc(
                        this.centerx,
                        this.centery,
                        this.radius * 0.85,
                        (((prop['chart.colors.green.start'] - this.min) / (this.max - this.min)) * (prop['chart.angles.end'] - prop['chart.angles.start'])) + prop['chart.angles.start'],
                        (((prop['chart.colors.green.end'] - this.min) / (this.max - this.min)) * (prop['chart.angles.end'] - prop['chart.angles.start'])) + prop['chart.angles.start'],
                        false
                    );
    
                    if (prop['chart.segments.radius.start'] > 0) {
    
                        co.arc(
                            this.centerx,
                            this.centery,
                            prop['chart.segments.radius.start'],
                            (((prop['chart.colors.green.end'] - this.min) / (this.max - this.min)) * (prop['chart.angles.end'] - prop['chart.angles.start'])) + prop['chart.angles.start'],
                            (((prop['chart.colors.green.start'] - this.min) / (this.max - this.min)) * (prop['chart.angles.end'] - prop['chart.angles.start'])) + prop['chart.angles.start'],
                            true
                        );
                    } else {
                        co.lineTo(this.centerx, this.centery);
                    }
    
                co.closePath();
                co.stroke();
                co.fill();
                
                // Draw the yellow area
                co.strokeStyle = prop['chart.colors.stroke'] ? prop['chart.colors.stroke'] : prop['chart.colors.yellow'];
                co.fillStyle = prop['chart.colors.yellow.color'];
                co.lineWidth = prop['chart.linewidth.segments'];
                co.beginPath();
                co.arc(
                    this.centerx,
                    this.centery,
                    this.radius * 0.85,
                    (((prop['chart.colors.yellow.start'] - this.min) / (this.max - this.min)) * (prop['chart.angles.end'] - prop['chart.angles.start'])) + prop['chart.angles.start'],
                    (((prop['chart.colors.yellow.end'] - this.min) / (this.max - this.min)) * (prop['chart.angles.end'] - prop['chart.angles.start'])) + prop['chart.angles.start'],
                    false
                );
                
                if (prop['chart.segments.radius.start'] > 0) {
                    co.arc(
                        this.centerx,
                        this.centery,
                        prop['chart.segments.radius.start'],
                        (((prop['chart.colors.yellow.end'] - this.min) / (this.max - this.min)) * (prop['chart.angles.end'] - prop['chart.angles.start'])) + prop['chart.angles.start'],
                        (((prop['chart.colors.yellow.start'] - this.min) / (this.max - this.min)) * (prop['chart.angles.end'] - prop['chart.angles.start'])) + prop['chart.angles.start'],
                        true
                    );
                } else {
                    co.lineTo(this.centerx, this.centery);
                }
    
                co.closePath();
                co.stroke();
                co.fill();
                
                // Draw the red area
                co.strokeStyle = prop['chart.colors.stroke'] ? prop['chart.colors.stroke'] : prop['chart.colors.red.color'];
                co.fillStyle = prop['chart.colors.red.color'];
                co.lineWidth = prop['chart.linewidth.segments'];
                
                co.beginPath();
                    co.arc(
                        this.centerx,
                        this.centery,this.radius * 0.85,
                        (((prop['chart.colors.red.start'] - this.min) / (this.max - this.min)) * (prop['chart.angles.end'] - prop['chart.angles.start'])) + prop['chart.angles.start'],
                        (((prop['chart.colors.red.end'] - this.min) / (this.max - this.min)) * (prop['chart.angles.end'] - prop['chart.angles.start'])) + prop['chart.angles.start'],
                        false
                    );
        
                    if (prop['chart.segments.radius.start'] > 0) {
                        co.arc(
                            this.centerx,
                            this.centery,
                            prop['chart.segments.radius.start'],
                            (((prop['chart.colors.red.end'] - this.min) / (this.max - this.min)) * (prop['chart.angles.end'] - prop['chart.angles.start'])) + prop['chart.angles.start'],
                            (((prop['chart.colors.red.start'] - this.min) / (this.max - this.min)) * (prop['chart.angles.end'] - prop['chart.angles.start'])) + prop['chart.angles.start'],
                            true
                        );
                    } else {
                        co.lineTo(this.centerx, this.centery);
                    }
    
                co.closePath();
                co.stroke();
                co.fill();
                
                // Revert the linewidth
                co.lineWidth = 1;
            }
    
            // Draw the outline
            if (prop['chart.border']) {
                co.strokeStyle = prop['chart.border.color'];
                co.lineWidth   = prop['chart.linewidth'];
                
                co.beginPath();
                    co.moveTo(this.centerx, this.centery);
                    co.arc(
                        this.centerx,
                        this.centery,
                        this.radius,
                        prop['chart.angles.start'],
                        prop['chart.angles.end'],
                        false
                    );
                co.closePath();
            }
    
            co.stroke();
            
            // Reset the linewidth back to 1
            co.lineWidth = 1;
        };








        /**
        * Draws the pointer
        */
        this.drawNeedle =
        this.DrawNeedle = function ()
        {
            /**
            * The angle that the needle is at
            */
            var a = (((this.value - this.min) / (this.max - this.min)) * (prop['chart.angles.end'] - prop['chart.angles.start'])) + prop['chart.angles.start'];

            /**
            * First draw the background image if it's defined
            */
            if (typeof prop['chart.needle.image.url'] === 'string' && !this.__needle_image__) {
                
                var img = new Image();

                this.__needle_image__ = img;
                img.src = prop['chart.needle.image.url'];

                img.onload = function ()
                {
                    co.save();
                        RG.rotateCanvas(ca, this.centerx, this.centery, a);
                        co.drawImage(
                            this,
                            this.centerx + prop['chart.needle.image.offsetx'],
                            this.centery + prop['chart.needle.image.offsety']
                        );
                    co.restore();

                    RG.redraw();
                }

            } else if (this.__needle_image__) {

                co.save();
                    RG.rotateCanvas(ca, this.centerx, this.centery, a);
                    co.drawImage(
                        this.__needle_image__,
                        this.centerx + prop['chart.needle.image.offsetx'],
                        this.centery + prop['chart.needle.image.offsety']
                    );
                co.restore();
            }


            // Allow customising the needle radius
            var needleRadius = typeof prop['chart.needle.radius'] === 'number' ? prop['chart.needle.radius'] : this.radius * 0.7;



            //
            // Draw a simple pointer as for the needle
            //
            if (prop['chart.needle.type'] === 'pointer') {

                // Draw the center circle (the stroke)
                var r = (this.radius * 0.06) > 40 ? 40 : (this.radius * 0.06);

                // Draw the black circle at the bottom of the needle
                co.beginPath();
                
                co.fillStyle = prop['chart.needle.color'];
                
                co.moveTo(this.centerx,this.centery);

                co.arc(
                    this.centerx,
                    this.centery,
                    r,
                    0,
                    RG.TWOPI,
                    false
                );
                
                co.fill();
                co.beginPath();
           
                // This moves the "pen" to the outer edge of the needle
                co.arc(
                    this.centerx,
                    this.centery,
                    r,
                    a + RG.HALFPI,
                    a + RG.HALFPI + 0.0001,
                    false
                );
 
                // Draw a line up to the tip of the needle
                co.arc(
                    this.centerx,
                    this.centery,
                    needleRadius,
                    a,
                    a + 0.001,
                    false
                );

                // Draw a line back down to the other side of the circle
                co.arc(
                    this.centerx,
                    this.centery,
                    r,
                    a - RG.HALFPI,
                    a - RG.HALFPI + 0.001,
                    false
                );

                
                co.fill();
                
                
            } else {

        
                // First draw the circle at the bottom
                co.fillStyle = 'black';
                co.lineWidth = this.radius >= 200 ? 7 : 3;
                co.lineCap = 'round';
        
                // Now, draw the arm of the needle
                co.beginPath();
                    co.strokeStyle = prop['chart.needle.color'];
                    if (typeof(prop['chart.needle.linewidth']) == 'number') co.lineWidth = prop['chart.needle.linewidth'];
    
        
                    co.arc(this.centerx, this.centery, needleRadius, a, a + 0.001, false);
                    co.lineTo(this.centerx, this.centery);
                co.stroke();
    
                // Draw the triangular needle head
                if (prop['chart.needle.head']) {
    
                    co.fillStyle = prop['chart.needle.color'];
                    co.beginPath();
                        co.lineWidth = 1;
                        //co.moveTo(this.centerx, this.centery);
                        co.arc(this.centerx, this.centery, needleRadius + 15, a, a + 0.001, 0);
                        co.arc(this.centerx, this.centery, needleRadius - 15, a + 0.087, a + 0.087999, 0);
                        co.arc(this.centerx, this.centery, needleRadius - 15, a - 0.087, a - 0.087999, 1);
                    co.fill();
                }
    
                // Draw the tail if requested
                if (prop['chart.needle.tail']) {
                    co.beginPath();
                        co.strokeStyle = prop['chart.needle.color'];
                        if (typeof(prop['chart.needle.linewidth']) == 'number') co.lineWidth = prop['chart.needle.linewidth'];
    
                        var a = ((this.value - this.min) / (this.max - this.min) * (this.properties['chart.angles.end'] - this.properties['chart.angles.start'])) + this.properties['chart.angles.start'] + RG.PI;
                        co.arc(this.centerx, this.centery, 25, a, a + 0.001, false);
                        co.lineTo(this.centerx, this.centery);
                    co.stroke();
                }
    
                // Draw the center circle (the stroke)
                var r = (this.radius * 0.06) > 40 ? 40 : (this.radius * 0.06);
        
                co.beginPath();
                co.fillStyle = prop['chart.centerpin.stroke'];
                co.arc(this.centerx, this.centery, r, 0 + 0.001, RG.TWOPI, 0);
                co.fill();
    
    
    
                // Draw the centre bit of the circle (the fill)
                co.fillStyle = prop['chart.centerpin.fill'];
                co.beginPath();
                co.arc(this.centerx, this.centery, r - 2, 0 + 0.001, RG.TWOPI, 0);
                co.fill();
            }
        };








        /**
        * Draws the labels
        */
        this.drawLabels =
        this.DrawLabels = function ()
        {
            if (!prop['chart.labels']) {
                return;
            }

            var radius      = this.radius,
                text_italic = prop['chart.text.italic'],
                units_post  = prop['chart.scale.units.post'],
                units_pre   = prop['chart.scale.units.pre'],
                point       = prop['chart.scale.point'],
                thousand    = prop['chart.scale.thousand'],
                centerx     = this.centerx,
                centery     = this.centery,
                min         = this.min,
                max         = this.max,
                decimals    = prop['chart.scale.decimals'],
                numLabels   = prop['chart.labels.count'],
                offset      = prop['chart.labels.radius.offset'],
                specific    = prop['chart.labels.specific'];


            var textConf = RG.getTextConf({
                object: this,
                prefix: 'chart.labels'
            });


            //
            // Draw the specific labels if they're specific
            //
            if (specific) {

                for (var i=0; i<specific.length; ++i) {

                    if (typeof specific[i] === 'string' || typeof specific[i] === 'number') {

                        var angle = this.getAngle(
                                (((this.max - this.min) / specific.length) / 2) + (((this.max - this.min) / specific.length) * i) + this.min
                            ),
                            angle_degrees = angle * (180 / RG.PI),
                            text          = specific[i].toString(),
                            coords        = RG.getRadiusEndPoint(
                                this.centerx,
                                this.centery,
                                angle,
                                (this.radius * 0.925) + offset
                            );

                    } else {

                        var angle         = this.getAngle(specific[i][1]),
                            angle_degrees = angle * (180 / RG.PI),
                            text          = specific[i][0].toString(),
                            coords        = RG.getRadiusEndPoint(
                                this.centerx,
                                this.centery,
                                angle,
                                (this.radius * 0.925) + offset
                            );
                    }

                    RG.text2(this, {

                     font: textConf.font,
                     size: textConf.size,
                    color: textConf.color,
                     bold: textConf.bold,
                   italic: textConf.italic,

                        x:        coords[0],
                        y:        coords[1],
                        text:     text,
                        halign:   'center',
                        valign:   'center',
                        angle:    angle_degrees + 90,
                        bounding: false,
                        tag:      'labels-specific'
                    });
                }
            
                return;
            }




            co.fillStyle = prop['chart.text.color'];
            co.lineWidth = 1;
    
            co.beginPath();
    
            for (var i=0; i<=numLabels; ++i) {
            
                var angle  = ((prop['chart.angles.end'] - prop['chart.angles.start']) * (i / numLabels)) + prop['chart.angles.start'];
                var coords = RG.getRadiusEndPoint(
                    centerx,
                    centery,
                    angle + (((i == 0 || i == numLabels) && prop['chart.border']) ? (i == 0 ? 0.05 : -0.05) : 0),
                    ((this.radius * 0.925) - (prop['chart.text.valign'] === 'bottom' ? 15 : 0) + prop['chart.labels.radius.offset']
                ));
                
                var angleStart = prop['chart.angles.start'],
                    angleEnd   = prop['chart.angles.end'],
                    angleRange = angleEnd - angleStart,                
                    angleStart_degrees = angleStart * (180 / RG.PI),
                    angleEnd_degrees = angleEnd * (180 / RG.PI),
                    angleRange_degrees = angleRange * (180 / RG.PI)

                // Vertical alignment
                valign = prop['chart.text.valign'];
    
                // Horizontal alignment
                if (prop['chart.border']) {
                    if (i == 0) {
                        halign = 'left';
                    } else if (i == numLabels) {
                        halign = 'right';
                    } else {
                        halign = 'center'
                    }
                } else {
                    halign = 'center';
                }

                var value = ((this.max - this.min) * (i / numLabels)) + this.min;
    
                RG.text2(this, {

                     font: textConf.font,
                     size: textConf.size,
                    color: textConf.color,
                     bold: textConf.bold,
                   italic: textConf.italic,

                    x:            coords[0],
                    y:            coords[1],
                    text:         RG.numberFormat({
                                      object:    this,
                                      number:    (value).toFixed(value === 0 ? 0 : decimals),
                                      unitspre:  units_pre,
                                      unitspost: units_post,
                                      point:     point,
                                      thousand:  thousand
                                  }),
                    halign:       halign,
                    valign:       valign,
                    angle:        ((angleRange_degrees * (1 / numLabels) * i) + angleStart_degrees) - 270,
                    bounding:     false,
                    boundingFill: (i == 0 || i == numLabels) ? 'white': null,
                    tag:          'scale'
                });
            }
        };








        /**
        * This function draws the text readout if specified
        */
        this.drawReadout  =
        this.DrawReadout  = function ()
        {
            if (prop['chart.labels.value.text']) {
                
                // The text label
                var text = (prop['chart.labels.value.text.units.pre'] || '')
                            + (this.value).toFixed(prop['chart.labels.value.text.decimals'])
                            + (prop['chart.labels.value.text.units.post'] || '');
                
                // Allow for a specific label
                if (typeof prop['chart.labels.value.text.specific'] === 'string') {
                    text = prop['chart.labels.value.text.specific'];
                }

                var textConf = RG.getTextConf({
                    object: this,
                    prefix: 'chart.labels.value.text'
                });

                RG.text2(this, {

                 font: textConf.font,
                 size: textConf.size,
                color: textConf.color,
                 bold: textConf.bold,
               italic: textConf.italic,

                    x:            this.centerx,
                    y:            this.centery - textConf.size - 15,
                    text:         text,
                    halign:       'center',
                    valign:       'bottom',
                    bounding:     prop['chart.labels.value.text.background'],
                    boundingFill: prop['chart.labels.value.text.background.fill'],
                    boundingStroke: prop['chart.labels.value.text.background.stroke'],
                    accessible:     prop['chart.labels.value.text.accessible'],
                    tag:            'value.text'
                });
            }
        };








        /**
        * A placeholder function
        * 
        * @param object The event object
        */
        this.getShape = function (e) {};








        /**
        * This function returns the pertinent value for a particular click (or other mouse event)
        * 
        * @param obj e The event object
        */
        this.getValue = function (e)
        {
            var mouseXY = RG.getMouseXY(e);
            var angle   = RG.getAngleByXY(this.centerx, this.centery, mouseXY[0], mouseXY[1]);

            // Work out the radius
            var radius = RG.getHypLength(this.centerx, this.centery, mouseXY[0], mouseXY[1]);
            if (radius > this.radius) {
                return null;
            }
    
    
            if (angle < RG.HALFPI) {
                angle += RG.TWOPI;
            }

            var value = (((angle - prop['chart.angles.start']) / (prop['chart.angles.end'] - prop['chart.angles.start'])) * (this.max - this.min)) + this.min;

            value = Math.max(value, this.min);
            value = Math.min(value, this.max);

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
            var mouseXY = RGraph.getMouseXY(e);
    
            // Work out the radius
            var radius = RG.getHypLength(this.centerx, this.centery, mouseXY[0], mouseXY[1]);
    
            if (
                   mouseXY[0] > (this.centerx - this.radius)
                && mouseXY[0] < (this.centerx + this.radius)
                && mouseXY[1] > (this.centery - this.radius)
                && mouseXY[1] < (this.centery + this.radius)
                && radius <= this.radius
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
            if (prop['chart.adjustable'] && RG.Registry.Get('chart.adjusting') && RG.Registry.Get('chart.adjusting').uid == this.uid) {
                this.value = this.getValue(e);
                RG.clear(this.canvas);
                RG.redrawCanvas(this.canvas);
                RG.fireCustomEvent(this, 'onadjust');
            }
        };








        /**
        * This method returns the appropriate angle for a value
        * 
        * @param number value The value
        */
        this.getAngle = function (value)
        {
            // Higher than max
            if (value > this.max || value < this.min) {
                return null;
            }
    
            var angle = (((value - this.min) / (this.max - this.min)) * (prop['chart.angles.end'] - prop['chart.angles.start'])) + prop['chart.angles.start'];
    
            return angle;
        };








        /**
        * This allows for easy specification of gradients
        */
        this.parseColors = function ()
        {
            // Save the original colors so that they can be restored when the canvas is reset
            if (this.original_colors.length === 0) {
                this.original_colors['chart.colors.green.color']  = RG.arrayClone(prop['chart.colors.green.color']);
                this.original_colors['chart.colors.yellow.color'] = RG.arrayClone(prop['chart.colors.yellow.color']);
                this.original_colors['chart.colors.red.color']    = RG.arrayClone(prop['chart.colors.red.color']);
                this.original_colors['chart.colors.ranges']       = RG.arrayClone(prop['chart.colors.ranges']);
            }

            // Parse the basic colors
            prop['chart.colors.green.color']  = this.parseSingleColorForGradient(prop['chart.colors.green.color']);
            prop['chart.colors.yellow.color'] = this.parseSingleColorForGradient(prop['chart.colors.yellow.color']);
            prop['chart.colors.red.color']    = this.parseSingleColorForGradient(prop['chart.colors.red.color']);
    
            // Parse chart.colors.ranges
            var ranges = prop['chart.colors.ranges'];

            if (ranges && ranges.length) {
                for (var i=0; i<ranges.length; ++i) {
                    ranges[i][2] = this.parseSingleColorForGradient(ranges[i][2]);
                }
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
            if (!color || typeof(color) != 'string') {
                return color;
            }

            if (color.match(/^gradient\((.*)\)$/i)) {

                // Allow for JSON gradients
                if (color.match(/^gradient\(({.*})\)$/i)) {
                    return RGraph.parseJSONGradient({object: this, def: RegExp.$1,radial:true});
                }

                var parts = RegExp.$1.split(':');
    
                // Create the gradient
                var grad = co.createRadialGradient(this.centerx, this.centery, prop['chart.segments.radius.start'], this.centerx, this.centery, this.radius * 0.85);
    
                var diff = 1 / (parts.length - 1);
    
                for (var j=0; j<parts.length; ++j) {
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
        * Meter Grow
        * 
        * This effect gradually increases the represented value
        * 
        * @param              An object of options - eg: {frames: 60}
        * @param function     An optional callback function
        */
        this.grow = function ()
        {
            var obj = this;

            obj.currentValue = obj.currentValue || obj.min;

            var opt      = arguments[0] || {};
            var frames   = opt.frames || 30;
            var frame    = 0;
            var diff     = obj.value - obj.currentValue;
            var step     = diff / frames;
            var callback = arguments[1] || function () {};
            var initial  = obj.currentValue;



            function iterator ()
            {
                obj.value = initial + (frame++ * step);
    
                RG.clear(obj.canvas);
                RG.redrawCanvas(obj.canvas);
            
                if (frame <= frames) {
                    RG.Effects.updateCanvas(iterator);
                } else {
                    callback(obj);
                }
            }
            
            iterator();
            
            return this;
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