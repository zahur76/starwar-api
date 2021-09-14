const app = require('./settings.js');
// Database
const sqlite3 = require('sqlite3');
// open up the SQLite database in './db.sqlite'
const db = new sqlite3.Database('./character.db');
// used to delete image files
const fs = require('fs');
const multer  = require('multer');
const upload = multer({ dest: './assets/images'});

//Index page
app.get('/',function(req,res) {
    db.get("SELECT * FROM admin;", (error, row)=>{
        if(error){
            res.send(error)
        }else{                  
            db.all("SELECT * FROM characters;", (error, rows) => { 
                if(error){            
                    res.send(error)
                }else{ 
                    res.render('index', {query: rows, admin:row, faction: ""}); 
                }              
            });
        }
    })   
}); 

//Search Bar
app.post('/search',function(req,res) {
    db.get("SELECT * FROM admin;", (error, row)=>{
        if(error){
            res.send(error)
        }else{
            let queryName = '%' + (req.body.query).split(" ").join("").toLowerCase() + '%';    
            if(req.body.query){
                db.all("SELECT * FROM characters WHERE name_code LIKE $name;", {
                    $name: queryName
                }, (error, rows) => { 
                    if(error){            
                        res.send(error)
                    }else{ 
                        res.render('index', {query: rows, admin:row, faction: ""}); 
                    }              
                });
            }else{        
                res.redirect('/')
            } 
        }
    })    
})

//Drop down menu
app.post('/faction',function(req,res) {
    db.get("SELECT * FROM admin;", (error, row)=>{
        if(error){
            res.send(error)
        }else{
            console.log(req.body.faction)
            if(req.body.faction){
                db.all("SELECT * FROM characters WHERE faction=$faction;", {
                    $faction: req.body.faction
                }, (error, rows) => { 
                    if(error){            
                        res.send(error)
                    }else{                 
                        res.render('index', {query: rows, admin:row, faction: req.body.faction}); 
                    }              
                });
            }else{        
                res.redirect('/')
            }
        }
    })   
}) 
//Login
app.post('/login',function(req,res) {       
    db.get("SELECT * FROM admin;", (error, row)=>{
        if(error){
            res.send(error)
        }else{            
            if(req.body.username===row.name && req.body.password===row.password){
                db.all("SELECT * FROM characters;", (error, rows) => { 
                    if(error){            
                        res.send(error)
                    }else{ 
                        req.flash('info', 'Login Successful!');                        
                        sess = req.session;   
                        sess.username= row.name;  
                        sess.password= row.password;                                       
                        res.redirect('/')
                    }              
                });
            }else{  
                req.flash('info', 'Incorrect username/password!');                               
                res.redirect('/')
            }          
        }
    })    
}); 

//Logout
app.get('/logout',function(req,res) {    
    db.get("SELECT * FROM admin;", (error, row)=>{
        if(error){
            res.send(error)
        }else{                      
            db.all("SELECT * FROM characters;", (error, rows) => { 
                if(error){            
                    res.send(error)
                }else{  
                    sess = req.session;   
                    sess.username= null;  
                    sess.password= null;                
                    req.flash('info', 'Logout Successful!'); 
                    res.redirect('/')
                }              
            });
        }
    })    
}); 

// Admin
app.get('/admin',function(req,res) {     
    if(!sess.username){
        req.flash('info', 'Illegal operation!'); 
        res.redirect('/')
    }else{        
        res.render('admin'); 
    }  
}); 

// Add character profile
app.post('/admin/add_profile', upload.fields([
    {name: "profile_image", maxCount: 1},
    {name: "info"}
    ]), function(req,res) { 
        let testName = (req.body.fullname).split(" ").join("").toLowerCase();
        db.get("SELECT * FROM characters WHERE name_code=($testname);", {
            $testname: testName
        }, (errors, row)=>{
            if(row){
                req.flash('info', 'Profile already Exists!'); 
                res.redirect('/')                                
            }else{
                if(req.files.profile_image){
                    let reqPath = (req.files.profile_image[0].path).split('assets\\');                 
                    db.run("INSERT INTO characters (image, name, gender, birth_year, faction, name_code) VALUES ($image, $name, $gender, $birth, $faction, $code);", {
                        $image: reqPath[1],
                        $name: req.body.fullname,
                        $gender: req.body.gender,
                        $birth: req.body.year,
                        $faction: req.body.faction,
                        $code: (req.body.fullname).split(" ").join("").toLowerCase()
                    })

                }else{
                    db.run("INSERT INTO characters (name, gender, birth_year, faction, name_code) VALUES ($name, $gender, $birth, $faction, $code);", {
                        $name: req.body.fullname,
                        $gender: req.body.gender,
                        $birth: req.body.year,
                        $faction: req.body.faction,
                        $code: (req.body.fullname).split(" ").join("").toLowerCase()
                    })
                }
                
                req.flash('info', 'Profile added!'); 
                res.redirect('/')                
            }           
        })        
})

app.get('/delete/:id',function(req,res) {
    if(!sess.username){
        req.flash('info', 'Illegal operation!'); 
        res.redirect('/')
    }else{
        db.get("SELECT * FROM characters WHERE id=($charId);", {
            $charId: req.params.id
        }, (error, row)=>{            
            if(error){
                res.send(error)
            }else{
                console.log(`assets\\${row.image}`)
                fs.unlinkSync(`assets\\${row.image}`);
                db.run("DELETE FROM characters WHERE id=($charId);", {
                    $charId: req.params.id
                }, (error)=>{
                    console.log(req.params.id)
                    if(error){
                        res.send(error)
                    }else{
                        req.flash('info', 'Profile removed!'); 
                        res.redirect('/')
                    }
                })  
            }
        })
    }          
})

//GET request for updating character profile
app.get('/update/:id',function(req,res) {
    if(!sess.username){
        req.flash('info', 'Illegal operation!'); 
        res.redirect('/')
    }else{ 
        db.get("SELECT * FROM characters WHERE id=($charId);", {
            $charId: req.params.id
        }, (error, row)=>{            
            if(error){
                res.send(error)
            }else{
                res.render('update-profile', {query: row}); 
            }
        })       
    }
})

//POST request for updating character profile
app.post('/update/:id', upload.fields([
    {name: "profile_image", maxCount: 1},
    {name: "info"}
    ]), function(req,res) {
        if(req.files.profile_image){
            let reqPath = (req.files.profile_image[0].path).split('assets\\');       
            db.run("UPDATE characters SET image=$image, name=$name, gender=$gender, birth_year=$birth, faction=$faction, name_code=$code WHERE id=$charId;", {
                $charId: req.params.id,
                $image: reqPath[1],
                $name: req.body.fullname,
                $gender: req.body.gender,
                $birth: req.body.year,
                $faction: req.body.faction,
                $code: (req.body.fullname).split(" ").join("").toLowerCase()
            })
        }else{
            db.run("UPDATE characters SET name=$name, gender=$gender, birth_year=$birth, faction=$faction, name_code=$code WHERE id=$charId;", {
                $charId: req.params.id,                
                $name: req.body.fullname,
                $gender: req.body.gender,
                $birth: req.body.year,
                $faction: req.body.faction,
                $code: (req.body.fullname).split(" ").join("").toLowerCase()
            })
    }        
        
    req.flash('info', 'Profile Updated!'); 
    res.redirect('/')
})

//Server
var server = app.listen(process.env.PORT, function() {
    console.log(process.env.PORT)
    console.log('App listening on port 3001!');
});