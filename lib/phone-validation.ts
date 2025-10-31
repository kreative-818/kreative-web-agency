
// Phone validation and carrier detection

export type PhoneValidationResult = {
  valid: boolean;
  phoneType: 'MOBILE' | 'LANDLINE' | 'VOIP' | 'UNKNOWN';
  carrier: string | null;
  formatted: string;
  canReceiveSMS: boolean;
};

export async function validatePhone(phone: string): Promise<PhoneValidationResult> {
  // Remove all non-digit characters
  const cleanPhone = phone.replace(/\D/g, '');
  
  // Basic US phone validation (10 digits)
  if (cleanPhone.length !== 10) {
    return {
      valid: false,
      phoneType: 'UNKNOWN',
      carrier: null,
      formatted: phone,
      canReceiveSMS: false
    };
  }

  // Format as (XXX) XXX-XXXX
  const formatted = `(${cleanPhone.slice(0, 3)}) ${cleanPhone.slice(3, 6)}-${cleanPhone.slice(6)}`;

  // Use NumVerify API for validation (free tier available)
  // Alternative: AbstractAPI, Twilio Lookup, etc.
  const apiKey = process.env.NUMVERIFY_API_KEY || process.env.PHONE_VALIDATION_API_KEY;
  
  if (!apiKey) {
    // Fallback: Basic validation without carrier detection
    // Assume mobile if in common mobile prefixes
    const areaCode = cleanPhone.slice(0, 3);
    const mobileAreaCodes = ['917', '646', '347', '929', '718', '212']; // Common mobile codes
    
    return {
      valid: true,
      phoneType: mobileAreaCodes.includes(areaCode) ? 'MOBILE' : 'UNKNOWN',
      carrier: null,
      formatted,
      canReceiveSMS: true // Assume true when we can't verify
    };
  }

  try {
    // NumVerify API call
    const response = await fetch(
      `http://apilayer.net/api/validate?access_key=${apiKey}&number=1${cleanPhone}&country_code=US&format=1`
    );
    
    const data = await response.json();
    
    if (!data.valid) {
      return {
        valid: false,
        phoneType: 'UNKNOWN',
        carrier: null,
        formatted,
        canReceiveSMS: false
      };
    }

    const phoneType = determinePhoneType(data.line_type);
    
    return {
      valid: true,
      phoneType,
      carrier: data.carrier || null,
      formatted,
      canReceiveSMS: phoneType === 'MOBILE' || phoneType === 'VOIP'
    };
  } catch (error) {
    console.error('Phone validation error:', error);
    
    // Fallback on error
    return {
      valid: true,
      phoneType: 'UNKNOWN',
      carrier: null,
      formatted,
      canReceiveSMS: true
    };
  }
}

function determinePhoneType(lineType: string | undefined): 'MOBILE' | 'LANDLINE' | 'VOIP' | 'UNKNOWN' {
  if (!lineType) return 'UNKNOWN';
  
  const type = lineType.toLowerCase();
  
  if (type.includes('mobile') || type.includes('wireless') || type.includes('cell')) {
    return 'MOBILE';
  }
  if (type.includes('landline') || type.includes('fixed')) {
    return 'LANDLINE';
  }
  if (type.includes('voip') || type.includes('virtual')) {
    return 'VOIP';
  }
  
  return 'UNKNOWN';
}
