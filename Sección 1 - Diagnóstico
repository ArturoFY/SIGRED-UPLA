## 1. DIAGNÓSTICO DE LA ORGANIZACIÓN

### 1.1. Presentación de la organización
La organización objeto de este plan es la **Universidad Peruana Los Andes (UPLA)**, enfocando la intervención en su sede principal (Huancayo, Junín)[cite: 3]. Dentro del organigrama, el proyecto está dirigido a la **Dirección General de Administración (DGA)** y al Área de Seguridad y Vigilancia[cite: 3].
* **Rubro:** Educación Superior Universitaria[cite: 3].
* **Antigüedad:** Fundada el 30 de diciembre de 1983 (más de 40 años)[cite: 3].
* **Tamaño:** Población estudiantil que supera los 20,000 alumnos, además de cientos de docentes y administrativos[cite: 3].

**Procesos core relevantes al proyecto[cite: 3]:**
1. *Gestión de Infraestructura y Bienestar Deportivo:* Administración de tres canchas techadas (dos de futsal sintético y una de vóley)[cite: 3].
2. *Gestión Documentaria (DGA):* Recepción y evaluación de solicitudes físicas para uso de espacios[cite: 3].
3. *Control de Accesos y Seguridad:* Proceso operativo de validación de identidad en puertas mediante listas informales (WhatsApp)[cite: 3].

### 1.2. Análisis del contexto organizacional
Aplicando las variables de Sommerville (2019)[cite: 4]:
* **a. Cultura organizacional:** La DGA posee una cultura jerárquica y formal, con baja tolerancia a la ambigüedad y fuerte dependencia del papel[cite: 3]. En contraste, el estudiantado demanda procesos digitales ágiles[cite: 3].
* **b. Madurez del equipo de TI:** El equipo es interno (4 estudiantes de ingeniería)[cite: 3]. Poseen sólidos conocimientos tecnológicos y de herramientas, pero están en una etapa formativa respecto al despliegue corporativo[cite: 3].
* **c. Naturaleza del producto:** Sistema web de gestión transaccional con nivel de criticidad medio-bajo[cite: 3]. Usuarios heterogéneos (jóvenes digitales vs. vigilantes operativos)[cite: 3].
* **d. Restricciones de negocio:** Cliente interno (DGA), presupuesto económico cero (uso de herramientas Open Source) y un plazo condicionado al ciclo académico (aprox. 3 a 4 meses)[cite: 3].

### 1.3. Identificación de la necesidad
El proceso actual adolece de ineficiencias (Dumas et al., 2018): alta latencia, reservas fantasma por falta de penalidades automatizadas y control de acceso deficiente (Pressman & Maxim, 2020)[cite: 3]. 

**Alcance funcional (Módulos)[cite: 3]:**
1. Módulo de Autenticación y Control de Accesos (RBAC)[cite: 3].
2. Módulo de Calendario Interactivo y Disponibilidad[cite: 3].
3. Módulo de Gestión de Reservas (Portal del Solicitante)[cite: 3].
4. Módulo de Administración y Flujo de Aprobación (Panel DGA)[cite: 3].
5. Módulo de Control de Acceso Mobile (App Vigilancia)[cite: 3].
6. Módulo de Penalidades Automatizadas (Motor Lógico)[cite: 3].
7. Módulo de Reportes y Estadísticas (Dashboard DGA)[cite: 3].

**Roles del sistema:** 1) Solicitante (Estudiantes/Docentes), 2) Administrador (Secretaría DGA), 3) Validador (Vigilantes)[cite: 3].

### 1.4. Especificación de Requisitos (RF, RNF, RC)
**Requisitos Funcionales (RF):**
* **RF-01:** El sistema debe autenticar a los usuarios únicamente con el dominio `@upla.edu.pe`.
* **RF-02:** El sistema debe permitir visualizar un calendario semanal con la disponibilidad de las 3 canchas.
* **RF-03:** El sistema debe permitir al solicitante crear una reserva adjuntando un documento en formato PDF/JPG (máx 5MB)[cite: 3].
* **RF-04:** El sistema debe permitir a la DGA visualizar solicitudes, descargar anexos y emitir estado "Aprobado" o "Rechazado"[cite: 3].
* **RF-05:** El sistema debe proveer a los vigilantes una interfaz móvil que liste las reservas aprobadas del día en curso[cite: 3].
* **RF-06:** El sistema debe permitir al vigilante marcar "Asistió" o "No Asistió"[cite: 3].
* **RF-07:** El sistema debe generar reportes estadísticos básicos de uso para la DGA[cite: 3].

**Requisitos No Funcionales (RNF):**
* **RNF-01 (Usabilidad):** La interfaz del vigilante debe seguir el patrón *Mobile-First*, con botones de al menos 44x44 píxeles[cite: 3].
* **RNF-02 (Seguridad):** Las contraseñas deben almacenarse usando un algoritmo de hash seguro.
* **RNF-03 (Desempeño):** El calendario debe cargar la disponibilidad semanal en un tiempo (P95) menor a 2 segundos[cite: 7].

**Reglas de Negocio / Control (RC):**
* **RC-01 (Cancelación):** Un usuario solo puede cancelar su reserva aprobada con un mínimo de 2 horas de anticipación.
* **RC-02 (Penalidad):** Si el vigilante registra "No Asistió", el sistema bloqueará automáticamente al usuario para nuevas reservas por 7 días calendario[cite: 3].
* **RC-03 (Límite):** Un usuario no puede acumular más de 4 horas de reservas aprobadas en una misma semana.
* **RC-04 (Prioridad):** Los "Horarios Fijos" (clases) ingresados por la DGA tienen prioridad absoluta y bloquean el calendario[cite: 3].
