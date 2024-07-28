// Define types for error objects
type FastAPIError = { loc: string[]; msg: string };
type LaravelError = any;

// Define type for the formatErrors function
type FormatErrorsFunction = {
    fastAPI: (errors: any | FastAPIError[]) => Record<string, string>;
    laravel: (errors: LaravelError) => Record<string, string>;
};

// Helper function to format errors in a uniform structure
export const formatErrors: FormatErrorsFunction = {
    fastAPI: (errors) => {
        errors = errors?.detail ? errors?.detail : errors

        const formattedErrors: Record<string, string> = {};

        typeof errors == 'object' && errors.length && errors.forEach((error) => {
            const { loc, msg } = error;
            const field = loc[1];
            formattedErrors[field] = msg;
        });

        return formattedErrors;
    },
};
