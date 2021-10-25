const fs = require("fs").promises;
const { exec } = require("child_process");


let main = async function(){
    let txt = await fs.readFile("./hosts.txt","utf8");
    let hosts = txt.split("\n").map(t=>t.trim()).filter(t=>t!=="");
    console.log(hosts);
    let routes = (await Promise.all(hosts.map((host)=>{
        return new Promise((res,rej)=>{
            console.log(host);
            exec(`traceroute ${host}`,(error, stdout, stderr)=>{
                console.log(host,stdout,stderr);
                if(error){
                    console.log("error");
                    res(false);
                }else{
                    res([host,stdout]);
                }
            });
        });
    }))).filter(r=>r);
    console.log(routes);
    await fs.writeFile("result.json",JSON.stringify(routes));
    console.log("all done");
}

main();