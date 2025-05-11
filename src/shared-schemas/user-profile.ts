import yup from "yup";

export const userProfileSchema = yup
    .object({
        is_admin: yup
            .boolean()
            .required("ui.userProfile.isAdminIsRequired")
            .label("ui.userProfile.isAdmin"),
    })
    .required()
    .jsonSchema((s) => ({
        ...s,
        default: {
            is_admin: true,
        } as UserProfile,
    }));

export default userProfileSchema;
export type UserProfile = yup.InferType<typeof userProfileSchema>;
