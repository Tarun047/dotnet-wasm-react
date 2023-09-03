
export enum WorkerMessageType {
    StartedCompression,
    FinishedCompression
}

export class WorkerCompressionResult {
    public constructor(
        public data: Uint8Array,
        public time: number
    ) {
    }
}

export class WorkerMessage<T> {
    public constructor(
        public type: WorkerMessageType,
        public data?: T
    ) {
    }
}