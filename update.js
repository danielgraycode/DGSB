const child_process = require('child_process');


function runUpdate(){
child_process.run("git pull git://github.com/danielgraycode/DGSB.git");
console.info("Updated.")
};
