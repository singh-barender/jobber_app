// Express middleware: verifies a request was proxied through the API gateway.
import JWT from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import { NotAuthorizedError, ServerError } from './error-handler';

const SERVICE_NAMES: string[] = ['auth', 'seller', 'gig', 'search', 'buyer', 'message', 'order', 'review'];
const ORIGIN = 'verifyGatewayRequest() method';

interface IGatewayTokenPayload {
    id: string;
    iat: number;
}

// Every service (including the gateway) must set the same GATEWAY_JWT_TOKEN value.
export function verifyGatewayRequest(req: Request, _res: Response, next: NextFunction): void {
    const secret = process.env.GATEWAY_JWT_TOKEN;
    if (!secret) {
        throw new ServerError('GATEWAY_JWT_TOKEN is not set', ORIGIN);
    }

    // A proxy in front of the service could in theory duplicate the header into an array;
    // take the first value rather than letting jsonwebtoken fail on a non-string.
    const rawHeader = req.headers?.gatewaytoken;
    const token = Array.isArray(rawHeader) ? rawHeader[0] : rawHeader;
    if (!token) {
        throw new NotAuthorizedError('Invalid request', `${ORIGIN}: missing gatewaytoken header`);
    }

    try {
        const payload = JWT.verify(token, secret) as IGatewayTokenPayload;
        if (!SERVICE_NAMES.includes(payload.id)) {
            throw new NotAuthorizedError('Invalid request', `${ORIGIN}: unrecognized service id in token`);
        }
    } catch (error) {
        if (error instanceof NotAuthorizedError) throw error;
        throw new NotAuthorizedError('Invalid request', `${ORIGIN}: token verification failed`);
    }
    next();
}
