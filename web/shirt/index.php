<?
    require 'lib/connect.php';
    require 'lib/processing.php';
    

    $cart = $connection->query("SELECT `data` FROM `orders.tmp` WHERE `uid`='{$_COOKIE["cckey"]}'") or die($connection->error);
    $cart = json_decode($cart->fetch_assoc()["data"]);
    $cart_count = $cart ? count($cart->cart) + count($cart->cart_custom) : 0;
    
    
    requireTemplate("index", [
        'cart_count' => $cart_count,
    ]);
?>


<?
    function fetchShowcase () {
        global $connection;
        
        $cards = $connection->query("SELECT * FROM `merch` LIMIT 8");
        
        while ($card = $cards->fetch_assoc()) {
            requireTemplate("card", [
                'url_prefix' => "projects/shirt/",
                'src' => $card["preview"],
                'id' => $card["tid"],
                'price' => $card["price"],
                'ol_price' => $card["ol_price"],
                'discount' => $card["discount"],
                'has_discount' => $card["discount"] != 0
            ]);
        }
    }
?>