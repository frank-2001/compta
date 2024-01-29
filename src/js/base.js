let actual_tab=""
// botom menu bar manager
function tab(id) {
    if (id==actual_tab) {
        return
    }
    $("html, body").animate({scrollTop: 0}, "fast");
    $(".options>button>div>svg").css("color","var(--white)");
    // $(".options>.add>div>svg").css("color","var(--secondary)");
    $("#btn_"+id+">div>svg").css("color","var(--primary)");
    
    // Afficher l'élément avec l'animation personnalisée
    //   $("#element").show()
    
    $(".tab").hide(500)
    $("#"+id).show(500);
    actual_tab=id
    // alert("#"+id+"_tab")
}
tab("wallet")