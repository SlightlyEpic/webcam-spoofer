const __VERBOSE = 1;

const spLogger = {
    log: (level, ...args) => {
        if(__VERBOSE >= level) console.log(...args);
    },
    warn: (level, ...args) => {
        if(__VERBOSE >= level) console.warn(...args);
    },
    error: (level, ...args) => {
        if(__VERBOSE >= level) console.error(...args);
    },
}
