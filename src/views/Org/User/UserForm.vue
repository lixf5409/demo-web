<template>
  <div>
    <a-form layout="horizontal" :form="form">
      <a-form-item :label-col="formItemLayout.labelCol" :wrapper-col="formItemLayout.wrapperCol">
        <a-input type="hidden" v-decorator="['userId',{initialValue:userId}]" />
      </a-form-item>
      <a-form-item
        label="用户编码"
        :label-col="formItemLayout.labelCol"
        :wrapper-col="formItemLayout.wrapperCol"
      >
        <a-input
          v-decorator="['userCode',{initialValue:userCode,
        rules:[{required:true,min:4,message:'请输入用户编码,最少4个字符。'}]}]"
          placeholder="请输入用户编码"
        />
      </a-form-item>
      <a-form-item
        label="用户名称"
        :label-col="formItemLayout.labelCol"
        :wrapper-col="formItemLayout.wrapperCol"
      >
        <a-input
          v-decorator="['userName',{initialValue:userName,
        rules:[{required:true,message:'请输入用户名称'}]}]"
          placeholder="请输入用户名称"
        />
      </a-form-item>
      <a-form-item
        label="性别"
        :label-col="formItemLayout.labelCol"
        :wrapper-col="formItemLayout.wrapperCol"
      >
        <a-radio-group
          name="radioGroup"
          v-decorator="['sex',{initialValue:sex,
        rules:[{required:false,message:'必须选择性别'}]}]"
        >
          <a-radio value="1">男</a-radio>
          <a-radio value="2">女</a-radio>
        </a-radio-group>
      </a-form-item>
      <a-form-item
        label="出生日期"
        :label-col="formItemLayout.labelCol"
        :wrapper-col="formItemLayout.wrapperCol"
      >
        <a-date-picker
          v-decorator="['birthday',{initialValue:birthday,
        rules:[{required:false}]}]"
          placeholder="请输入出生日期"
        />
      </a-form-item>
      <a-form-item
        label="联系方式"
        :label-col="formItemLayout.labelCol"
        :wrapper-col="formItemLayout.wrapperCol"
      >
        <a-input
          v-decorator="['phone',{initialValue:phone,
        rules:[{required:false}]}]"
          placeholder="请输入联系方式"
        />
      </a-form-item>
      <a-form-item
        label="所属部门"
        :label-col="formItemLayout.labelCol"
        :wrapper-col="formItemLayout.wrapperCol"
      >
        <a-select
          v-decorator="['deptId',{initialValue:deptId,
        rules:[{required:true}]}]"
          readonly
        >
          <a-select-option :value="deptId">{{deptName}}</a-select-option>
        </a-select>
      </a-form-item>
      <a-form-item
        label="描述"
        :label-col="formItemLayout.labelCol"
        :wrapper-col="formItemLayout.wrapperCol"
      >
        <a-textarea
          v-decorator="['remarks',{initialValue:remarks,
        rules:[{required:false,min:6,message:'必须大于5个字符'}]}]"
          placeholder="请输入备注描述"
          :rows="4"
        />
      </a-form-item>
      <a-form-item :wrapper-col="buttonItemLayout.wrapperCol">
        <a-button @click="handleCancel" style="margin-right:10px">返回</a-button>
        <a-button type="primary" @click="handleSubmit">保存</a-button>
      </a-form-item>
    </a-form>
  </div>
</template>

<script>
import moment from "moment";
import request from "../../../utils/request.js";
import { notification } from "ant-design-vue";
export default {
  props:{
    vdeptId:{
      type:String,
      default:"3"
    }
  },
  data() {
    this.form = this.$form.createForm(this);
    return {
      formLayout: "horizontal",
      deptName: "",
      deptId: this.vdeptId,
      userId: this.$route.query.userId,
      userName: null,
      userCode: null,
      sex: null,
      birthday: null,
      phone: null,
      remarks: null
    };
  },
  mounted() {
    if (this.userId) {
      this.getUser();
    } else {
      this.getDept();
    }
  },
  computed: {
    formItemLayout() {
      const { formLayout } = this;
      return formLayout === "horizontal"
        ? {
            labelCol: { span: 4 },
            wrapperCol: { span: 10 }
          }
        : {};
    },
    buttonItemLayout() {
      const { formLayout } = this;
      return formLayout === "horizontal"
        ? {
            wrapperCol: { span: 10, offset: 4 }
          }
        : {};
    }
  },
  methods: {
    moment,
    getUser() {
      request({
        url: "/api/users/user/" + this.userId,
        method: "get"
      }).then(response => {
        if (response.data) {
          this.deptId = response.data.deptId;
          let birthday = response.data.birthday
            ? moment(response.data.birthday)
            : null;
          let user = { ...response.data, birthday: birthday };
          this.deptName = response.data.deptName;
          this.form.setFieldsValue(user);
          //this.getDept();
        }
      });
    },
    getDept() {
      request({
        url: "/api/depts/dept/" + this.deptId,
        method: "get",
        params: {}
      }).then(response => {
        if (response.data) {
          this.deptId = response.data.deptId;
          this.deptName = response.data.deptName;
          this.form.setFieldsValue({ deptId: response.data.deptId });
        }
      });
    },
    handleSubmit() {
      this.form.validateFields((err, fieldsValue) => {
        let values = {
          ...fieldsValue,
          birthday: fieldsValue["birthday"].format("YYYY-MM-DD")
        };
        if (!err) {
          let requestObj = {
            url: "/api/users/user",
            method: "post",
            params: values
          };
          if (values.userId) {
            requestObj.url += "/" + values.userId;
            requestObj.method = "put";
          }
          request(requestObj).then(() => {
            notification.success({
              // eslint-disable-next-line no-unused-vars
              message: h => <div>保存成功！</div>,
              description: "操作成功"
            });
            this.$router.push({
              path: "/org/user-list"
            });
          });
        }
      });
    },
    handleCancel() {
      this.$router.push({
        path: "/org/user-list"
      });
    }
  }
};
</script>