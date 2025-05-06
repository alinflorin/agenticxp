import yup, { ObjectSchema } from "yup";
import { UserProfile } from "@/shared-models/user-profile";

export const userProfileSchema: ObjectSchema<UserProfile> = yup
    .object({
        is_admin: yup
            .boolean()
            .required("ui.tool.mcpServerIsRequired")
            .label("ui.userProfile.isAdmin")
            .example(true)
    })
    .required();

export default userProfileSchema;
