/*PbQ6HKL6RM2wpW8nHeMuxT8L43oNwEsNq0igkagFOoo=*/

export default function buildMeta() {
    return {
        "template": {
            "gridrelation": {
                "inneraccbalance": {
                    "destBrowseAreaCode": null,
                    "destEditAreaCode": null,
                    "srcAreaCode": "inneraccbalance",
                    "tabRelation": [
                        "inneraccbalance"
                    ]
                }
            },
            "inneraccbalance": {
                "clazz": null,
                "code": "inneraccbalance",
                "items": [
                    {
                        "itemtype": "input",
                        "visible": true,
                        "label": this.state.json['3601Inner-000000'],/* 国际化处理： 账户名称*/
                        "attrcode": "name",
                        "maxlength": "20",
                        "metapath": null
                    },
                    {
                        "itemtype": "input",
                        "visible": true,
                        "label": this.state.json['3601Inner-000001'],/* 国际化处理： 账面余额*/
                        "attrcode": "bookbalance",
                        "maxlength": "20",
                        "metapath": null
                    },
                    {
                        "itemtype": "input",
                        "visible": true,
                        "label": this.state.json['3601Inner-000002'],/* 国际化处理： 实时余额*/
                        "attrcode": "realbalance",
                        "maxlength": "20",
                        "metapath": null,
                    },
                    {
                        "itemtype": "input",
                        "visible": true,
                        "label": this.state.json['3601Inner-000003'],/* 国际化处理： 实时余额(不含透支)*/
                        "attrcode": "realbalancewithoutover",
                        "maxlength": "20",
                        "metapath": null
                    }
                ],
                "moduletype": "table",
                "name": this.state.json['3601Inner-000005'],
                "pagination": false,
                "vometa": ""
            },
            "code": "inneraccbalancedialog",
            "moduletype": "table",
            "name": this.state.json['3601Inner-000005'],
        },
        "code": "inneraccbalancedialog",
        "formrelation": null,
        "name": this.state.json['3601Inner-000005'],
        "metapath": null,
        "clazz": null,
        "pagetype": "Nochild"
    }
} 

/*PbQ6HKL6RM2wpW8nHeMuxT8L43oNwEsNq0igkagFOoo=*/