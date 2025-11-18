# Mejoras del Chat IA

## Nueva Variable de Entorno

Se ha agregado una nueva variable de entorno para controlar la generación de nombres de chat:

### `GENERAR_NOMBRE_CHAT_IA`

**Ubicación**: Agregar al archivo `.env`

**Valores posibles**:
- `true`: Usa IA para generar nombres descriptivos automáticamente
- `false`: Usa la primera pregunta del usuario como nombre del chat

**Ejemplo de configuración**:
```env
# En tu archivo .env
GENERAR_NOMBRE_CHAT_IA=true
```

## Comportamiento según configuración

### Cuando `GENERAR_NOMBRE_CHAT_IA=true`
- La IA analiza la primera pregunta del usuario
- Genera un nombre descriptivo de 4-5 palabras
- Ejemplo: "¿Cómo calculo la derivada de x²?" → "Derivada de función cuadrática"

### Cuando `GENERAR_NOMBRE_CHAT_IA=false`
- Usa la primera pregunta directamente como nombre
- Limita el texto a 50 caracteres (+ "..." si es más largo)
- Ejemplo: "¿Cómo calculo la derivada de x²?" → "¿Cómo calculo la derivada de x²?"

## Mejoras de Consistencia del Chat

### Nuevo Endpoint
- **Ruta**: `GET /ai-questions/conversation/:conversation_id/history`
- **Propósito**: Obtener el historial completo de mensajes de una conversación

### Funcionalidades añadidas
1. **Carga de historial**: Al seleccionar una conversación existente, se carga automáticamente todo el historial de mensajes
2. **Contexto completo**: La IA ahora mantiene el contexto completo de la conversación en todas las respuestas
3. **Navegación fluida**: Los usuarios pueden cambiar entre conversaciones sin perder el contexto

## Implementación Técnica

### Backend
- Nuevo método `getConversationHistory` en `AIQuestionController`
- Nueva ruta en `ai-questions.routes.js`
- Variable de entorno para controlar generación de nombres

### Frontend
- Método `getChatHistory` actualizado en `chatService`
- Función `handleSelectChat` mejorada para cargar historial
- Conversión automática del historial al formato de mensajes del frontend

## Instrucciones de Instalación

1. **Agregar variable de entorno**:
   ```bash
   # Copiar el archivo de ejemplo
   cp .env.example .env
   
   # Editar el archivo .env y agregar:
   GENERAR_NOMBRE_CHAT_IA=true
   ```

2. **Reiniciar el servidor**:
   ```bash
   npm run dev
   ```

3. **Probar la funcionalidad**:
   - Crear una nueva conversación
   - Verificar que el nombre se genera según la configuración
   - Cambiar entre conversaciones para probar la carga del historial

## Beneficios

✅ **Nombres de chat personalizables**: Decide si quieres nombres generados por IA o usar las preguntas directamente  
✅ **Consistencia total**: El chat mantiene el contexto completo en todas las conversaciones  
✅ **Mejor experiencia de usuario**: Navegación fluida entre conversaciones con historial completo  
✅ **Configuración flexible**: Fácil cambio de comportamiento sin modificar código  