

# 📋 Proyecto CAT
**Sistema de Gestión de Casos y Bajas para Call Center**

---


## 🚀 Despliegue Web

[Ver proyecto en vivo - Desplegado en Vercel](https://call-center-analytics-tool-jggz.vercel.app/)


## �📖 Descripción del Proyecto

Proyecto CAT es una aplicación de escritorio multiplataforma desarrollada con React, Vite y Electron, diseñada específicamente para optimizar la gestión de casos y bajas en entornos de call center. La aplicación combina una interfaz moderna y minimalista con funcionalidades avanzadas de análisis de datos, ofreciendo una solución completa para el seguimiento y administración de la actividad operativa.

El proyecto implementa un sistema de persistencia local que permite el trabajo offline, dashboards interactivos con visualizaciones gráficas en tiempo real, y una arquitectura de componentes escalable que facilita el mantenimiento y la extensión de funcionalidades.

---

## 🛠️ Tecnologías y Librerías Utilizadas

- **React 19.1.0** - Framework principal de JavaScript para interfaces de usuario
- **Vite 7.0.4** - Herramienta de build ultra-rápida y servidor de desarrollo
- **Electron 30.5.1** - Framework para aplicaciones de escritorio multiplataforma
- **electron-builder 26.0.12** - Empaquetado y distribución de aplicaciones Electron
- **xlsx 0.18.5** - Exportación de datos a formatos Excel/CSV
- **ESLint 9.30.1** - Linting y aseguramiento de calidad de código
- **Lucide React** - Biblioteca de iconos moderna y consistente
- **CSS Custom Properties** - Theming dinámico y variables CSS nativas

---

## ✨ Características Implementadas

### 🏗️ Arquitectura
- Componentes reutilizables con separación clara de responsabilidades
- Sistema de theming con CSS Custom Properties
- Persistencia de datos con localStorage y sincronización automática
- Arquitectura modular escalable para futuras extensiones
- Manejo de estado local optimizado con React Hooks

### 📊 Dashboard y Visualización
- Dashboard interactivo con métricas diarias y mensuales
- Gráficos de barras y torta personalizados con SVG nativo
- Filtros temporales con navegación por año, mes y día
- Desglose estadístico por motivos de bajas y estados de casos
- Visualización responsiva adaptable a diferentes resoluciones

### 🗃️ Gestión de Datos
- Sistema CRUD completo para casos y bajas
- Paginación inteligente con configuración de registros por página
- Búsqueda y filtrado en tiempo real por múltiples criterios
- Exportación de datos a Excel/CSV con codificación UTF-8
- Validación de formularios y manejo de errores

### 💼 Funcionalidades de Negocio
- Seguimiento de casos con estados (Abierto/Cerrado)
- Registro de intentos de retención (Sí/No)
- Clasificación de bajas por motivo y servicio
- Gestión temporal con organización por fechas
- Historial completo de actividad

### 📱 Diseño Responsivo
- Breakpoints específicos: 600px, 900px
- Interfaz adaptativa para tablets y dispositivos móviles
- Sidebar colapsable en pantallas pequeñas
- Tablas con scroll horizontal en dispositivos móviles
- Tipografía escalable y espaciado responsivo

### 🎨 Interfaz de Usuario
- Diseño minimalista con principios de Material Design
- Tema claro con alta legibilidad y contraste
- Animaciones suaves y transiciones CSS optimizadas
- Componentes interactivos con feedback visual inmediato
- Modales de confirmación para acciones críticas

---

## 🗂️ Estructura del Proyecto

```
cat-project/
├── electron/
│   └── main.js              # Proceso principal de Electron
├── src/
│   ├── components/          # Componentes reutilizables
│   │   ├── BajasForm.jsx    # Formulario de registro de bajas
│   │   ├── CasosTable.jsx   # Tabla de gestión de casos
│   │   ├── TableManager.jsx # Componente tabla reutilizable
│   │   ├── Dashboard.jsx    # Dashboard principal con gráficos
│   │   ├── Header.jsx       # Barra de navegación superior
│   │   ├── Sidebar.jsx      # Navegación lateral
│   │   ├── ConfirmModal.jsx # Modal de confirmación
│   │   ├── Toast.jsx        # Notificaciones de usuario
│   │   └── UserSettings.jsx # Configuración de usuario
│   ├── pages/               # Páginas principales de la aplicación
│   │   ├── Casos.jsx        # Página de gestión de casos
│   │   ├── Bajas.jsx        # Página de registro de bajas
│   │   ├── DashboardGeneral.jsx  # Dashboard principal
│   │   ├── DashboardCasos.jsx    # Dashboard específico de casos
│   │   └── DashboardBajas.jsx    # Dashboard específico de bajas
│   ├── App.jsx              # Componente raíz con enrutamiento
│   ├── main.jsx             # Punto de entrada de React
│   ├── index.css            # Estilos globales base
│   ├── App.css              # Estilos del componente principal
│   └── theme.css            # Variables CSS y theming
├── package.json             # Dependencias y scripts del proyecto
├── vite.config.js           # Configuración de Vite
├── eslint.config.js         # Configuración de ESLint
└── README.md                # Documentación del proyecto
```

---

## 🎯 Funcionalidades Principales

### 📈 Dashboard Analytics
- **Vista Diaria**: Métricas en tiempo real del día seleccionado
- **Vista Mensual**: Análisis consolidado por mes con tendencias
- **Filtros Temporales**: Navegación fluida entre años, meses y días
- **Gráficos Interactivos**: Visualizaciones SVG personalizadas y responsivas

### 🔄 Gestión de Casos
- **Estados**: Seguimiento de casos Abiertos/Cerrados
- **Retención**: Registro de intentos de retención exitosos/fallidos
- **Edición en línea**: Modificación directa desde la tabla
- **Búsqueda avanzada**: Filtros por estado, retención y texto libre

### 📝 Registro de Bajas
- **Motivos**: Clasificación detallada de motivos de baja
- **Servicios**: Asociación a servicios específicos
- **Gestión**: Campo de observaciones para el agente
- **Trazabilidad**: Historial completo de bajas por período

---

## 🚧 Desafíos Técnicos Resueltos

### 1. **Persistencia de Datos Local**
- **Problema**: Necesidad de trabajo offline sin base de datos
- **Solución**: Sistema robusto con localStorage y estructura JSON jerarquizada

### 2. **Paginación con Filtros**
- **Problema**: Mantener paginación consistente con filtros dinámicos
- **Solución**: Componente TableManager reutilizable con estado de paginación inteligente

### 3. **Visualización de Datos**
- **Problema**: Gráficos interactivos sin librerías pesadas externas
- **Solución**: Implementación de gráficos SVG nativos con React

### 4. **Responsive Design Complejo**
- **Problema**: Interfaz compleja adaptable a múltiples dispositivos
- **Solución**: Sistema de breakpoints con CSS Grid y Flexbox avanzado

### 5. **Empaquetado Electron**
- **Problema**: Distribución segura y profesional de la aplicación
- **Solución**: Configuración avanzada de electron-builder con instaladores NSIS

---

## 🔧 Instalación y Desarrollo

```bash
# Clonar el repositorio
git clone [URL_DEL_REPOSITORIO]

# Instalar dependencias
npm install

# Ejecutar en modo desarrollo (web)
npm run dev

# Ejecutar aplicación de escritorio
npm run desktop

# Construir para producción
npm run build

# Generar instalador de escritorio
npm run dist

# Linting de código
npm run lint
```

---

## 📦 Distribución

La aplicación genera un instalador ejecutable (`Setup.exe`) que incluye:

---

## 💻 Compatibilidad

- **Sistemas Operativos**: Windows 10/11, macOS, Linux
- **Navegadores** (modo web): Chrome, Firefox, Safari, Edge
- **Resoluciones**: Desde 320px (móvil) hasta 4K+ (escritorio)
- **Dispositivos**: Móviles, tablets, laptops, monitores ultra-wide

---

## 🎨 Principios de Diseño Aplicados

- **DRY (Don't Repeat Yourself)**: Componentes reutilizables y funciones auxiliares
- **SOLID**: Separación de responsabilidades y extensibilidad
- **Mobile First**: Diseño responsive desde móviles hacia escritorio
- **Accessibility**: Contrastes adecuados y navegación por teclado
- **Performance**: Componentes optimizados y lazy loading donde aplique

---

## 📄 Licencia

Este proyecto está bajo la licencia MIT - ver el archivo LICENSE para más detalles.

---

## 👤 Autor

Desarrollado por **[Ian Gorski]**  
📧 [gorskiandev@gmail.com]  
🐙 [GitHub](https://github.com/IanGorski)
