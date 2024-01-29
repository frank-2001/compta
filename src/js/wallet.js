function loadWallet() {
    let s=getTable("solde").pop()
    $("#walletCDF").text(s["CDF"]);
    $("#walletUSD").text(s["USD"]);
    // console.log(s.pop());
    let m=getTable("mouvements")
    $("#wallet>.mouvement").html(`
    <div class="title-solde">
        Mouvements
    </div>
    `);
    m.reverse().forEach(mv => {
        let icon
        let cat=mv.categorie_depense+" - "+mv.description
        if (mv.type=="Sortie") {
            icon=`<svg class="down" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-6 h-6">
                <path fill-rule="evenodd" d="M20.03 4.72a.75.75 0 010 1.06l-7.5 7.5a.75.75 0 01-1.06 0l-7.5-7.5a.75.75 0 011.06-1.06L12 11.69l6.97-6.97a.75.75 0 011.06 0zm0 6a.75.75 0 010 1.06l-7.5 7.5a.75.75 0 01-1.06 0l-7.5-7.5a.75.75 0 111.06-1.06L12 17.69l6.97-6.97a.75.75 0 011.06 0z" clip-rule="evenodd" />
            </svg>`
            if (mv.projet!="Aucun") {
                cat=mv.projet
            }
        }else{
            icon=`<svg class="up" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-6 h-6">
                <path fill-rule="evenodd" d="M11.47 4.72a.75.75 0 011.06 0l7.5 7.5a.75.75 0 11-1.06 1.06L12 6.31l-6.97 6.97a.75.75 0 01-1.06-1.06l7.5-7.5zm.53 7.59l-6.97 6.97a.75.75 0 01-1.06-1.06l7.5-7.5a.75.75 0 011.06 0l7.5 7.5a.75.75 0 11-1.06 1.06L12 12.31z" clip-rule="evenodd" />
            </svg>`
            if (mv.categorie_source=="Autre") {
                cat=mv.description
            }
        }
        
        if (mv.type=="Sortie" || mv.type=="Entrer") {
            let d=new Date(Number(mv.time))
            $("#wallet>.mouvement").append(
                `
                <div>
                    ${icon}
                    <span>${d.getHours()}h ${d.getDate()}.${d.getMonth()+1}</span>
                    <span>${cat}</span>
                    <span style="text-align:right">${mv.somme} ${mv.devise}</span>
                </div>
                `
            )
        }
        
    });
console.log("wallet");
}
loadWallet()