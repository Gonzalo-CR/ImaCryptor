document.addEventListener('DOMContentLoaded', function() {
    // Elementos del DOM
    const imageInput = document.getElementById('imageInput');
    const imagePreview = document.getElementById('imagePreview');
    const resultPreview = document.getElementById('resultPreview');
    const encryptKeyPhrase = document.getElementById('encryptKeyPhrase');
    const decryptKeyPhrase = document.getElementById('decryptKeyPhrase');
    const encryptBtn = document.getElementById('encryptBtn');
    const decryptBtn = document.getElementById('decryptBtn');
    const downloadBtn = document.getElementById('downloadBtn');
    const downloadTextBtn = document.getElementById('downloadTextBtn');
    const copyTextBtn = document.getElementById('copyTextBtn');
    const encryptedText = document.getElementById('encryptedText');
    const encryptedTextInput = document.getElementById('encryptedTextInput');
    const textFileInput = document.getElementById('textFileInput');
    const statusMessage = document.getElementById('statusMessage');
    
    let originalImage = null;
    let processedImage = null;
    let base64String = '';
    
    // Cargar imagen
    imageInput.addEventListener('change', function(e) {
        const file = e.target.files[0];
        if (!file) return;
        
        if (!file.type.match('image.*')) {
            showStatus('Por favor, selecciona un archivo de imagen válido.', 'error');
            return;
        }
        
        // Mostrar mensaje de carga
        showStatus('🔄 Cargando imagen...', 'success');
        
        const reader = new FileReader();
        reader.onload = function(e) {
            originalImage = new Image();
            originalImage.onload = function() {
                imagePreview.innerHTML = '';
                imagePreview.appendChild(originalImage);
                
                // Guardar el Base64 de la imagen
                base64String = e.target.result;
                showStatus('✅ Imagen cargada correctamente. Ahora puedes cifrarla.', 'success');
            };
            originalImage.onerror = function() {
                showStatus('❌ Error al cargar la imagen.', 'error');
            };
            originalImage.src = e.target.result;
        };
        reader.onerror = function() {
            showStatus('❌ Error al leer el archivo.', 'error');
        };
        reader.readAsDataURL(file);
    });
    
    // Cifrar imagen a texto
    encryptBtn.addEventListener('click', function() {
        if (!originalImage) {
            showStatus('❌ Primero carga una imagen.', 'error');
            return;
        }
        
        if (!encryptKeyPhrase.value) {
            showStatus('❌ Ingresa una clave personal.', 'error');
            return;
        }
        
        if (encryptKeyPhrase.value.length > 128) {
            showStatus('❌ La clave no puede tener más de 128 caracteres.', 'error');
            return;
        }
        
        // Mostrar indicador de procesamiento
        encryptBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Cifrando...';
        encryptBtn.disabled = true;
        
        setTimeout(() => {
            try {
                // Cifrar el texto Base64
                const encryptedBase64 = encryptString(base64String, encryptKeyPhrase.value);
                encryptedText.value = encryptedBase64;
                
                // Actualizar información del texto
                updateTextInfo();
                
                showStatus('✅ Imagen cifrada correctamente a texto.', 'success');
            } catch (error) {
                showStatus('❌ Error al cifrar la imagen: ' + error.message, 'error');
            } finally {
                // Restaurar botón
                encryptBtn.innerHTML = '<i class="fas fa-shield-alt"></i> Cifrar Imagen a Texto';
                encryptBtn.disabled = false;
            }
        }, 100);
    });
    
    // Descargar texto cifrado
    downloadTextBtn.addEventListener('click', function() {
        if (!encryptedText.value) {
            showStatus('❌ No hay texto cifrado para descargar.', 'error');
            return;
        }
        
        // Generar nombre de archivo aleatorio
        const randomId = Math.random().toString(36).substring(2, 10);
        const filename = `imacryptor_cifrado_${randomId}.txt`;
        
        // Crear y descargar archivo
        const blob = new Blob([encryptedText.value], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
        
        showStatus('✅ Texto cifrado descargado correctamente.', 'success');
    });
    
    // Copiar texto al portapapeles - SOLUCIÓN MEJORADA
    copyTextBtn.addEventListener('click', async function() {
        if (!encryptedText.value) {
            showStatus('❌ No hay texto para copiar.', 'error');
            return;
        }

        const text = encryptedText.value;
        const textLength = text.length;

        // Para textos muy largos, ofrecer alternativas
        if (textLength > 100000) {
            showStatus(`⚠️ Texto muy largo (${textLength.toLocaleString()} caracteres). Usa "Descargar Texto Cifrado" para mejor resultado.`, 'error');
            
            // Auto-seleccionar el texto para copia manual
            encryptedText.select();
            encryptedText.setSelectionRange(0, textLength);
            encryptedText.focus();
            
            // Mostrar opción adicional
            setTimeout(() => {
                if (confirm(`El texto es muy largo (${textLength.toLocaleString()} caracteres). ¿Quieres intentar copiarlo de todas formas? Algunos navegadores pueden tener problemas.`)) {
                    attemptCopyText(text);
                }
            }, 500);
            return;
        }

        await attemptCopyText(text);
    });

    // Función para intentar copiar texto
    async function attemptCopyText(text) {
        copyTextBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Copiando...';
        copyTextBtn.disabled = true;

        try {
            // Método 1: Clipboard API moderno
            if (navigator.clipboard && window.isSecureContext) {
                await navigator.clipboard.writeText(text);
                showStatus('✅ Texto copiado al portapapeles correctamente.', 'success');
                return;
            }
            
            // Método 2: Fallback con textarea temporal
            const success = await fallbackCopyText(text);
            if (success) {
                showStatus('✅ Texto copiado al portapapeles correctamente.', 'success');
                return;
            }
            
            // Método 3: Selección manual
            showStatus('❌ No se pudo copiar automáticamente. El texto ha sido seleccionado - usa Ctrl+C para copiar manualmente.', 'error');
            encryptedText.select();
            encryptedText.setSelectionRange(0, text.length);
            encryptedText.focus();
            
        } catch (err) {
            console.error('Error copiando texto:', err);
            showStatus('❌ Error al copiar. Usa "Descargar Texto Cifrado" o copia manualmente.', 'error');
            
            // Seleccionar texto para copia manual
            encryptedText.select();
            encryptedText.setSelectionRange(0, text.length);
            encryptedText.focus();
        } finally {
            copyTextBtn.innerHTML = '<i class="fas fa-copy"></i> Copiar Texto';
            copyTextBtn.disabled = false;
        }
    }

    // Función de fallback mejorada
    function fallbackCopyText(text) {
        return new Promise((resolve) => {
            // Crear textarea temporal
            const textArea = document.createElement('textarea');
            textArea.value = text;
            
            // Estilos para hacerlo invisible pero funcional
            textArea.style.position = 'fixed';
            textArea.style.top = '0';
            textArea.style.left = '0';
            textArea.style.width = '2px';
            textArea.style.height = '2px';
            textArea.style.padding = '0';
            textArea.style.border = 'none';
            textArea.style.outline = 'none';
            textArea.style.boxShadow = 'none';
            textArea.style.background = 'transparent';
            textArea.style.opacity = '0';
            textArea.style.zIndex = '-1';
            
            document.body.appendChild(textArea);
            
            try {
                // Seleccionar texto
                textArea.focus();
                textArea.select();
                textArea.setSelectionRange(0, textArea.value.length);
                
                // Intentar copiar
                const successful = document.execCommand('copy');
                document.body.removeChild(textArea);
                resolve(successful);
            } catch (err) {
                document.body.removeChild(textArea);
                resolve(false);
            }
        });
    }

    // Función para mostrar información del texto
    function updateTextInfo() {
        const textLength = encryptedText.value.length;
        const infoElement = document.getElementById('textInfo') || createTextInfoElement();
        
        let message = `Caracteres: ${textLength.toLocaleString()}`;
        let className = 'text-info';
        
        if (textLength > 200000) {
            message += ' - ⚠️ Texto MUY largo (recomendado: usar descarga)';
            className += ' warning-text';
        } else if (textLength > 50000) {
            message += ' - ℹ️ Texto largo';
            className += ' info-text';
        }
        
        infoElement.textContent = message;
        infoElement.className = className;
    }

    function createTextInfoElement() {
        const infoElement = document.createElement('div');
        infoElement.id = 'textInfo';
        infoElement.className = 'text-info';
        encryptedText.parentNode.insertBefore(infoElement, encryptedText.nextSibling);
        return infoElement;
    }

    // Actualizar información cuando cambie el texto cifrado
    encryptedText.addEventListener('input', updateTextInfo);
    
    // Cargar texto cifrado desde archivo
    textFileInput.addEventListener('change', function(e) {
        const file = e.target.files[0];
        if (!file) return;
        
        // Validar tamaño del archivo (max 10MB)
        if (file.size > 10 * 1024 * 1024) {
            showStatus('❌ El archivo es demasiado grande (máximo 10MB).', 'error');
            return;
        }
        
        const reader = new FileReader();
        reader.onload = function(e) {
            try {
                // Limpiar el contenido del archivo
                let fileContent = e.target.result.trim();
                encryptedTextInput.value = fileContent;
                showStatus('✅ Texto cifrado cargado desde archivo.', 'success');
            } catch (error) {
                showStatus('❌ Error al cargar el archivo.', 'error');
            }
        };
        reader.onerror = function() {
            showStatus('❌ Error al leer el archivo.', 'error');
        };
        reader.readAsText(file);
    });
    
    // Descifrar texto a imagen
    decryptBtn.addEventListener('click', function() {
        if (!encryptedTextInput.value) {
            showStatus('❌ No hay texto cifrado para descifrar.', 'error');
            return;
        }
        
        if (!decryptKeyPhrase.value) {
            showStatus('❌ Ingresa la clave personal para descifrar.', 'error');
            return;
        }
        
        // Mostrar indicador de procesamiento
        decryptBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Descifrando...';
        decryptBtn.disabled = true;
        
        setTimeout(() => {
            try {
                // Limpiar el texto
                const cleanText = encryptedTextInput.value.trim();
                
                // Descifrar el texto
                const decryptedBase64 = decryptString(cleanText, decryptKeyPhrase.value);
                
                // Verificar que es un Base64 válido de imagen
                if (!decryptedBase64.startsWith('data:image/')) {
                    throw new Error('El texto descifrado no es una imagen válida. Verifica la clave.');
                }
                
                // Convertir Base64 descifrado a imagen
                processedImage = new Image();
                processedImage.onload = function() {
                    resultPreview.innerHTML = '';
                    resultPreview.appendChild(processedImage);
                    showStatus('✅ Texto descifrado correctamente a imagen.', 'success');
                };
                processedImage.onerror = function() {
                    throw new Error('No se pudo crear la imagen desde el texto descifrado. Verifica la clave e integridad del texto.');
                };
                processedImage.src = decryptedBase64;
            } catch (error) {
                showStatus('❌ Error al descifrar: ' + error.message, 'error');
            } finally {
                decryptBtn.innerHTML = '<i class="fas fa-image"></i> Descifrar Texto a Imagen';
                decryptBtn.disabled = false;
            }
        }, 100);
    });
    
    // Descargar imagen descifrada
    downloadBtn.addEventListener('click', function() {
        if (!processedImage) {
            showStatus('❌ No hay imagen descifrada para descargar.', 'error');
            return;
        }
        
        const canvas = document.createElement('canvas');
        canvas.width = processedImage.width;
        canvas.height = processedImage.height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(processedImage, 0, 0);
        
        const link = document.createElement('a');
        link.download = 'imacryptor_imagen_descifrada.png';
        link.href = canvas.toDataURL('image/png');
        link.click();
        
        showStatus('✅ Imagen descargada correctamente.', 'success');
    });
    
    // Algoritmos de cifrado/descifrado
    function encryptString(text, key) {
        let result = '';
        for (let i = 0; i < text.length; i++) {
            const charCode = text.charCodeAt(i);
            const keyChar = key.charCodeAt(i % key.length);
            const encryptedChar = charCode ^ keyChar;
            result += String.fromCharCode(encryptedChar);
        }
        return btoa(result);
    }
    
    function decryptString(encryptedText, key) {
        try {
            // Decodificar desde Base64
            const decodedText = atob(encryptedText);
            let result = '';
            
            for (let i = 0; i < decodedText.length; i++) {
                const charCode = decodedText.charCodeAt(i);
                const keyChar = key.charCodeAt(i % key.length);
                const decryptedChar = charCode ^ keyChar;
                result += String.fromCharCode(decryptedChar);
            }
            
            return result;
        } catch (error) {
            throw new Error('Texto cifrado inválido. No es Base64 válido o está corrupto.');
        }
    }
    
    // Función para mostrar mensajes de estado
    function showStatus(message, type) {
        statusMessage.textContent = message;
        statusMessage.className = 'status ' + type;
        statusMessage.classList.remove('hidden');
        
        // Mensajes de error se mantienen más tiempo
        const duration = type === 'error' ? 8000 : 5000;
        
        setTimeout(() => {
            statusMessage.classList.add('hidden');
        }, duration);
    }

    // Inicializar información del texto
    updateTextInfo();
});