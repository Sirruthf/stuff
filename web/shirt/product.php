<?
    require 'lib/connect.php';
    require 'lib/processing.php';
    
    $product_id = $_SERVER['QUERY_STRING'];
    
    $product = $connection->query("SELECT * FROM `merch` WHERE `tid`=$product_id") or die($connection->error); 
    $product = $product->fetch_assoc(); 
    
    $product_cat = $connection->query("SELECT * FROM `merch.categories` WHERE `cat_id`='".$product["cat_id"]."' LIMIT 1")->fetch_assoc();
    $parent_id = intdiv($product_cat["cat_id"], 100) * 100;
    $parent_cat = $connection->query("SELECT * FROM `merch.categories` WHERE `cat_id`='$parent_id' LIMIT 1")->fetch_assoc();
    
    $qnt_table = $connection->query("SELECT * FROM `supply`")->fetch_all(MYSQLI_ASSOC);
    $qnt_table = json_encode($qnt_table);
    
    $cart_contents = $connection->query("SELECT * FROM `orders.tmp` WHERE `uid`='".$_COOKIE["cckey"]."'")->fetch_assoc()["data"] ?? "{}";
    
    $arr_images = json_decode($product["pic"]);
    // $arr_colors = getImage($product_id, $arr_images);
    
    requireTemplate("product", [
        "product_id" => $product_id,
        "qnt_table" => $qnt_table,
        "img-list" => $arr_images,
        "img-prevs" => $arr_images,
        "price" => $product["price"],
        "name" => $product["name"],
        "desc" => $product["shirt_desc"],
        "url" => $parent_cat["url"],
        "cart_data" => $cart_contents,
    ]);
?>
    
<?  
    function printImages ($arr_images, $tid) {
        for ($i = 0; $i < count($arr_images); $i++)
            echo "<img class=\"full-image_cont__img\" src=\"/projects/shirt/img/product/$tid/{$arr_images[$i]}\">";
    }

    function printImagePreview ($arr_images, $tid) {
        echo '<div class="prev-image_cont__img prev-image_cont__img_selected" data-order="0">'.
            '<img class="image" src="/projects/shirt/img/product/'."$tid/$arr_images[0]".'">'.
            '</div>';
        
        for ($i = 1; $i < count($arr_images); $i++) {
            echo '<div class="prev-image_cont__img" data-order="'.$i.'">'.
                '<img class="image" src="/projects/shirt/img/product/'."$tid/$arr_images[$i]".'">'.
                '</div>';
        }
    }
    
    function getImageColors($product_id, $arr_images) {
        require_once 'lib/image_color.php';
        
        $arr_colors = [];
        
        for ($i = 0; $i < count($arr_images); $i++)
            $arr_colors[] = getTopBorderColor(new Imagick("img/product/$product_id/{$arr_images[$i]}"));
        
        return $arr_colors;
    }

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

<?
    if ($product["ol_price"])
        echo "<div class=\"ol_price\">{$product["ol_price"]} Р</div>";
?>
