/*pmFWCFu5nhKkBzYmrkBakcDmThTnhtmzEaAZvcUa3D6drQZ1Oah7lR52tc4RI/tG*/
import { ajax, base } from 'nc-lightapp-front';
import res from './template.json';
export default function(props) {
	//请求模板数据
	props.createUIDom({
		appcode: '105601LCFP',	   // 节点code 
		pagecode:  '105601LCFP_L' // 页面code
		// appid: ' ' //注册按钮的id
	},
	(data)=>{
		console.log('template',data.template);
		props.meta.setMeta(data.template);
	})

    // console.log('template',res.data);
    // props.meta.setMeta(res.data);
   
}




/*pmFWCFu5nhKkBzYmrkBakcDmThTnhtmzEaAZvcUa3D6drQZ1Oah7lR52tc4RI/tG*/