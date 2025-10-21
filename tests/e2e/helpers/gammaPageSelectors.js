/**
 * Gamma.app Page Selectors
 *
 * Centralized repository of all CSS selectors and text locators for Gamma.app
 *
 * IMPORTANT: This file should be updated when Gamma.app UI changes
 * Version: 1.0.0 (Last updated: 2025-10-21)
 *
 * Selector Strategy:
 * - Primary: data-testid attributes (most stable)
 * - Fallback 1: CSS class selectors (moderate stability)
 * - Fallback 2: Text-based selectors (least stable)
 * - Fallback 3: XPath (last resort)
 */

/**
 * Authentication & Login Selectors
 */
const AUTH_SELECTORS = {
  // Login page
  loginButton: 'button:has-text("Log in"), a:has-text("Sign in")',
  emailInput: 'input[type="email"], input[name="email"], input[placeholder*="email" i]',
  passwordInput: 'input[type="password"], input[name="password"]',
  submitButton: 'button[type="submit"], button:has-text("Continue"), button:has-text("Log in")',

  // Google OAuth (if used)
  googleLoginButton: 'button:has-text("Continue with Google")',

  // Session verification
  userAvatar: '[data-testid="user-avatar"], .user-avatar, .profile-icon',
  userMenu: '[data-testid="user-menu"], .user-menu',

  // Logout
  logoutButton: 'button:has-text("Log out"), a:has-text("Sign out")',

  // Error messages
  loginError: '.error-message, .auth-error, [role="alert"]',
};

/**
 * Homepage & Navigation Selectors
 */
const NAVIGATION_SELECTORS = {
  // Main navigation
  homeLink: 'a[href="/"], a:has-text("Home")',
  dashboardLink: 'a:has-text("Dashboard"), a[href*="dashboard"]',

  // Create new content
  newButton: 'button:has-text("New"), button:has-text("Create"), [data-testid="new-button"]',
  createDropdown: '[data-testid="create-dropdown"], .create-menu',

  // Presentation options
  presentationOption: 'button:has-text("Presentation"), a:has-text("Presentation")',
  blankPresentationOption: 'text=Blank presentation, text=Start from scratch',

  // Loading states
  loadingSpinner: '.spinner, .loading, [data-testid="loading"]',

  // Modals
  modalContainer: '.modal, [role="dialog"], [data-testid="modal"]',
  modalCloseButton: 'button[aria-label="Close"], .modal-close',
};

/**
 * Presentation Editor Selectors
 */
const EDITOR_SELECTORS = {
  // Main editor
  editorContainer: '[data-testid="editor"], .editor-container, .presentation-editor',

  // Slides
  slideCanvas: '[data-testid="slide-canvas"], .slide-canvas, .active-slide',
  slideList: '[data-testid="slide-list"], .slides-panel, .slide-thumbnails',
  slideThumbnail: '[data-testid="slide-thumbnail"], .slide-thumb',
  activeSlide: '[data-testid="active-slide"], .slide.active, .selected-slide',

  // Content editing
  contentEditable: '[contenteditable="true"]',
  titleEditor: '[contenteditable="true"]:first, [data-testid="title-editor"]',
  bodyEditor: '[contenteditable="true"]:last, [data-testid="body-editor"]',
  textbox: '.textbox, [data-testid="textbox"]',

  // Slide manipulation
  addSlideButton: 'button:has-text("Add slide"), button:has-text("New slide"), [data-testid="add-slide"]',
  deleteSlideButton: 'button:has-text("Delete"), button[aria-label="Delete slide"]',
  duplicateSlideButton: 'button:has-text("Duplicate")',

  // Slide navigation
  nextSlideButton: 'button[aria-label="Next slide"], .next-slide',
  previousSlideButton: 'button[aria-label="Previous slide"], .previous-slide',

  // Toolbar
  toolbar: '[data-testid="toolbar"], .editor-toolbar, .formatting-toolbar',
  boldButton: 'button[aria-label="Bold"], button:has-text("B")',
  italicButton: 'button[aria-label="Italic"], button:has-text("I")',
  underlineButton: 'button[aria-label="Underline"], button:has-text("U")',
};

/**
 * Theme & Styling Selectors
 */
const THEME_SELECTORS = {
  // Theme panel
  themeButton: 'button:has-text("Theme"), button:has-text("Design"), [data-testid="theme-button"]',
  themePanel: '[data-testid="theme-panel"], .theme-selector, .design-panel',

  // Theme options
  themeOption: '[data-testid="theme-option"], .theme-card',
  themePreview: '.theme-preview',

  // Specific themes
  professionalTheme: 'button:has-text("Professional"), [data-theme="professional"]',
  modernTheme: 'button:has-text("Modern"), [data-theme="modern"]',
  minimalistTheme: 'button:has-text("Minimalist"), [data-theme="minimalist"]',

  // Apply theme
  applyThemeButton: 'button:has-text("Apply"), button:has-text("Use theme")',

  // Color picker
  colorPicker: '[data-testid="color-picker"], .color-picker',
  colorOption: '.color-option, [data-testid="color-option"]',
};

/**
 * Export & Share Selectors
 */
const EXPORT_SELECTORS = {
  // Export menu
  exportButton: 'button:has-text("Export"), button:has-text("Download"), [data-testid="export-button"]',
  shareButton: 'button:has-text("Share"), [data-testid="share-button"]',

  // Export dropdown
  exportDropdown: '[data-testid="export-dropdown"], .export-menu',

  // Export formats
  pdfOption: 'button:has-text("PDF"), a:has-text("Export as PDF")',
  pngOption: 'button:has-text("PNG"), a:has-text("Export as PNG")',
  pptxOption: 'button:has-text("PowerPoint"), a:has-text("Export as PPTX")',

  // Export settings
  exportSettingsModal: '[data-testid="export-settings"], .export-modal',
  exportQualitySelect: 'select[name="quality"], [data-testid="quality-select"]',
  exportFormatSelect: 'select[name="format"], [data-testid="format-select"]',

  // Download
  downloadButton: 'button:has-text("Download"), button:has-text("Export now")',
  downloadProgress: '[data-testid="download-progress"], .download-progress',
  downloadComplete: 'text=Download complete, .download-success',
};

/**
 * Presentation Management Selectors
 */
const MANAGEMENT_SELECTORS = {
  // Presentation list
  presentationList: '[data-testid="presentation-list"], .presentations-grid',
  presentationCard: '[data-testid="presentation-card"], .presentation-item',
  presentationTitle: '[data-testid="presentation-title"], .presentation-name',

  // Presentation actions
  presentationMenu: '[data-testid="presentation-menu"], .action-menu',
  moreOptionsButton: 'button[aria-label="More options"], button:has-text("⋮")',

  // Delete presentation
  deleteButton: 'button:has-text("Delete"), button:has-text("Remove")',
  confirmDeleteButton: 'button:has-text("Delete permanently"), button:has-text("Confirm")',

  // Rename presentation
  renameButton: 'button:has-text("Rename")',
  titleInput: 'input[placeholder*="title" i], input[name="title"]',
  saveButton: 'button:has-text("Save"), button[type="submit"]',
};

/**
 * Notifications & Alerts Selectors
 */
const NOTIFICATION_SELECTORS = {
  // Toast notifications
  toast: '[data-testid="toast"], .notification, .toast',
  toastSuccess: '.toast-success, [data-type="success"]',
  toastError: '.toast-error, [data-type="error"]',
  toastWarning: '.toast-warning, [data-type="warning"]',

  // Alerts
  alert: '[role="alert"], .alert',
  alertClose: 'button[aria-label="Close alert"], .alert-close',

  // Confirmation dialogs
  confirmDialog: '[role="alertdialog"], .confirm-dialog',
  confirmButton: 'button:has-text("Confirm"), button:has-text("Yes")',
  cancelButton: 'button:has-text("Cancel"), button:has-text("No")',
};

/**
 * Loading & State Indicators
 */
const STATE_SELECTORS = {
  // Loading states
  pageLoader: '.page-loader, [data-testid="page-loader"]',
  contentLoader: '.content-loader, .skeleton',

  // Saving states
  savingIndicator: 'text=Saving..., [data-testid="saving"]',
  savedIndicator: 'text=Saved, [data-testid="saved"]',

  // Error states
  errorBoundary: '[data-testid="error-boundary"], .error-page',
  errorMessage: '.error-message, [role="alert"]',

  // Empty states
  emptyState: '.empty-state, [data-testid="empty-state"]',
};

/**
 * Keyboard Shortcuts
 */
const KEYBOARD_SHORTCUTS = {
  // Slide navigation
  nextSlide: 'ArrowDown',
  previousSlide: 'ArrowUp',

  // Editing
  newSlide: 'Enter',
  undo: 'Control+Z',
  redo: 'Control+Y',

  // Formatting
  bold: 'Control+B',
  italic: 'Control+I',
  underline: 'Control+U',

  // Save
  save: 'Control+S',

  // Navigation
  escape: 'Escape',
  tab: 'Tab',
};

/**
 * Timeout Configuration
 */
const TIMEOUTS = {
  // Short timeouts (fast operations)
  fast: 2000,          // 2 seconds - button clicks, simple navigation

  // Medium timeouts (network operations)
  medium: 5000,        // 5 seconds - page loads, API calls

  // Long timeouts (complex operations)
  long: 10000,         // 10 seconds - presentation creation, theme application

  // Very long timeouts (file operations)
  veryLong: 30000,     // 30 seconds - exports, downloads

  // Network operations
  navigation: 30000,   // 30 seconds - page navigation with networkidle

  // Authentication
  login: 15000,        // 15 seconds - login flow
};

/**
 * Helper function to get selector with fallbacks
 * @param {string[]} selectors - Array of selectors to try in order
 * @returns {string} - Comma-separated selector string
 */
function getSelectorWithFallbacks(...selectors) {
  return selectors.filter(Boolean).join(', ');
}

/**
 * Wait for element with retry logic
 * @param {Page} page - Playwright page object
 * @param {string} selector - Selector to wait for
 * @param {number} timeout - Timeout in milliseconds
 * @param {number} retries - Number of retries
 * @returns {Promise<ElementHandle>}
 */
async function waitForSelectorWithRetry(page, selector, timeout = TIMEOUTS.medium, retries = 3) {
  for (let i = 0; i < retries; i++) {
    try {
      return await page.waitForSelector(selector, { timeout, state: 'visible' });
    } catch (error) {
      if (i === retries - 1) throw error;
      await page.waitForTimeout(1000);
    }
  }
}

module.exports = {
  AUTH_SELECTORS,
  NAVIGATION_SELECTORS,
  EDITOR_SELECTORS,
  THEME_SELECTORS,
  EXPORT_SELECTORS,
  MANAGEMENT_SELECTORS,
  NOTIFICATION_SELECTORS,
  STATE_SELECTORS,
  KEYBOARD_SHORTCUTS,
  TIMEOUTS,
  getSelectorWithFallbacks,
  waitForSelectorWithRetry,
};
