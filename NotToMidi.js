const MidiWriter = require('midi-writer-js');

const divisions = 128;
const instrument_id = 1;

class NotToMidi{
    constructor(bpm=120, time_signature='4/4'){
        this.tracks = {};

        this.bpm = bpm;
        this.time_signature_set = time_signature.split('/').map(e=>parseInt(e));;
    }
    touchTrackID(track_id){
        if(!this.tracks[track_id]){
            this.tracks[track_id] = new MidiWriter.Track();
            this.tracks[track_id].setTimeSignature(this.time_signature_set[0], this.time_signature_set[1]);
            this.tracks[track_id].setTempo(this.bpm);
        }
    }
    addNot(not_file, track_id, {data_start_beat, data_end_beat, start_beat, length}){
        this.touchTrackID(track_id);

        let data = JSON.parse(not_file).data;
        let tick_offset = start_beat * divisions;

        data_end_beat -= data_start_beat;
        let data_offset = 0;
        for(let count = 0;; count++){
            if(count >= data.length){
                count = -1;
                data_offset += data_end_beat;
                continue;
            }
            var split = data[count].split(',').map(d=>{if(!isNaN(d)) d=parseFloat(d);return d});
            split[0] -= data_start_beat;
            if(split[0] < 0 || split[0] >= data_end_beat){
                continue;
            }
            split[3] = Math.min(split[3], data_end_beat);

            split[0] += data_offset;
            if(split[0] >= length){
                break;
            }
            split[3] = Math.min(split[3], length-split[0]);

            var charsplit = split[1].split('');
            charsplit.push(parseInt(charsplit.pop())+1);
            split[1] = charsplit.join('');
            this.tracks[track_id].addEvent(new MidiWriter.NoteEvent({
                startTick: (split[0]*divisions) + tick_offset,
                pitch: split[1],
                velocity: split[2],
                duration: 'T'+(split[3]*divisions)
            }));
        }
    }
    getTrackArray(){
        var sortedTracks = [];
        let keys = Object.keys(this.tracks).sort();
        for(let key of keys){
            sortedTracks.push(this.tracks[key]);
        }
        return sortedTracks;
    }
    getMid(){
        let writer = new MidiWriter.Writer(this.getTrackArray());
        return writer.buildFile();
    }
    writeMid(path){
        let writer = new MidiWriter.Writer(this.getTrackArray());
        return writer.saveMIDI(path);
    }
};

module.exports = NotToMidi;