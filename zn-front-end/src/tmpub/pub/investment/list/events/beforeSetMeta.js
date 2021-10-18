/*UMLDRuM/VRAuL6K3V9AXsBrIS9ug2imS2Pkt1r7c3lDytQxcZ5tfSS9fPU80E9/1*/
import { base } from 'nc-lightapp-front';
const { NCSelect } = base;
const NCOption = NCSelect.NCOption;

export default function (meta, json) {
    const finType = [
        {
            display: json['36010IFV-000002'],/* 国际化处理： 信托融资*/
            value: 'TRUST'
        },
        {
            display: json['36010IFV-000003'],/* 国际化处理： 银行融资*/
            value: 'BANK'
        },
        {
            display: json['36010IFV-000004'],/* 国际化处理： 债券融资*/
            value: 'BOND'
        },
        {
            display: json['36010IFV-000005'],/* 国际化处理： 财务公司*/
            value: 'FINANCIAL_COMPANY'
        },
        {
            display: json['36010IFV-000006'],/* 国际化处理： 其他融资公司*/
            value: 'OTHER_FINANCIAL_COMPANIES'
        },
        {
            display: json['36010IFV-000012'],/* 国际化处理： 票据融资*/
            value: 'FBM'
        },
        {
            display: json['36010IFV-000013'],/* 国际化处理： 内部贷款*/
            value: 'INNER_LOAN'
        },
        {
            display: json['36010IFV-000014'],/* 国际化处理： 委托贷款*/
            value: 'DELEGATION_LOAN'
        },
    ];
    
    const investType = [
        {
            display: json['36010IFV-000007'],/* 国际化处理： 银行理财*/
            value: 'BANK_FINANCIAL'
        },
        {
            display: json['36010IFV-000008'],/* 国际化处理： 大额存单*/
            value: 'THE_CDS'
        },
        {
            display: json['36010IFV-000009'],/* 国际化处理： 结构性存款*/
            value: 'STRUCTURED_DEPOSIT'
        },
        {
            display: json['36010IFV-000010'],/* 国际化处理： 保本理财*/
            value: 'BREAK_EVEN_FINANCIAL'
        },
        {
            display: json['36010IFV-000011'],/* 国际化处理： 其他理财*/
            value: 'OTHER_FINANCIAL'
        },
        {
            display: json['36010IFV-000015'],/* 国际化处理： 货币基金*/
            value: 'CURRENCY_FUND'
        },
    ];
    meta[this.tableId].items.map(item => {
		if (item.attrcode === 'variety_category') { // 品种大类
			item.render = function(text, record, index) {
                let type = record.values.type.value;
                let renderOption = type === '1' ? finType : investType;
				return <NCSelect
					onChange={(val) => {
						props.editTable.setValByKeyAndIndex(this.tableId, index, 'variety_category', { value: val });
					}}
				>
					{
						renderOption.map(item => {
							return <NCOption value={item.value}>{item.display}</NCOption>
						})
					}
				</NCSelect>
			}
		}
    });
    return meta;
}

/*UMLDRuM/VRAuL6K3V9AXsBrIS9ug2imS2Pkt1r7c3lDytQxcZ5tfSS9fPU80E9/1*/