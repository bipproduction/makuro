#!/usr/bin/env node
const { exec } = require('child_process');
const arg = process.argv.splice(2);
const config = require('../config.json')
const url_host = config.dev ? config.env.local.path : config.env.server
require('colors');

; (async () => {
    const root = require('child_process').execSync('npm root -g').toString().trim();
    const makuro_package = require(`${root}/makuro/package.json`);
    const dep = makuro_package.dependencies
    const dep_list = Object.keys(dep);
    const body = JSON.stringify({
        dep_list
    })

    const child = exec(`curl -s -o- -X POST -H "Content-Type: application/json" -d '${body}' ${url_host}/app | node - ${arg.join(" ")}`)
    child.stdout.on("data", console.log)
    child.stderr.on("data", data => console.log(`${data}`.yellow))
    
})()

