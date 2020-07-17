module.exports = (yargs) => {
	var o = {
		push: (arr) => {
			let ban = ora(`Pushing...`).start();
            if(!data.config.email()){
                ban.fail('Empty Email!! Please use   mksec config -e [email]   first!!');
                return;
            }
			request.post(data.config.remote()+'/publish/', {
				form:{
					action: 'push',
					email: data.config.email(),
					data: JSON.stringify(arr)
				}	
			}, (err, res, body) => {
				if(err){
					ban.fail('Push data failed with errors!!');
				}else{
					let s = JSON.parse(res.body);
					if(s.code == '200'){
						ban.succeed(s.message);
					}else{
						ban.fail(s.message);
					}
					
					
				}
				process.exit();
			});
		}
	}

	const request = require('request');
	const ora = require('ora');
	var data = require(__dirname + '/../utilities/data.js')();
	const fs = require('fs');
	const mksec = require(__dirname+'/../index.js');

	yargs = yargs
	.command('push', "mksec push".green + " Push new words to remote..", yargs => yargs, async argv => {
		let s = fs.readFileSync(argv._[1], 'utf-8');
		let wArr = s.match(/\b[a-zA-Z]+\b/g);
		let oArr = [];
		for(let index = 0; index < wArr.length; index ++){
            wArr[index] = wArr[index].toLowerCase();
            ban = new ora(`Checking ${wArr[index]}...`).start();
            try{
                let arr = (await mksec({word: wArr[index]})); 
                oArr.push(wArr[index]);
                ban.info('Found '+wArr[index]);
            }catch(e){
                ban.fail('Not found '+wArr[index]);
            }
        }

		o.push(oArr);
	})
	.command('pull', "mksec pull".green + " Pull all words from remote in csv..", yargs => yargs, async argv => {
            ban = new ora(`Downloading...`).start();
               
            request(data.config.remote()+'/getData/?email='+data.config.email(), (err, res, body) => {
                if(err){
                    ban.fail('Download failed!');
                    return;
                }
                let s = JSON.parse(res.body);
                if(s.code == '200'){
                    if(!argv._[1]) argv._[1] = 'download.csv'
                    fs.writeFileSync(argv._[1], s.data.join('\n'));
                    ban.succeed('Downloaded '+s.data.length+' words in file '+argv._[1]+'!!');
                }else{
                    ban.fail(s.message);
                }
	
            })

	})


	return yargs;
}
