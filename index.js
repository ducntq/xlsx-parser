// stupid preparations
const filePath = '/home/ducntq/flc-hotels-db.xlsx';
const fs = require("fs");
const readXlsxFile = require('read-excel-file/node');
const mysql = require('mysql2/promise');

(async () => {
    console.log('🌈 let teh magik beg1n...');
    console.log('🍔 🍟 🍕 pr4parin shit & stuff');
    const mysqlConfig = {
        host: 'localhost',
        user: 'root',
        database: 'flcdata',
        password: 'tr41n1ng',
        waitForConnections: true,
        connectionLimit: 10,
        queueLimit: 0
    };
    const pool = await mysql.createPool(mysqlConfig);
    const sources = ['QN1', 'QN2', 'QN3', 'QN4', 'QN5', 'QN6', 'QN7', 'SS1', 'SS2', 'SS3', 'SS4', 'SS5'];
    for (let j = 0; j < sources.length; j++) {
        var source = sources[j];
        var stream = fs.createReadStream(filePath);
        var rows = await readXlsxFile(stream, { sheet: source });
        let total = rows.length;
        console.log(`Sheet: ${sources}; Got total: ${total}`);
        for (let i = 1; i < total; i++) {
            let params = rows[i];
            params[2] = params[2] == null ? 0 : params[2]; // night
            params[3] = params[3] == null ? '' : params[3]; // nationality
            params[4] = params[4] == null ? '' : params[4]; // phone
            params[5] = params[5] == null ? '' : params[5]; // email
            params[6] = params[6] == null ? '' : params[6]; // birthday
            params[7] = params[7] == null ? 0 : params[7]; // sort
            var query = `INSERT INTO hotel(name, company, night, nationality, phone, email, birthday, sort, source)
                                VALUES('${params[0]}', '${params[1]}', ${params[2]}, '${params[3]}', '${params[4]}', '${params[5]}', '${params[6]}', ${params[7]}, '${source}')`;

            console.log(`🚀 Inserting: ${i}/${total}`);
            var results;
            try {
                results = await pool.query(query, params);
            } catch (e) {
                console.error(e);
                console.log(params);
                console.log('🤬 Something went terribly wrong');
            }
        }
    }

    console.log('✌️ Done');
    process.exit(0);
})();
