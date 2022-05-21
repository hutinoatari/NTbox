const { contextBridge } = require("electron");
const fs = require("fs");
const path = require("path");
const buffer = require("buffer");

const syncsafe = ([b0, b1, b2, b3]) => {
    //return b0 * 2**21 + b1 * 2**14 + b2 * 2**7 + b3;
    return b0 * 2**24 + b1 * 2**16 + b2 * 2**8 + b3;
}

const dir = "music";
const getMp3FileNames = () => {
    const fileNames = fs.readdirSync("./" + dir);
    const mp3FileNames = fileNames.filter(e => path.extname(e)===".mp3").map(e => `file://${__dirname}/${dir}/${e}`);
    return mp3FileNames;
}
const getFile = (url) => {
    const bin = new Uint8Array(fs.readFileSync("./music/"+path.basename(url)));
    const head = bin.slice(0, 10);
    if(String.fromCharCode(...(head.slice(0, 3))) === "ID3"){
        const size = syncsafe(head.slice(6, 10));
        const data = bin.slice(10, 10+size);
        let p = 0;
        let title = "不明";
        let artist = "不明";
        while(true){
            if(size <= p) break;
            const frameID = String.fromCharCode(...(data.slice(p, p+4)));
            const frameSize = syncsafe(data.slice(p+4, p+8)) +10;
            const frameData = String.fromCharCode(...(data.slice(p+10, p+frameSize)));
            console.log(frameID, frameSize, frameData);
            if(frameID == "TIT2"){
                title = frameData;
            }else if(frameID == "TPE1"){
                artist = frameData;
            }
            p += frameSize;
        }
        return { title, artist };
    }

    return { title: "不明", artist: "不明" };
}

contextBridge.exposeInMainWorld("requires", {
    getMp3FileNames: getMp3FileNames,
    getFile: getFile,
    buffer: buffer,
});
