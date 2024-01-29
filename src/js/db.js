if (localStorage.getItem("mouvements")==null) {
    localStorage.setItem("mouvements","[]")
}
if (localStorage.getItem("solde")==null) {
    localStorage.setItem("solde",JSON.stringify([{"CDF":0,"USD":0}]))
}
if (localStorage.getItem("projets")==null) {
    localStorage.setItem("projets","[]")
}
if (localStorage.getItem("dettes")==null) {
    localStorage.setItem("dettes","[]")
}
if (localStorage.getItem("source")==null) {
    localStorage.setItem("source","[]")
}
if (localStorage.getItem("depenses")==null) {
    localStorage.setItem("depenses","[]")
}
if (localStorage.getItem("user")==null) {
    localStorage.setItem("user",JSON.stringify({"id":1,"username":"Frank M."}))
}

function getTable(table) {
    return JSON.parse(localStorage.getItem(table))
}
function addTable(table,data) {
    let origin=getTable(table)
    data["time"]=new Date().getTime()
    data["user"]=getTable("user")["id"]
    origin.push(data)
    localStorage.setItem(table,JSON.stringify(origin))
}
function updateTable(table,data) {
    let newTable=getTable(table).map(
        e=>{
            if (e.time==data.time) {
                return data
            }
            return e
        }
    )
    console.log(data);
    console.log(newTable);
    console.log(getTable(table));
    localStorage.setItem(table,JSON.stringify(newTable))
}
function getTableFilter(table,column,value) {
    table=getTable(table)
    let out=[]
    table.forEach(element => {
        if (element[column]==value) {
            out.push(element)
        }
    });
    return out;
}
// Synchroniser le donnees du serveur et celles qui se trouvent en local
// Grance au timestemp recupere le donnees d'utilisateur et voir le temps de la derniere donnee
// Et envoi seulement les donnees avec le temps superieur au temps envoye par le serveur
function synch() {

}
