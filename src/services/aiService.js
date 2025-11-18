
const axios = require('axios');

// Usa el modelo "mistral" por defecto, puedes cambiarlo por otro compatible con Ollama si lo deseas
const OLLAMA_URL = process.env.OLLAMA_URL || 'http://localhost:11434';
const OLLAMA_MODEL = process.env.OLLAMA_MODEL || 'mistral';


const { Readable } = require('stream');

/**
 * Formatea el texto con expresiones matemáticas a LaTeX
 * @param {string} text - Texto con expresiones matemáticas
 * @returns {string} - Texto formateado con LaTeX
 */
function formatMathResponse(text) {
    let result = text;
    
    // Primero, proteger las expresiones LaTeX existentes
    const protectedExpressions = [];
    result = result.replace(/\$\$[^$]*\$\$/g, (match, index) => {
        const placeholder = `__PROTECTED_BLOCK_${protectedExpressions.length}__`;
        protectedExpressions.push(match);
        return placeholder;
    });
    result = result.replace(/\$[^$\n]*\$/g, (match, index) => {
        const placeholder = `__PROTECTED_INLINE_${protectedExpressions.length}__`;
        protectedExpressions.push(match);
        return placeholder;
    });
    
    // Formatear expresiones matemáticas comunes
    result = result
        // Funciones matemáticas comunes
        .replace(/\b([a-zA-Z])\(([a-zA-Z])\)/g, '$$$1($2)$$') // f(x) -> $f(x)$
        
        // Potencias con paréntesis: (x)^2 -> $(x)^{2}$
        .replace(/\(([^)]+)\)\^([0-9]+)/g, '$($1)^{$2}$')
        
        // Potencias simples: x^2 -> $x^{2}$
        .replace(/\b([a-zA-Z]+)\^([0-9]+)/g, '$$$1^{$2}$$')
        
        // Fracciones explícitas
        .replace(/\b([a-zA-Z0-9']+)\s*\/\s*([a-zA-Z0-9']+)\b/g, '$$\\frac{$1}{$2}$$')
        
        // Raíces cuadradas
        .replace(/sqrt\(([^)]+)\)/g, '$$\\sqrt{$1}$$')
        
        // Símbolos griegos
        .replace(/\bpi\b/g, '$\\pi$')
        .replace(/\balpha\b/g, '$\\alpha$')
        .replace(/\bbeta\b/g, '$\\beta$')
        .replace(/\bgamma\b/g, '$\\gamma$')
        .replace(/\bdelta\b/g, '$\\delta$')
        .replace(/\btheta\b/g, '$\\theta$')
        .replace(/\blambda\b/g, '$\\lambda$')
        .replace(/\bmu\b/g, '$\\mu$')
        .replace(/\bsigma\b/g, '$\\sigma$')
        
        // Funciones trigonométricas
        .replace(/\b(sin|cos|tan|sec|csc|cot)\(/g, '$\\$1($')
        .replace(/\b(sin|cos|tan|sec|csc|cot)\s+([a-zA-Z]+)/g, '$\\$1 $2$')
        
        // Logaritmos
        .replace(/\bln\(/g, '$\\ln($')
        .replace(/\blog\(/g, '$\\log($')
        
        // Límites
        .replace(/\blim\b/g, '$\\lim$')
        .replace(/limite\s+de/gi, '$\\lim$')
        
        // Integrales
        .replace(/integral\s+de/gi, '$\\int$')
        .replace(/∫/g, '$\\int$')
        
        // Infinito
        .replace(/infinito/g, '$\\infty$')
        .replace(/∞/g, '$\\infty$')
        
        // Derivadas
        .replace(/d\/dx/g, '$\\frac{d}{dx}$')
        .replace(/dy\/dx/g, '$\\frac{dy}{dx}$')
        .replace(/([a-zA-Z])'(?!\w)/g, '$$$1\'$$') // f' -> $f'$
        
        // Variables con subíndices: x1, x2 -> $x_1$, $x_2$
        .replace(/\b([a-zA-Z])([0-9]+)\b/g, '$$$1_{$2}$$');
    
    // Restaurar expresiones protegidas
    protectedExpressions.forEach((expr, index) => {
        result = result.replace(`__PROTECTED_BLOCK_${index}__`, expr);
        result = result.replace(`__PROTECTED_INLINE_${index}__`, expr);
    });
    
    // Limpiar espacios duplicados y mejorar formato
    result = result
        .replace(/\$\s+/g, '$')
        .replace(/\s+\$/g, '$')
        .replace(/\$\$\s*\$\$/g, '') // Eliminar $$ vacíos
        .replace(/\$\s*\$/g, '') // Eliminar $ vacíos
        .replace(/\s+/g, ' ') // Normalizar espacios
        .trim();
    
    return result;
}

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
        const formattedResponse = formatMathResponse(full.trim());
        console.log('🔢 Respuesta formateada con LaTeX aplicado');
        return formattedResponse || 'No se pudo obtener respuesta de Ollama.';
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
