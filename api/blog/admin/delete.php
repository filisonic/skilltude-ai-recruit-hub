<?php
header('Content-Type: application/json');

// Allow both www and non-www versions
$allowed_origins = ['https://skilltude.com', 'https://www.skilltude.com'];
$origin = $_SERVER['HTTP_ORIGIN'] ?? '';
if (in_array($origin, $allowed_origins)) {
    header('Access-Control-Allow-Origin: ' . $origin);
}

header('Access-Control-Allow-Methods: DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

// Handle preflight OPTIONS request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

// Only allow DELETE requests
if ($_SERVER['REQUEST_METHOD'] !== 'DELETE') {
    http_response_code(405);
    echo json_encode(['success' => false, 'error' => 'Method not allowed']);
    exit;
}

// Get slug from query parameter
$slug = $_GET['slug'] ?? '';

if (empty($slug)) {
    http_response_code(400);
    echo json_encode(['success' => false, 'error' => 'Slug parameter is required']);
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
    $checkStmt->execute([$slug]);
    $article = $checkStmt->fetch();
    
    if (!$article) {
        http_response_code(404);
        echo json_encode(['success' => false, 'error' => 'Article not found']);
        exit;
    }
    
    // Delete the article
    $stmt = $pdo->prepare("DELETE FROM blog_articles WHERE slug = ?");
    $stmt->execute([$slug]);
    
    echo json_encode([
        'success' => true,
        'message' => 'Article deleted successfully',
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
