<?
    require 'lib/processing.php';
    require 'lib/connect.php';
    
    $product_id = $_SERVER['QUERY_STRING'];
    $uid = $_COOKIE['cckey'];
    $cart = $connection->query("SELECT `data` FROM `orders.tmp` WHERE `uid`='$uid'")->fetch_assoc();
    
    $qnt_table = $connection->query("SELECT * FROM `supply`")->fetch_all(MYSQLI_ASSOC);
    $qnt_table = json_encode($qnt_table);
    
    requireTemplate("construct", [
        "tid" => $product_id,
        "cart_data" => json_encode($cart) ?? [],
        "qnt_table" => $qnt_table,
    ]);
?>

<?
    function printTypeButtons ($tid) {
        global $connection;
        
        
        $types = $connection->query("
            SELECT *, (CASE
                WHEN `id` IN (SELECT `type` FROM (SELECT `type`, SUM(`quantity`) as `type_qnt`
                    FROM `supply` GROUP BY `type`) supply_grouped WHERE `type_qnt`>0)
                THEN 1
                ELSE 0
            END) AS `available` FROM `supply.types`
        ") or die($connection->error);
        
        $i = 0; while ($type = $types->fetch_assoc())
        {
            if ($type["available"])
                requireTemplate("product/type-button", [
                    "type_id" => $type["id"],
                    "type-icon" => $type["icon"],
                    "name" => $type["name"],
                    "is_active" => $i++ == 0
                ]);
        }
        
        print "<label class=\"type-list__item\"><div class=\"type-list__button type-list__button_disabled\"></div></label>";
    }
    
    function printSizeButtons ($tid) {
        global $connection;
        
        
        $sizes = $connection->query("
            SELECT *, (CASE
                    WHEN `id` IN (SELECT `size` FROM (SELECT `size`, SUM(`quantity`) as `size_qnt` FROM `supply` 
                            GROUP BY `size`) supply_grouped WHERE `size_qnt`>0)
                    THEN  1
                    ELSE  0
                END) AS `available`
            FROM `supply.sizes`
        ") or die($connection->error);
        
        $i = 0;
        while ($size = $sizes->fetch_assoc())
        {
            if ($size["available"])
                requireTemplate("product/size-button", [
                        "size_id" => $size["id"],
                        "size_num" => $size["num"],
                        "size_name" => $size["name"],
                        "is_active" => $i++ == 0,
                    ]
                );
            else
                print "<label class=\"size-list__item\"><div class=\"size-list__button size-list__button_disabled\">".$size["name"]."</div></label>";
        }
    }
    
    function printColorButtons ($tid) {
        global $connection;
        
        
        $colors = $connection->query("
            SELECT *, (CASE
                WHEN
                    `id` IN (SELECT `color` FROM (SELECT `color`, SUM(`quantity`) AS `color_qnt` FROM `supply` GROUP BY `color`) AS `supply_grouped` WHERE `color_qnt`>0)
                THEN 1
                ELSE 0
            END) AS `available`
            FROM `supply.colors`
        ") or die($connection->error);
        
        $i = 0;
        while ($color = $colors->fetch_assoc())
        {
            if ($color["available"])
                requireTemplate("product/color-button", [
                        "color_id" => $color["id"],
                        "color" => $color["hex"],
                        "is_active" => $i++ == 0,
                        "too_dark" => $color["is_dark"],
                        "too_bright" => $color["is_light"]
                ]);
        }
    }
?>