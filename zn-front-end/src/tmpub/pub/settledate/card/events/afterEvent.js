/*OWmq6Ugo6jPE4W7xoi1UXmCWYqlC69sXfcFlY2wAGxgRaOVRhw27VYjQJQXQrA8m*/
import moment from "moment";

export function afterEvent(
  props,
  moduleId,
  key,
  value,
  oldvalue,
  index,
  record
) {
  let settleway =
    props.form.getFormItemsValue(this.formId, "settleway") &&
    props.form.getFormItemsValue(this.formId, "settleway").value;
  // let cycleunit= props.form.getFormItemsValue(this.formId, 'cycleunit') && props.form.getFormItemsValue(this.formId, 'cycleunit').value;
  let settlecycle =
    props.form.getFormItemsValue(this.formId, "settlecycle") &&
    props.form.getFormItemsValue(this.formId, "settlecycle").value;
  // let endsettledate= props.form.getFormItemsValue(this.formId, 'endsettledate') && props.form.getFormItemsValue(this.formId, 'endsettledate').value;
  switch (key) {
    case "settleway": //结息方式
      resolveSettleWay.call(this, value.value, oldvalue.value, props);
      break;
    case "settlecycle": //结息周期
      resolveSettleDetail.call(this, props, value.value);
      break;
    case "cycleunit": //周期单位
      if (settleway === "0") {
        let isMonth = value.value === "1";
        let meta = props.meta.getMeta();
        props.form.setFormItemsValue(this.formId, {
          endsettledate: {
            display: isMonth ? "20" : null,
            value: isMonth ? "20" : null
          }
        });
        props.form.setFormItemsDisabled(this.formId, {
          endsettledate: !isMonth
        });
        meta[this.formId].items.find(
          e => e.attrcode === "endsettledate"
        ).required = isMonth;
        props.meta.setMeta(meta);
      }
      resolveSettleDetail.call(
        this,
        props,
        "",
        value.value,
        value.value === "0" && settlecycle
      );
      break;
    case "endsettledate": //结息日
      resolveSettleDetail.call(this, props, settleway === "4" ? 3 : settleway);
      break;
    case "settlemonth": //table-月
      modifiedMeta.call(
        this,
        props,
        ["1", "3", "5", "7", "8", "10", "12"].includes(value),
        "settlemonth",
        value,
        index
      );
      break;
    default:
      break;
  }
}

function modifiedMeta(props, signal = true, type = "settleway", val, index) {
  let meta = props.meta.getMeta();
  if (type === "settleway") {
    let options = [
      {
        display: this.state.json["36010ISDC-000000"],
        value: "12"
      },
      {
        display: this.state.json["36010ISDC-000001"],
        value: "4"
      },
      {
        display: this.state.json["36010ISDC-000002"],
        value: "1"
      },
      {
        display: this.state.json["36010ISDC-000003"],
        value: "0"
      }
    ]; /* 国际化处理： 年,季,月,日*/
    if (!signal) {
      options.splice(0, 2);
    }
    meta[this.formId].items.find(
      e => e.attrcode === "cycleunit"
    ).options = options;
  } else {
    let options = meta[this.tableId].items.find(e => e.attrcode === "settleday")
      .options;
    options.length = 30;
    meta[this.tableId].items.find(
      e => e.attrcode === "settleday"
    ).options = signal
      ? options.concat({
          display: "31",
          value: "31"
        })
      : options;
    // if (val === '2') {
    // 	meta[this.tableId].items.find((e) => e.attrcode === 'settleday').options = options.splice(30, 1);
    // }
    let settleday = props.cardTable.getValByKeyAndIndex(
      this.tableId,
      index,
      "settleday"
    ).value;
    if (!signal && settleday === "31") {
      props.cardTable.setValByKeyAndIndex(this.tableId, index, "settleday", {
        value: null,
        display: null
      });
    }
    if (val !== "2") {
      //非2月时，清空闰年日的值
      props.cardTable.setValByKeyAndIndex(
        this.tableId,
        index,
        "settleleapday",
        {
          value: null,
          display: null
        }
      );
    }
    props.cardTable.setEditableByIndex(
      this.tableId,
      index,
      "settleleapday",
      val === "2"
    ); //设置闰年日是否可编辑
  }
  props.meta.setMeta(meta);
}
export function resolveSettleMonth(props, cycle, unit, date) {
  // let
  let month = 1;
  let arr = [];
  while (month <= 12) {
    arr.push({
      rowid: getRandom(),
      status: "2",
      values: {
        opr: {
          display: null,
          scale: null,
          value: null
        },
        settleday: {
          display:
            [4, 6, 9, 11].includes(month) && date == 31
              ? "30"
              : month == 2 && date > 28
              ? "28"
              : date,
          scale: null,
          value:
            [4, 6, 9, 11].includes(month) && date == 31
              ? "30"
              : month == 2 && date > 28
              ? "28"
              : date,
          isEdit: false
        },
        settledetaino: {
          display: null,
          scale: null,
          value: null,
          isEdit: false
        },
        settleleapday: {
          display:
            month == 2
              ? date > "28"
                ? "29"
                : date
              : [4, 6, 9, 11].includes(month) && date == "31"
              ? "30"
              : date,
          scale: null,
          value:
            month == 2
              ? date > 28
                ? "29"
                : date
              : [4, 6, 9, 11].includes(month) && date == "31"
              ? "30"
              : date,
          disabled: false,
          disabled: month == 2 ? "off" : "on"
        },
        settlemonth: {
          display: new String(month),
          scale: null,
          value: new String(month),
          isEdit: false
        }
      }
    });
    month++;
  }
  props.cardTable.setTableData(this.tableId, {
    rows: arr
  });
}
/*
	cycle  结息周期
	unit   周期单位
	day    结息日
*/

export function resolveSettleDetail(props, cycle, unit, day) {
  cycle =
    cycle || props.form.getFormItemsValue(this.formId, "settlecycle").value;
  unit = unit || props.form.getFormItemsValue(this.formId, "cycleunit").value;
  day = day || props.form.getFormItemsValue(this.formId, "endsettledate").value;
  if (!cycle || !unit || (!day && unit !== "0")) {
    return;
  }
  unit = unit === "0" ? "days" : "months";
  // 按半年结或者按季度结
  if (cycle == "6" || cycle == "3") {
    unit = "other";
  }
  if (unit === "days") {
    day = cycle;
    cycle = 1;
  }
  let year = new Date().getFullYear();
  let isLeapYear = (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
  // 根据月份获取正确的日期
  let newDay =
    [4, 6, 9, 11].includes(cycle - 0) && day == 31
      ? 30
      : cycle == 2 && day > 28
      ? 28
      : day;
  let startTime =
    unit === "days"
      ? moment(`${year}-01-01`).valueOf()
      : moment(`${year}-${cycle}-${newDay}`).valueOf();
  let endTime = moment(`${year}-12-31`).valueOf();
  let arr = [];
  while (startTime <= endTime) {
    let time = moment(startTime).format("YYYY-MM-DD");
    let month = String(+time.substr(5, 2));
    // let date = String(+time.substr(8, 2));
    let date =
      [4, 6, 9, 11].includes(month - 0) && day == 31
        ? "30"
        : month == 2 && day > 28
        ? "28"
        : day;
    arr.push({
      rowid: getRandom(),
      status: "2",
      values: {
        opr: {
          display: null,
          scale: null,
          value: null
        },
        settleday: {
          display:
            [4, 6, 9, 11].includes(month) && date == 31
              ? 30
              : month == 2 && date > 28
              ? 28
              : date,
          scale: null,
          value:
            [4, 6, 9, 11].includes(month) && date == 31
              ? 30
              : month == 2 && date > 28
              ? 28
              : date,
          isEdit: false
        },
        settledetaino: {
          display: null,
          scale: null,
          value: null,
          isEdit: false
        },
        settleleapday: {
          display: month == 2 && isLeapYear && date >= 28 ? "29" : date,
          scale: null,
          value: month == 2 && isLeapYear && date >= 28 ? "29" : date,
          disabled: month == 2 ? "off" : "on"
        },
        settlemonth: {
          display: new String(month),
          scale: null,
          value: new String(month),
          isEdit: false
        }
      }
    });
    if (unit === "days") {
      startTime = moment(startTime)
        .add(day, unit)
        .valueOf();
    } else if (unit === "months") {
      month = month - 0 + 1;
      newDay =
        [4, 6, 9, 11].includes(month) && day == 31
          ? 30
          : month == 2 && day > 28
          ? 28
          : day;
      startTime = moment(`${year}-${month}-${newDay}`).valueOf();
    } else {
      startTime = moment(startTime)
        .add(cycle, "months")
        .valueOf();
    }
  }
  props.cardTable.setTableData(this.tableId, {
    rows: arr
  });
}

export function getRandom() {
  return String(new Date().getTime()).slice(-5) + Math.random().toString(12);
}

// 处理结息方式
export function resolveSettleWay(value, oldvalue, props) {
  let endsettledate =
    props.form.getFormItemsValue(this.formId, "endsettledate") &&
    props.form.getFormItemsValue(this.formId, "endsettledate").value;
  let val = endsettledate
    ? {
        display: endsettledate,
        value: endsettledate
      }
    : {
        display: "20",
        value: "20"
      };
  let meta = props.meta.getMeta();
  meta[this.formId].items.find(e => e.attrcode === "endsettledate").required =
    value !== "0";
  props.meta.setMeta(meta);
  // 当结息方式为月时 设置 月 列不可以编辑
  props.cardTable.setColEditableByKey(
    this.tableId,
    "settlemonth",
    value === "1"
  );
  switch (value) {
    case "0": //按自定义
      props.form.setFormItemsValue(this.formId, {
        settlecycle: {
          display: null,
          value: null
        },
        cycleunit: {
          display: null,
          value: null
        },
        endsettledate: {
          display: null,
          value: null
        }
      });
      props.form.setFormItemsDisabled(this.formId, {
        settlecycle: false,
        cycleunit: false,
        endsettledate: true
      });
      modifiedMeta.call(this, props, false);
      break;
    case "1": //按月
      props.form.setFormItemsValue(this.formId, {
        settlecycle: {
          display: null,
          value: "1"
        },
        cycleunit: {
          display: this.state.json["36010ISDC-000002"],
          value: "1"
        } /* 国际化处理： 月*/,
        endsettledate: val
      });
      props.form.setFormItemsDisabled(this.formId, {
        settlecycle: true,
        cycleunit: true,
        endsettledate: false
      });
      break;
    case "4": //按季度
      props.form.setFormItemsValue(this.formId, {
        settlecycle: {
          display: null,
          value: "1"
        },
        cycleunit: {
          display: this.state.json["36010ISDC-000001"],
          value: "4"
        } /* 国际化处理： 季*/,
        endsettledate: val
      });
      props.form.setFormItemsDisabled(this.formId, {
        settlecycle: true,
        cycleunit: true,
        endsettledate: false
      });
      break;
    case "6": //按半年
      props.form.setFormItemsValue(this.formId, {
        settlecycle: {
          display: null,
          value: "6"
        },
        cycleunit: {
          display: this.state.json["36010ISDC-000002"],
          value: "1"
        } /* 国际化处理： 月*/,
        endsettledate: val
      });
      props.form.setFormItemsDisabled(this.formId, {
        settlecycle: true,
        cycleunit: true,
        endsettledate: false
      });
      break;
    case "12": //按年
      props.form.setFormItemsValue(this.formId, {
        settlecycle: {
          display: null,
          value: "1"
        },
        cycleunit: {
          display: this.state.json["36010ISDC-000000"],
          value: "12"
        } /* 国际化处理： 年*/,
        endsettledate: val
      });
      props.form.setFormItemsDisabled(this.formId, {
        settlecycle: true,
        cycleunit: true,
        endsettledate: false
      });
      break;
    default:
      break;
  }
  if (value === "0") {
    modifiedMeta.call(this, props);
    props.cardTable.setTableData(this.tableId, {
      rows: []
    });
  } else {
    resolveSettleDetail.call(this, props, value === "4" ? 3 : value, "months");
  }
}

/*OWmq6Ugo6jPE4W7xoi1UXmCWYqlC69sXfcFlY2wAGxgRaOVRhw27VYjQJQXQrA8m*/