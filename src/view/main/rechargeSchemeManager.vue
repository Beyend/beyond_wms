<template>
    <ui-layout :brs="brs">
        <ui-container>
          <el-row>
                <el-form :inline="true" class="demo-form-inline">
                    <el-row >
                            <el-form-item label=" ">
                                <el-button type="primary" @click="toAddRechargeScheme">
                                    <i class="el-icon-circle-plus-outline"></i>
                                    <span>添加充值方案</span>
                                </el-button>
                            </el-form-item>
                    </el-row>
                </el-form>
            </el-row>
            <el-row>
                <el-col>
                    <el-table :data="tableData" border style="max-width:80%;">
                        <el-table-column prop="id" label="ID" width="50" align="center"></el-table-column>
                        <el-table-column prop="name" label="充值名称" width="300" align="center"></el-table-column>
                        <el-table-column prop="payMoney" label="支付金额(元)" align="center"></el-table-column>
                        <el-table-column prop="giveMoney" label="赠送金额(元)" align="center"></el-table-column>
                        <el-table-column prop="createTime" label="创建时间" align="center">
                            <template slot-scope="scope">
                                <span>{{scope.row.createTime | dateFmt('yyyy-MM-dd')}}</span>
                            </template>
                        </el-table-column>
                        <el-table-column label="操作"  fixed="right" align="center">
                            <template slot-scope="scope">
                                <el-button  @click="toEdit(scope.row)" type="text" size="small">编辑</el-button>
                                <el-button  @click="toDeleted(scope.row)" type="text" size="small">删除</el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                </el-col>
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
      brs: [{ name: "充值方案管理", to: { name: "rechargeSchemeManager" } }],
      total: null,
      queryMap: {
        pageNo: 1,
        pageSize: 10
      },
      tableData: [],
    };
  },
  mounted() {
    this.getTableData();
  },
  methods: {
    toAddRechargeScheme(){
      this.$to({ name: "rechargeSchemeInsert"});
    },
    //删除
    toDeleted(row) {
      this.$confirm("是否确认删除?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.$post("rechargeSchemeSave", { id: row.id, deleted: "Y" }).then(
            res => {
              this.getTableData();
              this.$message({
                message: "删除充值方案成功",
                type: "success",
                center: true
              });
            }
          );
        })
        .catch(() => {});
    },
    getTableData() {
      let loadingInstance = Loading.service({ fullscreen: true });
      this.$post("rechargeSchemeList", this.queryMap)
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
      this.$to({ name: "rechargeSchemeEdit", query: row });
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