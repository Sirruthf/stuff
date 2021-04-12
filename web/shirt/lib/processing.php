<?
    function formatPrice ($str_price)
    {
        if (strlen($str_price) > 3)
            return substr($str_price, 0, -3)."&nbsp;".substr($str_price, -3);
        
        return $str_price;
    }
    
    function getNumLC ($num) {
        if ($num % 100 > 10 && $num % 100 < 21)
            return 2;
        
        if ($num % 10 == 1)
            return 0;
        if ($num % 10 > 0)
            return 1;
        
        return 2;
    }
    
    function getMerchData ($cat_id, $is_master)
    {
        global $connection;
        
        
        $lbound = intdiv($cat_id, 100) * 100;
        $rbound = $lbound + 100;
        
        if ($cat_id == 0)
            $cards = $connection->query("SELECT * FROM `merch` WHERE TRUE");
        else if ($is_master)
            $cards = $connection->query("SELECT * FROM `merch` WHERE `cat_id` >= $lbound AND `cat_id` < $rbound");
        else
            $cards = $connection->query("SELECT * FROM `merch` WHERE `cat_id`=$cat_id");
        
        $rows = [];
        
        while ($card = $cards->fetch_assoc())
            $rows[] = [
                "id" => $card["tid"],
                "url_prefix" => "projects/shirt/",
                "price" => $card["price"],
                "ol_price" => $card["ol_price"],
                "discount" => $card["discount"],
                "has_discount" => $card["discount"],
                "src" => $card["preview"]
            ];
        
        
        return [$rows, count($rows)];
    }
    
    function requireTemplate ($target, $_param_ = [], $rewrite_base = "templates/") {
        include __DIR__."/../$rewrite_base$target.phtml";
    }
    
    function rkAssert ($ref, $arr) {
        foreach ($ref as $item) {
            if (!(isset($arr[$item]) || function_exists($arr[$item])))
                throw new Error("Required variable missing: $item\n\n");
        }
    }
?>

