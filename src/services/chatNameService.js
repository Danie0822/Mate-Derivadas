const { getAIAnswer } = require('./aiService');

class ChatNameService {
    /**
     * Genera un nombre para el chat basado en la primera pregunta
     * @param {string} firstQuestion - Primera pregunta del usuario
     * @returns {Promise<string>} - Nombre generado para el chat
     */
    static async generateChatName(firstQuestion) {
        try {
            const messages = [
                {
                    role: 'system',
                    content: `Eres un asistente que genera nombres cortos y descriptivos para conversaciones de chat. 
                    Basándote en la primera pregunta del usuario, genera un nombre de máximo 4-5 palabras que resuma el tema principal.
                    El nombre debe ser descriptivo pero conciso. No uses comillas ni caracteres especiales.
                    Solo devuelve el nombre, nada más.`
                },
                {
                    role: 'user',
                    content: `Genera un nombre para una conversación que empezó con esta pregunta: "${firstQuestion}"`
                }
            ];

            const generatedName = await getAIAnswer(messages);
            
            // Limpiar y limitar la respuesta
            const cleanName = generatedName
                .replace(/['"]/g, '') // Quitar comillas
                .replace(/^\w+:\s*/, '') // Quitar prefijos como "Nombre:"
                .trim()
                .substring(0, 50); // Limitar a 50 caracteres

            return cleanName || 'Nueva Conversación';
        } catch (error) {
            console.error('Error generating chat name:', error);
            return 'Nueva Conversación';
        }
    }
}

module.exports = ChatNameService;