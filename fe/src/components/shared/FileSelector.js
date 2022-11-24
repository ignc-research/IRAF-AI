import React,{useRef} from 'react'; 
function FileSelector(props) {      
    // On file select (from the pop up) 
    const onFileChange = async(event) => { 

      const result = await Promise.all(Array.from(event.target.files).map((x) => new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (evt) => {
          resolve({file: evt.target.result, name: x.name });
        };
        reader.readAsText(x);
      })));
      if (result.length > 0) {
        props.onChange(result);
      }
    }; 

    const fileInput = useRef(null);

    return ( 
      <div className={props.className} title={props.title}>
        <div className="btn btn-secondary" onClick={() => fileInput?.current.click()}>
          {props.children}
        </div>
          <div>
              <input className="d-none" ref={fileInput} type="file" accept={props.accept} onChange={onFileChange} multiple={props.multiple} /> 
          </div> 
      </div> 
    ); 
    
} 
export default FileSelector;