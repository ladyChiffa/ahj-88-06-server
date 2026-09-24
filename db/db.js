const subscriptions = {
    data: [],
    listeners: [], // слушатели события add

    add(item) {
        this.data.push(item);
        this.listeners.forEach(handler => handler(item));
    },

    listen(handler) {
        this.listeners.push(handler);
    }
};

module.exports = subscriptions;