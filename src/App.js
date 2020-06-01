import React, { useState } from 'react';
import logo from './logo.svg';
import './App.css';
import axios from 'axios';

function App() {

  const [file, setFile] = useState('');
  const [filename, setFilename] = useState('');
  const [uploadedFile, setUploadedFile] = useState({});
  const [uploadPercentage, setUploadPercentage] = useState(0);

  const onChange = (e) => {
    setFile(e.target.files[0]);
    setFilename(e.target.files[0].name);
  }

  const uploadFile = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('file', file);
    try {
      const res = await axios.post('/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        },
        onUploadProgress: progresEvent => {
          setUploadPercentage(parseInt(Math.round((progresEvent.loaded * 100) / progresEvent.total)));
        }
      })
      const { fileName, filePath } = res.data;
      setUploadedFile({fileName, filePath})
    }catch(err){
      if(err.response.status === 500){
        console.log("Problem with Server");
      }else{
        console.log("Error => ", err.response.data.msg);
      }
    }
  }
  
  return (
    <div className="App">
      <form onSubmit={uploadFile}>
        <input type='file' id="file" onChange={onChange}/>
        <label htmlFor="file">{filename}</label>
        <div>
          <h1>{uploadPercentage} %</h1>
        </div>
        <button type="submit">Save</button>
      </form>
      
      {Object.values(uploadedFile).length > 0 && 
        <div>
          <h1>Uploaded File</h1>
          <h4>File Name: {uploadedFile.fileName}</h4>
          <div>
            <img src={uploadedFile.filePath} />
          </div>
        </div>
      }
    </div>
  );
}

export default App;
