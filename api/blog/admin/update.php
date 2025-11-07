<?php
header('Content-Type: application/json');

// Allow both www and non-www versions
$allowed_origins = ['https://skilltude.com', 'https://www.skilltude.com'];
$origin = $_SERVER['HTTP_ORIGIN'] ?? '';
if (in_array($origin, $allowed_origins)) {
    header('Access-Control-Allow-Origin: ' . $origin);
}

header('Access-Control-Allow-Methods: PUT, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

// Handle preflight OPTIONS request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

// Only allow PUT requests
if ($_SERVER['REQUEST_METHOD'] !== 'PUT') {
    http_response_code(405);
    echo json_encode(['success' => false, 'error' => 'Method not allowed']);
    exit;
}

// Get JSON input
$input = json_decode(file_get_contents('php://input'), true);

// Validate required fields
if (empty($input['slug'])) {
    http_response_code(400);
    echo json_encode(['success' => false, 'error' => 'Slug is required']);
    exit;
}

// Database connection
$host = 'localhost';
$dbname = 'u931066387_skilltude';
$username = 'u931066387_management';
$password = 'Skilly@skilltude1';

try {
    $pdo = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8", $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    
    // Check if article exists
    $checkStmt = $pdo->prepare("SELECT id FROM blog_articles WHERE slug = ?");
    $checkStmt->execute([$input['slug']]);
    $article = $checkStmt->fetch();
    
    if (!$article) {
        http_response_code(404);
        echo json_encode(['success' => false, 'error' => 'Article not found']);
        exit;
    }
    
    // Build update query dynamically based on provided fields
    $updates = [];
    $params = [];
    
    $allowedFields = ['title', 'content', 'excerpt', 'category', 'featured_image_url', 'published_at'];
    
    foreach ($allowedFields as $field) {
        if (isset($input[$field])) {
            $updates[] = "$field = ?";
            $params[] = $input[$field];
        }
    }
    
    // Handle tags separately (needs JSON encoding)
    if (isset($input['tags'])) {
        $updates[] = "tags = ?";
        $params[] = json_encode($input['tags']);
    }
    
    // Always update the updated_at timestamp
    $updates[] = "updated_at = NOW()";
    
    if (empty($updates)) {
        http_response_code(400);
        echo json_encode(['success' => false, 'error' => 'No fields to update']);
        exit;
    }
    
    // Add slug to params for WHERE clause
    $params[] = $input['slug'];
    
    $sql = "UPDATE blog_articles SET " . implode(', ', $updates) . " WHERE slug = ?";
    $stmt = $pdo->prepare($sql);
    $stmt->execute($params);
    
    echo json_encode([
        'success' => true,
        'message' => 'Article updated successfully',
        'slug' => $input['slug']
    ]);
    
} catch(PDOException $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'error' => 'Database error: ' . $e->getMessage()
    ]);
}
?>
