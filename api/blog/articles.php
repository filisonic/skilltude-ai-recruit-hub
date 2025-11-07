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

// Database connection - use localhost since we're on the same server
$host = 'localhost';
$dbname = 'u931066387_skilltude';
$username = 'u931066387_management';
$password = 'Skilly@skilltude1';

try {
    $pdo = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8", $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    
    // Fetch blog articles
    $stmt = $pdo->prepare("SELECT * FROM blog_articles WHERE published_at IS NOT NULL ORDER BY published_at DESC");
    $stmt->execute();
    $rawArticles = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    // Transform data to match frontend expectations
    $articles = array_map(function($article) {
        return [
            'id' => $article['slug'], // Use slug as ID for routing
            'title' => $article['title'],
            'excerpt' => $article['excerpt'],
            'author' => 'SkillTude Team', // Default author
            'date' => date('M d, Y', strtotime($article['published_at'])),
            'category' => $article['category'],
            'image' => $article['featured_image_url'],
            'slug' => $article['slug'],
            'content' => $article['content'],
            'tags' => json_decode($article['tags'] ?? '[]'),
            'readTime' => ceil(str_word_count($article['content']) / 200) . ' min read',
            'views' => (int)$article['views']
        ];
    }, $rawArticles);
    
    // Return success response
    echo json_encode([
        'success' => true,
        'articles' => $articles
    ]);
    
} catch(PDOException $e) {
    // Return error response
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'error' => 'Database connection failed: ' . $e->getMessage()
    ]);
}
?>