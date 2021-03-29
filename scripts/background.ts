let lastReq = ""

setInterval(() => {
    chrome.tabs.query({
        active: true
    }, (tabs) => {
        const url = tabs[0].url

        if (url !== undefined) {
            updateRPC(url)
        }
    })
}, 2 * 1000)

function updateRPC(url: string) {
    if (url.startsWith("https://www.amazon.de/gp/") || url.startsWith("https://www.amazon.com/gp/")) {
        chrome.tabs.executeScript({
            code: '(function getPlayback() {\n' +
                '    const title = document.getElementsByClassName("atvwebplayersdk-title-text")[0].textContent\n' +
                '    const subtitle = document.getElementsByClassName("atvwebplayersdk-subtitle-text")[0].textContent\n' +
                '    const playPauseBtn = document.getElementsByClassName("atvwebplayersdk-playpause-button")[0].getAttribute("aria-label")\n' +
                '\n' +
                '    return ({ title, subtitle, playPauseBtn })\n' +
                '})()'
        }, results => {
            const seriesName = results["0"]["title"] as string
            const episodeDetails = results["0"]["subtitle"] as string
            const playPauseState = results["0"]["playPauseBtn"] as string

            let episodePosition = ""

            for (let i = 0; i < 4; i++) {
                if (i == 0) {
                    episodePosition += episodeDetails.split(" ")[i]
                } else {
                    episodePosition += " " + episodeDetails.split(" ")[i]
                }
            }

            const episodeName = episodeDetails.replace(episodePosition + " ", "")
            const curReq = "http://localhost:6969/update?sn=" + seriesName.replace(" ", "_") + "&en=" + episodeName.replace(" ", "_") + "&ep=" + episodePosition.replace(" ", "_") + "&pp=" + playPauseState

            if (lastReq != curReq) {
                console.log("Fetching...")

                fetch(curReq, {
                    method: 'POST'
                })

                lastReq = curReq
            }

        })
    }
}

function getPlayback() {
    const title = document.getElementsByClassName("atvwebplayersdk-title-text")[0].textContent
    const subtitle = document.getElementsByClassName("atvwebplayersdk-subtitle-text")[0].textContent
    const playPauseBtn = document.getElementsByClassName("atvwebplayersdk-playpause-button")[0].getAttribute("aria-label")

    return ({ title, subtitle, playPauseBtn })
}