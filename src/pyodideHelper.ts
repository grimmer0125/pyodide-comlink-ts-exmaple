
import * as Comlink from 'comlink';
import MyWorker, { api } from './Pyodide.worker';
const myWorkerInstance: SharedWorker = new MyWorker();
myWorkerInstance.port.start();


// Call function in worker
const workrApi = Comlink.wrap<typeof api>(myWorkerInstance.port);
const initPyodideAndLoadPydicom = workrApi.initPyodideAndLoadPydicom
const remoteFunction = workrApi.remoteFunction;
export {
    initPyodideAndLoadPydicom,
    remoteFunction
}