<?php
session_start();
require_once '../lib/db.php';

header('Content-Type: application/json; charset=utf-8');

// Включаем вывод ошибок только для отладки (уберите в production)
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

$action = $_GET['action'] ?? '';

try {
    switch ($action) {
        case 'checkAuth':
            if (isset($_SESSION['user_id'])) {
                $sql = "SELECT id, name, role FROM users WHERE id = ?";
                $user = fetchOne($conn, $sql, [$_SESSION['user_id']]);
                if ($user) {
                    echo json_encode(['authenticated' => true, 'user' => $user]);
                } else {
                    echo json_encode(['authenticated' => false, 'message' => 'User not found']);
                }
            } else {
                echo json_encode(['authenticated' => false, 'message' => 'Not authenticated']);
            }
            break;

        case 'logout':
            session_destroy();
            echo json_encode(['success' => true, 'message' => 'Logged out successfully']);
            break;

        default:
            if ($_SERVER['REQUEST_METHOD'] === 'POST') {
                $login = trim($_POST['login']);
                $password = $_POST['password'];

                if (empty($login) || empty($password)) {
                    echo json_encode(['success' => false, 'message' => 'Login and password are required.']);
                    exit;
                }

                $sql = "SELECT id, name, role, password FROM users WHERE login = ?";
                $user = fetchOne($conn, $sql, [$login]);

                if ($user && password_verify($password, $user['password'])) {
                    $_SESSION['user_id'] = $user['id'];
                     echo json_encode(['success' => true, 'user' => ['id' => $user['id'], 'name' => $user['name'], 'role' => $user['role']], 'message' => 'Logged in successfully']);
                } else {
                    echo json_encode(['success' => false, 'message' => 'Invalid login or password.']);
                }
            } else {
                echo json_encode(['success' => false, 'message' => 'Invalid request method']);
            }
            break;
    }
} catch (Exception $e) {
    http_response_code(500);
     echo json_encode(['success' => false, 'message' => 'Server error: ' . $e->getMessage()]);
} finally {
   if($conn)
   $conn->close();
}
?>
