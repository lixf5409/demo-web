<template>
  <div>
    <a-row>
      <a-col :span="6">
        <DeptTree style="margin-top:10px" @transfer="getDpetId"></DeptTree>
      </a-col>
      <a-col :span="18">
        <template>
          <a-table
            :rowKey="(user) => user.userId"
            :dataSource="data"
            :loading="loading"
            :rowSelection="{selectedRowKeys: selectedRowKeys, onChange: onSelectChange}"
            :columns="columns"
          >
            <template slot="userCode" slot-scope="text,record">
              <a href="javascript:;" @click="onEdit(record.userId)">{{text}}</a>
            </template>
            <template slot="title" slot-scope>
              <a-button type="primary" @click="onEdit()">新增</a-button>
              <a-popconfirm
                title="请问是否确认要删除所选用户?"
                @confirm="confirm"
                @cancel="cancel"
                okText="确定"
                cancelText="取消"
              >
                <a-button type="primary" :disabled="!hasSelected" :loading="loading">删除</a-button>
              </a-popconfirm>
              <span style="margin-left: 8px">
                <template v-if="hasSelected">{{`Selected ${selectedRowKeys.length} items`}}</template>
              </span>
            </template>
          </a-table>
        </template>
      </a-col>
    </a-row>
  </div>
</template>

<script>
import DeptTree from "../Dept/DeptTree.vue";
import request from "../../../utils/request.js";

const columns = [
  {
    title: "用户编码",
    dataIndex: "userCode",
    scopedSlots: { customRender: "userCode" }
  },
  {
    title: "用户名称",
    dataIndex: "userName"
  },
  {
    title: "性别",
    dataIndex: "sex",
    customRender(sex) {
      return sex == 1 ? "男" : "女"; //1是男，2是女
    }
  },
  {
    title: "所属部门",
    dataIndex: "deptName"
  }
];

export default {
  mounted() {
    this.getList();
  },
  components: { DeptTree },
  data() {
    return {
      data: [],
      columns,
      selectedRowKeys: [], // Check here to configure the default column
      loading: false,
      currentDeptId: null
    };
  },
  computed: {
    hasSelected() {
      return this.selectedRowKeys.length > 0;
    }
  },
  methods: {
    onSelectChange(selectedRowKeys) {
      this.selectedRowKeys = selectedRowKeys;
    },
    getDpetId(keys) {
      this.currentDeptId = keys;
      this.getList();
    },
    getList() {
      this.loading = true;
      let requestObj = {
        url: "/api/users/user",
        method: "get",
        params: {}
      };
      if (this.currentDeptId && this.currentDeptId != 1) {
        requestObj.url = "/api/users/user/dept/" + this.currentDeptId;
        requestObj.params = { pageNum: 1, pageSize: 10 };
      }
      request(requestObj).then(response => {
        this.loading = false;
        let userList = [];
        if (response.data.list) {
          userList = response.data.list;
        } else {
          userList = response.data;
        }
        userList.forEach(element => {
          request({
            url: "/api/depts/dept/" + element.deptId,
            method: "get"
          }).then(response => {
            element.deptName = response.data.deptName;
          });
        });
        this.data = userList;
      });
    },
    onEdit(userId) {
      if (!userId) {
        this.$router.push({
          path: "/org/user-form",
          query: {
            deptId: this.currentDeptId || 1
          }
        });
      } else {
        this.$router.push({
          path: "/org/user-form/"+userId
        });
      }
    },
    confirm() {
      this.selectedRowKeys.forEach(element => {
        request({
          url: "/api/users/user/" + element,
          method: "delete",
          params: {}
        }).then(() => {});
      });
      this.getList();
      this.$message.success("Click on Yes");
    },
    cancel() {
      this.$message.error("Click on No");
    }
  }
};
</script>

<style>
.ant-btn {
  margin-right: 10px;
}
</style>
