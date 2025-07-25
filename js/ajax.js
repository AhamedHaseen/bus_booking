// Enhanced AJAX functionality for BusGo
// This file contains all AJAX-related functions

class BusGoAPI {
  constructor() {
    this.baseURL = "/api";
    this.timeout = 10000; // 10 seconds
  }

  // Generic AJAX request handler
  async makeRequest(endpoint, method = "GET", data = null) {
    const url = `${this.baseURL}${endpoint}`;

    const options = {
      method: method,
      headers: {
        "Content-Type": "application/json",
      },
      timeout: this.timeout,
    };

    if (data && method !== "GET") {
      options.body = JSON.stringify(data);
    }

    try {
      const response = await fetch(url, options);
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Request failed");
      }

      return result;
    } catch (error) {
      console.error("API Request failed:", error);
      throw error;
    }
  }

  // Search buses
  async searchBuses(from, to, date, passengers) {
    const endpoint = `/buses/search?from=${from}&to=${to}&date=${date}&passengers=${passengers}`;
    return await this.makeRequest(endpoint);
  }

  // Get cities
  async getCities() {
    return await this.makeRequest("/cities");
  }

  // Create booking
  async createBooking(bookingData) {
    return await this.makeRequest("/booking", "POST", bookingData);
  }

  // Check booking status
  async getBookingStatus(bookingId) {
    const endpoint = `/booking/status?bookingId=${bookingId}`;
    return await this.makeRequest(endpoint);
  }

  // Get booking history
  async getBookingHistory(email) {
    const endpoint = `/booking/history?email=${email}`;
    return await this.makeRequest(endpoint);
  }

  // Get booking by ID
  async getBookingById(bookingId) {
    const endpoint = `/booking/${bookingId}`;
    return await this.makeRequest(endpoint);
  }

  // Cancel booking
  async cancelBooking(bookingId) {
    const endpoint = `/booking/${bookingId}/cancel`;
    return await this.makeRequest(endpoint, "POST");
  }
}

// Enhanced search functionality with AJAX
function enhancedSearchBuses(from, to, date, passengers) {
  const api = new BusGoAPI();

  // Show loading
  showLoading(true);

  api
    .searchBuses(from, to, date, passengers)
    .then((response) => {
      if (response.success) {
        displaySearchResults(response.data, from, to, date, passengers);
      } else {
        showAlert("Failed to search buses. Please try again.", "danger");
      }
    })
    .catch((error) => {
      console.error("Search failed:", error);
      showAlert(
        "Search failed. Please check your connection and try again.",
        "danger"
      );
    })
    .finally(() => {
      showLoading(false);
    });
}

// Enhanced booking with AJAX
function enhancedCreateBooking(bookingData) {
  const api = new BusGoAPI();

  // Show loading
  showLoading(true);

  api
    .createBooking(bookingData)
    .then((response) => {
      if (response.success) {
        handleBookingSuccess(response.data);
      } else {
        showAlert(
          response.error || "Booking failed. Please try again.",
          "danger"
        );
      }
    })
    .catch((error) => {
      console.error("Booking failed:", error);
      showAlert(
        "Booking failed. Please check your connection and try again.",
        "danger"
      );
    })
    .finally(() => {
      showLoading(false);
    });
}

// Handle successful booking
function handleBookingSuccess(bookingData) {
  $("#bookingModal").modal("hide");

  const successMessage = `
        <div class="alert alert-success alert-dismissible fade show" role="alert">
            <h4 class="alert-heading"><i class="fas fa-check-circle"></i> Booking Confirmed!</h4>
            <p>Your booking has been confirmed successfully.</p>
            <hr>
            <div class="row">
                <div class="col-md-6">
                    <p class="mb-1"><strong>Booking ID:</strong> ${
                      bookingData.bookingId
                    }</p>
                    <p class="mb-1"><strong>Passenger:</strong> ${
                      bookingData.passenger.firstName
                    } ${bookingData.passenger.lastName}</p>
                    <p class="mb-1"><strong>Bus:</strong> ${
                      bookingData.busName
                    }</p>
                </div>
                <div class="col-md-6">
                    <p class="mb-1"><strong>Route:</strong> ${capitalizeFirst(
                      bookingData.journey.from
                    )} → ${capitalizeFirst(bookingData.journey.to)}</p>
                    <p class="mb-1"><strong>Date:</strong> ${formatDate(
                      bookingData.journey.date
                    )}</p>
                    <p class="mb-1"><strong>Total Amount:</strong> LKR ${bookingData.totalAmount.toLocaleString()}</p>
                </div>
            </div>
            <div class="mt-3">
                <button type="button" class="btn btn-primary btn-sm" onclick="downloadTicket('${
                  bookingData.bookingId
                }')">
                    <i class="fas fa-download"></i> Download Ticket
                </button>
                <button type="button" class="btn btn-outline-primary btn-sm ms-2" onclick="checkBookingStatus('${
                  bookingData.bookingId
                }')">
                    <i class="fas fa-search"></i> Check Status
                </button>
            </div>
            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
        </div>
    `;

  // Insert success message
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

// Check booking status
async function checkBookingStatus(bookingId) {
  const api = new BusGoAPI();

  try {
    const response = await api.getBookingStatus(bookingId);
    if (response.success) {
      showAlert(
        `Booking Status: ${response.data.status.toUpperCase()} - ${
          response.data.message
        }`,
        "info"
      );
    } else {
      showAlert("Could not retrieve booking status.", "warning");
    }
  } catch (error) {
    showAlert("Failed to check booking status.", "danger");
  }
}

// Download ticket (mock function)
function downloadTicket(bookingId) {
  // Create a mock ticket download
  const ticketContent = `
BusGo E-Ticket
================
Booking ID: ${bookingId}
Date: ${new Date().toLocaleDateString()}
Time: ${new Date().toLocaleTimeString()}

Thank you for choosing BusGo!
Visit our website: www.busgo.lk
    `;

  const blob = new Blob([ticketContent], { type: "text/plain" });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `BusGo-Ticket-${bookingId}.txt`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  window.URL.revokeObjectURL(url);

  showAlert("Ticket downloaded successfully!", "success");
}

// Real-time seat availability updates using AJAX
function startRealTimeUpdates() {
  setInterval(async () => {
    await updateSeatAvailabilityAJAX();
  }, 30000); // Update every 30 seconds
}

async function updateSeatAvailabilityAJAX() {
  // Get current search parameters
  const from = $("#fromCity").val();
  const to = $("#toCity").val();
  const date = $("#travelDate").val();
  const passengers = $("#passengers").val();

  if (!from || !to || !date) return;

  try {
    const api = new BusGoAPI();
    const response = await api.searchBuses(from, to, date, passengers);

    if (response.success && response.data.length > 0) {
      // Update seat availability in the UI
      response.data.forEach((bus) => {
        const busCard = $(`.btn-book-now[data-bus-id="${bus.id}"]`).closest(
          ".bus-card"
        );
        const seatsElement = busCard.find(".seats-available");

        if (seatsElement.length > 0) {
          const currentSeats = parseInt(seatsElement.text().match(/\d+/)[0]);
          const newSeats = bus.seatsAvailable;

          if (newSeats !== currentSeats) {
            seatsElement.html(
              `<i class="fas fa-users"></i> ${newSeats} seats available`
            );

            // Update book button if sold out
            if (newSeats === 0) {
              const bookButton = busCard.find(".btn-book-now");
              bookButton
                .prop("disabled", true)
                .text("Sold Out")
                .removeClass("btn-book")
                .addClass("btn-secondary");
            } else if (newSeats <= 3) {
              seatsElement
                .addClass("text-danger")
                .html(
                  `<i class="fas fa-users"></i> Only ${newSeats} seats left!`
                );
            }
          }
        }
      });
    }
  } catch (error) {
    console.error("Failed to update seat availability:", error);
  }
}

// Form auto-completion and validation
function setupFormEnhancements() {
  // Auto-complete for cities
  setupCityAutocomplete();

  // Real-time form validation
  setupRealTimeValidation();

  // Form data persistence
  setupFormPersistence();
}

async function setupCityAutocomplete() {
  try {
    const api = new BusGoAPI();
    const response = await api.getCities();

    if (response.success) {
      const cities = response.data;

      // Clear existing options and add new ones
      $("#fromCity, #toCity")
        .empty()
        .append('<option value="">Select City</option>');

      cities.forEach((city) => {
        $("#fromCity, #toCity").append(
          `<option value="${city.id}">${city.name} (${city.state})</option>`
        );
      });
    }
  } catch (error) {
    console.error("Failed to load cities:", error);
  }
}

function setupRealTimeValidation() {
  // Real-time email validation
  $("#email").on("input", function () {
    const email = $(this).val();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (email && !emailRegex.test(email)) {
      $(this).addClass("is-invalid").removeClass("is-valid");
    } else if (email) {
      $(this).addClass("is-valid").removeClass("is-invalid");
    } else {
      $(this).removeClass("is-invalid is-valid");
    }
  });

  // Real-time phone validation
  $("#phone").on("input", function () {
    const phone = $(this).val();
    const phoneRegex = /^[0-9]{10}$/;

    if (phone && !phoneRegex.test(phone)) {
      $(this).addClass("is-invalid").removeClass("is-valid");
    } else if (phone) {
      $(this).addClass("is-valid").removeClass("is-invalid");
    } else {
      $(this).removeClass("is-invalid is-valid");
    }
  });
}

function setupFormPersistence() {
  // Save form data to localStorage
  $("#searchForm input, #searchForm select").on("change", function () {
    const formData = $("#searchForm").serialize();
    localStorage.setItem("busgo_search_form", formData);
  });

  // Restore form data from localStorage
  const savedData = localStorage.getItem("busgo_search_form");
  if (savedData) {
    const params = new URLSearchParams(savedData);
    params.forEach((value, key) => {
      $(`#${key}`).val(value);
    });
  }
}

// Offline functionality
function setupOfflineSupport() {
  // Check online status
  function updateOnlineStatus() {
    if (navigator.onLine) {
      $(".offline-indicator").hide();
      startRealTimeUpdates();
    } else {
      showOfflineIndicator();
    }
  }

  function showOfflineIndicator() {
    if ($(".offline-indicator").length === 0) {
      $("body").prepend(`
                <div class="alert alert-warning alert-dismissible offline-indicator" role="alert">
                    <i class="fas fa-wifi"></i> You are currently offline. Some features may not be available.
                    <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
                </div>
            `);
    }
  }

  window.addEventListener("online", updateOnlineStatus);
  window.addEventListener("offline", updateOnlineStatus);

  // Initial check
  updateOnlineStatus();
}

// Initialize enhanced features
$(document).ready(function () {
  setupFormEnhancements();
  setupOfflineSupport();

  // Start real-time updates if online
  if (navigator.onLine) {
    setTimeout(startRealTimeUpdates, 5000); // Start after 5 seconds
  }
});

// Enhanced Booking History Functions with AJAX

// Search booking by ID with AJAX
async function enhancedSearchBookingById(bookingId) {
  const api = new BusGoAPI();

  try {
    showLoading(true);
    const response = await api.getBookingById(bookingId);

    if (response.success) {
      return response.data;
    } else {
      throw new Error(response.error || "Booking not found");
    }
  } catch (error) {
    console.error("Enhanced booking search failed:", error);
    throw error;
  } finally {
    showLoading(false);
  }
}

// Load booking history with AJAX
async function enhancedLoadBookingHistory(email) {
  const api = new BusGoAPI();

  try {
    showLoading(true);
    const response = await api.getBookingHistory(email);

    if (response.success) {
      return response.data;
    } else {
      throw new Error(response.error || "Failed to load booking history");
    }
  } catch (error) {
    console.error("Enhanced booking history load failed:", error);
    throw error;
  } finally {
    showLoading(false);
  }
}

// Cancel booking with AJAX
async function enhancedCancelBooking(bookingId) {
  const api = new BusGoAPI();

  try {
    showLoading(true);
    const response = await api.cancelBooking(bookingId);

    if (response.success) {
      showAlert(
        "Booking cancelled successfully. Refund will be processed within 3-5 business days.",
        "success"
      );
      return response.data;
    } else {
      throw new Error(response.error || "Failed to cancel booking");
    }
  } catch (error) {
    console.error("Enhanced booking cancellation failed:", error);
    showAlert("Failed to cancel booking. Please try again.", "danger");
    throw error;
  } finally {
    showLoading(false);
  }
}

// Sync booking history with server
async function syncBookingHistoryWithServer() {
  // This function would sync local booking history with server
  // For demo purposes, we'll just update the UI
  try {
    const localHistory = JSON.parse(
      localStorage.getItem("busgo_booking_history") || "[]"
    );

    // In a real application, this would:
    // 1. Send local bookings to server
    // 2. Get updated bookings from server
    // 3. Merge and resolve conflicts
    // 4. Update local storage

    console.log(
      "Booking history synchronized",
      localHistory.length,
      "bookings"
    );
  } catch (error) {
    console.error("Failed to sync booking history:", error);
  }
}

// Export for global access
window.BusGoAJAX = {
  enhancedSearchBuses,
  enhancedCreateBooking,
  checkBookingStatus,
  downloadTicket,
  enhancedSearchBookingById,
  enhancedLoadBookingHistory,
  enhancedCancelBooking,
  syncBookingHistoryWithServer,
};
