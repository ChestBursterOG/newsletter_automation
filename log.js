function log(message) {
    const currentDate = new Date();
    const timestamp = `[${currentDate.toISOString()}]`;
    console.log(`${timestamp} ${message}`);
}

module.exports = log;
