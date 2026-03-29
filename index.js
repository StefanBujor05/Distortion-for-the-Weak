const express= require("express");
const path= require("path");

app= express();
app.set("view engine", "ejs")

console.log("Folder index.js", __dirname);
console.log("Folder curent (de lucru)", process.cwd());
console.log("Cale fisier", __filename);

// pt orice care care incepe cu /Resurse, trimite-mi fisierele 
// static pt ca nu vrem sa le modificam
app.use("/Resurse", express.static(path.join(__dirname, "Resurse")));

// app.get("/:a/:b", function(req, res){
//     res.sendFile(path.join(__dirname, "index.html"));
// });

app.get("/", function(req, res){
    // res.sendFile(path.join(__dirname, "index.html"));
    res.render("pagini/index");
});

app.get("/despre", function(req, res){
    // res.sendFile(path.join(__dirname, "index.html"));
    res.render("pagini/despre");
});



app.get("/cale", function(req, res){
    console.log("Am primit o cerere GET pe /cale");
    res.send("<b style='color: red'>XD</b>"); //inchide automat conexiunea
});

app.get("/cale2", function(req, res){
    res.write("ceva"); // nu o inchide pana la .end()
    res.write("altceva");
    res.end();
});

app.get("/cale2/:a/:b", function(req, res){
    res.send(parseInt(req.params.a) + parseInt(req.params.b));
});


app.listen(8080);
console.log("Serverul a pornit!");