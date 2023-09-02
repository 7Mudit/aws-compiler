const { exec } = require('child_process');
const fs = require('fs');

const CompileCode = (code, language) => {
  return new Promise((resolve, reject) => {
    const filename = `temp-code.${language}`;
    const outputFilename = "temp-output";

    fs.writeFileSync(filename, code);

    let compileCommand = '';
    if (language === 'cpp') {
      compileCommand = `g++ -std=c++17 ${filename} -o ${outputFilename}`;  
    } else if (language === 'c') {
      compileCommand = `gcc ${filename} -o ${outputFilename}`;
    } // Add more language conditions here

    exec(compileCommand, (error, stdout, stderr) => {
      if (error || stderr) {
        fs.unlinkSync(filename);
        reject(error || stderr);
      } else {
        exec(`./${outputFilename}`, (error, stdout, stderr) => {
          fs.unlinkSync(filename);
          fs.unlinkSync(outputFilename);
          if (error || stderr) {
            reject(error || stderr);
          } else {
            resolve(stdout);
          }
        });
      }
    });
  });
};

module.exports = CompileCode;
