<template>
  <a-tree :expandedKeys="expandedKeys" @select="onSelect" :treeData="treeData"></a-tree>
</template>
<script>
import request from "../../../utils/request.js";

export default {
  mounted() {
    this.getTree();
  },
  data() {
    return {
      treeData: [],
      expandedKeys: [],
      autoExpandParent: "true"
    };
  },
  methods: {
    onSelect(keys) {
      this.$emit("transfer", keys[0]);
    },
    buildTree(list) {
      let temp = {};
      let tree = [];
      for (let i in list) {
        temp[list[i].deptId] = {
          title: list[i].deptName,
          key: list[i].deptId,
          parentId: list[i].parentId
          //isLeaf: true
        };
      }
      for (let i in temp) {
        if (temp[i].parentId) {
          if (!temp[temp[i].parentId].children) {
            temp[temp[i].parentId].children = [];
          }
          temp[temp[i].parentId].children.push(temp[i]);
          //temp[temp[i].parentId].isLeaf = false;
        } else {
          tree.push(temp[i]);
        }
      }
      return tree;
    },
    getTree() {
      request({
        url: "/api/depts/dept",
        method: "get",
        params: {}
      }).then(response => {
        if (response.data && response.data.length > 1) {
          let tree = this.buildTree(response.data);
          this.treeData = tree;
          this.expandedKeys = [];
          response.data.forEach(element => {
            this.expandedKeys.push(element.deptId);
          });
        }
      });
    }
  }
};
</script>
