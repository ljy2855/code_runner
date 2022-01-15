from typing import Optional
from pydantic import BaseModel
from fastapi import FastAPI
from starlette.responses import JSONResponse
import os
import subprocess
from fastapi.middleware.cors import CORSMiddleware

DIRPATH = os.getcwd()
file_path = DIRPATH + "/template_code/test.c" 
input_path = DIRPATH + "/template_code/input.txt"

app = FastAPI()
origins = [
    "test.cspc.me"
    "localhost:2000",
    "localhost:3000",
          ]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class CodeFile(BaseModel):
    code: str
    lang : str
    input_buff : str
    
    

@app.get("/")
def read_root():
    return {"Hello": "World"}

@app.post("/code")
async def get_code(code : CodeFile):
    codefile = dict(code)
    codefile['success'] = True
    #print(codefile)
    complier = ComplieCode(codefile)
    
    
    return await complier.compile()


async def compile_code(codefile):
    
    f = open(file_path,"w")
    f.write(codefile['code'])
    f.close()
    f = open(input_path,"w")
    f.write(codefile['input_buff'])
    f.close()
    
    try:
        output =subprocess.check_output("gcc -o {0}/test {1}".format(DIRPATH+"/template_code",file_path),shell =True,stderr=subprocess.STDOUT,universal_newlines=True)
        result = subprocess.check_output("cat " + input_path + " |" + DIRPATH +"/template_code/test", shell=True,timeout = 1,universal_newlines=True)
    except subprocess.CalledProcessError as e: #컴파일 실패
        result = ''
        for line in e.output.split('\n'):
            for word in line.split(' '):
                if DIRPATH not in word:
                    result += word + ' '
            result += '\n'
    except subprocess.TimeoutExpired as e:
        if len(e.output) > 10000:
            result = 'Warning: over 10000 char\n'
            result += e.output.decode('utf-8')[:10000]
        else:
            result = e.output
        
    #print(result)
    return result

class ComplieCode():
    def __init__(self,code):
        self.codeFile = code
        self.writeFile()


    def writeFile(self):
        if self.codeFile['lang'] == "java":
            f = open(DIRPATH+"/template_code/Main.java","w")
            f.write(self.codeFile['code'])
            f.close()
        
        else :
            f = open(file_path,"w")
            f.write(self.codeFile['code'])
            f.close()

        f = open(input_path,"w")
        f.write(self.codeFile['input_buff'])
        f.close()

    async def compile(self):
        try:
            if self.codeFile['lang'] == "c":
                result = self.cCompile()
            elif self.codeFile['lang'] == "python":
                result = self.pyCompile()
            elif self.codeFile['lang'] == "c_cpp":
                result = self.cppCompile()
            elif self.codeFile['lang'] == "java":
                result = self.javaCompile()

        except subprocess.CalledProcessError as e: #컴파일 실패
            result = ''
            for line in e.output.split('\n'):
                for word in line.split(' '):
                    if DIRPATH not in word:
                        result += word + ' '
                result += '\n'
        except subprocess.TimeoutExpired as e:
            if len(e.output) > 10000:
                result = 'Warning: over 10000 char\n'
                result += e.output.decode('utf-8')[:10000]
            else:
                result = e.output
            
        #print(result)
        return result
    
    def cCompile(self):
        output =subprocess.check_output("gcc -o {0}/test {1}".format(DIRPATH+"/template_code",file_path),shell =True,stderr=subprocess.STDOUT,universal_newlines=True)
        return subprocess.check_output("cat " + input_path + " |" + DIRPATH +"/template_code/test", shell=True,timeout = 1,universal_newlines=True)
    
    def cppCompile(self):
        output =subprocess.check_output("g++ -o {0}/test {1}".format(DIRPATH+"/template_code",file_path),shell =True,stderr=subprocess.STDOUT,universal_newlines=True)
        return subprocess.check_output("cat " + input_path + " |" + DIRPATH +"/template_code/test", shell=True,timeout = 1,universal_newlines=True)

    def pyCompile(self):
        return subprocess.check_output("cat " + input_path + " |" + "python3 " +file_path, shell=True,timeout = 1,universal_newlines=True,stderr=subprocess.STDOUT)

    def javaCompile(self):
        output =subprocess.check_output("javac " + DIRPATH +"/template_code/Main.java",shell =True,stderr=subprocess.STDOUT,universal_newlines=True)
        return subprocess.check_output("cat " + input_path + " |java -cp " +  DIRPATH +"/template_code " +"Main", shell=True,timeout = 1,universal_newlines=True)
    

   
