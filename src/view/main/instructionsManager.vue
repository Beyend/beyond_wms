<template>
    <ui-layout :brs="brs">
        <ui-container>
          <!-- <el-row>
                <el-form :inline="true" class="demo-form-inline">
                    <el-row >
                            <el-form-item label=" ">
                                <el-button type="primary" @click="toInsert">
                                    <i class="el-icon-circle-plus-outline"></i>
                                    <span>添加使用说明</span>
                                </el-button>
                            </el-form-item>
                    </el-row>
                </el-form>
            </el-row> -->
            <el-row>
                <el-table :data="tableData" border style="max-width:80%;">
                    <!-- <el-table-column prop="id" label="ID"  align="center"></el-table-column> -->
                    <el-table-column prop="content" label="内容"  align="center" :show-overflow-tooltip="true"></el-table-column>
                    <el-table-column label="操作" fixed="right" align="center" width="200">
                        <template slot-scope="scope"> 
                            <el-button type="text" size="small" @click="toEdit(scope.row)">修改</el-button>
                            <!-- <el-button type="text" size="small" @click="toDeleted(scope.row)">删除</el-button> -->
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
      brs: [{ name: "使用说明", to: { name: "instructionsManager" } }],
      //查询参数
      queryMap: {
        pageNo: 1,
        pageSize: 10,
      },
      tableData: [],
      total: null,
    };
  },
  mounted() {
    this.getTableData();
  },
  methods: {
    //跳转新增页
    toInsert() {
      this.$to({ name: "instructionsInsert" });
    },
    toDeleted(row) {
      this.$confirm("是否确认删除该使用说明", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.$post("instructionsSave", { id: row.id, deleted: "Y" }).then(res => {
            this.getTableData();
            this.$message({ message: "删除使用说明成功", type: "success",center:true });
          });
        })
        .catch(() => {});
    },
    getTableData() {
      let loadingInstance = Loading.service({ fullscreen: true });
      this.$post("instructionsList", this.queryMap)
        .then(res => {
          this.tableData = res.list;
          this.total = res.total;
          loadingInstance.close();
        })
        .catch(() => {
          loadingInstance.close();
        });
    },
    toEdit(row) {
      this.$to({ name: "instructionsEdit", query: row });
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
</style>