<?php
// Set the recipient email address
$receiving_email_address = 'aleksis@kaliz.ai';

// Check if the form is submitted
if ($_SERVER["REQUEST_METHOD"] === "POST") {
    $from_name = htmlspecialchars($_POST['name']);
    $from_email = htmlspecialchars($_POST['email']);
    $message = htmlspecialchars($_POST['message']);

    // Validate the email
    if (!filter_var($from_email, FILTER_VALIDATE_EMAIL)) {
        echo "Invalid email format";
        exit;
    }

    // Prepare the email
    $subject = "New Contact Form Submission";
    $headers = "From: $from_name <$from_email>\r\n";
    $headers .= "Reply-To: $from_email\r\n";
    $email_body = "You have received a new message from the contact form:\n\n";
    $email_body .= "Name: $from_name\n";
    $email_body .= "Email: $from_email\n";
    $email_body .= "Message:\n$message\n";

    // Send the email
    if (mail($receiving_email_address, $subject, $email_body, $headers)) {
        echo "Message sent successfully!";
    } else {
        echo "Message failed to send.";
    }
} else {
    echo "Invalid request method.";
}
?>
