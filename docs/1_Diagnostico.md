[⬅️ Volver al inicio](/README.md)
## 1. DIAGNÓSTICO DE LA ORGANIZACIÓN

### 1.1. Presentación de la organización
La organización objeto de este plan es la **Universidad Peruana Los Andes (UPLA)**, enfocando la intervención en su sede principal (Huancayo, Junín). Dentro del organigrama, el proyecto está dirigido a la **Dirección General de Administración (DGA)** y al Área de Seguridad y Vigilancia.
* **Rubro:** Educación Superior Universitaria.
* **Antigüedad:** Fundada el 30 de diciembre de 1983 (más de 40 años).
* **Tamaño:** Población estudiantil que supera los 20,000 alumnos, además de cientos de docentes y administrativos.

**Procesos core relevantes al proyecto:**
1. *Gestión de Infraestructura y Bienestar Deportivo:* Administración de tres canchas techadas (dos de futsal sintético y una de vóley).
2. *Gestión Documentaria (DGA):* Recepción y evaluación de solicitudes físicas para uso de espacios.
3. *Control de Accesos y Seguridad:* Proceso operativo de validación de identidad en puertas mediante listas informales (WhatsApp).

### 1.2. Análisis del contexto organizacional
Aplicando las variables de Sommerville (2019):
* **a. Cultura organizacional:** La DGA posee una cultura jerárquica y formal, con baja tolerancia a la ambigüedad y fuerte dependencia del papel. En contraste, el estudiantado demanda procesos digitales ágiles.
* **b. Madurez del equipo de TI:** El equipo es interno (4 estudiantes de ingeniería). Poseen sólidos conocimientos tecnológicos y de herramientas, pero están en una etapa formativa respecto al despliegue corporativo.
* **c. Naturaleza del producto:** Sistema web de gestión transaccional con nivel de criticidad medio-bajo. Usuarios heterogéneos (jóvenes digitales vs. vigilantes operativos).
* **d. Restricciones de negocio:** Cliente interno (DGA), presupuesto económico cero (uso de herramientas Open Source) y un plazo condicionado al ciclo académico (aprox. 3 a 4 meses).

### 1.3. Identificación de la necesidad
El proceso actual adolece de ineficiencias (Dumas et al., 2018): alta latencia, reservas fantasma por falta de penalidades automatizadas y control de acceso deficiente (Pressman & Maxim, 2020). 

**Alcance funcional (Módulos):**
1. Módulo de Autenticación y Control de Accesos (RBAC).
2. Módulo de Calendario Interactivo y Disponibilidad.
3. Módulo de Gestión de Reservas (Portal del Solicitante).
4. Módulo de Administración y Flujo de Aprobación (Panel DGA).
5. Módulo de Control de Acceso Mobile (App Vigilancia).
6. Módulo de Penalidades Automatizadas (Motor Lógico).
7. Módulo de Reportes y Estadísticas (Dashboard DGA).

**Roles del sistema:** 1) Solicitante (Estudiantes/Docentes), 2) Administrador (Secretaría DGA), 3) Validador (Vigilantes).

### 1.4. Especificación de Requisitos (RF, RNF, RC)
**Requisitos Funcionales (RF):**
* **RF-01:** El sistema debe autenticar a los usuarios únicamente con el dominio `@upla.edu.pe`.
* **RF-02:** El sistema debe permitir visualizar un calendario semanal con la disponibilidad de las 3 canchas.
* **RF-03:** El sistema debe permitir al solicitante crear una reserva adjuntando un documento en formato PDF/JPG (máx 5MB).
* **RF-04:** El sistema debe permitir a la DGA visualizar solicitudes, descargar anexos y emitir estado "Aprobado" o "Rechazado".
* **RF-05:** El sistema debe proveer a los vigilantes una interfaz móvil que liste las reservas aprobadas del día en curso.
* **RF-06:** El sistema debe permitir al vigilante marcar "Asistió" o "No Asistió".
* **RF-07:** El sistema debe generar reportes estadísticos básicos de uso para la DGA.

**Requisitos No Funcionales (RNF):**
* **RNF-01 (Usabilidad):** La interfaz del vigilante debe seguir el patrón *Mobile-First*, con botones de al menos 44x44 píxeles.
* **RNF-02 (Seguridad):** Las contraseñas deben almacenarse usando un algoritmo de hash seguro.
* **RNF-03 (Desempeño):** El calendario debe cargar la disponibilidad semanal en un tiempo (P95) menor a 2 segundos.

**Reglas de Negocio / Control (RC):**
* **RC-01 (Cancelación):** Un usuario solo puede cancelar su reserva aprobada con un mínimo de 2 horas de anticipación.
* **RC-02 (Penalidad):** Si el vigilante registra "No Asistió", el sistema bloqueará automáticamente al usuario para nuevas reservas por 7 días calendario.
* **RC-03 (Límite):** Un usuario no puede acumular más de 4 horas de reservas aprobadas en una misma semana.
* **RC-04 (Prioridad):** Los "Horarios Fijos" (clases) ingresados por la DGA tienen prioridad absoluta y bloquean el calendario.
