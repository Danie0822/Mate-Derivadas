
const axios = require('axios');

// Usa el modelo "mistral" por defecto, puedes cambiarlo por otro compatible con Ollama si lo deseas
const OLLAMA_URL = process.env.OLLAMA_URL || 'http://localhost:11434';
const OLLAMA_MODEL = process.env.OLLAMA_MODEL || 'mistral';


const { Readable } = require('stream');

async function getAIAnswer(question) {
    try {
        // Ahora 'question' es un array de mensajes, no un string
        const response = await axios.post(
            `${OLLAMA_URL}/api/chat`,
            {
                model: OLLAMA_MODEL,
                messages: question, // question es un array de mensajes
                stream: true
            },
            {
                headers: {
                    'Content-Type': 'application/json'
                },
                responseType: 'stream',
                timeout: 60000 // 60 segundos
            }
        );

        // Leer el stream y concatenar los fragmentos
        let full = '';
        const stream = response.data;
        for await (const chunk of stream) {
            const lines = chunk.toString().split('\n').filter(Boolean);
            for (const line of lines) {
                try {
                    const data = JSON.parse(line);
                    if (data.message && data.message.content) {
                        full += data.message.content;
                    }
                } catch (e) {
                    // Ignorar líneas que no sean JSON
                }
            }
        }
        return full.trim() || 'No se pudo obtener respuesta de Ollama.';
    } catch (error) {
        console.error('Error from Ollama API:', error?.response?.data || error.message || error);
        return 'Error getting answer from Ollama.';
    }
}

module.exports = { getAIAnswer };
