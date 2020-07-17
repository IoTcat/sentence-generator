const mksec = require(__dirname + '/index.js');


(async () => {
    console.log(await mksec({
        word: 'internt'
    }));
})()
