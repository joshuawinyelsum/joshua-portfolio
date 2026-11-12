import http from 'http';
import contactHandler, { validateContactPayload } from '../api/contact';

// Minimal mock request & response helpers
function createMockReqRes(options: {
  method?: string;
  url?: string;
  headers?: Record<string, string>;
  body?: any;
}) {
  const req: any = new http.IncomingMessage({} as any);
  req.method = options.method || 'POST';
  req.url = options.url || '/api/contact';
  req.headers = options.headers || {
    'content-type': 'application/json',
    'x-forwarded-for': `192.168.1.${Math.floor(Math.random() * 200) + 10}`,
  };
  req.body = options.body;

  let statusCode = 200;
  const headers: Record<string, string> = {};
  let responseData = '';

  const res: any = {
    statusCode: 200,
    setHeader(name: string, value: string) {
      headers[name.toLowerCase()] = value;
    },
    getHeader(name: string) {
      return headers[name.toLowerCase()];
    },
    status(code: number) {
      statusCode = code;
      this.statusCode = code;
      return this;
    },
    json(data: any) {
      responseData = JSON.stringify(data);
      return this;
    },
    end(chunk?: any) {
      if (chunk) responseData += chunk;
    },
    _getData() {
      try {
        return JSON.parse(responseData);
      } catch {
        return responseData;
      }
    },
    _getStatus() {
      return statusCode || this.statusCode;
    },
  };

  return { req, res };
}

let passedTests = 0;
let totalTests = 0;

function assert(condition: boolean, testName: string, detail?: string) {
  totalTests++;
  if (condition) {
    console.log(`  [PASS] ${testName}`);
    passedTests++;
  } else {
    console.error(`  [FAIL] ${testName}${detail ? ` - ${detail}` : ''}`);
    process.exitCode = 1;
  }
}

async function runTests() {
  console.log('=== RUNNING CONTACT API & SECURITY VERIFICATION SUITE ===\n');

  // 1. Validation Logic Unit Tests
  console.log('--- 1. Server-Side Input Validation Tests ---');
  
  const validPayload = {
    name: 'Ada Lovelace',
    email: 'ada@example.com',
    subject: 'Algorithm Inquiry',
    message: 'Hello Joshua, I would like to discuss systems engineering and data structures.',
  };
  const validRes = validateContactPayload(validPayload);
  assert(validRes.isValid === true, 'Valid payload passes validation cleanly');
  assert(validRes.sanitized.name === 'Ada Lovelace', 'Name is trimmed correctly');
  assert(validRes.sanitized.email === 'ada@example.com', 'Email is sanitized');
  assert(validRes.sanitized.subject === 'Algorithm Inquiry', 'Subject is preserved');

  const emptyRes = validateContactPayload({});
  assert(emptyRes.isValid === false, 'Empty payload fails validation');
  assert(Boolean(emptyRes.errors.name), 'Missing name produces error');
  assert(Boolean(emptyRes.errors.email), 'Missing email produces error');
  assert(Boolean(emptyRes.errors.message), 'Missing message produces error');

  const invalidEmailRes = validateContactPayload({
    name: 'Grace Hopper',
    email: 'not-an-email@',
    message: 'Valid message length here.',
  });
  assert(invalidEmailRes.isValid === false, 'Malformed email is rejected');
  assert(Boolean(invalidEmailRes.errors.email), 'Invalid email error reported');

  const shortMsgRes = validateContactPayload({
    name: 'Alan Turing',
    email: 'alan@bletchley.uk',
    message: 'Hi',
  });
  assert(shortMsgRes.isValid === false, 'Message below 5 characters is rejected');

  const longMsg = 'A'.repeat(5001);
  const longMsgRes = validateContactPayload({
    name: 'Alan Turing',
    email: 'alan@bletchley.uk',
    message: longMsg,
  });
  assert(longMsgRes.isValid === false, 'Oversized message (> 5000 chars) is rejected');

  // 2. HTTP Method Guard
  console.log('\n--- 2. HTTP Protocol & Method Guard Tests ---');
  const { req: getReq, res: getRes } = createMockReqRes({ method: 'GET' });
  await contactHandler(getReq, getRes);
  assert(getRes._getStatus() === 405, 'Rejects GET request with 405 Method Not Allowed');

  const { req: putReq, res: putRes } = createMockReqRes({ method: 'PUT' });
  await contactHandler(putReq, putRes);
  assert(putRes._getStatus() === 405, 'Rejects PUT request with 405 Method Not Allowed');

  // 3. Spam Honeypot Detection
  console.log('\n--- 3. Spam Bot Honeypot Protection Tests ---');
  const { req: botReq, res: botRes } = createMockReqRes({
    body: {
      ...validPayload,
      website: 'http://spam-promoter.com', // Honeypot trap
    },
  });
  await contactHandler(botReq, botRes);
  assert(botRes._getStatus() === 400, 'Rejects bot submission with filled honeypot');
  assert(botRes._getData().error === 'Automated submission rejected.', 'Correctly labels bot submission');

  // 4. Rate Limiting Tests
  console.log('\n--- 4. Client IP Rate Limiting Tests ---');
  const testIp = '10.0.0.99';
  let blocked = false;
  for (let i = 0; i < 7; i++) {
    const { req, res } = createMockReqRes({
      headers: { 'content-type': 'application/json', 'x-forwarded-for': testIp },
      body: validPayload,
    });
    await contactHandler(req, res);
    if (res._getStatus() === 429) {
      blocked = true;
      assert(Boolean(res.getHeader('retry-after')), 'Rate limit response includes Retry-After header');
      break;
    }
  }
  assert(blocked === true, 'Rate limiter throttles excessive requests (> 5 per window)');

  // 5. Missing API Key Verification (Safe Degradation, Never Pretends Success)
  console.log('\n--- 5. Email Service Configuration Guard Tests ---');
  const originalKey = process.env.RESEND_API_KEY;
  delete process.env.RESEND_API_KEY;

  const { req: missingKeyReq, res: missingKeyRes } = createMockReqRes({
    headers: { 'content-type': 'application/json', 'x-forwarded-for': '10.0.0.101' },
    body: validPayload,
  });
  await contactHandler(missingKeyReq, missingKeyRes);
  assert(
    missingKeyRes._getStatus() === 503,
    'Returns 503 Service Unavailable when RESEND_API_KEY is missing'
  );
  assert(
    missingKeyRes._getData().code === 'MISSING_API_KEY',
    'Explicitly reports missing API key instead of falsely claiming delivery'
  );

  // 6. Mock Provider Delivery Test
  console.log('\n--- 6. Mock Email Delivery & Reply-To Verification ---');
  process.env.RESEND_API_KEY = 're_test_dummy_key_12345';
  
  // Intercept global fetch for Resend verification
  const originalFetch = global.fetch;
  let interceptedPayload: any = null;

  global.fetch = async (url: any, init: any) => {
    if (String(url).includes('api.resend.com/emails')) {
      interceptedPayload = JSON.parse(init.body);
      return new Response(JSON.stringify({ id: 'resend_msg_test_abc123' }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    }
    return originalFetch(url, init);
  };

  try {
    const { req: deliveryReq, res: deliveryRes } = createMockReqRes({
      headers: { 'content-type': 'application/json', 'x-forwarded-for': '10.0.0.102' },
      body: validPayload,
    });
    await contactHandler(deliveryReq, deliveryRes);
    
    assert(deliveryRes._getStatus() === 200, 'Returns 200 OK on successful provider dispatch');
    assert(
      deliveryRes._getData().message ===
        "Message sent successfully. Thank you for reaching out. I'll get back to you soon.",
      'Returns the required exact confirmation message'
    );
    assert(interceptedPayload !== null, 'Resend API was called with payload');
    assert(interceptedPayload?.reply_to === validPayload.email, 'Reply-To is set to the visitor’s email address');
    assert(interceptedPayload?.to[0] === 'akumjoshuawin@gmail.com', 'Delivers to Joshua’s configured email');
    assert(interceptedPayload?.subject.includes(validPayload.subject), 'Subject is correctly passed');
    assert(interceptedPayload?.html.includes(validPayload.message), 'Message body is embedded in HTML');
  } finally {
    global.fetch = originalFetch;
    if (originalKey) process.env.RESEND_API_KEY = originalKey;
    else delete process.env.RESEND_API_KEY;
  }

  console.log(`\n=== RESULTS: ${passedTests}/${totalTests} TESTS PASSED ===\n`);
  if (passedTests === totalTests) {
    console.log('All contact form API, security, rate-limiting, and validation criteria met.');
  } else {
    process.exit(1);
  }
}

runTests().catch((err) => {
  console.error('Test execution error:', err);
  process.exit(1);
});
