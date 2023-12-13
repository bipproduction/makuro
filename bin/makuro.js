#!/usr/bin/env node
const color = require('colors');
const { exec, execSync } = require('child_process');
const arg = process.argv.splice(2);
const config = JSON.parse(execSync(`curl -s -o- -X POST https://wibudev.wibudev.com/svr/config`).toString().trim())
const url_host = config.dev ? config.url_local : config.url_server
const { box } = require('teeti');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const loading = require('loading-cli');

; (async () => {
    const load = loading("loading ...").start();
    await prisma.config.upsert({
        where: {
            id: 1
        },
        create: { ...config },
        update: { ...config }
    })

    if (config.dev) console.log(box("DEV MODE"))

    const root = require('child_process').execSync('npm root -g').toString().trim();
    const makuro_package = require(`${root}/makuro/package.json`);
    const dep = makuro_package.dependencies
    const dep_list = Object.keys(dep);
    const body = JSON.stringify({
        dep_list
    })

    const child = exec(`curl -s -o- -X POST -H "Content-Type: application/json" -d '${body}' ${url_host}/app | node - ${arg.join(" ")}`)
    child.stdout.on("data", (data) => {
        load.stop()
        console.log(data)
    })
    child.stderr.on("data", data => {
        load.stop()
        console.log(`${data}`.yellow)
    })

})()

