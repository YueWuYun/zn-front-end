/**
 * 卡片编辑前事件
 * @param {*} moduleId
 * @param {*} key
 * @param {*} value
 * @param {*} data
 */
export function beforeEvent(moduleId, key, value, data) {
      let { FormConfig, form: formUtil, meta: metaUtil } = this.props;
      let metaData = metaUtil.getMeta();
      if (key === "tradefinsort") {
        // 主表meta设置
        metaData["header_business"].items.map((item, key) => {
          // 进口信用证押汇=INWORDLCLOCU,进口信用证代付=INWORDLCPAY,出口信用证押汇=OUTWORDLCLOCU
          if (item.attrcode == "tradefinsort") {
            // 进口信用证号
            let inlcno = formUtil.getFormItemsValue(FormConfig.formId, "inlcno");
            if (!this.committypeOptions) {
              // 如果为首次加载meta数据
              this.committypeOptions = item.options;
            }
            let resultOptions;
            if (inlcno && inlcno.value) {
              // 进口信用证有值 则只能选择 进口押汇和进口代付
              resultOptions = this.committypeOptions.filter(
                item => item.value == "INWORDLCLOCU" || item.value == "INWORDLCPAY"
              );
              item.options = resultOptions;
            } else  {
              // 出口信用证有值  则只能选择出口信用证押汇
              resultOptions = this.committypeOptions.filter(
                item => item.value == "OUTWORDLCLOCU"
              );
              item.options = resultOptions;
            } 
          }
          return item;
        });
        metaUtil.setMeta(metaData);
      }
      return true;
    }