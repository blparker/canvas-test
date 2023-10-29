export default class CanvasCapture {
    private recorder: MediaRecorder;
    private stoppingPromise: Promise<string>;
    private resultAsBlob: Blob | null = null;

    constructor(private canvas: HTMLCanvasElement) {
        const stream = this.canvas.captureStream(30);
        this.recorder = new MediaRecorder(stream);

        let chunks: Blob[] = [];
        this.recorder.ondataavailable = e => chunks.push(e.data);
        this.resultAsBlob = null;

        this.stoppingPromise = new Promise((resolve, reject) => {
            this.recorder.onstop = e => {
                const blob = new Blob(chunks, { 'type' : 'video/mp4' });
                chunks = [];
                const clip = URL.createObjectURL(blob);
                this.resultAsBlob = blob;

                resolve(clip);
            };
        });
    }

    start() {
        this.recorder.start();
    }

    async stop() {
        this.recorder.stop();
        return await this.stoppingPromise;
    }

    async resultAsBase64(): Promise<string | null> {
        return new Promise((resolve, reject) => {
            if (! this.resultAsBlob) {
                return reject('Result is null')
            }

            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result as string);
            reader.readAsDataURL(this.resultAsBlob);
        });
    }
}
