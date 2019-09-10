<template>
    <ui-layout :brs="brs">
        <ui-container>
          <el-row>
                <el-form :inline="true" class="demo-form-inline" v-if="isSave">
                    <el-row >
                            <el-form-item label=" ">
                                <el-button type="primary" @click="toInsert">
                                    <i class="el-icon-circle-plus-outline"></i>
                                    <span>添加门店</span>
                                </el-button>
                            </el-form-item>
                    </el-row>
                </el-form>
            </el-row>
            <el-row>
                <el-table :data="tableData" border style="max-width:80%;">
                    <el-table-column prop="name" label="门店名称" width="300" align="center"></el-table-column>
                    <el-table-column prop="contactInformation" label="联系方式" width="120" align="center"></el-table-column>
                    <el-table-column prop="address" label="门店地址" width="500" align="center"></el-table-column>
                    <el-table-column prop="cancelOrder" label="核销订单数" width="100" align="center"></el-table-column>
                    <el-table-column prop="cancelMoney" label="核销总额" align="center" width="100"></el-table-column>
                    <el-table-column prop="cancelCard" label="核销卡券数" width="100" align="center"></el-table-column>
                    <!-- <el-table-column prop="isDefault" label="默认门店" width="100" align="center">
                        <template slot-scope="scope">
                                <el-button type="text" size="small" @click="changeIsDefault(scope.row)" v-text="scope.row.isDefault == 'N' ? '开启' : '关闭'"></el-button>
                        </template>
                    </el-table-column> -->
                    <el-table-column label="操作" fixed="right" width="300" align="center">
                        <template slot-scope="scope"> 
                            <el-button type="text" size="small" @click="toEdit(scope.row)">修改</el-button>
                            <el-button type="text" size="small" @click="toDeleted(scope.row)" v-if="isSave">删除</el-button>
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
      brs: [{ name: "门店管理", to: { name: "shopManager" } }],
      //查询参数
      queryMap: {
        pageNo: 1,
        pageSize: 10,
      },
      tableData: [],
      total: null,
      //判断是不是有新增 删除权限 
      isSave:false
    };
  },
  mounted() {
    this.getTableData();
    this.arrs = sessionStorage.getItem("privileges");
    this.isShop();
  },
  methods: {
    isShop() {
      if(this.arrs.indexOf("content_manager") == -1){
          this.isSave = false;
      }else{
          this.isSave = true;
      }
    },
    //跳转新增页
    toInsert() {
      this.$to({ name: "shopInsert" });
    },
    getTableData() {
      let loadingInstance = Loading.service({ fullscreen: true });
      this.$post("shopList", this.queryMap)
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
      this.$to({ name: "shopEdit", query: row });
    },
    toDeleted(row) {
      this.$confirm("是否确认删除该门店", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.$post("shopSave", { id: row.id, deleted: "Y" }).then(res => {
            this.getTableData();
            this.$message({ message: "删除门店成功", type: "success",center:true });
          });
        })
        .catch(() => {});
    },
    changeIsDefault(row) {
      let visibtext = null;
      let isDefault = null;
      if (row.isDefault == "N") {
        visibtext = "开启";
        isDefault = "Y";
      }
      if (row.isDefault == "Y") {
        visibtext = "关闭";
        isDefault = "N";
      }
      this.$confirm(
        "是否确认对该门店进行" + visibtext + "默认门店操作",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      ).then(() => {
          this.$post("shopSave", { id: row.id, isDefault: isDefault }).then(
            res => {
              this.getTableData();
              this.$message({ message: "操作成功", type: "success" ,center:true});
            }
          );
        }).catch(() => {});
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