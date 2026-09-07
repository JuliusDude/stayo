const http = require('http');

async function request(method, path, data = null, token = null) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'localhost',
      port: 5000,
      path: path,
      method: method,
      headers: {
        'Content-Type': 'application/json'
      }
    };

    if (token) {
      options.headers['Authorization'] = `Bearer ${token}`;
    }

    if (data) {
      const payload = JSON.stringify(data);
      options.headers['Content-Length'] = Buffer.byteLength(payload);
    }

    const req = http.request(options, (res) => {
      let body = '';
      res.on('data', chunk => body += chunk.toString());
      res.on('end', () => {
        try {
          resolve({ status: res.statusCode, data: JSON.parse(body) });
        } catch (e) {
          resolve({ status: res.statusCode, data: body });
        }
      });
    });

    req.on('error', reject);

    if (data) {
      req.write(JSON.stringify(data));
    }
    req.end();
  });
}

async function runTests() {
  console.log('--- STARTING API TESTS ---');
  let adminToken = '';
  let hotelId = '';
  let roomTypeId = '';
  let roomId = '';

  // 1. Register an Admin
  console.log('\\n1. Registering an Admin User...');
  const randomNum = Math.floor(Math.random() * 10000);
  const adminEmail = `admin${randomNum}@stayo.test`;
  const registerRes = await request('POST', '/api/auth/register', {
    name: 'Admin User',
    email: adminEmail,
    password: 'password123',
    role: 'admin'
  });
  console.log(`Status: ${registerRes.status}`, registerRes.data);

  // 2. Login
  console.log('\\n2. Logging in...');
  const loginRes = await request('POST', '/api/auth/login', {
    email: adminEmail,
    password: 'password123'
  });
  console.log(`Status: ${loginRes.status}`, loginRes.data);
  if (loginRes.data.token) {
    adminToken = loginRes.data.token;
  }

  // 3. Create Hotel
  console.log('\\n3. Creating Hotel (Admin)...');
  const hotelRes = await request('POST', '/api/hotels', {
    name: 'Grand Test Hotel',
    city: 'New York',
    amenities: ['Pool', 'WiFi']
  }, adminToken);
  console.log(`Status: ${hotelRes.status}`, hotelRes.data);
  if (hotelRes.data.success) {
    hotelId = hotelRes.data.data._id;
  }

  // 4. Create Room Type
  console.log('\\n4. Creating Room Type...');
  const roomTypeRes = await request('POST', '/api/room-types', {
    hotelId: hotelId,
    name: 'Deluxe Suite',
    basePrice: 250,
    totalRooms: 10,
    capacity: 2
  }, adminToken);
  console.log(`Status: ${roomTypeRes.status}`, roomTypeRes.data);
  if (roomTypeRes.data.success) {
    roomTypeId = roomTypeRes.data.data._id;
  }

  // 5. Create Room
  console.log('\\n5. Creating Room...');
  const roomRes = await request('POST', '/api/rooms', {
    roomTypeId: roomTypeId,
    roomNumber: '101'
  }, adminToken);
  console.log(`Status: ${roomRes.status}`, roomRes.data);
  if (roomRes.data.success) {
    roomId = roomRes.data.data._id;
  }

  // 6. Search Availability
  console.log('\\n6. Searching Availability...');
  // Using dates for next week
  const nextWeek = new Date();
  nextWeek.setDate(nextWeek.getDate() + 7);
  const nextWeekPlusOne = new Date();
  nextWeekPlusOne.setDate(nextWeekPlusOne.getDate() + 8);
  
  const searchPath = `/api/hotels/search?hotelId=${hotelId}&checkInDate=${nextWeek.toISOString()}&checkOutDate=${nextWeekPlusOne.toISOString()}&guests=2`;
  const searchRes = await request('GET', searchPath);
  console.log(`Status: ${searchRes.status}`, JSON.stringify(searchRes.data, null, 2));

  console.log('\\n--- TESTS FINISHED ---');
}

runTests().catch(console.error);
