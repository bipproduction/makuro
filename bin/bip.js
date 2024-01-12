#!/usr/bin/env node
const { fetch } = require('cross-fetch');
const loading = require('loading-cli');
const from_url = require('require-from-url/sync');
const { execSync } = require('child_process');
require('colors');
const { box } = require('teeti')
const yargs = require('yargs');

; (async () => {
    const load = loading("loading ...").start()
    try {
        const key = yargs.argv._[0]
        const param = await fetch('https://wibudev.wibudev.com/config').then(v => v.json())
        load.stop()

        const host_name = execSync('hostname').toString().trim()
        /**
         * @type {string}
         */
        const url = host_name === param.host_name ? param.url_dev : param.url_pro
        if (!url.includes("https://")) console.log("    dev mode    ".bgMagenta)
        param.url = url

        if (key === "auth") {
            return from_url(`${url}/fun/${key}`)(param)
        }

        if (!param.users.includes(host_name)) return console.log(box("REGISTER PLEASE!").yellow)

        const fun = from_url(`${url}/bip/fun/${key}`)

        if (typeof fun === "function") {
            console.log("load data")
            return fun(param)
        }

        console.log("not function")

    } catch (error) {
        load.stop()
        // console.log(error)
        console.log(`${error}`.gray)
        // console.log(box('ERROR | NO CONNECTION').yellow)
    }

})()


