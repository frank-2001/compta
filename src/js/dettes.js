function loadDettes() {
    let usdEmprunt=0
    let cdfEmprunt=0
    let usdPaye=0
    let cdfPaye=0
    
    let usdP=0
    let cdfP=0
    let usdPp=0
    let cdfPp=0
    
    let m=getTable("mouvements")
    $("#dettes>.mouvement-dettes").html(`
    <div class="title-solde">
        Mouvements
    </div>
    `);
    m.reverse().forEach(mv => {
        
        let icon
        if (mv.type=="Empreunter") {
            icon=`<svg class="down" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-6 h-6">
            <path d="M12 7.5a2.25 2.25 0 100 4.5 2.25 2.25 0 000-4.5z" />
            <path fill-rule="evenodd" d="M1.5 4.875C1.5 3.839 2.34 3 3.375 3h17.25c1.035 0 1.875.84 1.875 1.875v9.75c0 1.036-.84 1.875-1.875 1.875H3.375A1.875 1.875 0 011.5 14.625v-9.75zM8.25 9.75a3.75 3.75 0 117.5 0 3.75 3.75 0 01-7.5 0zM18.75 9a.75.75 0 00-.75.75v.008c0 .414.336.75.75.75h.008a.75.75 0 00.75-.75V9.75a.75.75 0 00-.75-.75h-.008zM4.5 9.75A.75.75 0 015.25 9h.008a.75.75 0 01.75.75v.008a.75.75 0 01-.75.75H5.25a.75.75 0 01-.75-.75V9.75z" clip-rule="evenodd" />
            <path d="M2.25 18a.75.75 0 000 1.5c5.4 0 10.63.722 15.6 2.075 1.19.324 2.4-.558 2.4-1.82V18.75a.75.75 0 00-.75-.75H2.25z" />
          </svg> <span>Empreunt</span>
          `
            if (mv.devise=="CDF") {
                cdfEmprunt+=Number(mv.somme)+Number(mv.interet)
            }else{
                usdEmprunt+=Number(mv.somme)+Number(mv.interet)
            }
        }else if(mv.type=="Preter"){
            icon=`<svg class="up" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-6 h-6">
            <path d="M12 7.5a2.25 2.25 0 100 4.5 2.25 2.25 0 000-4.5z" />
            <path fill-rule="evenodd" d="M1.5 4.875C1.5 3.839 2.34 3 3.375 3h17.25c1.035 0 1.875.84 1.875 1.875v9.75c0 1.036-.84 1.875-1.875 1.875H3.375A1.875 1.875 0 011.5 14.625v-9.75zM8.25 9.75a3.75 3.75 0 117.5 0 3.75 3.75 0 01-7.5 0zM18.75 9a.75.75 0 00-.75.75v.008c0 .414.336.75.75.75h.008a.75.75 0 00.75-.75V9.75a.75.75 0 00-.75-.75h-.008zM4.5 9.75A.75.75 0 015.25 9h.008a.75.75 0 01.75.75v.008a.75.75 0 01-.75.75H5.25a.75.75 0 01-.75-.75V9.75z" clip-rule="evenodd" />
            <path d="M2.25 18a.75.75 0 000 1.5c5.4 0 10.63.722 15.6 2.075 1.19.324 2.4-.558 2.4-1.82V18.75a.75.75 0 00-.75-.75H2.25z" />
          </svg> <span>Pret</span>
          `
            if (mv.devise=="CDF") {
                cdfP+=Number(mv.somme)+Number(mv.interet)
            }else{
                usdP+=Number(mv.somme)+Number(mv.interet)
            }
        }
        
        if (mv.type=="Preter" || mv.type=="Empreunter") {
            let details=getTableFilter("mouvements","empreunt",Number(mv.time)).concat(getTableFilter("mouvements","pret",Number(mv.time)))
            let htmlDetails=""
            console.log(details);
            let som=0
            details.forEach(dt => {
                let d=new Date(Number(dt.time))
                if (dt.devise==mv.devise) {
                    som+=Number(dt.somme)   
                }
                htmlDetails+=`
                <div>
                    <span>${d.getHours()}h ${d.getDate()}.${d.getMonth()+1}</span>
                    <span></span>
                    <span style="text-align:right">${dt.somme} ${dt.devise}</span>
                </div>
                `
            });
            if (mv.devise=="CDF" && mv.type=="Empreunter") {
                cdfPaye+=som
            }else if(mv.devise=="USD" && mv.type=="Empreunter") {
                usdPaye+=som
            }
            
            if (mv.devise=="CDF" && mv.type=="Preter") {
                cdfPp+=som
            }else if(mv.devise=="USD" && mv.type=="Preter") {
                usdPp+=som
            }
            let df=1000*60*60*24*Number(mv.delai)+Number(mv.time)
            
            let dx=new Date(df)
            htmlDetails+=`
                <div class="total">
                    <span>Total au ${dx.getDate()}.${dx.getMonth()+1}.${dx.getFullYear()}</span>
                    <span></span>
                    <span style="text-align:right">${som} ${mv.devise}</span>
                </div>
            `
            let d=new Date(Number(mv.time))
            if (mv.done==1) {
                $("#dettes>.mouvement-dettes").append(
                    `
                    <div class="det done-det">
                    <div class="head">
                        ${icon}
                        <span>Date : </span> <span>${d.getDate()}.${d.getMonth()+1}.${d.getFullYear()}</span>
                        <span>Descrip. : </span> <span>${mv.description}</span>
                        <span>Montant : </span> <span>${Number(mv.somme)} ${mv.devise}</span>
                        <span>Interet :</span> <span >${Number(mv.interet)} ${mv.devise}</span>
                    </div>
                    
                    <div class="body">
                        ${htmlDetails}
                    </div>
                    
                </div>
                    `
                )
            }else{
                $("#dettes>.mouvement-dettes").append(
                    `
                    <div class="det" onclick="detteDone(${mv.time})">
                    <div class="head">
                        ${icon}
                        <span>Date : </span> <span>${d.getDate()}.${d.getMonth()+1}.${d.getFullYear()}</span>
                        <span>Descrip. : </span> <span>${mv.description}</span>
                        <span>Montant : </span> <span>${Number(mv.somme)} ${mv.devise}</span>
                        <span>Interet :</span> <span >${Number(mv.interet)} ${mv.devise}</span>
                    </div>
                    
                    <div class="body">
                        ${htmlDetails}
                    </div>
                    
                </div>
                    `
                )
                if (som==Number(mv.interet)+Number(mv.somme)) {
                    detteDoneDirect(mv.time)
                }
            }
           
        }
        
    });
    $("#empreuntCDF").text(cdfEmprunt-cdfPaye);
    $("#empreuntUSD").text(usdEmprunt-usdPaye);
    $("#pretCDF").text(cdfP-cdfPp);
    $("#pretUSD").text(usdP-usdPp);

    

}
loadDettes()
function detteDone(time) {
    if (confirm("Voulez-vous valider cette dette")) {
        let p=getTableFilter("mouvements","time",time)[0]
        p["done"]=1
        updateTable("mouvements",p)
        
    }

}
function detteDoneDirect(time) {
        let p=getTableFilter("mouvements","time",time)[0]
        p["done"]=1
        updateTable("mouvements",p)
        loadDettes()
}