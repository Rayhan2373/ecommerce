const express = require("express");
const { MongoClient, ServerApiVersion } = require('mongodb');
const dotenv = require("dotenv")
const cors = require("cors")
dotenv.config()
const PORT = process.env.PORT || 8000;
const app = express()
app.use(cors())
app.use(express.json())
const uri = "mongodb+srv://Person:rPfGvIfRjbAu2TXk@cluster0.iuinxk2.mongodb.net/?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
async function run()
{
    try {
        await client.connect();
        const productCollection = client.db("Products").collection("Product");
        app.get('/products', async(req, res)=>{
            const page = parseInt( req.query.page);
            const size = parseInt( req.query.size);
            const query = {};
            const cursor = productCollection.find(query);
            let products;
            if(page){
                products = await cursor.skip(page).limit(size).toArray();
            }
            else{
                products = await cursor.toArray()
            }
            res.send(products)
        })
        app.get('/productCount', async(req, res)=>{
            const query ={};
            const cursor = productCollection.find(query);
            const count = await cursor.count();
            res.send({count})
        })

    } finally{
        //await client.close();
    }
}
app.get('/',(req, res)=>{
    res.send("Successfully")
})
run().catch(console.dir)
app.listen(PORT , ()=>{
    console.log("Successfully server start at ", PORT)
})


