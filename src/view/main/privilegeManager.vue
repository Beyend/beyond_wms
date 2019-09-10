<template>
    <ui-layout :brs="brs">
        <ui-container>
          
            <el-table :data="tableData" border style="width:30%;" >
              <el-table-column prop="id" label="ID" align="center" width="100"></el-table-column>
                <el-table-column prop="name" label="权限名称" align="center"></el-table-column>
            </el-table>
            <el-row style="width:40%;">
                <ui-page :total="total" :pageSize="10" @size-change="handleSizeChange" @current-change="handleCurrentChange"></ui-page>
            </el-row>
        </ui-container>
    </ui-layout>
</template>

<script>
import UiPage from "../../components/UiPage.vue";
import { Loading } from "element-ui";
import { viewImg } from "../../../config/project/project.env"; //图片预览
export default {
  components: { UiPage, Loading },
  data() {
    return {
      brs: [{ name: "权限管理", to: { name: "privilegeManager" } }],
      date: [],
      queryMap: {
        pageNo: 1,
        pageSize: 10
      },
      tableData: [],
      total: null,
    };
  },
  mounted() {
    this.getTableData();
  },
  methods: {
    getTableData() {
      let loadingInstance = Loading.service({ fullscreen: true });
      this.$post("privilegeList", this.queryMap)
        .then(res => {
          this.tableData = res.list;
          this.total = res.total;
          loadingInstance.close();
        })
        .catch(() => {
          loadingInstance.close();
        });
    },
    handleSizeChange(val) {
      this.queryMap.pageNo = val;
      this.getTableData();
    },
    handleCurrentChange(val) {
      this.queryMap.pageNo = val;
      this.getTableData();
    }
  }
};
</script>

<style>
@import "../../style/teaend.less";
.demo-table-expand {
  font-size: 0;
}
.demo-table-expand label {
  width: 90px;
  color: #99a9bf;
}
.demo-table-expand .el-form-item {
  margin-right: 0;
  margin-bottom: 0;
  width: 50%;
}
</style>