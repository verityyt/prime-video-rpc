console.log("Working")

chrome.webNavigation.onBeforeNavigate.addListener((details => {
    checkUrl(details.url)
}))

chrome.tabs.onActivated.addListener((activeInfo => {
    chrome.tabs.query({
        active: true
    }, (tab) => {
        const url = tab[0].url

        if(url !== undefined) {
            checkUrl(url)
        }
    })
}))

function checkUrl(url: string) {
    if(url.startsWith("https://www.amazon.de/gp/") || url.startsWith("https://www.amazon.com/gp/")) {
        console.log("Entered prime video page")
    }
}