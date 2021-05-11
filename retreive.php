<?php
    $latitude=$_GET['lat'];
    $longitude=$_GET['long'];

    $servername = "freedb.tech:3306";
        $username = "freedbtech_ben";
        $password = "123";
        $dbname = "freedbtech_shoplocation";
            
        $conn = new mysqli($servername, $username, $password, $dbname);
        if ($conn->connect_error) {
            die("Connection failed: ". $conn->connect_error);
        }

        $sql = "SELECT address2,latitude,longitude FROM location";

        $result = $conn->query($sql);
        $a=array();

        if ($result->num_rows > 0) {
            while($row = $result->fetch_assoc()) {
                $data = new stdClass();
                $data->name=$row['address2'];
                $data->latitude=$row["latitude"];
                $data->longitude=$row["longitude"];
                array_push($a,$data);
            }
          } else {
            echo "0 results";
          }
          $conn->close();
        echo json_encode($a);
    
?>