import winston, { Logger } from 'winston';
import { ElasticsearchTransformer, ElasticsearchTransport, LogData, TransformedData } from 'winston-elasticsearch';

const ORIGIN = 'winstonLogger()';

function esTransformer(logData: LogData): TransformedData {
    return ElasticsearchTransformer(logData);
}

// Console format: "HH:mm:ss [service] level: message {meta}", colorized by level.
const consoleFormat = winston.format.combine(
    winston.format.timestamp({ format: 'HH:mm:ss' }),
    winston.format.colorize(),
    winston.format.printf((info) => {
        const { timestamp, level, message, service, ...meta } = info;
        const extra = Object.keys(meta).length > 0 ? ` ${JSON.stringify(meta)}` : '';
        return `${timestamp} [${service}] ${level}: ${message}${extra}`;
    })
);

// Creates a logger that writes to the console and to Elasticsearch. `elasticsearchNode`
// must include credentials when the cluster has security enabled, e.g.
// http://elastic:<password>@localhost:9200. All three arguments are required.
export function winstonLogger(elasticsearchNode: string, name: string, level: string): Logger {
    if (!elasticsearchNode) {
        throw new TypeError(`${ORIGIN}: "elasticsearchNode" is required`);
    }
    if (!name) {
        throw new TypeError(`${ORIGIN}: "name" is required`);
    }
    if (!level) {
        throw new TypeError(`${ORIGIN}: "level" is required`);
    }

    const esTransport = new ElasticsearchTransport({
        level,
        transformer: esTransformer,
        clientOpts: {
            node: elasticsearchNode,
            maxRetries: 2,
            requestTimeout: 10000,
            sniffOnStart: false
        }
    });

    // winston-elasticsearch emits 'error' when it cannot reach Elasticsearch (e.g. during
    // the ~30s the container takes to become healthy). An EventEmitter with no 'error'
    // listener crashes the whole process on that event, so this keeps the service alive
    // and logging to the console while Elasticsearch is unavailable.
    esTransport.on('error', (error: Error) => {
        console.error(`${ORIGIN}: Elasticsearch transport error for service "${name}"`, error);
    });

    const logger: Logger = winston.createLogger({
        exitOnError: false,
        defaultMeta: { service: name },
        transports: [
            new winston.transports.Console({ level, handleExceptions: true, format: consoleFormat }),
            esTransport
        ]
    });
    return logger;
}
