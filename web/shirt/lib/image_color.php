<?
    const BORDER_DEPTH = 12;
    
    function getTopBorderColor ($image)
    {
        $r_pixels = $image->exportImagePixels(0, 0, $image->getImageWidth(), BORDER_DEPTH, "RGB", imagick::PIXEL_CHAR);
        $pixels = [];
        $mode_key = "";
        $mode_count = 0;
        
        for ($i = 0; $i < count($r_pixels); $i += 3)
        {
            $key = base_convert($r_pixels[$i], 10, 16).base_convert($r_pixels[$i + 1], 10, 16).base_convert($r_pixels[$i + 2], 10, 16);
            $pixels[$key]++; // dirty, dirty code
            
            if ($pixels[$key] > $mode_count)
            {
                $mode_key = $key;
                $mode_count = $pixels[$key];
            }
        }
        
        return "#$mode_key";
    }
?>