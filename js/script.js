// BusGo JavaScript - Main functionality

$(document).ready(function () {
  // Initialize the application
  initializeApp();

  // Set minimum date to today
  const today = new Date().toISOString().split("T")[0];
  $("#travelDate").attr("min", today);
  $("#travelDate").val(today);

  // Sample bus data (simulating backend API)
  const busData = [
    {
      id: 1,
      name: "Express Luxury",
      type: "AC Sleeper",
      from: "colombo",
      to: "kandy",
      departureTime: "06:00",
      arrivalTime: "09:30",
      duration: "3h 30m",
      price: 1500,
      seatsAvailable: 12,
    },
    {
      id: 2,
      name: "Royal Coach",
      type: "AC Seater",
      from: "colombo",
      to: "kandy",
      departureTime: "08:30",
      arrivalTime: "12:00",
      duration: "3h 30m",
      price: 1200,
      seatsAvailable: 8,
    },
    {
      id: 3,
      name: "Comfort Plus",
      type: "Non-AC",
      from: "colombo",
      to: "kandy",
      departureTime: "14:00",
      arrivalTime: "17:30",
      duration: "3h 30m",
      price: 800,
      seatsAvailable: 15,
    },
    {
      id: 4,
      name: "Night Rider",
      type: "AC Sleeper",
      from: "colombo",
      to: "galle",
      departureTime: "22:00",
      arrivalTime: "03:30",
      duration: "5h 30m",
      price: 2000,
      seatsAvailable: 6,
    },
    {
      id: 5,
      name: "Coastal Express",
      type: "AC Seater",
      from: "colombo",
      to: "galle",
      departureTime: "07:00",
      arrivalTime: "11:00",
      duration: "4h 00m",
      price: 1300,
      seatsAvailable: 10,
    },
    {
      id: 6,
      name: "Northern Star",
      type: "AC Sleeper",
      from: "colombo",
      to: "jaffna",
      departureTime: "20:00",
      arrivalTime: "06:00",
      duration: "10h 00m",
      price: 3500,
      seatsAvailable: 4,
    },
    {
      id: 7,
      name: "Heritage Line",
      type: "AC Seater",
      from: "colombo",
      to: "anuradhapura",
      departureTime: "05:30",
      arrivalTime: "10:00",
      duration: "4h 30m",
      price: 1800,
      seatsAvailable: 18,
    },
  ];

  let selectedBus = null;
  let bookingData = {};

  // Sample booking history data (simulating stored bookings)
  let bookingHistory = [
    {
      bookingId: "BG20250101001",
      busId: 1,
      busName: "Express Luxury",
      busType: "AC Sleeper",
      passenger: {
        firstName: "John",
        lastName: "Doe",
        email: "john@example.com",
        phone: "0771234567",
      },
      journey: {
        from: "colombo",
        to: "kandy",
        date: "2025-01-15",
        departureTime: "06:00",
        arrivalTime: "09:30",
      },
      passengers: 2,
      pricePerSeat: 1500,
      totalAmount: 3000,
      status: "confirmed",
      bookingDate: "2025-01-01 14:30:00",
    },
    {
      bookingId: "BG20250105002",
      busId: 4,
      busName: "Night Rider",
      busType: "AC Sleeper",
      passenger: {
        firstName: "Jane",
        lastName: "Smith",
        email: "jane@example.com",
        phone: "0779876543",
      },
      journey: {
        from: "colombo",
        to: "galle",
        date: "2025-02-20",
        departureTime: "22:00",
        arrivalTime: "03:30",
      },
      passengers: 1,
      pricePerSeat: 2000,
      totalAmount: 2000,
      status: "confirmed",
      bookingDate: "2025-01-05 09:15:00",
    },
    {
      bookingId: "BG20241220003",
      busId: 2,
      busName: "Royal Coach",
      busType: "AC Seater",
      passenger: {
        firstName: "Mike",
        lastName: "Johnson",
        email: "mike@example.com",
        phone: "0773456789",
      },
      journey: {
        from: "kandy",
        to: "colombo",
        date: "2024-12-25",
        departureTime: "15:00",
        arrivalTime: "18:30",
      },
      passengers: 3,
      pricePerSeat: 1200,
      totalAmount: 3600,
      status: "completed",
      bookingDate: "2024-12-20 11:45:00",
    },
    {
      bookingId: "BG20250110004",
      busId: 5,
      busName: "Coastal Express",
      busType: "AC Seater",
      passenger: {
        firstName: "Sarah",
        lastName: "Wilson",
        email: "sarah@example.com",
        phone: "0776543210",
      },
      journey: {
        from: "galle",
        to: "colombo",
        date: "2025-01-25",
        departureTime: "07:00",
        arrivalTime: "11:00",
      },
      passengers: 1,
      pricePerSeat: 1300,
      totalAmount: 1300,
      status: "cancelled",
      bookingDate: "2025-01-10 16:20:00",
    },
  ];

  // Initialize application
  function initializeApp() {
    bindEventHandlers();
    addScrollToTopButton();
    animateOnScroll();
    loadBookingHistoryFromStorage();
  }

  // Load booking history from localStorage
  function loadBookingHistoryFromStorage() {
    const savedHistory = localStorage.getItem("busgo_booking_history");
    if (savedHistory) {
      try {
        const parsedHistory = JSON.parse(savedHistory);
        // Merge with existing sample data, keeping user bookings at the top
        bookingHistory = [
          ...parsedHistory,
          ...bookingHistory.filter(
            (sample) =>
              !parsedHistory.some(
                (saved) => saved.bookingId === sample.bookingId
              )
          ),
        ];
      } catch (error) {
        console.error("Error loading booking history:", error);
      }
    }
  }

  // Bind all event handlers
  function bindEventHandlers() {
    // Search form submission
    $("#searchForm").on("submit", handleSearch);

    // Booking form submission
    $("#bookingForm").on("submit", handleBookingSubmission);

    // Confirm booking button
    $("#confirmBooking").on("click", confirmBooking);

    // Booking search form submission
    $("#bookingSearchForm").on("submit", handleBookingSearch);

    // Download ticket button
    $("#downloadTicketBtn").on("click", downloadBookingTicket);

    // Cancel booking button
    $("#cancelBookingBtn").on("click", cancelBooking);

    // Smooth scrolling for navigation links
    $('a[href^="#"]').on("click", function (e) {
      e.preventDefault();
      const target = $(this.getAttribute("href"));
      if (target.length) {
        $("html, body").animate(
          {
            scrollTop: target.offset().top - 70,
          },
          1000
        );
      }
    });

    // Form validation
    $(".form-control").on("input", validateField);
  }

  // Handle search form submission
  function handleSearch(e) {
    e.preventDefault();

    const fromCity = $("#fromCity").val();
    const toCity = $("#toCity").val();
    const travelDate = $("#travelDate").val();
    const passengers = $("#passengers").val();

    // Validate form
    if (!fromCity || !toCity || !travelDate || !passengers) {
      showAlert("Please fill in all required fields.", "warning");
      return;
    }

    if (fromCity === toCity) {
      showAlert("Source and destination cities cannot be the same.", "warning");
      return;
    }

    // Show loading spinner
    showLoading(true);

    // Simulate API call with delay
    setTimeout(() => {
      searchBuses(fromCity, toCity, travelDate, passengers);
      showLoading(false);
    }, 1500);
  }

  // Search for buses
  function searchBuses(from, to, date, passengers) {
    const filteredBuses = busData.filter(
      (bus) =>
        bus.from === from &&
        bus.to === to &&
        bus.seatsAvailable >= parseInt(passengers)
    );

    displaySearchResults(filteredBuses, from, to, date, passengers);
  }

  // Display search results
  function displaySearchResults(buses, from, to, date, passengers) {
    const resultsContainer = $("#busResults");
    const searchResults = $("#searchResults");

    if (buses.length === 0) {
      resultsContainer.html(`
                <div class="alert alert-info text-center">
                    <i class="fas fa-info-circle"></i>
                    No buses available for the selected route and date.
                </div>
            `);
    } else {
      let busCardsHtml = "";

      buses.forEach((bus) => {
        busCardsHtml += createBusCard(bus, from, to, date, passengers);
      });

      resultsContainer.html(busCardsHtml);

      // Bind book now buttons
      $(".btn-book-now").on("click", function () {
        const busId = $(this).data("bus-id");
        const selectedBusData = buses.find((b) => b.id === busId);
        openBookingModal(selectedBusData, from, to, date, passengers);
      });
    }

    // Show results with animation
    searchResults.slideDown(500).addClass("fade-in");

    // Scroll to results
    $("html, body").animate(
      {
        scrollTop: searchResults.offset().top - 100,
      },
      1000
    );
  }

  // Create bus card HTML
  function createBusCard(bus, from, to, date, passengers) {
    const fromCityName = capitalizeFirst(from);
    const toCityName = capitalizeFirst(to);

    return `
            <div class="bus-card slide-up">
                <div class="card-body">
                    <div class="bus-info">
                        <div>
                            <div class="bus-name">${bus.name}</div>
                            <span class="bus-type">${bus.type}</span>
                        </div>
                        <div class="text-end">
                            <i class="fas fa-star text-warning"></i>
                            <i class="fas fa-star text-warning"></i>
                            <i class="fas fa-star text-warning"></i>
                            <i class="fas fa-star text-warning"></i>
                            <i class="fas fa-star-half-alt text-warning"></i>
                            <span class="ms-1 text-muted">4.5</span>
                        </div>
                    </div>
                    
                    <div class="time-info">
                        <div class="departure-time">
                            <div class="time">${bus.departureTime}</div>
                            <div class="city">${fromCityName}</div>
                        </div>
                        <div class="duration">
                            <i class="fas fa-arrow-right"></i>
                            <div>${bus.duration}</div>
                        </div>
                        <div class="arrival-time">
                            <div class="time">${bus.arrivalTime}</div>
                            <div class="city">${toCityName}</div>
                        </div>
                    </div>
                    
                    <hr>
                    
                    <div class="price-book">
                        <div>
                            <div class="price">LKR ${bus.price.toLocaleString()}</div>
                            <div class="seats-available">
                                <i class="fas fa-users"></i> ${
                                  bus.seatsAvailable
                                } seats available
                            </div>
                        </div>
                        <button class="btn btn-book btn-book-now" data-bus-id="${
                          bus.id
                        }">
                            <i class="fas fa-ticket-alt"></i> Book Now
                        </button>
                    </div>
                </div>
            </div>
        `;
  }

  // Open booking modal
  function openBookingModal(bus, from, to, date, passengers) {
    selectedBus = bus;
    bookingData = { bus, from, to, date, passengers };

    const fromCityName = capitalizeFirst(from);
    const toCityName = capitalizeFirst(to);
    const totalAmount = bus.price * parseInt(passengers);

    const bookingDetailsHtml = `
            <div class="booking-summary">
                <h6><i class="fas fa-bus"></i> Booking Summary</h6>
                <table class="table booking-table mb-0">
                    <tbody>
                        <tr>
                            <td><strong>Bus:</strong></td>
                            <td>${bus.name} (${bus.type})</td>
                        </tr>
                        <tr>
                            <td><strong>Route:</strong></td>
                            <td>${fromCityName} → ${toCityName}</td>
                        </tr>
                        <tr>
                            <td><strong>Date:</strong></td>
                            <td>${formatDate(date)}</td>
                        </tr>
                        <tr>
                            <td><strong>Time:</strong></td>
                            <td>${bus.departureTime} - ${bus.arrivalTime}</td>
                        </tr>
                        <tr>
                            <td><strong>Passengers:</strong></td>
                            <td>${passengers}</td>
                        </tr>
                        <tr>
                            <td><strong>Price per ticket:</strong></td>
                            <td>LKR ${bus.price.toLocaleString()}</td>
                        </tr>
                        <tr class="table-active">
                            <td><strong>Total Amount:</strong></td>
                            <td><strong>LKR ${totalAmount.toLocaleString()}</strong></td>
                        </tr>
                    </tbody>
                </table>
            </div>
        `;

    $("#bookingDetails").html(bookingDetailsHtml);
    $("#bookingModal").modal("show");
  }

  // Handle booking form submission
  function handleBookingSubmission(e) {
    e.preventDefault();
    return false; // Prevent form submission, use confirm button instead
  }

  // Confirm booking
  function confirmBooking() {
    const firstName = $("#firstName").val().trim();
    const lastName = $("#lastName").val().trim();
    const email = $("#email").val().trim();
    const phone = $("#phone").val().trim();

    // Validate form
    if (!validateBookingForm(firstName, lastName, email, phone)) {
      return;
    }

    // Show loading
    showLoading(true);

    // Simulate booking API call
    setTimeout(() => {
      processBooking(firstName, lastName, email, phone);
      showLoading(false);
    }, 2000);
  }

  // Validate booking form
  function validateBookingForm(firstName, lastName, email, phone) {
    let isValid = true;

    // Reset previous validation
    $(".form-control").removeClass("is-invalid is-valid");
    $(".invalid-feedback").remove();

    // Validate first name
    if (!firstName) {
      showFieldError("#firstName", "First name is required");
      isValid = false;
    } else if (firstName.length < 2) {
      showFieldError("#firstName", "First name must be at least 2 characters");
      isValid = false;
    } else {
      showFieldSuccess("#firstName");
    }

    // Validate last name
    if (!lastName) {
      showFieldError("#lastName", "Last name is required");
      isValid = false;
    } else if (lastName.length < 2) {
      showFieldError("#lastName", "Last name must be at least 2 characters");
      isValid = false;
    } else {
      showFieldSuccess("#lastName");
    }

    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) {
      showFieldError("#email", "Email is required");
      isValid = false;
    } else if (!emailRegex.test(email)) {
      showFieldError("#email", "Please enter a valid email address");
      isValid = false;
    } else {
      showFieldSuccess("#email");
    }

    // Validate phone
    const phoneRegex = /^[0-9]{10}$/;
    if (!phone) {
      showFieldError("#phone", "Phone number is required");
      isValid = false;
    } else if (!phoneRegex.test(phone)) {
      showFieldError("#phone", "Please enter a valid 10-digit phone number");
      isValid = false;
    } else {
      showFieldSuccess("#phone");
    }

    return isValid;
  }

  // Process booking
  function processBooking(firstName, lastName, email, phone) {
    const bookingId = generateBookingId();
    const totalAmount = selectedBus.price * parseInt(bookingData.passengers);

    // Create new booking record
    const newBooking = {
      bookingId: bookingId,
      busId: selectedBus.id,
      busName: selectedBus.name,
      busType: selectedBus.type,
      passenger: {
        firstName: firstName,
        lastName: lastName,
        email: email,
        phone: phone,
      },
      journey: {
        from: bookingData.from,
        to: bookingData.to,
        date: bookingData.date,
        departureTime: selectedBus.departureTime,
        arrivalTime: selectedBus.arrivalTime,
      },
      passengers: parseInt(bookingData.passengers),
      pricePerSeat: selectedBus.price,
      totalAmount: totalAmount,
      status: "confirmed",
      bookingDate: new Date().toISOString().replace("T", " ").slice(0, 19),
    };

    // Add to booking history
    bookingHistory.unshift(newBooking); // Add to beginning of array

    // Store in localStorage for persistence
    localStorage.setItem(
      "busgo_booking_history",
      JSON.stringify(bookingHistory)
    );

    // Simulate successful booking
    $("#bookingModal").modal("hide");

    // Show enhanced success message
    const successMessage = `
            <div class="alert alert-success alert-dismissible fade show" role="alert">
                <h4 class="alert-heading"><i class="fas fa-check-circle"></i> Booking Confirmed!</h4>
                <p>Your booking has been confirmed successfully.</p>
                <hr>
                <div class="row">
                    <div class="col-md-6">
                        <p class="mb-1"><strong>Booking ID:</strong> ${bookingId}</p>
                        <p class="mb-1"><strong>Passenger:</strong> ${firstName} ${lastName}</p>
                        <p class="mb-1"><strong>Total Amount:</strong> LKR ${totalAmount.toLocaleString()}</p>
                    </div>
                    <div class="col-md-6">
                        <p class="mb-1"><strong>Route:</strong> ${capitalizeFirst(
                          bookingData.from
                        )} → ${capitalizeFirst(bookingData.to)}</p>
                        <p class="mb-1"><strong>Date:</strong> ${formatDate(
                          bookingData.date
                        )}</p>
                        <p class="mb-1"><strong>Time:</strong> ${
                          selectedBus.departureTime
                        } - ${selectedBus.arrivalTime}</p>
                    </div>
                </div>
                <div class="mt-3">
                    <button type="button" class="btn btn-primary btn-sm" onclick="downloadTicket('${bookingId}')">
                        <i class="fas fa-download"></i> Download Ticket
                    </button>
                    <button type="button" class="btn btn-outline-primary btn-sm ms-2" onclick="window.location.href='#bookings'">
                        <i class="fas fa-list"></i> View My Bookings
                    </button>
                </div>
                <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
            </div>
        `;

    // Insert success message after booking section
    $("#booking").after(`<div class="container mt-4">${successMessage}</div>`);

    // Clear form
    $("#bookingForm")[0].reset();
    $(".form-control").removeClass("is-invalid is-valid");

    // Scroll to success message
    $("html, body").animate(
      {
        scrollTop: $(".alert-success").offset().top - 100,
      },
      1000
    );

    // Auto-remove success message after 15 seconds
    setTimeout(() => {
      $(".alert-success").fadeOut(500, function () {
        $(this).parent().remove();
      });
    }, 15000);
  }

  // Booking History Management Functions

  // Handle booking search form submission
  function handleBookingSearch(e) {
    e.preventDefault();

    const bookingId = $("#bookingSearchId").val().trim();

    if (!bookingId) {
      showAlert("Please enter a booking ID.", "warning");
      return;
    }

    // Show loading
    showLoading(true);

    // Simulate API call delay
    setTimeout(() => {
      searchBookingById(bookingId);
      showLoading(false);
    }, 1000);
  }

  // Search for booking by ID
  function searchBookingById(bookingId) {
    const booking = bookingHistory.find(
      (b) => b.bookingId.toLowerCase() === bookingId.toLowerCase()
    );

    if (booking) {
      displayBookingResults([booking]);
      showBookingDetails(booking);
    } else {
      showAlert("Booking not found. Please check your booking ID.", "warning");
      $("#bookingHistoryResults").hide();
    }
  }

  // Load all bookings
  function loadAllBookings() {
    showLoading(true);

    setTimeout(() => {
      displayBookingResults(bookingHistory);
      showLoading(false);
    }, 800);
  }

  // Load upcoming bookings
  function loadUpcomingBookings() {
    showLoading(true);

    setTimeout(() => {
      const today = new Date();
      const upcomingBookings = bookingHistory.filter((booking) => {
        const travelDate = new Date(booking.journey.date);
        return travelDate >= today && booking.status !== "cancelled";
      });

      displayBookingResults(upcomingBookings);
      showLoading(false);
    }, 800);
  }

  // Load cancelled bookings
  function loadCancelledBookings() {
    showLoading(true);

    setTimeout(() => {
      const cancelledBookings = bookingHistory.filter(
        (booking) => booking.status === "cancelled"
      );

      displayBookingResults(cancelledBookings);
      showLoading(false);
    }, 800);
  }

  // Display booking results
  function displayBookingResults(bookings) {
    const resultsContainer = $("#bookingsList");
    const bookingResults = $("#bookingHistoryResults");

    if (bookings.length === 0) {
      resultsContainer.html(`
        <div class="alert alert-info text-center">
          <i class="fas fa-info-circle"></i>
          No bookings found.
        </div>
      `);
    } else {
      let bookingCardsHtml = "";

      bookings.forEach((booking) => {
        bookingCardsHtml += createBookingCard(booking);
      });

      resultsContainer.html(bookingCardsHtml);

      // Bind view details buttons
      $(".btn-view-booking").on("click", function () {
        const bookingId = $(this).data("booking-id");
        const booking = bookings.find((b) => b.bookingId === bookingId);
        showBookingDetails(booking);
      });
    }

    // Show results with animation
    bookingResults.slideDown(500).addClass("fade-in");

    // Scroll to results
    $("html, body").animate(
      {
        scrollTop: bookingResults.offset().top - 100,
      },
      1000
    );
  }

  // Create booking card HTML
  function createBookingCard(booking) {
    const fromCityName = capitalizeFirst(booking.journey.from);
    const toCityName = capitalizeFirst(booking.journey.to);

    let statusBadge = "";
    let statusClass = "";

    switch (booking.status) {
      case "confirmed":
        statusBadge =
          '<span class="status-badge status-confirmed">Confirmed</span>';
        statusClass = "border-success";
        break;
      case "completed":
        statusBadge =
          '<span class="status-badge" style="background: #6c757d; color: white;">Completed</span>';
        statusClass = "border-secondary";
        break;
      case "cancelled":
        statusBadge =
          '<span class="status-badge status-cancelled">Cancelled</span>';
        statusClass = "border-danger";
        break;
      default:
        statusBadge =
          '<span class="status-badge status-pending">Pending</span>';
        statusClass = "border-warning";
    }

    const travelDate = new Date(booking.journey.date);
    const isUpcoming =
      travelDate >= new Date() && booking.status !== "cancelled";

    return `
      <div class="card mb-3 ${statusClass}" style="border-left: 4px solid;">
        <div class="card-body">
          <div class="row">
            <div class="col-md-8">
              <div class="d-flex justify-content-between align-items-start mb-2">
                <h5 class="card-title mb-1">
                  <i class="fas fa-bus text-primary"></i> ${booking.busName}
                  <small class="text-muted">(${booking.busType})</small>
                </h5>
                ${statusBadge}
              </div>
              
              <div class="booking-info mb-3">
                <div class="row">
                  <div class="col-sm-6">
                    <p class="mb-1">
                      <strong>Route:</strong> ${fromCityName} → ${toCityName}
                    </p>
                    <p class="mb-1">
                      <strong>Date:</strong> ${formatDate(booking.journey.date)}
                    </p>
                    <p class="mb-1">
                      <strong>Time:</strong> ${
                        booking.journey.departureTime
                      } - ${booking.journey.arrivalTime}
                    </p>
                  </div>
                  <div class="col-sm-6">
                    <p class="mb-1">
                      <strong>Booking ID:</strong> ${booking.bookingId}
                    </p>
                    <p class="mb-1">
                      <strong>Passengers:</strong> ${booking.passengers}
                    </p>
                    <p class="mb-1">
                      <strong>Total:</strong> LKR ${booking.totalAmount.toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            <div class="col-md-4 text-md-end">
              <div class="booking-actions">
                <button class="btn btn-primary btn-sm btn-view-booking" data-booking-id="${
                  booking.bookingId
                }">
                  <i class="fas fa-eye"></i> View Details
                </button>
                ${
                  booking.status === "confirmed"
                    ? `
                  <button class="btn btn-success btn-sm mt-2" onclick="downloadTicket('${booking.bookingId}')">
                    <i class="fas fa-download"></i> Download
                  </button>
                `
                    : ""
                }
                ${
                  isUpcoming
                    ? `
                  <button class="btn btn-outline-danger btn-sm mt-2" onclick="confirmCancelBooking('${booking.bookingId}')">
                    <i class="fas fa-times"></i> Cancel
                  </button>
                `
                    : ""
                }
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  // Show booking details in modal
  function showBookingDetails(booking) {
    const fromCityName = capitalizeFirst(booking.journey.from);
    const toCityName = capitalizeFirst(booking.journey.to);

    let statusInfo = "";
    switch (booking.status) {
      case "confirmed":
        statusInfo =
          '<div class="alert alert-success"><i class="fas fa-check-circle"></i> Your booking is confirmed and your seat is reserved.</div>';
        break;
      case "completed":
        statusInfo =
          '<div class="alert alert-secondary"><i class="fas fa-flag-checkered"></i> This trip has been completed.</div>';
        break;
      case "cancelled":
        statusInfo =
          '<div class="alert alert-danger"><i class="fas fa-times-circle"></i> This booking has been cancelled.</div>';
        break;
    }

    const detailsHtml = `
      ${statusInfo}
      
      <div class="row">
        <div class="col-md-6">
          <h6 class="text-primary"><i class="fas fa-bus"></i> Trip Details</h6>
          <table class="table table-sm">
            <tr>
              <td><strong>Booking ID:</strong></td>
              <td>${booking.bookingId}</td>
            </tr>
            <tr>
              <td><strong>Bus:</strong></td>
              <td>${booking.busName} (${booking.busType})</td>
            </tr>
            <tr>
              <td><strong>Route:</strong></td>
              <td>${fromCityName} → ${toCityName}</td>
            </tr>
            <tr>
              <td><strong>Date:</strong></td>
              <td>${formatDate(booking.journey.date)}</td>
            </tr>
            <tr>
              <td><strong>Departure:</strong></td>
              <td>${booking.journey.departureTime}</td>
            </tr>
            <tr>
              <td><strong>Arrival:</strong></td>
              <td>${booking.journey.arrivalTime}</td>
            </tr>
          </table>
        </div>
        
        <div class="col-md-6">
          <h6 class="text-success"><i class="fas fa-user"></i> Passenger Details</h6>
          <table class="table table-sm">
            <tr>
              <td><strong>Name:</strong></td>
              <td>${booking.passenger.firstName} ${
      booking.passenger.lastName
    }</td>
            </tr>
            <tr>
              <td><strong>Email:</strong></td>
              <td>${booking.passenger.email}</td>
            </tr>
            <tr>
              <td><strong>Phone:</strong></td>
              <td>${booking.passenger.phone}</td>
            </tr>
            <tr>
              <td><strong>Passengers:</strong></td>
              <td>${booking.passengers}</td>
            </tr>
            <tr>
              <td><strong>Price per seat:</strong></td>
              <td>LKR ${booking.pricePerSeat.toLocaleString()}</td>
            </tr>
            <tr>
              <td><strong>Total Amount:</strong></td>
              <td><strong>LKR ${booking.totalAmount.toLocaleString()}</strong></td>
            </tr>
          </table>
        </div>
      </div>
      
      <div class="mt-3">
        <small class="text-muted">
          <i class="fas fa-calendar"></i> Booked on: ${new Date(
            booking.bookingDate
          ).toLocaleString()}
        </small>
      </div>
    `;

    $("#bookingDetailsContent").html(detailsHtml);

    // Update modal buttons based on status
    const downloadBtn = $("#downloadTicketBtn");
    const cancelBtn = $("#cancelBookingBtn");

    if (booking.status === "cancelled" || booking.status === "completed") {
      cancelBtn.hide();
    } else {
      cancelBtn.show().attr("data-booking-id", booking.bookingId);
    }

    downloadBtn.attr("data-booking-id", booking.bookingId);

    $("#bookingDetailsModal").modal("show");
  }

  // Download booking ticket
  function downloadBookingTicket() {
    const bookingId = $("#downloadTicketBtn").attr("data-booking-id");
    downloadTicket(bookingId);
  }

  // Cancel booking
  function cancelBooking() {
    const bookingId = $("#cancelBookingBtn").attr("data-booking-id");
    confirmCancelBooking(bookingId);
  }

  // Confirm booking cancellation
  function confirmCancelBooking(bookingId) {
    if (
      confirm(
        "Are you sure you want to cancel this booking? This action cannot be undone."
      )
    ) {
      showLoading(true);

      // Simulate API call
      setTimeout(() => {
        const bookingIndex = bookingHistory.findIndex(
          (b) => b.bookingId === bookingId
        );
        if (bookingIndex !== -1) {
          bookingHistory[bookingIndex].status = "cancelled";

          showAlert(
            "Booking cancelled successfully. Refund will be processed within 3-5 business days.",
            "success"
          );

          // Refresh the displayed bookings
          const currentBookings =
            $("#bookingsList .card").length > 0 ? bookingHistory : [];
          if (currentBookings.length > 0) {
            displayBookingResults(bookingHistory);
          }

          $("#bookingDetailsModal").modal("hide");
        }

        showLoading(false);
      }, 1500);
    }
  }

  // Utility functions
  function showFieldError(fieldId, message) {
    const field = $(fieldId);
    field.addClass("is-invalid");
    field.after(`<div class="invalid-feedback">${message}</div>`);
  }

  function showFieldSuccess(fieldId) {
    $(fieldId).addClass("is-valid");
  }

  function validateField() {
    const field = $(this);
    const value = field.val().trim();

    // Remove previous validation classes
    field.removeClass("is-invalid is-valid");
    field.siblings(".invalid-feedback").remove();

    if (value) {
      field.addClass("is-valid");
    }
  }

  function showLoading(show) {
    if (show) {
      $("#loadingSpinner").show();
    } else {
      $("#loadingSpinner").hide();
    }
  }

  function showAlert(message, type = "info") {
    const alert = `
            <div class="alert alert-${type} alert-dismissible fade show" role="alert">
                ${message}
                <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
            </div>
        `;

    // Show alert at the top of the page
    $("body").prepend(`<div class="container mt-5 pt-3">${alert}</div>`);

    // Auto-remove after 5 seconds
    setTimeout(() => {
      $(".alert").fadeOut(500, function () {
        $(this).parent().remove();
      });
    }, 5000);
  }

  function capitalizeFirst(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  }

  function generateBookingId() {
    return (
      "BG" + Date.now().toString().slice(-8) + Math.floor(Math.random() * 100)
    );
  }

  // Add scroll to top button
  function addScrollToTopButton() {
    $("body").append(
      '<button class="scroll-top"><i class="fas fa-arrow-up"></i></button>'
    );

    $(window).scroll(function () {
      if ($(this).scrollTop() > 100) {
        $(".scroll-top").fadeIn();
      } else {
        $(".scroll-top").fadeOut();
      }
    });

    $(".scroll-top").click(function () {
      $("html, body").animate({ scrollTop: 0 }, 1000);
    });
  }

  // Animate elements on scroll
  function animateOnScroll() {
    $(window).scroll(function () {
      $(".card").each(function () {
        const elementTop = $(this).offset().top;
        const elementBottom = elementTop + $(this).outerHeight();
        const viewportTop = $(window).scrollTop();
        const viewportBottom = viewportTop + $(window).height();

        if (elementBottom > viewportTop && elementTop < viewportBottom) {
          $(this).addClass("fade-in");
        }
      });
    });
  }

  // AJAX functionality for real-time updates
  function initializeRealTimeUpdates() {
    // Simulate real-time seat availability updates
    setInterval(() => {
      updateSeatAvailability();
    }, 30000); // Update every 30 seconds
  }

  function updateSeatAvailability() {
    $(".seats-available").each(function () {
      const currentText = $(this).text();
      const currentSeats = parseInt(currentText.match(/\d+/)[0]);

      // Randomly decrease seats (simulate bookings)
      if (Math.random() < 0.3 && currentSeats > 0) {
        const newSeats = Math.max(
          0,
          currentSeats - Math.floor(Math.random() * 3) - 1
        );
        $(this).html(
          `<i class="fas fa-users"></i> ${newSeats} seats available`
        );

        // Update corresponding bus data
        const busCard = $(this).closest(".bus-card");
        const bookButton = busCard.find(".btn-book-now");

        if (newSeats === 0) {
          bookButton
            .prop("disabled", true)
            .text("Sold Out")
            .removeClass("btn-book")
            .addClass("btn-secondary");
        } else if (newSeats <= 3) {
          $(this)
            .addClass("text-danger")
            .html(`<i class="fas fa-users"></i> Only ${newSeats} seats left!`);
        }
      }
    });
  }

  // Initialize real-time updates
  initializeRealTimeUpdates();

  // Handle form reset
  function resetSearchForm() {
    $("#searchForm")[0].reset();
    $("#searchResults").hide();
    $(".form-control").removeClass("is-invalid is-valid");
  }

  // Export functions for testing
  window.BusGo = {
    searchBuses,
    validateBookingForm,
    formatDate,
    generateBookingId,
    loadAllBookings,
    loadUpcomingBookings,
    loadCancelledBookings,
    searchBookingById,
  };

  // Global functions for HTML onclick handlers
  window.loadAllBookings = loadAllBookings;
  window.loadUpcomingBookings = loadUpcomingBookings;
  window.loadCancelledBookings = loadCancelledBookings;
  window.confirmCancelBooking = confirmCancelBooking;
});

// Service Worker registration for offline functionality
if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker
      .register("/sw.js")
      .then((registration) => {
        console.log("SW registered: ", registration);
      })
      .catch((registrationError) => {
        console.log("SW registration failed: ", registrationError);
      });
  });
}
