module.exports = async (params) => {

    var o_params = {
        word: 'home',
        url: 'https://fy.iciba.com/ajax.php?a=fy&f=en&t=zh&w=',
        type: 'sentence'
    }

    Object.assign(o_params, params);

    var o = [];

    const request = require('request');


    return new Promise((resolve, reject) => {
        request(o_params.url+encodeURI(o_params.word), (err, res, body) => {
            if(err){
                reject(err);
            }else{
                try{
                    let data = JSON.parse(res.body);
                    if(o_params.type == 'word'){
                        if(data.content.hasOwnProperty('word_mean')){
                            resolve(data.content.word_mean);
                        }else{
                            reject();
                        }
                    }else{
                        if(data.content.hasOwnProperty('out')){
                            resolve(data.content.out);
                        }else if(data.content.hasOwnProperty('word_mean')){
                            resolve(data.content.word_mean);
                        }else{
                            reject();
                        }
                    }
                }catch(e){
                    reject(e);
                }
                reject('other error..');
            }
        });
    });
}

