function calculateNumberOfTerminalRows() {
    let testElement = document.createElement('div');
    testElement.innerText = 'h';
    testElement.style.visibility = 'hidden';
    document.querySelector('#terminal-container').append(testElement);
    testElement.style.fontSize = '14px';
    let fontHeight = testElement.clientHeight + 1;
    testElement.remove();
    return Math.floor((screen.availHeight * 0.8) / fontHeight) - 2;
}

function calculateNumberOfTerminalCols() {
    const ctx = document.createElement('canvas').getContext('2d');
    ctx.font = '18px monospace';
    const fontWidth = ctx.measureText('h').width + 1;
    const screenWidth = screen.availWidth;
    return (
        Math.floor(
            (screenWidth * (screenWidth > 600 ? 0.6 : 0.8)) / fontWidth
        ) + 3
    );
}

function initPrompt() {
    term.x = 0;
    command = [];
    term.prompt();
}

function help() {
    term.writeln('\nBienvenue sur mon \x1B[1;3;31mPortfolio\x1B[0m');
    term.writeln('Liste des commandes :');
    term.writeln('\thelp -- show this help');
    term.write('\tclear -- clear the screen');
}

var socket = io();
var command = [];

const term = new Terminal({
    cursorBlink: true,
    convertEol: true,
    fontFamily: 'Inconsolata',
    letterSpacing: '2',
    fontSize: '18',
    theme: {
        background: '#bbbbbb'
    }
});

term.prompt = () => {
    term.write('\r\nroot @ ~ $ ');
};

term.open(document.getElementById('terminal-container'));
term.write('Bienvenue sur mon \x1B[1;3;31mPortfolio\x1B[0m');
initPrompt();

term.addDisposableListener('key', (key, ev) => {
    const printable =
        !ev.altKey && !ev.altGraphKey && !ev.ctrlKey && !ev.metaKey;

    if (ev.keyCode === 13) {
        socket.emit('command enter', command.join(''));
    } else if (ev.keyCode === 8) {
        // Do not delete the prompt
        if (term.x > 0) {
            command.pop();
            term.write('\b \b');
            term.x--;
        }
    } else if (printable) {
        command.push(key);
        term.write(key);
        term.x++;
    }
});

socket.on('clear', () => {
    term.clear();
    initPrompt();
});

socket.on('help', () => {
    help();
    initPrompt();
});

socket.on('unknown', () => {
    term.write('\nCommande inconnue, tapez "help" pour la liste des commandes');
    initPrompt();
});
