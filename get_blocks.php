<?php
include 'config.php';
$pid = $_GET['pid'];
$res = $conn->query("SELECT * FROM blocks WHERE program_id=$pid");
echo json_encode($res->fetch_all(MYSQLI_ASSOC));
?>
