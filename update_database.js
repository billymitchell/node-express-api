// import mondo db
const { MongoClient, ServerApiVersion } = require('mongodb');

// submit data to DB function
async function update_database(request_history) {

    // mongo db database url
    const uri = `mongodb+srv://billymitchell:${process.env.MONGO_DB_PW}@centricity-shipping-api.ww7gdwo.mongodb.net/?retryWrites=true&w=majority&appName=centricity-shipping-api-log`
    // initialize mongo db 
    const client = new MongoClient(uri)
    

    // try to connect 
    try {
        await client.connect();
        //await listDatabases(client)

        // post data to database
        await createData(client, request_history)
    } 
    // catch connection error
    catch (error){
        console.log(error)
        // TODO: send email of error to admin
    }
    // close connection 
    finally {
        await client.close();
    }

    async function createData(client, request_history) {
        const result = await client.db("centricity-shipping-api-log").collection("logs").insertOne(request_history)
        console.log(`New listing created with the following id: ${result.insertedId}`)
    }

}

module.exports = {
    update_database
}