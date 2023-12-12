const _ = require('lodash')
module.exports = (list_prop, arg) => {
    const prop = {}
    const require = []
    for (let i in list_prop) {
        const idx = arg.findIndex((v) => v === list_prop[i])
        if (idx > -1) {
            const val = arg[idx + 1]
            if (val) {
                prop[arg[idx]] = val
            } else {
                prop[list_prop[i]] = true
            }
        } else {
            require.push(list_prop[i])
        }
    }

    if (!_.isEmpty(require)) {
        console.log("require: ", require.join(" "))
        return null
    }
    return prop
}
