// Simulate what happens when user clicks "Request Live Help"
const testNotification = async () => {
  const testMessages = [
    { role: 'user', content: 'Hi, I need help with my website' },
    { role: 'assistant', content: 'I\'d be happy to help! What kind of website are you looking for?' },
    { role: 'user', content: 'An e-commerce site for my business' }
  ];

  const response = await fetch('http://localhost:3000/api/notify', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      type: 'live_support_request',
      messages: testMessages,
      userRequest: 'User requested live support'
    }),
  });

  const data = await response.json();
  console.log('Response:', JSON.stringify(data, null, 2));
};

testNotification().catch(console.error);
