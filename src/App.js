import './App.css';
import AceEditor from "react-ace";

import "ace-builds/src-noconflict/mode-c_cpp";
import "ace-builds/src-noconflict/theme-monokai";
import "ace-builds/src-noconflict/theme-terminal";
import React from 'react';
import axios from 'axios';
function App() {
  return (
    <Editor/>
  );
}


class Editor extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            code: '',
            output: '',
            
        }
        this.handleCodeChange = this.handleCodeChange.bind(this);
        this.handleCompile = this.handleCompile.bind(this);

    }
    
    handleCodeChange(code){
       console.log(this.state.code);
       this.setState({
           code : code,
       });
        
    }
    
    handleCompile(e){
        e.preventDefault();


        const data = this.state;
        
        axios.post(
        'https://test.cspc.me/api/code',
        {code: data.code},
        {headers: { "Content-Type": `application/json`,
                  }},
            
            
        ).then((res)=> {
               console.log(res)
               this.setState({output : res.data});
              }).catch((error) => {
        console.log(error);
        });
        
        /*
        fetch("http://test.cspc.me/api/code",{
            method: "POST",
            mode: 'cors',
            headers: {
                "accept": "application/json",
                "Content-Type": "application/json",
                //"Access-Control-Allow-Headers" : "localhost:300",
            },
            body: {"code" : data.code},
        }).then((res) => console.log(res));
        */
    }
    render(){
        return(
        <div>
            <div>
            <span>
                Code
            </span>
            <AceEditor
                mode="c_cpp"
                theme="monokai"
                name="UNIQUE_ID_OF_DIV"
                value= {this.state.code}
                onChange={this.handleCodeChange}
                editorProps={{ $blockScrolling: true }}
                enableBasicAutocompletion={true}
                enableLiveAutocompletion={true}
                enableSnippets={true}
            />
            </div>
            <div>
            <button 
                onClick={this.handleCompile}>
                Submit
            </button>
            </div>
            <span>
                Output
            </span>
            <div>
                <AceEditor
                    theme="terminal"
                    value= {this.state.output}
                    editorProps={{ $blockScrolling: false }}
                    readOnly = {true}
                    height = "300px"
            />
            </div>
        </div>
        );
    }
}



export default App;
