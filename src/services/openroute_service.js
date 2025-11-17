const axios = require('axios');

// Configuración de OpenRoute API
const OPENROUTE_API_URL = process.env.OPENROUTE_API_URL || 'https://openrouter.ai/api/v1';
const OPENROUTE_API_KEY = process.env.OPENROUTE_API_KEY;
const DEEPSEEK_MODEL = process.env.DEEPSEEK_MODEL || 'mistralai/mistral-small-3.1-24b-instruct:free';
const DEEPSEEK_MAX_TOKENS = parseInt(process.env.DEEPSEEK_MAX_TOKENS) || 1000;
const DEEPSEEK_TEMPERATURE = parseFloat(process.env.DEEPSEEK_TEMPERATURE) || 0.7;

// Función para estimar tokens aproximadamente (1 token ≈ 4 caracteres en promedio)
function estimateTokens(text) {
    return Math.ceil(text.length / 4);
}

// Función para truncar mensajes si excede límites de tokens
function truncateMessages(messages, maxTokens = 3000) {
    let totalTokens = 0;
    const truncatedMessages = [];
    
    // Siempre incluir el mensaje del sistema (primer mensaje)
    if (messages.length > 0 && messages[0].role === 'system') {
        truncatedMessages.push(messages[0]);
        totalTokens += estimateTokens(messages[0].content);
    }
    
    // Siempre incluir la última pregunta del usuario (último mensaje)
    const lastMessage = messages[messages.length - 1];
    if (lastMessage && lastMessage.role === 'user') {
        totalTokens += estimateTokens(lastMessage.content);
    }
    
    // Incluir mensajes del historial desde el final (más recientes) hasta llegar al límite
    // Excluimos el último mensaje (pregunta actual) y el primero (sistema) ya procesados
    const historyMessages = messages.slice(1, -1);
    const includedHistory = [];
    
    for (let i = historyMessages.length - 1; i >= 0; i--) {
        const messageTokens = estimateTokens(historyMessages[i].content);
        if (totalTokens + messageTokens > maxTokens) {
            console.log(`⚠️ Truncando historial en mensaje ${i + 2} para mantenerse bajo ${maxTokens} tokens`);
            break;
        }
        includedHistory.unshift(historyMessages[i]);
        totalTokens += messageTokens;
    }
    
    // Construir el array final: sistema + historial incluido + pregunta actual
    truncatedMessages.push(...includedHistory);
    if (lastMessage) {
        truncatedMessages.push(lastMessage);
    }
    
    console.log(`📊 Tokens estimados: ${totalTokens}/${maxTokens}`);
    console.log(`📊 Mensajes finales: ${truncatedMessages.length} (sistema: 1, historial: ${includedHistory.length}, actual: 1)`);
    return truncatedMessages;
}

async function getAIAnswerFromOpenRoute(messages) {
    try {
        console.log('🌐 Conectando a OpenRoute:', OPENROUTE_API_URL);
        console.log('🤖 Usando modelo:', DEEPSEEK_MODEL);
        console.log(`🤖 Mensajes originales: ${messages.length}`);
        
        // Debug: mostrar estructura de mensajes
        console.log('📝 Estructura de mensajes enviados:');
        messages.forEach((msg, index) => {
            console.log(`  ${index + 1}. [${msg.role}]: ${msg.content.substring(0, 100)}${msg.content.length > 100 ? '...' : ''}`);
        });
        
        if (!OPENROUTE_API_KEY) {
            throw new Error('OPENROUTE_API_KEY no está configurada en las variables de entorno');
        }

        // Truncar mensajes si es necesario para evitar exceder límites
        const truncatedMessages = truncateMessages(messages, 3000); // Reservamos tokens para la respuesta
        console.log(`🤖 Mensajes después de truncar: ${truncatedMessages.length}`);

        const response = await axios.post(
            `${OPENROUTE_API_URL}/chat/completions`,
            {
                model: DEEPSEEK_MODEL,
                messages: truncatedMessages,
                max_tokens: DEEPSEEK_MAX_TOKENS,
                temperature: DEEPSEEK_TEMPERATURE,
                stream: false // Para respuestas directas sin streaming
            },
            {
                headers: {
                    'Authorization': `Bearer ${OPENROUTE_API_KEY}`,
                    'Content-Type': 'application/json',
                    'HTTP-Referer': 'http://localhost:3000', // Requerido por OpenRouter
                    'X-Title': 'Mate-Derivadas AI Assistant' // Opcional pero recomendado
                },
                timeout: 60000 // 60 segundos
            }
        );

        console.log('✅ Respuesta recibida de OpenRoute');
        console.log('📊 Status:', response.status);
        console.log('📊 Usage:', response.data.usage);
        
        if (response.data.choices && response.data.choices.length > 0) {
            const answer = response.data.choices[0].message.content;
            console.log('✅ Respuesta procesada. Longitud:', answer.length);
            return answer.trim();
        } else {
            console.error('❌ No se encontraron respuestas en la respuesta de OpenRoute');
            return 'No se pudo obtener respuesta de OpenRoute.';
        }
    } catch (error) {
        console.error('❌ Error from OpenRoute API:', {
            message: error.message,
            code: error.code,
            response: error?.response?.data,
            status: error?.response?.status,
            statusText: error?.response?.statusText,
            url: error?.config?.url
        });
        
        // Manejo específico de errores de OpenRoute
        if (error?.response?.data?.error) {
            const errorData = error.response.data.error;
            console.error('❌ Error específico de OpenRoute:', errorData);
            
            if (errorData.code === 'invalid_request_error') {
                return 'Error en la solicitud a OpenRoute. Verifica la configuración del modelo.';
            } else if (errorData.code === 'rate_limit_exceeded') {
                return 'Límite de velocidad excedido en OpenRoute. Intenta de nuevo en unos momentos.';
            } else if (errorData.code === 'insufficient_quota') {
                return 'Cuota insuficiente en OpenRoute. Verifica tu saldo.';
            }
        }
        
        return 'Error obteniendo respuesta de OpenRoute.';
    }
}

module.exports = { getAIAnswerFromOpenRoute };