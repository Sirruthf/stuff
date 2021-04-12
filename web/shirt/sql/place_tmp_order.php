<?
    require '../lib/connect.php';
    
    $uid = $_POST['cckey'];
    $data = $_POST['data'];
    
    $connection->query("
        INSERT INTO `orders.tmp` SET `uid`='$uid', `data`='$data', `timestamp`=CURRENT_TIMESTAMP ON DUPLICATE KEY UPDATE `uid`='$uid', `data`='$data'
    ");
?>