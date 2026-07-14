[⬅️ Volver al inicio](/README.md)
## 4. PLAN DE CALIDAD DEL SOFTWARE

### 4.1. Perfil de calidad ISO 25010
Se priorizan tres características críticas (no negociables):
1. **Fiabilidad (Objetivo: Nivel 5):** *Métrica: Tasa de falla en concurrencia (0 cruces).* Si el sistema permite doble reserva, habrá conflictos en el campus.
2. **Usabilidad (Objetivo: Nivel 4):** *Métrica: CSAT (> 85%) en vigilantes.* La interfaz móvil debe ser extremadamente intuitiva.
3. **Eficiencia de Desempeño (Objetivo: Nivel 4):** *Métrica: P95 Latency < 2 segundos.* Fundamental en conexiones móviles inestables.

### 4.2. Plan SQA con enfoque Shift Left
Se distribuyen 6 actividades SQA proactivas:
1. **Modelado de Requisitos (Shift Left):** Validación lógica de Historias de Usuario.
2. **Pruebas de Usabilidad UI (Shift Left):** Testeo de prototipos Figma con vigilantes reales.
3. **Análisis Estático de Código (Shift Left):** Uso de SonarCloud en cada *Pull Request*.
4. **Peer Review:** Revisión de código obligatoria entre Devs.
5. **Pruebas de Integración:** Verificación de cruces de horarios en BD.
6. **UAT (Pruebas de Aceptación):** Demostración final con la DGA.

### 4.3. Costo de calidad estimado (Regla 1-10-100)
El esfuerzo se distribuirá invirtiendo un **60% en Prevención, 30% en Detección y 10% en Corrección**. Justificado en la regla 1-10-100: "Cuesta 1 unidad prevenir un error en Figma, 10 detectarlo en pruebas, y 100 arreglarlo en producción".
