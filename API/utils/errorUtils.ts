// errorUtils.ts
import { ServerError } from '../../shared/models/serverError';

export const createError = (statusCode: number, details?: string): ServerError => {
    return {
        statusCode,
        message: "An error occured",
        details: details || 'No additional details provided.'
    };
};

export const createServerError = (error: unknown): ServerError => {
    if (error instanceof Error) {
        return {
            statusCode: 500,
            message: 'An error occurred',
            details: error.message
        };
    } else {
        return {
            statusCode: 500,
            message: 'An error occurred',
            details: 'Unknown error'
        };
    }
};