import yup from "yup";

export const userSchema = yup
    .object({
        email: yup
            .string()
            .required("ui.user.emailIsRequired")
            .email("ui.user.emailIsInvalid")
            .label("ui.user.email"),
        email_verified: yup.boolean().required("ui.user.emailVerifiedIsRequired").label("ui.user.emailVerified"),
        sub: yup.string().required("ui.user.subIsRequired").label("ui.user.sub")
    })
    .required()
    .jsonSchema((s) => ({
        ...s,
        default: {
            email: 'test@test.com',
            email_verified: true,
            sub: "some-id"
        } as User,
    }));

export default userSchema;
export type User = yup.InferType<typeof userSchema>;
