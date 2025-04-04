//moolander. um jogo de alunissagem
//João Marcos Marinho Baron
//https://github.com/joaomarcos33
//versão 0.1.0


/** @type {HTMLCanvasElement} */


// Seleção de modelagem de dados 

let canvas = document.querySelector("#jogo");
let contexto = canvas.getContext("2d")

let lancamentoPelaEsquerda = (Math.round(Math.random()) == 0)


let moduloLunar = {
    posicao: {
        x: lancamentoPelaEsquerda? 100 : 700,
        y: 100
    },
    angulo: lancamentoPelaEsquerda ? -Math.PI/2 : Math.PI/2,
    largura: 20,
    altura: 20,
    cor: "lightgray",
    motorLigado: false,
    velocidade: {
        x: lancamentoPelaEsquerda ? 2 : -2,
        y: 0
    },
    combustivel: 1000,
    rotacaoAntiHorario: false,
    rotacaoHorario: false
}

/*let estrelas = [];
for (let i = 0; i <= 500; i++){
    estrelas[i] = {
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        raio: Math.sqrt(Math.random() * 2),
        transparencia: 1.0, 
        diminuicao: true,
        razaoDeCintilacao: Math.random() * 0.05
   };
}*/
let estrelas = [];

for(let i = 0; i < 500; i++){
    estrelas[i] = {
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        raio: Math.sqrt(2 * Math.random()),
        brilho: 1.0,
        apagando: true,
        cintilacao: 0.05 * Math.random()
    }
}

// Secão de Visualização
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

function desenharEstrelas(){
    contexto.save();
    for(let i = 0; i < estrelas.length; i++){
        let estrela = estrelas[i];
        contexto.beginPath();
        contexto.arc(estrela.x, estrela.y, estrela.raio, 0, 2*Math.PI);
        contexto.closePath();
        contexto.fillStyle = `rgba(255, 255, 255, ${estrela.brilho} )`;
        contexto.fill();

        if(estrela.apagando){
            estrela.brilho -= estrela.cintilacao;
            if(estrela.brilho < 0.1){
                estrela.apagando = false;
            }

        }else{
            estrela.brilho += estrela.cintilacao;
            if (estrela.brilho >= 0.95){
                estrela.apagando = true;
            }
        }
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

function mostrarVelocidadeVertical() {
    contexto.font = "bold 18px Arial";
    contexto.textAling = "center";
    contexto.textBaseLine = "middle";
    contexto.fillStyle = "lightgray";
    let velocidade = `Velocidade Vertical: ${(10 * moduloLunar.velocidade.y).toFixed(1)}`;
    contexto.fillText(velocidade, 100, 60);
}

function mostrarVelocidadeHorizontal() {
    contexto.font = "bold 18px Arial";
    contexto.textAling = "center";
    contexto.textBaseLine = "middle";
    contexto.fillStyle = "lightgray";
    let velocidade = `Velocidade Horizontal: ${(10 * moduloLunar.velocidade.x).toFixed(2)}`;
    contexto.fillText(velocidade, 100, 80);
}

function mostrarCombustivel() {
    contexto.font = "bold 18px Arial";
    contexto.textAling = "center";
    contexto.textBaseLine = "middle";
    contexto.fillStyle = "lightgray";
    let combustivel = `Combustível: ${((moduloLunar.combustivel / 1000) * 100).toFixed(0)}`;
    contexto.fillText(combustivel + "%", 550, 60);
}


/*function desenharEstrelas(){
    for ( let i = 0; i < estrelas.length; i++){
        let estrela = estrelas[i];
        contexto.beginPath();
        contexto.arc(estrela.x, estrela.y, estrela.raio, 0, 2 * Math.PI)
        contexto.closePath();
        contexto.fillStyle = "rgba(255, 255, 255," + estrela.transparencia + ")";
        contexto.fill();
        contexto.restore();
    }
}*/

function mostrarAngulo() {
    contexto.font = "bold 18px Arial";
    contexto.textAling = "center";
    contexto.textBaseLine = "middle";
    contexto.fillStyle = "lightgray";
    let anguloMostrar = `Ângulo: ${(moduloLunar.angulo * 180 / Math.PI).toFixed(0)}`;
    contexto.fillText(anguloMostrar + "º", 550, 80);
}

function mostrarAltitude() {
    contexto.font = "bold 18px Arial";
    contexto.textAling = "left";
    contexto.textBaseLine = "middle";
    contexto.fillStyle = "lightgray";
    let anguloMostrar = `Altitude: ${(canvas.height - moduloLunar.posicao.y -
        0.5 * moduloLunar.altura).toFixed(0)}`;
    contexto.fillText(anguloMostrar + "º", 950, 60);
}



function desenhar() {
    // Limpar a tela
    contexto.clearRect(0, 0, canvas.width, canvas.height);
    // Essa função atualiza o modulo lunar em função da gravidade 
    mostrarVelocidadeVertical();
    mostrarVelocidadeHorizontal();
    desenharEstrelas();
    mostrarCombustivel();
    mostrarAngulo();
    mostrarAltitude();
    atracaoGravitacional();
    desenharModuloLunar();


    // Esta função repete a execução da função, desenhar a cada quadro
    if (moduloLunar.posicao.y >= (canvas.height - 0.5 * moduloLunar.altura)) {

        if (moduloLunar.velocidade.y >= 0.5 ||
            Math.abs(moduloLunar.velocidade.x) >= 0.5 ||
            5 < Math.abs (moduloLunar.angulo)

        ){
            contexto.font = "bold 35px Tahoma";
            contexto.textAlign = "center";
            contexto.textBaseLine = "middle";
            contexto.fillStyle = "red";
            return contexto.fillText("Você morreu de queda!☠️", canvas.width / 2, canvas.height / 2);

        }else{
            contexto.font = "bold 35px Tahoma";
            contexto.textAlign = "center";
            contexto.textBaseLine = "middle";
            contexto.fillStyle = "green";
            return contexto.fillText("Você pousou com sucesso!🚀", canvas.width / 2, canvas.height / 2);
        }
    }

    // Esta função repete a execução da função desenhar a cada atualização de tela
    requestAnimationFrame(desenhar);
     function mostrarResultado(mensagem,cor){
        contexto.font="bold 40px Calibri";
        contexto.textAling="center";
        contexto.textBaseLine ="middle";
        contexto.fillStyle=cor;
        contexto.fillText(mensagem, canvas.width/2, canvas.height/2);
        
     }
      

     function mostrarIndicador(mensagem, x, y){
        contexto.font ="bold 18px Arial";
        contexto.textAlign="left"
        contexto.textBaseLine="middle"
        contexto.fillStyle= "lightgray"
        contexto.fillText(mensagem, x, y,);
     }



}

// Pressionando a seta para cima para ligar o motor 
document.addEventListener("keydown", teclaPressionada)
function teclaPressionada(evento) {
    if (evento.keyCode == 38) {
        moduloLunar.motorLigado = true;

    } else if (evento.keyCode == 39) {
        moduloLunar.rotacaoAntiHorario = true;

    } else if (evento.keyCode == 37) {
        moduloLunar.rotacaoHorario = true;
    }
}

// Soltando a seta para cima, para desligar o motor
document.addEventListener("keyup", teclaSolta);
function teclaSolta(evento) {
    if (evento.keyCode == 38) {
        moduloLunar.motorLigado = false;

    } else if (evento.keyCode == 39) {
        moduloLunar.rotacaoAntiHorario = false;

    } else if (evento.keyCode == 37) {
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

    if (moduloLunar.motorLigado) {
        moduloLunar.velocidade.y -= 0.0115 * Math.cos(moduloLunar.angulo)
        moduloLunar.velocidade.x += 0.0115 * Math.sin(moduloLunar.angulo)

    }

    if (moduloLunar.motorLigado) {
        moduloLunar.velocidade.y -= 0.0115
        if (moduloLunar.combustivel > 0) {
            moduloLunar.motorLigado = true;
            moduloLunar.combustivel--;
        } else {
            moduloLunar.motorLigado = false;
        }
    }

    moduloLunar.velocidade.y += gravidade;

}

desenhar();
