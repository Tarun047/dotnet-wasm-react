## .NET WebAssembly React app

## How to run the app

1. Install .NET 8 SDK
2. Install the `wasm-tools` and `wasm-experimental` workloads by running
    ```bash
    dotnet workload install wasm-tools
    ```

    ```bash
    dotnet workload install wasm-experimental
    ```

3. Publish the wasm binaries to  `bin/Release/net8.0/browser-wasm/AppBundle` directory by running

    ```bash
    dotnet publish -c Release
    ```

4. The above will also automatically copy the generated `AppBundle` to `compressy-frontend/public/vendor` directory, so it can dynamically be imported.
5. Change your working directory to `compressy-frontend` and install `npm` dependencies
    ```bash
    cd compressy-frontend
    npm install
    ```
6. Now we can either directly run the dev server
    ```bash
    npm run dev
   ```
7. Or we can build the frontend code and use any static file server from the dist directory:
    ```bash
    npm run build
    dotnet tool install dotnet-serve
    dotnet serve --mime .wasm=application/wasm --mime .js=text/javascript --mime .json=application/json --directory dist
    ```