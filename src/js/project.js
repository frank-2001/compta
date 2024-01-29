function loadProject() {
    let proj=getTable("projets")
    if (proj.length==0) {
        return;
    }
    $("#projet").text("");
    let nbLoad=0
    proj.reverse().forEach(p => {
        if (p.done==1) {
            return;
        }
        nbLoad++
        
        details=getTableFilter("mouvements","projet",p.titre+"-"+p.time)
        htmlDetails=""
        total=0
        details.forEach(de => {
            dx=new Date(Number(p.time))
            if (de.devise==p.devise) {
                total+=Number(de.somme)
            }
           
            htmlDetails+=`
            <div>
                <span>${dx.getDate()}.${dx.getMonth()+1}.${dx.getFullYear()}</span> 
                <span>${de.description}</span>
                <span>${de.somme} ${de.devise}</span>
            </div>
            `
        });
        dx=new Date(Number(p.time))
        $("#projet").append(`
        <div class="projet">
                <span>${p.titre}</span>
                <div class="head-p">
                    <span>Creation :</span>
                    <span>${dx.getDate()}.${dx.getMonth()+1}.${dx.getFullYear()}</span>
                    <span>Cout:</span>
                    <span>${p.cout}${p.devise}</span>
                    <span>Priorite :</span>
                    <span>${p.priorite}</span>
                </div>
                <div class="det">
                    <div class="body">
                       ${htmlDetails}
                        <div class="total">
                            <span>Total</span>
                            <span>${total}${p.devise}</span>
                        </div> 
                    </div>
                </div>
                <button onclick="projectDone(${p.time})">Accompli</button>

            </div>
        
        `);
    });
    $("#projet").append(`
    <p>
    <span>Projet.s réalisé.s</span>   
    </p>    
    <hr> 
`)
    proj.reverse().forEach(p => {
        if (p.done==undefined) {
            return;
        }
        let nb=0
        nb++

        details=getTableFilter("mouvements","projet",p.titre+"-"+p.time)
        htmlDetails=""
        total=0
        details.forEach(de => {
            dx=new Date(Number(p.time))
            if (de.devise==p.devise) {
                total+=Number(de.somme)
            }
           
            htmlDetails+=`
            <div>
                <span>${dx.getDate()}.${dx.getMonth()+1}.${dx.getFullYear()}</span> 
                <span>${de.description}</span>
                <span>${de.somme} ${de.devise}</span>
            </div>
            `
        });
        dx=new Date(Number(p.time))
        $("#projet").append(`
        <div class="projet done">
                <span>${p.titre}</span>
                <div class="head-p">
                    <span>Creation :</span>
                    <span>${dx.getDate()}.${dx.getMonth()+1}.${dx.getFullYear()}</span>
                    <span>Cout:</span>
                    <span>${p.cout}${p.devise}</span>
                    <span>Priorite :</span>
                    <span>${p.priorite}</span>
                </div>
                <div class="det">
                    <div class="body">
                       ${htmlDetails}
                        <div class="total">
                            <span>Total</span>
                            <span>${total}${p.devise}</span>
                        </div> 
                    </div>
                </div>
            </div>
        
        `);
    });
}
loadProject()
function projectDone(time) {
    let p=getTableFilter("projets","time",time)[0]
    p["done"]=1
    updateTable("projets",p)
    loadProject()
}