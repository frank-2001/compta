// On change mouvement type
$("#mouv_type").change(function (e) { 
    e.preventDefault();
    console.log(this.value);
    if (this.value=="Sortie") {
        $("#list_projet").show();
        $("#list_depenses").show();        
    }else{
        $("#list_projet").hide();   
        $("#list_depenses").hide();
    }
    if (this.value=="Entrer") {
        $("#list_source").show();        
    }else{
        $("#list_source").hide();        
    }
    if (this.value=="Empreunter" || this.value=="Preter") {
        $("#mouv>.special").show();        
    }else{
        $("#mouv>.special").hide();
    }
});
// Load select option from local db
function loadSelect() {
    $("#list_projet>select").text("")
    $("#list_projet>select").append(
        `
            <option>Aucun</option>
        `
    );
    getTable("projets").forEach(element => {
        if (element.done==1) {
            return;
        }
        $("#list_projet>select").append(
            `
                <option value="${element.titre}-${element.time}">${element.titre}</option>
            `
        );
    });
    $("#list_depenses>select").text("")
    $("#list_depenses>select").append(
        `
            <option>Autre</option>
            <option>Remboursement</option>
        `
    );
    getTable("depenses").forEach(element => {
        $("#list_depenses>select").append(
            `
                <option>${element}</option>
            `
        );
    });
    $("#list_source>select").text("")
    $("#list_source>select").append(
        `
            <option>Autre</option>
            <option>Remboursement</option>
        `
    );
    getTable("source").forEach(element => {
        $("#list_source>select").append(
            `
                <option>${element}</option>
            `
        );
    });
}
loadSelect()
$("#list_projet>select").change(function (e) { 
    e.preventDefault();
    console.log();
    p=getTableFilter("projets","time",this.value.split("-")[1])
    console.log(p);
    // $("#devise").html(`<option>USD</option>`);
    $("#devise").val(p[0].devise);
});
// On remboursement emprunt 
$("#list_depenses>select").change(function (e) { 
    e.preventDefault();
    if (this.value=="Remboursement") {
        let empreunt=getTableFilter("mouvements","type","Empreunter")
        empreunt.forEach(e => {
            let d=new Date(Number(e.time))
            $("#list_empreunt>select").append(
                `<option value="${e.time}">
                ${Number(e.somme)+Number(e.interet)}${e.devise} - du ${d.getDate()}.${d.getMonth()+1}.${d.getFullYear()} - ${e.description}
                </option>`
            );    
        });
        $("#list_empreunt").show()
    }else{
        $("#list_empreunt>select").text("")
        $("#list_empreunt").hide()
    }
});
// On remboursement pret 
$("#list_source>select").change(function (e) { 
    e.preventDefault();
    if (this.value=="Remboursement") {
        let pret=getTableFilter("mouvements","type","Preter")
        pret.forEach(e => {
            let d=new Date(Number(e.time))
            $("#list_pret>select").append(
                `<option value="${e.time}">
                    ${Number(e.somme)+Number(e.interet)}${e.devise} - du ${d.getDate()}.${d.getMonth()+1}.${d.getFullYear()} - ${e.description}
                </option>`
            );    
        });
        $("#list_pret").show()
    }else{
        $("#list_pret>select").text("")
        $("#list_pret").hide()
    }
});
$("#list_pret>select").change(function (e) { 
    e.preventDefault();
    console.log();
    p=getTableFilter("mouvements","time",this.value)
    console.log(p);
    $("#devise").val(p[0].devise);
});
$("#list_empreunt>select").change(function (e) { 
    e.preventDefault();
    console.log();
    p=getTableFilter("mouvements","time",this.value)
    console.log(p);
    $("#devise").val(p[0].devise);
});
// Convert a form to a dictionary
function formToDic(form) {
    let dict={}
    for(var i of form.entries()){
        dict[i[0]]=i[1];
    }
    return dict
}
// Submit mouvement
$("#mouv").submit(function (e) { 
    e.preventDefault();
    let solde=getTable("solde").pop()
    let form=new FormData(this)
    form=formToDic(form)

    
    if (form.type=="Entrer" || form.type=="Empreunter") {
        addTable("mouvements",form)
        if (form.empreunt!="Bien") {
            solde[form.devise]=Number(solde[form.devise])+Number(form.somme)
            solde.time=new Date().getTime()
            addTable("solde",solde)
        }
        this.reset()
    }else{
        if (Number(solde[form.devise])>=Number(form.somme)) {
            solde[form.devise]=Number(solde[form.devise])-Number(form.somme)
            solde.time=new Date().getTime()
            addTable("mouvements",form)
            addTable("solde",solde)
            this.reset()
            $("#mouv>.special").hide();
            $("#mouv>.special2").hide();
        }else{
            alert("Somme superieur au solde!")
        }
    }   
});
// Submit new project
$("#proj").submit(function (e) { 
    e.preventDefault();
    let form=new FormData(this)
    form=formToDic(form)
    addTable("projets",form)
    this.reset()
    loadSelect()
});
// submit new kind of source
$("#source").submit(function (e) { 
    e.preventDefault();
    let form=new FormData(this)
    form=formToDic(form)
    addTable("source",form.nomination)
    this.reset()
    loadSelect()
});
// Submit new kind of depense
$("#depenses").submit(function (e) { 
    e.preventDefault();
    let form=new FormData(this)
    form=formToDic(form)
    addTable("depenses",form.nomination)
    this.reset()
    loadSelect()
});

function load() {
    console.log("Update tabs");
    loadWallet()
    loadDettes()
    loadProject()
    loadStat()
}
// Reset all forms
function reset() {
    $("#list_depenses").hide(); 
    $("#list_projet").hide();
    // $("#list_source").hide();        
    $("#mouv>.special").hide();        
    $("#list_empreunt").hide()
    $("#list_pret").hide()
    for (let i = 0; i < $('form').length; i++) {
        $('form')[i].reset()
    }
}
$(".menu-pen>div>button").click(function (e) { 
    e.preventDefault();
    $(".menu-pen>div>button").removeClass("active");
    $(e.currentTarget).addClass("active");
    reset()
    $("#new>form").hide();
});