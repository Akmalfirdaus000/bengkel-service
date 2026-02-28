import { useEffect } from 'react';

export default function MyBookingsRedirect() {
    useEffect(() => {
        window.location.replace('/user/bookings/history');
    }, []);

    return null;
}
