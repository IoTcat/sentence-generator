module.exports = () => {

	var o = {
		__: (c, w, s) => {
			var data = conf.get(c);
			if(typeof s != "undefined"){
				data[w] = s;
				conf.set(c, data);
			}
			return data[w];
		},
		//config
		config: {
			email: s => o.__('config', 'email', s),
			remote: s => o.__('config', 'remote', s)
		}
	};

	const conf = new (require('conf'))({
		projectName: 'mksec',
		config: {
			type: "object",
			default: {
				email: '',
				remote: "https://mksec.yimian.xyz/publish/"
			}
		}
	});

	if(conf.get('config') == undefined) conf.set('config', {
		email: '',
		remote: "https://mksec.yimian.xyz/publish/"
	});

	return o;
}
