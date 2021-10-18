/*j9aB5NII8FnkF5oYooZL+gJxHzKunciD/g7x4BNjch5/O2SlB9XfiWmtUGsczjNg*/
import { high } from 'nc-lightapp-front';
const { Refer } = high;
export default function(refcode, config = {}) {
    
    //参照方法
	switch (refcode) {
       
		case 'pk_buycurrtype':
			return (
				<Refer
					refName={this.props.MutiInit.getIntl("36070FCE") && this.props.MutiInit.getIntl("36070FCE").get('36070FCE-000017')}/* 国际化处理： 买入币种*/
                    refCode={'pk_buycurrtype'}
                    refType={'grid'}
					queryGridUrl={'/nccloud/uapbd/ref/CurrtypeGridRef.do'}
					{...config}
				/>
            );
        case 'pk_sellcurrtype':
			return (
				<Refer
					refName={this.props.MutiInit.getIntl("36070FCE") && this.props.MutiInit.getIntl("36070FCE").get('36070FCE-000018')}/* 国际化处理： 卖出币种*/
                    refCode={'pk_sellcurrtype'}
                    queryGridUrl={'/nccloud/uapbd/ref/CurrtypeGridRef.do'}
                    // isMultiSelectedEnabled={true}//是否支持多选
					{...config}
				/>
            );
            case 'pk_chargecurrtype':
			return (
				<Refer
					refName={this.props.MutiInit.getIntl("36070FCE") && this.props.MutiInit.getIntl("36070FCE").get('36070FCE-000019')}/* 国际化处理： 手续费币种*/
                    refCode={'pk_chargecurrtype'}
                    queryGridUrl={'/nccloud/uapbd/ref/CurrtypeGridRef.do'}
                    // isMultiSelectedEnabled={true}//是否支持多选
					{...config}
				/>
            );
        case 'pk_org':
            return (
                <Refer
                    refName={this.props.MutiInit.getIntl("36070FCE") && this.props.MutiInit.getIntl("36070FCE").get('36070FCE-000020')}/* 国际化处理： 财务组织*/
                    refCode={'pk_org'}
                    refType={'tree'}
                    queryTreeUrl={'/nccloud/uapbd/org/FinanceOrgTreeRef.do'}//查询tree要用queryTreeUrl
                    // isMultiSelectedEnabled={true}//是否支持多选
                    {...config}
                />
            );
            case 'pk_buyacct':
            return (
                <Refer
                    refName={this.props.MutiInit.getIntl("36070FCE") && this.props.MutiInit.getIntl("36070FCE").get('36070FCE-000021')}/* 国际化处理： 买入银行账户*/
                    refCode={'pk_buyacct'}
                    refType={'tree'}
                    queryTreeUrl={'/nccloud/uapbd/ref/bankaccdefaulttreeref.do'}
                    {...config}
                />
            );
            case 'pk_sellacct':
            return (
                <Refer
                    refName={this.props.MutiInit.getIntl("36070FCE") && this.props.MutiInit.getIntl("36070FCE").get('36070FCE-000022')}/* 国际化处理： 卖出银行账户*/
                    refCode={'pk_sellacct'}
                    refType={'tree'}
                    queryTreeUrl={'/nccloud/uapbd/ref/bankaccdefaulttreeref.do'}
                    {...config}
                />
            );
            case 'pk_paychargeacct':
            return (
                <Refer
                    refName={this.props.MutiInit.getIntl("36070FCE") && this.props.MutiInit.getIntl("36070FCE").get('36070FCE-000023')}/* 国际化处理： 付手续费账户*/
                    refCode={'pk_paychargeacct'}
                    queryGridUrl={'/ncdemo-web/bd/basedoc/refwarehouse.do'}
                    {...config}
                />
            );
        case 'purorg':
            return (
                <Refer
                    refName={this.props.MutiInit.getIntl("36070FCE") && this.props.MutiInit.getIntl("36070FCE").get('36070FCE-000024')}/* 国际化处理： 采购组织*/
                    refCode={'purorg'}
                    queryGridUrl={'/ncdemo-web/bd/basedoc/refpurorg.do'}
                    {...config}
                />
            );
        case 'employeer':
            return (
                <Refer
                    refName={this.props.MutiInit.getIntl("36070FCE") && this.props.MutiInit.getIntl("36070FCE").get('36070FCE-000025')}/* 国际化处理： 采购人员*/
                    refCode={'employeer'}
                    queryGridUrl={'/ncdemo-web/bd/basedoc/refemployeer.do'}
                    {...config}
                />
            );
        case 'dept':
            return (
                <Refer
                    refName={this.props.MutiInit.getIntl("36070FCE") && this.props.MutiInit.getIntl("36070FCE").get('36070FCE-000026')}/* 国际化处理： 采购部门*/
                    refCode={'dept'}
                    queryGridUrl={'/ncdemo-web/bd/basedoc/refdept.do'}
                    {...config}
                />
            );
        case 'supplier':
            return (
                <Refer
                    refName={this.props.MutiInit.getIntl("36070FCE") && this.props.MutiInit.getIntl("36070FCE").get('36070FCE-000027')}/* 国际化处理： 供应商*/
                    refCode={'supplier'}
                    queryGridUrl={'/ncdemo-web/bd/basedoc/refsupplier.do'}
                    {...config}
                />
            );
	}
}

/*j9aB5NII8FnkF5oYooZL+gJxHzKunciD/g7x4BNjch5/O2SlB9XfiWmtUGsczjNg*/