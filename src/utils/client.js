import { format, isToday, isYesterday } from 'date-fns';

export function formatTimestamp(timestamp) {
    // Si el timestamp es null o 1, retornamos la hora actual en formato de 'h:mm a'
    if (!timestamp || timestamp === '1') {
        return format(new Date(), 'h:mm a'); // Formato de horas para hoy
    }

    const date = new Date(timestamp);

    if (isToday(date)) {
        return format(date, 'h:mm a'); // Formato de horas para hoy
    } else if (isYesterday(date)) {
        return 'Yesterday'; // Si es ayer
    } else {
        return format(date, 'MMMM dd, yyyy'); // Otro formato si es más antiguo
    }
}