const video = document.querySelector('.player');
const canvas = document.querySelector('.photo');
const ctx = canvas.getContext('2d');
const strip = document.querySelector('.strip');
const snap = document.querySelector('.snap');

//pre pracu s tymto treba cd do tohto foldru
//v cmd treba zvolit: npm install
//naskedne: npm start

function getVideo() {
    navigator.mediaDevices.getUserMedia({ video: true, audio: false })
        .then(localMediaStream => {
            video.src = window.URL.createObjectURL(localMediaStream);
            video.play();
        })
        .catch(err => {
            console.err(`OH NO!!!`, err);
        });
    //nastavenie src pre video element na zdroj z webkamery
    //spustenia videa
    //zachytenie chyby v pripade ak nie je povolena webkamera
}

function paintToCanvas() {
    const width = video.videoWidth;
    const height = video.videoHeight;
    canvas.width = width;
    canvas.height = height;

    setInterval(() => {
        ctx.drawImage(video, 0, 0, width, height); //kazdych 16 ms je zobrani obrazok z videa a zobrazeny v canvase
        let pixels = ctx.getImageData(0, 0, width, height); //zoberie pixely z aktualneho obrazku
        //pixels = redEffect(pixels); //upravi pixely podla defovanej fnc
        //pixels = rgbSplit(pixels); //upravi pixely podla defovanej fnc
        pixels = greenScreen(pixels);
        //debugger; //tu sa zastavi vykonavanie javascriptu (breakpoint)
        ctx.putImageData(pixels, 0, 0); //vlozi do canvas upravene pixely
    }, 16);
}

function redEffect(pixels) {
    for (let i = 0; i < pixels.data.length; i += 4) {
        //pixels[i] //red
        //pixels[i + 1] //green
        //pixels[i + 2] //blue
        pixels.data[i + 0] = pixels.data[i + 0] + 100;  //RED
        pixels.data[i + 1] = pixels.data[i + 1] - 50;   //GREEN
        pixels.data[i + 2] = pixels.data[i + 2] * 0.5;  //BLUE
    }
    return pixels;
}

function rgbSplit(pixels) {
    for (let i = 0; i < pixels.data.length; i += 4) {
        pixels.data[i -150] = pixels.data[i + 0];  //RED
        pixels.data[i + 100] = pixels.data[i + 1];   //GREEN
        pixels.data[i -150] = pixels.data[i + 2];  //BLUE
    }
    return pixels;
}

function greenScreen(pixels) {
    const levels = {}; //definicia objektu

    document.querySelectorAll('.rgb input').forEach((input) => {
        levels[input.name] = input.value;
    });

    for (i = 0; i < pixels.data.length; i = i + 4) {
        red = pixels.data[i + 0];
        green = pixels.data[i + 1];
        blue = pixels.data[i + 2];
        alpha = pixels.data[i + 3];

        if (red >= levels.rmin
            && green >= levels.gmin
            && blue >= levels.bmin
            && red <= levels.rmax
            && green <= levels.gmax
            && blue <= levels.bmax) {
            // take it out!
            pixels.data[i + 3] = 0;
        }
    }

    return pixels;
}

function takePhoto() {
    //played the sound
    snap.currentTime = 0;
    snap.play();

    //take data out of the canvas
    const data = canvas.toDataURL('image/jpeg');
    const link = document.createElement('a'); //vytvorenie elementi link v html dokumente
    link.href = data;
    link.setAttribute('download', 'handsome');
    link.innerHTML = `<img src="${data}" alt="Handsome Man"/>`; //link ako image
    strip.insertBefore(link, strip.firstChild); //urcuje kam bude vlozeny vytvoreny element
}

getVideo();

video.addEventListener('canplay', paintToCanvas);
