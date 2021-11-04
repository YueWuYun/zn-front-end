//pK0agd1AIynUs/7WIwlNtyAcGeluXC8vPTqdcNBKH378kNdgn+BgvSxd/YO8ET6D
import { high } from 'nc-lightapp-front';

const { Refer } = high;

export default function (props = {}) {
	var conf = {
		multiLang: {
			domainName: 'uapbd',
			currentLocale: 'zh-CN',
			moduleId: 'refer_uapbd',
		},
		refType: 'grid',
		refName: '参数代码',
        placeholder: '参数代码',
		refCode: 'uapbd.refer.param.ParamGridRef',
		queryGridUrl: '/nccloud/uapbd/param/ParamGridRef.do',
		isMultiSelectedEnabled: false,
		columnConfig: [{name: [ '所属模块','参数代码','参数名称'],code: [ 'domainflag', 'initcode', 'initname' ]}]/* 国际化处理：*/
	};

	return <Refer {...Object.assign(conf, props)} />
}

//pK0agd1AIynUs/7WIwlNtyAcGeluXC8vPTqdcNBKH378kNdgn+BgvSxd/YO8ET6D