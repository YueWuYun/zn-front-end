/*yY17CQWuPy5U3fvXlEmGMIoscfzPMsgzSLCuF1YV9L1vwtGG88+s/tT+ZZlOvm3w*/
import { ajax, toast,cacheTools } from 'nc-lightapp-front';
import {requesturl} from '../cons/requesturl.js';
//import { linkVoucherApp } from '../../../../tmpub/pub/util/LinkUtil.js'

export const calculateLink = function(props,type,appcode,pagecode,linkpath){
    let link_Data = props.table.getCheckedRows(this.tableId);
	let	    depositcode = link_Data[0].data.values.depositcode.value;
    let     pk_interest = link_Data[0].data.values.pk_interest.value;
    let     billnov = link_Data[0].data.values.vbillcode.value;
    let     pk_groupv = link_Data[0].data.values.pk_group.value;
	let		pk_orgv = link_Data[0].data.values.pk_org.value;
	let		pk_depositrate = link_Data[0].data.values.pk_depositrate.value;
	let		pk_aiacrate = link_Data[0].data.values.pk_aiacrate.value;
    //});
	
	if(type&&type==='fixrate'){
		if(!pk_depositrate){
			//toast({color:"warning",content:'定期利率为空，不能联查'}) 
			toast({color:"warning",content:this.state.json['36140FDIB-000012']}) 
            return;
        }
        rateLink.call(this,props,pk_depositrate);
    }else if(type&&type==='currrate'){
		if(!pk_aiacrate){
			//toast({color:"warning",content:'活期利率为空，不能联查'}) 
			toast({color:"warning",content:this.state.json['36140FDIB-000013']}) 
            return;
        }
		rateLink.call(this,props,pk_aiacrate);
	}else if(type&&type==='voucher'){
        linkVoucherApp.call(this,props,pk_interest,pk_groupv,pk_orgv,'36EJ',billnov);
    }else if(type&&type==='dereceipt'){
		if(!depositcode){
		   //toast({color:"warning",content:'存单为空，不能联查'}) 
		   toast({color:"warning",content:this.state.json['36140FDIB-000014']}) 
		   return;
	    }
        depositCodeLink.call(this,props,depositcode);
    }
}

//利率联查
export const rateLink = function(props,pk_rateCode){
    ajax({
        url: requesturl.ratelink, 
        data: {
            pk: pk_rateCode
        },
        success: (res) => {
            let linkpath,appcode,pagecode;
            if(res.data.rateclass=='2'){
                linkpath = '/tmpub/pub/interestrate_global/main/#/card',
                appcode = '36010IRC',
                pagecode = '36010IRC_card'
            }else if(res.data.rateclass=='1'){
                linkpath = '/tmpub/pub/interestrate_group/main/#/card',
                appcode = '36010IRCG',
                pagecode = '36010IRCG_card'
            }else if(res.data.rateclass=='0'){
                linkpath = '/tmpub/pub/interestrate_org/main/#/card',
                appcode = '36010IRCO',
                pagecode = '36010IRCO_card'
            }
            props.openTo(linkpath, {
                appcode: appcode,
                pagecode: pagecode,
				status: 'browse',
				scene: "linksce",
                //islinkquery: true,
                id:pk_rateCode
            });
        }
    });
}


/**
 * 联查存单
 * @param {*} props 
 * @param {*} pk_intobj 
 */
export const depositCodeLink = function(props,depositcode){
	if(!depositcode){
		toast({
			color: 'warning',
			content: this.state.json['36140FDIB-000009']//{/* 国际化处理： 未查询出符合条件的数据！*/}
		});
	} else {
		this.props.openTo('/ifac/factimedepositmanage/depositreceipt/main/index.html#/card', 
		{
			srcFunCode:'36140FDIB',
			appcode: '36140FDLB',
			pagecode: '36140FDLB_C01',
			status: 'browse',
			islinkquery: true,
			id:depositcode,
			scene: "linksce"
		});
	}
}



/** 凭证信息 */
const VOUCHER_INFO = {
	/**联查凭证 */
	LINK_VOUCHER: '_LinkVouchar2019',
	/**凭证预览 */
	PREVIEW_VOUCHER: '_Preview2019'
}

/**
 * 联查凭证小应用
 * @param {*} props 页面内置对象
 * @param {*} billID 单据主键
 * @param {*} pk_group 集团
 * @param {*} pk_org 组织
 * @param {*} billOrTransType 单据类型或交易类型
 * @param {*} billNO 单据编号
 */
export const linkVoucherApp = function (props, billID, pk_group, 
	pk_org, billOrTransType, billNO) {
	const base_url = '/nccloud/tmpub/pub/';
	const data = {
		pk_group, //集团主键
		pk_org, //组织主键
		relationID: billID, //单据主键
		pk_billtype: billOrTransType//单据类型或交易类型
	};
	ajax({
		url: base_url + 'qrylinkvoucherinfo.do',
		data,
		success: (res) => {
			let { success, data } = res;
			//判断是否有凭证数据
			if (!success || !data || !data.src || VOUCHER_INFO.LINK_VOUCHER != data.src || !data.pklist || data.pklist.length == 0) {
				toast({
					'color': 'warning',
					'content': this.state.json['36140FDIB-000015']
				});
				return;
			}
			let srcCode = data.src;
			let { url, pklist, appcode, pagecode, srcAppCode } = data;
			//走联查
			if (data.des) {//跳转到凭证界面
				//单笔
				if (pklist.length == 1) {
					props.openTo(url, {
						status: 'browse',
						appcode,
						pagecode,
						id: pklist[0],
						n: this.state.json['36140FDIB-000001'],
						pagekey: 'link',
						backflag: 'noback'
					});
				}
				//多笔
				else {
					//将主键信息存入缓存
					cacheTools.set("checkedData", pklist);
					props.openTo(res.data.url, {
						status: 'browse',
						appcode,
						pagecode,
						n: this.state.json['36140FDIB-000001']
					});
				}
			}else{//跳转到会计平台 这里的appcode是业务组的小应用编码 //majfd 添加逻辑，原缺失
				cacheTools.set(srcAppCode + srcCode, pklist);
				//打开凭证节点
				props.openTo(res.data.url, {
					status: 'browse',
					appcode,
					pagecode,
					scene: srcAppCode + srcCode,
				});
			}
		}
	});
};

/*yY17CQWuPy5U3fvXlEmGMIoscfzPMsgzSLCuF1YV9L1vwtGG88+s/tT+ZZlOvm3w*/