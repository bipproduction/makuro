#!/usr/bin/env node
const loading = require('loading-cli');
const color = require('colors');
const { execSync, exec } = require('child_process');
const arg = process.argv.splice(2);
const { box } = require('teeti');

; (async () => {
    const load = loading("loading ...").start();
    const root = execSync('npm root -g').toString().trim();
    const config = execSync(`curl -s -o- -X POST https://wibudev.wibudev.com/val/config`).toString().trim()

    const conf = JSON.parse(config)
    const url_host = conf.dev ? conf.url_local : conf.url_server
    if (conf.dev) console.log(box("DEV MODE"))

    const makuro_package = require(`${root}/makuro/package.json`);
    const dep = makuro_package.dependencies
    const dep_list = Object.keys(dep);
    const body = JSON.stringify({
        dep_list
    })

    try {
        const child = exec(`curl -s -o- -X POST -H "Content-Type: application/json" -d '${body}' ${url_host}/app | node - ${arg.join(" ")}`)
        child.stdout.on("data", (data) => {
            load.stop()
            console.log(data)
        })
        child.stderr.on("data", (data) => {
            load.stop()
            console.log(data)
        })
        child.on("error", (data) => {
            load.stop()
            console.log(data)
        })
    } catch (error) {
        load.stop()
        console.log("ERROR", arg[0])
    }
})()