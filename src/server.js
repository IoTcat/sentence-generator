const mksec = require(__dirname+'/index.js');
const fy = require(__dirname+'/fy.js');
const app = require('express')();
const md5 = require('md5');
const bodyParser = require('body-parser');
const fs = require('fs');

port = 3000;
data_folder = __dirname+'/data/'


app.listen(port, () => console.log(`mksec-server listening at http://localhost:${port}`));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(require('express').static(__dirname+'/public'));

app.get('/mksec/', async (req, res) => {

    let arr = await mksec({
        word: req.query.word
    });

    res.send(arr[Math.floor((Math.random()*arr.length))]);

});

app.get('/fy/', async (req, res) => {

    let arr = await fy({
        word: req.query.word
    });
    res.send(arr);

});


app.post('/publish/', async (req, res) => {

    if(req.body.hasOwnProperty('email') && req.body.hasOwnProperty('data')){
        let hash = md5(req.body.email); 
        let data = JSON.parse(req.body.data);
        let path = data_folder + hash + '.json';

        let o = [];
        if(fs.existsSync(path)){
            o = JSON.parse(fs.readFileSync(path, 'utf-8'));
        }

        let oldNum = o.length;

        for(let i = 0; i < data.length; i ++){
            if(!o.find(item => {
                return item.word == data[i];
            })){
                o.push({
                    word: data[i],
                    level: 0
                });
            }
        }

        fs.writeFileSync(path, JSON.stringify(o));

        res.send({
            code: 200,
            message: 'Added '+(o.length - oldNum)+' new words. Totally '+(o.length)+' words.'
        });
        return;
    }

    res.send({
        code: 500,
        message: 'Illegal email or data format!!'
    });
});





app.get('/getData/', async (req, res) => {
    if(req.query.hasOwnProperty('email')){
        
        let hash = md5(req.query.email);
        let path = data_folder + hash + '.json';

        if(!fs.existsSync(path)){
            res.send({
                code: 404,
                message: 'No such user!!'
            });
            return;
        }
        let data = JSON.parse(fs.readFileSync(path, 'utf-8'));

        data = data.sort(() =>Math.random() - 0.5);
        data = data.sort((o1, o2) => {
                return o1['level'] - o2['level'];
        });


        let arr = [];
        for(let i = 0; i < data.length; i ++){
            arr.push(data[i].word);
        }

        res.send({
            code: 200,
            message: 'Get data successfully!',
            data: arr
        });

        return;
    }
    res.send({
        code: 500,
        message: 'Illegal email params!!'
    });
});



app.get('/upgrade/', async (req, res) => {
    if(req.query.hasOwnProperty('email') && req.query.hasOwnProperty('word')){
         
        let hash = md5(req.query.email);
        let path = data_folder + hash + '.json';

        if(!fs.existsSync(path)){
            res.send({
                code: 404,
                message: 'No such user!!'
            });
            return;
        }
        let data = JSON.parse(fs.readFileSync(path, 'utf-8'));
        
        for(let i = 0; i < data.length; i ++){
            if(data[i].word == req.query.word){
                data[i]['level'] ++;

                fs.writeFileSync(path, JSON.stringify(data));

                res.send({
                    code: 200,
                    message: 'Upgrade successfully!!'
                });
                return;
            }
        }
        res.send({
                code: 400,
                message: 'No such word!!'
            });
        return;
       
    }

    res.send({
        code: 500,
        message: 'Illegal params!!'
    });
});





app.get('/getInfo/', async (req, res) => {
    if(req.query.hasOwnProperty('email') && req.query.hasOwnProperty('word')){
         
        let hash = md5(req.query.email);
        let path = data_folder + hash + '.json';

        if(!fs.existsSync(path)){
            res.send({
                code: 404,
                message: 'No such user!!'
            });
            return;
        }
        let data = JSON.parse(fs.readFileSync(path, 'utf-8'));
        
        for(let i = 0; i < data.length; i ++){
            if(data[i].word == req.query.word){

                fs.writeFileSync(path, JSON.stringify(data));

                res.send({
                    code: 200,
                    message: 'Info found successfully!!',
                    data: data[i].level
                });
                return;
            }
        }
        res.send({
                code: 400,
                message: 'No such word!!'
            });
        return;
       
    }

    res.send({
        code: 500,
        message: 'Illegal params!!'
    });
});
