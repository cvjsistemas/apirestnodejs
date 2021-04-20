'use strict'


const express = require('express');
const mysql =require('mysql');
const app =express();
const cors= require('cors');

app.use(express.json());
app.use(cors());



//establecemos los parametros de conexion
const conexion =mysql.createConnection({
    host:'localhost',
    user:'root',
    password:'',
    database:'articulosdb'
})

//probamos la conexion
conexion.connect(function(error){
    if (error) {
        throw error;
    } else {
        console.log("conexion exitosa a la base de datos");
    }
});

app.get('/',(req,res)=>{
   return res.status(200).send({message:'Ruta inicio'});
});

//MOSTRAR TODOS LOS ARTICULOS
app.get('/api/articulos',(req,res)=>{
    conexion.query('SELECT * FROM articulos',(error,filas)=>{
        if (error) {
            throw error;
        } else{
            return res.status(200).send(filas);
        }
    });
});


//MOSTRAR 1 SOLO ARTICULO
app.get('/api/articulos/:id',(req,res)=>{
    conexion.query('SELECT * FROM articulos where id = ?',[req.params.id],(error,fila)=>{
        if (error) {
            throw error;
        } else{
            return res.status(200).send(fila);
        }
    });
});

//CREAR ARTICULO
app.post('/api/articulos',(req,res)=>{

let data = {descripcion:req.body.descripcion,
            precio:req.body.precio,
            stock:req.body.stock};

let sql = "INSERT INTO articulos SET ?" ;            

    conexion.query(sql,data,function(error, results){

        if (error) {
            throw error;
        } else{
            res.status(200).send(results);
        }

    })
});

// EDITAR ARTICULO
app.put('/api/articulos/:id',(req,res)=>{
    let id = req.params.id;
    let descripcion= req.body.descripcion;
    let precio= req.body.precio;
    let stock= req.body.stock;

    let sql = "UPDATE articulos SET descripcion = ?, precio = ? , stock = ? WHERE id = ?";
    conexion.query(sql, [descripcion,precio,stock,id],(error,results)=>{
        if (error) {
            throw error;
        } else{
            return res.status(200).send(results);
        }
        
    });

});

//ELIMINAR ARTICULO
app.delete('/api/articulos/:id',(req,res)=>{
    conexion.query('DELETE FROM articulos where id = ?',[req.params.id],(error,results)=>{

        if (error) {
            throw error;
        } else{
            return res.status(200).send(results);
        }

    });

});


const puerto = process.env.PUERTO || 3000;

app.listen(puerto,function(){
    console.log("Servidor OK" + puerto);
});

