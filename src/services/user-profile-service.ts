import { ApiKey } from "@/shared-schemas/api-key";
import { GenerateApiKeyRequest } from "@/shared-schemas/generate-api-key-request";
import { UserProfile } from "@/shared-schemas/user-profile";
import axios from "axios";

export const userProfileService = {
    getProfile: async () => {
        return (await axios.get<UserProfile>("/api/user-profile")).data;
    },

    getApiKeys: async () => {
        return (await axios.get<ApiKey[]>("/api/user-profile/api-keys")).data;
    },

    generateApiKey: async (model: GenerateApiKeyRequest) => {
        return (await axios.post<ApiKey>("/api/user-profile/generate-api-key", model))
            .data;
    },

    revokeApiKey: async (id: string) => {
        return (
            await axios.delete<ApiKey>("/api/user-profile/revoke-api-key/" + id)
        ).data;
    },
};

export default userProfileService;
