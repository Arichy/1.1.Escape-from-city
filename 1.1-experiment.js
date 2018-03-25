//从数组中等概率随机返回一个元素
Array.prototype.getRand = function(){
	return this[Math.floor(Math.random()*this.length)];
};
//从数组中删除一个元素(对象为删除引用)
Array.prototype.deleteItem = function(item){
	this.splice(this.indexOf(item),1);
};
//计算一个数字数组元素的平均值
Array.prototype.average = function(){
	if(this.length>0){
		return this.reduce((a,b)=>a+b)/this.length;
	} else{
		return 0;
	}
};

//将setTimeout Promisify，配合async函数
function setTimeoutPromise(timeout,data){
	return new Promise((resolve,reject)=>{
		setTimeout(()=>{
			try{
				resolve(data);
			} catch(err){
				reject(err);
			}
		},timeout||0);
	});
}

//城市类，用图表示
class Graph{
	constructor(n,e){
		this.n = n;//n为输入的N
		this.e = e;//e无用
		this.verArr = [];//点，也就是路口，的数组
		this.startIndex = -1;//起点位置初始化为-1
		this.nowIndex = -1;//当前位置初始化为-1
		this.nowVer = null;//当前路口初始化为null
		this.pathLength = 0;//当前路径长度初始化为0
	}

	//初始化方法
	init(){
		this.verArr.length = 0;
		this.nowIndex = -1;
		this.nowVer = null;
		this.pathLength = 0;

		//初始化节点加入的顺序：上 下 左 右
		let n = this.n;

		//初始化所有的节点，并加入横坐标和纵坐标
		for(let i=0;i<this.n;i++){
			for(let j=0;j<this.n;j++){
				this.verArr.push({x:i,y:j,adjArr:[]});
			}
		}

		//将刚好逃离城市的第一圈节点加入
		for(let j=0;j<4;j++){
			for(let i=0;i<this.n;i++){
				switch(j){
					case 0: this.verArr.push({x:-1,y:i,adjArr:[],out:true});	break;
					case 1: this.verArr.push({x:n,y:i,adjArr:[],out:true});	break;
					case 2: this.verArr.push({x:i,y:-1,adjArr:[],out:true});	break;
					case 3: this.verArr.push({x:i,y:n,adjArr:[],out:true});	break;
				}
			}
		}

		if(n>=3){
			//加入邻接表的顺序：上 下 左 右
			for(let i=0;i<this.verArr.length;i++){
				let vertex = this.verArr[i];
				let {x,y} = vertex;

				//中间部分
				if(x>=1 && x<=n-2 && y>=1 && y<=n-2){
					vertex.adjArr.push(this.verArr[i-n],this.verArr[i+n],this.verArr[i-1],this.verArr[i+1]);
				}
				//城市内部最外围的一圈去掉四个角的左边
				else if(x>=1 && x<=n-2 && y==0){
					vertex.adjArr.push(this.verArr[i-n],this.verArr[i+n],this.verArr[n*n+n*2+x],this.verArr[i+1]);
				}

				//城市内部最外围的一圈去掉四个角的右边
				else if(x>=1 && x<=n-2 && y==n-1){
					vertex.adjArr.push(this.verArr[i-n],this.verArr[i+n],this.verArr[i-1],this.verArr[n*n+n*3+x]);
				}

				//城市内部最外围的一圈去掉四个角的上边
				else if(y>=1 && y<=n-2 && x==0){
					vertex.adjArr.push(this.verArr[n*n+y],this.verArr[i+n],this.verArr[i-1],this.verArr[i+1]);
				}

				//城市内部最外围的一圈去掉四个角的下边
				else if(y>=1 && y<=n-2 && x==n-1){
					vertex.adjArr.push(this.verArr[i-n],this.verArr[n*n+n+y],this.verArr[i-1],this.verArr[i+1]);
				}

				//城市内部最外层的左上角
				else if(x==0 && y==0){
					vertex.adjArr.push(this.verArr[n*n],this.verArr[n],this.verArr[n*n+n*2],this.verArr[1]);
				}
				//右上角
				else if(x==0 && y==n-1){
					vertex.adjArr.push(this.verArr[n*n+n-1],this.verArr[i+n],this.verArr[n-2],this.verArr[n*n+n*3]);
				}
				//右下角
				else if(x==n-1 && y==n-1){
					vertex.adjArr.push(this.verArr[i-n],this.verArr[i+n*2],this.verArr[i-1],this.verArr[i+n*4]);
				}
				//左下角
				else if(x==n-1 && y==0){
					vertex.adjArr.push(this.verArr[i-n],this.verArr[i+n*2],this.verArr[n*n+3*n-1],this.verArr[i+1]);
				}

				//城市外一圈的上面
				else if(x==-1){
					vertex.adjArr.push(this.verArr[y]);
				}
				//下面
				else if(x==n){
					vertex.adjArr.push(this.verArr[i-n*2]);
				}
				//左边
				else if(y==-1){
					vertex.adjArr.push(this.verArr[n*x]);
				}
				else if(y==n){
					vertex.adjArr.push(this.verArr[n-1+n*x]);
				}
			}//end for
		}//end if(n>=3)

		//单独处理n=2和n=1的情况
		else if(n==2){
			this.verArr[0].adjArr.push(this.verArr[4],this.verArr[2],this.verArr[8],this.verArr[1]);
			this.verArr[1].adjArr.push(this.verArr[5],this.verArr[3],this.verArr[0],this.verArr[10]);
			this.verArr[2].adjArr.push(this.verArr[0],this.verArr[6],this.verArr[9],this.verArr[3]);
			this.verArr[3].adjArr.push(this.verArr[1],this.verArr[7],this.verArr[2],this.verArr[11]);
			this.verArr[4].adjArr.push(this.verArr[0]);
			this.verArr[5].adjArr.push(this.verArr[1]);
			this.verArr[6].adjArr.push(this.verArr[2]);
			this.verArr[7].adjArr.push(this.verArr[3]);
			this.verArr[8].adjArr.push(this.verArr[0]);
			this.verArr[9].adjArr.push(this.verArr[2]);
			this.verArr[10].adjArr.push(this.verArr[1]);
			this.verArr[11].adjArr.push(this.verArr[3]);
		}
		else if(n==1){
			this.verArr[0].adjArr.push(this.verArr[1],this.verArr[2],this.verArr[3],this.verArr[4]);
			this.verArr[1].adjArr.push(this.verArr[0]);
			this.verArr[2].adjArr.push(this.verArr[0]);
			this.verArr[3].adjArr.push(this.verArr[0]);
			this.verArr[4].adjArr.push(this.verArr[0]);
		}

		//狗的起始位置
		let startX = Math.floor(n/2);
		let startY = startX;
		let startIndex = this.toIndex(startX,startY);
		this.startIndex = startIndex;
		this.nowIndex = this.startIndex;
		this.nowVer = this.verArr[this.nowIndex];
	}

	//打印城市的路口信息
	print(){
		for(let node of this.verArr){
			for(let {x,y} of node.adjArr){
				console.log(x,y);
			}
			console.log();		
		}
		console.log(`一共有${this.verArr.length}个节点`);
	}

	//将二维坐标转换成数组的一维索引
	toIndex(x,y){
		let n = this.n;
		if(x>=0 && x<=n-1 && y>=0 && y<=n-1){
			return x*n+y;
		}
		else if(x==-1){
			return n*n+y;
		}
		else if(x==n){
			return n*n+n+y;
		}
		else if(y==-1){
			return n*n+n*2+x;
		}
		else if(y==n){
			return n*n+n*3+x;
		}
	}

	//开始运动
	move(){
		//获得当前所在的路口对象
		let nowVer = this.nowVer;
		
		//随机走一个路口
		let nextVer = nowVer.adjArr.getRand();
		this.pathLength++;

		//如果已经走出去了
		if(nextVer.out===true){
			return true;
		} 

		//还没走出去：继续走
		else{
			//断开上述两个路口之间的指针，防止走重复路
			nowVer.adjArr.deleteItem(nextVer);
			nextVer.adjArr.deleteItem(nowVer);

			//已经无路可走
			if(nextVer.adjArr.length==0){
				return false;
			} 
			//还有路可走，递归继续走
			else{
				this.nowVer = nextVer;
				return this.move();
			}
		}
		
	}

}

async function calculate(N,tryTime){
	N = N||50;//如果没提供N，默认为50
	let city = new Graph(N);//实例化city
	tryTime = tryTime || 10000;//如果没提供实验次数，默认为10000

	let [successCount,failCount] = [0,0];//successCount为成功次数，failCount为失败次数
	let successPathLengthArr = [];//每次成功的路径长度数组
	let failPathLengthArr = [];//每次失败的路径长度数组

	let tryTimeCopy = tryTime;//复制一份实验次数，用于后面优化

	await (	async function f(){
		let tickTime = 1000;//每轮的实验次数最大值

		let tick = tryTimeCopy>=tickTime?tickTime:tryTimeCopy;//判断当前剩余的需要执行的实验次数是否大于最大值

		//开始执行tick次实验
		for(let i=0;i<tick;i++){
			city.init();
			if(city.move()){
				successCount++;
				successPathLengthArr.push(city.pathLength);
			} else{
				failCount++;
				failPathLengthArr.push(city.pathLength);
			}
		}

		//剩余实验次数-本轮执行的次数
		tryTimeCopy-=tickTime;

		//如果剩余实验次数>=0，开启下一轮计算
		if(tryTimeCopy>=0){
			await setTimeoutPromise(0);
			await f();
		}
		
	})();
	
	return [successCount,failCount,(successCount/tryTime).toFixed(4),(failCount/tryTime).toFixed(4),successPathLengthArr.concat(failPathLengthArr).average().toFixed(4),successPathLengthArr.average().toFixed(4),failPathLengthArr.average().toFixed(4)];
}