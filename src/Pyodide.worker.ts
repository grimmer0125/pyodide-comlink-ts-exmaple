import * as Comlink from 'comlink'
// SharedWorkerGlobalScope
declare const self: SharedWorkerGlobalScope & { pyodide: any };
export default {} as typeof SharedWorker & { new(): SharedWorker };
declare var loadPyodide: any;

const baseURL = "https://cdn.jsdelivr.net/pyodide/v0.18.1/full/pyodide.js";
importScripts(baseURL);

const initPyodideAndLoadPydicom = async () => {
  console.log("initPyodideAndLoadPydicom")
  self.pyodide = await loadPyodide({ indexURL: "https://cdn.jsdelivr.net/pyodide/v0.18.1/full/" });
};

export async function remoteFunction(): Promise<any> {
  console.log("remoteFunction")
  /** working: directly return ArrayBuffer or using Comlink.transfer*/
  // const data = new ArrayBuffer(8);
  // return data; 
  // return Comlink.transfer(data, [data])

  /** get Python NumPy ndarray from pyodide */
  const pythonCode = `
    import numpy as np
    print("start")
    if __name__ == '__main__':
      print("in main")
    print("end")
    data = np.arange(15)
    data
  `;
  await self.pyodide.loadPackagesFromImports(pythonCode);
  const pyProxyBuffer = self.pyodide.runPython(pythonCode);
  // working case:
  // const data = pyProxyBuffer.toJs();
  // return data; // or using Comlink.transfer(data, [data.buffer]) to reduce number of copying

  // not working cases:
  const buffer = pyProxyBuffer.getBuffer("u8clamped");
  const data = buffer.data;
  // case1 (copy): not work on Chrome but work on Firefox 
  // Uncaught (in promise) DOMException: Failed to execute 'postMessage' on 'DedicatedWorkerGlobalScope': ArrayBuffer is not detachable and could not be cloned.
  return data; // return buffer is the same

  // case2 (transfer): not work
  // Uncaught (in promise) DOMException: Failed to execute 'postMessage' on 'DedicatedWorkerGlobalScope': ArrayBuffer is not detachable and could not be cloned.
  // return Comlink.transfer(data, [data.buffer])

  // case3: using Comlink.proxy, e.g. return Comlink.proxy(dicomObj), dicomObj is PyProxy object, 
  // then just using "await image.modality" in main (thread) js to get the attribute string value
  // But for this Uint8ClampedArray data, it can only allow to access ith element via "await data[4];" one by one, 
  // but we want get Uint8ClampedArray at once, how to solve it ???? 
  // return Comlink.proxy(data);
}

export const api = {
  initPyodideAndLoadPydicom,
  remoteFunction
};

// onmessage = function (oEvent) {
//   postMessage("Hi " + oEvent.data);
// };


/**
 * When a connection is made into this shared worker, expose `obj`
 * via the connection `port`.
 */
onconnect = function (event: any) {
  console.log("onconnect")
  const port = event.ports[0];
  Comlink.expose(api, port);
  port.start();
};


// Comlink.expose(api);