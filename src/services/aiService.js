const axios = require('axios');

// Puedes obtener un token gratuito de HuggingFace en https://huggingface.co/settings/tokens
const HUGGINGFACE_API_TOKEN = process.env.HF_API_TOKEN || '';
const MODEL_URL = 'https://api-inference.huggingface.co/models/google/gemma-2b-it'; // Modelo instructivo general, gratuito

async function getAIAnswer(question) {
    try {
        const response = await axios.post(
            MODEL_URL,
            { inputs: question },
            {
                headers: {
                    Authorization: `Bearer ${HUGGINGFACE_API_TOKEN}`,
                    'Content-Type': 'application/json',
                },
                timeout: 30000,
            }
        );
        // El formato de respuesta puede variar según el modelo
        if (Array.isArray(response.data)) {
            return response.data[0]?.generated_text || 'No answer generated.';
        }
        if (response.data.generated_text) {
            return response.data.generated_text;
        }
        return JSON.stringify(response.data);
    } catch (error) {
        return 'Error getting answer from AI.';
    }
}

module.exports = { getAIAnswer };
