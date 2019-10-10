from flask import Flask, jsonify, request, render_template, app, send_file, flash, redirect, url_for
from flask_restful import Api, Resource, reqparse
from flask_cors import CORS, cross_origin
from livereload import Server
from werkzeug.utils import secure_filename
import json
import subprocess
import os
import paramiko
import threading
import socket
import random
import time
import sys
from multiprocessing.pool import ThreadPool


app = Flask(__name__)
api = Api(app)
cors = CORS(app, resources={r'/*': {"origins": '*'}})
app.config['CORS_HEADER'] = 'Content-Type'
UPLOAD_FOLDER = os.getcwd()
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
cluster_info = dict()


def parallel_ssh_connect(nodes):
        node_data = dict()
        pool = ThreadPool(28)
        results = []
        for node in nodes:
            results.append(pool.apply_async(get_node_info, args=(node,)))
        pool.close()
        pool.join()
        results = [r.get() for r in results]
        count = 0
        for node in nodes:
            node_data.update({node.hostname: results[count]})
            count += 1
        return node_data


def get_node_info(node):
    node_info = dict()
    ssh = paramiko.SSHClient()
    ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy)
    ssh.load_system_host_keys()
    host_cpu_usage = str()
    host_mem_usage = str()
    host_temp = str()
    try:
        ssh.connect(node.hostname, username=node.username, password=node.password, timeout=0.5)
        cpu_in, cpu_out, cpu_err = ssh.exec_command("top -b -n 10 -d.2 | grep 'Cpu' |  awk 'NR==3{ print($2)}'")
        mem_in, mem_out, mem_err = ssh.exec_command("free | grep Mem | awk '{print $3/$2 * 100.0}'")
        temp_in, temp_out, temp_err = ssh.exec_command("vcgencmd measure_temp")
        host_cpu_usage = cpu_out.readlines()[0].strip('\n')
        host_mem_usage = mem_out.readlines()[0].strip('\n')
        host_temp = temp_out.readlines()[0].strip('\n')
        host_temp = host_temp.replace("temp=", "").strip("'C")
        cpu_in.close()
        mem_in.close()
        temp_in.close()
    except socket.error:
        host_cpu_usage, host_mem_usage, host_temp = ('0', '0', '0')
        pass
    finally:
        node_info.update({"host": node.hostname, "IP": socket.gethostbyname(node.hostname), "CPU": host_cpu_usage, "Memory": host_mem_usage,
                        "Temperature": host_temp})
        ssh.close()
    return node_info


class Node:
    def __init__(self, hostname, username, password):
        self.hostname = hostname
        self.username = username
        self.password = password
        self.IP = socket.gethostbyname(hostname)
        self.slurm_service = SlurmService('slurmd', 'slurmctld')

    def start_worker_node_daemon(self, ssh):
        self.slurm_service.set_worker()
        self.slurm_service.check_active()
        if not self.slurm_service.all_active:
            self.slurm_service.start_service()
            print('[*]Started slurm service on host:', self.hostname)


class Cluster:
    def __init__(self, host_file, cluster_config_file):
        self.host_file = host_file
        self.cluster_config_file = cluster_config_file
        self.nodes = self.get_hosts()
        self.cluster_config = self.get_cluster_config()
        self.metrics = Metrics(self.nodes)

    def start_workers_daemon(self):
        print("Starting slurm daemon on nodes...")
        for node in self.nodes:
            node.start_worker_node_daemon()

    def get_hosts(self):
        nodes_dict = dict()
        nodes_obj = list()
        with open(self.host_file, "r") as file:
            nodes_dict = json.load(file)
        for host in nodes_dict:
            new_node = Node(host, nodes_dict[host]['username'], nodes_dict[host]['password'])
            nodes_obj.append(new_node)
        return nodes_obj

    def get_cluster_config(self):
        with open(self.cluster_config_file, 'r') as f:
            cluster_info = json.load(f)
        return cluster_info


class Metrics:
    def __init__(self, cluster):
        self.cluster = cluster

    def get_node_metrics(self):
        while True:
            node_info = parallel_ssh_connect(self.cluster)
            with open('node_metrics.json', 'w') as file:
                json.dump(node_info, file, indent=4, sort_keys=True)
            time.sleep(5)


class SlurmService:
    def __init__(self, slurmd, slurmctld):
        self.is_controller = False
        self.is_worker = False
        self.slurmd = slurmd
        self.slurmctld = slurmctld
        self.all_active = False
        self.active = dict()

    def set_master(self):
        self.is_controller = True

    def set_worker(self):
        self.is_worker = True

    def check_active(self):
        slurm_services = list()
        if self.is_controller:
            slurm_services.append(self.slurmctld)
        if self.is_worker:
            slurm_services.append(self.slurmd)
        for service in slurm_services:
            with open(os.devnull, 'wb') as hide_output:
                exit_code = subprocess.Popen(['service', service, 'status'], stdout=hide_output, stderr=hide_output).wait()
            self.active.update({service: exit_code == 0})
        for service in slurm_services:
            if not self.active[service]:
                self.all_active = False
                break
            self.all_active = True

    def start_service(self):
        for service, is_active in self.active.items():
            if not is_active:
                cmd = 'sudo systemctl start %s.service' % service
                try:
                    proc = subprocess.Popen(cmd, shell=True, stdout=subprocess.PIPE)
                except BaseException as e:
                    print('[x]Exception: %s' % str(e))
                    print("Please change slurm configurations...")
                    sys.exit(1)
                print('[*]Started %s service' % service)


class Job:
    def __init__(self, job_type, job_name, script, file):
        self.job_type = job_type
        self.job_name = job_name
        self.script = script
        self.job_id = None
        self.file = file
        self.job_dir = None
        self.script_path = ''
        self.output_file = ''

    def set_job_dir(self):
        if not os.path.exists(cluster_info['NFS Directory'] + 'simulation' + os.sep + self.job_name):
            self.job_dir = cluster_info['NFS Directory'] + "simulation" + os.sep + self.job_name
        else:
            count = 1
            job = self.job_name
            while os.path.exists(cluster_info['NFS Directory'] + 'simulation' + os.sep + job):
                job = self.job_name + str(count)
                count += 1
            job_dir = cluster_info['NFS Directory'] + 'simulation' + os.sep + job
            print("Job already exists, creating new directory: " + job_dir)
            self.job_dir = job_dir

    def make_job_dir(self):
        self.set_job_dir()
        os.mkdir(self.job_dir)

    def job_exists(self):
        return os.path.exists(cluster_info['NFS Directory'] + 'simulation' + os.sep + self.job_name)

    def upload_file(self):
        filename = secure_filename(self.file.filename)
        print("------" + filename + "------")
        file_path = os.path.join(self.job_dir, filename)
        self.file.save(file_path)

    def upload_script(self):
        self.script_path = os.path.join(self.job_dir, 'run.sh')
        with open(self.script_path, 'w') as script_file:
            script_file.write(self.script)

    def run_script(self):
        self.make_job_dir()
        if self.file is not None:
            self.upload_file()
        self.upload_script()
        print(self.script_path)
        run_output = bytes.decode(subprocess.check_output(['sbatch', self.script_path]))
        print(run_output)
        self.job_id = run_output.split()[3]
        self.output_file = os.path.join(self.job_dir, 'output.out')
        while not os.path.exists(self.output_file):
            time.sleep(1)
        time.sleep(1)
        with open(self.output_file, 'r') as output_file:
            raw_output = output_file.readlines()
            output = "------" + "Job " + self.job_id + "------" + "\n\n"
            output += "".join(raw_output)
            print(output)
        return output


@app.route('/upload', methods=['GET', 'POST'])
@cross_origin(origin='*', headers=['Content-Type', 'Authorization'])
def upload_job():
    if request.method == 'POST':
        job_type = request.form['job_type']
        job_name = request.form['name']
        job_script = request.form['script']
        file = None
        if job_type == 'MPI':
            file = request.files['file']
        slurm_job = Job(job_type, job_name, job_script, file)
        if slurm_job.job_exists():
            return 'Job already exists! Please change the name of your job...'
        job_output = slurm_job.run_script()
        return job_output
    return 'File uploaded'


@app.route('/sinfo', methods=['GET'])
@cross_origin(origin='*', headers=['Content-Type', 'Authorization'])
def show_responsive():
    sinfo = dict()
    command = subprocess.check_output(['sinfo', '-R'])
    command = bytes.decode(command).split('\n')
    keys = command[0].split()
    values = command[1].split()
    for i in range(len(keys)):
        sinfo.update({keys[i]: values[i]})
    return jsonify(sinfo)


def convert(data):
    if isinstance(data, str) and "b'" in data:
        data = data.strip("b'")
        data = data.strip("'")
        return data
    if isinstance(data, bytes):
        return data.decode()
    if isinstance(data, (str, int)):
        return str(data)
    if isinstance(data, dict):
        return dict(map(convert, data.items()))
    if isinstance(data, tuple):
        return tuple(map(convert, data))
    if isinstance(data, list):
        return list(map(convert, data))
    if isinstance(data, set):
        return set(map(convert, data))


if __name__ == '__main__':
    slurm_monitor = SlurmService('slurmd', 'slurmctld')
    slurm_monitor.set_master()
    slurm_monitor.set_worker()
    slurm_monitor.check_active()
    if not slurm_monitor.all_active:
        slurm_monitor.start_service()
    host_file = 'node_info.json'
    cluster_config_file = 'cluster_info.json'
    Iocane = Cluster(host_file, cluster_config_file)
    cluster_info = Iocane.get_cluster_config()
    app.secret_key = 'super secret key'
    server = Server(app.wsgi_app)
    gather_metrics_thread = threading.Thread(target=Iocane.metrics.get_node_metrics)
    gather_metrics_thread.start()
    try:
        app.run(host=cluster_info['Login Server'])
    except OSError:
        app.run(host='0.0.0.0')
