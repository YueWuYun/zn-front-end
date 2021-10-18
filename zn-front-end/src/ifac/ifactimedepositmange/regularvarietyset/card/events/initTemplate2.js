/*8tKvpLXjO/RsfMOatvZzzG3TEbp5uqdcKIjPBz2Jtw7/jnrf1vDQS9DG4GTZoGC8*/
import { ajax, toast } from 'nc-lightapp-front';
import { appCode_appro, card } from '../../cons/constant.js';
import { buttonVisible } from './buttonVisible';
// import { getCardData } from "./page";
//引入组织版本视图api
import { orgVersionView } from "../../../../../tmpub/pub/util/version/index";
export default function (props) {
	props.createUIDom(
		{
			pagecode: card.pageCode_appro,//页面id
			//appcode: appCode_appro
		},
		(data) => {
			if (data) {
				// //console.log(data, 'data')
				if (data.button) {
					let button = data.button;
					props.button.setButtons(button);
					buttonVisible.call(this, props, button);
				}
				if (data.template) {
					let meta = data.template;
					props.meta.setMeta(meta);
					if (this.props.getUrlParam("id")) {
						queryCardData.call(
							this,
							this.cardUrl,
							String(this.props.getUrlParam("id")),
						);
					}
				}
			}
		}
	)
}

function queryCardData(url, id) {

	ajax({
        url: `${url}.do`,
        data: {
            pk: id, 
            pageCode: card.pageCode_appro
        },
        success: (res) => {
            let { success, data }= res;
            if (success) {
                if (data && data.head) {
                    let ts= data.head[this.formId].rows[0].values.ts.value;
                    this.idTs= {id, ts};
                    this.props.form.setAllFormValue({ [this.formId]: data.head[this.formId] });
                    this.props.resMetaAfterPkorgEdit();
                    // this.props.form.setFormItemsDisabled(this.formId, {});
                }
                orgVersionView(this.props, this.formId);//组织版本视图
                buttonVisible.call(this, this.props);
                // if (isFirst || isRefresh) {//didmount或者刷新按钮
                //     //保存缓存
                //     addCache(id, data, this.formId, this.cache);
                // } else {
                //     // 更新缓存
                //     updateCache(this.primaryId, id, data, this.formId, this.cache);
                // }
                // if (isRefresh) {// 更新列表缓存
                //     updateCache(this.primaryId, id, data, this.formId, this.dataSource);
                // }
            }
        },
        error: (res) => {
            toast({color: 'danger', content: res.message});
        }
    }); 

    
}

/*8tKvpLXjO/RsfMOatvZzzG3TEbp5uqdcKIjPBz2Jtw7/jnrf1vDQS9DG4GTZoGC8*/