// --- 1. Modulo de parser ---

const EPSILON = 'e';

function isVariable(token) {
    return /^[A-Z]/.test(token);
}

function extractTokens(alt) {
    const tokens = [];
    let i = 0;
    while (i < alt.length) {
        if (alt[i] === ' ') {
            i++;
            continue;
        }

        if (alt[i] === "'") {
            let j = i + 1;
            let term = '';
            while (j < alt.length && alt[j] !== "'") {
                term += alt[j];
                j++;
            }
            if (j >= alt.length) {
                throw new Error('Terminal sin cierre de comillas simples.');
            }
            if (term.length === 0) {
                throw new Error('Terminal vacio no permitido.');
            }
            tokens.push(term);
            i = j + 1;
        } else if (/[A-Z]/.test(alt[i])) {
            let v = alt[i];
            let j = i + 1;
            while (j < alt.length && /[a-z0-9!]/i.test(alt[j]) && !/[A-Z]/.test(alt[j])) {
                v += alt[j];
                j++;
            }
            tokens.push(v);
            i = j;
        } else if (alt[i] === EPSILON) {
            tokens.push(EPSILON);
            i++;
        } else {
            throw new Error('Terminal debe estar entre comillas simples.');
        }
    }
    return tokens;
}

function parseGrammar(text) {
    const variables = new Set();
    const terminals = new Set();
    const productions = {};
    let startSymbol = null;

    const lines = text.split('\n').map(l => l.trim()).filter(l => l.length > 0);

    for (const line of lines) {
        const parts = line.split('::');
        if (parts.length !== 2) continue;
        const lhs = parts[0].trim();
        if (!startSymbol) startSymbol = lhs;
        variables.add(lhs);

        if (!productions[lhs]) productions[lhs] = [];

        const alts = parts[1].split('|');
        for (let alt of alts) {
            alt = alt.trim();
            if (!alt) continue;
            const tokens = extractTokens(alt);
            productions[lhs].push(tokens);

            for (const tok of tokens) {
                if (tok === EPSILON) {
                    terminals.add(EPSILON);
                } else if (isVariable(tok)) {
                    variables.add(tok);
                } else {
                    terminals.add(tok);
                }
            }
        }
    }

    return {
        variables: Array.from(variables),
        terminals: Array.from(terminals),
        productions,
        startSymbol
    };
}


// --- 2. Modulo de eliminacion de recursion izquierda ---

function removeLeftRecursion(grammar) {
    const variables = [...grammar.variables];
    const outputOrder = [...variables];
    const baseCount = variables.length;
    const terminals = new Set(grammar.terminals);
    const productions = {};
    for (const v of variables) {
        productions[v] = grammar.productions[v] ? grammar.productions[v].map(p => [...p]) : [];
    }

    for (let i = 0; i < baseCount; i++) {
        const Ai = variables[i];
        
        // Eliminacion de recursion indirecta
        for (let j = 0; j < i; j++) {
            const Aj = variables[j];
            const newAiProds = [];
            let changed = false;
            
            for (const prod of (productions[Ai] || [])) {
                if (prod.length > 0 && prod[0] === Aj) {
                    changed = true;
                    const gamma = prod.slice(1);
                    for (const prodJ of (productions[Aj] || [])) {
                        if (prodJ.length === 1 && prodJ[0] === EPSILON) {
                            newAiProds.push(gamma.length > 0 ? gamma : [EPSILON]);
                        } else {
                            newAiProds.push([...prodJ, ...gamma]);
                        }
                    }
                } else {
                    newAiProds.push(prod);
                }
            }
            if (changed) productions[Ai] = newAiProds;
        }

        // Eliminacion de recursion directa
        const recursive = [];
        const nonRecursive = [];
        for (const prod of (productions[Ai] || [])) {
            if (prod.length > 0 && prod[0] === Ai) {
                recursive.push(prod.slice(1));
            } else {
                nonRecursive.push(prod);
            }
        }

        if (recursive.length > 0) {
            const AiPrime = Ai + '!';
            if (!productions[AiPrime]) {
                const insertAt = outputOrder.indexOf(Ai);
                if (insertAt >= 0) {
                    outputOrder.splice(insertAt + 1, 0, AiPrime);
                } else {
                    outputOrder.push(AiPrime);
                }
            }

            const newAiProds = [];
            if (nonRecursive.length === 0) {
                newAiProds.push([AiPrime]);
            } else {
                for (const beta of nonRecursive) {
                    if (beta.length === 1 && beta[0] === EPSILON) {
                        newAiProds.push([AiPrime]);
                    } else {
                        newAiProds.push([...beta, AiPrime]);
                    }
                }
            }
            productions[Ai] = newAiProds;

            const newAiPrimeProds = [];
            for (const alpha of recursive) {
                newAiPrimeProds.push([...alpha, AiPrime]);
            }
            newAiPrimeProds.push([EPSILON]);
            terminals.add(EPSILON);
            productions[AiPrime] = newAiPrimeProds;
        }
    }

    return {
        variables: outputOrder,
        terminals: Array.from(terminals),
        productions,
        startSymbol: grammar.startSymbol
    };
}


// --- 3. Modulo de conjuntos PRIMERO ---

function computeFirst(grammar) {
    const first = {};
    const allSymbols = new Set([...grammar.variables, ...grammar.terminals, EPSILON]);
    for (const sym of allSymbols) first[sym] = new Set();
    for (const t of grammar.terminals) first[t].add(t);
    first[EPSILON].add(EPSILON);

    let changed = true;
    while (changed) {
        changed = false;
        for (const A of grammar.variables) {
            const prods = grammar.productions[A] || [];
            for (const prod of prods) {
                const seqFirst = firstOfSequence(prod, first);
                for (const sym of seqFirst) {
                    if (!first[A].has(sym)) {
                        first[A].add(sym);
                        changed = true;
                    }
                }
            }
        }
    }
    return first;
}


// --- 4. Modulo de conjuntos SIGUIENTE ---

function computeFollow(grammar, first) {
    const follow = {};
    for (const v of grammar.variables) follow[v] = new Set();

    if (grammar.startSymbol) {
        follow[grammar.startSymbol].add('$');
    }

    let changed = true;
    while (changed) {
        changed = false;
        for (const A of grammar.variables) {
            const prods = grammar.productions[A] || [];
            for (const prod of prods) {
                for (let i = 0; i < prod.length; i++) {
                    const B = prod[i];
                    if (!isVariable(B)) continue;

                    const beta = prod.slice(i + 1);
                    const firstBeta = firstOfSequence(beta, first);
                    for (const sym of firstBeta) {
                        if (sym === EPSILON) continue;
                        if (!follow[B].has(sym)) {
                            follow[B].add(sym);
                            changed = true;
                        }
                    }

                    if (beta.length === 0 || firstBeta.has(EPSILON)) {
                        for (const sym of follow[A]) {
                            if (!follow[B].has(sym)) {
                                follow[B].add(sym);
                                changed = true;
                            }
                        }
                    }
                }
            }
        }
    }
    return follow;
}

function firstOfSequence(sequence, first) {
    const result = new Set();
    if (!sequence || sequence.length === 0) {
        result.add(EPSILON);
        return result;
    }

    let allNullable = true;
    for (const sym of sequence) {
        const firstSym = first[sym] || new Set();
        let hasEpsilon = false;
        for (const f of firstSym) {
            if (f === EPSILON) {
                hasEpsilon = true;
            } else {
                result.add(f);
            }
        }
        if (!hasEpsilon) {
            allNullable = false;
            break;
        }
    }

    if (allNullable) {
        result.add(EPSILON);
    }
    return result;
}


// --- 5. Modulo de control del DOM ---

function renderTableVT(tableId, variables, terminals) {
    const tbody = document.querySelector(`#${tableId} tbody`);
    tbody.innerHTML = '';
    const maxLen = Math.max(variables.length, terminals.length);
    
    for (let i = 0; i < maxLen; i++) {
        const tr = document.createElement('tr');
        const tdV = document.createElement('td');
        tdV.textContent = i < variables.length ? variables[i] : '';
        const tdT = document.createElement('td');
        tdT.textContent = i < terminals.length ? terminals[i] : '';
        tr.appendChild(tdV);
        tr.appendChild(tdT);
        tbody.appendChild(tr);
    }
}

function renderTableVTByVariable(tableId, variables, terminalsByVar) {
    const tbody = document.querySelector(`#${tableId} tbody`);
    tbody.innerHTML = '';

    for (const v of variables) {
        const tr = document.createElement('tr');
        const tdV = document.createElement('td');
        tdV.textContent = v;
        const tdT = document.createElement('td');
        const items = terminalsByVar[v] || [];
        tdT.textContent = uniqueSorted(items).join(', ');
        tr.appendChild(tdV);
        tr.appendChild(tdT);
        tbody.appendChild(tr);
    }
}

function renderTableProd(tableId, variables, productions) {
    const tbody = document.querySelector(`#${tableId} tbody`);
    tbody.innerHTML = '';
    
    for (const v of variables) {
        const prods = productions[v] || [];
        for (const prod of prods) {
            const tr = document.createElement('tr');
            const tdV = document.createElement('td');
            tdV.textContent = v;
            const tdP = document.createElement('td');
            // Reconstruye la produccion para mostrar (e para epsilon)
            tdP.textContent = prod.map(tok => tok === EPSILON ? EPSILON : tok).join(' ');
            tr.appendChild(tdV);
            tr.appendChild(tdP);
            tbody.appendChild(tr);
        }
    }
}

function formatGrammarText(grammar) {
    let out = '';
    for (const v of grammar.variables) {
        const prods = grammar.productions[v] || [];
        const rightSide = prods.map(p => p.map(tok => tok === EPSILON ? EPSILON : tok).join(' ')).join(' | ');
        out += `${v} :: ${rightSide}\n`;
    }
    return out.trim();
}

function renderSetTable(tableId, variables, setObj) {
    const tbody = document.querySelector(`#${tableId} tbody`);
    tbody.innerHTML = '';
    
    for (const v of variables) {
        const tr = document.createElement('tr');
        const tdV = document.createElement('td');
        tdV.textContent = v;
        const tdS = document.createElement('td');
        const items = Array.from(setObj[v] || []);
        tdS.textContent = items.join(', ');
        tdS.title = tdS.textContent; // Tooltip para desbordes
        tr.appendChild(tdV);
        tr.appendChild(tdS);
        tbody.appendChild(tr);
    }
}

function uniqueSorted(items) {
    return Array.from(new Set(items)).sort();
}

function collectTerminalsByVariable(grammar) {
    const map = {};
    for (const v of grammar.variables) {
        const terminals = [];
        const prods = grammar.productions[v] || [];
        for (const prod of prods) {
            for (const tok of prod) {
                if (tok === EPSILON) {
                    terminals.push(EPSILON);
                } else if (!isVariable(tok)) {
                    terminals.push(tok);
                }
            }
        }
        map[v] = terminals;
    }
    return map;
}

function triggerAnimations() {
    const panels = document.querySelectorAll('.table-container, .readonly-area');
    panels.forEach(p => {
        p.classList.remove('active');
        // forzar reflow
        void p.offsetWidth;
        p.classList.add('fade-update', 'active');
    });
}

function ejecutar() {
    const input = document.getElementById('grammar-input').value;
    if (!input.trim()) return;

    try {
        // 1. Parseo original
        const origGrammar = parseGrammar(input);
        const origTerminalsByVar = collectTerminalsByVariable(origGrammar);
        renderTableVTByVariable('table-vt-orig', origGrammar.variables, origTerminalsByVar);
        renderTableProd('table-prod-orig', origGrammar.variables, origGrammar.productions);

        // 2. Eliminacion de recursion izquierda
        const transGrammar = removeLeftRecursion(origGrammar);
        document.getElementById('grammar-output').textContent = formatGrammarText(transGrammar);
        const transTerminalsByVar = collectTerminalsByVariable(transGrammar);
        renderTableVTByVariable('table-vt-trans', transGrammar.variables, transTerminalsByVar);
        renderTableProd('table-prod-trans', transGrammar.variables, transGrammar.productions);

        // 3. Conjuntos PRIMERO
        const firstSets = computeFirst(transGrammar);
        renderSetTable('table-first', transGrammar.variables, firstSets);

        // 4. Conjuntos SIGUIENTE
        const followSets = computeFollow(transGrammar, firstSets);
        renderSetTable('table-follow', transGrammar.variables, followSets);

        // 5. Feedback de UX
        triggerAnimations();

    } catch (err) {
        console.error("Error processing grammar:", err);
        const message = err && err.message ? err.message : 'Ocurrió un error al procesar la gramática.';
        alert(message);
    }
}

// Listeners de eventos
document.getElementById('btn-run').addEventListener('click', ejecutar);

document.addEventListener('keydown', e => {
    if (e.key === 'F5') {
        e.preventDefault();
        ejecutar();
    }
});

// Ejecuta al cargar para mostrar el estado inicial
window.addEventListener('DOMContentLoaded', () => {
    ejecutar();
});
