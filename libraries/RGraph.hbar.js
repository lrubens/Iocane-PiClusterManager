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
    * The horizontal bar chart constructor. The horizontal bar is a minor variant
    * on the bar chart. If you have big labels, this may be useful as there is usually
    * more space available for them.
    * 
    * @param object canvas The canvas object
    * @param array  data   The chart data
    */
    RGraph.HBar = function (conf)
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
        this.data              = data;
        this.type              = 'hbar';
        this.isRGraph          = true;
        this.uid               = RGraph.CreateUID();
        this.canvas.uid        = this.canvas.uid ? this.canvas.uid : RGraph.CreateUID();
        this.colorsParsed      = false;
        this.coords            = [];
        this.coords2           = [];
        this.coordsText        = [];
        this.original_colors   = [];
        this.firstDraw         = true; // After the first draw this will be false
        this.yaxisLabelsSize = 0;    // Used later when the margin is auto calculated
        this.yaxisTitleSize  = 0;    // Used later when the margin is auto calculated







        this.propertyNameAliases = {
            /*
            'chart.background.bars.count':       'chart.background.barcount',
            'chart.background.bars.color1':      'chart.background.barcolor1',
            'chart.background.bars.color2':      'chart.background.barcolor2',
            'chart.background.grid.linewidth':   'chart.background.grid.width',
            'chart.background.grid.hlines.count':'chart.background.grid.autofit.numhlines',
            'chart.background.grid.vlines.count':'chart.background.grid.autofit.numvlines',
            'chart.margin.left':                 'chart.gutter.left',
            'chart.margin.left.autosize':        'chart.gutter.left.autosize',
            'chart.margin.left.autofit':         'chart.gutter.left.autosize',
            'chart.margin.left.auto':            'chart.gutter.left.autosize',
            'chart.margin.right':                'chart.gutter.right',
            'chart.margin.top':                  'chart.gutter.top',
            'chart.margin.bottom':               'chart.gutter.bottom',
            'chart.xaxis.labels':                'chart.xlabels',
            'chart.xaxis.labels.count':          'chart.xlabels.count',
            'chart.xaxis.labels.specific':       'chart.xlabels.specific',
            'chart.xaxis.labels.offsetx':        'chart.xlabels.offsetx',
            'chart.xaxis.labels.offsety':        'chart.xlabels.offsety',
            'chart.yaxis.labels':                'chart.labels',
            'chart.yaxis.labels.offsetx':        'chart.labels.offsetx',
            'chart.yaxis.labels.offsety':        'chart.labels.offsety',
            'chart.yaxis.labels.bold':           'chart.labels.bold',
            'chart.yaxis.labels.color':          'chart.labels.color',
            'chart.yaxis.position':              'chart.yaxispos',
            'chart.xaxis.title':                 'chart.title.xaxis',
            'chart.xaxis.title.size':            'chart.title.xaxis.size',
            'chart.xaxis.title.x':               'chart.title.xaxis.x',
            'chart.xaxis.title.y':               'chart.title.xaxis.y',
            'chart.xaxis.title.pos':             'chart.title.xaxis.pos',
            'chart.xaxis.title.color':           'chart.title.xaxis.color',
            'chart.xaxis.title.bold':            'chart.title.xaxis.bold',
            'chart.xaxis.title.font':            'chart.title.xaxis.font',
            'chart.yaxis.title':                 'chart.title.yaxis',
            'chart.yaxis.title.size':            'chart.title.yaxis.size',
            'chart.yaxis.title.font':            'chart.title.yaxis.font',
            'chart.yaxis.title.bold':            'chart.title.yaxis.bold',
            'chart.yaxis.title.color':           'chart.title.yaxis.color',
            'chart.yaxis.title.pos':             'chart.title.yaxis.pos',
            'chart.yaxis.title.x':               'chart.title.yaxis.x',
            'chart.yaxis.title.y':               'chart.title.yaxis.y',
            'chart.xaxis.scale.decimals':         'chart.scale.decimals',
            'chart.xaxis.scale.point':            'chart.scale.point',
            'chart.xaxis.scale.thousand':         'chart.scale.thousand',
            'chart.xaxis.scale.round':            'chart.scale.round',
            'chart.xaxis.scale.zerostart':        'chart.scale.zerostart',
            'chart.xaxis.scale.max':              'chart.xmax',
            'chart.xaxis.scale.min':              'chart.xmin',
            'chart.xaxis.scale.units.pre':        'chart.units.pre',
            'chart.xaxis.scale.units.post':       'chart.units.post',
            'chart.axes.color':                   'chart.axis.color',
            'chart.axes.linewidth':               'chart.axis.linewidth',
            'chart.axes':                         function (opt) {return {name:'chart.noaxes',value:!opt.value}},
            'chart.xaxis':                        function (opt) {return {name:'chart.noxaxis',value:!opt.value}},
            'chart.yaxis':                        function (opt) {return {name:'chart.noyaxis',value:!opt.value}},
            'chart.xaxis.tickmarks':              function (opt) {return {name:'chart.noxtickmarks',value:!opt.value}},
            'chart.yaxis.tickmarks':              function (opt) {return {name:'chart.noytickmarks',value:!opt.value}},
            'chart.xaxis.tickmarks.count':        'chart.numxticks',
            'chart.yaxis.tickmarks.count':        'chart.numyticks',
            'chart.annotatable.color':            'chart.annotate.color',
            'chart.annotatable.linewidth':        'chart.annotate.linewidth',
            'chart.resizable.handle.background':  'chart.resize.handle.background',
            'chart.colors.stroke':                'chart.strokestyle',
            'chart.colors.background':            'chart.background.color',
            'chart.key.position.margin.boxed':   'chart.key.position.gutter.boxed'
            */
            
            /* [NEW]:[OLD] */
        };










        
        this.max = 0;
        this.stackedOrGrouped  = false;

        // Default properties
        this.properties =
        {
            'chart.margin.left':            25,
            'chart.margin.left.auto':       true,
            'chart.margin.right':           25,
            'chart.margin.right.auto':      false,
            'chart.margin.top':             25,
            'chart.margin.bottom':          25,
            
            'chart.background.bars.count':    null,
            'chart.background.bars.color1':   'rgba(0,0,0,0)',
            'chart.background.bars.color2':   'rgba(0,0,0,0)',
            'chart.background.grid':        true,
            'chart.background.grid.color':  '#ddd',
            'chart.background.grid.linewidth':  1,
            'chart.background.grid.hsize':  25,
            'chart.background.grid.vsize':  25,
            'chart.background.grid.hlines': true,
            'chart.background.grid.vlines': true,
            'chart.background.grid.border': true,
            'chart.background.grid.autofit':true,
            'chart.background.grid.autofit.align':true,
            'chart.background.grid.hlines.count': null,
            'chart.background.grid.vlines.count': 5,
            'chart.background.grid.dashed': false,
            'chart.background.grid.dotted': false,
            'chart.background.color':       null,

            'chart.linewidth':              1,

            'chart.title':                  '',
            'chart.title.background':       null,
            'chart.title.hpos':             null,
            'chart.title.vpos':             null,
            'chart.title.bold':             null,
            'chart.title.italic':           null,
            'chart.title.font':             null,
            'chart.title.size':             null,
            'chart.title.color':            null,
            'chart.title.x':                null,
            'chart.title.y':                null,
            'chart.title.halign':           null,
            'chart.title.valign':           null,

            'chart.text.size':              12,
            'chart.text.color':             'black',
            'chart.text.font':              'Arial, Verdana, sans-serif',
            'chart.text.bold':              false,
            'chart.text.italic':            false,
            'chart.text.angle':             0,
            'chart.text.accessible':               true,
            'chart.text.accessible.overflow':      'visible',
            'chart.text.accessible.pointerevents': false,

            'chart.colors':                 ['red', 'blue', 'green', 'pink', 'yellow', 'cyan', 'navy', 'gray', 'black'],
            'chart.colors.sequential':      false,
            'chart.colors.stroke':            'rgba(0,0,0,0)',
            
            'chart.axes':                   true,
            'chart.axes.color':             'black',
            'chart.axes.linewidth':         1,

            'chart.xaxis':                  true,
            'chart.xaxis.labels':           true,
            'chart.xaxis.labels.count':     5,
            'chart.xaxis.labels.bold':      null,
            'chart.xaxis.labels.italic':    null,
            'chart.xaxis.labels.font':      null,
            'chart.xaxis.labels.size':      null,
            'chart.xaxis.labels.color':     null,
            'chart.xaxis.labels.specific':  null,
            'chart.xaxis.labels.offsetx':  0,
            'chart.xaxis.labels.offsety':  0,
            'chart.xaxis.scale.units.pre':   '',
            'chart.xaxis.scale.units.post':  '',
            'chart.xaxis.scale.min':        0,
            'chart.xaxis.scale.max':        0,
            'chart.xaxis.scale.point':      '.',
            'chart.xaxis.scale.thousand':   ',',
            'chart.xaxis.scale.decimals':   null,
            'chart.xaxis.scale.zerostart':  true,
            'chart.xaxis.title':            '',
            'chart.xaxis.title.bold':       null,
            'chart.xaxis.title.italic':     null,
            'chart.xaxis.title.size':       null,
            'chart.xaxis.title.font':       null,
            'chart.xaxis.title.color':      null,
            'chart.xaxis.title.x':          null,
            'chart.xaxis.title.y':          null,
            'chart.xaxis.title.pos':        null,
            'chart.xaxis.tickmarks':        true,
            'chart.xaxis.tickmarks.count':  10,

            'chart.yaxis':                  true,
            'chart.yaxis.labels.font':      null,
            'chart.yaxis.labels.size':      null,
            'chart.yaxis.labels.color':     null,
            'chart.yaxis.labels.bold':      null,
            'chart.yaxis.labels.italic':    null,
            'chart.yaxis.labels.offsetx':   0,
            'chart.yaxis.labels.offsety':   0,
            'chart.yaxis.position':         'left',
            'chart.yaxis.title':            '',
            'chart.yaxis.title.bold':       null,
            'chart.yaxis.title.italic':     null,
            'chart.yaxis.title.size':       null,
            'chart.yaxis.title.font':       null,
            'chart.yaxis.title.color':      null,
            'chart.yaxis.title.pos':        null,
            'chart.yaxis.title.x':          null,
            'chart.yaxis.title.y':          null,
            'chart.yaxis.tickmarks.count':  data.length,
            'chart.yaxis.tickmarks':        true,

            'chart.labels.above':           false,
            'chart.labels.above.decimals':  0,
            'chart.labels.above.specific':  null,
            'chart.labels.above.units.pre':  '',
            'chart.labels.above.units.post': '',
            'chart.labels.above.color':      null,
            'chart.labels.above.font':       null,
            'chart.labels.above.size':       null,
            'chart.labels.above.bold':       null,
            'chart.labels.above.italic':     null,

            'chart.contextmenu':            null,
            
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
            'chart.key.interactive.highlight.chart.fill':'rgba(255,255,255,0.7)',
            'chart.key.interactive.highlight.label':'rgba(255,0,0,0.2)',
            'chart.key.labels.color':        null,
            'chart.key.labels.font':         null,
            'chart.key.labels.size':         null,
            'chart.key.labels.bold':         null,
            'chart.key.labels.italic':       null,
            'chart.key.labels.offsetx':      0,
            'chart.key.labels.offsety':      0,

            'chart.units.ingraph':          false,
            
            'chart.shadow':                 false,
            'chart.shadow.color':           '#666',
            'chart.shadow.blur':            3,
            'chart.shadow.offsetx':         3,
            'chart.shadow.offsety':         3,

            'chart.vmargin':                2,
            'chart.vmargin.grouped':        2,

            'chart.grouping':               'grouped',

            'chart.tooltips':               null,
            'chart.tooltips.event':         'onclick',
            'chart.tooltips.effect':        'fade',
            'chart.tooltips.css.class':     'RGraph_tooltip',
            'chart.tooltips.highlight':     true,

            'chart.highlight.fill':         'rgba(255,255,255,0.7)',
            'chart.highlight.stroke':       'rgba(0,0,0,0)',
            'chart.highlight.style':        null,

            'chart.annotatable':            false,
            'chart.annotatable.color':         'black',

            'chart.resizable':                   false,
            'chart.resizable.handle.adjust':     [0,0],
            'chart.resizable.handle.background': null,

            'chart.redraw':               true,

            'chart.events.click':           null,
            'chart.events.mousemove':       null,

            'chart.variant':                'hbar',
            'chart.variant.threed.angle':   0.1,
            'chart.variant.threed.offsetx': 10,
            'chart.variant.threed.offsety': 5,
            'chart.variant.threed.xaxis':   true,
            'chart.variant.threed.yaxis':   true,
            
            'chart.adjustable':             false,
            'chart.adjustable.only':        null,

            'chart.clearto':                'rgba(0,0,0,0)'
        }

        // Check for support
        if (!this.canvas) {
            alert('[HBAR] No canvas support');
            return;
        }

        // This loop is used to check for stacked or grouped charts and now
        // also to convert strings to numbers. And now also undefined values
        // (29/07/2016
        for (i=0,len=this.data.length; i<len; ++i) {
            if (typeof this.data[i] == 'object' && !RGraph.isNull(this.data[i])) {
                
                this.stackedOrGrouped = true;
                
                for (var j=0,len2=this.data[i].length; j<len2; ++j) {
                    if (typeof this.data[i][j] === 'string') {
                        this.data[i][j] = parseFloat(this.data[i][j]);
                    }
                }

            } else if (typeof this.data[i] == 'string') {
                this.data[i] = parseFloat(this.data[i]) || 0;
            
            } else if (typeof this.data[i] === 'undefined') {
                this.data[i] = null;
            }
        }


        /**
        * Create the dollar objects so that functions can be added to them
        */
        var linear_data = RGraph.arrayLinearize(data);
        for (var i=0,len=linear_data.length; i<len; ++i) {
            this['$' + i] = {};
        }



        /**
        * Create the linear data array
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
    
            //if (name == 'chart.labels.abovebar') {
            //    name = 'chart.labels.above';
            //}

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
            /**
            * Fire the onbeforedraw event
            */
            RG.fireCustomEvent(this, 'onbeforedraw');


            //
            // Check that the bHBar isn't stacked with adjusting enabled 
            //
            if (prop['chart.adjustable'] && prop['chart.grouping'] === 'stacked') {
                alert('[RGRAPH] The HBar does not support stacked charts with adjusting');
            }

            //
            // Set the correct number of horizontal grid lines if
            // it hasn't been set already
            //
            if (RG.isNull(prop['chart.background.grid.hlines.count'])) {
                this.set('chart.background.grid.hlines.count', this.data.length);
            }

            //
            // If the chart is 3d then angle it it
            //

            if (prop['chart.variant'] === '3d') {
                
                if (prop['chart.text.accessible']) {
                    // Nada
                } else {
                    co.setTransform(1,prop['chart.variant.threed.angle'],0,1,0.5,0.5);
                }
                
                // Enlarge the margin if its 25
                if (prop['chart.margin.bottom'] === 25) {
                    this.set('chart.margin.bottom', 80);
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
            
            
            


            // Calculate the size of the labels regardless of anything else
            if (prop['chart.yaxis.labels']) {
            
                var labels     = prop['chart.yaxis.labels'],
                    marginName = prop['chart.yaxis.position'] === 'right' ? 'chart.margin.right' : 'chart.margin.left';

                var textConf = RG.getTextConf({
                    object: this,
                    prefix: 'chart.yaxis.labels'
                });

                for (var i=0,len=0; i<labels.length; i+=1) {
                    var length = RG.measureText(
                        labels[i],
                        textConf.bold,
                        textConf.font,
                        textConf.size
                    )[0] || 0;

                    this.yaxisLabelsSize = ma.max(len, length);
                    len = this.yaxisLabelsSize;
                }

                // Is a title Specified? If so accommodate that
                if (prop['chart.yaxis.title']) {

                    var textConf = RG.getTextConf({
                        object: this,
                        prefix: 'chart.yaxis.title'
                    });

                    var titleSize = RG.measureText(
                        prop['chart.yaxis.title'],
                        textConf.bold,
                        textConf.font,
                        textConf.size
                    ) || [];


                    this.yaxisTitleSize += titleSize[1];
                    prop[marginName]    += this.yaxisTitleSize;

                }
            }

            

            /**
            * Accomodate autosizing the left/right margin
            */
            if (prop['chart.margin.left.auto']) {
                var name = prop['chart.yaxis.position'] === 'right' ? 'chart.margin.right' : 'chart.margin.left';

                prop[name] = this.yaxisLabelsSize + this.yaxisTitleSize + 10;
            }



            /**
            * Make the margins easy to access
            */            
            this.marginLeft   = prop['chart.margin.left'];
            this.marginRight  = prop['chart.margin.right'];
            this.marginTop    = prop['chart.margin.top'];
            this.marginBottom = prop['chart.margin.bottom'];

            


            /**
            * Stop the coords array from growing uncontrollably
            */
            this.coords     = [];
            this.coords2    = [];
            this.coordsText = [];
            this.max        = 0;
    
            /**
            * Check for chart.xaxis.scale.min in stacked charts
            */
            if (prop['chart.xaxis.scale.min'] > 0 && prop['chart.grouping'] === 'stacked') {
                alert('[HBAR] Using chart.xaxis.scale.min is not supported with stacked charts, resetting chart.xaxis.scale.min to zero');
                this.set('chart.xaxis.scale.min', 0);
            }
    
            /**
            * Work out a few things. They need to be here because they depend on things you can change before you
            * call Draw() but after you instantiate the object
            */
            this.graphwidth     = ca.width - this.marginLeft - this.marginRight;
            this.graphheight    = ca.height - this.marginTop - this.marginBottom;
            this.halfgrapharea  = this.grapharea / 2;
            this.halfTextHeight = prop['chart.text.size'] / 2;
            this.halfway        = ma.round((this.graphwidth / 2) + this.marginLeft);
    
    
    
    
    





            // Progressively Draw the chart
            RG.Background.draw(this);
    
            this.drawbars();
            this.drawAxes();
            this.drawLabels();
    
    
            // Draw the key if necessary
            if (prop['chart.key'] && prop['chart.key'].length) {
                RG.drawKey(this, prop['chart.key'], prop['chart.colors']);
            }
    
    
    
            /**
            * Setup the context menu if required
            */
            if (prop['chart.contextmenu']) {
                RG.showContext(this);
            }


    
            /**
            * Draw "in graph" labels
            */
            RG.drawInGraphLabels(this);
    
            
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
        * This draws the axes
        */
        this.drawAxes =
        this.DrawAxes = function ()
        {
            var halfway = this.halfway;


            co.beginPath();
                
                co.lineWidth   = prop['chart.axes.linewidth'] ? prop['chart.axes.linewidth'] + 0.001 : 1.001;
                co.strokeStyle = prop['chart.axes.color'];


                // Draw the Y axis
                if (prop['chart.yaxis'] && prop['chart.axes']) {
                    if (prop['chart.yaxis.position'] == 'center') {
                        co.moveTo(halfway, this.marginTop);
                        co.lineTo(halfway, ca.height - this.marginBottom);
                    
                    } else if (prop['chart.yaxis.position'] == 'right') {
                        co.moveTo(ca.width - this.marginRight, this.marginTop);
                        co.lineTo(ca.width - this.marginRight, ca.height - this.marginBottom);
                    
                    } else {
                        co.moveTo(this.marginLeft, this.marginTop);
                        co.lineTo(this.marginLeft, ca.height - this.marginBottom);
                    }
                }

                // Draw the X axis
                if (prop['chart.xaxis'] && prop['chart.axes']) {
                    co.moveTo(this.marginLeft +0.001, ca.height - this.marginBottom + 0.001);
                    co.lineTo(ca.width - this.marginRight + 0.001, ca.height - this.marginBottom + 0.001);
                }
    
                // Draw the Y tickmarks
                if (   prop['chart.yaxis.tickmarks']
                    && prop['chart.yaxis']
                    && prop['chart.yaxis.tickmarks.count'] > 0
                    && prop['chart.axes']
                   ) {
        
                    var yTickGap = (ca.height - this.marginTop - this.marginBottom) / (prop['chart.yaxis.tickmarks.count'] > 0 ? prop['chart.yaxis.tickmarks.count'] : this.data.length);
            
            
                    for (y=this.marginTop; y<(ca.height - this.marginBottom - 1); y+=yTickGap) {
                        if (prop['chart.yaxis.position'] == 'center') {
                            co.moveTo(halfway + 3, ma.round(y));
                            co.lineTo(halfway  - 3, ma.round(y));

                        } else if (prop['chart.yaxis.position'] == 'right') {
                            co.moveTo(ca.width - this.marginRight, ma.round(y));
                            co.lineTo(ca.width - this.marginRight + 3, ma.round(y));

                        } else {
                            co.moveTo(this.marginLeft, ma.round(y));
                            co.lineTo( this.marginLeft  - 3, ma.round(y));
                        }
                    }
                    
                    // If the X axis isn't being shown draw the end tick
                    if (!prop['chart.xaxis']) {
                        if (prop['chart.yaxis.position'] === 'center') {
                            co.moveTo(halfway + 3, ma.round(y));
                            co.lineTo(halfway  - 3, ma.round(y));
                        
                        } else if (prop['chart.yaxis.position'] === 'right') {
                            co.moveTo(ca.width - this.marginRight, ma.round(y));
                            co.lineTo(ca.width - this.marginRight + 3, ma.round(y));

                        } else {
                            co.moveTo(this.marginLeft, ma.round(y));
                            co.lineTo( this.marginLeft  - 3, ma.round(y));
                        }
                    }
                }





                // Draw the X tickmarks
                if (   prop['chart.xaxis.tickmarks']
                    && prop['chart.xaxis']
                    && prop['chart.xaxis.tickmarks.count'] > 0
                    && prop['chart.axes']) {

                    xTickGap = (ca.width - this.marginLeft - this.marginRight ) / prop['chart.xaxis.tickmarks.count'];
                    yStart   = ca.height - this.marginBottom;
                    yEnd     = (ca.height - this.marginBottom) + 3;



                    // Draw the X axis tickmarks
                    var cnt      = prop['chart.xaxis.tickmarks.count'],
                        interval = (this.canvas.width - prop['chart.margin.left'] - prop['chart.margin.right']) / cnt,
                        x        = prop['chart.margin.left'];
                    
                    if (prop['chart.yaxis.position'] === 'center') {
                        interval /= 2;
                    
                        // Draw the left hand side tickmarks
                        for (var i=0; i<cnt; ++i, x+=interval) {
                            co.moveTo(ma.round(x), yStart);
                            co.lineTo(ma.round(x), yEnd);
                        }
                    
                        // Draw the right hand side tickmarks
                        x = (this.graphwidth / 2) + this.marginLeft + interval;
                    
                        for (var i=0; i<cnt; ++i, x+=interval) {
                            co.moveTo(ma.round(x), yStart);
                            co.lineTo(ma.round(x), yEnd);
                        }
                        
                    } else if (prop['chart.yaxis.position'] === 'right') {
                        for (var i=0; i<cnt; ++i, x+=interval) {
                            co.moveTo(ma.round(x), yStart);
                            co.lineTo(ma.round(x), yEnd);
                        }
                        
                    } else {
                        x += interval;
                    
                        for (var i=0; i<cnt; ++i, x+=interval) {
                            co.moveTo(ma.round(x), yStart);
                            co.lineTo(ma.round(x), yEnd);
                        }
                    }





                    // If the Y axis isn't being shown draw the end tick
                    if (!prop['chart.yaxis']) {
                    
                        x = this.marginLeft;

                        // If the Y axis is placed on the right then change the x
                        // coordinate
                        if (prop['chart.yaxis.position'] === 'right') {
                            x = ca.width - this.marginRight;
                        }
                    
                        co.moveTo(x, ma.round(yStart));
                        co.lineTo(x, ma.round(yEnd));
                    }
                }
            co.stroke();
                
            /**
            * Reset the linewidth
            */
            co.lineWidth = 1;
        };








        /**
        * This draws the labels for the graph
        */
        this.drawLabels =
        this.DrawLabels = function ()
        {
            var units_pre  = prop['chart.xaxis.scale.units.pre'],
                units_post = prop['chart.xaxis.scale.units.post'],
                text_size  = prop['chart.text.size'],
                font       = prop['chart.text.font'],
                offsetx    = prop['chart.xaxis.labels.offsetx'],
                offsety    = prop['chart.xaxis.labels.offsety']

    
    
            /**
            * Set the units to blank if they're to be used for ingraph labels only
            */
            if (prop['chart.units.ingraph']) {
                units_pre  = '';
                units_post = '';
            }
    
    
            /**
            * Draw the X axis labels
            */
            if (prop['chart.xaxis.labels']) {
            
                /**
                * Specific X labels
                */
                if (RG.isArray(prop['chart.xaxis.labels.specific'])) {

                    if (prop['chart.yaxis.position'] == 'center') {

                        var halfGraphWidth = this.graphwidth / 2;
                        var labels         = prop['chart.xaxis.labels.specific'];
                        var interval       = (this.graphwidth / 2) / (labels.length - 1);

                        co.fillStyle = prop['chart.xaxis.labels'];
                        
                        var textConf = RG.getTextConf({
                            object: this,
                            prefix: 'chart.xaxis.labels'
                        });

                        for (var i=0; i<labels.length; i+=1) {
                                RG.text2(this, {

                                 font: textConf.font,
                                 size: textConf.size,
                                color: textConf.color,
                                 bold: textConf.bold,
                               italic: textConf.italic,

                                    x:      this.marginLeft + halfGraphWidth + (interval * i) + offsetx,
                                    y:      ca.height - this.marginBottom + offsetx,
                                    text:   labels[i],
                                    valign: 'top',
                                    halign: prop['chart.text.angle'] !== 0 ? 'right' : 'center',
                                    tag:    'scale',
                                    angle:  -1 * prop['chart.text.angle']
                                });
                        }
                        
                        for (var i=(labels.length - 1); i>0; i-=1) {
                                RG.Text2(this, {

                                     font: textConf.font,
                                     size: textConf.size,
                                    color: textConf.color,
                                     bold: textConf.bold,
                                   italic: textConf.italic,

                                    x:          this.marginLeft + (interval * (labels.length - i - 1)) + offsetx,
                                    y:          ca.height - this.marginBottom + offsety,
                                    text:       labels[i],
                                    valign:     'top',
                                    halign:     prop['chart.text.angle'] !== 0 ? 'right' : 'center',
                                    tag:        'scale',
                                    angle:      -1 * prop['chart.text.angle']
                                });
                        }

                    } else if (prop['chart.yaxis.position'] == 'right') {

                        var labels   = prop['chart.xaxis.labels.specific'];
                        var interval = this.graphwidth / (labels.length - 1);

                        co.fillStyle = prop['chart.text.color'];
                        
                        var textConf = RG.getTextConf({
                            object: this,
                            prefix: 'chart.xaxis.labels'
                        });

                        for (var i=0; i<labels.length; i+=1) {
                                RG.text2(this, {

                                 font: textConf.font,
                                 size: textConf.size,
                                color: textConf.color,
                                 bold: textConf.bold,
                               italic: textConf.italic,

                                    x:          this.marginLeft + (interval * i) + offsetx,
                                    y:          ca.height - this.marginBottom + offsety,
                                    text:       labels[labels.length - i - 1],
                                    valign:     'top',
                                    halign:     prop['chart.text.angle'] !== 0 ? 'right' : 'center',
                                    tag:        'scale',
                                    angle:      -1 * prop['chart.text.angle']
                                });
                        }

                    } else {

                        var labels   = prop['chart.xaxis.labels.specific'];
                        var interval = this.graphwidth / (labels.length - 1);
                        
                        co.fillStyle = prop['chart.text.color'];

                        var textConf = RG.getTextConf({
                            object: this,
                            prefix: 'chart.xaxis.labels'
                        });

                        for (var i=0; i<labels.length; i+=1) {
                                RG.text2(this, {

                                 font: textConf.font,
                                 size: textConf.size,
                                color: textConf.color,
                                 bold: textConf.bold,
                               italic: textConf.italic,

                                    x:      this.marginLeft + (interval * i) + offsetx,
                                    y:      ca.height - this.marginBottom + offsety,
                                    text:   labels[i],
                                    valign: 'top',
                                    halign: prop['chart.text.angle'] !== 0 ? 'right' : 'center',
                                    tag:    'scale',
                                    angle:  -1 * prop['chart.text.angle']
                                });
                        }
                    }









                /**
                * Draw an X scale
                */
                } else {

                    var gap = 7;
        
                    co.beginPath();
                    co.fillStyle = prop['chart.text.color'];
                    
                    var textConf = RG.getTextConf({
                        object: this,
                        prefix: 'chart.xaxis.labels'
                    });
        
        
                    if (prop['chart.yaxis.position'] == 'center') {
        
                        for (var i=0; i<this.scale2.labels.length; ++i) {
                            RG.text2(this, {

                             font: textConf.font,
                             size: textConf.size,
                            color: textConf.color,
                             bold: textConf.bold,
                           italic: textConf.italic,

                                x:      this.marginLeft + (this.graphwidth / 2) - ((this.graphwidth / 2) * ((i+1)/this.scale2.labels.length)) + offsetx,
                                y:      this.marginTop + this.halfTextHeight + this.graphheight + gap + offsety,
                                text:   '-' + this.scale2.labels[i],
                                valign: 'center',
                                halign: (typeof prop['chart.text.angle'] === 'number' && prop['chart.text.angle'] !== 0) ? 'right' : 'center',
                                tag:    'scale',
                                angle:  -1 * prop['chart.text.angle']
                            });
                        }
        
                        for (var i=0; i<this.scale2.labels.length; ++i) {
                            RG.text2(this, {

                             font: textConf.font,
                             size: textConf.size,
                            color: textConf.color,
                             bold: textConf.bold,
                           italic: textConf.italic,

                                x:      this.marginLeft + ((this.graphwidth / 2) * ((i+1)/this.scale2.labels.length)) + (this.graphwidth / 2) + offsetx,
                                y:      this.marginTop + this.halfTextHeight + this.graphheight + gap + offsety,
                                text:   this.scale2.labels[i],
                                valign: 'center',
                                halign: prop['chart.text.angle'] !== 0 ? 'right' : 'center',
                                tag:    'scale',
                                angle:  -1 * prop['chart.text.angle']
                            });
                        }
                
                    } else if (prop['chart.yaxis.position'] == 'right') {

                    
                        for (var i=0,len=this.scale2.labels.length; i<len; ++i) {
                            RG.Text2(this, {

                             font: textConf.font,
                             size: textConf.size,
                            color: textConf.color,
                             bold: textConf.bold,
                           italic: textConf.italic,

                                x:      this.marginLeft + (i * (this.graphwidth / len)) + offsetx,
                                y:      this.marginTop + this.halfTextHeight + this.graphheight + gap + offsety,
                                text:   '-' + this.scale2.labels[len - 1 - i],
                                valign: 'center',
                                halign: prop['chart.text.angle'] !== 0 ? 'right' : 'center',
                                tag:    'scale',
                                angle:  -1 * prop['chart.text.angle']
                            });
                        }


                    } else {

                        for (var i=0,len=this.scale2.labels.length; i<len; ++i) {

                            RG.text2(this, {

                             font: textConf.font,
                             size: textConf.size,
                            color: textConf.color,
                             bold: textConf.bold,
                           italic: textConf.italic,

                                x:      this.marginLeft + (this.graphwidth * ((i+1)/len)) + offsetx,
                                y:      this.marginTop + this.halfTextHeight + this.graphheight + gap + offsety,
                                text:   this.scale2.labels[i],
                                valign: 'center',
                                halign: prop['chart.text.angle'] !== 0 ? 'right' : 'center',
                                tag:    'scale',
                                angle:  -1 * prop['chart.text.angle']
                            });
                        }
                    }

                    /**
                    * If xmin is not zero - draw that
                    */
                    if (prop['chart.xaxis.scale.min'] > 0 || !prop['chart.yaxis'] || prop['chart.xaxis.scale.zerostart'] || !prop['chart.axes']) {

                        var x = prop['chart.yaxis.position'] === 'center' ?  this.marginLeft + (this.graphwidth / 2): this.marginLeft;
                        
                        /**
                        * Y axis on the right
                        */
                        if (prop['chart.yaxis.position'] === 'right') {
                            var x = ca.width - this.marginRight;
                        }

                        RG.text2(this, {

                             font: textConf.font,
                             size: textConf.size,
                            color: textConf.color,
                             bold: textConf.bold,
                           italic: textConf.italic,

                            x:      x + offsetx,
                            y:      this.marginTop + this.halfTextHeight + this.graphheight + gap + offsety,
                            text:   RG.numberFormat({
                                object:    this,
                                number:    prop['chart.xaxis.scale.min'].toFixed(prop['chart.xaxis.scale.min'] === 0 ? 0 : prop['chart.xaxis.scale.decimals']),
                                unitspre:  units_pre,
                                unitspost: units_post,
                                point:     prop['chart.xaxis.scale.point'],
                                thousand:  prop['chart.xaxis.scale.thousand']
                            }),
                            valign: 'center',
                            halign: prop['chart.text.angle'] !== 0 ? 'right' : 'center',
                            tag:    'scale',
                            angle:  -1 * prop['chart.text.angle']
                        });
                    }
        
                    co.fill();
                    co.stroke();
                }
            }







            /**
            * The Y axis labels
            */
            if (typeof prop['chart.yaxis.labels'] === 'object') {
            
                var xOffset = prop['chart.variant'] === '3d' && prop['chart.yaxis.position'] === 'right' ? 15 : 5,
                    offsetx = prop['chart.yaxis.labels.offsetx'],
                    offsety = prop['chart.yaxis.labels.offsety']
                
                
                // How high is each bar
                var barHeight = (ca.height - this.marginTop - this.marginBottom ) / prop['chart.yaxis.labels'].length;
                
                // Reset the yTickGap
                yTickGap = (ca.height - this.marginTop - this.marginBottom) / prop['chart.yaxis.labels'].length

                /**
                * If the Y axis is on the right set the alignment and the X position, otherwise on the left
                */
                if (prop['chart.yaxis.position'] === 'right') {
                    var x = ca.width - this.marginRight + xOffset;
                    var halign = 'left'
                } else {
                    var x = this.marginLeft - xOffset;
                    var halign = 'right'
                }

                // Get the text configuration for the Y axis labels
                var textConf = RG.getTextConf({
                    object: this,
                    prefix: 'chart.yaxis.labels'
                });

                // Draw the X tickmarks
                var i=0;
                for (y=this.marginTop + (yTickGap / 2); y<=ca.height - this.marginBottom; y+=yTickGap) {

                    RG.text2(this, {

                         font: textConf.font,
                         size: textConf.size,
                        color: textConf.color,
                         bold: textConf.bold,
                       italic: textConf.italic,

                        x:      x + offsetx,
                        y:      y + offsety,
                        text:   String(prop['chart.yaxis.labels'][i++]),
                        halign: halign,
                        valign: 'center',
                        tag:    'labels'
                    });
                }
            }
        };








        /**
        * This function draws the bars. It also draw 3D axes as the axes drawing bit
        * is don AFTER the bars are drawn
        */
        this.drawbars =
        this.Drawbars = function ()
        {
            co.lineWidth   = prop['chart.linewidth'];
            co.strokeStyle = prop['chart.colors.stroke'];
            co.fillStyle   = prop['chart.colors'][0];

            var prevX = 0,
                prevY = 0;
            
    
            /**
            * Work out the max value
            */
            if (prop['chart.xaxis.scale.max']) {

                this.scale2 = RG.getScale2(this, {
                    'scale.max':          prop['chart.xaxis.scale.max'],
                    'scale.min':          prop['chart.xaxis.scale.min'],
                    'scale.decimals':     Number(prop['chart.xaxis.scale.decimals']),
                    'scale.point':        prop['chart.xaxis.scale.point'],
                    'scale.thousand':     prop['chart.xaxis.scale.thousand'],
                    'scale.round':        prop['chart.xaxis.scale.round'],
                    'scale.units.pre':    prop['chart.xaxis.scale.units.pre'],
                    'scale.units.post':   prop['chart.xaxis.scale.units.post'],
                    'scale.labels.count': prop['chart.xaxis.labels.count'],
                    'scale.strict':       true
                 });

                this.max = this.scale2.max;
    
            } else {

                var grouping = prop['chart.grouping'];

                for (i=0; i<this.data.length; ++i) {
                    if (typeof(this.data[i]) == 'object') {
                        var value = grouping == 'grouped' ? Number(RG.arrayMax(this.data[i], true)) : Number(RG.arraySum(this.data[i]));
                    } else {
                        var value = Number(ma.abs(this.data[i]));
                    }
    
                    this.max = ma.max(Math.abs(this.max), Math.abs(value));
                }

                this.scale2 = RG.getScale2(this, {
                    'scale.max':          this.max,
                    'scale.min':          prop['chart.xaxis.scale.min'],
                    'scale.decimals':     Number(prop['chart.xaxis.scale.decimals']),
                    'scale.point':        prop['chart.xaxis.scale.point'],
                    'scale.thousand':     prop['chart.xaxis.scale.thousand'],
                    'scale.round':        prop['chart.xaxis.scale.round'],
                    'scale.units.pre':    prop['chart.xaxis.scale.units.pre'],
                    'scale.units.post':   prop['chart.xaxis.scale.units.post'],
                    'scale.labels.count': prop['chart.xaxis.labels.count']
                });


                this.max = this.scale2.max;
                this.min = this.scale2.min;
            }
    
            if (prop['chart.xaxis.scale.decimals'] == null && Number(this.max) == 1) {
                this.Set('chart.xaxis.scale.decimals', 1);
            }
            
            /**
            * This is here to facilitate sequential colors
            */
            var colorIdx = 0;
            
            //
            // For grouped bars we need to calculate the number of bars
            //
            this.numbars = RG.arrayLinearize(this.data).length;




            /**
            * if the chart is adjustable fix the scale so that it doesn't change.
            * 
            * It's here (after the scale generation) so that the max value can be
            * set to the maximum scale value)
            */
            if (prop['chart.adjustable'] && !prop['chart.xaxis.scale.max']) {
                this.set('chart.xaxis.scale.max', this.scale2.max);
            }



            // Draw the 3d axes if necessary
            if (prop['chart.variant'] === '3d') {
                RG.draw3DAxes(this);
            }






            /**
            * The bars are drawn HERE
            */
            var graphwidth = (ca.width - this.marginLeft - this.marginRight);
            var halfwidth  = graphwidth / 2;

            for (i=(len=this.data.length-1); i>=0; --i) {

                // Work out the width and height
                var width  = ma.abs((this.data[i] / this.max) *  graphwidth);
                var height = this.graphheight / this.data.length;

                var orig_height = height;

                var x       = this.marginLeft;
                var y       = this.marginTop + (i * height);
                var vmargin = prop['chart.vmargin'];
                
                // Account for the Y axis being on the right hand side
                if (prop['chart.yaxis.position'] === 'right') {
                    x = ca.width - this.marginRight - ma.abs(width);
                }

                // Account for negative lengths - Some browsers (eg Chrome) don't like a negative value
                if (width < 0) {
                    x -= width;
                    width = ma.abs(width);
                }
    
                /**
                * Turn on the shadow if need be
                */
                if (prop['chart.shadow']) {
                    co.shadowColor   = prop['chart.shadow.color'];
                    co.shadowBlur    = prop['chart.shadow.blur'];
                    co.shadowOffsetX = prop['chart.shadow.offsetx'];
                    co.shadowOffsetY = prop['chart.shadow.offsety'];
                }

                /**
                * Draw the bar
                */
                co.beginPath();
                
                    // Standard (non-grouped and non-stacked) bars here
                    if (typeof this.data[i] == 'number' || RG.isNull(this.data[i])) {

                        var barHeight = height - (2 * vmargin),
                            barWidth  = ((this.data[i] - prop['chart.xaxis.scale.min']) / (this.max - prop['chart.xaxis.scale.min'])) * this.graphwidth,
                            barX      = this.marginLeft;
    
                        // Account for Y axis pos
                        if (prop['chart.yaxis.position'] == 'center') {
                            barWidth /= 2;
                            barX += halfwidth;
                            
                            if (this.data[i] < 0) {
                                barWidth = (ma.abs(this.data[i]) - prop['chart.xaxis.scale.min']) / (this.max - prop['chart.xaxis.scale.min']);
                                barWidth = barWidth * (this.graphwidth / 2);
                                barX = ((this.graphwidth / 2) + this.marginLeft) - barWidth;
                            }

                        } else if (prop['chart.yaxis.position'] == 'right') {

                            barWidth = ma.abs(barWidth);
                            barX = ca.width - this.marginRight - barWidth;

                        }

                        // Set the fill color
                        co.strokeStyle = prop['chart.colors.stroke'];
                        co.fillStyle   = prop['chart.colors'][0];

                        // Sequential colors
                        ++colorIdx;
                        if (prop['chart.colors.sequential'] && typeof colorIdx === 'number') {
                            if (prop['chart.colors'][this.numbars - colorIdx]) {
                                co.fillStyle = prop['chart.colors'][this.numbars - colorIdx];
                            } else {
                                co.fillStyle = prop['chart.colors'][prop['chart.colors'].length - 1];
                            }
                        }



                        co.strokeRect(barX, this.marginTop + (i * height) + prop['chart.vmargin'], barWidth, barHeight);
                        co.fillRect(barX, this.marginTop + (i * height) + prop['chart.vmargin'], barWidth, barHeight);


                            



                        this.coords.push([
                            barX,
                            y + vmargin,
                            barWidth,
                            height - (2 * vmargin),
                            co.fillStyle,
                            this.data[i],
                            true
                        ]);






                        // Draw the 3D effect using the coords that have just been stored
                        if (prop['chart.variant'] === '3d' && typeof this.data[i] == 'number') {


                            var prevStrokeStyle = co.strokeStyle,
                                prevFillStyle   = co.fillStyle;

                            /**
                            * Turn off the shadow for the 3D bits
                            */
                            RG.noShadow(this);
                            
                            // DRAW THE 3D BITS HERE
                            var barX    = barX,
                                barY    = y + vmargin,
                                barW    = barWidth,
                                barH    = height - (2 * vmargin),
                                offsetX = prop['chart.variant.threed.offsetx'],
                                offsetY = prop['chart.variant.threed.offsety'],
                                value   = this.data[i];


                            pa2(
                                co,
                                [
                                 'b',
                                 'm', barX, barY,
                                 'l', barX + offsetX - (prop['chart.yaxis.position'] == 'left' && value < 0 ? offsetX : 0), barY - offsetY,
                                 'l', barX + barW + offsetX - (prop['chart.yaxis.position'] == 'center' && value < 0 ? offsetX : 0), barY - offsetY,
                                 'l', barX + barW, barY,
                                 'c',
                                 's', co.strokeStyle,
                                 'f', co.fillStyle,
                                 'f','rgba(255,255,255,0.6)'//Fill again to lighten it
                                ]
                            );

                            if (   prop['chart.yaxis.position'] !== 'right'
                                && !(prop['chart.yaxis.position'] === 'center' && value < 0)
                                && value >= 0
                                && !RG.isNull(value)
                               ) {

                                pa2(
                                    co,
                                    [
                                     'b',
                                     'fs', prevFillStyle,
                                     'm', barX + barW, barY,
                                     'l', barX + barW + offsetX, barY - offsetY,
                                     'l', barX + barW + offsetX, barY - offsetY + barH,
                                     'l', barX + barW, barY + barH,
                                     'c',
                                     's', co.strokeStyle,
                                     'f', prevFillStyle,
                                     'f', 'rgba(0,0,0,0.25)'
                                    ]
                                );
                            }

                        }






                    /**
                    * Stacked bar chart
                    */
                    } else if (typeof(this.data[i]) == 'object' && prop['chart.grouping'] == 'stacked') {

                        if (prop['chart.yaxis.position'] == 'center') {
                            alert('[HBAR] You can\'t have a stacked chart with the Y axis in the center, change it to grouped');
                        } else if (prop['chart.yaxis.position'] == 'right') {
                            var x = ca.width - this.marginRight
                        }

                        var barHeight = height - (2 * vmargin);

                        if (typeof this.coords2[i] == 'undefined') {
                            this.coords2[i] = [];
                        }

                        for (j=0; j<this.data[i].length; ++j) {

                            // The previous 3D segments would have turned the shadow off - so turn it back on
                            if (prop['chart.shadow'] && prop['chart.variant'] === '3d') {
                                co.shadowColor   = prop['chart.shadow.color'];
                                co.shadowBlur    = prop['chart.shadow.blur'];
                                co.shadowOffsetX = prop['chart.shadow.offsetx'];
                                co.shadowOffsetY = prop['chart.shadow.offsety'];
                            }

                            //
                            // Ensure the number is positive
                            //(even though having the X axis on the right implies a
                            //negative value)
                            //
                            if (!RG.isNull(this.data[i][j])) this.data[i][j] = ma.abs(this.data[i][j]);

    
                            var last = (j === (this.data[i].length - 1) );
                            
                            // Set the fill/stroke colors
                            co.strokeStyle = prop['chart.colors.stroke'];

                            // Sequential colors
                            ++colorIdx;
                            if (prop['chart.colors.sequential'] && typeof colorIdx === 'number') {
                                if (prop['chart.colors'][this.numbars - colorIdx]) {
                                    co.fillStyle = prop['chart.colors'][this.numbars - colorIdx];
                                } else {
                                    co.fillStyle = prop['chart.colors'][prop['chart.colors'].length - 1];
                                }
                            } else if (prop['chart.colors'][j]) {
                                co.fillStyle = prop['chart.colors'][j];
                            }
                            
    
                            var width = (((this.data[i][j]) / (this.max))) * this.graphwidth;
                            var totalWidth = (RG.arraySum(this.data[i]) / this.max) * this.graphwidth;
                            
                            if (prop['chart.yaxis.position'] === 'right') {
                                x -= width;
                            }
                            


                            co.strokeRect(x, this.marginTop + prop['chart.vmargin'] + (this.graphheight / this.data.length) * i, width, height - (2 * vmargin) );
                            co.fillRect(x, this.marginTop + prop['chart.vmargin'] + (this.graphheight / this.data.length) * i, width, height - (2 * vmargin) );


                            /**
                            * Store the coords for tooltips
                            */
    
                            // The last property of this array is a boolean which tells you whether the value is the last or not
                            this.coords.push([
                                x,
                                y + vmargin,
                                width,
                                height - (2 * vmargin),
                                co.fillStyle,
                                RG.array_sum(this.data[i]),
                                j == (this.data[i].length - 1)
                            ]);

                            this.coords2[i].push([
                                x,
                                y + vmargin,
                                width,
                                height - (2 * vmargin),
                                co.fillStyle,
                                RG.array_sum(this.data[i]),
                                j == (this.data[i].length - 1)
                            ]);






                            // 3D effect
                            if (prop['chart.variant'] === '3d') {
                            
                                /**
                                * Turn off the shadow for the 3D bits
                                */
                                RG.noShadow(this);

                                var prevStrokeStyle = co.strokeStyle,
                                    prevFillStyle   = co.fillStyle;

                                // DRAW THE 3D BITS HERE
                                var barX    = x,
                                    barY    = y + vmargin,
                                    barW    = width,
                                    barH    = height - (2 * vmargin),
                                    offsetX = prop['chart.variant.threed.offsetx'],
                                    offsetY = prop['chart.variant.threed.offsety'],
                                    value   = this.data[i][j];

                                if (!RG.isNull(value)) {
                                    pa2(
                                        co,
                                        [
                                         'b',
                                         'm', barX, barY,
                                         'l', barX + offsetX, barY - offsetY,
                                         'l', barX + barW + offsetX, barY - offsetY,
                                         'l', barX + barW, barY,
                                         'c',
                                         's', co.strokeStyle,
                                         'f', co.fillStyle,
                                         'f','rgba(255,255,255,0.6)'//Fill again to lighten it
                                        ]
                                    );
                                }
    
                                if (   prop['chart.yaxis.position'] !== 'right'
                                    && !(prop['chart.yaxis.position'] === 'center' && value < 0)
                                    && !RG.isNull(value)
                                   ) {

                                    pa2(
                                        co,
                                        [
                                         'fs', prevFillStyle,
                                         'b',
                                         'm', barX + barW, barY,
                                         'l', barX + barW + offsetX, barY - offsetY,
                                         'l', barX + barW + offsetX, barY - offsetY + barH,
                                         'l', barX + barW, barY + barH,
                                         'c',
                                         's', co.strokeStyle,
                                         'f', prevFillStyle,
                                         'f', 'rgba(0,0,0,0.25)'
                                        ]
                                    );
                                }
                            
                                co.beginPath();
                                co.strokeStyle = prevStrokeStyle;
                                co.fillStyle   = prevFillStyle;
                            }
    
    
    
    
    
    
                            if (prop['chart.yaxis.position'] !== 'right') {
                                x += width;
                            }
                        }








                    /**
                    * A grouped bar chart
                    */
                    } else if (typeof(this.data[i]) == 'object' && prop['chart.grouping'] == 'grouped') {

                        var vmarginGrouped      = prop['chart.vmargin.grouped'];
                        var individualBarHeight = ((height - (2 * vmargin) - ((this.data[i].length - 1) * vmarginGrouped)) / this.data[i].length)
                        
                        if (typeof this.coords2[i] == 'undefined') {
                            this.coords2[i] = [];
                        }
                        
                        for (j=(this.data[i].length - 1); j>=0; --j) {
    
                            /**
                            * Turn on the shadow if need be
                            */
                            if (prop['chart.shadow']) {
                                RG.setShadow(
                                    this,
                                    prop['chart.shadow.color'],
                                    prop['chart.shadow.offsetx'],
                                    prop['chart.shadow.offsety'],
                                    prop['chart.shadow.blur']
                                );
                            }
    
                            // Set the fill/stroke colors
                            co.strokeStyle = prop['chart.colors.stroke'];

                            // Sequential colors
                            ++colorIdx;
                            if (prop['chart.colors.sequential'] && typeof colorIdx === 'number') {
                                if (prop['chart.colors'][this.numbars - colorIdx]) {
                                    co.fillStyle = prop['chart.colors'][this.numbars - colorIdx];
                                } else {
                                    co.fillStyle = prop['chart.colors'][prop['chart.colors'].length - 1];
                                }
                            } else if (prop['chart.colors'][j]) {
                                co.fillStyle = prop['chart.colors'][j];
                            }
    
    
    
                            var startY = this.marginTop + (height * i) + (individualBarHeight * j) + vmargin + (vmarginGrouped * j);
                            var width = ((this.data[i][j] - prop['chart.xaxis.scale.min']) / (this.max - prop['chart.xaxis.scale.min'])) * (ca.width - this.marginLeft - this.marginRight );
                            var startX = this.marginLeft;

    

                            // Account for the Y axis being in the middle
                            if (prop['chart.yaxis.position'] == 'center') {
                                width  /= 2;
                                startX += halfwidth;
                            
                            // Account for the Y axis being on the right
                            } else if (prop['chart.yaxis.position'] == 'right') {
                                width = ma.abs(width);
                                startX = ca.width - this.marginRight - ma.abs(width);
                            }
                            
                            if (width < 0) {
                                startX += width;
                                width *= -1;
                            }
    
                            co.strokeRect(startX, startY, width, individualBarHeight);
                            co.fillRect(startX, startY, width, individualBarHeight);






                            this.coords.push([
                                startX,
                                startY,
                                width,
                                individualBarHeight,
                                co.fillStyle,
                                this.data[i][j],
                                true
                            ]);
    
                            this.coords2[i].push([
                                startX,
                                startY,
                                width,
                                individualBarHeight,
                                co.fillStyle,
                                this.data[i][j],
                                true
                            ]);












                            // 3D effect
                            if (prop['chart.variant'] === '3d') {
                            
                                /**
                                * Turn off the shadow for the 3D bits
                                */
                                RG.noShadow(this);

                                var prevStrokeStyle = co.strokeStyle,
                                    prevFillStyle   = co.fillStyle;
                            
                                // DRAW THE 3D BITS HERE
                                var barX    = startX,
                                    barY    = startY,
                                    barW    = width,
                                    barH    = individualBarHeight,
                                    offsetX = prop['chart.variant.threed.offsetx'],
                                    offsetY = prop['chart.variant.threed.offsety'],
                                    value   = this.data[i][j];
                                
                                pa2(
                                    co,
                                    [
                                     'b',
                                     'm', barX, barY,
                                     'l', barX + offsetX, barY - offsetY,
                                     'l', barX + barW + offsetX - (value < 0 ? offsetX : 0), barY - offsetY,
                                     'l', barX + barW, barY,
                                     'c',
                                     's', co.strokeStyle,
                                     'f', co.fillStyle,
                                     'f','rgba(255,255,255,0.6)'//Fill again to lighten it
                                    ]
                                );
    
                                if (   prop['chart.yaxis.position'] !== 'right'
                                    && !(prop['chart.yaxis.position'] === 'center' && value < 0)
                                    && value >= 0
                                    && !RG.isNull(value)
                                   ) {

                                    pa2(
                                        co,
                                        [
                                         'fs', prevFillStyle,
                                         'b',
                                         'm', barX + barW, barY,
                                         'l', barX + barW + offsetX, barY - offsetY,
                                         'l', barX + barW + offsetX, barY - offsetY + barH,
                                         'l', barX + barW, barY + barH,
                                         'c',
                                         's', co.strokeStyle,
                                         'f', prevFillStyle,
                                         'f', 'rgba(0,0,0,0.25)'
                                        ]
                                    );
                                }





                                co.beginPath();
                                co.strokeStyle = prevStrokeStyle;
                                co.fillStyle   = prevFillStyle;
                            }






                        }
                        
                        startY += vmargin;
                    }
    
                co.closePath();
            }
    
            co.stroke();
            co.fill();
            
            // Under certain circumstances we can cover the shadow
            // overspill with a white rectangle
            if (prop['chart,yaxis.position'] === 'right') {
                pa2(co, 'cr % % % %',
                    ca.width - this.marginRight + prop['chart.variant.threed.offsetx'],
                    '0',
                    this.marginRight,
                    ca.height
                );
            }






            // Draw the 3d axes AGAIN if the Y axis is on the right
            if (   prop['chart.yaxis.position'] === 'right'
                && prop['chart.variant'] === '3d'
               ) {
                RG.draw3DYAxis(this);
            }
    
            /**
            * Now the bars are stroke()ed, turn off the shadow
            */
            RG.noShadow(this);
            
            
            //
            // Reverse the coords arrays as the bars are drawn from the borrom up now
            //
            this.coords  = RG.arrayReverse(this.coords);
            
            if (prop['chart.grouping'] === 'grouped') {
                for (var i=0; i<this.coords2.length; ++i) {
                    this.coords2[i] = RG.arrayReverse(this.coords2[i]);
                }
            }
            

            this.redrawBars();
        };








        /**
        * This function goes over the bars after they been drawn, so that upwards shadows are underneath the bars
        */
        this.redrawBars =
        this.RedrawBars = function ()
        {
            if (!prop['chart.redraw']) {
                return;
            }
    
            var coords = this.coords;
    
            var font   = prop['chart.text.font'],
                size   = prop['chart.text.size'],
                color  = prop['chart.text.color'];
    
            RG.noShadow(this);
            co.strokeStyle = prop['chart.colors.stroke'];
    
            for (var i=0; i<coords.length; ++i) {

                if (prop['chart.shadow']) {
                    
                    pa2(co, 'b lw % r % % % % s % f %',
                        prop['chart.linewidth'],
                        coords[i][0],
                        coords[i][1],
                        coords[i][2],
                        coords[i][3],
                        prop['chart.colors.stroke'],
                        coords[i][4]
                    );
                }





                // Draw labels "above" the bar
                var halign = 'left';
                if (prop['chart.labels.above'] && coords[i][6]) {
    
                    var border = (coords[i][0] + coords[i][2] + 7 + co.measureText(prop['chart.labels.above.units.pre'] + this.coords[i][5] + prop['chart.labels.above.units.post']).width) > ca.width ? true : false,
                        text   = RG.numberFormat({
                            object:    this,
                            number:    (this.coords[i][5]).toFixed(prop['chart.labels.above.decimals']),
                            unitspre:  prop['chart.labels.above.units.pre'],
                            unitspost: prop['chart.labels.above.units.post'],
                            point:     prop['chart.labels.above.point'],
                            thousand:  prop['chart.labels.above.thousand']
                        });

                    RG.noShadow(this);

                    // Check for specific labels
                    if (typeof prop['chart.labels.above.specific'] === 'object' && prop['chart.labels.above.specific'] && prop['chart.labels.above.specific'][i]) {
                        text = prop['chart.labels.above.specific'][i];
                    }

                    var x = coords[i][0] + coords[i][2] + 5;
                    var y = coords[i][1] + (coords[i][3] / 2);
                    
                    if (prop['chart.yaxis.position'] === 'right') {
                        x = coords[i][0] - 5;
                        halign = 'right';
                    } else if (prop['chart.yaxis.position'] === 'center' && this.data_arr[i] < 0) {
                        x = coords[i][0] - 5;
                        halign = 'right';
                    }
                    
                    var textConf = RG.getTextConf({
                        object: this,
                        prefix: 'chart.labels.above'
                    });
                    RG.text2(this, {

                     font: textConf.font,
                     size: textConf.size,
                    color: textConf.color,
                     bold: textConf.bold,
                   italic: textConf.italic,

                        x:          x,
                        y:          y,
                        text:       text,
                        valign:     'center',
                        halign:     halign,
                        tag:        'labels.above'
                    });
                }
            }
        };








        /**
        * This function can be used to get the appropriate bar information (if any)
        * 
        * @param  e Event object
        * @return   Appriate bar information (if any)
        */
        this.getShape =
        this.getBar = function (e)
        {
            var mouseXY = RG.getMouseXY(e);
    
            /**
            * Loop through the bars determining if the mouse is over a bar
            */
            for (var i=0,len=this.coords.length; i<len; i++) {
    
                var mouseX = mouseXY[0],  // In relation to the canvas
                    mouseY = mouseXY[1],  // In relation to the canvas
                    left   = this.coords[i][0],
                    top    = this.coords[i][1],
                    width  = this.coords[i][2],
                    height = this.coords[i][3],
                    idx    = i;



                // Recreate the path/rectangle so that it can be tested
                //  ** DO NOT STROKE OR FILL IT **
                pa2(co,['b','r',left,top,width,height]);

                if (co.isPointInPath(mouseX, mouseY)) {

                    var tooltip = RG.parseTooltipText(prop['chart.tooltips'], i);

                    return {
                        0: this,   'object': this,
                        1: left,   'x': left,
                        2: top,    'y': top,
                        3: width,  'width': width,
                        4: height, 'height': height,
                        5: idx,    'index': idx,
                        'tooltip': tooltip
                    };
                }
            }
        };








        /**
        * When you click on the chart, this method can return the X value at that point. It works for any point on the
        * chart (that is inside the margins) - not just points within the Bars.
        * 
        * @param object e The event object
        */
        this.getValue = function (arg)
        {
            if (arg.length == 2) {
                var mouseX = arg[0];
                var mouseY = arg[1];
            } else {
                var mouseCoords = RG.getMouseXY(arg);
                var mouseX      = mouseCoords[0];
                var mouseY      = mouseCoords[1];
            }

            if (   mouseY < this.marginTop
                || mouseY > (ca.height - this.marginBottom)
                || mouseX < this.marginLeft
                || mouseX > (ca.width - this.marginRight)
               ) {
                return null;
            }





            if (prop['chart.yaxis.position'] == 'center') {
                var value = ((mouseX - this.marginLeft) / (this.graphwidth / 2)) * (this.max - prop['chart.xaxis.scale.min']);
                    value = value - this.max
                    
                    // Special case if xmin is defined
                    if (prop['chart.xaxis.scale.min'] > 0) {
                        value = ((mouseX - this.marginLeft - (this.graphwidth / 2)) / (this.graphwidth / 2)) * (this.max - prop['chart.xaxis.scale.min']);
                        value += prop['chart.xaxis.scale.min'];
                        
                        if (mouseX < (this.marginLeft + (this.graphwidth / 2))) {
                            value -= (2 * prop['chart.xaxis.scale.min']);
                        }
                    }
            
            
            // TODO This needs fixing
            } else if (prop['chart.yaxis.position'] == 'right') {
                var value = ((mouseX - this.marginLeft) / this.graphwidth) * (this.scale2.max - prop['chart.xaxis.scale.min']);
                    value = this.scale2.max - value;

            } else {
                var value = ((mouseX - this.marginLeft) / this.graphwidth) * (this.scale2.max - prop['chart.xaxis.scale.min']);
                    value += prop['chart.xaxis.scale.min'];
            }

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
                RG.Highlight.Rect(this, shape);
            }
        };








        /**
        * The getObjectByXY() worker method. Don't call this call:
        * 
        * RG.ObjectRegistry.getObjectByXY(e)
        * 
        * @param object e The event object
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
                   mouseXY[0] >= this.marginLeft
                && mouseXY[0] <= (ca.width - this.marginRight)
                && mouseXY[1] >= this.marginTop
                && mouseXY[1] <= (ca.height - this.marginBottom)
                ) {
    
                return this;
            }
        };








        /**
        * Returns the appropriate Y coord for the given value
        * 
        * @param number value The value to get the coord for
        */
        this.getXCoord = function (value)
        {
    
            if (prop['chart.yaxis.position'] == 'center') {
        
                // Range checking
                if (value > this.max || value < (-1 * this.max)) {
                    return null;
                }
    
                var width = (ca.width - prop['chart.margin.left'] - prop['chart.margin.right']) / 2;
                var coord = (((value - prop['chart.xaxis.scale.min']) / (this.max - prop['chart.xaxis.scale.min'])) * width) + width;
    
                    coord = prop['chart.margin.left'] + coord;
            } else {
            
                // Range checking
                if (value > this.max || value < 0) {
                    return null;
                }
    
                var width = ca.width - prop['chart.margin.left'] - prop['chart.margin.right'];
                var coord = ((value - prop['chart.xaxis.scale.min']) / (this.max - prop['chart.xaxis.scale.min'])) * width;
    
                    coord = prop['chart.margin.left'] + coord;
            }
    
            return coord;
        };








        /**
        * 
        */
        this.parseColors = function ()
        {
            // Save the original colors so that they can be restored when the canvas is reset
            if (this.original_colors.length === 0) {
                //this.original_colors['chart.'] = RG.array_clone(prop['chart.']);
                this.original_colors['chart.colors']                 = RG.arrayClone(prop['chart.colors']);
                this.original_colors['chart.background.grid.color']  = RG.arrayClone(prop['chart.background.grid.color']);
                this.original_colors['chart.background.color']       = RG.arrayClone(prop['chart.background.color']);
                this.original_colors['chart.background.bars.color1'] = RG.arrayClone(prop['chart.background.bars.color1']);
                this.original_colors['chart.background.bars.color2'] = RG.arrayClone(prop['chart.background.bars.color2']);
                this.original_colors['chart.text.color']             = RG.arrayClone(prop['chart.text.color']);
                this.original_colors['chart.yaxis.labels.color']     = RG.arrayClone(prop['chart.yaxis.labels.color']);
                this.original_colors['chart.colors.stroke']          = RG.arrayClone(prop['chart.colors.stroke']);
                this.original_colors['chart.axes.color']             = RG.arrayClone(prop['chart.axes.color']);
                this.original_colors['chart.highlight.fill']         = RG.arrayClone(prop['chart.highlight.fill']);
                this.original_colors['chart.highlight.stroke']       = RG.arrayClone(prop['chart.highlight.stroke']);
                
            }

            var colors = prop['chart.colors'];
    
            for (var i=0; i<colors.length; ++i) {
                colors[i] = this.parseSingleColorForGradient(colors[i]);
            }
            
            prop['chart.background.grid.color']  = this.parseSingleColorForGradient(prop['chart.background.grid.color']);
            prop['chart.background.color']       = this.parseSingleColorForGradient(prop['chart.background.color']);
            prop['chart.background.bars.color1'] = this.parseSingleColorForGradient(prop['chart.background.bars.color1']);
            prop['chart.background.bars.color2'] = this.parseSingleColorForGradient(prop['chart.background.bars.color2']);
            prop['chart.text.color']             = this.parseSingleColorForGradient(prop['chart.text.color']);
            prop['chart.yaxis.labels.color']     = this.parseSingleColorForGradient(prop['chart.yaxis.labels.color']);
            prop['chart.colors.stroke']          = this.parseSingleColorForGradient(prop['chart.colors.stroke']);
            prop['chart.axes.color']             = this.parseSingleColorForGradient(prop['chart.axes.color']);
            prop['chart.highlight.fill']         = this.parseSingleColorForGradient(prop['chart.highlight.fill']);
            prop['chart.highlight.stroke']       = this.parseSingleColorForGradient(prop['chart.highlight.stroke']);
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
                
                if (prop['chart.yaxis.position'] === 'right') {
                    parts = RG.arrayReverse(parts);
                }
    
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
        * This function handles highlighting an entire data-series for the interactive
        * key
        * 
        * @param int index The index of the data series to be highlighted
        */
        this.interactiveKeyHighlight = function (index)
        {
            var obj = this;

            this.coords2.forEach(function (value, idx, arr)
            {
                var shape = obj.coords2[idx][index]
                var pre_linewidth = co.lineWidth;
                co.lineWidth = 2;
                co.fillStyle   = prop['chart.key.interactive.highlight.chart.fill'];
                co.strokeStyle = prop['chart.key.interactive.highlight.chart.stroke'];
                co.fillRect(shape[0], shape[1], shape[2], shape[3]);
                co.strokeRect(shape[0], shape[1], shape[2], shape[3]);
                
                // Reset the lineWidth
                co.lineWidth = pre_linewidth;
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








        /**
        * This function runs once only
        * (put at the end of the file (before any effects))
        */
        this.firstDrawFunc = function ()
        {
        };








        /**
        * This retrives the bar based on the X coordinate only.
        * 
        * @param object e The event object
        * @param object   OPTIONAL You can pass in the bar object instead of the
        *                          function using "this"
        */
        this.getShapeByY = function (e)
        {
            var mouseXY = RG.getMouseXY(e);
    
    
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

                var mouseX = mouseXY[0],
                    mouseY = mouseXY[1],    
                    left   = obj.coords[i][0],
                    top    = obj.coords[i][1],
                    width  = obj.coords[i][2],
                    height = obj.coords[i][3];
    
                if (mouseY >= top && mouseY <= (top + height)) {
                
                    if (prop['chart.tooltips']) {
                        var tooltip = RG.parseTooltipText ? RG.parseTooltipText(prop['chart.tooltips'], i) : prop['chart.tooltips'][i];
                    }    

                    return {
                        0: obj,    object: obj,
                        1: left,   x: left,
                        2: top,    y: top,
                        3: width,  width: width,
                        4: height, height: height,
                        5: i,      index: i,
                                   tooltip: tooltip
                    };
                }
            }
            
            return null;
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
                var value = Number(this.getValue(e)),
                    shape = RG.Registry.get('chart.adjusting.shape');

                if (shape) {

                    RG.Registry.Set('chart.adjusting.shape', shape);

                    if (this.stackedOrGrouped && prop['chart.grouping'] == 'grouped') {

                        var indexes = RG.sequentialIndexToGrouped(shape['index'], this.data);

                        if (typeof this.data[indexes[0]] == 'number') {
                            this.data[indexes[0]] = Number(value);
                        } else if (!RG.is_null(this.data[indexes[0]])) {
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
        * Grow
        * 
        * The HBar chart Grow effect gradually increases the values of the bars
        * 
        * @param object   OPTIONAL Options for the effect. You can pass frames here
        * @param function OPTIONAL A callback function
        */
        this.grow = function ()
        {
            var obj         = this,
                opt         = arguments[0] || {},
                frames      = opt.frames || 30,
                frame       = 0,
                callback    = arguments[1] || function () {},
                labelsAbove = prop['chart.labels.above'];
            
            this.set('chart.labels.above', false);


            // Save the data
            obj.original_data = RG.arrayClone(obj.data);


            // Stop the scale from changing by setting chart.xaxis.scale.max (if it's not already set)
            if (prop['chart.xaxis.scale.max'] == 0) {

                var xmax = 0;
    
                for (var i=0; i<obj.data.length; ++i) {
                    if (RG.isArray(obj.data[i]) && prop['chart.grouping'] == 'stacked') {
                        xmax = ma.max(xmax, RG.arraySum(obj.data[i]));
                    } else if (RG.isArray(obj.data[i]) && prop['chart.grouping'] == 'grouped') {
                        xmax = ma.max(xmax, RG.arrayMax(obj.data[i]));
                    } else {
                        xmax = ma.max(xmax, ma.abs(RG.arrayMax(obj.data[i])));
                    }
                }

                var scale2 = RG.getScale2(obj, {'scale.max':xmax});
                obj.set('chart.xaxis.scale.max', scale2.max);
            }

            function iterator ()
            {
                // Alter the Bar chart data depending on the frame
                for (var j=0,len=obj.original_data.length; j<len; ++j) {
                    
                    // This stops the animation from being completely linear
                    var easingFactor = RG.Effects.getEasingMultiplier(frames, frame);
    
                    if (typeof obj.data[j] === 'object' && obj.data[j]) {
                        for (var k=0,len2=obj.data[j].length; k<len2; ++k) {
                            obj.data[j][k] = RG.isNull(obj.data[j][k]) ? null : obj.original_data[j][k] * easingFactor;
                        }
                    } else {
                        obj.data[j] = RG.isNull(obj.data[j]) ? null : obj.original_data[j] * easingFactor;
                    }
                }
    
    

                RG.redrawCanvas(obj.canvas);
    
                if (frame < frames) {
                    frame += 1;
                    RG.Effects.updateCanvas(iterator);
                } else {

                    if (labelsAbove) {
                        obj.set('chart.labels.above', true);
                        RG.redraw();
                    }

                    callback(obj);
                }
            }
            
            iterator();
            
            return this;
        };








        /**
        * Grow
        *
        * The HBar chart Grow effect gradually increases the values of the bars
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




            this.original_data = RG.arrayClone(this.data);



            // Stop the scale from changing by setting chart.xaxis.scale.max (if it's not already set)
            if (prop['chart.xaxis.scale.max'] == 0) {

                var xmax = 0;
    
                for (var i=0; i<obj.data.length; ++i) {
                    if (RG.isArray(obj.data[i]) && prop['chart.grouping'] == 'stacked') {
                        xmax = ma.max(xmax, RG.arraySum(obj.data[i]));
                    } else if (RG.isArray(obj.data[i]) && prop['chart.grouping'] == 'grouped') {
                        xmax = ma.max(xmax, RG.arrayMax(obj.data[i]));
                    } else {
                        xmax = ma.max(xmax, ma.abs(RG.arrayMax(obj.data[i])));
                    }
                }

                var scale2 = RG.getScale2(obj, {'scale.max':xmax});
                obj.set('chart.xaxis.scale.max', scale2.max);
            }


            // Go through the data and change string arguments of the format +/-[0-9]
            // to absolute numbers
            if (RG.isArray(opt.data)) {

                var xmax = 0;

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

                            xmax = ma.max(xmax, opt.data[i][j]);
                        }
                    } else if (typeof opt.data[i] === 'string' && opt.data[i].match(/(\+|\-)([0-9]+)/)) {
                        if (RegExp.$1 === '+') {
                            opt.data[i] = this.original_data[i] + parseFloat(RegExp.$2);
                        } else {
                            opt.data[i] = this.original_data[i] - parseFloat(RegExp.$2);
                        }

                        xmax = ma.max(xmax, opt.data[i]);
                    } else {
                        xmax = ma.max(xmax, opt.data[i]);
                    }
                }


                var scale = RG.getScale2(this, {'scale.max':xmax});
                if (RG.isNull(this.get('chart.xaxis.scale.max'))) {
                    this.set('chart.xaxis.scale.max', scale.max);
                }
            }








            //
            // turn off the labelsAbove option whilst animating
            //
            this.set('chart.labels.above', false);








            // Stop the scale from changing by setting chart.xaxis.scale.max (if it's not already set)
            if (RG.isNull(prop['chart.xaxis.scale.max'])) {

                var xmax = 0;

                for (var i=0; i<obj.data.length; ++i) {
                    if (RG.isArray(this.data[i]) && prop['chart.grouping'] === 'stacked') {
                        xmax = ma.max(xmax, ma.abs(RG.arraySum(this.data[i])));

                    } else if (RG.isArray(this.data[i]) && prop['chart.grouping'] === 'grouped') {

                        for (var j=0,group=[]; j<this.data[i].length; j++) {
                            group.push(ma.abs(this.data[i][j]));
                        }

                        xmax = ma.max(xmax, ma.abs(RG.arrayMax(group)));

                    } else {
                        xmax = ma.max(xmax, ma.abs(this.data[i]));
                    }
                }

                var scale = RG.getScale2(this, {'scale.max':xmax});
                this.set('chart.xaxis.scale.max', scale.max);
            }

            // You can give an xmax to the grow function
            if (typeof opt.xmax === 'number') {
                obj.set('chart.xaxis.scale.max', opt.xmax);
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
                opt = arguments[0] || {};
                opt.frames      = opt.frames || 60;
                opt.startFrames = [];
                opt.counters    = [];

            var framesperbar   = opt.frames / 3,
                frame          = -1,
                callback       = arguments[1] || function () {},
                original       = RG.arrayClone(obj.data),
                labelsAbove    = prop['chart.labels.above'];

            this.set('chart.labels.above', false);

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
            obj.Set('chart.xaxis.scale.max', obj.scale2.max);
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
                        RG.redrawCanvas(obj.canvas);
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








        //
        // Determines whether the given shape is adjustable or not
        //
        // @param object The shape that pertains to the relevant bar
        //
        this.isAdjustable = function (shape)
        {
            if (RG.isNull(prop['chart.adjustable.only'])) {
                return true;
            }

            if (RG.isArray(prop['chart.adjustable.only']) && prop['chart.adjustable.only'][shape.index]) {
                return true;
            }

            return false;
        };








        /**
        * Charts are now always registered
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