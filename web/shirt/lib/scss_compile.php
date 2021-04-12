<?
    header("Content-Type: text/css;");
    
    require 'scss.inc.php';
    
    $scss = new ScssPhp\ScssPhp\Compiler;
    $scss->setFormatter("ScssPhp\ScssPhp\Formatter\Expanded");
    echo $scss->compile(file_get_contents('../'.$_GET['source']));
?>