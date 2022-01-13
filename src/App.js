import './App.css';
import AceEditor from "react-ace";
import { Container, Row, Col ,Button} from 'reactstrap';
import brace from 'brace';
import "bootstrap/dist/css/bootstrap.min.css";
import "ace-builds/src-noconflict/mode-c_cpp";
import "ace-builds/src-noconflict/mode-java";
import "ace-builds/src-noconflict/mode-python";
import "ace-builds/src-noconflict/theme-monokai";
import "ace-builds/src-noconflict/theme-terminal";
import "ace-builds/src-noconflict/snippets/c_cpp"
import "ace-builds/src-noconflict/snippets/java"
import "ace-builds/src-noconflict/snippets/python"
import Select from 'react-select';
import React from 'react';
import axios from 'axios';

import "ace-builds/src-min-noconflict/ext-searchbox";
import "ace-builds/src-min-noconflict/ext-language_tools";



function App() {
  return (
    <Editor/>
  );
}

const code_lang = [
      {value : 'c', label: 'C'},
      //{value : 'c_cpp', label: 'CPP'},
      //{value : 'java', label: 'Java'},
      //{value : 'python', label: 'Python'},
      ];

class Editor extends React.Component {
      
    
    constructor(props){
        
        super(props);
        this.state = {
            content : {
                code: '',
                lang: code_lang[0].value,
                input_buff: '',
            },
            
            output: '',
            
        }
        this.handleCodeChange = this.handleCodeChange.bind(this);
        this.handleCompile = this.handleCompile.bind(this);
        this.handleSelectLang = this.handleSelectLang.bind(this);
        this.handleInputBuffChange = this.handleInputBuffChange.bind(this);
    }
    
    handleSelectLang =  (event) =>{
        const content = this.state.content;
        content.lang = event.value;
        console.log(content);
        this.setState({
            content : content,
        });
    }
    handleInputBuffChange(e){
        const content = this.state.content;
        content.input_buff = e;
        this.setState({
            content : content,
        })
    }
    
    handleCodeChange(code){
       const content = this.state.content;
       content.code = code;
       this.setState({
           content : content,
       });
        
    }
    
    handleCompile(e){
        e.preventDefault();


        const data = this.state.content;
        
        axios.post(
        'https://test.cspc.me/api/code',
        {
            code : data.code,
            lang : data.lang,
            input_buff : data.input_buff,
        },
        {headers: { "Content-Type": `application/json`,
                  }},
            
            
        ).then((res)=> {
               console.log(res)
               this.setState({output : res.data});
              }).catch((error) => {
        console.log(error);
        });
         
    }
    render(){
        return(
        <Container fluid>
            <Row>
                <>
                <Col md = "2">
                    <h3>
                        Options
                    </h3>
                    <Select 
                        defaultValue = {code_lang[0]}
                        options={code_lang} 
                        onChange={this.handleSelectLang}     
                    />
                </Col>
                <Col md="5">
                    <Row>
                    <h3>
                        Code
                    </h3>
                    <AceEditor
                        mode={this.state.content.lang === 'c' ? "c_cpp" : this.state.content.lang} 
                        theme="monokai"
                        name="UNIQUE_ID_OF_DIV"
                        value= {this.state.content.code}
                        onChange={this.handleCodeChange}
                        editorProps={{ $blockScrolling: true }}
                        setOptions={{
                              enableBasicAutocompletion: true,
                              enableLiveAutocompletion: true,
                              enableSnippets: true,
                        }}
                        
                    />
                    
                    
                    </Row>
                    <br/>
                    <Button 
                        onClick={this.handleCompile}
                        //size="lg"
                    >
                        Submit
                    </Button>
                    
                    <Row>
                    <h3>
                        Output
                    </h3>
                    <AceEditor
                        theme="terminal"
                        value= {this.state.output}
                        editorProps={{ $blockScrolling: false }}
                        readOnly = {true}
                        height = "300px"
                    />
                    </Row>

                </Col>
                </>
                <Col md="5">
                    <h3>
                        Input
                    </h3>
                    <AceEditor
                        value={this.state.content.input_buff}
                        onChange= {this.handleInputBuffChange}

                    />

                </Col>
            </Row>
        </Container>
        );
    }
}



export default App;
