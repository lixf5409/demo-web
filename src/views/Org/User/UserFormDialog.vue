<template>
  <div>
    <a-modal
      title="Title"
      :visible="visible"
      @ok="handleOk"
      :confirmLoading="confirmLoading"
      @cancel="handleCancel"
    >
      <UserForm :vdeptId="deptId"></UserForm>
    </a-modal>
  </div>
</template>
<script>
import UserForm from "../User/UserForm.vue";
export default {
  components: { UserForm },
  props: {
    showDialog: { type: Boolean, default: false }
  },
  data() {
    return {
      confirmLoading: false,
      visible: this.showDialog,
      deptId:"2"
    };
  },
  watch: {
      showDialog:function(value){
        this.visible = value;
      }
  },
  methods: {
    showModal() {
      this.visible = true;
    },
    handleOk() {
      this.ModalText = "正在保存，稍后关闭";
      this.confirmLoading = true;

      setTimeout(() => {
        this.visible = false;
        this.$emit("changeVisable");
        this.confirmLoading = false;
      }, 2000);
    },
    handleCancel() {
      //console.log('Clicked cancel button');
      this.visible = false;
      this.$emit("changeVisable");
    }
  }
};
</script>
