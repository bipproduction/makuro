const config = require('./config.json')
const fs = require('fs')
const arg = process.argv.splice(2)
require('colors')
const { execSync } = require('child_process')
const column = require('columnify')
const _ = require('lodash')
const { box } = require('teeti')


const list_menu = [
    {
        arg: ["-dv", "--development"],
        des: "set to development mode",
        fun: () => {
            set_config(true)
        }
    },
    {
        arg: ["-pd", "--production"],
        des: "set to production mode",
        fun: async () => {
            await set_config(false)
        }
    },
    {
        arg: ["-pb", "--publish"],
        des: "publish app to npm",
        fun: async () => {
            await set_config(false)
            await version()
            execSync(`npm publish`)
        }
    },
    {
        arg: ["-h", "--help"],
        des: "help",
        fun: help
    }
]


function help() {
    console.log(`
MAKURO BUILD APP
Vesion: 1.0.0

${column(list_menu.map((v) => ({ ..._.omit(v, ['fun']) })))}
`)
}

function main() {
    if (arg.length === 0) return help()
    const app = list_menu.find((v) => v.arg.includes(arg[0]))
    if (!app) return console.log(arg[0], "not available")
    app.fun()
}

main()

// === FUN ===

async function set_config(isDev) {
    await new Promise((r) => {
        config.env.dev = isDev ? true : false
        fs.writeFileSync('./config.json', JSON.stringify(config, null, 2))
        console.log("is dev?: " + config.env.dev, "success".green)
        r()
    })
}

/**
 * 
 * @param {string} ver 
 * @returns string
 */
async function version() {
    await new Promise((r) => {
        const ver = require('./package.json')
        const v = ver.version.split('.').map(Number)
        v[2]++;
        ver.version = v.join(".")
        console.log("version: ", ver.version, "success".green)
        fs.writeFileSync('./package.json', JSON.stringify(ver, null, 2))
        r()
    })
}