<?php
   $id = $_GET['id'];
   $host = 'localhost';
   $user = 'slurm';
   $pass = 'iocane';
   $database = 'slurm_comp';
   $running = "<div class='badge badge-pill badge-warning badge-fw'>Running</div>";
   $cancelled = "<div class='badge badge-pill badge-danger badge-fw'>Cancelled</div>";
   $completed = "<div class='badge badge-pill badge-success badge-fw'>Completed</div>";
   $no_results = '<tr><td colspan="4"><i class="fa fa-warning"></i> No results found</td></tr>';
   $conn = new mysqli($host, $user, $pass, $database);
   if(! $conn ) {
      die($no_results);
   }
   $result = $conn->query("SELECT * FROM jobcomp_table where jobid like '%" . $id . "%'");
   if(! $result ) {
     die('Could not get data');
   }
   $num_jobs = $result->num_rows;
   while($row = mysqli_fetch_array($result)) {
      echo "<tr>";
      echo "<td>" . $row['jobid'] . "</td>";
      echo "<td>" . $row['name'] . "</td>";
      if ($row['nodelist'] === NULL)
        echo "<td>N/A</td>";
      else
        echo "<td>" . $row['nodelist'] . "</td>";
      if ($row['state'] === '3'){
        echo "<td>" . $completed . "</td>";
      }
      else {
        echo "<td>" . $cancelled . "</td>";
      }
      echo "<td>" . $row['partition'] . "</td>";
      echo "</tr>";
   }
   mysqli_close($conn);
?>