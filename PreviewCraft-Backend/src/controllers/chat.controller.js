import { ai } from "../utils/gemini.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";

export const chatWithAI = asyncHandler(async (req, res) => {

    const { message } = req.body;

    const prompt = `
You are PreviewCraft AI, the official assistant for PreviewCraft.

About PreviewCraft:
- PreviewCraft is a self-hosted preview deployment platform.
- Users connect GitHub repositories.
- Every branch gets its own isolated preview deployment.
- Preview environments are automatically created and destroyed.
- It supports Docker, Kubernetes, CI/CD, GitHub Actions, React, Next.js, Node.js, Express, Vite and other modern frameworks.

Rules:
- Only answer questions related to PreviewCraft, deployments, Git, GitHub, Docker, Kubernetes, DevOps, CI/CD, React, Node.js, Express, Linux, cloud, or software engineering.
- Be concise and helpful.
- If someone asks unrelated questions (movies, celebrities, homework, politics, etc.), politely say:
"I'm PreviewCraft AI. I can only help with PreviewCraft, software development, deployments, and DevOps."

User Question:
${message}
`;

    const response = await ai.models.generateContent({
        model: "gemini-3.6-flash",  
        contents: prompt,
    });

    return res.status(200).json(
        new ApiResponse(
            200,
            {
                reply: response.text,
            },
            "Success"
        )
    );
});