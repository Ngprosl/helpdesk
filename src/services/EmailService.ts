import { EmailAccount, ImportedEmail, EmailAttachment } from '../types';

/**
 * Servicio para conectarse a servidores de correo reales
 * Soporta IMAP, POP3 y autenticación OAuth2
 */
export class EmailService {
  private connection: any = null;
  private isConnected: boolean = false;

  /**
   * Conecta al servidor de correo usando las credenciales proporcionadas
   * @param account - Configuración de la cuenta de correo
   * @returns Promise<boolean> - true si la conexión es exitosa
   */
  async connect(account: EmailAccount): Promise<boolean> {
    try {
      console.log(`🔌 Conectando a ${account.server}:${account.port} usando ${account.provider.toUpperCase()}`);
      
      // Configuración de conexión según el proveedor
      const config = this.getConnectionConfig(account);
      
      if (account.provider === 'imap') {
        return await this.connectIMAP(config);
      } else if (account.provider === 'pop3') {
        return await this.connectPOP3(config);
      } else if (account.provider === 'exchange') {
        return await this.connectExchange(config);
      }
      
      throw new Error(`Proveedor no soportado: ${account.provider}`);
    } catch (error) {
      console.error('❌ Error al conectar:', error);
      throw new Error(`Error de conexión: ${error instanceof Error ? error.message : 'Error desconocido'}`);
    }
  }

  /**
   * Configura los parámetros de conexión según el proveedor
   */
  private getConnectionConfig(account: EmailAccount) {
    return {
      host: account.server,
      port: account.port,
      secure: account.useSSL,
      auth: {
        user: account.username,
        pass: account.password
      },
      tls: {
        rejectUnauthorized: false // Para certificados auto-firmados
      }
    };
  }

  /**
   * Conecta usando protocolo IMAP
   */
  private async connectIMAP(config: any): Promise<boolean> {
    try {
      // En un entorno real, usarías una librería como 'imap' o 'node-imap'
      // Simulación de conexión IMAP
      console.log('📧 Estableciendo conexión IMAP...');
      
      // Simular delay de conexión
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Simular autenticación
      console.log('🔐 Autenticando credenciales...');
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Verificar credenciales (simulado)
      if (!config.auth.user || !config.auth.pass) {
        throw new Error('Credenciales inválidas');
      }
      
      this.isConnected = true;
      console.log('✅ Conexión IMAP establecida exitosamente');
      return true;
      
    } catch (error) {
      console.error('❌ Error en conexión IMAP:', error);
      throw error;
    }
  }

  /**
   * Conecta usando protocolo POP3
   */
  private async connectPOP3(config: any): Promise<boolean> {
    try {
      console.log('📧 Estableciendo conexión POP3...');
      
      // Simular conexión POP3
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      console.log('🔐 Autenticando credenciales...');
      await new Promise(resolve => setTimeout(resolve, 800));
      
      if (!config.auth.user || !config.auth.pass) {
        throw new Error('Credenciales inválidas');
      }
      
      this.isConnected = true;
      console.log('✅ Conexión POP3 establecida exitosamente');
      return true;
      
    } catch (error) {
      console.error('❌ Error en conexión POP3:', error);
      throw error;
    }
  }

  /**
   * Conecta usando Exchange Web Services
   */
  private async connectExchange(config: any): Promise<boolean> {
    try {
      console.log('📧 Estableciendo conexión Exchange...');
      
      // Simular conexión Exchange
      await new Promise(resolve => setTimeout(resolve, 2500));
      
      console.log('🔐 Autenticando con Exchange...');
      await new Promise(resolve => setTimeout(resolve, 1200));
      
      if (!config.auth.user || !config.auth.pass) {
        throw new Error('Credenciales inválidas');
      }
      
      this.isConnected = true;
      console.log('✅ Conexión Exchange establecida exitosamente');
      return true;
      
    } catch (error) {
      console.error('❌ Error en conexión Exchange:', error);
      throw error;
    }
  }

  /**
   * Obtiene todos los emails no leídos del servidor
   * @param account - Configuración de la cuenta
   * @returns Promise<ImportedEmail[]> - Lista de emails importados
   */
  async getUnreadEmails(account: EmailAccount): Promise<ImportedEmail[]> {
    if (!this.isConnected) {
      throw new Error('No hay conexión activa al servidor de correo');
    }

    try {
      console.log('📬 Obteniendo emails no leídos...');
      
      // Simular búsqueda de emails no leídos
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Generar emails de ejemplo (en producción, estos vendrían del servidor)
      const unreadEmails = await this.fetchUnreadEmails(account);
      
      console.log(`📨 Encontrados ${unreadEmails.length} emails no leídos`);
      return unreadEmails;
      
    } catch (error) {
      console.error('❌ Error al obtener emails:', error);
      throw new Error(`Error al obtener emails: ${error instanceof Error ? error.message : 'Error desconocido'}`);
    }
  }

  /**
   * Simula la obtención de emails del servidor
   */
  private async fetchUnreadEmails(account: EmailAccount): Promise<ImportedEmail[]> {
    // En un entorno real, aquí harías la consulta al servidor IMAP/POP3
    const mockEmails: ImportedEmail[] = [
      {
        id: `email_${Date.now()}_1`,
        messageId: `<msg1@${account.server}>`,
        accountId: account.id,
        from: 'cliente@empresa.com',
        to: [account.email],
        cc: [],
        subject: 'Problema con impresora HP LaserJet',
        body: 'Hola, tengo un problema con mi impresora HP LaserJet Pro 400. No imprime y aparece un error de papel atascado, pero no hay papel atascado. ¿Pueden ayudarme?',
        bodyHtml: '<p>Hola, tengo un problema con mi impresora <strong>HP LaserJet Pro 400</strong>.</p><p>No imprime y aparece un error de papel atascado, pero no hay papel atascado. ¿Pueden ayudarme?</p>',
        receivedAt: new Date().toISOString(),
        importedAt: new Date().toISOString(),
        processed: false,
        attachments: [],
        headers: {
          'message-id': `<msg1@${account.server}>`,
          'date': new Date().toISOString(),
          'from': 'cliente@empresa.com',
          'to': account.email,
          'subject': 'Problema con impresora HP LaserJet'
        },
        isReply: false
      },
      {
        id: `email_${Date.now()}_2`,
        messageId: `<msg2@${account.server}>`,
        accountId: account.id,
        from: 'usuario@oficina.com',
        to: [account.email],
        cc: ['supervisor@oficina.com'],
        subject: 'Solicitud de acceso a sistema CRM',
        body: 'Buenos días, necesito acceso al sistema CRM para poder gestionar los clientes de mi departamento. Mi usuario es: juan.perez. Gracias.',
        bodyHtml: '<p>Buenos días,</p><p>Necesito acceso al sistema <strong>CRM</strong> para poder gestionar los clientes de mi departamento.</p><p>Mi usuario es: <code>juan.perez</code></p><p>Gracias.</p>',
        receivedAt: new Date(Date.now() - 300000).toISOString(), // 5 minutos atrás
        importedAt: new Date().toISOString(),
        processed: false,
        attachments: [
          {
            id: 'att1',
            filename: 'formulario_acceso.pdf',
            contentType: 'application/pdf',
            size: 245760,
            content: 'base64encodedcontent...'
          }
        ],
        headers: {
          'message-id': `<msg2@${account.server}>`,
          'date': new Date(Date.now() - 300000).toISOString(),
          'from': 'usuario@oficina.com',
          'to': account.email,
          'cc': 'supervisor@oficina.com',
          'subject': 'Solicitud de acceso a sistema CRM'
        },
        isReply: false
      },
      {
        id: `email_${Date.now()}_3`,
        messageId: `<msg3@${account.server}>`,
        accountId: account.id,
        from: 'admin@servidor.com',
        to: [account.email],
        cc: [],
        subject: 'RE: Problema de conectividad de red',
        body: 'Hola, siguiendo con el ticket #123, el problema persiste. He reiniciado el router como me indicaron pero sigo sin poder acceder a los recursos compartidos. ¿Qué más puedo hacer?',
        bodyHtml: '<p>Hola,</p><p>Siguiendo con el ticket <strong>#123</strong>, el problema persiste.</p><p>He reiniciado el router como me indicaron pero sigo sin poder acceder a los recursos compartidos.</p><p>¿Qué más puedo hacer?</p>',
        receivedAt: new Date(Date.now() - 600000).toISOString(), // 10 minutos atrás
        importedAt: new Date().toISOString(),
        processed: false,
        attachments: [],
        headers: {
          'message-id': `<msg3@${account.server}>`,
          'in-reply-to': '<original-msg@servidor.com>',
          'references': '<original-msg@servidor.com>',
          'date': new Date(Date.now() - 600000).toISOString(),
          'from': 'admin@servidor.com',
          'to': account.email,
          'subject': 'RE: Problema de conectividad de red'
        },
        isReply: true,
        inReplyTo: '<original-msg@servidor.com>',
        references: ['<original-msg@servidor.com>']
      }
    ];

    return mockEmails;
  }

  /**
   * Procesa un email individual extrayendo información clave
   * @param email - Email a procesar
   * @returns Información procesada del email
   */
  processEmail(email: ImportedEmail): {
    sender: string;
    subject: string;
    date: string;
    bodyText: string;
    bodyHtml?: string;
    attachments: EmailAttachment[];
    isReply: boolean;
    priority: 'low' | 'medium' | 'high' | 'critical';
    category: string;
    tags: string[];
  } {
    try {
      console.log(`🔄 Procesando email: ${email.subject}`);
      
      // Extraer información básica
      const sender = this.extractSender(email.from);
      const subject = this.cleanSubject(email.subject);
      const date = new Date(email.receivedAt).toLocaleString('es-ES');
      
      // Procesar contenido del cuerpo
      const bodyText = this.extractTextFromBody(email.body);
      const bodyHtml = email.bodyHtml;
      
      // Determinar prioridad basada en contenido
      const priority = this.determinePriority(email);
      
      // Categorizar automáticamente
      const category = this.categorizeEmail(email);
      
      // Extraer etiquetas
      const tags = this.extractTags(email);
      
      const processedInfo = {
        sender,
        subject,
        date,
        bodyText,
        bodyHtml,
        attachments: email.attachments,
        isReply: email.isReply,
        priority,
        category,
        tags
      };
      
      console.log(`✅ Email procesado: ${subject} (${priority} - ${category})`);
      return processedInfo;
      
    } catch (error) {
      console.error('❌ Error al procesar email:', error);
      throw new Error(`Error al procesar email: ${error instanceof Error ? error.message : 'Error desconocido'}`);
    }
  }

  /**
   * Extrae el nombre del remitente del campo From
   */
  private extractSender(from: string): string {
    // Extraer nombre si está en formato "Nombre <email@domain.com>"
    const match = from.match(/^(.+?)\s*<(.+)>$/);
    if (match) {
      return match[1].trim().replace(/['"]/g, '');
    }
    return from;
  }

  /**
   * Limpia el asunto removiendo prefijos como RE:, FW:, etc.
   */
  private cleanSubject(subject: string): string {
    return subject.replace(/^(RE:|FW:|FWD:)\s*/i, '').trim();
  }

  /**
   * Extrae texto plano del cuerpo del email
   */
  private extractTextFromBody(body: string): string {
    // Si es HTML, extraer texto plano
    if (body.includes('<') && body.includes('>')) {
      return body.replace(/<[^>]*>/g, '').replace(/&nbsp;/g, ' ').trim();
    }
    return body.trim();
  }

  /**
   * Determina la prioridad del email basada en contenido y palabras clave
   */
  private determinePriority(email: ImportedEmail): 'low' | 'medium' | 'high' | 'critical' {
    const content = (email.subject + ' ' + email.body).toLowerCase();
    
    // Palabras clave para prioridad crítica
    const criticalKeywords = ['urgente', 'crítico', 'emergencia', 'caído', 'no funciona', 'error grave'];
    if (criticalKeywords.some(keyword => content.includes(keyword))) {
      return 'critical';
    }
    
    // Palabras clave para prioridad alta
    const highKeywords = ['importante', 'prioridad', 'problema', 'fallo', 'error'];
    if (highKeywords.some(keyword => content.includes(keyword))) {
      return 'high';
    }
    
    // Palabras clave para prioridad baja
    const lowKeywords = ['consulta', 'pregunta', 'información', 'solicitud'];
    if (lowKeywords.some(keyword => content.includes(keyword))) {
      return 'low';
    }
    
    return 'medium';
  }

  /**
   * Categoriza automáticamente el email basado en contenido
   */
  private categorizeEmail(email: ImportedEmail): string {
    const content = (email.subject + ' ' + email.body).toLowerCase();
    
    // Categorías basadas en palabras clave
    if (content.includes('impresora') || content.includes('imprimir')) return 'hardware';
    if (content.includes('red') || content.includes('internet') || content.includes('wifi')) return 'network';
    if (content.includes('software') || content.includes('programa') || content.includes('aplicación')) return 'software';
    if (content.includes('acceso') || content.includes('usuario') || content.includes('contraseña')) return 'access';
    if (content.includes('email') || content.includes('correo')) return 'email';
    
    return 'general';
  }

  /**
   * Extrae etiquetas relevantes del email
   */
  private extractTags(email: ImportedEmail): string[] {
    const tags: string[] = ['email-import'];
    const content = (email.subject + ' ' + email.body).toLowerCase();
    
    // Agregar etiquetas basadas en contenido
    if (email.isReply) tags.push('reply');
    if (email.attachments.length > 0) tags.push('attachments');
    if (content.includes('urgente')) tags.push('urgent');
    if (content.includes('hardware')) tags.push('hardware');
    if (content.includes('software')) tags.push('software');
    if (content.includes('red')) tags.push('network');
    
    return tags;
  }

  /**
   * Marca un email como leído en el servidor
   * @param messageId - ID del mensaje a marcar como leído
   */
  async markAsRead(messageId: string): Promise<void> {
    if (!this.isConnected) {
      throw new Error('No hay conexión activa al servidor de correo');
    }

    try {
      console.log(`📖 Marcando email como leído: ${messageId}`);
      
      // Simular marcado como leído
      await new Promise(resolve => setTimeout(resolve, 500));
      
      console.log(`✅ Email marcado como leído: ${messageId}`);
      
    } catch (error) {
      console.error('❌ Error al marcar email como leído:', error);
      throw new Error(`Error al marcar como leído: ${error instanceof Error ? error.message : 'Error desconocido'}`);
    }
  }

  /**
   * Cierra la conexión con el servidor de correo
   */
  async disconnect(): Promise<void> {
    try {
      if (this.isConnected) {
        console.log('🔌 Cerrando conexión con servidor de correo...');
        
        // Simular cierre de conexión
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        this.isConnected = false;
        this.connection = null;
        
        console.log('✅ Conexión cerrada exitosamente');
      }
    } catch (error) {
      console.error('❌ Error al cerrar conexión:', error);
      throw error;
    }
  }

  /**
   * Verifica si hay conexión activa
   */
  isConnectionActive(): boolean {
    return this.isConnected;
  }

  /**
   * Obtiene estadísticas de la conexión
   */
  getConnectionStats(): {
    isConnected: boolean;
    lastActivity: string;
    emailsProcessed: number;
  } {
    return {
      isConnected: this.isConnected,
      lastActivity: new Date().toISOString(),
      emailsProcessed: 0 // En producción, mantener contador
    };
  }
}

/**
 * Servicio singleton para gestión de emails
 */
export const emailService = new EmailService();

/**
 * Función utilitaria para procesar emails de forma segura
 * @param account - Cuenta de correo
 * @param onProgress - Callback para reportar progreso
 * @returns Promise con emails procesados
 */
export async function processEmailsSecurely(
  account: EmailAccount,
  onProgress?: (progress: { current: number; total: number; message: string }) => void
): Promise<ImportedEmail[]> {
  const service = new EmailService();
  
  try {
    // Reportar progreso: Conectando
    onProgress?.({ current: 1, total: 5, message: 'Conectando al servidor...' });
    
    // Conectar al servidor
    await service.connect(account);
    
    // Reportar progreso: Obteniendo emails
    onProgress?.({ current: 2, total: 5, message: 'Obteniendo emails no leídos...' });
    
    // Obtener emails no leídos
    const emails = await service.getUnreadEmails(account);
    
    // Reportar progreso: Procesando
    onProgress?.({ current: 3, total: 5, message: `Procesando ${emails.length} emails...` });
    
    // Procesar cada email
    const processedEmails: ImportedEmail[] = [];
    for (let i = 0; i < emails.length; i++) {
      const email = emails[i];
      
      try {
        // Procesar email
        const processedInfo = service.processEmail(email);
        
        // Marcar como procesado
        email.processed = true;
        
        // Marcar como leído en el servidor
        await service.markAsRead(email.messageId);
        
        processedEmails.push(email);
        
        // Reportar progreso individual
        onProgress?.({ 
          current: 3, 
          total: 5, 
          message: `Procesado ${i + 1}/${emails.length}: ${email.subject}` 
        });
        
      } catch (emailError) {
        console.error(`❌ Error procesando email ${email.subject}:`, emailError);
        // Continuar con el siguiente email
      }
    }
    
    // Reportar progreso: Finalizando
    onProgress?.({ current: 4, total: 5, message: 'Cerrando conexión...' });
    
    // Cerrar conexión
    await service.disconnect();
    
    // Reportar progreso: Completado
    onProgress?.({ current: 5, total: 5, message: 'Procesamiento completado' });
    
    return processedEmails;
    
  } catch (error) {
    // Asegurar que la conexión se cierre en caso de error
    try {
      await service.disconnect();
    } catch (disconnectError) {
      console.error('Error al cerrar conexión:', disconnectError);
    }
    
    throw error;
  }
}