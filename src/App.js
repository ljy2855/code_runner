import './App.css';
import AceEditor from "react-ace";
import { Container, Row, Col, Button } from 'reactstrap';
import brace from 'brace';
import "bootstrap/dist/css/bootstrap.min.css";
import "ace-builds/src-noconflict/mode-c_cpp";
import "ace-builds/src-noconflict/mode-java";
import "ace-builds/src-noconflict/mode-python";
import "ace-builds/src-noconflict/theme-monokai";
import "ace-builds/src-noconflict/theme-terminal";
import "ace-builds/src-noconflict/theme-xcode";
import "ace-builds/src-noconflict/theme-tomorrow";
import "ace-builds/src-noconflict/theme-github";
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
        <Editor />
    );
}

const code_lang = [
    { value: 'c', label: 'C' },
    {value : 'c_cpp', label: 'C++'},
    {value : 'java', label: 'Java'},
    { value: 'python', label: 'Python' },
];

const editor_theme = [
    { value: 'monokai', label: 'Monokai' },
    { value: 'github', label: 'Github' },
    { value: 'xcode', label: 'Xcode' },
    { value: 'tomorrow', label: 'Tomorrow' },
]
        
const mainContent = {
    alignItems: 'center',
    justifyContent: 'center',
}

class Editor extends React.Component {


    constructor(props) {

        super(props);
        this.state = {
            content: {
                code: '',
                lang: code_lang[0].value,
                input_buff: '',
            },
            editor_setting: {
                theme: editor_theme[0].value,
                enableBasicAutocompletion: true,
                enableLiveAutocompletion: true,
                enableSnippets: true,
                fontSize: 14,
                
            },
            output: '',

        }
        this.handleCodeChange = this.handleCodeChange.bind(this);
        this.handleCompile = this.handleCompile.bind(this);
        this.handleSelectLang = this.handleSelectLang.bind(this);
        this.handleInputBuffChange = this.handleInputBuffChange.bind(this);
        this.handleEditorThemeChange = this.handleEditorThemeChange.bind(this);
    }

    handleSelectLang = (event) => {
        const content = this.state.content;
        content.lang = event.value;
        //console.log(content);
        this.setState({
            content: content,
        });
    }
    handleInputBuffChange(e) {
        const content = this.state.content;
        content.input_buff = e;
        this.setState({
            content: content,
        })
    }

    handleEditorThemeChange = (e) => {
        const setting = this.state.editor_setting;
        setting.theme = e.value;
        //console.log(setting)
        this.setState({
            editor_setting : setting,
        })
    }

    handleCodeChange(code) {
        const content = this.state.content;
        content.code = code;
        this.setState({
            content: content,
        });

    }

    handleCompile(e) {
        e.preventDefault();


        const data = this.state.content;

        axios.post(
            'https://code.cspc.me/api/code',
            {
                code: data.code,
                lang: data.lang,
                input_buff: data.input_buff,
            },
            {
                headers: {
                    "Content-Type": `application/json`,
                }
            },


        ).then((res) => {
            //console.log(res)
            this.setState({ output: res.data });
        }).catch((error) => {
            //console.log(error);
        });

    }
    render() {
        return (
            <Container className='main-container shadow border rounded'  fluid="xl">
                <Row>

                    <Col className="bg-light border rounded" md={{
                        
                        size: 2,
                    }}>
                        <h4>
                            Options
                        </h4>
                        <Row>
                            <h6>
                                lang:
                            </h6>
                            <Select
                                defaultValue={code_lang[0]}
                                options={code_lang}
                                onChange={this.handleSelectLang}
                            />
                        </Row>
                        <Row>
                            <h6>
                                editor theme:
                            </h6>
                            <Select
                                defaultValue={editor_theme[0]}
                                options={editor_theme}
                                onChange={this.handleEditorThemeChange}
                            />
                        </Row>
                    </Col>
                    <Col md="6" >
                        <Row style={mainContent}>
                            <h4 >
                               Code
                            </h4>
                            <AceEditor
                                className="main-code border rounded"
                                mode={this.state.content.lang === 'c' ? "c_cpp" : this.state.content.lang}
                                theme={this.state.editor_setting.theme}
                                name="UNIQUE_ID_OF_DIV"
                                value={this.state.content.code}
                                onChange={this.handleCodeChange}
                                height="800px"
                                width="90%"
                                editorProps={{ $blockScrolling: true }}
                                setOptions={{
                                    enableBasicAutocompletion: true,
                                    enableLiveAutocompletion: true,
                                    enableSnippets: true,
                                }}
                            />


                        </Row>

                    </Col>


                    <Col md="4">
                        <Row>
                            <h4>
                                Input
                            </h4>
                            <AceEditor
                                className="input-code border rounded"
                                value={this.state.content.input_buff}
                                onChange={this.handleInputBuffChange}
                                height="300px"
                                width="90%"

                            />
                        </Row>
                        <br />
                        <Button
                            className="Submit button"
                            onClick={this.handleCompile}
                        //size="lg"
                        >
                            Submit
                        </Button>

                        <Row>
                            <h4>
                                Output
                            </h4>
                            <AceEditor
                                className="output-code border rounded"
                                theme="terminal"
                                value={this.state.output}
                                editorProps={{ $blockScrolling: false }}
                                readOnly={true}
                                height="400px"
                                width="90%"
                            />
                        </Row>
                    </Col>


                </Row>
            </Container>
        );
    }
}



export default App;
