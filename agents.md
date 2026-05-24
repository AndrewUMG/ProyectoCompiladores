# Agents.md — GramLex: Compiler Grammar Analyzer

## Nombre del Proyecto
**GramLex** — Grammar Lexical Analyzer  
*Un analizador de gramáticas con eliminación de recursividad izquierda y cálculo de funciones PRIMERO/SIGUIENTE.*

---

## Visión General

GramLex es una aplicación web educativa para el curso de Compiladores. Permite al usuario ingresar una gramática libre de contexto con recursividad por la izquierda en un editor de texto, procesarla automáticamente al presionar F5 o el botón Ejecutar, y mostrar en pantalla:

1. Los vectores de Variables (V) y Terminales (T) de la gramática original.
2. La Matriz de Producciones original.
3. La Gramática sin Recursividad por la Izquierda.
4. Los vectores V y T de la gramática transformada.
5. La Matriz de Producciones transformada.
6. La Función PRIMERO (First) de cada variable.
7. La Función SIGUIENTE (Follow) de cada variable.

Todo debe visualizarse en **una sola vista sin scroll**, acoplado y compacto dentro de la ventana del navegador.

---

## Stack Tecnológico

- **HTML5** — estructura semántica
- **CSS3** — variables, grid, flexbox, animaciones
- **JavaScript (Vanilla ES6+)** — lógica de compiladores, manipulación del DOM

Sin librerías externas, sin frameworks, sin dependencias. Todo desde cero (programación propia).

---

## Paleta de Colores y Tema

Tema claro, profesional, con toque académico-técnico.

| Token CSS            | Valor       | Uso                                      |
|----------------------|-------------|------------------------------------------|
| `--color-primary`    | `#1A5276`   | Azul marino profundo — headers, títulos  |
| `--color-accent`     | `#E67E22`   | Naranja ámbar — highlights, botones      |
| `--color-bg`         | `#F4F6F7`   | Gris claro — fondo general               |
| `--color-surface`    | `#FFFFFF`   | Blanco — paneles y tarjetas              |
| `--color-border`     | `#D5D8DC`   | Gris suave — bordes de tablas/paneles    |
| `--color-text`       | `#1C2833`   | Negro carbón — texto principal           |
| `--color-text-muted` | `#7F8C8D`   | Gris medio — etiquetas secundarias       |
| `--color-header-row` | `#1A5276`   | Azul marino — fila encabezado de tablas  |
| `--color-header-txt` | `#FFFFFF`   | Blanco — texto en encabezados de tablas  |

### Tipografía
- **Display / Títulos:** `'Courier Prime'` o `'JetBrains Mono'` (monoespaciada, refuerza identidad de compiladores)
- **Cuerpo / UI:** `'IBM Plex Sans'` (legible, técnica, moderna)
- Importar desde Google Fonts.

---

## Layout — Una Sola Vista (No Scroll)

La aplicación se distribuye en una sola pantalla usando CSS Grid compacto. No debe aparecer ningún scrollbar en la pantalla principal.

```
┌──────────────────────────────────────────────────────────────────────┐
│  HEADER: Logo GramLex + Credenciales (Nombre, Curso)                │
├───────────────────────────┬──────────────────────────────────────────┤
│  PANEL IZQUIERDO          │  PANEL DERECHO                          │
│  ┌─────────────────────┐  │  ┌───────────────────────────────────┐  │
│  │ Editor de Texto     │  │  │ Gramática Sin Recursividad        │  │
│  │ (textarea)          │  │  │ (salida de texto)                 │  │
│  └─────────────────────┘  │  └───────────────────────────────────┘  │
│  [Botón Ejecutar / F5]    │                                          │
│  ┌──────┐ ┌────────────┐  │  ┌──────┐ ┌────────────────────────┐   │
│  │ V  T │ │Producciones│  │  │ V  T │ │Producciones (sin rec.) │   │
│  │(vec.)│ │(matriz)    │  │  │(vec.)│ │(matriz)                │   │
│  └──────┘ └────────────┘  │  └──────┘ └────────────────────────┘   │
├───────────────────────────┴──────────────────────────────────────────┤
│  PANEL INFERIOR: Función PRIMERO | Función SIGUIENTE                │
│  ┌────────────────────────┐  ┌────────────────────────┐             │
│  │ V | Terminales         │  │ V | Terminales          │            │
│  └────────────────────────┘  └────────────────────────┘             │
├──────────────────────────────────────────────────────────────────────┤
│  FOOTER: Nombre del Estudiante — Curso Compiladores                 │
└──────────────────────────────────────────────────────────────────────┘
```

Usar `display: grid` con `height: 100vh`, `overflow: hidden`. Todas las secciones con altura fija proporcional usando `fr` o porcentajes.

---

## Componentes de la Interfaz

### 1. Header
- Logo textual: **GramLex** en fuente monoespaciada, color `--color-primary`
- Subtítulo pequeño: "Analizador de Gramáticas — Compiladores"
- Nombre del estudiante alineado a la derecha
- Altura fija: ~48px

### 2. Editor de Texto (ENTRADA)
- `<textarea>` con fuente monoespaciada
- Placeholder con ejemplo de gramática
- Borde con `--color-border`, foco con `--color-accent`
- Sin resize para mantener el layout fijo
- Tamaño acoplado al panel

### 3. Botón Ejecutar
- Estilo: fondo `--color-accent`, texto blanco, borde redondeado suave
- Icono: ▶ (triángulo play)
- Tooltip: "Ejecutar (F5)"
- Al hacer hover: brillo sutil, transición 0.2s
- Al hacer click: animación de "pulse" breve

### 4. Tecla F5
- Listener global: `document.addEventListener('keydown', e => { if(e.key === 'F5') { e.preventDefault(); ejecutar(); } })`
- Pequeño badge visual "F5" en la esquina del botón o del header

### 5. Vectores V y T (Tablas)
- Tabla HTML de 2 columnas: **V** y **T**
- Header con `--color-header-row` y texto blanco
- Filas alternadas: blanco / `#EBF5FB`
- Fuente monoespaciada para los símbolos

### 6. Matriz de Producciones
- Tabla con columnas: **V** | **Producción**
- Header estilizado igual que vectores
- Una fila por cada producción (incluyendo épsilon `ε`)
- Fuente monoespaciada

### 7. Salida Gramática Sin Recursividad
- Panel de solo lectura con fondo blanco y borde
- Texto en fuente monoespaciada, color `--color-primary`
- Cada variable en una línea (formato `A ::= α | β`)
- La variable prima se muestra con `!` (ej: `S!`)

### 8. Función PRIMERO y SIGUIENTE
- Dos tablas lado a lado en el panel inferior
- Columnas: **V** | **Terminales**
- Los terminales separados por coma dentro de la celda
- `$` para SIGUIENTE cuando aplica (símbolo de fin de cadena)

### 9. Footer
- Barra delgada ~32px
- Fondo `--color-primary`, texto blanco
- Izquierda: nombre del estudiante / Derecha: "Compiladores"

---

## Lógica de Compiladores (JavaScript)

### Módulo 1: Parser de Gramática

**Formato de entrada esperado:**
```
S::S'+'T|T
T::T'*'F|F
F::'a1'|e
```

**Reglas de parseo:**
- Separador de variable y producción: `::`
- Separador de alternativas: `|`
- Los terminales van entre comillas simples: `'+'`, `'*'`, `'a1'`
- `e` (sin comillas) representa épsilon (`ε`)
- Las variables son identificadores sin comillas simples
- La longitud de variables y terminales puede ser >= 1

**Función `parseGrammar(text)`:**
```js
// Retorna:
{
  variables: ['S', 'T', 'F'],           // V
  terminals: ['+', '*', 'a1', 'e'],     // T (e = épsilon)
  productions: {
    'S': [['S', '+', 'T'], ['T']],
    'T': [['T', '*', 'F'], ['F']],
    'F': [['a1'], ['ε']]
  },
  startSymbol: 'S'
}
```

**Reglas de extracción de tokens de una producción:**
- Recorrer la cadena símbolo por símbolo
- Si encuentra `'`: leer hasta el siguiente `'` → terminal
- Si encuentra letra mayúscula: leer identificador de variable (puede tener `!`)
- Si encuentra `e` sola (no entre comillas): épsilon
- Caracteres sin comillas que no son mayúsculas: tratar como terminal simple

### Módulo 2: Eliminación de Recursividad por la Izquierda

**Algoritmo (por cada variable A con recursividad directa):**

```
Para cada variable A:
  Sea α1, α2, ... las producciones de A que SÍ comienzan con A (recursivas)
  Sea β1, β2, ... las producciones de A que NO comienzan con A (no recursivas)

  Si hay recursividad directa:
    Crear nueva variable A! (prima)
    Reemplazar producciones de A:
      A  ::= β1 A! | β2 A! | ...
    Nuevas producciones de A!:
      A! ::= α1' A! | α2' A! | ... | ε
      (donde αi' = αi sin el A inicial)
    
  Si no hay recursividad en A: dejar igual.
```

**Después de eliminar recursividad directa**, aplicar eliminación de recursividad indirecta si existe:

```
Para i = 1 hasta n:
  Para j = 1 hasta i-1:
    Reemplazar cada producción Ai ::= Aj γ
    con Ai ::= δ1 γ | δ2 γ | ... (donde Aj ::= δ1 | δ2 | ...)
  Luego eliminar recursividad directa de Ai
```

**Variable prima:** se representa con `!` en el nombre (ej: `S` → `S!`).

**Función `removeLeftRecursion(grammar)`:**
```js
// Retorna nueva gramática con las mismas estructuras pero sin recursividad izquierda
// { variables, terminals, productions, startSymbol }
```

### Módulo 3: Función PRIMERO (First)

**Definición:**
- `PRIMERO(a)` para un terminal `a` = `{a}`
- `PRIMERO(ε)` = `{ε}`
- Para variable `A`:
  - Si `A ::= ε` está en producciones → añadir `ε`
  - Si `A ::= X1 X2 ... Xk`:
    - Añadir `PRIMERO(X1) - {ε}`
    - Si `ε ∈ PRIMERO(X1)`, añadir `PRIMERO(X2) - {ε}`, etc.
    - Si `ε ∈ PRIMERO(Xi)` para todo i, añadir `ε`

**Algoritmo iterativo hasta punto fijo:**
```js
function computeFirst(grammar) {
  const first = {};
  // inicializar todos en set vacío
  // iterar hasta que no haya cambios
  // retornar { 'S': new Set([...]), 'T': new Set([...]), ... }
}
```

### Módulo 4: Función SIGUIENTE (Follow)

**Definición:**
- `SIGUIENTE(S)` incluye `$` (símbolo de fin) para el símbolo inicial `S`
- Para cada producción `A ::= αBβ`:
  - Añadir `PRIMERO(β) - {ε}` a `SIGUIENTE(B)`
  - Si `ε ∈ PRIMERO(β)` o `β` es vacío → añadir `SIGUIENTE(A)` a `SIGUIENTE(B)`

**Algoritmo iterativo hasta punto fijo:**
```js
function computeFollow(grammar, first) {
  const follow = {};
  // follow[startSymbol] = new Set(['$'])
  // iterar hasta que no haya cambios
  // retornar { 'S': new Set(['$',...]), ... }
}
```

---

## Formato de Salida

### Gramática Sin Recursividad (texto)
```
S:: T S!
S! ::+T S! |e
T:: F T!
T! ::*F T! |e
F:: a1 |e
```
- Una línea por variable
- `|` separa alternativas
- `e` representa épsilon

### Vectores V y T (tras eliminar recursividad)
- V incluye las variables originales + las variables prima (`S!`, `T!`, etc.)
- T incluye los mismos terminales + `ε` si aplica

### Matrices de Producciones
- Una fila por producción (no por variable)
- Épsilon se muestra como `ε` o `e`

---

## Eventos y Controles

| Evento | Acción |
|--------|--------|
| Click en "Ejecutar" | Leer textarea, procesar gramática, actualizar DOM |
| Presionar F5 | Igual que click en Ejecutar (preventDefault para no recargar) |
| Hover en "Ejecutar" | Tooltip con descripción de funcionalidad |
| Input en textarea | Limpiar resultados anteriores suavemente |

---

## Presentación y UX

1. **Credenciales visibles en header y footer:** nombre del estudiante y curso.
2. **Máximo 2 colores de resalte:** azul marino (`--color-primary`) y naranja ámbar (`--color-accent`). No usar más.
3. **Letra legible en todo momento:** mínimo 12px para tablas, 14px para texto general.
4. **Alineación de objetos:** todos los paneles alineados con grid, sin elementos flotantes sueltos.
5. **Sin TAB como separación visual:** usar bordes y padding.
6. **Todo en 1 sola vista:** `html, body { height: 100vh; overflow: hidden; }`.
7. **Sin librerías externas:** código propio desde cero.
8. **Feedback visual al ejecutar:** los paneles de salida hacen un fade-in al actualizarse.
9. **Estado vacío:** cuando no hay resultados, mostrar los encabezados de tabla pero celdas vacías (no ocultar tablas).
10. **Responsividad interna:** si el contenido de una celda es largo, usar `overflow: hidden; text-overflow: ellipsis` o fuente más pequeña en tablas.

---

## Estructura de Archivos

```
gramlex/
├── index.html        ← Única página, todo el HTML
├── style.css         ← Todo el CSS, variables, layout
└── app.js            ← Toda la lógica JS (parser, algoritmos, DOM)
```

Todo puede también ir en un único `index.html` con `<style>` y `<script>` embebidos para facilitar entrega.

---

## Ejemplo de Prueba

**Entrada:**
```
S::S'+'T|T
T::T'*'F|F
F::'a1'|e
```

**Salida esperada — Gramática Sin Recursividad:**
```
S:: T S!
S! ::+T S! |e
T:: F T!
T! ::*F T! |e
F:: a1 |e
```

**Vectores originales:**
- V: S, T, F
- T: +, *, a1, ε

**Vectores sin recursividad:**
- V: S, S!, T, T!, F
- T: +, *, a1, ε

**Función PRIMERO:**
| V  | Terminales       |
|----|-----------------|
| S  | a1              |
| S! | +, ε            |
| T  | a1              |
| T! | *, ε            |
| F  | a1, ε           |

**Función SIGUIENTE:**
| V  | Terminales  |
|----|------------|
| S  | $          |
| S! | $          |
| T  | +, $       |
| T! | +, $       |
| F  | *, +, $    |

---

## Restricciones de Implementación

- **No usar librerías pre-establecidas** para quitar recursividad por la izquierda. Programar desde 0.
- **No copiar código de internet** ni de otros compañeros.
- **Conservar la sintaxis de entrada** exactamente como se define: `::` como separador, `|` para alternativas, comillas simples para terminales, `e` para épsilon.
- El proyecto debe correr con las pruebas que se den en clase el día de la presentación.
- Entrega: **Viernes 29 de Mayo**.
- Entrega fuera de fecha: Nota × 50%.
- Sin sintaxis correcta: 10% de la nota.

---

## Checklist de Actividades (Rúbrica)

| # | Actividad | Pts |
|---|-----------|-----|
| 1 | Editor de Texto funcional | 1 |
| 2 | F5 despliega todos los objetos | 1 |
| 3 | Botón Ejecutar funcional + hover con descripción | 2 |
| 4 | Vector V y T de gramática original (longitud ≥ 1, terminales entre comillas, `e` = épsilon sin comillas) | 2 |
| 5 | Matriz de Producciones #1 (1 línea por producción, incluyendo épsilon) | 3 |
| 6 | Gramática Sin Recursividad por la Izquierda (1 línea por variable, prima = `!`) | 4 |
| 6.1 | Vector V y T de gramática sin recursividad (longitud ≥ 1, épsilon en terminales) | 2 |
| 6.2 | Matriz de Producciones sin recursividad (1 línea por producción, incluyendo épsilon) | 2 |
| 7 | Función PRIMERO: Variables y Terminales | 3 |
| 8 | Función SIGUIENTE: Variables y Terminales | 3 |
| 9 | Presentación: credenciales, nombre del programa, letra legible, alineación, máx. 2 colores, 1 sola vista sin scroll | 3 |
| 10 | Programa fuente entregado (puntos según objetos programados) | 4 |
| **TOTAL** | | **30** |

---

---

## 🛠️ Notas de Depuración y Correcciones Críticas (Control de Calidad)

Durante las pruebas de la interfaz y la validación de los algoritmos de compiladores, se identificaron los siguientes errores lógicos y visuales en los módulos de procesamiento. Estos **deben corregirse en la lógica de `app.js`** antes de la entrega final para no penalizar la nota en las funciones estructuradas:

### 1. Corrección en el Módulo de la Función PRIMERO (First)
* **Error detectado:** El algoritmo actual incluye incorrectamente los operadores binarios (`+` y `*`) dentro de los conjuntos $PRIMERO(S)$ y $PRIMERO(T)$.
* **Explicación teórica:** Para la gramática original, $PRIMERO(F) = \{a1, e\}$. Como $T \rightarrow T * F \mid F$, el conjunto $PRIMERO(T)$ hereda directamente a $PRIMERO(F)$, dando como resultado $\{a1, e\}$. El terminal `*` **no** debe formar parte de $PRIMERO(T)$ porque ninguna producción válida de $T$ inicia posicionalmente con ese símbolo. Lo mismo ocurre con $S$, donde $PRIMERO(S) = \{a1, e\}$.
* **Acción en el código:** Modificar el bucle de punto fijo para que solo añada terminales a $PRIMERO(A)$ si son el primer elemento de la producción, o si los elementos previos en la cadena de símbolos se anulan (derivan en `e`).

### 2. Estándar Absoluto para Épsilon (`e`) en la UI y Vectores
* **Definición del estándar:** Para evitar discrepancias de parseo y asegurar consistencia visual estricta, el carácter minúsculo `e` será el único símbolo oficial para representar épsilon ($\epsilon$) en todo el ecosistema de la aplicación.
* **Error detectado:** La interfaz actual mezcla la letra `e` en las cajas de texto y producciones con el carácter matemático `ε` en las tablas de vectores y terminales.
* **Acción en el código:** Eliminar por completo el uso del carácter `ε` en el mapeo del DOM. Modificar las funciones de renderizado para que tanto el vector de terminales ($T$), la matriz de producciones, como los conjuntos resultantes de PRIMERO y SIGUIENTE muestren e impriman explícitamente el carácter `e` cuando se trate del elemento vacío.

### 3. Sincronización en la Matriz de Producciones
* **Error detectado:** La matriz de producciones de la gramática original no se encuentra sincronizada con el backend del parser en el manejo de tokens vacíos, imprimiendo estructuras que difieren de los arreglos indexados en los vectores globales de terminales.
* **Acción en el código:** Asegurar que el parser traduzca y asigne el token de entrada de forma homogénea. Al unificar todo bajo el estándar de la letra `e`, el mapeo de matrices de producción debe ser directo y uno a uno con lo registrado en los vectores $T$.

### 4. Omisión de Terminales en la Tabla de Vectores Transformados (Bug de `T!`)
* **Error detectado:** En la tabla de "Vectores de la Gramática Sin Recursividad", la fila correspondiente a la variable prima `T!` muestra la columna de terminales completamente vacía `[]`, a pesar de que la variable `S!` sí despliega correctamente sus terminales asociados.
* **Explicación teórica:** Al tratarse de una tabla de correspondencia en la UI para denotar qué terminales se originan de cada variable, la fila de `T!` debe reflejar de manera obligatoria los terminales de sus reglas simplificadas (`*` proveniente de `* F T!` y `e` debido a la derivación en épsilon).
* **Acción en el código:** Revisar el ciclo o expresión regular de extracción de tokens en `app.js`. Asegurar que el operador `*` no esté siendo omitido por conflictos de caracteres especiales en JavaScript y garantizar que el token final `e` sea detectado correctamente para rellenar la celda en lugar de dejar un string vacío.

---

*Agents.md generado para GramLex — Proyecto Individual 1, Curso Compiladores.*
