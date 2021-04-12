<?
    require 'lib/connect.php';
    require 'lib/processing.php';
    require 'lib/connect.php';
    
    $current_url = $_SERVER['QUERY_STRING'];
    
    $category = $connection->query("SELECT * FROM `merch.categories` WHERE `url`='$current_url' LIMIT 1") or die($connection->error);
    $category = $category->fetch_assoc();
    
    $parent_id = intdiv($category["cat_id"], 100) * 100;
    $parent_cat = $connection->query("SELECT * FROM `merch.categories` WHERE `cat_id`='$parent_id' LIMIT 1")->fetch_assoc();
    
    
    [$card_data, $counter] = getMerchData($category["cat_id"], $category["is_master"]);
    

    requireTemplate("catalogue", [
        "category_id" => $category["cat_id"],
        "category_name" => $category["loc_name"],
        "parent_name" => $parent_cat["cat_id"],
        "parent_url" => $parent_cat["url"],
        "is_master" => $parent_cat["is_master"],
        "counter" => "$counter ".getCountLoc($counter),
        "card_data" => $card_data,
        "url" => $category["url"],
    ]);
?>

<?
    function printCards ($card_data)
    {
        global $connection;
        
        for ($i = 0; $i < count($card_data); $i++)
            requireTemplate("card", $card_data[$i]);
        
        return $result;
    }

    function printMenuRows ($lbound) {
        global $connection;
        global $current_url;
        
        $rbound = $lbound + 100;
        
        $cats = $connection->query("SELECT * FROM `merch.categories` WHERE `id`>0 AND `is_master`=0 AND `cat_id`>'$lbound' AND `cat_id`<'$rbound'") or die($connection->error);
        
        while ($cat = $cats->fetch_assoc()) {
            requireTemplate("catalogue/menu_row", [
                "url" => $cat["url"],
                "selected" => $cat["url"] == $current_url,
                "is_title" => $cat["is_master"],
                "loc_name" => $cat["loc_name"],
            ]);
        }
    }
    
    function printMenu () {
        global $connection;
        global $current_url;
        
        
        $cats = $connection->query("SELECT * FROM `merch.categories` WHERE `id`>0 AND `is_master`=1") or die($connection->error);
        
        while ($cat = $cats->fetch_assoc()) {
            requireTemplate ("catalogue/menu_group", [
                "lbound" => $cat["cat_id"],
                "selected" => $cat["url"] == $current_url,
                "title" => $cat["loc_name"],
                "url" => $cat["url"],
            ]);
        }
    }
    
    function getCountLoc ($cards_n)
    {
        switch (getNumLC($cards_n))
        {
        case 0:
            $noun_loc = "футболка"; break;
        case 1:
            $noun_loc = "футболки"; break;
        case 2:
            $noun_loc = "футболок"; break;
        }
        
        return $noun_loc;
    }
?>