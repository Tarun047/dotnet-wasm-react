// Licensed to the .NET Foundation under one or more agreements.
// The .NET Foundation licenses this file to you under the MIT license.
import {dotnet} from './_framework/dotnet.js'

let dotnetRuntimePromise = undefined;

async function createRuntime() {
    try {
        return dotnet.
        withModuleConfig({
            locateFile: (path, prefix) => {
                return '/' + path;
            }
        })
            .create();
    } catch (err) {
        console.error(err);
        throw err;
    }
}

export async function initializeRuntimeExports(){
    if (!dotnetRuntimePromise) {
        dotnetRuntimePromise = createRuntime();
    }
}

export async function nativeCompress(data) {
    const { getAssemblyExports, getConfig } = await dotnetRuntimePromise;
    const config = getConfig();
    const exports = await getAssemblyExports(config.mainAssemblyName)
    return exports.Compressy.Compressor.GzipCompress(data);
}