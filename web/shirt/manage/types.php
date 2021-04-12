<?
    require '../lib/connect.php';
    require '../lib/processing.php';
    
    
    requireTemplate("types", [], "manage/templates/");
?>

<?
    function printColors () {
        global $connection;
        
        
        $colors = $connection->query("SELECT * FROM `supply.colors`");
        
        while ($color = $colors->fetch_assoc())
        {
            requireTemplate("types/color-row", [
                    'id' => $color["id"],
                    'color_hex' => $color["hex"],
                    'color_name' => $color["name"],
                    'active' => $color["active"],
                    'is_dark' => $color["is_dark"],
                    'is_light' => $color["is_light"]
                ],
                "manage/templates/"
            ); 
        }
    }
    
    function printSizes () {
        global $connection;
        
        
        $sizes = $connection->query("SELECT * FROM `supply.sizes`");
        
        while ($size = $sizes->fetch_assoc()) {
            requireTemplate("types/size-row", [
                    'id' => $size["id"],
                    'size_num' => $size["num"],
                    'size_name' => $size["name"],
                    'active' => $size["active"]
                ],
                "manage/templates/"
            );
        }
    }
    
    function printTypes () {
        global $connection;
        
        
        $types = $connection->query("SELECT * FROM `supply.types`");
        
        while ($type = $types->fetch_assoc())
        {
            $loc_names = json_decode($type["lc_names"]);
            
            requireTemplate("types/type-row", [
                    'id' => $type["id"],
                    'type_icon' => "../".$type["icon"],
                    'type_name' => $type["name"],
                    'type_nf_a' => $loc_names[0] ?? "",
                    'type_nf_b' => $loc_names[1] ?? "",
                    'type_nf_c' => $loc_names[2] ?? "",
                    'active' => $type["active"]
                ],
                "manage/templates/"
            );
        }
    }
?>