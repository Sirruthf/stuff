<?
    $files = scandir("../img/upload/client");
    $name = str_pad(count($files) - 2, 4, 0, STR_PAD_LEFT);
    
    move_uploaded_file($_FILES["image"]["tmp_name"], "../img/upload/client/$name.png");
    
    echo "$name.png";
?>