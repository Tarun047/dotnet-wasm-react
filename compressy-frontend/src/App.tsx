import React, {ChangeEvent, useEffect} from 'react';
import {WorkerCompressionResult, WorkerMessage, WorkerMessageType} from "./workers/events";

function App() {
    const [nonNativeWorker, setNonNativeWorker] = React.useState<Worker>()
    const [nonNativeResult, setNonNativeResult] = React.useState<string>();
    const [compressor, setCompressor] = React.useState<{
        initializeRuntimeExports: () => Promise<void>,
        nativeCompress: (data: Uint8Array) => Promise<Uint8Array>
    }>();
    const [nativeResult, setNativeResult] = React.useState<string>();

    async function initializeCompressor() {
        const compressorInstance = await import(/* webpackIgnore: true */ './vendor/main.js');
        await compressorInstance.initializeRuntimeExports();
        setCompressor(compressorInstance);
    }

    useEffect(() => {
        const nonNativeWorker = new Worker(new URL('workers/non-native-worker', import.meta.url), {type: "module"});
        nonNativeWorker.onmessage = handleNonNativeWorkerMessage
        setNonNativeWorker(nonNativeWorker);
        initializeCompressor();
    }, [])

    function handleNonNativeWorkerMessage(event: MessageEvent<WorkerMessage<unknown>>) {
        const workerEvent = event.data;
        if (workerEvent.type == WorkerMessageType.StartedCompression) {
            setNonNativeResult("Started Compressing")
        } else if (workerEvent.type == WorkerMessageType.FinishedCompression) {
            const result = workerEvent.data as WorkerCompressionResult;
            setNonNativeResult(`Non native worker finished Compressing ${result.data.length} bytes in ${result.time} ms`)
        }
    }

    async function handleNonNativeUpload(event: ChangeEvent<HTMLInputElement>) {
        const files = event.target.files;
        if ((!files || files.length < 0)) {
            setNonNativeResult("Hmm you didn't chose a file")
        } else {
            nonNativeWorker?.postMessage(files[0])
        }
    }

    async function handleNativeUpload(event: ChangeEvent<HTMLInputElement>) {
        const files = event.target.files;
        if ((!files || files.length < 0)) {
            setNativeResult("Hmm you didn't chose a file")
        } else {
            const data = new Uint8Array(await files[0].arrayBuffer());
            setNativeResult("Started Compressing")
            if (compressor) {
                const startTime = performance.now();
                const result = await compressor.nativeCompress(data)
                const endTime = performance.now();
                setNativeResult(`Native implementation finished Compressing to ${result.byteLength} bytes in ${endTime - startTime} ms`)
            }
        }
    }


    return (
        <div>
            <div>
                <span>JS Compress</span>
                <input type="file" onChange={handleNonNativeUpload}/>
            </div>
            <div>
                <span>WASM .NET Compress</span>
                <input type="file" onChange={handleNativeUpload}/>
            </div>
            <div>
                {nonNativeResult}
            </div>
            <div>
                {nativeResult}
            </div>
        </div>
    );
}

export default App;
