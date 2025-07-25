<?php
// Mock API endpoints for the bus booking system
// This file simulates backend API responses

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE');
header('Access-Control-Allow-Headers: Content-Type');

// Get the request method and endpoint
$method = $_SERVER['REQUEST_METHOD'];
$request = $_SERVER['REQUEST_URI'];
$path = parse_url($request, PHP_URL_PATH);
$path = str_replace('/api', '', $path);

// Sample data
$cities = [
    ['id' => 'colombo', 'name' => 'Colombo', 'state' => 'Western'],
    ['id' => 'kandy', 'name' => 'Kandy', 'state' => 'Central'],
    ['id' => 'galle', 'name' => 'Galle', 'state' => 'Southern'],
    ['id' => 'jaffna', 'name' => 'Jaffna', 'state' => 'Northern'],
    ['id' => 'anuradhapura', 'name' => 'Anuradhapura', 'state' => 'North Central']
];

$buses = [
    [
        'id' => 1,
        'name' => 'Express Luxury',
        'type' => 'AC Sleeper',
        'operator' => 'Sri Lanka Transport Board',
        'from' => 'colombo',
        'to' => 'kandy',
        'departureTime' => '06:00',
        'arrivalTime' => '09:30',
        'duration' => '3h 30m',
        'price' => 1500,
        'seatsTotal' => 40,
        'seatsAvailable' => 12,
        'amenities' => ['AC', 'WiFi', 'Charging Port', 'Entertainment'],
        'rating' => 4.5
    ],
    [
        'id' => 2,
        'name' => 'Royal Coach',
        'type' => 'AC Seater',
        'operator' => 'Royal Express',
        'from' => 'colombo',
        'to' => 'kandy',
        'departureTime' => '08:30',
        'arrivalTime' => '12:00',
        'duration' => '3h 30m',
        'price' => 1200,
        'seatsTotal' => 45,
        'seatsAvailable' => 8,
        'amenities' => ['AC', 'Charging Port'],
        'rating' => 4.2
    ],
    [
        'id' => 3,
        'name' => 'Comfort Plus',
        'type' => 'Non-AC',
        'operator' => 'National Transport',
        'from' => 'colombo',
        'to' => 'kandy',
        'departureTime' => '14:00',
        'arrivalTime' => '17:30',
        'duration' => '3h 30m',
        'price' => 800,
        'seatsTotal' => 50,
        'seatsAvailable' => 15,
        'amenities' => ['Charging Port'],
        'rating' => 3.8
    ],
    [
        'id' => 4,
        'name' => 'Night Rider',
        'type' => 'AC Sleeper',
        'operator' => 'Night Express',
        'from' => 'colombo',
        'to' => 'galle',
        'departureTime' => '22:00',
        'arrivalTime' => '03:30',
        'duration' => '5h 30m',
        'price' => 2000,
        'seatsTotal' => 30,
        'seatsAvailable' => 6,
        'amenities' => ['AC', 'WiFi', 'Blanket', 'Entertainment'],
        'rating' => 4.7
    ],
    [
        'id' => 5,
        'name' => 'Coastal Express',
        'type' => 'AC Seater',
        'operator' => 'Coastal Lines',
        'from' => 'colombo',
        'to' => 'galle',
        'departureTime' => '07:00',
        'arrivalTime' => '11:00',
        'duration' => '4h 00m',
        'price' => 1300,
        'seatsTotal' => 40,
        'seatsAvailable' => 10,
        'amenities' => ['AC', 'WiFi', 'Charging Port'],
        'rating' => 4.3
    ]
];

$bookings = [];

// Route handling
switch ($path) {
    case '/cities':
        if ($method == 'GET') {
            echo json_encode([
                'success' => true,
                'data' => $cities
            ]);
        }
        break;
        
    case '/buses/search':
        if ($method == 'GET') {
            $from = $_GET['from'] ?? '';
            $to = $_GET['to'] ?? '';
            $date = $_GET['date'] ?? '';
            $passengers = $_GET['passengers'] ?? 1;
            
            $filteredBuses = array_filter($buses, function($bus) use ($from, $to, $passengers) {
                return $bus['from'] == $from && 
                       $bus['to'] == $to && 
                       $bus['seatsAvailable'] >= $passengers;
            });
            
            // Simulate API delay
            sleep(1);
            
            echo json_encode([
                'success' => true,
                'data' => array_values($filteredBuses),
                'searchParams' => [
                    'from' => $from,
                    'to' => $to,
                    'date' => $date,
                    'passengers' => $passengers
                ]
            ]);
        }
        break;
        
    case '/booking':
        if ($method == 'POST') {
            $input = json_decode(file_get_contents('php://input'), true);
            
            // Validate required fields
            $requiredFields = ['busId', 'firstName', 'lastName', 'email', 'phone', 'passengers'];
            foreach ($requiredFields as $field) {
                if (!isset($input[$field]) || empty($input[$field])) {
                    echo json_encode([
                        'success' => false,
                        'error' => "Field '$field' is required"
                    ]);
                    exit;
                }
            }
            
            // Find the bus
            $bus = array_filter($buses, function($b) use ($input) {
                return $b['id'] == $input['busId'];
            });
            
            if (empty($bus)) {
                echo json_encode([
                    'success' => false,
                    'error' => 'Bus not found'
                ]);
                exit;
            }
            
            $bus = array_values($bus)[0];
            
            // Check seat availability
            if ($bus['seatsAvailable'] < $input['passengers']) {
                echo json_encode([
                    'success' => false,
                    'error' => 'Not enough seats available'
                ]);
                exit;
            }
            
            // Generate booking
            $bookingId = 'BG' . time() . rand(100, 999);
            $totalAmount = $bus['price'] * $input['passengers'];
            
            $booking = [
                'bookingId' => $bookingId,
                'busId' => $input['busId'],
                'busName' => $bus['name'],
                'passenger' => [
                    'firstName' => $input['firstName'],
                    'lastName' => $input['lastName'],
                    'email' => $input['email'],
                    'phone' => $input['phone']
                ],
                'journey' => [
                    'from' => $bus['from'],
                    'to' => $bus['to'],
                    'date' => $input['date'],
                    'departureTime' => $bus['departureTime'],
                    'arrivalTime' => $bus['arrivalTime']
                ],
                'passengers' => $input['passengers'],
                'pricePerSeat' => $bus['price'],
                'totalAmount' => $totalAmount,
                'status' => 'confirmed',
                'bookingDate' => date('Y-m-d H:i:s')
            ];
            
            // Simulate processing delay
            sleep(2);
            
            echo json_encode([
                'success' => true,
                'data' => $booking,
                'message' => 'Booking confirmed successfully'
            ]);
        }
        break;
        
    case '/booking/status':
        if ($method == 'GET') {
            $bookingId = $_GET['bookingId'] ?? '';
            
            if (empty($bookingId)) {
                echo json_encode([
                    'success' => false,
                    'error' => 'Booking ID is required'
                ]);
                exit;
            }
            
            // Mock booking status
            echo json_encode([
                'success' => true,
                'data' => [
                    'bookingId' => $bookingId,
                    'status' => 'confirmed',
                    'message' => 'Your booking is confirmed and seat is reserved'
                ]
            ]);
        }
        break;
        
    case '/booking/history':
        if ($method == 'GET') {
            $email = $_GET['email'] ?? '';
            
            if (empty($email)) {
                echo json_encode([
                    'success' => false,
                    'error' => 'Email is required'
                ]);
                exit;
            }
            
            // Mock booking history
            $mockHistory = [
                [
                    'bookingId' => 'BG20250101001',
                    'busName' => 'Express Luxury',
                    'busType' => 'AC Sleeper',
                    'route' => 'Colombo to Kandy',
                    'date' => '2025-01-15',
                    'time' => '06:00 - 09:30',
                    'passengers' => 2,
                    'totalAmount' => 3000,
                    'status' => 'confirmed',
                    'bookingDate' => '2025-01-01 14:30:00'
                ],
                [
                    'bookingId' => 'BG20250105002',
                    'busName' => 'Night Rider',
                    'busType' => 'AC Sleeper',
                    'route' => 'Colombo to Galle',
                    'date' => '2025-02-20',
                    'time' => '22:00 - 03:30',
                    'passengers' => 1,
                    'totalAmount' => 2000,
                    'status' => 'confirmed',
                    'bookingDate' => '2025-01-05 09:15:00'
                ]
            ];
            
            echo json_encode([
                'success' => true,
                'data' => $mockHistory
            ]);
        }
        break;
        
    case preg_match('/^\/booking\/([A-Z0-9]+)$/', $path, $matches) ? true : false:
        if ($method == 'GET') {
            $bookingId = $matches[1];
            
            // Mock single booking details
            $mockBooking = [
                'bookingId' => $bookingId,
                'busId' => 1,
                'busName' => 'Express Luxury',
                'busType' => 'AC Sleeper',
                'passenger' => [
                    'firstName' => 'John',
                    'lastName' => 'Doe',
                    'email' => 'john@example.com',
                    'phone' => '0771234567'
                ],
                'journey' => [
                    'from' => 'colombo',
                    'to' => 'kandy',
                    'date' => '2025-01-15',
                    'departureTime' => '06:00',
                    'arrivalTime' => '09:30'
                ],
                'passengers' => 2,
                'pricePerSeat' => 1500,
                'totalAmount' => 3000,
                'status' => 'confirmed',
                'bookingDate' => '2025-01-01 14:30:00'
            ];
            
            echo json_encode([
                'success' => true,
                'data' => $mockBooking
            ]);
        }
        break;
        
    case preg_match('/^\/booking\/([A-Z0-9]+)\/cancel$/', $path, $matches) ? true : false:
        if ($method == 'POST') {
            $bookingId = $matches[1];
            
            // Simulate cancellation delay
            sleep(1);
            
            echo json_encode([
                'success' => true,
                'data' => [
                    'bookingId' => $bookingId,
                    'status' => 'cancelled',
                    'refundAmount' => 2700, // 90% refund
                    'refundDate' => date('Y-m-d', strtotime('+5 days')),
                    'message' => 'Booking cancelled successfully. Refund will be processed within 3-5 business days.'
                ]
            ]);
        }
        break;
        
    default:
        echo json_encode([
            'success' => false,
            'error' => 'Endpoint not found'
        ]);
        break;
}
?>
