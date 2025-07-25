# BusGo - Online Bus Booking System

A fully functional bus booking website built with HTML, CSS, Bootstrap, JavaScript, and AJAX.

## Features

### 🚌 Core Functionality

- **Bus Search**: Search buses by source, destination, date, and number of passengers
- **Real-time Results**: Dynamic display of available buses with pricing and seat availability
- **Online Booking**: Complete booking process with passenger details
- **Booking Confirmation**: Generate booking IDs and confirmation details
- **Responsive Design**: Mobile-friendly interface using Bootstrap 5

### 🎨 User Interface

- **Modern Design**: Clean and intuitive interface with smooth animations
- **Interactive Elements**: Hover effects, loading spinners, and form validations
- **Bootstrap Components**: Cards, modals, forms, and navigation components
- **Font Awesome Icons**: Professional iconography throughout the application
- **Custom CSS**: Enhanced styling with CSS animations and transitions

### ⚡ AJAX Features

- **Asynchronous Operations**: Non-blocking bus search and booking
- **Real-time Updates**: Live seat availability updates
- **Form Validation**: Client-side validation with immediate feedback
- **Error Handling**: Graceful error handling and user notifications
- **Offline Support**: Service worker for basic offline functionality

### 📱 Advanced Features

- **Service Worker**: Basic PWA functionality with caching
- **Local Storage**: Form data persistence and booking history
- **Auto-complete**: City selection with enhanced UX
- **Booking Management**: Comprehensive booking history management
- **Status Tracking**: Real-time booking status updates
- **Cancellation System**: Cancel bookings with refund processing
- **E-ticket Download**: Downloadable tickets for confirmed bookings
- **Responsive Navigation**: Mobile-optimized navigation menu

### 🗂️ Booking History Management

- **Search by ID**: Find specific bookings using Booking ID
- **Filter Options**: View all, upcoming, or cancelled bookings
- **Detailed View**: Complete booking information in modal popup
- **Status Management**: Track booking status (confirmed, completed, cancelled)
- **Cancellation**: Cancel upcoming bookings with confirmation
- **Persistent Storage**: Booking history saved in localStorage
- **Real-time Updates**: Live status updates and notifications

## Project Structure

```
BusGo/
├── index.html              # Main HTML file
├── demo.html               # Features demonstration page
├── css/
│   └── style.css          # Custom CSS styles
├── js/
│   ├── script.js          # Main JavaScript functionality
│   └── ajax.js            # AJAX and API handling
├── api/
│   └── endpoints.php      # Mock API endpoints (PHP)
├── sw.js                  # Service Worker for PWA
└── README.md              # Project documentation
```

## Technologies Used

- **HTML5**: Semantic markup and structure
- **CSS3**: Custom styling with Flexbox and Grid
- **Bootstrap 5**: Responsive framework and components
- **JavaScript (ES6+)**: Modern JavaScript features
- **jQuery**: DOM manipulation and AJAX
- **Font Awesome**: Icon library
- **PHP**: Mock backend API (optional)
- **Service Worker**: PWA functionality

## Getting Started

### Prerequisites

- Web browser (Chrome, Firefox, Safari, Edge)
- Web server (for API functionality) - Apache/Nginx with PHP support
- Text editor or IDE

### Installation

1. **Clone or Download** the project files to your local machine
2. **Place files** in your web server directory (htdocs for XAMPP, www for WAMP)
3. **Start your web server** (if using PHP API endpoints)
4. **Open** `index.html` in your web browser

### Without Web Server

You can run the project without a web server by:

1. Opening `index.html` directly in your browser
2. The mock data in `script.js` will be used instead of API calls
3. Some AJAX features may be limited

## Features Breakdown

### 1. Hero Section

- Eye-catching landing area with call-to-action
- Responsive design with background gradient
- Smooth scroll navigation

### 2. Bus Search

- **Form Fields**:
  - Source City (dropdown)
  - Destination City (dropdown)
  - Travel Date (date picker)
  - Number of Passengers (dropdown)
- **Validation**: Client-side form validation
- **Search Results**: Dynamic display of available buses

### 3. Bus Results Display

- **Bus Information**:
  - Bus name and type
  - Operator details
  - Departure and arrival times
  - Journey duration
  - Pricing information
  - Seat availability
  - Star ratings
- **Interactive Cards**: Hover effects and animations
- **Book Now Button**: Opens booking modal

### 4. Booking Modal

- **Passenger Information Form**:
  - First Name and Last Name
  - Email Address
  - Phone Number
- **Booking Summary**: Trip details and pricing
- **Real-time Validation**: Immediate feedback on form inputs
- **Booking Confirmation**: Success message with booking ID

### 5. Booking History Management

- **Search Interface**:
  - Search by Booking ID
  - Quick action buttons (All, Upcoming, Cancelled)
- **Booking Cards Display**:
  - Color-coded status indicators
  - Trip details and passenger information
  - Action buttons (View Details, Download, Cancel)
- **Detailed Modal View**:
  - Complete booking information
  - Passenger and trip details
  - Status-specific actions
- **Management Features**:
  - Cancel upcoming bookings
  - Download e-tickets
  - Real-time status updates
  - Persistent storage in localStorage

### 6. Services Section

- Feature highlights with icons
- Responsive card layout
- Hover animations

### 7. Contact Section

- Contact information
- Social media links
- Dark theme section

## JavaScript Functions

### Core Functions

- `handleSearch()`: Process search form submission
- `searchBuses()`: Filter available buses
- `displaySearchResults()`: Render search results
- `openBookingModal()`: Show booking form
- `confirmBooking()`: Process booking confirmation
- `validateBookingForm()`: Form validation logic

### Booking History Functions

- `handleBookingSearch()`: Process booking search form
- `searchBookingById()`: Find booking by ID
- `loadAllBookings()`: Display all booking history
- `loadUpcomingBookings()`: Filter upcoming trips
- `loadCancelledBookings()`: Filter cancelled bookings
- `displayBookingResults()`: Render booking cards
- `showBookingDetails()`: Display detailed booking information
- `confirmCancelBooking()`: Cancel booking with confirmation
- `downloadBookingTicket()`: Download e-ticket functionality

### AJAX Functions

- `enhancedSearchBuses()`: AJAX-powered bus search
- `enhancedCreateBooking()`: Asynchronous booking creation
- `checkBookingStatus()`: Booking status verification
- `updateSeatAvailabilityAJAX()`: Real-time updates
- `enhancedSearchBookingById()`: AJAX booking search by ID
- `enhancedLoadBookingHistory()`: Load booking history via API
- `enhancedCancelBooking()`: Cancel booking with API integration
- `syncBookingHistoryWithServer()`: Synchronize booking data

### Utility Functions

- `showLoading()`: Display/hide loading spinner
- `showAlert()`: Show notification messages
- `formatDate()`: Date formatting utility
- `generateBookingId()`: Unique ID generation
- `capitalizeFirst()`: String formatting

## CSS Features

### Custom Properties

- CSS variables for consistent theming
- Color scheme management
- Responsive breakpoints

### Animations

- Fade-in effects for content loading
- Slide animations for search results
- Hover transitions for interactive elements
- Loading spinner animations

### Responsive Design

- Mobile-first approach
- Flexible grid layouts
- Adaptive typography
- Touch-friendly interface

## API Endpoints

### Mock API Structure

```php
GET  /api/cities              # Get list of cities
GET  /api/buses/search        # Search available buses
POST /api/booking             # Create new booking
GET  /api/booking/status      # Check booking status
GET  /api/booking/history     # Get booking history by email
GET  /api/booking/{id}        # Get specific booking details
POST /api/booking/{id}/cancel # Cancel a specific booking
```

### Request/Response Examples

**Search Buses:**

```
GET /api/buses/search?from=colombo&to=kandy&date=2025-07-25&passengers=2
```

**Create Booking:**

```json
POST /api/booking
{
  "busId": 1,
  "firstName": "John",
  "lastName": "Doe",
  "email": "john@example.com",
  "phone": "0771234567",
  "passengers": 2,
  "date": "2025-07-25"
}
```

**Get Booking History:**
```
GET /api/booking/history?email=john@example.com
```

**Get Specific Booking:**
```
GET /api/booking/BG20250101001
```

**Cancel Booking:**
```
POST /api/booking/BG20250101001/cancel
```

## Browser Support

- Chrome 60+
- Firefox 55+
- Safari 11+
- Edge 79+
- Mobile browsers (iOS Safari, Chrome Mobile)

## Performance Optimizations

- **Lazy Loading**: Images and content loaded on demand
- **Caching**: Service worker caches static assets
- **Minification**: CSS and JS can be minified for production
- **CDN**: External libraries loaded from CDN
- **Debouncing**: Form input validation debounced for performance

## Security Considerations

- **Input Validation**: Client-side and server-side validation
- **XSS Prevention**: Proper data sanitization
- **CSRF Protection**: Can be added for production use
- **HTTPS**: Recommended for production deployment

## Future Enhancements

- **Payment Gateway Integration**: Online payment processing
- **User Authentication**: Login/registration system
- **Real-time Tracking**: Live bus tracking with GPS integration
- **Push Notifications**: Booking reminders and updates
- **Multi-language Support**: Internationalization (i18n)
- **Advanced Filters**: Price range, amenities, ratings filters
- **Seat Selection**: Interactive seat map for bus layout
- **Mobile App**: Native mobile application (iOS/Android)
- **Email Notifications**: Automated booking confirmations and reminders
- **Admin Dashboard**: Backend management system for operators
- **Route Analytics**: Performance metrics and route optimization
- **Loyalty Program**: Reward points and discounts for frequent travelers

## Contributing

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is open source and available under the [MIT License](LICENSE).

## Contact

- **Project**: BusGo Online Booking System
- **Developer**: Full Stack Development Team
- **Email**: support@busgo.lk
- **Website**: www.busgo.lk

---

**Note**: This is a demonstration project for educational purposes. For production use, additional security measures, error handling, and server-side validation should be implemented.
#   b u s _ b o o k i n g 
 
 