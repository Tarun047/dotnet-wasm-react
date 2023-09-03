import {gzip} from 'pako';
import {WorkerCompressionResult, WorkerMessage, WorkerMessageType} from "./events";

self.onmessage = async (event: MessageEvent<File>): Promise<void> => {
    const file = event.data;
    const buffer = await file.arrayBuffer();
    self.postMessage(new WorkerMessage(WorkerMessageType.StartedCompression))
    console.log(`Size Before Compression is ${buffer.byteLength} bytes`)
    const compressionTimeTag = "NON_NATIVE_COMPRESS";
    const startTime = performance.now();
    const compressedBuffer = gzip(buffer);
    const endTime = performance.now()
    console.log(`Size After Compression is ${compressedBuffer.length} bytes`)
    const result = new WorkerCompressionResult(compressedBuffer, endTime - startTime)
    self.postMessage(new WorkerMessage<WorkerCompressionResult>(WorkerMessageType.FinishedCompression, result), {
        transfer: [compressedBuffer.buffer]
    })
}

export {};