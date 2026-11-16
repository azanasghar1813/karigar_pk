/**
 * KarigarPK Notification & SMS / WhatsApp Roman Urdu Fixed Texts
 */
const NOTIFICATION_TEXTS = {
  CLAIM_INVITE: (businessName) =>
    `Salam! KarigarPK par ${businessName} ka business profile tayyar hai. Apni listing claim karein aur direct customer bookings haasil karein: https://karigarpk.live/claim`,

  OTP_CODE: (otp) =>
    `KarigarPK: Aapka 6-hanso ka OTP verification code ${otp} hai. Ye code aglay 5 minute tak qabil-e-istemal hai. Kisi ke sath share na karein.`,

  CLAIM_RECEIVED: (businessName) =>
    `Claim mil gayi — 24 ghanton mein WhatsApp par jawab milega. ${businessName} ki verification process jaari hai.`,

  CLAIM_APPROVED: (businessName) =>
    `Mubarak ho! Aapka KarigarPK business profile (${businessName}) verified ho gaya hai. Ab aap live bookings qabool kar sakte hain aur verified badge ke sath customers ko nazar aayenge.`,

  CLAIM_REJECTED: (businessName, reason) =>
    `Aapka KarigarPK claim (${businessName}) manzoor nahi ho saka. Wajah: ${reason}. Mazeed maloomat ke liye humare helpline par rabta karein.`,

  CLAIM_CORRECTION: (businessName, field, message) =>
    `Aapke KarigarPK claim (${businessName}) mein tas-heeh ki zaroorat hai. Field: ${field}. Wajah: ${message}. Baraye meherbani portal par ja kar tas-heeh karein.`
};

module.exports = NOTIFICATION_TEXTS;
