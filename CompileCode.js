const { exec } = require('child_process');
const fs = require('fs');

const CompileCode = (code, language, input = '') => {  // Default value for input
  return new Promise((resolve, reject) => {
    const filename = `temp-code.${language}`;
    const outputFilename = "temp-output";

    fs.writeFileSync(filename, code);

    let compileCommand = '';
    if (language === 'cpp') {
      compileCommand = `g++ -std=c++17 ${filename} -o ${outputFilename}`;  
    } else if (language === 'c') {
      compileCommand = `gcc ${filename} -o ${outputFilename}`;
    }

    exec(compileCommand, (error, stdout, stderr) => {
      if (error || stderr) {
        if (fs.existsSync(filename)) fs.unlinkSync(filename);
        if (fs.existsSync(outputFilename)) fs.unlinkSync(outputFilename);  // Check if file exists before deleting
        reject({ type: 'compile', message: error || stderr });
        return;
      }

      const execCommand = input ? `echo "${input}" | ./${outputFilename}` : `./${outputFilename}`;  // Conditionally add echo

      exec(execCommand, (error, stdout, stderr) => {
        if (fs.existsSync(filename)) fs.unlinkSync(filename);
        if (fs.existsSync(outputFilename)) fs.unlinkSync(outputFilename);  // Check if file exists before deleting
        if (error || stderr) {
          reject({ type: 'runtime', message: error || stderr });
        } else {
          resolve(stdout);
        }
      });
    });
  });
};

module.exports=CompileCode