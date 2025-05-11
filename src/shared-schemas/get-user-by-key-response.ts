import yup from "yup";

export const getUserByKeyResponseSchema = yup
    .object({
        email: yup
            .string()
            .required("ui.getUserByKeyResponse.emailIsRequired")
            .email("ui.getUserByKeyResponse.emailIsInvalid")
            .label("ui.getUserByKeyResponse.email"),
        email_verified: yup.boolean().required("ui.getUserByKeyResponse.emailVerifiedIsRequired").label("ui.getUserByKeyResponse.emailVerified"),
        sub: yup.string().required("ui.getUserByKeyResponse.subIsRequired").label("ui.getUserByKeyResponse.sub"),
        expirationTs: yup.number().optional()
    })
    .required()
    .jsonSchema((s) => ({
        ...s,
        default: {
            email: 'test@test.com',
            email_verified: true,
            sub: "some-id",
            expirationTs: new Date().getTime() + 3600000
        } as GetUserByKey,
    }));

export default getUserByKeyResponseSchema;
export type GetUserByKey = yup.InferType<typeof getUserByKeyResponseSchema>;
