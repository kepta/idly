import { FormComponentProps } from 'antd/es/form/Form';
import { Tags } from 'idly-common/lib/osm/structures';
import * as React from 'react';
import { Input, Col, Form } from 'antd';
export interface IProps {
  tags: Tags | undefined;
  onChange: any;
}

class _TagForm extends React.PureComponent<IProps & FormComponentProps, {}> {
  state = {};
  handleSubmit = () => {};
  render() {
    const { getFieldDecorator } = this.props.form;
    let t: [string, string][] = [];
    if (this.props.tags) {
      t = this.props.tags.toArray();
    }
    return (
      <Form layout="horizontal">
        {t.map(([key, val], index) => (
          <Input.Group compact key={key}>
            <Form.Item>
              {getFieldDecorator(`key_${key}`, {
                rules: [
                  { required: true, message: 'Please input your username!' }
                ]
              })(<Input />)}
            </Form.Item>
            <Form.Item>
              {getFieldDecorator(`val_${key}`, {
                rules: [
                  { required: true, message: 'Please input your username!' }
                ]
              })(<Input />)}
            </Form.Item>
          </Input.Group>
        ))}
      </Form>
    );
  }
}

export const TagForm = Form.create({
  onFieldsChange(props: any, changedFields) {
    props.onChange(changedFields);
  },
  mapPropsToFields(props: IProps) {
    if (props.tags) {
      const t = props.tags.toArray().reduce((prev: any, curr, index) => {
        // console.log(`key_${curr[0]}`, curr[0], curr[1]);
        prev[`key_${curr[0]}`] = { value: curr[0] };
        prev[`val_${curr[0]}`] = { value: curr[1] };
        return prev;
      }, {});
      return t;
    }
    return {};
  }
})(_TagForm);
