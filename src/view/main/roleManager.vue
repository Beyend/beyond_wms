<template>
    <ui-layout :brs="brs">
        <ui-container v-if="flag">
          <el-row>
                <el-form :inline="true" class="demo-form-inline">
                    <el-row >
                            <el-form-item label=" ">
                                <el-button type="info" plain @click="toAddRole">
                                    <i class="el-icon-circle-plus-outline"></i>
                                    <span>添加角色</span>
                                </el-button>
                            </el-form-item>
                    </el-row>
                </el-form>
            </el-row>
           <el-row>
                <el-table :data="tableData" border style="width:80%;" >
                    <el-table-column type="index" label="序号" align="center" ></el-table-column>
                    <el-table-column prop="roleName" label="角色名称" align="center"></el-table-column>
                    <el-table-column label="操作"  fixed="right" align="center">
                        <template slot-scope="scope">
                          <el-button  @click="toEdit(scope.row)" type="info" plain size="small">编辑</el-button>
                        </template>
                    </el-table-column>
                </el-table>
           </el-row>
            <el-row>
                <ui-page :total="total" :pageSize="10" @size-change="handleSizeChange" @current-change="handleCurrentChange"></ui-page>
            </el-row>
        </ui-container>
    </ui-layout>
</template>

<script>
import UiPage from "../../components/UiPage.vue";
import { Loading } from "element-ui";
export default {
  components: { UiPage, Loading },
  data() {
    return {
      brs: [{ name: "角色管理", to: { name: "roleManager" } }],
      date: [],
      queryMap: {
        pageNo: 1,
        pageSize: 10
      },
      tableData: [],
      total: null,
      flag: true
    };
  },
  mounted() {
    this.getTableData();
  },
  methods: {
      toAddRole(){
        this.$to({ name: "roleInsert"});
      },
      toEdit(row){
        this.$to({ name: "roleEdit", query: row.roleId });
      },
      getTableData() {
        let loadingInstance = Loading.service({ fullscreen: true });
        this.$post("roleList", this.queryMap)
          .then(res => {
            this.tableData = res.rows;
            this.total = res.total;
            loadingInstance.close();
          }).catch(() => {
            this.flag = false 
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