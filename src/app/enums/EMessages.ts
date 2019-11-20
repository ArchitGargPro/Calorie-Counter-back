enum EMessages {
  PERMISSION_DENIED = 'Permission Denied',
  INVALID_CREDENTIALS = 'Invalid Credentials',
  SIGN_UP_SUCCESSFUL_MESSAGE = 'Sign up Successful',
  INACTIVE_USER_ACCOUNT = 'Your user account is inactive',
  UNVERIFIED_EMAIL = 'Your email is not verified. Verify your email first',
  CONFIRMATION_EMAIL_SEND = 'Confirmation email has been sent',
  EMAIL_NOT_FOUND = 'Could not find email in our database',
  EMAIL_CONFIRMATION_LINK_SENT = 'If email is a valid email, confirmation link will be sent.',
  EMAIL_SUCCESSFULLY_VERIFIED = 'Email is successfully verified',
  EMAIL_ALREADY_VERIFIED = 'Email is already verified',
  EMAIL_TOKEN_EXPIRED_OR_UNVERIFIED = 'Either email is invalid or otp has expired. Request new one',
  PASSWORD_RESET_TOKEN_EXPIRED = 'Password reset token is invalid or expired',
  PASSWORD_RESET_OTP_SENT = 'If the email is valid, you will receive an otp to reset your password shortly.',
  PASSWORD_SUCCESSFULLY_RESET = 'Password was successfully reset',
  PASSWORD_RESET_FAILED = 'Password reset failed',
  RESOURCE_NOT_FOUND = 'Resource not found',
  RESOURCE_FOUND = 'Resource found',
  UNAUTHORIZED_ACCESS = 'Unauthorized access',
  UNAUTHORIZED_REQUEST = 'Unauthorized access',
  INVALID_AUTHENTICATION_TOKEN = 'Invalid authentication token',

}
export default EMessages;
