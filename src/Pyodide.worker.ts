import * as Comlink from 'comlink'

declare const self: DedicatedWorkerGlobalScope & { pyodide: any };
export default {} as typeof Worker & { new(): Worker };
declare var loadPyodide: any;

const baseURL = "https://cdn.jsdelivr.net/pyodide/v0.18.1/full/pyodide.js";
importScripts(baseURL);

const initPyodideAndLoadPydicom = async () => {
  self.pyodide = await loadPyodide({ indexURL: "https://cdn.jsdelivr.net/pyodide/v0.18.1/full/" });
};

export async function remoteFunction(): Promise<any> {

  // working case: return ArrayBuffer
  const data = new ArrayBuffer(8);
  return data;
}

// Define API
export const api = {
  initPyodideAndLoadPydicom,
  remoteFunction
};

Comlink.expose(api);