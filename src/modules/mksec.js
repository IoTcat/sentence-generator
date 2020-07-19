module.exports = yargs => {

	const colors = require('colors');
	const boxen = require('boxen');
	const table = require('cli-table');
    const ora = require('ora');
	const mksec = require(__dirname+'/../index.js');
    const fs = require('fs');

	yargs = yargs
	.command('g', "mksec g".green + " Generate all sentence by word..", yargs => yargs, async argv => {
        argv._[1] = argv._[1].toLowerCase();
        let ban = ora(`Searching ${argv._[1]}...`).start(); 
		let arr = (await mksec({word: argv._[1]}));
        for(let i = 0; i < arr.length; i ++){
            let pos = arr[i].indexOf(argv._[1]);

            if(pos != -1){
                ban.succeed(arr[i].substring(0, pos) + String(argv._[1]).yellow + arr[i].substring(pos + String(argv._[1]).length));
                ban = new ora(`Searching ${argv._[1]}s...`).start();
            }
        }

        ban.succeed('Search finished!! Found '+arr.length+' results!!');

        //let o = arr[Math.floor((Math.random()*arr.length))];
       
	})
	.command('o', "mksec o".green + " Generate one sentence by word..", yargs => yargs, async argv => {
        argv._[1] = argv._[1].toLowerCase();
        let ban = ora(`Searching ${argv._[1]}...`).start(); 
		let arr = (await mksec({word: argv._[1]}));
        for(let i = 0; i < arr.length; i ++){
            let pos = arr[i].indexOf(argv._[1]);

            if(pos != -1){
                arr[i] = arr[i].substring(0, pos) + String(argv._[1]).yellow + arr[i].substring(pos + String(argv._[1]).length);
            }
        }

        ban.succeed(arr[Math.floor((Math.random()*arr.length))]);
       
	})

	.command('f', "mksec f".green + " Generate sentences file by word list file..", yargs => yargs, async argv => {

        let s = fs.readFileSync(argv._[1], 'utf-8');
        let o = '';
        let wArr = s.match(/\b[a-zA-Z]+\b/g);

        for(let index = 0; index < wArr.length; index ++){
            wArr[index] = wArr[index].toLowerCase();
            ban = new ora(`Searching ${wArr[index]}...`).start();
            try{
                let arr = (await mksec({word: wArr[index]})); 
                let sec = arr[Math.floor((Math.random()*arr.length))];

                sec = sec.replace(/’/g, "'");
                sec = sec.replace(/“/g, '"');
                sec = sec.replace(/”/g, '"');
                sec = sec.replace(/\"/g, '""');

                let res = wArr[index] + ',"' + sec + '"';

                o += res + '\n';

                fs.writeFileSync(argv._[1]+'.sentences.csv', o);
                ban.info('Found '+wArr[index]);
            }catch(e){
                ban.fail('Not found '+wArr[index]);
            }
        }


        ban.succeed('Generated '+wArr.length+' sentences in '+argv._[1]+'.sentences.csv'+'!!');
        
	})

	.command('r', "mksec r".green + " Check word list file with random order..", yargs => yargs, async argv => {

        let s = fs.readFileSync(argv._[1], 'utf-8');
        let wArr = s.match(/\b[a-zA-Z]+\b/g);
        wArr = wArr.sort(()=>Math.random() - 0.5);
        let count = 0;
        for(let index = 0; index < wArr.length; index ++){
            wArr[index] = wArr[index].toLowerCase();
            ban = new ora(`Searching ${wArr[index]}...`).start();
            try{
                let arr = (await mksec({word: wArr[index]})); 

                count++;
                ban.info('Found '+wArr[index]);
            }catch(e){
                ban.fail('Not found '+wArr[index]);
            }
        }


        ban.succeed('Found '+wArr.length+' words, verified '+ count +' words.');
        
	})









	return yargs;
}
