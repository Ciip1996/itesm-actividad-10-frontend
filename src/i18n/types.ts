// Tipos para las traducciones
export type Language = "es" | "en";

export interface Translations {
  // Navbar
  navbar: {
    brand: string;
    home: string;
    myReservations: string;
    newReservation: string;
    login: string;
    register: string;
    logout: string;
    role: string;
  };

  // Home
  home: {
    title: string;
    subtitle: string;
    newReservation: string;
    login: string;
    register: string;
    whyReserve: string;
    feature1Title: string;
    feature1Description: string;
    feature2Title: string;
    feature2Description: string;
    feature3Title: string;
    feature3Description: string;
    ctaTitle: string;
    ctaDescription: string;
    makeReservation: string;
    startNow: string;
  };

  // Login
  login: {
    title: string;
    subtitle: string;
    email: string;
    password: string;
    submit: string;
    noAccount: string;
    registerHere: string;
  };

  // Register
  register: {
    title: string;
    subtitle: string;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    phonePlaceholder: string;
    password: string;
    passwordPlaceholder: string;
    confirmPassword: string;
    passwordMismatch: string;
    submit: string;
    hasAccount: string;
    loginLink: string;
    haveAccount: string;
    loginHere: string;
  };

  // Reservations
  reservations: {
    title: string;
    empty: string;
    loading: string;
    status: {
      pending: string;
      confirmed: string;
      cancelled: string;
    };
    date: string;
    time: string;
    guests: string;
    folio: string;
    viewDetails: string;
    cancelButton: string;
    confirmCancel: string;
    cancelError: string;
  };

  // New Reservation
  newReservation: {
    title: string;
    step1Title: string;
    step2Title: string;
    date: string;
    guests: string;
    selectDate: string;
    selectGuests: string;
    checkAvailability: string;
    back: string;
    timeSlot: string;
    selectTime: string;
    fullName: string;
    email: string;
    phone: string;
    specialNotes: string;
    notesPlaceholder: string;
    confirm: string;
    successMessage: string;
    availableSlots: string;
    noAvailability: string;
    guestInfo: string;
    name: string;
    notes: string;
    submit: string;
    success: string;
    error: string;
    loading: string;
  };

  // User Menu
  userMenu: {
    role: string;
    logout: string;
  };

  // Common
  common: {
    loading: string;
    error: string;
    success: string;
    cancel: string;
    confirm: string;
    save: string;
    close: string;
  };

  // Errors
  errors: {
    required: string;
    invalidEmail: string;
    passwordMismatch: string;
    minLength: string;
    maxLength: string;
    invalidCredentials: string;
    reservationNotFound: string;
    timeSlotNotAvailable: string;
    userAlreadyRegistered: string;
    emailAlreadyExists: string;
    networkError: string;
    passwordMinLength: string;
    unexpected: string;
  };
}
