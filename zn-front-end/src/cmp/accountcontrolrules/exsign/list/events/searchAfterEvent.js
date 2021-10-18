/*VRi3nyqaeOPenSkOLNstN67Zi7jahgHbEqXb+H4sfAnBoRQn1JlIHIOB02i+1jyU*/
import { ajax,toast } from 'nc-lightapp-front';
//import { jsondata } from '../jsondata.js';
export default function searchAfterEvent(field, val) {
	// console.log(field, val);
	let tableId = 'pk_bankaccount_table';
    let pageId = '360701BACR_L01';
    let searchId = 'search';
    let that = this;
	if (field === 'pk_org') {
        let pk_org = val.refpk;
        // 为空则直接返回
        if (!pk_org) {
            return;
        }
        let data = {
            pk_org : pk_org
        };
        // this.refreshHtml();
        // 此处查询组织的建账日期
        ajax({
			url: '/nccloud/cmp/bankaccountbase/aftereventinfo.do',
			data: data,
			success: (result) => {
				
				if (result.success) {
					if (result.data) {
                        // let startdate = {value:data.startdate,display:data.startdate};
                        // that.props.search.setSearchValByField(searchId,'startdate',startdate);
                        console.log(result.data);
                       

                            let data = [Object.assign( {
                                "isleaf": false,
                                "key":"~",
                                "id":"~",
                                "innercode":"~",
                                "pid": "",
                                "refname": this.state.json['36070BACR-000034'],/* 国际化处理：银行账户*/
                                "refpk": "~"
                            }, {children : result.data} )];
                            //同步树  加载全部数据
                            that.props.syncTree.setSyncTreeData('tree' , this.dealTreeData(data));
                            // 展开节点  设置默认展开项
                            // this.props.syncTree.openNodeByPk(this.treeId, this.root.refpk);
                            // this.props.syncTree.setNodeSelected(this.treeId, result.data[0].refpk);
                        
					}
				}
			}
		});
    }
}

/*VRi3nyqaeOPenSkOLNstN67Zi7jahgHbEqXb+H4sfAnBoRQn1JlIHIOB02i+1jyU*/