const https = require('https');


const callViewsApi = (ids, token, callback) =>{
    const api_url = `https://api.lbry.com/file/view_count?auth_token=${token}&claim_id=${ids.toString()}`;
    https.get(api_url, (resp) => {
        let data = '';

        resp.on('data', (chunk) => {
            data += chunk;
        });
        resp.on('end', () => {
            try {          
                let api_response = JSON.parse(data);
                callback(api_response);
            } catch(e){
                console.log(`There was an error parsing: ${e}`);
                console.log(data);
                callback(data);
            }
        });
    }).on("error", (err) => {
        callback(e);
        console.log("Error: " + err.message);
    });
}

module.exports = {
    getViewCount: callViewsApi
}