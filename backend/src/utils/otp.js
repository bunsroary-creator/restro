// Generate 6-digit OTP
export const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// Send OTP via SMS (mock implementation)
export const sendOTPSMS = async (phone, otp) => {
  // In a real implementation, integrate with SMS providers like Twilio, AWS SNS, etc.
  console.log(`📱 SMS OTP sent to ${phone}: ${otp}`);
  
  // Mock successful response
  return Promise.resolve({
    success: true,
    message: 'OTP sent successfully'
  });
};