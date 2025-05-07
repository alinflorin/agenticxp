import yup from 'yup';

const errorResponseSchema = yup.object().required();
export default errorResponseSchema;

export type ErrorResponse = {[key: string]: string[]};