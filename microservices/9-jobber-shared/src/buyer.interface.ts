// Buyer document and Redux state shapes.
import { Types } from 'mongoose';

export interface IBuyerDocument {
    _id?: string | Types.ObjectId;
    username?: string;
    email?: string;
    profilePicture?: string;
    country: string;
    isSeller?: boolean;
    purchasedGigs: string[];
    createdAt?: Date | string;
    updatedAt?: Date | string;
}

export interface IReduxBuyer {
    type?: string;
    payload: IBuyerDocument;
}
