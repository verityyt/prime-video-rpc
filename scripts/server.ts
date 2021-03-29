const DiscordRPC = require("discord-rpc")
const expres = require("express")
const cors = require("cors")

const clientId = "825824450406252635"
const rpc = new DiscordRPC.Client({ "transport": "ipc" })

rpc.login({
    clientId
}).catch(console.error)

rpc.on("ready", () => {

    const app = expres()

    app.use(cors({
        origin: ['http://localhost', 'chrome-extension://ljfnldkldlmacpiffmhngibmcjokaajl']
    }))

    app.post("/update", (req, res) => {
        const query = req.query

        console.log("call")

        const seriesName = query["sn"].replace("_", " ")
        const episodeName = query["en"].replace("_", " ")
        const episodePosition = query["ep"].replace("_", " ")
        const playPauseState = query["pp"]

        let smallImageKey = "play"
        let smallImageText = "Playing"

        if (playPauseState == "Play") {
            smallImageKey = "pause"
            smallImageText = "Paused"
        }


        rpc.setActivity({
            details: episodeName,
            state: seriesName + " - " + episodePosition.replace("Staffel", "S."),
            largeImageKey: "default",
            largeImageText: "Amazon Prime Video",
            smallImageKey: smallImageKey,
            smallImageText: smallImageText,
            instance: true
        })

        res.send({ sucess: true })
    })

    app.listen(6969, () => {
        console.log(`\nExpress running...`)
    })

})