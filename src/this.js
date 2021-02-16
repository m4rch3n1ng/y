module.exports = {
	Tags: class Tags {
		constructor (info) {
			let title = info.title.replace(/\[.+?\]/g, "").replace(/\(((official)? *(.*?) *lyric *video|official *(.*?) *(music)? *video|(official)? *audio|prod.+?)\)/gi, "").trim().split(/ +\- +/)
			let artist = info.media.artist || ((info.author && info.author.name) ? info.author.name.replace(/\-\s+Topic/, "").trim() : null  || info.ownerChannelName.replace(/\-\s+Topic/, "").trim())

			this.title = info.media.song || title.slice(1).join(" - ") || title[0]
			this.artist = artist
			this.album = info.media.album || "single"
		}
	},
	Config: class Config {
		constructor (args) {
			let text = args.filter(item => !item.startsWith("-"))
			let config = args.filter(item => item.startsWith("-")).flatMap(item => (item.startsWith("--") ? item.replace(/^\-+/, "") : item.slice(1).split("")))

			this.main = text.shift()
			this.config = config.filter((el, i) => config.indexOf(el) == i).sort()
			this.text = text
		}
	},
	Title: class Title {
		constructor (info) {
			this.title = info.title.replace(/\[.+?\]/g, "").replace(/\(((official)? *(.*?) *lyric *video|official *(.*?) *(music)? *video|(official)? *audio|prod.+?)\)/gi, "").trim()
		}
	}
}
