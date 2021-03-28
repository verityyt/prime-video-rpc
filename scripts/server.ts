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
        origin: ['http://localhost']
    }))

    app.post("/", (req, res) => {
        const query = req.query

        const seriesName = query["sn"]
        const episodeName = query["en"]
        const episodePosition = query["ep"]

        rpc.setActivity({
            details: episodeName,
            state: seriesName + " - " + episodePosition.replace("Staffel", "S."),
            largeImageKey: "default",
            largeImageText: "Amazon Prime Video",
            instance: true
        })

    })

    app.listen(4040, () => {
        console.log(`\nExpress running...`)
    })

})