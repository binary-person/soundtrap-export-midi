const https = require('https');
const url = require('url');
const fs = require('fs');
const NotToMidi = require('./NotToMidi');

const projectid = process.argv[2];
const includeflag = process.argv[3] || '';
const sessioncookie = fs.readFileSync('cookie.txt', 'utf8');

async function main() {
    var projectinfo = JSON.parse((await getHttpsJSON(`https://www.soundtrap.com/api/project/getProject1/?id=${projectid}&view=detailed`)).data);

    var not_midi_writer = new NotToMidi(projectinfo.bpm, projectinfo.time_signature);

    var track_count = 0;
    for(let trackid in projectinfo.tracks){
        var track = projectinfo.tracks[trackid];
        if(track.name.includes(includeflag) && Object.keys(track.note_regions).length){
            for(let regionid in track.note_regions){
                var note_id = projectinfo.datas[track.note_regions[regionid].data_id].server_id;
                var not_file = await getHttps(`https://www.soundtrap.com/user-assets/blob/${note_id}.not`);
                not_midi_writer.addNot(not_file, track_count, track.note_regions[regionid]);
            }
            track_count++;
        }
    }

    not_midi_writer.writeMid('export');
}

function streamToString(stream) {
    const chunks = []
    return new Promise((resolve, reject) => {
        stream.on('data', chunk => chunks.push(chunk));
        stream.on('error', reject);
        stream.on('end', () => resolve(Buffer.concat(chunks).toString('utf8')));
    })
}
function getHttps(requesturl) {
    return new Promise(resolve=>{
        var options = url.parse(requesturl);
        options.headers = {
            Cookie: sessioncookie
        };
        https.get(options, async res=>{
            if(res.statusCode !== 200){
                console.log('Warning: a non-200 returned from requesting '+requesturl);
            }
            streamToString(res).then(resolve);
        });
    });
}
function getHttpsJSON(...args) {
    return new Promise(resolve=>getHttps(...args).then(data=>{
        var parsed = JSON.parse(data);
        if(parsed.name && parsed.name === 'LoginRequiredException'){
            console.log('Login expired');
            process.exit(1);
        }
        if(parsed.error_message){
            console.log('API error occurred:');
            console.log(parsed);
            process.exit(1);
        }
        resolve(parsed);
    }));
}

main();