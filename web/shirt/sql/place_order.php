<?
    require '../lib/connect.php';
    require '../lib/processing.php';
    
    
    $products = $_POST["product"];
    $name = $_POST["name"];
    $phone = $_POST["phone"];
    $email = $_POST["email"];
    
    $prev_max = $connection->query("SELECT MAX(`order_id`) FROM `orders`")->fetch_array()[0];
    $prev_max++;
    
    foreach ($products as $product)
    {
        $connection->query("INSERT INTO `orders`(`tid`, `cid`, `quantity`, `name`, `phone`, `email`, `date`, `order_id`) VALUES(
            '{$product["tid"]}', '{$product["cid"]}', {$product["quantity"]}, '$name', '$phone', '$email', CURRENT_TIMESTAMP, $prev_max
        )") or die($connection->error);
    }
?>