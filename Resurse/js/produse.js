window.onload = function () {

    let produseInitiale = Array.from(document.getElementsByClassName("produs"));

    let modalElement = document.getElementById("modal-produs");
    let modalCloseBtn = document.querySelector(".modal-close");

    function deschideModal(prod) {
        let nume = prod.getElementsByClassName("val-nume")[0].innerHTML.trim();
        let pret = prod.getElementsByClassName("val-pret")[0].innerHTML.trim();
        let nrPiese = prod.getElementsByClassName("val-nr-piese")[0].innerHTML.trim();
        let format = prod.getElementsByClassName("val-format")[0].innerHTML.trim();
        let categorie = prod.getElementsByClassName("val-categorie")[0].innerHTML.trim();
        let culoare = prod.getElementsByClassName("val-culoare")[0].innerHTML.trim();
        let livrare = prod.getElementsByClassName("val-livrare")[0].innerHTML.trim();
        let membrii = prod.getElementsByClassName("val-membrii")[0].innerHTML.trim();
        let imagine = prod.getElementsByTagName("img")[0].src;
        let prodId = prod.getAttribute("data-id");

        let badgesHtml = "";
        if (prod.querySelector(".badge-nou")) {
            badgesHtml += '<span class="badge bg-success">NOU</span> ';
        }
        if (prod.querySelector(".badge-ieftin")) {
            badgesHtml += '<span class="badge bg-warning">Cel mai ieftin</span>';
        }

        let livrareText = livrare === "true" ? '<span class="badge bg-info">Cu livrare</span>' : '<span class="badge bg-secondary">Fără livrare</span>';

        let modalBodyHtml = `
            <div class="modal-header">
                <h2 class="modal-titlu">${escape(nume)}</h2>
                <div class="modal-badge-grup">
                    ${badgesHtml}
                </div>
            </div>

            <img src="${imagine}" alt="Imagine ${escape(nume)}" class="modal-imagine">

            <div class="modal-pret">
                <div class="modal-info-label">Preț</div>
                <div class="modal-pret-value">${escape(pret)} RON</div>
            </div>

            <div class="modal-info-grid">
                <div class="modal-info-item">
                    <div class="modal-info-label">Format</div>
                    <div class="modal-info-value">${escape(format)}</div>
                </div>
                <div class="modal-info-item">
                    <div class="modal-info-label">Categorie</div>
                    <div class="modal-info-value">${escape(categorie)}</div>
                </div>
                <div class="modal-info-item">
                    <div class="modal-info-label">Nr. Piese</div>
                    <div class="modal-info-value">${escape(nrPiese)}</div>
                </div>
                <div class="modal-info-item">
                    <div class="modal-info-label">Culoare</div>
                    <div class="modal-info-value">${escape(culoare)}</div>
                </div>
            </div>

            <div class="modal-info-item">
                <div class="modal-info-label">Livrare</div>
                <div>${livrareText}</div>
            </div>

            <div class="modal-info-item">
                <div class="modal-info-label">Membri</div>
                <div class="modal-info-value" style="font-size: 0.95rem;">${escape(membrii)}</div>
            </div>

            <div class="modal-footer">
                <button class="modal-btn modal-btn-primary" onclick="document.querySelector('.select-cos[value='${prodId}']').click(); deschideModal = null;">
                    <i class="bi bi-cart-plus"></i> Adaugă în coș
                </button>
                <a href="/produs/${prodId}" class="modal-btn modal-btn-secondary" style="text-decoration: none; text-align: center;">
                    <i class="bi bi-arrow-right"></i> Detalii complete
                </a>
            </div>
        `;

        let modalBody = document.querySelector(".modal-body");
        modalBody.innerHTML = modalBodyHtml;
        modalElement.style.display = "flex";
    }

    function inchideModal() {
        modalElement.style.display = "none";
    }

    // click pe produs ca sa deschizi modal
    for (let prod of produseInitiale) {
        prod.addEventListener("click", function (e) {
            //TODO: poate e vreo metoda mai buna
            if (!e.target.closest(".selecteaza-cos") && !e.target.closest(".select-cos")) {
                deschideModal(this);
            }
        });
    }

    modalCloseBtn.addEventListener("click", inchideModal);

    //click oriunde pe ecran
    modalElement.addEventListener("click", function (e) {
        if (e.target === modalElement) {
            inchideModal();
        }
    });

    document.addEventListener("keydown", function (e) {
        if (e.key === "Escape" && modalElement.style.display !== "none") {
            inchideModal();
        }
    });

    function actualizareAfisaje() {
        let produse = document.getElementsByClassName("produs");
        let nrAfisate = 0;

        for (let prod of produse) {
            if (prod.style.display !== "none") {
                nrAfisate++;
            }
        }

        let spanNrProduse = document.getElementById("nr-produse");
        if (spanNrProduse) {
            spanNrProduse.innerHTML = nrAfisate;
        }

        let divMesajLipsa = document.getElementById("mesaj-lipsa-produse");
        if (divMesajLipsa) {
            if (nrAfisate === 0) {
                divMesajLipsa.style.display = "block";
            } else {
                divMesajLipsa.style.display = "none";
            }
        }
    }
    function aplicaFiltre() {
        let inpNume = document.getElementById("inp-nume").value.trim().toLowerCase()

        let grupRadio = document.getElementsByName("gr_rad")
        let nrPieseMin, nrPieseMax, isToate = false;
        for (let rad of grupRadio) {
            if (rad.checked) {
                if (rad.value != "toate") {
                    [nrPieseMin, nrPieseMax] = rad.value.split(":")
                    nrPieseMin = parseInt(nrPieseMin)
                    nrPieseMax = parseInt(nrPieseMax)
                }
                else {
                    isToate = true
                }
                break
            }
        }

        let inpPretMin = parseFloat(document.getElementById("inp-pret").value.trim())

        let inpCategorie = document.getElementById("inp-categorie").value.trim().toLowerCase()
        let inpCuloare = document.getElementById("inp-culoare").value.trim().toLowerCase()

        let checkedLivrare = false
        if (document.getElementById("livrare").checked) {
            checkedLivrare = true
        }

        let textMembrii = document.getElementById("inp-membrii").value.trim().toLowerCase();
        let listaMembrii = textMembrii.split(/,|\n/).map(m => m.trim()).filter(m => m.length > 0);

        let formateBifate = [];
        let chkFormate = document.getElementsByClassName("chk-format");
        for (let chk of chkFormate) {
            if (chk.checked) {
                formateBifate.push(chk.value.trim().toLowerCase());
            }
        }

        let produse = document.getElementsByClassName("produs")
        for (let prod of produse) {
            prod.style.display = "none"

            let nume = prod.getElementsByClassName("val-nume")[0].innerHTML.trim().toLowerCase()
            let cond1 = nume.includes(inpNume)

            let nr_piese = parseInt(prod.getElementsByClassName("val-nr-piese")[0].innerHTML.trim())
            let cond2 = (nr_piese >= nrPieseMin && nr_piese < nrPieseMax) || isToate;

            let pret = parseFloat(prod.getElementsByClassName("val-pret")[0].innerHTML.trim())
            let cond3 = pret >= inpPretMin

            let cond4 = prod.getElementsByClassName("val-categorie")[0].innerHTML.trim().toLowerCase() == inpCategorie || inpCategorie == "toate";

            let cond5 = prod.getElementsByClassName("val-culoare")[0].innerHTML.trim().toLowerCase() == inpCuloare || inpCuloare == "";

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

            let prodFormat = prod.getElementsByClassName("val-format")[0].innerHTML.trim().toLowerCase();
            let cond8 = formateBifate.includes(prodFormat);

            if (cond1 && cond2 && cond3 && cond4 && cond5 && cond6 && cond7 && cond8) {
                prod.style.display = "block"
            }
        }

        actualizareAfisaje();
    }

    document.getElementById("inp-nume").oninput = aplicaFiltre;

    document.getElementById("inp-culoare").oninput = aplicaFiltre;
    document.getElementById("inp-culoare").onchange = aplicaFiltre;

    document.getElementById("inp-categorie").onchange = aplicaFiltre;

    let inpPret = document.getElementById("inp-pret");
    inpPret.oninput = function () {
        let val = this.value.trim();
        document.getElementById("infoRange").innerHTML = `(${val})`;
        aplicaFiltre();
    }
    inpPret.onchange = function () {
        let val = this.value.trim();
        document.getElementById("infoRange").innerHTML = `(${val})`;
        aplicaFiltre();
    }

    let grupRadio = document.getElementsByName("gr_rad");
    for (let rad of grupRadio) {
        rad.onchange = aplicaFiltre;
    }

    let chkFormate = document.getElementsByClassName("chk-format");
    for (let chk of chkFormate) {
        chk.onchange = aplicaFiltre;
    }

    document.getElementById("livrare").onchange = aplicaFiltre;

    document.getElementById("inp-membrii").oninput = aplicaFiltre;
    //TODO: vezi daca e neaparat nevoie sa pastrezi asta
    document.getElementById("filtrare").onclick = aplicaFiltre;


    document.getElementById("resetare").onclick = function () {

        let raspuns = confirm("Doriti sa resetati filtrele?");

        if (raspuns) {
            document.getElementById("inp-nume").value = ""
            document.getElementById("inp-pret").value = "0"
            document.getElementById("infoRange").innerHTML = "(0)"
            document.getElementById("inp-categorie").value = "toate"
            document.getElementById("inp-culoare").value = ""
            document.getElementById("i_rad4").checked = true
            document.getElementById("inp-membrii").value = "";

            let chkFormate = document.getElementsByClassName("chk-format");
            for (let chk of chkFormate) {
                chk.checked = true;
            }

            let produse = document.getElementsByClassName("produs")
            for (let prod of produse) {
                prod.style.display = "block"
            }

            for (let prod of produseInitiale) {
                prod.parentElement.appendChild(prod)
            }

            actualizareAfisaje();
        }
    }

    function sorteaza(semn) {
        let produse = document.getElementsByClassName("produs")
        let vProduse = Array.from(produse)
        vProduse.sort(function (a, b) {
            let pretA = parseFloat(a.getElementsByClassName("val-pret")[0].innerHTML.trim())
            let pretB = parseFloat(b.getElementsByClassName("val-pret")[0].innerHTML.trim())
            if (pretA == pretB) {
                let numeA = a.getElementsByClassName("val-nume")[0].innerHTML.trim().toLowerCase()
                let numeB = b.getElementsByClassName("val-nume")[0].innerHTML.trim().toLowerCase()
                return semn * numeA.localeCompare(numeB)
            }

            return semn * (pretA - pretB)
        })
        for (let prod of vProduse) {
            prod.parentElement.appendChild(prod)
        }
    }

    document.getElementById("sortCrescNume").onclick = function () { sorteaza(1) }
    document.getElementById("sortDescrescNume").onclick = function () { sorteaza(-1) }

    window.onkeydown = function (e) {
        if (e.key == "c" && e.altKey) {
            let produse = document.getElementsByClassName("produs")
            let suma = 0;
            for (let prod of produse) {
                if (prod.style.display != "none") {
                    suma += parseFloat(prod.getElementsByClassName("val-pret")[0].innerHTML.trim())
                }
            }
            let p = this.document.getElementById("infoSuma")
            if (!p) {
                p = this.document.createElement("p")
                p.innerHTML = suma
                p.id = "infoSuma"
                let sectiuneProduse = this.document.getElementById("produse")
                sectiuneProduse.parentElement.insertBefore(p, sectiuneProduse)
                this.setTimeout(function () {
                    let p1 = this.document.getElementById("infoSuma")
                    p1.remove()
                }, 2000)
            }
            else {
                p.innerHTML = suma
            }

        }

    }

    actualizareAfisaje();
}