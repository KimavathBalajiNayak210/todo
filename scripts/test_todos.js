const REG_URL = 'http://localhost:5000/api/auth/register';
const LOGIN_URL = 'http://localhost:5000/api/auth/login';
const TODO_URL = 'http://localhost:5000/api/todos';

const testTodos = async () => {
    try {
        // 1. Create 2 Users
        console.log('1. Creating Users...');
        const user1 = { name: 'User A', email: `userA${Date.now()}@test.com`, password: '123' };
        const user2 = { name: 'User B', email: `userB${Date.now()}@test.com`, password: '123' };

        const reg1 = await fetch(REG_URL, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(user1) }).then(r => r.json());
        const reg2 = await fetch(REG_URL, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(user2) }).then(r => r.json());

        const token1 = reg1.token;
        const token2 = reg2.token;
        console.log('User A Token:', !!token1);
        console.log('User B Token:', !!token2);

        // 2. User A creates Todo
        console.log('\n2. User A creates Todo...');
        const todoRes = await fetch(TODO_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token1}` },
            body: JSON.stringify({ title: 'User A Task', priority: 'high' })
        });
        const todoData = await todoRes.json();
        console.log('Create Response:', todoRes.status, todoData);
        const todoId = todoData.id;

        // 3. User A reads Todos
        console.log('\n3. User A reads Todos...');
        const listRes1 = await fetch(TODO_URL, {
            headers: { 'Authorization': `Bearer ${token1}` }
        });
        const list1 = await listRes1.json();
        console.log('User A Todos Count:', list1.length);

        // 4. User B tries to read Todos (Should see 0 or own)
        console.log('\n4. User B reads Todos...');
        const listRes2 = await fetch(TODO_URL, {
            headers: { 'Authorization': `Bearer ${token2}` }
        });
        const list2 = await listRes2.json();
        console.log('User B Todos Count:', list2.length);

        // 5. User B tries to update User A's Todo (Should fail)
        console.log(`\n5. User B tries to update Todo ${todoId}...`);
        const updateRes = await fetch(`${TODO_URL}/${todoId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token2}` },
            body: JSON.stringify({ title: 'Hacked Title' })
        });
        console.log('Update Response (Expect 404):', updateRes.status);

        // 6. User A deletes Todo
        console.log('\n6. User A deletes Todo...');
        const delRes = await fetch(`${TODO_URL}/${todoId}`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${token1}` }
        });
        console.log('Delete Response:', delRes.status);

    } catch (error) {
        console.error('Test Failed:', error);
    }
};

testTodos();
