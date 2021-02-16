const { input } = require("m4rch")
const ytdl = require("ytdl-core")
const ffmpeg = require('fluent-ffmpeg')
const NodeID3 = require('node-id3')
const fs = require("fs")

const { Tags, Config, Title } = require("./this.js")

module.exports = async function (args) {
	let config = new Config(args.slice(2))

	if (!fs.existsSync(__dirname + "/settings.json")) fs.writeFileSync(__dirname + "/settings.json", "{}")
	let settings = JSON.parse(fs.readFileSync(__dirname + "/settings.json"))

	if ((config.config.includes("p") || config.config.includes("path")) && !config.text.length) {
		if (!config.main) return console.log(settings.path || "\x1b[31mno path sepcified\x1b[0m")
		if (!/^[a-zA-Z]\:/.test(config.main)) return console.log("\x1b[31m%s\x1b[0m", "use absolute paths only.")
		
		settings.path = config.main
		fs.writeFileSync(__dirname + "/settings.json", JSON.stringify(settings, null, "\t"))

		return
	} else if ((config.config.includes("v") || config.config.includes("version")) && !config.main) return console.log("\x1b[36mv%s\x1b[0m", JSON.parse(fs.readFileSync(__dirname + "/../package.json")).version)	

	let path = (config.config.includes("p") || config.config.includes("path")) ? config.text[0] : settings.path
	if (!path) return console.log("\x1b[31m%s\x1b[0m", "no path specified.")

	if (!config.main) return console.log("\x1b[31m%s\x1b[0m", "no id given.")
	if (/\s/.test(config.main)) return console.log("\x1b[31m%s\x1b[0m", "id includes whitepace.")
	config.main = config.main.replace(/^(?:https?:\/\/)?(?:www\.)?youtu\.be\/(.+)$/, "$1")

	let info = await ytdl.getBasicInfo(config.main)
	info = info.videoDetails
	info.media = info.media.category == "Music" ? info.media : {}
	
	if (config.config.includes("mp4") || config.config.includes("v") || config.config.includes("video")) {

		let { title } = new Title(info)
		title = (await input(`title (${title}): `)).trim() || title

		path = /(\\\\|\/)$/.test(path) ? `${path}${title.replace(/[\/\\*?"<>|\:]/g, " ").replace(/ +/g, " ")}.mp4` : `${path}/${title.replace(/[\/\\*?"<>|\:]/g, " ").replace(/ +/g, " ")}.mp4`

		ytdl(config.main, { quality: "highest" })
			.pipe(fs.createWriteStream(path))
			.on("finish", _ => console.log("\x1b[32m%s\x1b[0m", "successfully downloaded"))

	} else {

		let tags = new Tags(info)

		if (!config.config.includes("y") && !config.config.includes("yes")) {
			for (tag_name in tags) {
				let temp = await input(`${tag_name} (${tags[tag_name]}): `)
				tags[tag_name] = temp || tags[tag_name]
			}
		}

		path = /(\\\\|\/)$/.test(path) ? `${path}${tags.title.replace(/[\/\\*?"<>|\:]/g, " ").replace(/ +/g, " ")}.mp3` : `${path}/${tags.title.replace(/[\/\\*?"<>|\:]/g, " ").replace(/ +/g, " ")}.mp3`

		ffmpeg(ytdl(config.main, { quality: 'highestaudio' }))
			.audioBitrate(128)
			.format("mp3")
			.pipe(fs.createWriteStream(path))
			.on("finish", _ => {
				console.log("\x1b[33m%s\x1b[0m", "successfully downloaded, adding tags...")

				let success = NodeID3.write(tags, path)
				if (!success) console.log("\x1b[31m%s\x1b[0m", "err: " + success)

				console.log("\x1b[32m%s\x1b[0m", "successfully added tags.")
				setTimeout(process.exit(), 1000)
			})

	}
}
