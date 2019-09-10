<template>
    <ui-layout :brs="brs">
        <ui-container>
          <el-row>
                <el-form :inline="true" class="demo-form-inline">
                    <el-row >
                            <el-form-item label=" ">
                                <el-button type="primary" @click="toAutoRechargeInsert">
                                    <i class="el-icon-circle-plus-outline"></i>
                                    <span>添加自动充值</span>
                                </el-button>
                            </el-form-item>
                    </el-row>
                </el-form>
            </el-row>
            <el-row>
                <el-col>
                    <el-table :data="tableData" border style="max-width:80%;">
                        <el-table-column prop="id" label="ID" width="50" align="center"></el-table-column>
                        <el-table-column prop="merchantName" label="操作商户" width="300" align="center">
                          <template slot-scope="scope">
                            <span v-if="scope.row.merchantName == null || scope.row.merchantName == ''">平台</span>
                            <span v-if="scope.row.merchantName != null || scope.row.merchantName != ''">{{scope.row.merchantName}}</span>
                          </template>
                        </el-table-column>
                        <el-table-column prop="name" label="姓名" align="center"></el-table-column>
                        <el-table-column prop="phone" label="手机号" align="center"></el-table-column>
                        <el-table-column prop="startTime" label="充值时间" align="center">
                            <template slot-scope="scope">
                                <span>{{scope.row.startTime | dateFmt('yyyy-MM-dd')}}</span>
                            </template>
                        </el-table-column>
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
      brs: [{ name: "自动充值管理", to: { name: "autoRechargeManager" } }],
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
    toAutoRechargeInsert(){
      this.$to({ name: "autoRechargeInsert"});
    },
    //删除
    toDeleted(row) {
      this.$confirm("是否确认删除?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.$post("autoRechargeSave", { id: row.id, deleted: "Y" }).then(
            res => {
              this.getTableData();
              this.$message({
                message: "删除自动充值成功",
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
      this.$post("autoRechargeList", this.queryMap)
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
      this.$to({ name: "autoRechargeEdit", query: row });
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