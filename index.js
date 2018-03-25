let vm = new Vue({
	el:'#app',
	data:{
		title:'2.1.	自回避随机行走问题',
		flag:false,
		errMsg:'',
		errSeen:false,
		input:'',
		tryTime:'',
		resultArr:[
		{
			question:`x次实验中，陷入死胡同的次数为:`,
			answer:''
		},
		{
			question:'陷入死胡同的概率:',
			answer:''
		},
		{
			question:'行走路径的平均长度:',
			answer:''
		},
		{
			question:'成功逃出的平均路径长度:',
			answer:''
		},
		{
			question:'陷入死胡同的平均路径长度:',
			answer:''
		}
		]
	},
	methods:{
		async cal(input,tryTime){
			this.flag = true;



			if(!Number.isInteger(parseFloat(input)) || !Number.isInteger(parseFloat(tryTime)) || parseFloat(input)<=0 || parseFloat(tryTime)<=0 ){
				alert('请输入正整数！');
				this.flag = false;
				return false;
			}

			if(Number(input)>=100 || tryTime>=20000){
				alert('请不要输入过大的整数！');
				this.flag = false;
				return false;
			}

			for(let x of this.resultArr){
				x.answer = '正在计算...';
			}

			await setTimeoutPromise(100);

			const result = await calculate(Number(input),Number(tryTime));
			console.log(`做了${tryTime}次实验，成功次数、失败次数、成功率、失败率、行走路径的平均长度、成功的平均路径长度、失败的平均路径长度为${result}`);
			
			this.resultArr[0].answer = result[1];
			this.resultArr[1].answer = result[3];
			this.resultArr[2].answer = result[4];
			this.resultArr[3].answer = result[5];
			this.resultArr[4].answer = result[6];

			await setTimeoutPromise(100);
			this.flag = false;
		}
	}
});

