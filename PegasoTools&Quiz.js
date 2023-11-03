// ==UserScript==
// @name     UniPegaso - Tools Quiz & anti EiPass popup
// @include     /.*pegaso\.multiversity\.click.*/
// @grant    none
// @author   MarcoInc
// @description Rimuove popup EiPass, espande gli accordion dei moduli, aiuta nei test di autovalutazione
// @version 1.4.8
// @run-at   document-end
// @license MIT
// @namespace https://greasyfork.org/users/564300
// ==/UserScript==
 
//URL della pagina corrente
var urlPagina=window.location.href;
// URL specificati
var urlLezioni = "lms-courses.pegaso.multiversity.click/main/lp-video_student_view/lp-video_controller.php";
var urlQuiz = "lms-courses.pegaso.multiversity.click/main/lp-video_student_view";
 
 
//PAGINA TUTTE LE LEZIONI -> Estrai in HTLM - Espandi accordions
if (urlPagina.includes(urlLezioni)) {
    console.log("PAGINA LEZIONI");
    var header = document.querySelector(".panel-default");
 
    //ESPANDI LEZIONI
    //BOTTONE ESPANDI LEZIONI
    var buttonEspandi = document.createElement("button");
    buttonEspandi.id = 'espandi';
    buttonEspandi.textContent = 'Espandi moduli lezioni';
    var chapters;
    if(document.querySelector("[class*='name-folder']")){
       chapters = document.querySelectorAll("[class*='name-folder']");
    }
 
    // Creare un gestore di eventi "click"
    buttonEspandi.addEventListener('click', function() {
        // Cercare tutti gli elementi con la classe che inizia con "lesson-single"
        var lessons = document.querySelectorAll("[class*='lesson-single']");

        // Iterare su tutti gli elementi trovati
        for (var lesson of lessons) {
            console.log("Moduli rilevati");
            // Modificare la loro visibilità
            lesson.style.display = lesson.style.display === 'none' ? '' : 'none';
        }

        if(chapters){
            console.log("Capitoli rilevati");
            for (var chapter of chapters) {
            // Modificare la loro visibilità
                chapter.classList.add("active")
            }
            var moduli=document.querySelectorAll(".media .content-folder")
            for (var modulo of moduli) {
                modulo.style.display = modulo.style.display === 'none' ? '' : 'none';
                var subLessons= modulo.querySelectorAll("[class*='media lesson-']");
                 for (var subLesson of subLessons) {
                     // Modificare la loro visibilità
                     subLesson.style.display = subLesson.style.display === 'none' ? '' : 'none';
        }

            }
        }
    });
    header.parentNode.insertBefore(buttonEspandi, header);
 
//PAGINA QUIZ -> Evidenzia - Seleziona
} else if (urlPagina.includes(urlQuiz)) {
    console.log("PAGINA QUIZ");
    // Recupera il contenuto del tuo script JavaScript
    var scripts = document.getElementsByTagName("script");
    var scriptContent = "";
    for (let script of scripts) {
        scriptContent += script.textContent; //salva solo le righe delle domande e risposte
    }
 
    // Usa un'espressione regolare per trovare le risposte corretta nella pagina
    var regex = /this\.rightAns\[\d+\]="\d+"/g; //sta nel tag <script>
    var matches = scriptContent.match(regex);
 
    // Crea un oggetto per le risposte corrette
    var correctAnswers = {};
    for (let match of matches) {
        var questionNumber = match.match(/\d+/g)[0]; //numero domanda
        var correctAnswer = match.match(/\d+/g)[1]; //numero risposta
        correctAnswers[questionNumber] = correctAnswer;
    }
 
    //SELEZIONA -> checked
        // Creazione del pulsante di invio
    var button1 = document.createElement("button");
    button1.innerHTML = "Seleziona le ESATTE";
    var header2 = document.querySelector(".panel-default");
    header2.parentNode.insertBefore(button1, header2);
 
    // Aggiunta dell'evento click al pulsante di invio
    button1.addEventListener("click", function () {
        console.log("SELEZIONATE");
 
        // Iterazione su tutte le domande
        for (var question in correctAnswers) {
            var correctAnswer = correctAnswers[question];
            var selector =
                'input[name="d' + question + '"][value="' + correctAnswer + '"]';
            var correctOption = document.querySelector(selector);
 
            if (correctOption) {
                // Mette la spunta nella domanda corretta
                correctOption.checked = true;
            }
        }
    });//FINE SELEZIONA
 
    //EVIDENZIA
        // Creazione del pulsante di invio
    var button2 = document.createElement("button");
    button2.innerHTML = "Evidenzia le ESATTE";
    header2.parentNode.insertBefore(button2, header2);
 
    // Aggiunta dell'evento click al pulsante di invio
    button2.addEventListener("click", function () {
        console.log("EVIDENZIATE");
 
        // Iterazione su tutte le domande
        for (let match of matches) {
            var questionNumber = match.match(/\d+/g)[0];
            var correctAnswer = match.match(/\d+/g)[1];
            var selector = 'input[name="d' + questionNumber + '"][value="' + correctAnswer + '"]';
            var correctOption = document.querySelector(selector);
            if (correctOption) {
                // Evidenzia la risposta corretta in verde
                correctOption.parentNode.parentNode.style.backgroundColor = "green";
            }
        }
    });//FINE EVIDENZIA
 
    //BOTTONE PREPARA PANIERE -> Thanks to Bruno
    var button3 = document.createElement("button");
    button3.innerHTML = "Prepara paniere";
    header2.parentNode.insertBefore(button3, header2);
 
    var click=false; //evita panieri doppioni
    // Aggiunta dell'evento click al pulsante di invio
    button3.addEventListener("click", function () {
        if(!click){
            console.log("Paniere generato");
            click=true;
            // Iterazione su tutte le domande
            var paniere = '';
            for (let match of matches) {
                var questionNumber = match.match(/\d+/g)[0];
                var correctAnswer = match.match(/\d+/g)[1];
                var selector = 'input[name="d' + questionNumber + '"][value="' + correctAnswer + '"]';
                var correctOption = document.querySelector(selector);
                if (correctOption) {
                    paniere += correctOption.parentNode.parentNode.parentNode.offsetParent.tHead.innerText.replace(/\t/, ") ") + '<br>' + correctOption.parentNode.parentNode.outerText.replace(/\t/, ") ") + '<br>--------------------<br>'
                }
 
            }
            //get numero della lezione
            var numberLesson = /lp_id\=([0-9]+)/.exec(urlPagina)[1];
 
            //Aggiunta paniere
            var paniereVisible = document.createElement("p");
            paniereVisible.id = 'Paniere'
            paniereVisible.innerHTML = '<br>Lezione ' + numberLesson + ') <strong>' + document.querySelectorAll('.list-group-item.title-lesson')[0].outerText + '</strong>\n<br><br>\n' + paniere;
            header2.parentNode.insertBefore(paniereVisible, header2);
 
            //Aggiunta button per copiare il testo
            var copia = document.createElement("button");
            copia.innerHTML = "Copia paniere";
            header2.parentNode.insertBefore(copia, header2);
 
 
            copia.onclick = function() {
                // selezione del contenuto
                var copyText = document.querySelector("#Paniere");
 
                // Copia il paniere
                navigator.clipboard.writeText(copyText.innerText);
 
            };
 
            var stampa = document.createElement("button");
            stampa.innerHTML = "Stampa paniere in pdf";
            header2.parentNode.insertBefore(stampa, header2);
 
            stampa.onclick = function() {
 
                var originalContents = document.body.innerHTML;
 
                document.title = 'Lezione ' + numberLesson + ') ' + document.querySelectorAll('.list-group-item.title-lesson')[0].outerText;
 
                document.body.innerHTML = '';
 
                document.body.insertBefore(paniereVisible, null);
 
                window.print();
 
                document.body.innerHTML = originalContents;
 
            };
        }
        else{
            console.log("Paniere già generato");
        }
    }); //FINE PREPARA PANIERE
}
 
//ANTI-POPUP EIPASS
(function() {
    'use strict';
    //per controllare se ho già chiuso una modale altrimenti lo controllerà in loop
    let modaleChiusa = false;
 
    setInterval(function() {
        if (modaleChiusa) return;//se ne ha trovata una, esce dalla funzione
        //il popup di eipass è l'ultima modale che compare
 
        //cerco tra titti i #box_title quello che ha la dicitura di eipass
        const titolo = Array.from(document.querySelectorAll('#box_title')).find(el => el.textContent === "Arricchisci il tuo Curriculum con le certificazioni EIPASS");
        //risalgo a ritroso al suo contenitore di classe .model-dialog
        const modale = titolo ? titolo.closest('.modal-dialog') : null;
 
        if (modale) {
            const pulsanteChiusura = modale.querySelector('.close');
            if (pulsanteChiusura) {
                pulsanteChiusura.click();
                modaleChiusa = true;//appena chiusa la modale non controllerà più
                console.log('Pulsante di chiusura cliccato.');
            } else {
                console.log('Pulsante di chiusura non trovato.');
            }
        }
    }, 500);//controlla ogni tot millisecondi
})(); //FINE ANTI-POPUO EIPASS