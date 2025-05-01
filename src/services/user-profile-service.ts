import { UserProfile } from "@/dto/user-profile";
import axios from "axios";

export const userProfileService = {
    getProfile: async () => {
        return (await axios.get<UserProfile>('/api/user-profile')).data;
    }
}

export default userProfileService;