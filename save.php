<?php
session_start();
include 'config.php';
if(!isset($_SESSION['admin']))exit;

// Create Program
if(isset($_POST['create_program'])){
    $name = $_POST['new_program'];
    $uid = $_SESSION['admin']['id'];
    $conn->query("INSERT INTO programs (name,owner,bg_color) VALUES ('$name',$uid,'#ffffff')");
    header("Location:admin.php");
}

// Add Block
if(isset($_GET['add_block'])){
    $pid = $_GET['pid'];
    $conn->query("INSERT INTO blocks (program_id,title,bg,text_color,border,x,y,w,h)
    VALUES ($pid,'New Block','#ffffff','#333333','#dddddd',20,20,60,20)");
}

// Update Block
if(isset($_GET['update_block'])){
    $id = $_GET['update_block'];
    $t = $_GET['title'];
    $c = $_GET['content'];
    $bg = $_GET['bg'];
    $txt = $_GET['text'];
    $bor = $_GET['border'];
    $conn->query("UPDATE blocks SET title='$t',content='$c',bg='$bg',text_color='$txt',border='$bor' WHERE id=$id");
}

// Delete Block
if(isset($_GET['delete_block'])){
    $id = $_GET['delete_block'];
    $conn->query("DELETE FROM blocks WHERE id=$id");
}

// Save Layout
if(isset($_GET['save_layout'])){
    $data = json_decode($_GET['data'],true);
    foreach($data as $b){
        $id=$b['id'];$x=$b['x'];$y=$b['y'];$w=$b['w'];$h=$b['h'];
        $conn->query("UPDATE blocks SET x=$x,y=$y,w=$w,h=$h WHERE id=$id");
    }
}

// Save Master Config
if(isset($_POST['save_master'])){
    $title=$_POST['title'];$sub=$_POST['subtitle'];$hbg=$_POST['header_bg'];$hcol=$_POST['header_color'];
    $conn->query("UPDATE config SET title='$title',subtitle='$sub',header_bg='$hbg',header_color='$hcol' WHERE id=1");
    header("Location:admin.php");
}
?>
