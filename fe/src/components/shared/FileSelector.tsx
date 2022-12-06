import React,{ChangeEvent, useRef} from 'react'; 

export type SelectedFile = {
  file: string;
  name: string;
}

function FileSelector(props: { accept: string, multiple?: boolean, className?: string, title: string, children: any, onChange: (files: SelectedFile[]) => void }) {      
    // On file select (from the pop up) 
    const onFileChange = async(event: ChangeEvent<HTMLInputElement>) => { 
      const target = (event.target as HTMLInputElement);
      const files = target.files;
      if (!files) {
        return;
      }
      const result = await Promise.all<SelectedFile>(Array.from(files).map((x) => new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (evt) => {
          resolve({file: reader.result as string, name: x.name });
        };
        reader.readAsText(x);
      })));
      if (result.length > 0) {
        console.log(result);
        props.onChange(result);
      }
    }; 

    const fileInput = useRef<HTMLInputElement>(null);

    return ( 
      <div className={props.className} title={props.title}>
        <div className="btn btn-secondary" onClick={() => fileInput?.current?.click()}>
          {props.children}
        </div>
          <div>
              <input className="d-none" ref={fileInput} type="file" accept={props.accept} onChange={onFileChange} multiple={props.multiple} /> 
          </div> 
      </div> 
    ); 
    
} 
export default FileSelector;