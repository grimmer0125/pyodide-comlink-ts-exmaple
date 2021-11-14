
import * as Comlink from 'comlink';
import MyWorker, { api } from './Pyodide.worker';
const myWorkerInstance: Worker = new MyWorker();

// Call function in worker
const workrApi = Comlink.wrap<typeof api>(myWorkerInstance);
const initPyodideAndLoadPydicom = workrApi.initPyodideAndLoadPydicom
const remoteFunction = workrApi.remoteFunction;
export {
    initPyodideAndLoadPydicom,
    remoteFunction
}