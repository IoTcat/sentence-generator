module.exports = async (params) => {

    var o_params = {
        word: 'home',
        url: 'https://corpus.vocabulary.com/api/1.0/examples.json?query='
    }

    Object.assign(o_params, params);

    var o = [];

    const request = require('request');


    return new Promise((resolve, reject) => {
        request(o_params.url+o_params.word, (err, res, body) => {
            if(err){
                reject(err);
            }else{
                try{

                    let data = JSON.parse(res.body);
                    let o = [];
                    if(!data.result.totalHits){
                        reject();
                    }
                    data.result.sentences.forEach((item, index) => {
                        o.push(item.sentence+'   --'+item.volume.corpus.name);
                        if(index == data.result.sentences.length - 1){
                            resolve(o);
                        }
                    });
                }catch(e){
                    reject(e);
                }
                reject('other error..');
            }
        });
    });
}

