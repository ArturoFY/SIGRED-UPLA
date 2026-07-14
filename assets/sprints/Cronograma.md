[🏠 Volver al menú principal](../../README.md)

---
# 📅 Cronograma de Sprints (SIGRED-UPLA)

Este documento centraliza el progreso iterativo del proyecto bajo el marco de trabajo Scrum. Cada Sprint tuvo una duración fija (Timeboxing) de 2 semanas, buscando entregar un Incremento de Producto (MVP) funcional en cada iteración para validación de la DGA.

### 📊 Diagrama de Gantt del Proyecto

El siguiente gráfico ilustra la línea de tiempo de ejecución de nuestras iteraciones, desde la configuración inicial hasta el despliegue en producción.

```mermaid
gantt
    title Cronograma de Proyecto: SIGRED-UPLA
    dateFormat YYYY-MM-DD
    axisFormat %d %b
    
    section Fase Inicial
    Sprint 0 (Setup y Arquitectura)     :s0, 2026-04-06, 7d
    
    section Desarrollo (MVP)
    Sprint 1 (Cimientos y Autent.)      :s1, after s0, 14d
    Sprint 2 (Motor Transaccional)      :s2, after s1, 14d
    Sprint 3 (Administración DGA)       :s3, after s2, 14d
    Sprint 4 (Interfaz Vigilancia)      :s4, after s3, 14d
    Sprint 5 (Lógica y Dashboard)       :s5, after s4, 14d
    
    section Estabilización
    Sprint 6 (Despliegue y Cierre)      :s6, after s5, 14d
