//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65
import { high } from 'nc-lightapp-front';
const { Refer } = high;

export default function (props = {}) {
	var conf = {
		multiLang: { 
			domainName: 'uapbd',
			currentLocale: 'zh-CN',
			moduleId: '10140MMREFER', //多语文件名
		},

		refType: 'grid',
		refName: 'teamrefer-000001',
		placeholder: 'teamrefer-000001',
		refCode: 'mmbd.pub.TeamGridRef',
		queryGridUrl: '/nccloud/mmbd/refer/TeamGridRef.do',//后台服务地址
		isMultiSelectedEnabled: false,
		isShowUnit: false,
		columnConfig: [
            {
                name: [ 'teamrefer-000002', 'teamrefer-000003' ],
                code: [ 'refcode', 'refname' ]
            }
        ]
	};
	return <Refer {...conf} {...props} />
}
//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65