import React from 'react';

const CustomerList = () => {
    const customers = [
        { name: 'John', phone: '1234567890', address: 'New York', email: 'john@example.com' },
        { name: 'Alice', phone: '9876543210', address: 'Los Angeles', email: 'alice@example.com' },
        { name: 'Bob', phone: '5551234567', address: 'Chicago', email: 'bob@example.com' },
        { name: 'Emily', phone: '7890123456', address: 'San Francisco', email: 'emily@example.com' },
        { name: 'Michael', phone: '3216549870', address: 'Miami', email: 'michael@example.com' },
        { name: 'Sophia', phone: '4445556666', address: 'Seattle', email: 'sophia@example.com' },
        { name: 'William', phone: '7778889999', address: 'Boston', email: 'william@example.com' },
        { name: 'Olivia', phone: '1112223333', address: 'Austin', email: 'olivia@example.com' },
        { name: 'James', phone: '3334445555', address: 'Denver', email: 'james@example.com' },
        { name: 'Ava', phone: '6667778888', address: 'Philadelphia', email: 'ava@example.com' },
        { name: 'David', phone: '5556667777', address: 'Houston', email: 'david@example.com' },
        { name: 'Ella', phone: '2223334444', address: 'San Diego', email: 'ella@example.com' },
        { name: 'Liam', phone: '9990001111', address: 'Phoenix', email: 'liam@example.com' },
        { name: 'Mia', phone: '1231231230', address: 'Dallas', email: 'mia@example.com' },
        { name: 'Benjamin', phone: '4564564560', address: 'Las Vegas', email: 'benjamin@example.com' },
        { name: 'Amelia', phone: '7897897890', address: 'Orlando', email: 'amelia@example.com' },
        { name: 'Matthew', phone: '9879879870', address: 'Portland', email: 'matthew@example.com' },
        { name: 'Charlotte', phone: '1119997777', address: 'San Antonio', email: 'charlotte@example.com' },
        { name: 'Jackson', phone: '9991117777', address: 'Nashville', email: 'jackson@example.com' },
        { name: 'Chloe', phone: '1119997777', address: 'Atlanta', email: 'chloe@example.com' },
        { name: 'Lucas', phone: '1119997777', address: 'New Orleans', email: 'lucas@example.com' },
        { name: 'Zoe', phone: '1119997777', address: 'Kansas City', email: 'zoe@example.com' },
        { name: 'Logan', phone: '1119997777', address: 'San Jose', email: 'logan@example.com' },
        { name: 'Lily', phone: '1119997777', address: 'Minneapolis', email: 'lily@example.com' },
        { name: 'Elijah', phone: '1119997777', address: 'Columbus', email: 'elijah@example.com' },
        { name: 'Grace', phone: '1119997777', address: 'Indianapolis', email: 'grace@example.com' },
        { name: 'Mason', phone: '1119997777', address: 'Raleigh', email: 'mason@example.com' },
        { name: 'Avery', phone: '1119997777', address: 'Charlotte', email: 'avery@example.com' },
        { name: 'Evelyn', phone: '1119997777', address: 'Tampa', email: 'evelyn@example.com' },
        { name: 'Oliver', phone: '1119997777', address: 'Seattle', email: 'oliver@example.com' },
        { name: 'Abigail', phone: '1119997777', address: 'Denver', email: 'abigail@example.com' },
        { name: 'Theodore', phone: '1119997777', address: 'Albuquerque', email: 'theodore@example.com' },
        { name: 'Elizabeth', phone: '1119997777', address: 'Oklahoma City', email: 'elizabeth@example.com' },
        { name: 'Aiden', phone: '1119997777', address: 'Boise', email: 'aiden@example.com' },
        { name: 'Sofia', phone: '1119997777', address: 'Tucson', email: 'sofia@example.com' },
        { name: 'Henry', phone: '1119997777', address: 'Salt Lake City', email: 'henry@example.com' },
        { name: 'Madison', phone: '1119997777', address: 'Louisville', email: 'madison@example.com' },
        { name: 'Liam', phone: '1119997777', address: 'St. Louis', email: 'liam2@example.com' },
        { name: 'Scarlett', phone: '1119997777', address: 'Des Moines', email: 'scarlett@example.com' },
        { name: 'Ethan', phone: '1119997777', address: 'Anchorage', email: 'ethan@example.com' },
        { name: 'Nora', phone: '1119997777', address: 'Honolulu', email: 'nora@example.com' },
        { name: 'Daniel', phone: '1119997777', address: 'Juneau', email: 'daniel@example.com' },
        { name: 'Aria', phone: '1119997777', address: 'Montgomery', email: 'aria@example.com' },
        { name: 'Carter', phone: '1119997777', address: 'Little Rock', email: 'carter@example.com' },
        { name: 'Victoria', phone: '1119997777', address: 'Jackson', email: 'victoria@example.com' },
        { name: 'Alexander', phone: '1119997777', address: 'Hartford', email: 'alexander@example.com' },
        { name: 'Grace', phone: '1119997777', address: 'Dover', email: 'grace2@example.com' },
        { name: 'Leo', phone: '1119997777', address: 'Trenton', email: 'leo@example.com' },
        { name: 'Ella', phone: '1119997777', address: 'Concord', email: 'ella2@example.com' },
        { name: 'Isaac', phone: '1119997777', address: 'Augusta', email: 'isaac@example.com' },
        { name: 'Luna', phone: '1119997777', address: 'Montpelier', email: 'luna@example.com' },
        { name: 'Lucas', phone: '1119997777', address: 'Boston', email: 'lucas2@example.com' },
        { name: 'Mila', phone: '1119997777', address: 'New Haven', email: 'mila@example.com' },
        { name: 'Benjamin', phone: '1119997777', address: 'Providence', email: 'benjamin2@example.com' },
        { name: 'Lily', phone: '1119997777', address: 'Harrisburg', email: 'lily2@example.com' },
    ];
    

    return (
        <div className='custom-scroll-bar'>
            <h5 className='mb-5 font-bold'>Customer List</h5>
            <hr className="my-5 mr-5" />
            <div className='h-[300px] overflow-y-scroll scroll-smooth'>
                {
                    customers.map((customer, index) =>
                        <div key={index} className='text-sm'>
                            <p className='text-slate-500 capitalize'>Name: {customer.name}</p>
                            <p className='text-slate-400'>Phone: {customer.phone}</p>
                            <p className='text-slate-400'>Email: {customer.email}</p>
                            <p className='text-slate-400 capitalize'>Address: {customer.address}</p>
                            <hr className="my-2" />
                        </div>
                    )
                }
            </div>
        </div>
    );
};

export default CustomerList;