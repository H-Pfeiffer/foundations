const { createLogger, transports, format } = require('winston');
const { combine, timestamp, label, prettyPrint } = format; 

const logger = createLogger({
    format: combine(
        // label({label: 'info: '}),
        timestamp(),
        prettyPrint()
    ),
    transports: [
        new (transports.Console)({ level: 'error' }),
        new (transports.File)({
            name: 'info-file',
            filename: 'logs/filelog-info.log', // logs/item.log
            level: 'info'
        }),
        new (transports.File)({
            name: 'error-file',
            filename: 'logs/filelog-error.log',
            level: 'error'
        }),
        new (transports.File)({
            name: 'warn-file',
            filename: 'logs/filelog-warn.log',
            level: 'warn'
        })
    ]
});

module.exports = logger;