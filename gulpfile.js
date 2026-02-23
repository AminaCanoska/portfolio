/*
Prima lancio comando gulp per installare i vari pacchetti di minificazione, es: 
npm install gulp-clean-css --save dev 
npm install gulp-uglify --save-dev

(--save-dev serve per salvare questi progetti solo internalmente a questo progetto)

Dopo li importo con:
import cleanCSS from 'gulp-clean-css'
import uglify from 'gulp-uglify'

Dopo scrivo la funzione che serve a descivere il file di partenza , la funzione da per quel file (cleanCSS(), uglify(), e il file di destinazione)
Esporto tutte queste funzioni in modo che siano accessibili pure da linea di comando 
Le lancio su linea di comando.

-> Dentro a gulp ci sono pure pacchetti che servono a convertire da sass a css direttamente dentro a gulp.

MI SERVE ANCHE UN PACCHETTO PER SPOSTARE LE IMMAGINI
Mi basta però fare un funzione per muoverle.
*/
import gulp from 'gulp';
import cleanCSS from 'gulp-clean-css';
import uglify from 'gulp-uglify';
import concat from 'gulp-concat';
import dartSass from 'sass';
import gulpSass from 'gulp-sass';
const sass = gulpSass(dartSass); //PERCHE'????
import browserSync from 'browser-syn';
import htmlReplace from 'gulp-html-replace';

//COME CONVERTITE UN FILE SCSS IN FILE CSS CON GULP: 
//installa gulp-sass (serve a prendere un file scss e convertirlo in css)
//-->Il comando vero e proprio è fatto da due pacchetti: npm install sass gulp-sass --save-dev (perchè?)
//perchè scarica sia la logica per gestire i file sass sia il paccchetto per scrivere una pipeline in gulp

function sassToCss(){
    return gulp.src('./sass/**/*.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest('./css'));
}//NON LA ESEGUO PERCHE' IN QUESTO FILE NON HO FILE SCSS DA CONVERTIRE 
//SERVE SOLO PER VEDERE OCME SI FA

function cssMinify() {
    return gulp.src('./dev/style.css')
    .pipe(cleanCSS())
    .pipe(gulp.dest('./dst'));
}
function jsMinify() {
    return gulp.src('./dev/*.js') //metti *.js per poter prendere tutti i file che terminano in .js
    //COME CONCATENARE PIU' FILE JS E TRASPORTARLI TUTTI INSIEME: 
    //Si installa il pacchetto gulp-concat + si importa il pacchetto + si concatena creando un unico file all.js
    .pipe(concat('all.js')) //in questo modo ha messo tutti i file con estensione .js in un unico file all.js 
    .pipe(uglify())
    .pipe(gulp.dest('./dst'));
}
//Qando viene creato un unico file all.js nella cartella dst pure l'HTML deve essere aggiornato. Nel HTML, i file main.js e shourtcuts.js (o altri js che abbiamo messi), ora trovandosi in un unico file (all.js), dobbiamo aggiornare in <script src="all.js"></script> nell'HMTL stess.
//Esiste un pacchetto che lo fa in automatico: npm i gulp-html-replace
//Si mette all'interno del codice html un segnaposto 
//Si richiama all'interno di una funzione che dice a gulp che quando trova quel segnaposto di sostituire quel html con un pezzo nuovo

function replaceHTMLBlock(){
    return gulp.src('./dev/*.html')
    .pipe(htmlReplace({
        'sostituisci js' : '<script src="all.js" defer></script>' //sostituisci js è il nome del segnaposto. Va messo nella sezionio dell'html che voglio sostituire. Si racchiude la sezione che voglio sostituire all'interno di un commento <!-- build: sostituisci js --><!--endbuild-->
    }))
    .pipe(gulp.dest('./dest'))
}

function moveImg(){
    return gulp.src('./dev/img/*')
    .pipe(gulp.dest('./dst/img')) //perchè non si mette una funzione come uglify() e css()? 
    //qui la destinazione è ./dst/img perchè deve pure creare una cartella img quando le sposta altrimenti sarebbero sparse
}


/*COS'E' BROWSER SYNC?
Attraverso il comando: npm install browser-sync --save-dev si installa un pacchetto che:
- Avvia un server locale per il tuo progetto
- Ricarica automaticamente il browser quando cambi file (HTML, CSS, JS, ecc.)
- Sincronizza interazioni su più dispositivi (scroll, click, ecc.)

Differenza con il LiveServer normale:
✅ Usa Live Server se:-
- Vuoi solo visualizzare HTML/CSS/JS statici rapidamente
- Stai lavorando in locale e non usi Gulp o task complessi
✅ Usa Browser-Sync se:
- Hai un flusso di lavoro con Gulp (es. compili Sass, minimizzi JS, ecc.)
- Vuoi integrare tutto in un solo comando (gulp watch)
- Testi su più dispositivi contemporaneamente
- Lavori con un backend (PHP, Express...) e ti serve un proxy
*/
function dev(){
    browserSync.init({
        server: {
            baseDir: './dev' //cartella di partenza
        }
    });
    gulp.watch('./dev', cssMinify) //fai partire la minificazione del css subito, nello stesso momento il cui lo compili
//Puoi far partire diversi task nel mentre il browser.syn è in watch
    gulp.watch('./dev/*.html').on('change', browserSync.reload); //ad ogni cambiamento in qualunque file con estesnione .html, il browser si reloada 
//Se lancio il comando dev farà partire un'istanza in ascolto, assegnando una porta. Il terminare, finchè l'istanza è in ascolto non sarà utilizzabile. 
}


//COS'E' BABEL?
//Serve per compilare codice Javascript per browser più vecchi

/*
COME ESEGUIRE PIU' TAST INSIEME, COME RACCHIUDERLI INSIEME E LANCIARE UN SOLO COMANDO?
Si racchiude in un unica variabile le varie funzioni usando due metodi molto simili ma diversi: 
- .gulp.series() --> lancia i task uno dopo l'altro 
- .gulp.parallel() --> lancia i task tutti insieme 
*/
let =  build1 = gulp.series() //lancia i task uno dopo l'altro
let =  build2 = gulp.parallel() //lancia i task tutti insieme

let build = gulp.series(sassToCss, cssMinify);


export {cssMinify, jsMinify, moveImg, build}; //esporto la funzione per renderla disponibile al terminale e usarla da comando  