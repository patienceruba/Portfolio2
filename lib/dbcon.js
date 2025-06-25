import mysql from "mysql2/promise";

let con;
export const createConnection= async()=>{
    if(!con){
        con =await mysql.createConnection({
            host:process.env.DB_HOST||"sql.freedb.tech",
            user:process.env.DB_USER||"freedb_portfolio",
            password:process.env.DB_PASS||"tXjcG44!f$ycS9s",
            database:process.env.DB_NAME||"freedb_mysql12",
            port:process.env.PORT||3306
            
        })
    }
    return con;
}

// let connection;
// export const createConnection= async()=>{
//     if(!connection){
//         connection = await mysql.createConnection({
//             host: process.env.DB_HOST || "localhost",
//             user: process.env.DB_USER || "mysql",
//             password: process.env.DB_PASSWORD || "star12@!",
//             database: process.env.DB_NAME || "portfolio",
//         });
//     }
//     return connection;
// }
