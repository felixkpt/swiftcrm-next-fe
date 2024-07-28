// app/components/baseComponents/utils/pubSub.ts
type CallbackFunction = (payload: any) => void;

const subscribers: Record<string, CallbackFunction[]> = {};
const submitSubscribers: CallbackFunction[] = [];
const doneSubscribers: CallbackFunction[] = [];

export const publish = (action: string, payload: any) => {
    if (subscribers[action]) {
        subscribers[action].forEach(callback => callback(payload));
    }
    if (action.endsWith('_submit')) {
        submitSubscribers.forEach(callback => callback({ action, ...payload }));
    }
    if (action.endsWith('_done')) {
        doneSubscribers.forEach(callback => callback({ action, ...payload }));
    }
};

export const subscribe = (action: string, callback: CallbackFunction) => {
    if (action === '*_submit') {
        submitSubscribers.push(callback);
    }else if (action === '*_done') {
        console.log('doneSubscribers:',doneSubscribers)
        doneSubscribers.push(callback);
    } else {
        if (!subscribers[action]) {
            subscribers[action] = [];
        }
        subscribers[action].push(callback);
    }

    // Return an unsubscribe function
    return () => {
        if (action === '*_submit') {
            submitSubscribers.splice(submitSubscribers.indexOf(callback), 1);
        }else if (action === '*_done') {
            doneSubscribers.splice(doneSubscribers.indexOf(callback), 1);
        } else {
            subscribers[action] = subscribers[action].filter(cb => cb !== callback);
        }
    };
};
