# Iocane Cluster Monitor UI
This repository is a monitoring system for a cluster of raspberry pi's. A python
script uses ssh to login to each raspberry pi in the network and retrieves their 
CPU usage info. It then writes the retrieved information to a json file 
(node_info.json). The interface also allows users to submit parallel jobs to the 
cluster using the slurm job scheduler.

<!--### Web UI Screenshot
![](img/web_capture.png)--!>

### Getting Started
In order to install and start a new monitoring cluster of raspberry pi's, here 
are the steps:

On the head node (raspberry pi):
1. Setup apache web server: `sudo apt-get update && sudo apt-get install apache2 -y`
2. `git clone https://github.com/rubensl/Iocane-PiClusterManager.git`
3. `sudo mv Iocane-PiClusterManager/* /var/www/html`
4. Configure cluster_info.json to correspond to cluster info. 
5. Configure node_info.json to correspond to each node in the cluster adding in their hostnames, usernames and password. 
5. Start up backend of monitoring application: `sudo python3 start_server.py`

Testing Web UI:
1. Go to preferred web browser and search http://[Head_Node_IP]
