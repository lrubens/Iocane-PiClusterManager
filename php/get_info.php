<?php
require __DIR__ . '/../vendor/autoload.php';
use phpseclib\Net\SSH2;

class metrics{
    public $host;
    public $CPU;
    public $Memory;
    public $Temperature;
    public $IP;
}

$node_metrics = array();
$node_file = file_get_contents("../node_info.json");
$node_info = json_decode($node_file, true);
// echo $node_file;
// $hosts = array('node1', 'node2', 'node3');
$count = 0;
foreach ($node_info as $key=>$val){
    $ssh = new SSH2($key);
    $node = new metrics();
    try{
        $ssh->login('pi', 'raspberry');
    }
    catch(Exception $e){
        echo "\n\n";
        $node->host = $key;
        $node->CPU = '0';
        $node->Memory = '0';
        $node->Temperature = '0';
        $node->IP = gethostbyname($key);
        $node_json = json_encode($node);
        array_push($node_metrics, $node);
        // echo $node_json;
        $count = $count + 1;
        continue;
    }
    $node->host = $key;
    $node->CPU = substr($ssh->exec("top -b -n 10 -d.2 | grep 'Cpu' |  awk 'NR==3{ print($2)}'"), 0, -1);
    $node->Memory = substr($ssh->exec("free | grep Mem | awk '{print $3/$2 * 100.0}'"), 0, -1);
    $node->Temperature = str_replace('temp=', '', substr($ssh->exec("vcgencmd measure_temp"), 0, -3));
    $node->IP = gethostbyname($key);
    $node_json = json_encode($node);
    array_push($node_metrics, $node);
    // echo $node_json;
    $count = $count + 1;
}
    $final_json = json_encode($node_metrics);
    file_put_contents("../node_data.json", $final_json);
    //echo $final_json;
?>