<?
    require '../../lib/connect.php';
    require '../../lib/processing.php';
    
    
    const ICON_DEFAULT = "img/etc/types/default.svg";
    
    
    $data = json_decode($_POST["data"], true);
    
    for ($i = 0; $i < count($data); $i++)
    {
        switch ($data[$i]["queue"])
        {
        case "type":
            switch ($data[$i]["type"])
            {
            case "to_add":
                typeAdd($data[$i]);
            break;
            case "to_update":
                typeUpd($data[$i]);
            break;
            case "to_delete":
                typeDel($data[$i]);
            break;
            default:
                echo "default";
            }
        break;
        case "size":
            switch ($data[$i]["type"])
            {
            case "to_add":
                sizeAdd($data[$i]);
            break;
            case "to_update":
                sizeUpd($data[$i]);
            break;
            case "to_delete":
                sizeDel($data[$i]);
            break;
            }
        break;
        case "color":
            switch ($data[$i]["type"])
            {
            case "to_add":
                colorAdd($data[$i]);
            break;
            case "to_update":
                colorUpd($data[$i]);
            break;
            case "to_delete":
                colorDel($data[$i]);
            break;
            }
        break;
        default:
            echo "no_type";
        }
    }
    
    
    function typeAdd ($data) {
        global $connection;
        
        
        $name = $data["name"];
        $lc_names = $data["lc_names"] ?? "[]";
        $icon = $data["icon"];
        $filename = ICON_DEFAULT;
        
        if ($icon)
        {
            $file = $_FILES[$icon];
            
            $type_id = $connection->query("SELECT MAX(`id`) + 1 AS `id` FROM `supply.types` LIMIT 1")->fetch_assoc()["id"];
            $filename = "img/etc/types/type-".str_pad($type_id, 2, 0, STR_PAD_LEFT);
            move_uploaded_file($file["tmp_name"], "../../$filename");
        }
        
        $connection->query("INSERT INTO `supply.types`(`name`, `lc_names`, `icon`) VALUES('$name', '$lc_names', '$filename')");
    }
    
    function typeUpd ($data) {
        global $connection;
        
        
        $id = $data["id"];
        $name = $data["name"];
        $lc_names = $data["lc_names"] ?? "[]";
        $active = $data["active"];
        $icon = $data["icon"];
        
        echo "UPDATE `supply.types` SET `name`='$name', `lc_names`='$lc_names', `active`=$active WHERE `id`=$id";
        
        if ($icon)
        {
            $file = $_FILES[$icon];
            
            $filename = "img/etc/types/type-".str_pad($id, 2, 0, STR_PAD_LEFT).".svg";
            $current = $connection->query("SELECT `icon` FROM `supply.types` WHERE `id`='$id' LIMIT 1")->fetch_assoc()["icon"];
            
            move_uploaded_file($file["tmp_name"], "../../$filename");
            
            $connection->query("UPDATE `supply.types` SET `icon`='$filename' WHERE `id`=$id");
        }
        
        $connection->query("UPDATE `supply.types` SET `name`='$name', `lc_names`='$lc_names', `active`=$active WHERE `id`=$id") or die($connection->error);
    }
    
    function typeDel ($data) {
        global $connection;
        
        
        $id = $data["id"];
        
        var_dump($id);
        
        $icon = $connection->query("SELECT `icon` FROM `supply.types` WHERE `id`=$id")->fetch_assoc()["icon"];
        
        if ($icon != ICON_DEFAULT)
            unlink("../../$icon");
            
        $connection->query("DELETE FROM `supply.types` WHERE `id`=$id");
    }
    
    function sizeAdd ($data) {
        global $connection;
        
        
        $num = $data["num"];
        $name = $data["name"];
        
        $connection->query("INSERT INTO `supply.sizes`(`num`, `name`, `active`) VALUES('$num', '$name', 1)");
    }
    
    function sizeUpd ($data) {
        global $connection;
        
        
        $id = $data["id"];
        $num = $data["num"];
        $name = $data["name"];
        $active = $data["active"];
        
        $connection->query("UPDATE `supply.sizes` SET `num`='$num', `name`='$name', `active`=$active WHERE `id`=$id");
    }
    
    function sizeDel ($data) {
        global $connection;
        
        
        $id = $data[$i];
        $connection->query("DELETE FROM `supply.sizes` WHERE `id`=$id");
    }
    
    
    function colorAdd ($data) {
        global $connection;
        
        
        $name = $data["name"];
        $hex = $data["hex"];
        
        $connection->query("INSERT INTO `supply.colors`(`name`, `hex`, `active`, `is_dark`, `is_light`) VALUES('$num', '$name', 1, 0, 0)");
    }
    
    function colorUpd ($data) {
        global $connection;
        
        
        $id = $data["id"];
        $name = $data["name"];
        $hex = $data["hex"];
        $active = $data["active"];
        $bright = $data["bright"];
        $dark = $data["dark"];
        
        $connection->query("UPDATE `supply.colors` SET `name`='$name', `hex`='$hex', `active`=$active, `is_light`=$bright, `is_dark`=$dark WHERE `id`=$id");
    }
    
    function colorDel ($data) {
        global $connection;
        
        
        $id = $data["id"];
        $connection->query("DELETE FROM `supply.colors` WHERE `id`=$id");
    }
    
?>