# sentence-generator

## Quick Start

### cli tools

```sh
$ npm i -g mksec
```

### Use in your project

```sh
$ npm i mksec
```

## cli


### Generate sentences by word
```sh
$ mksec g [word]
```

### Generate one sentence by word
```sh
$ mksec o [word]
```

### Generate sentences by word list file
```sh
$ mksec f [file]
```


## Use as lib

```js
const mksec = require('mksec');

(async ()=>{
  console.log(await mksec({
    word: 'Your word',
    //url: 'optional api url'
  }));
})()
```


