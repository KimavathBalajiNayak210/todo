const REG_URL = 'http://localhost:5000/api/auth/register';
const LOGIN_URL = 'http://localhost:5000/api/auth/login';
const ME_URL = 'http://localhost:5000/api/auth/me';

const testAuth = async () => {
    try {
        const user = {
            name: 'Test User',
            email: `test${Date.now()}@example.com`,
            password: 'password123'
        };

        console.log('1. Testing Register...');
        const regRes = await fetch(REG_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(user)
        });
        const regData = await regRes.json();
        console.log('Register Response:', regRes.status, regData);

        console.log('\n2. Testing Login...');
        const loginRes = await fetch(LOGIN_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: user.email, password: user.password })
        });
        const loginData = await loginRes.json();
        console.log('Login Response:', loginRes.status, loginData.token ? 'Token Received' : 'No Token');

        if (loginData.token) {
            console.log('\n3. Testing Get Me (Protected)...');
            const meRes = await fetch(ME_URL, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${loginData.token}`
                }
            });
            const meData = await meRes.json();
            console.log('Me Response:', meRes.status, meData);
        }

    } catch (error) {
        console.error('Test Failed:', error);
    }
};

testAuth();
