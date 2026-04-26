export const TOAST_MESSAGES = {
  SHORTCUT_UPDATED: (shortcutText: string) =>
    chrome.i18n.getMessage("toast_hotkey_updated", shortcutText),
  ERROR: (errorText: string, errorType: string = "") =>
    `${0 < errorType.length ? errorType + " " : ""}Error:\n${errorText}`,
  // load file
  UPLOAD_FILE_CANCEL: chrome.i18n.getMessage("toast_upload_titles_file_cancel"),
  UPLOAD_FILE_SUCCESS: chrome.i18n.getMessage(
    "toast_upload_titles_file_success",
  ),
  UPLOAD_INAPPROPRIATE_FORMAT: chrome.i18n.getMessage(
    "toast_upload_titles_file_inappropriate_format",
  ),
  UPLOAD_VALIDATION_ERROR: chrome.i18n.getMessage(
    "toast_upload_titles_file_validation_error",
  ),
  PERSIST_APPLY_ON: chrome.i18n.getMessage("toast_persist_apply_on"),
  PERSIST_APPLY_OFF: chrome.i18n.getMessage(
    "toast_persist_apply_off_data_remains",
  ),
}
