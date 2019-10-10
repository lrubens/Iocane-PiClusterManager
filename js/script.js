// Input data
var machines = "data/machines.json";
var cluster_info = "cluster_info.json";

function postAjax(url, data, success) {
    var params = typeof data == 'string' ? data : Object.keys(data).map(
        function(k){ return encodeURIComponent(k) + '=' + encodeURIComponent(data[k]) }
    ).join('&');

    var xhr = window.XMLHttpRequest ? new XMLHttpRequest() : new ActiveXObject("Microsoft.XMLHTTP");
    xhr.open('POST', url);
    xhr.onreadystatechange = function() {
        if (xhr.readyState>3 && xhr.status===200) { success(xhr.responseText); }
    };
    xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    xhr.send(params);
    return xhr;
}

var header_ = '';
fetchData = function () {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', "data/machines.json");
    xhr.onload = function () {
        window.machines = JSON.parse(xhr.responseText);
        var clusters = Object.keys(window.machines)
    };
    xhr.send()
};

fetchData();

var nav = new Vue({

    el: '#nav',

    data: {
        active: 'generate',
        message: null,
        warning: null
    },

    // Functions we will be using.
    methods: {

        makeActive: function(item){
            this.active = item;
            console.log('Beep Boop!');
            $('#robot').show();
            setTimeout(function(){
                $("#robot").hide();
            }, 2000);
        }

    }

});

var cluster = new Vue({

    el: '#main',

    created: function() {
        this.fetchData();
        this.get_info();
    },

    data: {
        work_dir: '',
        machines: null,
        features: null,
        memory:null,
        qos: null,
        qos_choice: null,
        cluster_name: '',
        script_name: '',
        job_name: '',
        email_address: '',
        command:'',
        file_type:['.exe','C/C++'],
        file_choice: null,
        output_file:null,
        error_file:null,
        sim_type: ['MPI','Command'],
        sim_choice:null,
        time_minutes:0,
        time_hours:1,
        time_seconds:0,
        partition_name: null,
        number_nodes:1,
        tasks_per_node:null,
        host_server:'',
        feedback: 'Your program output will be displayed here. ',
        filename:'',
        total_nodes: 0,
        cluster: '',
        time:'',
        warning: null,
        output:' Your script will be displayed here. ',
        errors: 0
    },

    // Functions we will be using.
    methods: {

        // Setup
        fetchData: function () {
            var xhr = new XMLHttpRequest();
            var self = this;
            xhr.open('GET', machines);
            xhr.onload = function () {
                self.machines = JSON.parse(xhr.responseText);
                self.clusters = Object.keys(self.machines);
                $.each(self.clusters, function (i, e) {
                    $("#cluster-select").append('<option value="' + e + '">' + e + '</option>')
                })
            };
            xhr.send()
        },

        get_info: function(){
            var xhr = new XMLHttpRequest();
            var self = this;
            xhr.open('GET', cluster_info);
            xhr.onload = function() {
                var my_json = JSON.parse(xhr.responseText);
                self.work_dir = my_json['NFS Directory'];
                self.host_server = my_json['Login Server'];
                self.cluster = my_json['Cluster Name'];
                self.total_nodes = my_json['Total Nodes'];
            };
            xhr.send();
        },

        // Script Generation
        generateScript: function () {

            // Reset messages
            nav.message = null;
            nav.warning = null;

            this.errors = 0;
            this.parseTime();

            if (this.isValid() == true) {
                var header = this.writeHeader();
                this.outputScript(header);
            }

            // Scroll the user to the top
            // document.body.scrollTop = document.documentElement.scrollTop = 1;

        },

        generateOutput: function(){
//                if (document.getElementById("files").files.length === 0) {
//                    console.log("no files selected");
//                } else {
            var self = this;
            var form = new FormData();
            if (this.sim_choice === 'MPI') {
                var form_data = document.getElementById("files").files[0];
                form.append("file", form_data);
            }
            form.append("name", this.job_name);
            form.append("job_type", this.sim_choice);
            form.append("script", this.writeHeader());
            console.log(form_data);
            $.ajax({
                type: 'POST',
                url: 'http://' + this.host_server + ':5000/upload',
                data: form,
                crossDomain: true,
                contentType: false,
                mimeType: "multipart/form-data",
                cache: false,
                processData: false,
                success: function (data) {
                    self.feedback = data;
                    console.log(data);
                }
            });

        },

        runOutput: function(content) {
            nav.message = null;
            nav.warning = null;
            this.errors = 0;
            this.feedback = content;
        },

        outputScript: function (content) {
            this.output = content;

        },

        isValid: function () {

            var self = this.$data;

            // Any errors from previous functions
            if (self.errors > 0) {
                return false
            }

            // A cluster name must be defined
            if (self.cluster_name == '') {
                nav.message = 'please select a cluster to run your job';
                return false
            }

            var choice = self.machines[self.cluster_name];

            // If no partition is defined, we use default
            if (self.partition_name == null) {
                var partition = choice.defaults.partitions[0];
                // var partition = 'iocane-cluster';           // Fix this hardcoding
                nav.warning = 'You did not specify a partition, so the default "'
                    + partition + '" will be used.';
            } else {
                var partition = self.partition_name;
            }

            // Is the memory specified greater than max allowed?
            var max_memory = Number(choice.partitions[partition].MaxMemPerCPU);
            if (this.memory != null) {
                if (this.memory > max_memory) {
                    nav.warning = 'The max memory for this parition cannot be greater than ' + max_memory + '.'
                    this.memory = max_memory
                }
            }

            var max_nodes = Number(choice.partitions[partition].maxNodes);

            if ((self.number_nodes > max_nodes) || (self.number_nodes < 1)) {
                if (self.number_nodes < 1) nav.message = 'You must specify at least one node.';
                else nav.message = 'there are only ' + max_nodes + ' available for partition ' + partition;
                return false
            }

            return true
        },

        addFeature: function (event) {
            if (event) {
                var button = $(event.target);
                if (button.hasClass('active')) {
                    button.removeClass('active');
                    button.removeClass('feature');
                } else {
                    button.addClass('active');
                    button.addClass('feature');
                }
            }
        },

        parseTime: function () {

            hours = Number(this.time_hours).toString();
            minutes = Number(this.time_minutes).toString();
            seconds = Number(this.time_seconds).toString();
            if (this.time_hours < 10) hours = '0' + hours;
            if (this.time_minutes < 10) minutes = '0' + minutes;
            if (this.time_seconds < 10) seconds = '0' + seconds;
            this.time = hours + ':' + minutes + ':' + seconds;
            if (this.time === "00:00:00") {
                nav.message = 'Please specify a valid time for your job.';
                this.errors += 1;
            }
        },

        generateJump: function () {
            window.scrollTo(0, document.body.scrollHeight);
        },

        // When the user selects a cluster, we update partition choices
        updatePartitions: function () {

            var self = this.$data
            this.partition_name = null;
            var cluster_name = $("#cluster-select").val();
            var partitions = Object.keys(window.machines[cluster_name]['partitions']);
            // $("#partition-select").text('');
            // $("#partition-select").append('<option disabled value="">Please select a partition</option>');
            $.each(partitions, function (i, e) {
                $("#partition-select").append('<option value="' + e + '">' + e + '</option>')
            })

        },

        // When the user selects a partition, we update feature and qos choices
        selectPartition: function () {

            var self = this.$data;
            choice = self.machines[self.cluster_name];

            // Qos
            var partition_name = $("#partition-select").val() || choice.defaults.partitions[0];
            this.qos = self.machines[self.cluster_name].partitions[partition_name].AllowQos.split(',');

            // Features
            this.features = self.machines[self.cluster_name].features[partition_name];

            //Max memory
            var max_memory = self.machines[self.cluster_name].partitions[partition_name].MaxMemPerCPU;
            if (this.memory != null) {
                this.memory = null;
            }

        },

        writeHeader: function () {
            if ($("#files").length !== 0) {
                var fullPath = document.getElementById('files').value;
                if (fullPath) {
                    var startIndex = (fullPath.indexOf('\\') >= 0 ? fullPath.lastIndexOf('\\') : fullPath.lastIndexOf('/'));
                    var file = fullPath.substring(startIndex);
                    if (file.indexOf('\\') === 0 || filename.indexOf('/') === 0) {
                        file = file.substring(1);
                    }
                }
                this.filename = file;
            }
            var header = '#!/bin/bash\n';
            header += '#SBATCH --nodes=' + this.number_nodes.toString() + '\n';
            if (this.sim_choice === 'MPI')
                header += '#SBATCH --ntasks-per-node=4\n';

            if (this.partition_name != null) {
                header += '#SBATCH -p ' + this.partition_name + '\n';
            }

            if (this.qos_choice != null) {
                header += '#SBATCH --qos=' + this.qos_choice + '\n';
            }

            if (this.memory != null) {
                header += '#SBATCH --mem=' + this.memory + '\n';
            }

            // Add any user features
            var features = $('.feature');
            if (features.length > 0) {
                var feature_list = [];
                $.each(features, function (e, i) {
                    var new_feature = $(i).text().trim();
                    feature_list.push(new_feature)
                });
                header += '#SBATCH --constraint="' + feature_list.join('&') + '"\n';
            }

            if (this.job_name != '') {
                header += '#SBATCH --job-name=' + this.job_name + '\n'
            }
                
            header += '#SBATCH --error=' + this.work_dir + '/simulation/' + this.job_name + '/output.out\n';
            header += '#SBATCH --output=' + this.work_dir + 'simulation/' + this.job_name + '/output.out\n';

            if (this.email_address != '') {
                header += '#SBATCH --mail-user=' + this.email_address + '\n';
                header += '#SBATCH --mail-type=ALL\n'
            }

            if (this.time != '') {
                header += '#SBATCH --time=' + this.time + '\n'
            }

            if (this.script_name != '') {
                header += this.script_name + '\n';
            }

            if (this.command != '') {
                header += this.command + '\n';
            }

            if (this.filename != '' && this.file_choice === 'C/C++') {
                var output = "a.out";
                header += "mpicc -o " + this.work_dir + 'simulation/' + this.job_name + '/' + output + " " + this.work_dir + 'simulation/' + this.job_name + '/' + this.filename + '\n';
                header += "srun --mpi=pmi2 " + this.work_dir + 'simulation/' + this.job_name + '/' + output;
            }

            if (this.filename != '' && this.file_choice === '.exe') {
                header += "srun --mpi=pmi2 " + this.work_dir + 'simulation/' + this.job_name + '/' + this.filename;
            }

            // if (this.sim_choice === 'Command')
            //     header += 'sudo rm ' + this.work_dir + 'simulation/output.out';

            header += '\n';
            console.log(header);
            return header;
        }
    }
});





