<?
    require '../lib/connect.php';
    require '../lib/processing.php';
    
    
    function getTypes ()
    {
        global $connection;
        
        
        $types = $connection->query("SELECT * FROM `supply.types`");
        $type_data = [];
        
        while ($type = $types->fetch_assoc())
        {
            $nfs = json_decode($type["lc_names"]);
            
            echo "{
                \"id\":\"{$type["id"]}\",
                \"type-icon\":\"../{$type["icon"]}\",
                \"type_name\":\"{$type["name"]}\",
                \"type_nf_a\":\"{$nfs[0]},
                \"type_nf_b\":\"{$nfs[1]},
                \"type_nf_c\":\"{$nfs[2]},
            ";
            
            requireTemplate("types/types__checkbox", [ 'is_active' => $type["active"] ], "manage/templates/");
            requireTemplate("types/types__del-button", [], "manage/templates/");
            
            echo "},";
        }
    }
    
    $sizes = $connection->query("SELECT * FROM `supply.sizes`");
    $size_data = [];
    
    while ($size = $sizes->fetch_assoc())
    {
        $size_data[] = requireTemplate("types/types__size-row", [
            'arglist' => [
                'id' => $size["id"],
                'size_num' => $size["num"],
                'size_name' => $size["name"],
                'checkbox' => requireTemplate("types/types__checkbox", [ 'condlist' => [ 'is_active' => $size["active"] ], 'prefix' => "manage/templates/" ]),
                'del-button' => requireTemplate("types/types__del-button", [ 'prefix' => "manage/templates/" ]),
            ],
            'prefix' => "manage/templates/"
        ]);
    }
    
    $colors = $connection->query("SELECT * FROM `supply.colors` ORDER BY `hex`");
    $color_data = [];
    
    while ($color = $colors->fetch_assoc())
    {
        $color_data[] = requireTemplate("types/types__color-row", [
            'arglist' => [
                'id' => $color["id"],
                'color_name' => $color["name"],
                'color_hex' => $color["hex"],
                'checkbox_1' => requireTemplate("types/types__checkbox", [ 'condlist' => [ 'is_active' => $color["active"] ], 'prefix' => "manage/templates/" ]),
                'checkbox_2' => requireTemplate("types/types__checkbox", [ 'condlist' => [ 'is_active' => $color["is_light"] ], 'prefix' => "manage/templates/" ]),
                'checkbox_3' => requireTemplate("types/types__checkbox", [ 'condlist' => [ 'is_active' => $color["is_dark"] ], 'prefix' => "manage/templates/" ]),
                'del-button' => requireTemplate("types/types__del-button", [ 'prefix' => "manage/templates/" ]),
            ],
            'prefix' => "manage/templates/"
        ]);
    }
?>

{
    "types": <?=json_encode($type_data)?>,
    "sizes": <?=json_encode($size_data)?>,
    "colors": <?=json_encode($color_data)?>
}