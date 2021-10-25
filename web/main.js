

let Edge = function(v1,v2){
    this.verts = [v1,v2];
    this.weight = 1;
    v1.edges[v2.id] = this;
    v2.edges[v1.id] = this;
};

let Vert = function(id,name){
    this.edges = {};
    this.id = id;
    this.name = name;
    this.weight = 1;
    this.x = Math.random()*2-1;
    this.y = Math.random()*2-1;
    this.vx = 0;
    this.vy = 0;
};

let Graph = function(){
    let generateRandomId = function(){
        return Math.random()+"";
    };
    this.verts = {};
    this.edges = [];
    
    this.addVert = function(name){
        let id = name;
        if(name === ""){
            id = generateRandomId();
        }
        if(id in this.verts){
            this.verts[id].weight++;
            return this.verts[id];
        }else{
            let vert = new Vert(id,name);
            this.verts[id] = vert;
            return vert;
        }
    };
    this.addEdge = function(v1,v2){
        if(v2.id in v1.edges){//already exists
            v1.edges[v2.id].weight++;
            return v1.edges[v2.id]
        }else{
            let edge = new Edge(v1,v2);
            this.edges.push(edge);
            return edge;
        }
    }
    let calcDist2 = function(v1,v2){
        let dx = v2.x-v1.x;
        let dy = v2.y-v1.y;
        return dx*dx+dy*dy;
    };
    let G = -0.001;//-0.01;
    let K = 3;//0.01;//hooke's law
    this.adjustPosition = function(){
        let dt = 0.016;
        for(let id1 in this.verts){
            let v1 = this.verts[id1];
            
            //gravity
            for(let id2 in this.verts){
                let v2 = this.verts[id2];
                if(v1 == v2) continue;
                let dx = v2.x-v1.x;
                let dy = v2.y-v1.y;
                let dist2 = (dx*dx+dy*dy+0.01);//small omega, basically appeasement
                let dist = Math.sqrt(dist2);
                let a = G*v2.weight/dist2;
                v1.vx += a*dx/dist;
                v1.vy += a*dy/dist;
            }
            
            //spring force
            for(let id2 in v1.edges){
                let edge = v1.edges[id2];
                let v2 = this.verts[id2];
                if(v1 == v2) continue;
                let dx = v2.x-v1.x;
                let dy = v2.y-v1.y;
                let dist2 = (dx*dx+dy*dy);
                let dist = Math.sqrt(dist2);
                let a = K*(dist-0.05);
                v1.vx += a*dx/dist;
                v1.vy += a*dy/dist;
            }
        }
        
        //apply the force, acceleration, and velocity to calculate the position
        for(let id in this.verts){
            let vert = this.verts[id];
            vert.vx *= 0.95;
            vert.vy *= 0.95;
            vert.x += dt*vert.vx;
            vert.y += dt*vert.vy;
        }
    };
    /*this.forEdges = function(cb){
        for(let id in verts){
            let vert = verts[i];
            cb(edge);
        }
    };
    this.forVerts = function(cb){
        for(let id in this.verts){
            let vert = verts[i];
            cb(vert);
        }
    }*/
};

let step;

let main = async function(){
    //loading graph and shit
    let json = await (await fetch(window.location.href+"result.json")).text();
    let routes = JSON.parse(json).map(host =>{
        let name = host[0];
        let rows = host[1].trim().split("\n");
        let ip = rows[0].match(/[0-9]+\.[0-9]+\.[0-9]+\.[0-9]+/)[0];
        console.log(name,ip);
        let route = rows.slice(1).map(row=>{
            //console.log(row);
            let matches = row.match(/[^\s]+\s+\([0-9]+\.[0-9]+\.[0-9]+\.[0-9]+\)/g) || [];
            //console.log(matches);
            return matches;
        });
        route[route.length-1] = [`${name} (${ip})`];
        return route;
    });
    console.log(routes);
    //adding edges
    let g = new Graph();
    //test code
    /*
    g.addEdge(g.addVert("1"),g.addVert("2"));
    g.addEdge(g.addVert("1"),g.addVert("3"));
    g.addEdge(g.addVert("1"),g.addVert("4"));
    g.addEdge(g.addVert("4"),g.addVert("5"));
    console.log(routes[0]);*/
    routes.map(route=>{
        //console.log(route);
        let lastNodes = route[0].map(n=>{
            return g.addVert(n);
        });
        if(lastNodes.length === 0){
            lastNodes = [g.addVert("")];//empty -> special case
        }
        for(let i = 1; i < route.length; i++){
            let nodes = route[i].map(n=>{
                return g.addVert(n);
            });
            if(nodes.length === 0){
                nodes = [g.addVert("")];//empty -> special case
            }
            //node setup complete, just connect from this point on
            for(let j = 0; j < lastNodes.length; j++){
                for(let k = 0; k < nodes.length; k++){
                    g.addEdge(lastNodes[j],nodes[k]);
                    //console.log(lastNodes[j].id,nodes[k].id);
                }
            }
            lastNodes = nodes;
        }
    });
    
    //initialization complete
    let canvas = document.querySelector("#canvas");
    let width = 500;
    let height = 500;
    canvas.width = width;
    canvas.height = height;
    let ctx = canvas.getContext("2d");
    
    
    let render = function(){
        ctx.clearRect(0,0,width,height);
        for(let key in g.verts){
            let vert = g.verts[key];
            let x = width/2+vert.x*30;
            let y = height/2+vert.y*30;
            ctx.beginPath();
            ctx.arc(x,y,Math.sqrt(vert.weight),0,6.28);
            ctx.closePath();
            ctx.fill();
        }
        for(let i = 0; i < g.edges.length; i++){
            let edge = g.edges[i];
            let v1 = edge.verts[0];
            let v2 = edge.verts[1];
            let x1 = width/2+v1.x*30;
            let y1 = height/2+v1.y*30;
            let x2 = width/2+v2.x*30;
            let y2 = height/2+v2.y*30;
            ctx.beginPath();
            ctx.moveTo(x1,y1);
            ctx.lineTo(x2,y2);
            ctx.lineWidth = Math.sqrt(edge.weight);
            ctx.stroke();
        }
    };
    
    render();
    
    step = function(){
        g.adjustPosition();
        render();
        requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
};

main();