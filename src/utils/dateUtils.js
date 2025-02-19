export const isToday = (incomingDate) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const incoming = new Date(incomingDate);
    incoming.setHours(0, 0, 0, 0);

    return (
        incoming.getFullYear() === today.getFullYear() &&
        incoming.getMonth() === today.getMonth() &&
        incoming.getDate() === today.getDate()
    );
};

export const isYesterday = (incomingDate) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);

    const incoming = new Date(incomingDate);
    incoming.setHours(0, 0, 0, 0);

    return (
        incoming.getFullYear() === yesterday.getFullYear() &&
        incoming.getMonth() === yesterday.getMonth() &&
        incoming.getDate() === yesterday.getDate()
    );
};

export const is7DaysAgo = (incomingDate) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const sevenDaysAgo = new Date(today);
    sevenDaysAgo.setDate(today.getDate() - 7);

    const incoming = new Date(incomingDate);
    incoming.setHours(0, 0, 0, 0);

    return (
        incoming.getFullYear() === sevenDaysAgo.getFullYear() &&
        incoming.getMonth() === sevenDaysAgo.getMonth() &&
        incoming.getDate() === sevenDaysAgo.getDate()
    );
};
