
declare module '*' {
    export function initializeRuntimeExports(): Promise<void>
    export function nativeCompress(data: Uint8Array): Promise<Uint8Array>
}