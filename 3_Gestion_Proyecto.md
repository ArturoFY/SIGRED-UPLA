## 3. PLAN DE GESTIÓN DEL PROYECTO

### 3.1. Cronograma macro
| Fase / Sprint | Duración | Entregable de Cierre (Hito) |
| :--- | :---: | :--- |
| **Sprint 0:** Setup y Arq. | 1 sem | *Product Backlog* priorizado y Prototipos Figma. |
| **Sprint 1:** Cimientos | 2 sem | **MVP 1:** Módulo de Autenticación y Calendario. |
| **Sprint 2:** Transaccional | 2 sem | **MVP 2:** Formulario de Reservas y carga de PDF. |
| **Sprint 3:** Admin. DGA | 2 sem | **MVP 3:** Panel de aprobación/rechazo DGA. |
| **Sprint 4:** Vigilancia | 2 sem | **MVP 4:** App móvil de vigilancia y asistencia. |
| **Sprint 5:** Negocio | 2 sem | **MVP 5:** Motor de penalidades y Dashboard. |
| **Sprint 6:** Despliegue | 2 sem | **Release 1.0** y Acta de Cierre. |

### 3.2. Estimación de recursos
* **Presupuesto Equivalente:** S/ 24,000.00 (Costo de oportunidad estimado: 960 horas-hombre x S/ 25.00/hora. Herramientas = S/ 0).

| Sprint | ID | Historia de Usuario | Puntos |
| :---: | :--- | :--- | :---: |
| **Sp 1** | HU-01 | **Como** estudiante, **quiero** iniciar sesión con correo `@upla.edu.pe` **para** acceder seguro. | 3 |
| **Sp 1** | HU-02 | **Como** solicitante, **quiero** ver el calendario **para** conocer disponibilidad. | 5 |
| **Sp 2** | HU-03 | **Como** estudiante, **quiero** llenar un formulario y adjuntar PDF **para** solicitar reserva. | 8 |
| **Sp 2** | HU-04 | **Como** solicitante, **quiero** cancelar mi reserva **para** liberar la cancha a tiempo. | 3 |
| **Sp 3** | HU-05 | **Como** DGA, **quiero** ver solicitudes pendientes **para** aprobarlas o rechazarlas. | 5 |
| **Sp 3** | HU-06 | **Como** DGA, **quiero** configurar horarios fijos **para** garantizar espacio de clases. | 5 |
| **Sp 4** | HU-07 | **Como** vigilante, **quiero** ver reservas del día en celular **para** dar acceso rápido. | 5 |
| **Sp 4** | HU-08 | **Como** vigilante, **quiero** presionar un botón **para** registrar asistencia exacta. | 3 |
| **Sp 5** | HU-09 | **Como** sistema, **quiero** bloquear a los ausentes **para** penalizar reservas fantasma. | 8 |
| **Sp 5** | HU-10 | **Como** DGA, **quiero** visualizar un dashboard **para** tomar decisiones. | 5 |
| | | **Velocidad Esperada: 10 Pts / Sprint** | **Total: 50 Pts** |

### 3.3. Plan de gestión de riesgos
| Riesgo | Probabilidad / Impacto | Mitigación | Indicador de Materialización |
| :--- | :--- | :--- | :--- |
| **1. Resistencia al uso móvil** | Media / Alto | Diseño ultra-sencillo y sugerir dotación de tablets. | Encuestas de quejas por vigilantes. |
| **2. Cruce de horarios del equipo** | Alta / Medio | Reforzar Daily Scrum asíncrono y *Pair Programming*. | Reducción de *Velocity*. |
| **3. Archivos adjuntos falsos** | Alta / Medio | Validación visual por DGA. | Incremento de reservas canceladas en puerta. |
| **4. Caída de servidores gratuitos** | Media / Alto | Uso de bases de datos distribuidas y caching. | Monitoreo Sentry con > 3 caídas por semana. |

### 3.4. Sistema de métricas y control
1. **SPI de Valor (Schedule Performance Index EVM):** `SPI = EV / PV`. *Alerta: SPI < 0.85 sostenido.*
2. **Índice de Costo de Oportunidad (CPI EVM):** `CPI = EV / AC`. *Alerta: CPI < 0.85.*
3. **Velocidad Ágil (Velocity):** Story Points completados por Sprint. *Alerta: Variación > 30% entre Sprints.*
4. **Gráfico de Trabajo Pendiente (Sprint Burndown):** Tasa de consumo diario. *Alerta: Línea real sobre la ideal por 3 días.*
