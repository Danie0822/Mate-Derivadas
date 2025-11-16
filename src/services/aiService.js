
const axios = require('axios');

// Usa el modelo "mistral" por defecto, puedes cambiarlo por otro compatible con Ollama si lo deseas
const OLLAMA_URL = process.env.OLLAMA_URL || 'http://localhost:11434';
const OLLAMA_MODEL = process.env.OLLAMA_MODEL || 'mistral';


const { Readable } = require('stream');

async function getAIAnswer(question) {
    try {
        console.log('🤖 Conectando a Ollama:', OLLAMA_URL);
        console.log('🤖 Usando modelo:', OLLAMA_MODEL);
        console.log('🤖 Mensajes:', JSON.stringify(question, null, 2));
        
        // Ahora 'question' es un array de mensajes, no un string
        const response = await axios.post(
            `${OLLAMA_URL}/api/chat`,
            {
                model: OLLAMA_MODEL,
                messages: question, // question es un array de mensajes
                stream: true,
                options: {
                    temperature: 0.1,  // Temperatura muy baja para respuestas más consistentes y determinísticas
                    top_p: 0.9,
                    num_predict: 200   // Limitar la longitud de la respuesta
                }
            },
            {
                headers: {
                    'Content-Type': 'application/json'
                },
                responseType: 'stream',
                timeout: 120000 // 120 segundos
            }
        );

        console.log('✅ Respuesta recibida, procesando stream...');
        console.log('📊 Status:', response.status);
        console.log('📊 Headers:', response.headers);
        
        // Leer el stream y concatenar los fragmentos
        let full = '';
        const stream = response.data;
        for await (const chunk of stream) {
            const lines = chunk.toString().split('\n').filter(Boolean);
            console.log('📦 Chunk recibido:', lines.length, 'líneas');
            for (const line of lines) {
                try {
                    console.log('  Línea:', line.substring(0, 100) + (line.length > 100 ? '...' : ''));
                    const data = JSON.parse(line);
                    if (data.message && data.message.content) {
                        full += data.message.content;
                        console.log('  ➕ Contenido agregado:', data.message.content);
                    }
                    if (data.error) {
                        console.error('❌ Error en el stream de Ollama:', data.error);
                        throw new Error(data.error);
                    }
                } catch (e) {
                    if (e.message && !e.message.includes('Unexpected token')) {
                        console.error('❌ Error parseando línea:', e.message);
                        console.error('  Línea completa:', line);
                    }
                    // Ignorar líneas que no sean JSON
                }
            }
        }
        
        console.log('✅ Stream procesado. Longitud de respuesta:', full.length);
        return full.trim() || 'No se pudo obtener respuesta de Ollama.';
    } catch (error) {
        console.error('❌ Error from Ollama API:', {
            message: error.message,
            code: error.code,
            response: error?.response?.data,
            status: error?.response?.status,
            statusText: error?.response?.statusText,
            url: error?.config?.url
        });
        
        // Si hay datos en la respuesta, intentar leerlos
        if (error?.response?.data) {
            try {
                if (typeof error.response.data === 'object' && error.response.data.readable) {
                    const errorData = await streamToString(error.response.data);
                    console.error('❌ Error data from stream:', errorData);
                } else {
                    console.error('❌ Error data:', error.response.data);
                }
            } catch (e) {
                console.error('❌ Failed to read error data:', e.message);
            }
        }
        
        return 'Error getting answer from Ollama.';
    }
}

// Función auxiliar para convertir stream a string
async function streamToString(stream) {
    const chunks = [];
    for await (const chunk of stream) {
        chunks.push(Buffer.from(chunk));
    }
    return Buffer.concat(chunks).toString('utf-8');
}

module.exports = { getAIAnswer };
