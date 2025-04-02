//moolander. um jogo de alunissagem
//João Marcos Marinho Baron
//https://github.com/joaomarcos33
//versão 0.1.0

/** @type {HTMLCanvasElement} */

// Seleção de modelagem de dados 
let canvas = document.querySelector("#jogo");
let contexto = canvas.getContext("2d");

let moduloLunar = {
    posicao: {
        x: 100,
        y: 100
    },
    angulo: -Math.PI/2,
    largura: 20,
    altura: 20,
    cor: "lightgray",
    motorLigado: false,
    velocidade: {
        x: 0,
        y: 0
    },
    combustivel: 1000,
    combustivelMax: 1000,
    rotacaoAntiHorario: false,
    rotacaoHorario: false
};

function desenharModuloLunar() {
    contexto.save();
    contexto.beginPath();
    contexto.translate(moduloLunar.posicao.x, moduloLunar.posicao.y);
    contexto.rotate(moduloLunar.angulo);
    contexto.rect(moduloLunar.largura * -0.5, moduloLunar.altura * -0.5, moduloLunar.largura, moduloLunar.altura);
    contexto.fillStyle = moduloLunar.cor;
    contexto.fill();
    contexto.closePath();

    if (moduloLunar.motorLigado) {
        desenharChama();
    }

    contexto.restore();
}

function desenharChama() {
    contexto.beginPath();
    contexto.moveTo(moduloLunar.largura * -0.5, moduloLunar.altura * 0.5);
    contexto.lineTo(moduloLunar.largura * 0.5, moduloLunar.altura * 0.5);
    contexto.lineTo(0, moduloLunar.altura * 0.5 + Math.random() * 15);
    contexto.closePath();
    contexto.fillStyle = "orange";
    contexto.fill();
}

function mostrarIndicadores() {
    contexto.font = "bold 18px Arial";
    contexto.textAlign = "left";
    contexto.textBaseline = "middle";
    contexto.fillStyle = "lightgray";
    contexto.fillText(`Velocidade Vertical: ${(10 * moduloLunar.velocidade.y).toFixed(1)}`, 10, 20);
    contexto.fillText(`Velocidade Horizontal: ${(moduloLunar.velocidade.x).toFixed(1)}`, 10, 40);
    contexto.fillText(`Ângulo: ${(moduloLunar.angulo * (180 / Math.PI)).toFixed(1)}°`, 10, 60);
    let combustivelPorcentagem = (moduloLunar.combustivel / moduloLunar.combustivelMax) * 100;
    contexto.fillText(`Combustível: ${combustivelPorcentagem.toFixed(0)}%`, 10, 80);
    let altitude = canvas.height - moduloLunar.posicao.y;
    contexto.fillText(`Altitude: ${altitude.toFixed(0)}m`, 10, 100);
}

function desenhar() {
    contexto.clearRect(0, 0, canvas.width, canvas.height);
    mostrarIndicadores();
    atracaoGravitacional();
    desenharModuloLunar();

    if (moduloLunar.posicao.y >= (canvas.height - 0.5 * moduloLunar.altura)) {
        if (moduloLunar.velocidade.y >= 0.5) {
            
            contexto.font = "bold 50px Fantasy";
            contexto.fillStyle = "red";
            contexto.textAlign = "center";
            contexto.fillText("VOCÊ MORREU🍆!", canvas.width / 2, canvas.height / 2);
        } else {
            alert("Você conseguiu pousar🐔!");
        }
        return;
    }

    requestAnimationFrame(desenhar);
}

document.addEventListener("keydown", teclaPressionada);
function teclaPressionada(evento) {
    if (evento.keyCode == 38) {
        moduloLunar.motorLigado = true;
    } else if (evento.keyCode == 37) {
        moduloLunar.rotacaoAntiHorario = true;
    } else if (evento.keyCode == 39) {
        moduloLunar.rotacaoHorario = true;
    }
}

document.addEventListener("keyup", teclaSolta);
function teclaSolta(evento) {
    if (evento.keyCode == 38) {
        moduloLunar.motorLigado = false;
    } else if (evento.keyCode == 37) {
        moduloLunar.rotacaoAntiHorario = false;
    } else if (evento.keyCode == 39) {
        moduloLunar.rotacaoHorario = false;
    }
}

let gravidade = 0.01;
function atracaoGravitacional() {
    moduloLunar.posicao.x += moduloLunar.velocidade.x;
    moduloLunar.posicao.y += moduloLunar.velocidade.y;
    
    if (moduloLunar.rotacaoAntiHorario) {
        moduloLunar.angulo += Math.PI / 180;
    } else if (moduloLunar.rotacaoHorario) {
        moduloLunar.angulo -= Math.PI / 180;
    }
    
    if(moduloLunar.motorLigado){
        moduloLunar.velocidade.y -= 0.0115 * Math.cos(moduloLunar.angulo);
        moduloLunar.velocidade.x += 0.0115 * Math.sin(moduloLunar.angulo);
    }
    
    if (moduloLunar.motorLigado && moduloLunar.combustivel > 0) {
        moduloLunar.combustivel--;
    } else {
        moduloLunar.motorLigado = false;
    }
    
    moduloLunar.velocidade.y += gravidade;
}

desenhar();