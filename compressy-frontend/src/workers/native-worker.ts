import {WorkerCompressionResult, WorkerMessage, WorkerMessageType} from "./events";


const compressor = await import(/* webpackIgnore: true */ './vendor/main.js')


self.onmessage = async (event: MessageEvent<File>): Promise<void> => {
    await compressor.initializeRuntimeExports();
    const file = event.data;
    const buffer = await file.arrayBuffer();
    self.postMessage(new WorkerMessage(WorkerMessageType.StartedCompression))
    console.log(`Size Before Compression is ${buffer.byteLength} bytes`)
    const compressionTimeTag = "NON_NATIVE_COMPRESS";
    const startTime = performance.now();
    const compressedBuffer = (await compressor.nativeCompress(new Uint8Array(buffer))) as Uint8Array;
    const endTime = performance.now()
    console.log(`Size After Compression is ${compressedBuffer.length} bytes`)
    const result = new WorkerCompressionResult(compressedBuffer, endTime - startTime)
    self.postMessage(new WorkerMessage<WorkerCompressionResult>(WorkerMessageType.FinishedCompression, result), {
        transfer: [compressedBuffer.buffer]
    })
}