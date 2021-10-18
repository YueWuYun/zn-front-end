/*yY17CQWuPy5U3fvXlEmGMIoscfzPMsgzSLCuF1YV9L1vwtGG88+s/tT+ZZlOvm3w*/
import { ajax, toast,cacheTools } from 'nc-lightapp-front';
import {requesturl} from '../cons/requesturl.js';
//import { linkVoucherApp } from '../../../../tmpub/pub/util/LinkUtil.js'

export const calculateLink = function(props,type,appcode,pagecode,linkpath){
    let link_Data = props.table.getCheckedRows(this.tableId);

    let pk_rateCode,pk, pk_intlist,billnov,pk_groupv,pk_orgv,pk_intobjv,beg_date,end_date,intmode
    link_Data.forEach((val) => {
			//pk_rateCode = val.data.values.ratecode.value;
            pk_intlist = val.data.values.pk_intlist.value;
            billnov = val.data.values.vbillno.value;
            pk_groupv = val.data.values.pk_group.value;
			pk_orgv = val.data.values.pk_org.value;
			pk_intobjv = val.data.values.pk_intobj.value;
			beg_date = val.data.values.begdate.value;
			end_date = val.data.values.enddate.value;
			intmode = val.data.values.intmode.value;
    });
	
	if(type&&type==='rate'){
        rateLink.call(this,props,pk_rateCode);
    }else if(type&&type==='voucher'){
        linkVoucherApp.call(this,props,pk_intlist,pk_groupv,pk_orgv,'36LD',billnov);
    }else if(type&&type==='amount'){
        amountLink.call(this,props,beg_date,end_date,pk_intobjv,intmode);
    }else if(type&&type==='interestobj'){
        intObjLink.call(this,props,pk_intobjv);
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
 * 联查积数
 * @param {*} props 
 * @param {*} url 
 * @param {*} pk 
 * @param {*} pk_org 
 */
export const amountLink = function(props,beg_date,end_date,pk_intobj,intmode){
  
    let linkpath = '/ifac/ifacinterestdeal/adjustamount/main/#/card'
    props.openTo(linkpath, {
        appcode: '36340BAA',
        pagecode: '36340BAA_C01',
        islinkquery: true,
        beg_date:beg_date,
        end_date:end_date,
        pk_intobj:pk_intobj,
		intmode:intmode
    });
}

/**
 * 联查计息对象
 * @param {*} props 
 * @param {*} pk_intobj 
 */
export const intObjLink = function(props,pk_intobj){
	let linkpath = '/ifac/ifacdemanddepositset/interestobj/main/#/card'
	ajax({
        url: requesturl.queryintobj, 
        data: {
            pk: pk_intobj
        },
        success: (res) => {
            if(res.data){
                props.openTo(linkpath, {
					appcode: '36340AIAC',
					pagecode: '36340AIAC_C01',
					islinkquery: true,
					status: 'browse',
        			id:res.data,
					source:'link'
				});
            }
            
        }
    });
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
					'content': '未查询到关联凭证'
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
						n: this.state.json['36340CDIB-000001'],//36340CDIB-000001
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
						n: this.state.json['36340CDIB-000001']
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