function order(arr) {
    let nb_change=0
    arr.forEach((e,i) => {
        if(arr[i]>arr[i+1]){
            let keep=arr[i]
            arr[i]=arr[i+1]
            arr[i+1]=keep
            nb_change++
        }
    });
    console.log(nb_change);
    if (nb_change==0) {
        return arr
    }else{
        return order(arr)
    }
}

function activities(data) {
    let activities_in={}
    let activities_out={}
    let motif
    data.forEach(m => {
        if (m.type=="Entrer" || m.type=="Empreunter") {
            if (m.type=="Empreunter") {
                motif=m.type
            } else {
                motif=m.categorie_source
            }
            let som=0
            if (m.devise=="USD") {
                som=Number(m.somme)
            }else{
                som=Number(m.somme)/2500
            }
            if (activities_in[motif]==undefined) {
                activities_in[motif]=som
            }else{
                activities_in[motif]+=som
            }
        }else{
            // console.log(m.categorie_depense);
            if (m.type=="Preter") {
                motif=m.type
            } else {
                motif=m.categorie_depense
            }
            som=0
            if (m.devise=="USD") {
                som=Number(m.somme)
            }else{
                som=Number(m.somme)/2500
            }

            if (activities_out[motif]==undefined) {
                activities_out[motif]=som
                
            }else{
                activities_out[motif]+=som
            }
            
        }
    });

    return {in:activities_in,out:activities_out}
}
function drawGraph(data,id,mode,lab) {
    // console.log(data);
    $("#stat").append(`
        <div class="stat-dep">
            <canvas id="${id}"></canvas>
        </div>
    `);
    let somRevMois=0
    Object.values(activities(data)[mode]).forEach(e=>{
        somRevMois+=e
    })
    let revMois=Object.values(activities(data)[mode]).map(e=>{
        return e*100/somRevMois
    })
    new Chart($("#"+id), {
        type: 'bar',
        data: {
        labels: Object.keys(activities(data)[mode]),
        datasets: [
            {
                label: lab,
                data: revMois,
                borderWidth: 1
            }
        ]
        },
        options: {
            animations: {
                tension: {
                  duration: 1000,
                  easing: 'linear',
                  from: 1,
                  to: 0,
                  loop: true
                }
            },
            scales: {
                y: {
                beginAtZero: true
                }
            }
        }
    });
}
function loadStat() {
    let gain_mois_usd=0
    let gain_mois_cdf=0
    let dep_mois_usd=0
    let dep_mois_cdf=0

    let gain_last_usd=0
    let gain_last_cdf=0
    let dep_last_usd=0
    let dep_last_cdf=0

    let all_Month=[]
    let all_Last=[]
    let mvm=getTable("mouvements")
    let mois=new Date()
    let last={m:mois.getMonth()-1,y:mois.getFullYear()}
    if (last<0) {
        last.m=11
        last.y--
    }
    let all_gain_cdf=0
    let all_gain_usd=0
    let all_dep_usd=0
    let all_dep_cdf=0

    mvm.forEach(m => {
        if (m.type=="Entrer" || m.type=="Empreunter") {
            if (m.devise=="USD") {
                all_gain_usd+=Number(m.somme)
            }else{
                all_gain_cdf+=Number(m.somme)
            }
        }else{
            if (m.devise=="USD") {
                all_dep_usd+=Number(m.somme)
            }else{
                all_dep_cdf+=Number(m.somme)
            }
        }
        let dm=new Date(Number(m.time))
        if (mois.getMonth()==dm.getMonth() && mois.getFullYear()==dm.getFullYear() ) {
            all_Month.push(m)
            if (m.type=="Entrer" || m.type=="Empreunter") {
                if (m.devise=="USD") {
                    gain_mois_usd+=Number(m.somme)
                }else{
                    gain_mois_cdf+=Number(m.somme)
                }
            }else{
                if (m.devise=="USD") {
                    dep_mois_usd+=Number(m.somme)
                }else{
                    dep_mois_cdf+=Number(m.somme)
                }
            }
        }
        
        if (last.m==dm.getMonth() && last.y==dm.getFullYear() ) {
            all_Last.push(m)
            if (m.type=="Entrer" || m.type=="Empreunter") {
                if (m.devise=="USD") {
                    gain_last_usd+=Number(m.somme)
                }else{
                    gain_last_cdf+=Number(m.somme)
                }
            }else{
                if (m.devise=="USD") {
                    dep_last_usd+=Number(m.somme)
                }else{
                    dep_last_cdf+=Number(m.somme)
                }
            }
        }
        
    });
    // Depense ce mois
    $("#gain_mois_cdf").text(gain_mois_cdf+" CDF");
    $("#gain_mois_usd").text(gain_mois_usd+" USD");
    $("#dep_mois_cdf").text(dep_mois_cdf+" CDF");
    $("#dep_mois_usd").text(dep_mois_usd+" USD");
    // Depense mois dernier
    $("#gain_last_cdf").text(gain_last_cdf+" CDF");
    $("#gain_last_usd").text(gain_last_usd+" USD");
    $("#dep_last_cdf").text(dep_last_cdf+" CDF");
    $("#dep_last_usd").text(dep_last_usd+" USD");
    // Depense generale
    $("#all_gain_cdf").text(all_gain_cdf+" CDF");
    $("#all_gain_usd").text(all_gain_usd+" USD");
    $("#all_dep_cdf").text(all_dep_cdf+" CDF");
    $("#all_dep_usd").text(all_dep_usd+" USD");
    

    drawGraph(all_Month,"all_Month_in","in","Repartition de vos revenus ce mois")
    drawGraph(all_Month,"all_Month_out","out","Repartition de vos depenses ce mois")
    
    drawGraph(all_Last,"all_Last_in","in","Repartition de vos revenus mois passe")
    drawGraph(all_Last,"all_Last_out","out","Repartition de vos depenses mois passe")

    drawGraph(mvm,"all_in","in","Repartition de vos revenus en general")
    drawGraph(mvm,"all_out","out","Repartition de vos depenses en general")
}
loadStat()