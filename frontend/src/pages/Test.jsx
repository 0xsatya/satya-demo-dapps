import React, { useEffect, useState } from "react";
import './Test.css';
function Test() {
  const [data1, setData1] = useState("none");
  const [data2, setData2] = useState("none");
  const [arey, setArey] = useState(undefined);
  console.log("Test component callled...");
  const [data3, setData3] = useState(<div>No data</div>);

  const Data1ButtonClicked = () => {
    setTimeout(() => {
      setData1("Data1");
    }, 1000);
  };
  const Data2ButtonClicked = () => {
    setTimeout(() => {
      setData2("Data2");
    }, 1000);
  };
  const Data3ButtonClicked = () => {
    setData3(<div className="slowelyAppear">Slowely appear</div>);

    // setTimeout(() => {
    //   setData2("Data2");
    // }, 1000);
  };
  useEffect(() => {
    console.log("useeffect called...");
    // Data1ButtonClicked();
    console.log("Data1:", data1);
    setData1("Default1");
    console.log("Data1:", data1);
    setData2("Default2");
    // setArey({a: 'a', b: 'b'});
    return () => {
      console.log("cleanup called..");
    };
  }, [data1]);
  

  console.log("return called...");
  return (
    <div>
      <h2>Hello Test...</h2>
      <h2>Data1: {data1}</h2>
      <button onClick={Data1ButtonClicked}>SetData1 to Data1</button>

      <h2>Data2: {data2}</h2>
      <button onClick={Data2ButtonClicked}>SetData2 to Data2</button>

      <h2>Data3: {data3}</h2>
      <button onClick={Data3ButtonClicked}>SetData3</button>
    </div>
  );
}

export default Test;
