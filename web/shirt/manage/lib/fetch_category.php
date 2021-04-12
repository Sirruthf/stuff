<?
    require_once __DIR__."/../../lib/connect.php";
    require_once __DIR__."/../../lib/processing.php";
    
    
    const TEMPLATE_PREFIX = "manage/templates/";

    function fetchCategoryData ($url)
    {
        global $connection;
        
        $category = $connection->query("SELECT * FROM `merch.categories` WHERE `url`='$url' LIMIT 1")->fetch_assoc();
        
        $parent_id = intdiv($category["cat_id"], 100) * 100;
        $parent_cat = $connection->query("SELECT * FROM `merch.categories` WHERE `cat_id`='$parent_id' LIMIT 1")->fetch_assoc();
        
        $lcap = $category["cat_id"]; $rcap = $lcap + 100;
        $clause = $category["name"] == "all" ? "1" : ($category["is_master"] ? "`cat_id` > '$lcap' AND `cat_id` < '$rcap'" : "`cat_id`='$lcap'");
        $cards = $connection->query("SELECT * FROM `merch` WHERE $clause ORDER BY `date_updated` DESC, `tid` DESC") or die($connection->error);
        
        $cards_n = $cards->num_rows;
        $cards_lc = getNumLC($cards_n);
        
        switch ($cards_lc)
        {
        case 0:
            $noun_loc = "футболка"; break;
        case 1:
            $noun_loc = "футболки"; break;
        case 2:
            $noun_loc = "футболок"; break;
        }
        
        $result = [];
        
        while ($card = $cards->fetch_assoc())
        {
            $a_pics = json_decode($card["pic"]);
            $s_pics = "";
            
            if ($a_pics)
                for ($j = 0; $j < count($a_pics); $j++)
                    $s_pics .= requireTemplate("catalogue/catalogue__row-image", [
                        'tid' => $card["tid"], 'name' => $a_pics[$j], 
                        'is_preview' => $a_pics[$j] == $card["preview"]
                    ],
                    TEMPLATE_PREFIX
            );
            
            $result[] = [
                'id' => $card["tid"],
                'cat_id' => $card["cat_id"],
                'shirt_name' => $card["name"],
                'shirt_price' => $card["price"],
                'shirt_discount' => $card["discount"],
                'shirt_comment' => $card["shirt_desc"],
                'preview' => $card["preview"],
                'foto-list' => $s_pics,
            ];
        }
        
        return [$category["loc_name"], (bool)$category["is_master"], $parent_cat["loc_name"], $parent_cat["url"], $result, $cards->num_rows." ".$noun_loc];
    }
    
    if (isset($_GET["url"]))
    {
        $cat_data = fetchCategoryData($_GET["url"]);
        $cat_data[4] = array_map(function ($data) { global $template_prefix; return requireTemplate("catalogue/catalogue__row", ['arglist' => $data["arglist"], 'prefix' => TEMPLATE_PREFIX]); }, $cat_data[4]);
        echo json_encode($cat_data);
    }
?>