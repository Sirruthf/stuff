<? require 'lib/connect.php' ?>
<? require 'lib/processing.php' ?>
<?
    const CUSTOM_PRICE = 1300; // TODO
    const SCALE_COEFF = 2.3; // constructor size / card size
    const COMMON_TITLE = "с рисунком";
    const CUSTOM_TITLE = "с вашим дизайном";
    
    
    $uid = $_COOKIE['cckey'];
    
    $cards_raw = $connection->query("SELECT `data` FROM `orders.tmp` WHERE `uid`='$uid'")->fetch_assoc();
    $card_data = json_decode($cards_raw["data"] ?? "", true);
    
    [$total_price, $short_list] = calcShortList($card_data);
    
    requireTemplate("cart", [
        "card_list" => $cards_unfold ?? [],
        "lc_names" => json_encode(getLCNames()),
        "total_price" => formatPrice($total_price),
        "short_list" => $short_list,
        "cart_source" => $cards_raw ?? [ "data" => "" ],
        "not_empty" => $card_data["cart"] || $card_data["cart_custom"],
    ]);
?>

<?
    function calcShortList ($data_both)
    {
        global $connection;
        
        $PS = COMMON_TITLE;
        $typed = [];
        $result = "";
        $price = 0;
        $data = $data_both["cart"] ?? [];
        
        for ($i = 0; $i < count($data); $i++) {
            $item_info = $connection->query("SELECT * FROM `merch` WHERE `tid`='{$data[$i]["tid"]}'")->fetch_assoc();
            $type_info = $connection->query("
                SELECT * FROM `supply` LEFT JOIN `supply.types` ON `supply.types`.`id`=`type` AND `supply`.`id`='{$data[$i]["cid"]}'
            ")->fetch_assoc();
            
            $price += $item_info["price"] * $data[$i]["quantity"];
            
            $iit = $type_info["type"];
            
            $lc_names = json_decode($type_info["lc_names"]);
            $quantity = $data[$i]["quantity"];
            
            if ($typed[$iit]) $quantity += $typed[$iit][1];
            
            $loc_name = $lc_names[getNumLC($quantity)];
            var_dump($loc_name);
            
            $typed[$iit] = [$loc_name, $data[$i]["quantity"]];
        }
        
        foreach ($typed as $name) {
            [$name, $qnt] = [$name[0], $name[1]];
            $result .= "$qnt $name $PS\n";
        }
        
        $PS = CUSTOM_TITLE;
        $typed_custom = [];
        $data = $data_both["cart_custom"] ?? [];
        
        for ($i = 0; $i < count($data); $i++) {
            $type_info = $connection->query("
                SELECT `lc_names` FROM `supply.types` WHERE `id`='{$data[$i]["type"]}'
            ")->fetch_assoc();
            
            $price += CUSTOM_PRICE * $data[$i]["quantity"];
            
            $iit = $data[$i]["type"];
            
            $lc_names = json_decode($type_info["lc_names"]);
            $quantity = $data[$i]["quantity"];
            
            if ($typed_custom[$iit]) $quantity += $typed_custom[$iit][1];
            
            $loc_name = $lc_names[getNumLC($quantity)];
            
            $typed_custom[$iit] = [$loc_name, $data[$i]["quantity"]];
        }
        
        foreach ($typed_custom as $name) {
            [$name, $qnt] = [$name[0], $name[1]];
            $result .= "$qnt $name $PS\n";
        }
        
        return [$price, $result ?? "—"];
    }
    
    function printCards ($data)
    {
        global $connection;
        
        
        $uid = $_COOKIE["cckey"];
        
        $order_info = $connection->query("SELECT * FROM `orders.tmp` WHERE `uid`='$uid'")->fetch_assoc();
        $order_info = json_decode($order_info["data"] ?? "{\"cart\":[],\"cart_custom\":[]}", true);
        $is_empty = true;
        
        for ($i = 0; $i < count($order_info["cart"]); $i++) {
            $is_empty = false;
            printCommonCard($order_info["cart"][$i]);
        }
        
        for ($i = 0; $i < count($order_info["cart_custom"]); $i++) {
            $is_empty = false;
            printCustomCard($order_info["cart_custom"][$i]);
        }
         
        if ($is_empty)
            print "Пусто :(<br><br>Зайдите в наш <a class=\"link\" href=\"/projects/shirt/catalogue/all\">каталог</a> и выберите себе что-нибудь!";
    }
    
    function printCommonCard ($info)
    {
        global $connection;
        
        
        $merch_info = $connection->query("SELECT * FROM `merch` WHERE `tid`='{$info["tid"]}'")->fetch_assoc();
        
        $supply_info = $connection->query("
            SELECT 
                `quantity`, `tid`, `supply.colors`.`name` as `color_name`, `supply.sizes`.`num` as `size_name`, 
                `supply.types`.`name` as `type_name`, `supply.types`.`id` as `type_id`, `lc_names`
            FROM `supply`
            LEFT JOIN `supply.types` ON `supply.types`.`id`=`supply`.`type`
            LEFT JOIN `supply.colors` ON `supply.colors`.`id`=`supply`.`color`
            LEFT JOIN `supply.sizes` ON `supply.sizes`.`id`=`supply`.`size`
            WHERE `supply`.`id`='{$info["cid"]}'"
        )->fetch_assoc();
        

        requireTemplate("cart/item", [
            'tid' => $info["tid"],
            'cid' => $info["cid"],
            'type_id' => $supply_info["type_id"],
            'price' => $merch_info["price"],
            'product_title' => $supply_info["type_name"]." ".$merch_info["name"],
            'product_img' => $merch_info["preview"],
            'product_price' => formatPrice($merch_info["price"]),
            'product_desc' => $merch_info["shirt_desc"],
            'product_color' => $supply_info["color_name"],
            'product_size' => $supply_info["size_name"],
            'product_quantity' => $info["quantity"],
        ]);
    }
    
    function printCustomCard ($info)
    {
        global $connection;
        
        
        $merch_info = $connection->query("SELECT * FROM `merch` WHERE `tid`='{$info["tid"]}'")->fetch_assoc();
        $supply_info = $connection->query("
            SELECT 
                `quantity`, `tid`, `supply.colors`.`name` as `color_name`, `supply.colors`.`id` as `color_id`, `supply.sizes`.`num` as `size_name`, 
                `supply.sizes`.`id` as `size_id`, `supply.types`.`name` as `type_name`, `supply.types`.`id` as `type_id`
            FROM `supply`
            LEFT JOIN `supply.types` ON `supply.types`.`id`='{$info["type"]}'
            LEFT JOIN `supply.colors` ON `supply.colors`.`id`='{$info["color"]}'
            LEFT JOIN `supply.sizes` ON `supply.sizes`.`id`='{$info["size"]}'
        ")->fetch_assoc();
        
        requireTemplate("cart/custom", [
            'type_id' => $supply_info["type_id"],
            'size_id' => $supply_info["size_id"],
            'color_id' => $supply_info["color_id"],
            'product_title' => $supply_info["type_name"]." ".CUSTOM_TITLE,
            'product_img' => $info["id"],
            'img_left' => $info["left"],
            'img_top' => $info["top"],
            'img_width' => $info["width"],
            'img_height' => $info["height"],
            'product_price' => formatPrice(CUSTOM_PRICE)."&nbsp;₽",
            'product_color' => $supply_info["color_name"],
            'product_size' => $supply_info["size_name"],
            'product_quantity' => $info["quantity"],
            'price' => CUSTOM_PRICE
        ]);
}
    
    function getLCNames () {
        global $connection;
        
        
        $lc_names = $connection->query("SELECT `id`, `lc_names` FROM `supply.types`");
        $result = [];
        
        while ($lc_item = $lc_names->fetch_assoc()) {
            $result[$lc_item["id"]] = json_decode($lc_item["lc_names"]);
        }
        
        return $result;
    }
?>

