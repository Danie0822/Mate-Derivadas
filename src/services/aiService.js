
const { getAIAnswerFromOpenRoute } = require('./openroute_service');

async function getAIAnswer(messages) {
    try {
        console.log('🌐 Delegando a OpenRoute service...');
        return await getAIAnswerFromOpenRoute(messages);
    } catch (error) {
        console.error('❌ Error en aiService:', error.message);
        return 'Error obteniendo respuesta del servicio de IA.';
    }
}

module.exports = { getAIAnswer };
