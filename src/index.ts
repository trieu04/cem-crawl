import commandLineUsage from 'command-line-usage'
import commandLineArgs from 'command-line-args'

const sections = [
    {
        header: 'A typical app',
        content: 'Generates something {italic very} important.'
    },
    {
        header: 'Options',
        optionList: [
            {
                name: 'input',
                typeLabel: '{underline file}',
                description: 'The input to process.'
            },
            {
                name: 'help',
                description: 'Print this usage guide.'
            }
        ]
    }
]
const usage = commandLineUsage(sections)
console.log(usage)

const optionDefinitions = [
    { name: 'verbose', alias: 'v', type: Boolean },
    { name: 'src', type: String, multiple: true, defaultOption: true },
    { name: 'timeout', alias: 't', type: Number }
]

const options = commandLineArgs(optionDefinitions)

console.log(options)