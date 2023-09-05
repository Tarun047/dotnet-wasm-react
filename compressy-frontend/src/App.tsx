import React, {ChangeEvent, useEffect} from 'react';
import {WorkerCompressionResult, WorkerMessage, WorkerMessageType} from "./workers/events";

function App() {
    const [nonNativeWorker, setNonNativeWorker] = React.useState<Worker>()
    const [nonNativeResult, setNonNativeResult] = React.useState<string>();
    const [nativeWorker, setNativeWorker] = React.useState<Worker>();
    const [nativeResult, setNativeResult] = React.useState<string>();
    useEffect(() => {
        const nonNativeWorker = new Worker(new URL('workers/non-native-worker', import.meta.url), {type: "module"});
        nonNativeWorker.onmessage = handleNonNativeWorkerMessage
        setNonNativeWorker(nonNativeWorker);
        const nativeWorker = new Worker(new URL('workers/native-worker', import.meta.url), {type: "module"});
        nativeWorker.onmessage = handleNativeWorkerMessage
        setNativeWorker(nativeWorker);

        return () => {
            nonNativeWorker.removeEventListener('message', handleNonNativeWorkerMessage);
            nativeWorker.removeEventListener('message', handleNativeWorkerMessage);
        }
    }, [])

    function handleNonNativeWorkerMessage(event: MessageEvent<WorkerMessage<unknown>>) {
        const workerEvent = event.data;
        if (workerEvent.type == WorkerMessageType.StartedCompression) {
            setNonNativeResult("Started Compressing")
        } else if (workerEvent.type == WorkerMessageType.FinishedCompression) {
            const result = workerEvent.data as WorkerCompressionResult;
            setNonNativeResult(`Non native worker finished Compressing ${result.data.length} bytes in ${result.time} ms`)
            downloadFile("non-native.gzip", result.data);
        }
    }

    function handleNativeWorkerMessage(event: MessageEvent<WorkerMessage<unknown>>) {
        const workerEvent = event.data;
        if (workerEvent.type == WorkerMessageType.StartedCompression) {
            setNativeResult("Started Compressing")
        } else if (workerEvent.type == WorkerMessageType.FinishedCompression) {
            const result = workerEvent.data as WorkerCompressionResult;
            setNativeResult(`Native Worker finished Compressing to ${result.data.length} bytes in ${result.time} ms`)
            downloadFile("native.gzip", result.data);
        }
    }

    function downloadFile(fileName: string, bytes: Uint8Array) {
        // const blob = new Blob([bytes], {type: "application/gzip"});
        // const link = document.createElement('a');
        // link.href = window.URL.createObjectURL(blob);
        // link.download = fileName;
        // link.click();
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
            nativeWorker?.postMessage(files[0])
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
