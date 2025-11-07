<?php
header('Content-Type: application/json');

// Allow both www and non-www versions
$allowed_origins = ['https://skilltude.com', 'https://www.skilltude.com'];
$origin = $_SERVER['HTTP_ORIGIN'] ?? '';
if (in_array($origin, $allowed_origins)) {
    header('Access-Control-Allow-Origin: ' . $origin);
}

header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

// Handle preflight OPTIONS request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

// Only allow POST requests
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'error' => 'Method not allowed']);
    exit;
}

// Get JSON input
$input = json_decode(file_get_contents('php://input'), true);

// Validate required fields
$required = ['title', 'slug', 'content', 'excerpt', 'category'];
foreach ($required as $field) {
    if (empty($input[$field])) {
        http_response_code(400);
        echo json_encode(['success' => false, 'error' => "Missing required field: $field"]);
        exit;
    }
}

// Database connection
$host = 'localhost';
$dbname = 'u931066387_skilltude';
$username = 'u931066387_management';
$password = 'Skilly@skilltude1';

try {
    $pdo = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8", $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    
    // Check if slug already exists
    $checkStmt = $pdo->prepare("SELECT id FROM blog_articles WHERE slug = ?");
    $checkStmt->execute([$input['slug']]);
    if ($checkStmt->fetch()) {
        http_response_code(409);
        echo json_encode(['success' => false, 'error' => 'Article with this slug already exists']);
        exit;
    }
    
    // Prepare data
    $title = $input['title'];
    $slug = $input['slug'];
    $content = $input['content'];
    $excerpt = $input['excerpt'];
    $category = $input['category'];
    $featuredImage = $input['featured_image_url'] ?? null;
    $tags = isset($input['tags']) ? json_encode($input['tags']) : '[]';
    $publishedAt = !empty($input['published_at']) ? $input['published_at'] : date('Y-m-d H:i:s');
    
    // Insert article
    $sql = "INSERT INTO blog_articles 
            (title, slug, content, excerpt, category, featured_image_url, tags, published_at, created_at, updated_at, views) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW(), 0)";
    
    $stmt = $pdo->prepare($sql);
    $stmt->execute([
        $title,
        $slug,
        $content,
        $excerpt,
        $category,
        $featuredImage,
        $tags,
        $publishedAt
    ]);
    
    $articleId = $pdo->lastInsertId();
    
    echo json_encode([
        'success' => true,
        'message' => 'Article created successfully',
        'article_id' => $articleId,
        'slug' => $slug
    ]);
    
} catch(PDOException $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'error' => 'Database error: ' . $e->getMessage()
    ]);
}
?>
