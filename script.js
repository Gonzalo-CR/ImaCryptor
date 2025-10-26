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
        
        const reader = new FileReader();
        reader.onload = function(e) {
            originalImage = new Image();
            originalImage.onload = function() {
                imagePreview.innerHTML = '';
                imagePreview.appendChild(originalImage);
                
                // Guardar el Base64 de la imagen
                base64String = e.target.result;
            };
            originalImage.src = e.target.result;
        };
        reader.readAsDataURL(file);
        
        showStatus('Imagen cargada correctamente.', 'success');
    });
    
    // Cifrar imagen a texto
    encryptBtn.addEventListener('click', function() {
        if (!originalImage) {
            showStatus('Primero carga una imagen.', 'error');
            return;
        }
        
        if (!encryptKeyPhrase.value) {
            showStatus('Ingresa una clave personal.', 'error');
            return;
        }
        
        if (encryptKeyPhrase.value.length > 128) {
            showStatus('La clave no puede tener más de 128 caracteres.', 'error');
            return;
        }
        
        try {
            // Cifrar el texto Base64
            const encryptedBase64 = encryptString(base64String, encryptKeyPhrase.value);
            encryptedText.value = encryptedBase64;
            
            showStatus('Imagen cifrada correctamente a texto.', 'success');
        } catch (error) {
            showStatus('Error al cifrar la imagen: ' + error.message, 'error');
        }
    });
    
    // Descargar texto cifrado
    downloadTextBtn.addEventListener('click', function() {
        if (!encryptedText.value) {
            showStatus('No hay texto cifrado para descargar.', 'error');
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
        
        showStatus('Texto cifrado descargado correctamente.', 'success');
    });
    
    // Copiar texto al portapapeles
    copyTextBtn.addEventListener('click', function() {
        if (!encryptedText.value) {
            showStatus('No hay texto para copiar.', 'error');
            return;
        }
        
        encryptedText.select();
        encryptedText.setSelectionRange(0, 99999); // Para dispositivos móviles
        
        try {
            const successful = document.execCommand('copy');
            if (successful) {
                showStatus('Texto copiado al portapapeles.', 'success');
            } else {
                showStatus('Error al copiar el texto.', 'error');
            }
        } catch (err) {
            // Fallback para navegadores modernos
            navigator.clipboard.writeText(encryptedText.value).then(function() {
                showStatus('Texto copiado al portapapeles.', 'success');
            }, function() {
                showStatus('Error al copiar el texto.', 'error');
            });
        }
    });
    
    // Cargar texto cifrado desde archivo
    textFileInput.addEventListener('change', function(e) {
        const file = e.target.files[0];
        if (!file) return;
        
        const reader = new FileReader();
        reader.onload = function(e) {
            // Limpiar el contenido del archivo para eliminar caracteres extraños
            let fileContent = e.target.result;
            // Eliminar posibles saltos de línea y espacios extra al principio/final
            fileContent = fileContent.trim();
            encryptedTextInput.value = fileContent;
            showStatus('Texto cifrado cargado desde archivo.', 'success');
        };
        reader.readAsText(file);
    });
    
    // Descifrar texto a imagen
    decryptBtn.addEventListener('click', function() {
        if (!encryptedTextInput.value) {
            showStatus('No hay texto cifrado para descifrar.', 'error');
            return;
        }
        
        if (!decryptKeyPhrase.value) {
            showStatus('Ingresa la clave personal para descifrar.', 'error');
            return;
        }
        
        try {
            // Limpiar el texto de posibles caracteres extraños
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
                showStatus('Texto descifrado correctamente a imagen.', 'success');
            };
            processedImage.onerror = function() {
                showStatus('Error: No se pudo crear la imagen desde el texto descifrado. Verifica la clave.', 'error');
            };
            processedImage.src = decryptedBase64;
        } catch (error) {
            showStatus('Error al descifrar el texto: ' + error.message, 'error');
        }
    });
    
    // Descargar imagen descifrada
    downloadBtn.addEventListener('click', function() {
        if (!processedImage) {
            showStatus('No hay imagen descifrada para descargar.', 'error');
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
        
        showStatus('Imagen descargada correctamente.', 'success');
    });
    
    // Algoritmos de cifrado/descifrado (del código que funciona)
    function encryptString(text, key) {
        let result = '';
        for (let i = 0; i < text.length; i++) {
            const charCode = text.charCodeAt(i);
            const keyChar = key.charCodeAt(i % key.length);
            const encryptedChar = charCode ^ keyChar;
            result += String.fromCharCode(encryptedChar);
        }
        return btoa(result); // Convertir a Base64 para hacerlo "transmisible"
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
            throw new Error('Texto cifrado inválido. No es Base64 válido.');
        }
    }
    
    // Función para mostrar mensajes de estado
    function showStatus(message, type) {
        statusMessage.textContent = message;
        statusMessage.className = 'status ' + type;
        statusMessage.classList.remove('hidden');
        
        setTimeout(() => {
            statusMessage.classList.add('hidden');
        }, 5000);
    }
});