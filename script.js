/* ==========================================================================
1. CONTROLE DE TAMANHO DE FONTE (A+ / A / A-)
   ========================================================================== */
let tamanhoFonteAtual = 100;
const btnAumentaTexto = document.getElementById("btnAumentaTexto");
const btnResetTexto = document.getElementById("btnResetTexto");
const btnDiminuiTexto = document.getElementById("btnDiminuiTexto");

if (btnAumentaTexto && btnDiminuiTexto && btnResetTexto) {
    btnAumentaTexto.addEventListener("click", () => {
        if (tamanhoFonteAtual < 160) {
            tamanhoFonteAtual += 10;
            document.documentElement.style.fontSize = `${tamanhoFonteAtual}%`;
        }
    });

    btnResetTexto.addEventListener("click", () => {
        tamanhoFonteAtual = 100;
        document.documentElement.style.fontSize = "100%";
    });

    btnDiminuiTexto.addEventListener("click", () => {
        if (tamanhoFonteAtual > 80) {
            tamanhoFonteAtual -= 10;
            document.documentElement.style.fontSize = `${tamanhoFonteAtual}%`;
        }
    });
}

/* ==========================================================================
   2. CONTROLE DE ALTO CONTRASTE
   ========================================================================== */
const btnContraste = document.getElementById("btnContraste");

if (btnContraste) {
    btnContraste.addEventListener("click", () => {
        document.body.classList.toggle("alto-contraste");
        const estaEmAltoContraste = document.body.classList.contains("alto-contraste");
        btnContraste.setAttribute("aria-pressed", estaEmAltoContraste);
    });
}

/* ==========================================================================
   3. SELETOR DE SIMULAÇÃO DE DALTONISMO
   ========================================================================== */
const seletorDaltonismo = document.getElementById("seletorDaltonismo");

if (seletorDaltonismo) {
    seletorDaltonismo.addEventListener("change", (e) => {
        document.body.classList.remove("simular-deuteranopia", "simular-protanopia", "simular-tritanopia");
        
        const valorSelecionado = e.target.value;
        if (valorSelecionado !== "nenhum") {
            document.body.classList.add(`simular-${valorSelecionado}`);
        }
    });
}

/* ==========================================================================
   4. BOTÃO FLUTUANTE DE ACESSIBILIDADE (PAINEL RÁPIDO)
   ========================================================================== */
const btnWidgetFlutuante = document.getElementById("btnWidgetFlutuante");
const painelWidget = document.getElementById("painelWidget");

if (btnWidgetFlutuante && painelWidget) {
    btnWidgetFlutuante.addEventListener("click", () => {
        const estaOculto = painelWidget.hasAttribute("hidden");
        if (estaOculto) {
            painelWidget.removeAttribute("hidden");
            btnWidgetFlutuante.setAttribute("aria-expanded", "true");
        } else {
            painelWidget.setAttribute("hidden", "");
            btnWidgetFlutuante.setAttribute("aria-expanded", "false");
        }
    });
}

/* ==========================================================================
   5. MODAL POP-UP ACESSÍVEL (AVISO DE EMERGÊNCIA & GERENCIAMENTO DE FOCO)
   ========================================================================== */
const modal = document.getElementById("modalAjuda");
const btnFecharModal = document.getElementById("btnFecharModal");
let elementoComFocoAntesDoModal = null;

function abrirModal() {
    if (!modal) return;
    elementoComFocoAntesDoModal = document.activeElement;
    modal.removeAttribute("hidden");
    if (btnFecharModal) btnFecharModal.focus();
}

function fecharModal() {
    if (!modal) return;
    modal.setAttribute("hidden", "");
    if (elementoComFocoAntesDoModal) elementoComFocoAntesDoModal.focus();
}

document.addEventListener("keydown", (evento) => {
    if (evento.key === "Escape" && modal && !modal.hasAttribute("hidden")) {
        fecharModal();
    }
});

/* ==========================================================================
   6. LEITOR DE TELA EM VOZ ALTA (WEB SPEECH API EM PORTUGUÊS)
   ========================================================================== */
const btnVoz = document.getElementById("btnVoz");

if (btnVoz) {
    btnVoz.addEventListener("click", () => {
        if (window.speechSynthesis.speaking) {
            if (window.speechSynthesis.paused) {
                window.speechSynthesis.resume();
                btnVoz.innerHTML = '<span aria-hidden="true">⏸️</span> Pausar Voz';
                btnVoz.setAttribute("aria-label", "Pausar leitura em voz alta");
            } else {
                window.speechSynthesis.pause();
                btnVoz.innerHTML = '<span aria-hidden="true">▶️</span> Retomar Voz';
                btnVoz.setAttribute("aria-label", "Retomar leitura em voz alta");
            }
            return;
        }

        const conteudoParaLer = document.querySelector("main");
        if (!conteudoParaLer) return;

        const mensagemVoz = new SpeechSynthesisUtterance(conteudoParaLer.innerText);
        mensagemVoz.lang = "pt-BR";
        mensagemVoz.rate = 1.0;

        mensagemVoz.onstart = () => {
            btnVoz.innerHTML = '<span aria-hidden="true">⏸️</span> Pausar Voz';
            btnVoz.setAttribute("aria-label", "Pausar leitura em voz alta");
        };

        mensagemVoz.onend = resetarBotaoVoz;
        mensagemVoz.onerror = resetarBotaoVoz;

        window.speechSynthesis.speak(mensagemVoz);
    });
}

function pararLeitura() {
    if (window.speechSynthesis) {
        window.speechSynthesis.cancel();
        resetarBotaoVoz();
    }
}

function resetarBotaoVoz() {
    if (btnVoz) {
        btnVoz.innerHTML = '<span aria-hidden="true">🔊</span> Ouvir Revista';
        btnVoz.setAttribute("aria-label", "Ouvir o conteúdo da revista em voz alta");
    }
}

window.addEventListener("beforeunload", () => {
    if (window.speechSynthesis) {
        window.speechSynthesis.cancel();
    }
});