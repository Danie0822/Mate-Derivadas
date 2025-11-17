const { getAIAnswerFromOpenRoute } = require('./openroute_service');

/**
 * Servicio para generar nombres de conversaciones usando IA
 */
class ConversationNamingService {
    
    /**
     * Genera un nombre para la conversación basado en el primer mensaje
     * @param {string} firstMessage - El primer mensaje del usuario
     * @returns {Promise<string>} - Nombre generado para la conversación
     */
    static async generateConversationName(firstMessage) {
        try {
            console.log('🏷️ Generando nombre para conversación...');
            
            // Validar entrada
            if (!firstMessage || firstMessage.trim().length === 0) {
                return 'Nueva conversación';
            }

            // Truncar mensaje si es muy largo
            const truncatedMessage = firstMessage.length > 200 
                ? firstMessage.substring(0, 200) + '...' 
                : firstMessage;

            // Prompt específico para generar nombres
            const messages = [
                {
                    role: 'system',
                    content: `Eres un asistente que genera títulos concisos para conversaciones de matemáticas.
                    
                    INSTRUCCIONES:
                    - Genera un título de máximo 15 caracteres
                    - Debe ser descriptivo y específico al tema matemático
                    - Usa términos técnicos apropiados
                    - Enfócate en el concepto principal
                    - No uses comillas ni puntos al final
                    - Si no es sobre matemáticas, usa "Consulta general"
                    
                    EJEMPLOS:
                    - "Derivadas de funciones cuadráticas"
                    - "Regla de la cadena explicada"
                    - "Límites y continuidad"
                    - "Integrales por partes"
                    - "Teorema del valor medio"`
                },
                {
                    role: 'user',
                    content: `Genera un título para esta conversación de matemáticas: "${truncatedMessage}"`
                }
            ];

            const generatedName = await getAIAnswerFromOpenRoute(messages);
            
            // Limpiar y validar la respuesta
            let cleanName = generatedName
                .replace(/['"]/g, '') // Remover comillas
                .replace(/^\s*-\s*/, '') // Remover guiones iniciales
                .trim();

            // Limitar longitud
            if (cleanName.length > 40) {
                cleanName = cleanName.substring(0, 37) + '...';
            }

            // Fallback si el nombre está vacío o es muy genérico
            if (!cleanName || cleanName.length < 3) {
                cleanName = this.generateFallbackName(firstMessage);
            }

            console.log(`✅ Nombre generado: "${cleanName}"`);
            return cleanName;

        } catch (error) {
            console.error('❌ Error generando nombre de conversación:', error.message);
            return this.generateFallbackName(firstMessage);
        }
    }

    /**
     * Genera un nombre de respaldo basado en palabras clave
     * @param {string} message - Mensaje del usuario
     * @returns {string} - Nombre de respaldo
     */
    static generateFallbackName(message) {
        const keywords = {
            'derivada': 'Derivadas',
            'integral': 'Integrales', 
            'límite': 'Límites',
            'función': 'Funciones',
            'ecuación': 'Ecuaciones',
            'matriz': 'Matrices',
            'vector': 'Vectores',
            'trigonométrica': 'Trigonometría',
            'logaritmo': 'Logaritmos',
            'exponencial': 'Exponenciales',
            'polynomial': 'Polinomios',
            'serie': 'Series',
            'sumatoria': 'Sumatorias'
        };

        const lowerMessage = message.toLowerCase();
        
        // Buscar palabras clave
        for (const [keyword, topic] of Object.entries(keywords)) {
            if (lowerMessage.includes(keyword)) {
                return `Consulta sobre ${topic}`;
            }
        }

        // Usar las primeras palabras del mensaje
        const words = message.trim().split(' ').slice(0, 4);
        const shortName = words.join(' ');
        
        if (shortName.length > 40) {
            return shortName.substring(0, 37) + '...';
        }
        
        return shortName || 'Nueva conversación';
    }

    /**
     * Valida si un nombre de conversación es apropiado
     * @param {string} name - Nombre a validar
     * @returns {boolean} - Si el nombre es válido
     */
    static validateConversationName(name) {
        if (!name || typeof name !== 'string') return false;
        
        const trimmed = name.trim();
        return trimmed.length >= 1 && trimmed.length <= 255;
    }
}

module.exports = ConversationNamingService;