#!/usr/bin/env node
const { PrismaClient } = require("@prisma/client")
const prisma = new PrismaClient()
const { exec, execSync } = require('child_process');
const path = require('path')
const config = require("../config.json");
const ver = require('../package.json');
const urlhost = !config.env.dev ? "https://wibudev.wibudev.com" : "http://localhost:3005";
const arg = process.argv.splice(2);
const fs = require('fs');
const columnify = require('columnify');
const list_app = JSON.parse(execSync(`curl -s -o- ${urlhost}/list-app`).toString().trim()).map((v, k) => ({ no: k + 1, ['list_app']: v }));
require('colors');
const { fetch } = require('cross-fetch');
const _ = require('lodash');

; (async () => {

    const user = await prisma.user.findUnique({ where: { id: 1 } })
    if (!user) return console.log("login first")

    if (arg.length === 0) {
        const col = columnify(list_app, { showHeaders: false }).toString().trim()
        console.log(`
${"AVAILABLE APP".green}
${col.gray}
        `)
        return
    }

    if (arg[0] === "log") {
        console.log(fs.readFileSync(path.join(__dirname, "./../err.log")).toString().trim())
        return
    }
    const child = exec(`curl -s -o- -X POST ${urlhost}/cmd/${arg[0]} | node - ${arg.splice(1).join(' ')}`)
    child.stdout.on("data", (data) => {
        console.log(data)
    })
    child.stderr.on("data", (data) => {
        fs.writeFileSync(path.join(__dirname, "./../err.log"), data.toString())
        // console.log("==== std error ====".yellow)
        console.log(`${data}`.yellow)
    })

    child.on("error", (data) => {
        console.log("==== error ====".red)
    })

    child.on("close", () => {
        child.kill()
    })
})()

