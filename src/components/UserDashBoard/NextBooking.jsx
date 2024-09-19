import React from 'react';

const NextBooking = () => {
    const customers = [];

    return (
        <div className='custom-scroll-bar'>
            <h5 className='mb-5 font-bold'>Next Day Booking</h5>
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

export default NextBooking;