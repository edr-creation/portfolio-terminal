const info = {
  bio: "\nBonjour, je suis Enzo Do rosario",
  prompt: "Vous voulez en savoir plus sur moi ? Retrouvez moi sur ces sites :",
  links: [
    {
      name: "GitHub",
      value: "edr-creation"
    },
    {
      name: "LinkedIn",
      value: "Enzo Do rosario"
    }
  ],
  email: "dorosario.enzo@protonmail.com"
};

function calculateNumberOfTerminalRows() {
  let testElement = document.createElement("div");
  testElement.innerText = "h";
  testElement.style.visibility = "hidden";
  document.querySelector("#terminal-container").append(testElement);
  testElement.style.fontSize = "14px";
  let fontHeight = testElement.clientHeight + 1;
  testElement.remove();
  return Math.floor((screen.availHeight * 0.8) / fontHeight) - 2;
}

function calculateNumberOfTerminalCols() {
  const ctx = document.createElement("canvas").getContext("2d");
  ctx.font = "18px monospace";
  const fontWidth = ctx.measureText("h").width + 1;
  const screenWidth = screen.availWidth;
  return (
    Math.floor((screenWidth * (screenWidth > 600 ? 0.6 : 0.8)) / fontWidth) + 3
  );
}

function initPrompt() {
  term.x = 0;
  command = [];
  term.prompt();
}

function help() {
  term.writeln("\nBienvenue sur mon \033[35mPortfolio\033[0m\n");
  term.writeln("Liste des commandes :");
  term.writeln(
    "\t\33[35mhcf\033[0m -- En savoir plus sur moi (Votre ordinateur ne prendra pas feu)"
  );
  term.writeln("\t\33[35mhelp\033[0m -- Affiche l'aide");
  term.writeln("\t\33[35mclear\033[0m -- Clear le terminal");
}

var socket = io();
var command = [];

const term = new Terminal({
  cursorBlink: true,
  convertEol: true,
  fontFamily: "Inconsolata",
  letterSpacing: "2",
  fontSize: "18",
  theme: {
    background: "#1B123A",
    foreground: "#f8f8f8",
    cursor: "#f8f8f8",
    cursorAccent: "#f8f8f8",
    selection: "#f8f8f8",
    black: "#1B123A",
    brightBlack: "#B304B5",
    red: "#FF009D",
    brightRed: "#FFE719",
    green: "#2DFFFE",
    brightGreen: "#16BC14",
    yellow: "#ffa800",
    brightYellow: "#e1a126",
    blue: "#0EF7F7",
    brightBlue: "#0EF7F7",
    magenta: "#F20EF7",
    brightMagenta: "#F20EF7",
    cyan: "#0fdcb6",
    brightCyan: "#0a9b81",
    white: "#ebebeb",
    brightWhite: "#f8f8f8"
  }
});

term.prompt = () => {
  term.write("\r\n\033[31mroot\033[032m ~ $ \033[0m");
};

term.open(document.getElementById("terminal-container"));
term.write("\033[032m");
// term.write(`
//  _____                ______       ______                     _
// |  ___|               |  _  \\      | ___ \\                   (_)
// | |__ _ __  _______   | | | |___   | |_/ /___  ___  __ _ _ __ _  ___
// |  __| '_ \\|_  / _ \\  | | | / _ \\  |    // _ \\/ __|/ _\` | '__| |/ _ \\
// | |__| | | |/ / (_) | | |/ / (_) | | |\\ \\ (_) \\__ \\ (_| | |  | | (_) |
// \\____/_| |_/___\\___/  |___/ \\___/  \\_| \\_\\___/|___/\\__,_|_|  |_|\\___/
// `);
help();
initPrompt();
term.focus();

term.addDisposableListener("key", (key, ev) => {
  const printable = !ev.altKey && !ev.altGraphKey && !ev.ctrlKey && !ev.metaKey;

  if (ev.keyCode === 13) {
    socket.emit("command enter", command.join(""));
  } else if (ev.keyCode === 8) {
    // Do not delete the prompt
    if (term.x > 0) {
      command.pop();
      term.write("\b \b");
      term.x--;
    }
  } else if (printable) {
    command.push(key);
    term.write(key);
    term.x++;
  }
});

socket.on("clear", () => {
  term.clear();
  initPrompt();
});

socket.on("help", () => {
  help();
  initPrompt();
});

socket.on("hcf", () => {
  term.writeln(info.bio);
  term.writeln(info.prompt);
  info.links.forEach(link => {
    term.writeln("\t\33[35m" + link.name + "\33[0m" + " -- " + link.value);
  });
  initPrompt();
});

socket.on("unknown", () => {
  term.write('\nCommande inconnue, tapez "help" pour la liste des commandes');
  initPrompt();
});
