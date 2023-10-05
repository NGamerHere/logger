import mongoose from "mongoose";

function DBConnector(url){

    mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true }).then(() => console.log('Connected!'))
            .catch((error)=>{console.log("there  was error in connecting the mongodb: "+error)});

}
export default DBConnector;