import {Util} from "../Util";
import {FfmpegCommand} from "fluent-ffmpeg";
import {ChildProcess} from "child_process";

const fs = require('fs');
const ffmpeg = require('fluent-ffmpeg');

export class Transcoder {

    protected streamName: string;
    protected enable480 = false;
    protected command: FfmpegCommand;

    constructor(streamName: string) {
        this.streamName = streamName;
    }

    async start(): Promise<boolean> {

        let srcPath = Util.storagePath('hls/' + this.streamName + '/src');

        // Writable directory must already exist or else ffmpeg fails
        fs.mkdirSync(srcPath, {
            recursive: true
        });

        let mobilePath = Util.storagePath('hls/' + this.streamName + '/480p');

        fs.mkdirSync(mobilePath, {
            recursive: true
        });

        // never deletes old segments for some reason. Fix? -hls_wrap 5
        const defaultOutputOptions = [
            '-max_muxing_queue_size 9999',
            '-f hls',
            '-hls_time 4',
            '-hls_list_size 5',
            '-hls_flags delete_segments',
            '-hls_start_number_source epoch',
            '-hls_playlist_type event',
        ];

        let optionsForSource = [
            '-c copy'
        ].concat(defaultOutputOptions);

        let optionsFor480 = [
            '-c:v libx264',
            '-c:a aac',
            '-b:a 128k',
            '-ac 2',
            '-preset veryfast',
            '-crf 23',
            '-s 854x480',
        ].concat(defaultOutputOptions);

        const streamName = this.streamName;
        const enable480 = this.enable480;

        const oThis = this;

        return new Promise((resolve, reject) => {

            let command = ffmpeg();

            command
                .input(Util.rtmpStreamUrl(streamName))
                .inputOption('-re');

            command
                .output(srcPath + '/index.m3u8')
                .outputOptions(optionsForSource.concat(defaultOutputOptions))

            if (enable480) {

                command.output(mobilePath + '/index.m3u8')
                    .outputOptions(optionsFor480.concat(defaultOutputOptions))
            }

            command
                .on('start', function (commandLine: string) {
                    console.log(`[ffmpeg] ${commandLine}`);

                    const process = command.ffmpegProc as ChildProcess;
                    const pid = process.pid;

                    console.log(`[ffmpeg] PID: ${pid}`);

                    process.on('exit', function () {
                        reject('Process was killed.');
                    });
                })
                .on('error', function (err: any, stdout: any, stderr: any) {
                    reject(err);
                })
                .on('end', function (stdout: any, stderr: any) {
                    resolve(true);
                });

            command.run();

            this.command = command;

        });
    }

    public stop(): void {

        if (this.command) {

            // Sending a signal that terminates the process will result in the error event being emitted.
            this.command.on('error', function () {
                console.log('Ffmpeg has been killed');
            });

            this.command.kill('SIGKILL');
        }
    }
}