<?php
// Set response header to JSON
header('Content-Type: application/json');

// Initialize response array
$response = array();

// Check if form is submitted
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    
    // Get form data
    $name = isset($_POST['name']) ? trim($_POST['name']) : '';
    $email = isset($_POST['email']) ? trim($_POST['email']) : '';
    $message = isset($_POST['message']) ? trim($_POST['message']) : '';
    
    // Validate form data
    if (empty($name) || empty($email) || empty($message)) {
        $response['success'] = false;
        $response['message'] = 'All fields are required.';
    } elseif (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        $response['success'] = false;
        $response['message'] = 'Please enter a valid email address.';
    } elseif (strlen($message) < 10) {
        $response['success'] = false;
        $response['message'] = 'Message must be at least 10 characters long.';
    } else {
        // Email configuration
        $to = 'your-email@example.com'; // Change this to your email
        $subject = 'New Contact Form Message from ' . $name;
        
        // Email headers
        $headers = "MIME-Version: 1.0" . "\r\n";
        $headers .= "Content-type: text/html; charset=UTF-8" . "\r\n";
        $headers .= "From: " . $email . "\r\n";
        
        // Email body
        $body = "<html><body>";
        $body .= "<h2>New Contact Form Submission</h2>";
        $body .= "<p><strong>Name:</strong> " . htmlspecialchars($name) . "</p>";
        $body .= "<p><strong>Email:</strong> " . htmlspecialchars($email) . "</p>";
        $body .= "<p><strong>Message:</strong></p>";
        $body .= "<p>" . nl2br(htmlspecialchars($message)) . "</p>";
        $body .= "</body></html>";
        
        // Send email
        if (mail($to, $subject, $body, $headers)) {
            $response['success'] = true;
            $response['message'] = 'Thank you for your message! I will get back to you soon.';
            
            // Optional: Log message to file
            logMessage($name, $email, $message);
        } else {
            $response['success'] = false;
            $response['message'] = 'Failed to send message. Please try again later.';
        }
    }
} else {
    $response['success'] = false;
    $response['message'] = 'Invalid request method.';
}

// Function to log messages to a file
function logMessage($name, $email, $message) {
    $logFile = 'messages.log';
    $timestamp = date('Y-m-d H:i:s');
    $logEntry = "[$timestamp] Name: $name | Email: $email | Message: " . str_replace("\n", " ", $message) . "\n";
    file_put_contents($logFile, $logEntry, FILE_APPEND);
}

// Output JSON response
echo json_encode($response);
?>
