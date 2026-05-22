window.onload=function(){

    let produseInitiale = Array.from(document.getElementsByClassName("produs"));

    document.getElementById("inp-pret").onchange=function(){
        let val=this.value.trim()
        document.getElementById("infoRange").innerHTML=`(${val})`
    }

    document.getElementById("filtrare").onclick=function(){
        let inpNume=document.getElementById("inp-nume").value.trim().toLowerCase()

        let grupRadio=document.getElementsByName("gr_rad")
        let nrPieseMin, nrPieseMax, isToate=false;
        for (let rad of grupRadio){
            if (rad.checked){
                if (rad.value!="toate"){
                    [nrPieseMin,nrPieseMax]= rad.value.split(":")  
                    nrPieseMin=parseInt(nrPieseMin)
                    nrPieseMax=parseInt(nrPieseMax)
                }
                else{
                    isToate=true
                }
                break
            }
        }

        let inpPretMin=parseFloat(document.getElementById("inp-pret").value.trim())

        let inpCategorie=document.getElementById("inp-categorie").value.trim().toLowerCase()
        let inpCuloare=document.getElementById("inp-culoare").value.trim().toLowerCase() 

        let checkedLivrare = false
        if(document.getElementById("livrare").checked){
            checkedLivrare = true 
        }

        let textMembrii = document.getElementById("inp-membrii").value.trim().toLowerCase();
        let listaMembrii = textMembrii.split(/,|\n/).map(m => m.trim()).filter(m => m.length > 0);

        let produse=document.getElementsByClassName("produs")
        for (let prod of produse){
            prod.style.display="none"

            let nume= prod.getElementsByClassName("val-nume")[0].innerHTML.trim().toLowerCase()
            let cond1=nume.includes(inpNume)

            let nr_piese= parseInt(prod.getElementsByClassName("val-nr-piese")[0].innerHTML.trim())
            let cond2=(nr_piese>=nrPieseMin && nr_piese<nrPieseMax) || isToate;

            let pret=parseFloat(prod.getElementsByClassName("val-pret")[0].innerHTML.trim())
            let cond3=pret>=inpPretMin

            let cond4=prod.getElementsByClassName("val-categorie")[0].innerHTML.trim().toLowerCase() == inpCategorie || inpCategorie== "toate";

            let cond5=prod.getElementsByClassName("val-culoare")[0].innerHTML.trim().toLowerCase() == inpCuloare || inpCuloare== ""; 

            let prodLivrare = prod.getElementsByClassName("val-livrare")[0].innerHTML.trim().toLowerCase();
            let cond6 = !checkedLivrare || (prodLivrare === "true");

            let prodMembrii = prod.getElementsByClassName("val-membrii")[0].innerHTML.trim().toLowerCase();
            let cond7 = false;
            
            if (listaMembrii.length === 0) {
                cond7 = true; 
            } else {
                for (let membru of listaMembrii) {
                    if (prodMembrii.includes(membru)) {
                        cond7 = true;
                        break;
                    }
                }
            }

            if (cond1 && cond2 && cond3 && cond4 && cond5 && cond6 && cond7){
                prod.style.display="block"
            }
        }
    }

    document.getElementById("resetare").onclick=function(){

        let raspuns = confirm("Doriti sa resetati filtrele?");

        if(raspuns){
            document.getElementById("inp-nume").value=""
            document.getElementById("inp-pret").value="0"
            document.getElementById("infoRange").innerHTML="(0)"
            document.getElementById("inp-categorie").value="toate"
            document.getElementById("inp-culoare").value=""
            document.getElementById("i_rad4").checked=true
            document.getElementById("inp-membrii").value = "";
            

            let produse=document.getElementsByClassName("produs")
            for (let prod of produse){
                prod.style.display="block"
            }

            for(let prod of produseInitiale){
                prod.parentElement.appendChild(prod)
            }
        }
    }

    function sorteaza(semn){
        let produse = document.getElementsByClassName("produs")
        let vProduse = Array.from(produse)
        vProduse.sort(function(a,b){
            let pretA=parseFloat(a.getElementsByClassName("val-pret")[0].innerHTML.trim())
            let pretB=parseFloat(b.getElementsByClassName("val-pret")[0].innerHTML.trim())
            if(pretA == pretB){
                let numeA=a.getElementsByClassName("val-nume")[0].innerHTML.trim().toLowerCase()
                let numeB=b.getElementsByClassName("val-nume")[0].innerHTML.trim().toLowerCase()
                return semn*numeA.localeCompare(numeB)
            }

            return semn*(pretA-pretB)
        })
        for(let prod of vProduse){
            prod.parentElement.appendChild(prod)
        }
    }

    document.getElementById("sortCrescNume").onclick=function(){sorteaza(1)}
    document.getElementById("sortDescrescNume").onclick=function(){sorteaza(-1)}

    window.onkeydown=function(e){
        if (e.key=="c" && e.altKey){
            let produse=document.getElementsByClassName("produs")
            let suma=0;
            for (let prod of produse){
                if (prod.style.display!="none"){
                    suma+=parseFloat(prod.getElementsByClassName("val-pret")[0].innerHTML.trim())
                }
            }
            let p =this.document.getElementById("infoSuma")
            if(!p){
                p= this.document.createElement("p")
                p.innerHTML=suma
                p.id="infoSuma"
                let sectiuneProduse=this.document.getElementById("produse")
                sectiuneProduse.parentElement.insertBefore(p, sectiuneProduse)
                this.setTimeout(function(){
                    let p1 =this.document.getElementById("infoSuma")
                    p1.remove()
                }, 2000)
            }
            else{
                p.innerHTML=suma
            }
            
        }

    }

}