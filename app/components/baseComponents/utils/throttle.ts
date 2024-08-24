const throttle = (func: Function, limit: number) => {
    let lastFunc: NodeJS.Timeout | null;
    let lastRan: number | null = null;
    return (...args: any[]) => {
        if (lastFunc) clearTimeout(lastFunc);
        const now = Date.now();
        if (lastRan === null || now - lastRan >= limit) {
            func(...args);
            lastRan = now;
        } else {
            lastFunc = setTimeout(() => {
                func(...args);
                lastRan = now;
            }, limit - (now - lastRan));
        }
    };
};

export default throttle