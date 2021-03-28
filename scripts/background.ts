
chrome.webNavigation.onBeforeNavigate.addListener((details => {
    checkUrl(details.url)
}))

chrome.tabs.onActivated.addListener((activeInfo => {
    chrome.tabs.query({
        active: true
    }, (tabs) => {
        const url = tabs[0].url

        if (url !== undefined) {
            checkUrl(url)
        }
    })
}))

function checkUrl(url: string) {
    if (url.startsWith("https://www.amazon.de/gp/") || url.startsWith("https://www.amazon.com/gp/")) {
        chrome.tabs.executeScript({
            code: '(function getPlayback() {\n' +
                '    const title = document.getElementsByClassName("atvwebplayersdk-title-text")[0].textContent\n' +
                '    const subtitle = document.getElementsByClassName("atvwebplayersdk-subtitle-text")[0].textContent\n' +
                '\n' +
                '    return({ title, subtitle })\n' +
                '})()'
        }, results => {
            const seriesName = results["0"]["title"] as string
            const episodeDetails = results["0"]["subtitle"] as string

            console.log(seriesName)

            let episodePosition = ""

            for (let i = 0; i < 4; i++) {
                if (i == 0) {
                    episodePosition += episodeDetails.split(" ")[i]
                } else {
                    episodePosition += " " + episodeDetails.split(" ")[i]
                }
            }

            console.log(episodePosition)

            const episodeName = episodeDetails.replace(episodePosition + " ", "")

            console.log(episodeName)

            fetch("http://localhost:4040/?sn=" + seriesName + "&en=" + episodeName + "&ep=" + episodePosition, {
                method: 'POST',
                mode: 'cors'
            })

        })
    }
}