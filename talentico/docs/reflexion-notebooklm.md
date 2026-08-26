# Documento Reflexivo: Uso de NotebookLM en el Proyecto JobConnect 📝

Este documento presenta una reflexión y análisis crítico sobre el impacto, beneficios y aprendizajes obtenidos al utilizar **NotebookLM** como herramienta de apoyo obligatorio en cada una de las fases de desarrollo de **JobConnect**.

---

## 1. Fase 1: Planificación (Investigación del Dominio)

Durante la planificación, el equipo cargó la documentación oficial de la API de DummyJSON, la especificación de Fetch API de MDN y artículos del dominio de empleabilidad/reclutamiento como fuentes primarias en NotebookLM.

- **Impacto y Apoyo**:
  - Permitió comprender rápidamente cómo mapear los datos genéricos devueltos por la API (como `/users` o `/carts`) a entidades reales del negocio de reclutamiento (Candidatos y Empresas).
  - Ayudó a definir las diferencias estructurales y operativas entre los métodos `PUT` y `PATCH`, lo cual guio el diseño de las firmas de los endpoints y los controladores del frontend.
- **Aprendizaje**: NotebookLM facilitó la síntesis de documentación técnica compleja, evitando que el equipo tuviese que buscar en múltiples sitios web de forma manual.

---

## 2. Fase 2: Desarrollo (Resolución de Conflictos y Dudas Técnicas)

En la fase de programación, los desarrolladores (C2, C3 y C4) utilizaron NotebookLM para resolver dudas técnicas sobre implementaciones asíncronas y bloqueos de código en tiempo real.

- **Impacto y Apoyo**:
  - Resolvió dudas comunes como la correcta inclusión de cabeceras de autorización (`Authorization: Bearer <token>`) en peticiones `fetch`.
  - Proporcionó guías claras sobre cómo manejar excepciones en bloques `try/catch` para prevenir que fallos en el servidor (`json-server` inactivo o errores de red) congelen la aplicación.
  - Ofreció soluciones a bloqueos visuales y de alineación responsiva en CSS.
- **Aprendizaje**: Al estar limitado a las fuentes provistas por el equipo, NotebookLM redujo significativamente el "ruido" de las respuestas generadas por buscadores tradicionales (como StackOverflow), dando ejemplos de código más concisos y acoplados al proyecto.

---

## 3. Fase 3: Cierre y Entrega (Documentación y Evidencias)

Durante la fase de consolidación, NotebookLM asistió a C5 y C1 en el análisis del código unificado y en la redacción de los manuales.

- **Impacto y Apoyo**:
  - Ayudó a estructurar de forma clara y formal el archivo `README.md` final del proyecto, consolidando la información técnica y de configuración del entorno.
  - Sirvió como base de consulta para estructurar los guiones de presentación del video explicativo y organizar los puntos clave que deben mostrarse en la infografía del sistema (arquitectura de la aplicación y flujo de autenticación).
- **Aprendizaje**: Se comprobó que NotebookLM es un copiloto de documentación muy efectivo, capaz de cruzar referencias entre el código desarrollado y el enunciado original para asegurar que se cumplieran todos los criterios de aceptación.

---

## 4. Conclusiones y Beneficios Clave de la Herramienta

1. **Respuestas Basadas en Fuentes Reales**: A diferencia de otras inteligencias artificiales generales, NotebookLM basa sus respuestas estrictamente en los documentos cargados (enunciado, especificaciones, código fuente), lo que elimina casi en su totalidad las alucinaciones de código.
2. **Centralización de Conocimiento**: Actúa como un centro de conocimiento del proyecto donde todos los miembros del equipo pueden realizar consultas homogéneas, asegurando que todos sigan las mismas convenciones y arquitectura compartida de API.
3. **Optimización del Tiempo**: Redujo los tiempos de investigación y depuración de errores de horas a minutos, acelerando la fase de desarrollo y permitiendo centrar los esfuerzos en la calidad visual y responsive de la interfaz.
