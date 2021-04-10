import React, {PureComponent} from 'react';
import {connect} from 'dva';
import {formatMessage, FormattedMessage} from 'umi/locale';
import {
  Form,
  Input,
  DatePicker,
  Select,
  Button,
  Card,
  InputNumber,
  Radio,
  Icon,
  Tooltip,
  Checkbox,
  AutoComplete
} from 'antd';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import PicturesWall from '../Utils/PicturesWall';

const FormItem = Form.Item;
const {Option} = Select;
const {RangePicker} = DatePicker;
const {TextArea} = Input;
const Search = Input.Search;
const InputGroup = Input.Group;
const CheckboxGroup = Checkbox.Group;

const estateMap = new Map([
  ['中远两湾城', '1001|上海市,上海市,普陀区,远景路97弄'],
  ['上海康城', '1002|上海市,上海市,闵行区,莘松路958弄'],
  ['保利西子湾', '1003|上海市,上海市,松江区,广富林路1188弄'],
  ['万科城市花园', '1004|上海市,上海市,闵行区,七莘路3333弄2区-15区'],
  ['上海阳城', '1005|上海市,上海市,闵行区,罗锦路888弄']
]);


@connect(({loading}) => ({
  submitting: loading.effects['form/submitRegularForm'],
}))
//调用Form.create方法可以使用其自带的一些绑定方法（前提是做了数据的双向绑定）
@Form.create()
class AddResource extends PureComponent {
  //拦截方法，校验未通过不会进行提交
  handleSubmit = e => {
    // 拿到form对象
    const {dispatch, form} = this.props;
    e.preventDefault();
    console.log(this.state.fileList);
    // values中存放着表单提交时的所有数据
    form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        if (values.facilities) {
          // 做一个字符串的拼接，传给后端
          values.facilities = values.facilities.join(",");
        }
        if (values.floor_1 && values.floor_2) {
          values.floor = values.floor_1 + "/" + values.floor_2;

        }

        values.houseType = values.houseType_1 + "室" + values.houseType_2 + "厅"
          + values.houseType_3 + "卫" + values.houseType_4 + "厨"
          + values.houseType_2 + "阳台";
        delete values.floor_1;
        delete values.floor_2;
        delete values.houseType_1;
        delete values.houseType_2;
        delete values.houseType_3;
        delete values.houseType_4;
        delete values.houseType_5;

        // 楼盘id
        values.estateId = this.state.estateId;

        // 处理图片
        values.pic = [...this.state.pics].join(',');

        //提交请求，调用/House/models/form.js里面的submitHouseForm方法
        dispatch({
          type: 'house/submitHouseForm',
          payload: values,
        });
      }
    });
  };

  handleSearch = (value) => {
    let arr = new Array();
    if (value.length > 0) {
      estateMap.forEach((v, k) => {
        if (k.startsWith(value)) {
          arr.push(k);
        }
      });
    }
    this.setState({
      estateDataSource: arr
    });
  };

  // 接收到handleChange返回来的fileList
  handleFileList = (obj) => {
    let pics = new Set();
    obj.forEach((v, k) => {
      if (v.response) {
        pics.add(v.response.name);
      }
    });
    // 将图片信息放在state中
    this.setState({pics: pics})
  }


  constructor(props) {
    super(props);
    this.state = {
      estateDataSource: [],
      estateAddress: '',
      estateId: '',
      pics: []
    }
  }

  render() {
    const {submitting} = this.props;
    const {
      form: {getFieldDecorator, getFieldValue},
    } = this.props;

    const formItemLayout = {
      labelCol: {
        xs: {span: 24},
        sm: {span: 7},
      },
      wrapperCol: {
        xs: {span: 24},
        sm: {span: 12},
        md: {span: 10},
      },
    };

    const submitFormLayout = {
      wrapperCol: {
        xs: {span: 24, offset: 0},
        sm: {span: 10, offset: 7},
      },
    };


    return (
      <PageHeaderWrapper>
        {/*拦截submit，进行处理数据*/}
        <Form onSubmit={this.handleSubmit} hideRequiredMark style={{marginTop: 8}}>
          <Card bordered={false} title="房源信息">
            {/*数据双向绑定*/}
            <FormItem {...formItemLayout} label="楼盘名称">
              {/*  自动完成组件*/}
              <AutoComplete
                style={{width: '100%'}}
                // 设置数据源
                dataSource={this.state.estateDataSource}
                placeholder="搜索楼盘"
                // 被选中的时候调用，参数为选中项的值
                onSelect={(value, option) => {
                  let v = estateMap.get(value);
                  //自动更新
                  this.setState({
                    estateAddress: v.substring(v.indexOf('|') + 1),
                    estateId: v.substring(0, v.indexOf('|'))
                  });
                }}
                // 搜索补全项的时候调用此方法
                onSearch={this.handleSearch}
                filterOption={(inputValue, option) => option.props.children.toUpperCase().indexOf(inputValue.toUpperCase()) !== -1}
              />
            </FormItem>
            <FormItem {...formItemLayout} label="楼盘地址">
              <Input
                prefix={<Icon type="environment" style={{color: 'rgba(0,0,0,.25)'}}/>}
                value={this.state.estateAddress} defaultValue={this.state.estateAddress} readOnly/>
            </FormItem>
            <FormItem {...formItemLayout} label="房源标题">
              {getFieldDecorator('title', {rules: [{required: true, message: "此项为必填项"}]})(<Input
                style={{width: '100%'}}/>)}
            </FormItem>
            <FormItem {...formItemLayout} label="楼栋">
              <InputGroup compact>
                {getFieldDecorator('buildingNum', {rules: [{required: true, message: "此项为必填项"}]})(<Input
                  style={{width: '30%'}} addonAfter="栋"/>)}
                {getFieldDecorator('buildingUnit', {rules: [{required: true, message: "此项为必填项"}]})(<Input
                  style={{width: '30%'}} addonAfter="单元"/>)}
                {getFieldDecorator('buildingFloorNum', {rules: [{required: true, message: "此项为必填项"}]})(<Input
                  style={{width: '30%'}} addonAfter="门牌号"/>)}
              </InputGroup>
            </FormItem>
            <FormItem {...formItemLayout} label="租金">
              <InputGroup compact>
                {/*getFieldDecorator方法进行数据和对象双向绑定，就可以进行设置和配置*/}
                {getFieldDecorator('rent', {rules: [{required: true, message: "此项为必填项"}]})(<Input style={{width: '50%'}}
                                                                                                  addonAfter="元/月"/>)}
              </InputGroup>
            </FormItem>
            <FormItem {...formItemLayout} label="支付方式">
              {/*通过getFieldDecorator方法增加一个校验规则*/}
              {getFieldDecorator('paymentMethod', {initialValue: '1', rules: [{required: true, message: "此项为必填项"}]})
              (
                <Select style={{width: '50%'}}>
                  <Option value="1">付一押一</Option>
                  <Option value="2">付三押一</Option>
                  <Option value="3">付六押一</Option>
                  <Option value="4">年付押一</Option>
                  <Option value="5">其它</Option>
                </Select>
              )}
            </FormItem>
            <FormItem {...formItemLayout} label="租赁方式">
              {getFieldDecorator('rentMethod', {initialValue: '1', rules: [{required: true, message: "此项为必填项"}]})
              (
                <Select style={{width: '50%'}}>
                  <Option value="1">整租</Option>
                  <Option value="2">合租</Option>
                </Select>
              )}
            </FormItem>
            <FormItem {...formItemLayout} label="户型">
              <InputGroup compact>
                {getFieldDecorator('houseType_1', {rules: [{required: true, message: "此项为必填项"}]})(<Input
                  style={{width: '18%'}} addonAfter="室"/>)}
                {getFieldDecorator('houseType_2', {rules: [{required: true, message: "此项为必填项"}]})(<Input
                  style={{width: '18%', marginLeft: '5px'}} addonAfter="厅"/>)}
                {getFieldDecorator('houseType_3', {rules: [{required: true, message: "此项为必填项"}]})(<Input
                  style={{width: '18%', marginLeft: '5px'}} addonAfter="卫"/>)}
                {getFieldDecorator('houseType_4', {rules: [{required: true, message: "此项为必填项"}]})(<Input
                  style={{width: '18%', marginLeft: '5px'}} addonAfter="厨"/>)}
                {getFieldDecorator('houseType_5', {rules: [{required: true, message: "此项为必填项"}]})(<Input
                  style={{width: '23%', marginLeft: '5px'}} addonAfter="阳台"/>)}
              </InputGroup>

            </FormItem>
            <FormItem {...formItemLayout} label="建筑面积">
              <InputGroup compact>
                {getFieldDecorator('coveredArea', {rules: [{required: true, message: "此项为必填项"}]})(<Input
                  style={{width: '40%'}} addonAfter="平米"/>)}
              </InputGroup>
            </FormItem>
            <FormItem {...formItemLayout} label="使用面积">
              <InputGroup compact>
                {getFieldDecorator('useArea', {rules: [{required: true, message: "此项为必填项"}]})(<Input
                  style={{width: '40%'}} addonAfter="平米"/>)}
              </InputGroup>
            </FormItem>
            <FormItem {...formItemLayout} label="楼层">
              <InputGroup compact>
                {getFieldDecorator('floor_1', {rules: [{required: true, message: "此项为必填项"}]})(<Input
                  style={{width: '30%'}} addonBefore="第" addonAfter="层"/>)}
                {getFieldDecorator('floor_2', {rules: [{required: true, message: "此项为必填项"}]})(<Input
                  style={{width: '30%', marginLeft: '10px'}} addonBefore="总" addonAfter="层"/>)}
              </InputGroup>
            </FormItem>
            <FormItem {...formItemLayout} label="朝向">
              {getFieldDecorator('orientation', {initialValue: '南', rules: [{required: true, message: "此项为必填项"}]})
              (
                <Select style={{width: '20%'}}>
                  <Option value="南">南</Option>
                  <Option value="北">北</Option>
                  <Option value="东">东</Option>
                  <Option value="西">西</Option>
                </Select>
              )}
            </FormItem>
            <FormItem {...formItemLayout} label="装修">
              {getFieldDecorator('decoration', {initialValue: '1', rules: [{required: true, message: "此项为必填项"}]})
              (
                <Select style={{width: '20%'}}>
                  <Option value="1">精装</Option>
                  <Option value="2">简装</Option>
                  <Option value="3">毛坯</Option>
                </Select>
              )}
            </FormItem>
            <FormItem {...formItemLayout} label="配套设施">
              {getFieldDecorator('facilities', {
                initialValue: ['1', '2', '3'],
                rules: [{required: true, message: "此项为必填项"}]
              })
              (
                <CheckboxGroup options={[
                  {label: '水', value: '1'},
                  {label: '电', value: '2'},
                  {label: '煤气/天然气', value: '3'},
                  {label: '暖气', value: '4'},
                  {label: '有线电视', value: '5'},
                  {label: '宽带', value: '6'},
                  {label: '电梯', value: '7'},
                  {label: '车位/车库', value: '8'},
                  {label: '地下室/储藏室', value: '9'}
                ]}/>
              )}
            </FormItem>
          </Card>
          <Card bordered={false} title="图片信息">
            <FormItem {...formItemLayout} label="房源描述">
              {getFieldDecorator('houseDesc')
              (
                <TextArea placeholder="请输入备注信息" autosize={{minRows: 4, maxRows: 10}}/>
              )}
              <span>请勿填写联系方式或与房源无关信息以及图片、链接或名牌、优秀、顶级、全网首发、零距离、回报率等词汇。</span>
            </FormItem>

            {/*上传图片*/}
            <FormItem {...formItemLayout} label="上传室内图">
              {/*自定义上传图片的组件*/}
              <PicturesWall handleFileList={this.handleFileList.bind(this)}/>
            </FormItem>
          </Card>
          <Card bordered={false} title="出租信息">
            <FormItem {...formItemLayout} label="联系人">
              <InputGroup compact>
                {getFieldDecorator('contact', {rules: [{required: true, message: "此项为必填项"}]})
                (
                  <Input placeholder="请输入"/>
                )}
              </InputGroup>
            </FormItem>
            <FormItem {...formItemLayout} label="手机号">
              <InputGroup compact>
                {getFieldDecorator('mobile', {rules: [{required: true, max: 11, message: "此项为必填项"}]})
                (
                  <Input placeholder="请输入" maxLength="11"/>
                )}
              </InputGroup>
            </FormItem>
            <FormItem {...formItemLayout} label="看房时间">
              {getFieldDecorator('time', {initialValue: '1', rules: [{required: true, message: "此项为必填项"}]})
              (
                <Select style={{width: '20%'}}>
                  <Option value="1">上午</Option>
                  <Option value="2">中午</Option>
                  <Option value="3">下午</Option>
                  <Option value="4">晚上</Option>
                  <Option value="5">全天</Option>
                </Select>
              )}

            </FormItem>
            <FormItem {...formItemLayout} label="物业费">
              <InputGroup compact>
                {getFieldDecorator('propertyCost', {rules: [{required: true, max: 11, message: "此项为必填项"}]})
                (
                  <Input style={{width: '30%'}} addonAfter="元/平"/>
                )}
              </InputGroup>

            </FormItem>

            <FormItem {...submitFormLayout} style={{marginTop: 32}}>
              {/*表单提交*/}
              <Button type="primary" htmlType="submit" loading={submitting}>
                <FormattedMessage id="form.submit"/>
              </Button>
              <Button style={{marginLeft: 8}}>
                <FormattedMessage id="form.save"/>
              </Button>
            </FormItem>
          </Card>
        </Form>
      </PageHeaderWrapper>
    );
  }
}

export default AddResource;
