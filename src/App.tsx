import { useEffect } from "react";
import { remoteFunction, initPyodideAndLoadPydicom } from "./pyodideHelper";

function App() {
  useEffect(() => {

    async function init() {
      await initPyodideAndLoadPydicom()
      const data = await remoteFunction();
      console.log({ data }); // it might be Comlink proxy object if using Comlink.transfer
    }
    init();
  }, []);

  return <div>
    {"hello world"}
  </div>;
}

export default App;
