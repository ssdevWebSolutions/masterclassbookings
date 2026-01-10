/**
 * Format Utilities
 * Single Responsibility: Format data for display
 */

/**
 * Format date to readable string
 * @param {string|Date} date - Date to format
 * @returns {string}
 */
export const formatDate = (date) => {
  if (!date) return "Date TBC";
  return new Date(date).toLocaleDateString("en-GB", { 
    day: "numeric", 
    month: "long", 
    year: "numeric" 
  });
};

/**
 * Format time (remove seconds if present)
 * @param {string} time - Time string
 * @returns {string}
 */
export const formatTime = (time) => {
  if (!time) return "Time TBC";
  if (time.includes(":")) {
    return time.split(":").slice(0, 2).join(":");
  }
  return time;
};

/**
 * Get appointment image URL by index
 * @param {number} index - Index for image selection
 * @returns {string}
 */
export const getAppointmentImage = (index) => {
  const appointmentImages = [
    "https://images.unsplash.com/photo-1517457210948-741597c75e7b?q=80&w=800&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1574629810360-7efbbe195018?q=80&w=800&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?q=80&w=800&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1576678927484-cc907957088c?q=80&w=800&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1571902943202-507ec2618e8f?q=80&w=800&auto=format&fit=crop",
  ];
  return appointmentImages[index % appointmentImages.length];
};

/**
 * Get event image URL by index
 * @param {number} index - Index for image selection
 * @returns {string}
 */
export const getEventImage = (index) => {
  const eventImages = [
    "https://images.unsplash.com/photo-1517457210948-741597c75e7b?q=80&w=800&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1574629810360-7efbbe195018?q=80&w=800&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?q=80&w=800&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1576678927484-cc907957088c?q=80&w=800&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1571902943202-507ec2618e8f?q=80&w=800&auto=format&fit=crop",
  ];
  return eventImages[index % eventImages.length];
};

/**
 * Format term date range
 * @param {Object} term - Term object with startDate and endDate
 * @returns {string}
 */
export const formatTermDateRange = (term) => {
  if (!term || !term.startDate || !term.endDate) return "";
  return `${new Date(term.startDate).toLocaleDateString("en-GB", { day: "numeric", month: "short" })} - ${new Date(term.endDate).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}`;
};

