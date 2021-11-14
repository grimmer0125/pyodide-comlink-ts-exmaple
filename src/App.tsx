import { useEffect } from "react";
import { remoteFunction, initPyodideAndLoadPydicom } from "./pyodideHelper";

function App() {
  useEffect(() => {

    async function init() {
      await initPyodideAndLoadPydicom()
      const data = await remoteFunction();
      console.log({ data })
    }
    init();
  }, []);

  return <div>
    {"hello world"}
  </div>;
}

export default App;
