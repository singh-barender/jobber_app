// Shared HTTP error classes every service throws and serializes in its error-handler middleware.
import { StatusCodes } from 'http-status-codes';

export interface IErrorResponse {
    message: string;
    statusCode: number;
    status: string;
    comingFrom: string;
    serializeErrors(): IError;
}

export interface IError {
    message: string;
    statusCode: number;
    status: string;
    comingFrom: string;
}

export abstract class CustomError extends Error {
    abstract statusCode: number;
    abstract status: string;
    comingFrom: string;

    constructor(message: string, comingFrom: string) {
        super(message);
        // Use the concrete subclass name (e.g. "BadRequestError") instead of "Error" in
        // logs and stack traces, and drop this constructor from the trace so it points
        // straight at the `throw new XError(...)` call site.
        this.name = this.constructor.name;
        this.comingFrom = comingFrom;
        if (typeof Error.captureStackTrace === 'function') {
            Error.captureStackTrace(this, this.constructor);
        }
    }

    serializeErrors(): IError {
        return {
            message: this.message,
            statusCode: this.statusCode,
            status: this.status,
            comingFrom: this.comingFrom
        };
    }
}

export class BadRequestError extends CustomError {
    statusCode = StatusCodes.BAD_REQUEST;
    status = 'error';

    constructor(message: string, comingFrom: string) {
        super(message, comingFrom);
    }
}

export class NotFoundError extends CustomError {
    statusCode = StatusCodes.NOT_FOUND;
    status = 'error';

    constructor(message: string, comingFrom: string) {
        super(message, comingFrom);
    }
}

export class NotAuthorizedError extends CustomError {
    statusCode = StatusCodes.UNAUTHORIZED;
    status = 'error';

    constructor(message: string, comingFrom: string) {
        super(message, comingFrom);
    }
}

export class FileTooLargeError extends CustomError {
    statusCode = StatusCodes.REQUEST_TOO_LONG;
    status = 'error';

    constructor(message: string, comingFrom: string) {
        super(message, comingFrom);
    }
}

export class ServerError extends CustomError {
    statusCode = StatusCodes.SERVICE_UNAVAILABLE;
    status = 'error';

    constructor(message: string, comingFrom: string) {
        super(message, comingFrom);
    }
}

export interface ErrnoException extends Error {
    errno?: number;
    code?: string;
    path?: string;
    syscall?: string;
    stack?: string;
}
