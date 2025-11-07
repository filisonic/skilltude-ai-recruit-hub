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

// Database connection
$host = 'localhost';
$dbname = 'u931066387_skilltude';
$username = 'u931066387_management';
$password = 'Skilly@skilltude1';

try {
    $pdo = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8", $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    
    // Fetch ALL articles (including drafts) for admin
    $stmt = $pdo->prepare("
        SELECT 
            id,
            title,
            slug,
            excerpt,
            category,
            featured_image_url,
            published_at,
            created_at,
            updated_at,
            views
        FROM blog_articles 
        ORDER BY created_at DESC
    ");
    $stmt->execute();
    $rawArticles = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    $articles = [];
    foreach ($rawArticles as $article) {
        $articles[] = [
            'id' => (int)$article['id'],
            'title' => $article['title'],
            'slug' => $article['slug'],
            'excerpt' => $article['excerpt'],
            'category' => $article['category'],
            'image' => $article['featured_image_url'],
            'status' => $article['published_at'] ? 'published' : 'draft',
            'author' => 'SkillTude Team',
            'date' => $article['published_at'] ? date('M d, Y', strtotime($article['published_at'])) : date('M d, Y', strtotime($article['created_at'])),
            'created_at' => date('Y-m-d', strtotime($article['created_at'])),
            'updated_at' => date('Y-m-d', strtotime($article['updated_at'])),
            'views' => (int)$article['views']
        ];
    }
    
    echo json_encode([
        'success' => true,
        'articles' => $articles,
        'total' => count($articles)
    ]);
    
} catch(PDOException $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'error' => 'Database error: ' . $e->getMessage()
    ]);
}
?>
