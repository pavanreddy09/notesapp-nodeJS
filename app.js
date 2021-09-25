const fs = require("fs");
const yargs = require("yargs");
const chalk = require("chalk");
const notefile = require("./notes.json");
const notes = JSON.parse(fs.readFileSync("notes.json"));

let repeat = false;

// add note to a file
function addNotes(title, body) {
    notes.forEach((note) => {
        if (note.title.toLowerCase() == title.toLowerCase()) {
            repeat = true;
        }
    });
    if (repeat === false) {
        notes.push({
            title, body
        });
        fs.writeFile("notes.json", JSON.stringify(notes), () => {
            console.log(chalk.green.bold("New Note Created...!"));
        });
    } else {
        console.log(chalk.red.bold("OOPS!Title is already taken."));
    }
}
// add command
yargs.command({
    command: "add",
    describe: "add notes to file",
    builder: {
        title: {
            describe: "title",
            demandOption: true,
            type: "string"
        },
        body: {
            describe: "body",
            demandOption: true,
            type: "string"
        }
    },
    handler(argv) {
        addNotes(argv.title, argv.body);
    }
});

// remove note from a file
function removeNotes(title) {
    notes.forEach((note) => {
        if (note.title.toLowerCase() == title.toLowerCase()) {
            repeat = true;
        }
    });
    if (repeat === true) {
        var notelist = notes.filter((note) => {
            return note.title.toLowerCase() != title.toLowerCase();
        });
        fs.writeFile('notes.json', JSON.stringify(notelist), () => {
            console.log(chalk.redBright.bold(title + ' note removed succesfully!'));

        })
    }
    else {
        console.log(chalk.redBright.bold(title + ' Note not found!'));
        console.log(chalk.greenBright.bold('Select a note from following list to remove'));
        displayList();
    }
}

// remove command
yargs.command({
    command: 'remove',
    describe: 'removes notes from the list',
    builder: {
        title: {
            describe: 'title',
            demandOption: true,
            type: 'string'
        },
    },

    handler(argv) {
        removeNotes(argv.title);
    }
});

//Displaying notes
function displayList() {

    if (notes.length != 0) {
        console.log(chalk.bold.magenta.underline(' Your Notes:'));
        notes.forEach((note) => {
            console.log('> ' + chalk.greenBright.bold(note.title));
        });
    }
    else {
        console.log(chalk.blue.bold('List is empty'));
    }
}

// display command
yargs.command({
    command: 'list',
    describe: 'displaying all the notes in the list',

    handler(argv) {
        displayList();
    }
});

//Displaying contents of a note
function readNotes(title) {
    notes.forEach((note, index) => {
        if (note.title.toLowerCase() == title.toLowerCase()) {
            console.log(chalk.bold.green(note.title + ':'));
            console.log(chalk.italic.bold.yellow(notes[index].body));
            repeat = true;
        }

    });
    if (repeat == false) {
        console.log(chalk.bold.blue(title + ' note not found!'));
        console.log(chalk.black.bold('Select a note from following list to display'));
        displayList();
    }
}


// read comand
yargs.command({
    command: 'read',
    describe: 'displays content of the note',
    builder: {
        title: {
            describe: 'title',
            demandOption: true,
            type: 'string'
        },
    },

    handler(argv) {
        readNotes(argv.title);
    }
});
yargs.parse();
