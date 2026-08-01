import api from "../services/axios";

export const askAI = (message) => {
    return api.post("/api/v1/chat", {
        message,
    });
};