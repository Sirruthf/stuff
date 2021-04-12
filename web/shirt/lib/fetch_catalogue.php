<?
    require 'connect.php';
    require 'processing.php';
    
    
    $url = $_SERVER["QUERY_STRING"];
    $cid = $connection->query("SELECT * FROM `merch.categories` WHERE `url`='$url' LIMIT 1")->fetch_assoc();
    
    [$merch, $number] = getMerchData($cid["cat_id"], $cid["is_master"]);
?>    

<div class="rows">
<?
    for ($i = 0; $i < $number; $i++) {
        requireTemplate("card", $merch[$i]);
    }
?>
</div>
<input class="counter-input" value="<?=$number?>">
<input class="title-input" value="<?=$cid["loc_name"]?>">