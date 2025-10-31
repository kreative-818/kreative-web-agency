const fetch = require('node-fetch');

async function testOpenPhone() {
  const apiKey = 'GhCZcv8ESqkPdB7QMpoZzp9Asa0PL101';
  const phoneNumber = '+19844009443';

  console.log('Testing OpenPhone API...\n');

  try {
    // Test 1: Fetch phone numbers
    console.log('1. Fetching phone numbers...');
    const numbersResponse = await fetch('https://api.openphone.com/v1/phone-numbers', {
      method: 'GET',
      headers: {
        'Authorization': apiKey,
        'Content-Type': 'application/json'
      }
    });

    console.log('Status:', numbersResponse.status);
    const numbersData = await numbersResponse.json();
    console.log('Response:', JSON.stringify(numbersData, null, 2));

    if (numbersData.data && numbersData.data.length > 0) {
      const fromPhoneNumberId = numbersData.data[0].id;
      console.log('\n2. Sending test SMS...');
      console.log('From ID:', fromPhoneNumberId);
      console.log('To:', phoneNumber);

      const messageResponse = await fetch('https://api.openphone.com/v1/messages', {
        method: 'POST',
        headers: {
          'Authorization': apiKey,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          from: fromPhoneNumberId,
          to: [phoneNumber],
          content: '🧪 Test message from Kreative Web Agency chatbot!'
        })
      });

      console.log('Message Status:', messageResponse.status);
      const messageData = await messageResponse.json();
      console.log('Message Response:', JSON.stringify(messageData, null, 2));
    }
  } catch (error) {
    console.error('Error:', error.message);
  }
}

testOpenPhone();
