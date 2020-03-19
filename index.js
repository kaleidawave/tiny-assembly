const readline = require('readline');
const path = require('path');
const fs = require('fs');
const os = require('os');

function randomNum() {
    return Math.floor(Math.random() * 50);
}

async function question(question) {
    return new Promise((res, rej) => {
        const rl = readline.createInterface({input: process.stdin, output: process.stdout});
        rl.question(question, (answer) => {
            rl.close();
            res(answer);
        });
    });
}

const instructions = [
    /if ?\((?<var>.) == 0\) goto (?<line>\d+)/,
    /(?<var>.)--/,
    /(?<var>.)\+\+/,
    /^goto (?<line>\d+)/m,
    /stop/,
    /label (?<statement>.+)/,
]

async function main() {
    const initialVariables = {}, variables = {};

    const file = process.argv[2] || await question("File: ");

    const content = fs.readFileSync(path.join(process.cwd(), file)).toString();
    const statements = content.split(os.EOL);

    let line = 0, sanity = 5000, stop = false, label;

    while (!stop) {
        const statement = statements[line];
        if (!statement) {
            throw new Error(`Could not find statement on line ${line}`);
        }
        let matchingInstruction, params;
        for (const [instruction, expression] of instructions.entries()) {
            const match = statement.match(expression);
            if (match !== null) {
                matchingInstruction = instruction;
                params = match.groups;
                break;
            }
        }

        if (params && params.var && params.var in initialVariables === false) {
            const random = randomNum();
            Reflect.set(initialVariables, params.var, random);
            Reflect.set(variables, params.var, random);
        }

        line++;

        switch (matchingInstruction) {
            case 0: // if 
                if (variables[params.var] === 0)
                    line = parseInt(params.line) - 1;
                break;
            case 1: // --
                variables[params.var]--;
                break;
            case 2: // ++
                variables[params.var]++;
                break;
            case 3: // goto
                line = parseInt(params.line) - 1;
                break;
            case 4: // stop
                stop = true;
                break;
            case 5: // print
                stop = true;
                label = params.statement;
                break;
            default:
                throw new Error(`Unknown statement: ${statement}`);
        }

        sanity--;
        if (sanity < 0) {
            throw new Error(`Incurred infinite loop around line: ${line + 1}`);
        }
    }

    console.log('\nOutput:');
    if (label) {
        console.log('\x1b[34m%s\x1b[0m', `Reached label ${label}`);
    }
    console.log('\x1b[36m%s\x1b[0m', `Initial Variables`, initialVariables);
    console.log('\x1b[33m%s\x1b[0m', `Final Variables`, variables);
}

main();
