let injGlob = {};

injGlob.__VERBOSE = 1;

injGlob.spLogger = {
    log: (level, ...args) => {
        if(injGlob.__VERBOSE >= level) console.log(...args);
    },
    warn: (level, ...args) => {
        if(injGlob.__VERBOSE >= level) console.warn(...args);
    },
    error: (level, ...args) => {
        if(injGlob.__VERBOSE >= level) console.error(...args);
    },
}
