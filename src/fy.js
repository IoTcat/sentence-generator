module.exports = async (params) => {

    var o_params = {
        word: 'home',
        url: 'http://translate.google.com/translate_a/single?client=at&sl=en&tl=zh-CN&dt=t&q=',
        type: 'sentence'
    }

    Object.assign(o_params, params);

    var o = [];

    const request = require('request');


    return new Promise((resolve, reject) => {
        request('https://proxy.yimian.xyz/get/?url='+ Buffer.from(o_params.url+encodeURI(o_params.word), 'utf-8').toString('base64'), (err, res, body) => {
            if(err){
                reject(err);
            }else{
                try{
                    let data = JSON.parse(res.body);
                    if(o_params.type == 'word'){
                        if(true || data.content.hasOwnProperty('word_mean')){
                            resolve(data[0][0][0]);
                        }else{
                            reject();
                        }
                    }else{
                        if(true || data.content.hasOwnProperty('out')){
                            resolve(data[0][0][0]);
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

