import { UserProfile } from "@/shared-schemas/user-profile";
import { BehaviourSubject } from "@/helpers/behaviour-subject";

export const userProfileStore = new BehaviourSubject<UserProfile | undefined>(undefined);
export default userProfileStore;