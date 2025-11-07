<?php
header('Content-Type: application/json');

// Allow both www and non-www versions
$allowed_origins = ['https://skilltude.com', 'https://www.skilltude.com'];
$origin = $_SERVER['HTTP_ORIGIN'] ?? '';
if (in_array($origin, $allowed_origins)) {
    header('Access-Control-Allow-Origin: ' . $origin);
}

header('Access-Control-Allow-Methods: GET');
header('Access-Control-Allow-Headers: Content-Type');

// Get slug from query parameter
$slug = $_GET['slug'] ?? '';

if (empty($slug)) {
    http_response_code(400);
    echo json_encode([
        'success' => false,
        'error' => 'Slug parameter is required'
    ]);
    exit;
}

// Database connection - use localhost since we're on the same server
$host = 'localhost';
$dbname = 'u931066387_skilltude';
$username = 'u931066387_management';
$password = 'Skilly@skilltude1';

try {
    $pdo = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8", $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    
    // Fetch single blog article by slug
    $stmt = $pdo->prepare("SELECT * FROM blog_articles WHERE slug = ? AND published_at IS NOT NULL");
    $stmt->execute([$slug]);
    $rawArticle = $stmt->fetch(PDO::FETCH_ASSOC);
    
    if ($rawArticle) {
        // Transform data to match frontend expectations
        $article = [
            'id' => $rawArticle['slug'],
            'title' => $rawArticle['title'],
            'excerpt' => $rawArticle['excerpt'],
            'author' => 'SkillTude Team',
            'date' => date('M d, Y', strtotime($rawArticle['published_at'])),
            'category' => $rawArticle['category'],
            'image' => $rawArticle['featured_image_url'],
            'slug' => $rawArticle['slug'],
            'content' => $rawArticle['content'],
            'tags' => json_decode($rawArticle['tags'] ?? '[]'),
            'readTime' => ceil(str_word_count($rawArticle['content']) / 200) . ' min read',
            'views' => (int)$rawArticle['views']
        ];
        
        echo json_encode([
            'success' => true,
            'article' => $article
        ]);
    } else {
        http_response_code(404);
        echo json_encode([
            'success' => false,
            'error' => 'Article not found'
        ]);
    }
    
} catch(PDOException $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'error' => 'Database connection failed: ' . $e->getMessage()
    ]);
}
?>