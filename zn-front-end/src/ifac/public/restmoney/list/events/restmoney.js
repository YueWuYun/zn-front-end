/*/yzbtIJAmMOLAkbulEW8kVui3sE1yTnNEOTh8OSX6/22V62Qi/yYcAj8p3RVbUIH*/

export default function  restmoney() {
    return {
        "template": {
          "gridrelation":{
            "restmoney":{
              "destBrowseAreaCode":null,
              "destEditAreaCode":null,
              "srcAreaCode":"restmoney",
              "tabRelation":[
                "restmoney"
              ]
            }
          },
          "restmoney": {
            "clazz": "nc.vo.cmp.settlement.LinkAccountBalanceVO",
            "code": "restmoney",
            "items": [
              {
                "itemtype": "input",
                "visible": true,
                "label": this.state.json['360701OB-000041'],/* 国际化处理： 账户编码*/
                "attrcode": "accountcode",
                "maxlength": "20",
                "metapath": "accountcode"
              },
              {
                "itemtype": "input",
                "visible": true,
                "label": this.state.json['360701OB-000042'],/* 国际化处理： 账户名称*/
                "attrcode": "accountname",
                "maxlength": "20",
                "metapath": "accountname"
              },
              {
                "itemtype": "input",
                "visible": true,
                "label": this.state.json['360701OB-000058'],/* 国际化处理： 币种,币种*/
                "attrcode": "currencyname",
                "maxlength": "20",
                "metapath": "currencyname"
              },
              {
                "itemtype": "input",
                "visible": true,
                "label": this.state.json['360701OB-000043'],/* 国际化处理： 账户类型*/
                "attrcode": "accounttype",
                "disabled": true,
                "metapath": "accounttype"
              },
              {
                "itemtype": "input",
                "visible": false,
                "label": this.state.json['360701OB-000057'],/* 国际化处理： 资金形态,资金形态*/
                "code": "capitaltype",
                "attrcode": "capitaltype",
                "disabled": true,
                "metapath": "capitaltype"
              },
              {
                "itemtype": "number",
                "scale": "8",
                "visible": true,
                "label": this.state.json['360701OB-000044'],/* 国际化处理： 账面余额*/
                "attrcode": "currentbalance",
                "maxlength": "28",
                "metapath": "currentbalance"
              },
              {
                "itemtype": "number",
                "scale": "8",
                "visible": true,
                "label": this.state.json['360701OB-000045'],/* 国际化处理： 可用余额*/
                "attrcode": "surplusbalance",
                "maxlength": "28",
                "metapath": "surplusbalance"
              }
            ],
            "moduletype": "table",
            "name": this.state.json['360701OB-000046'],/* 国际化处理： 期初余额联查*/
            "pagination": false,
            "vometa": ""
          },
          "code":"restmoney",
          "moduletype":"table",
          "name":this.state.json['360701OB-000046']/* 国际化处理： 期初余额联查*/
          },
        "code": "360701OB_P01",
        "formrelation":null,
        "name": this.state.json['360701OB-000046'],/* 国际化处理： 期初余额联查*/
        "metapath": "cmp_initdate",
        "clazz": "nc.vo.cmp.settlement.LinkAccountBalanceVO",
        "pagetype": "Nochild"
      }
      
} 

/*/yzbtIJAmMOLAkbulEW8kVui3sE1yTnNEOTh8OSX6/22V62Qi/yYcAj8p3RVbUIH*/