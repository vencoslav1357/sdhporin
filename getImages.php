<?php
header('Content-Type: application/json');

// Zabezpečení proti přístupu mimo složku images
function isPathSafe($folder) {
    $realPath = realpath("images/" . $folder);
    $imagesPath = realpath("images");
    return $realPath && strpos($realPath, $imagesPath) === 0;
}

function getImagesFromFolder($folder) {
    // Podporované formáty obrázků
    $formats = [
        "*.jpg",
        "*.jpeg",
        "*.png",
        "*.gif"
    ];
    
    $images = [];
    foreach ($formats as $format) {
        $images = array_merge($images, glob("images/" . $folder . "/" . $format, GLOB_BRACE));
    }
    
    // Vrátit pouze názvy souborů bez cesty
    return array_map(function($image) {
        return basename($image);
    }, $images);
}

// Získání složky z URL parametru
$folder = $_GET['folder'] ?? '';

// Kontrola a zpracování
if ($folder && isPathSafe($folder)) {
    $images = getImagesFromFolder($folder);
    echo json_encode(['success' => true, 'images' => $images]);
} else {
    echo json_encode(['success' => false, 'error' => 'Invalid folder path']);
}
?>