<template>
    <ui-layout :brs="brs">
        <ui-container>
          <el-row>
                <el-form :inline="true" class="demo-form-inline">
                    <el-row >
                            <el-form-item label=" ">
                                <el-button type="primary" @click="toInsert">
                                    <i class="el-icon-circle-plus-outline"></i>
                                    <span>添加轮播图</span>
                                </el-button>
                            </el-form-item>
                    </el-row>
                </el-form>
            </el-row>
            <el-row>
                <el-table :data="tableData" border style="max-width:80%;">
                    <el-table-column prop="name" label="标题"  align="center"></el-table-column>
                    <el-table-column prop="name" label="图片"  align="center">
                      <template slot-scope="scope">
                          <img v-if="scope.row.url" :src="scope.row.url" style="width:150px;height:50px;">
                      </template>
                    </el-table-column>
                    <el-table-column label="操作" fixed="right" align="center">
                        <template slot-scope="scope"> 
                            <el-button type="text" size="small" @click="toEdit(scope.row)">修改</el-button>
                            <el-button type="text" size="small" @click="toDeleted(scope.row)">删除</el-button>
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
import { viewImg } from "../../../config/project/project.env"; //图片预览
export default {
  components: { UiPage, Loading },
  data() {
    return {
      brs: [{ name: "轮播图管理", to: { name: "bannerManager" } }],
      //查询参数
      queryMap: {
        pageNo: 1,
        pageSize: 10,
      },
      tableData: [],
      total: null,
      viewImg:viewImg
    };
  },
  mounted() {
    this.getTableData();
  },
  methods: {
    //跳转新增页
    toInsert() {
      this.$to({ name: "bannerInsert" });
    },
    getTableData() {
      let loadingInstance = Loading.service({ fullscreen: true });
      this.$post("bannerList", this.queryMap)
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
      this.$to({ name: "bannerEdit", query: row });
    },
    toDeleted(row) {
      this.$confirm("是否确认删除该轮播图", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.$post("bannerSave", { id: row.id, deleted: "Y" }).then(res => {
            this.getTableData();
            this.$message({ message: "删除轮播图成功", type: "success",center:true });
          });
        })
        .catch(() => {});
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