# 🔐 ImaCryptor

**Versión:** 1.0  
**Autor:** @Gonzalo-CR  
**Licencia:** MIT  
**Estado:** ✅ Funcional y Mejorado

## 🌟 ¿Qué es ImaCryptor?

ImaCryptor es una aplicación web moderna para cifrado y descifrado de imágenes utilizando claves personales. Convierte tus imágenes en texto cifrado seguro y permite recuperarlas posteriormente con la clave correcta, facilitando el intercambio seguro de imágenes a través de texto.

## 🚀 Características Principales

### 🔒 Sistema de Cifrado Seguro
- 🔑 Cifrado con clave personal de hasta 128 caracteres
- 🔄 Algoritmo XOR + Base64 para protección básica
- 📸 Conversión imagen→texto y texto→imagen
- 💾 Texto cifrado en Base64 para fácil transmisión

### 📁 Gestión de Archivos
- 📤 Carga de imágenes desde tu dispositivo
- 📥 Descarga de texto cifrado como archivo .txt
- 📋 Copiado al portapapeles con un clic
- 📄 Carga de texto cifrado desde archivos .txt

### 🎨 Interfaz Moderna
- 📱 Diseño responsive para desktop y móviles
- 🎯 Interfaz intuitiva dividida en dos secciones claras
- ⚡ Procesamiento local - sin envío a servidores
- 🔔 Notificaciones de estado en tiempo real

## 🛠️ Tecnologías Utilizadas
- **Frontend:** HTML5, CSS3, JavaScript (ES6+)
- **Cifrado:** Algoritmo XOR + codificación Base64
- **Interfaz:** CSS Grid, Flexbox, Variables CSS
- **Iconos:** Font Awesome 6
- **Hosting:** GitHub Pages

## 📱 Cómo Usar

### 🔒 Cifrar una Imagen
1. Selecciona una imagen desde tu dispositivo
2. Ingresa tu clave personal (hasta 128 caracteres)
3. Haz clic en "Cifrar Imagen a Texto"
4. Copia o descarga el texto cifrado generado

### 🔓 Descifrar una Imagen
1. Ingresa la clave utilizada para el cifrado
2. Pega el texto cifrado o carga un archivo .txt
3. Haz clic en "Descifrar Texto a Imagen"
4. Descarga la imagen recuperada

### 📋 Flujo de Trabajo
- Comparte imágenes de forma segura mediante texto cifrado
- Almacena configuraciones en archivos .txt
- Recupera imágenes originales con la clave correcta

## 🚀 Instalación y Uso

### 🌐 Modo Web (Recomendado)
1. Accede a la versión online en:  
   **https://gonzalo-cr.github.io/ImaCryptor/**
2. No requiere instalación - funciona directamente en tu navegador
3. Siempre actualizada con la última versión

### 💻 Modo Local
1. Clona o descarga este repositorio
```bash
git clone https://github.com/Gonzalo-CR/ImaCryptor.git
cd ImaCryptor
```
2. Abre el archivo `index.html` en tu navegador
3. ¡Listo! La aplicación funciona completamente offline

## 📂 Estructura del Proyecto
```
ImaCryptor/
├── index.html          # Interfaz principal de la aplicación
├── style.css           # Estilos modernos y responsive
├── script.js           # Lógica de cifrado/descifrado
└── README.md           # Este archivo de documentación
```

## 🏗️ Arquitectura
- Procesamiento 100% local - sin dependencias externas
- Algoritmo XOR mejorado con rotación de clave
- Manejo de errores robusto para entradas inválidas
- Interfaz de usuario intuitiva con feedback inmediato

## 🔐 Algoritmo de Cifrado

ImaCryptor utiliza un algoritmo XOR combinado con codificación Base64:

```javascript
function encryptString(text, key) {
    let result = '';
    for (let i = 0; i < text.length; i++) {
        const charCode = text.charCodeAt(i);
        const keyChar = key.charCodeAt(i % key.length);
        const encryptedChar = charCode ^ keyChar;
        result += String.fromCharCode(encryptedChar);
    }
    return btoa(result); // Conversión a Base64
}
```

## ✨ Características de Seguridad
- ✅ Cifrado XOR para protección básica
- ✅ Claves hasta 128 caracteres para mayor seguridad
- ✅ Procesamiento local - tus datos no salen de tu dispositivo
- ✅ Sin almacenamiento en servidores - total privacidad
- ✅ Validación de integridad durante el descifrado

## 🎨 Novedades en Versión 1.0

### 🔧 Características Técnicas
- ✅ Interfaz moderna con diseño basado en tarjetas
- ✅ Animaciones suaves y transiciones CSS3
- ✅ Responsive design optimizado para móviles
- ✅ Manejo de errores mejorado y descriptivo
- ✅ Compatibilidad cross-browser probada

### 📱 Experiencia de Usuario
- ✅ Iconografía consistente con Font Awesome
- ✅ Notificaciones de estado claras y visibles
- ✅ Procesamiento rápido incluso con imágenes grandes
- ✅ Feedback visual durante las operaciones
- ✅ Instrucciones intuitivas integradas en la interfaz

## 🌐 Compatibilidad

| Navegador | Versión | Estado |
|-----------|---------|--------|
| Chrome    | 90+     | ✅ Completamente compatible |
| Firefox   | 88+     | ✅ Completamente compatible |
| Safari    | 14+     | ✅ Completamente compatible |
| Edge      | 90+     | ✅ Completamente compatible |

## 🚧 Próximas Mejoras
- Múltiples algoritmos de cifrado (AES, ChaCha20)
- Compresión de imágenes antes del cifrado
- Metadatos EXIF preservados en el proceso
- Historial de operaciones recientes
- Modo oscuro opcional
- Soporte para más formatos de imagen (WebP, HEIC)
- Cifrado por lotes de múltiples imágenes

## 🤝 Contribuciones

¡Las contribuciones son bienvenidas! Algunas áreas de mejora:
- Implementar algoritmos de cifrado más avanzados
- Mejorar la validación y manejo de errores
- Optimizar el rendimiento con imágenes muy grandes
- Agregar tests unitarios y de integración
- Mejorar la accesibilidad (ARIA labels, contraste)

## 📋 Requisitos del Sistema
- **Navegador moderno:** Chrome 90+, Firefox 88+, Safari 14+, Edge 90+
- **JavaScript habilitado** (requerido para el funcionamiento)
- **Almacenamiento local:** para imágenes y texto temporal
- **Permisos de archivo:** para cargar/descargar archivos

## 🇦🇷 Hecho con Orgullo

Desarrollado desde Argentina 🇦🇷 por **Gonzalo-CR**, con enfoque en privacidad, usabilidad y experiencia de usuario moderna.

## 📄 Licencia

Este proyecto está bajo la licencia MIT. Ver `LICENSE` para más detalles.

---

⭐ **¿Te gusta ImaCryptor? ¡Dale una estrella al repositorio!**