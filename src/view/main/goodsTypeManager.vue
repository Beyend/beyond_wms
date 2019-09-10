<template>
    <ui-layout :brs="brs">
        <ui-container>
            <el-row>
                <el-form :inline="true" class="demo-form-inline">
                    <el-row >
                            <el-form-item label=" ">
                                <el-button type="primary" @click="toAddGoodsType">
                                    <i class="el-icon-circle-plus-outline"></i>
                                    <span>添加分类</span>
                                </el-button>
                            </el-form-item>
                    </el-row>
                </el-form>
            </el-row>
            <el-table :data="tableData" border style="width:80%;" >
                <el-table-column prop="id" label="ID" width="100px;" align="center"></el-table-column>
                <el-table-column prop="name" label="分类名称" align="center"></el-table-column>
                 <el-table-column prop="name" label="图片"  align="center">
                      <template slot-scope="scope">
                          <img v-if="scope.row.icon" :src="scope.row.icon" style="width:40px;height:40px;">
                      </template>
                    </el-table-column>
                <el-table-column prop="sort" label="排序" width="100px;" align="center"></el-table-column>
                <el-table-column prop="parentId" label="分类级别"  align="center">
                    <template slot-scope="scope" >
                        <span v-if="scope.row.parentId == '0'" v-text="'一级分类'"></span>
                        <span v-if="scope.row.parentId != '0'" v-text="'二级分类'"></span>
                    </template>
                </el-table-column>
                <el-table-column label="操作" fixed="right" align="center">
                    <template slot-scope="scope">
                        <el-button @click="toEditGoodsType(scope.row)" type="text" size="small">修改</el-button>
                        <el-button @click="toDeleted(scope.row)" type="text" size="small">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
                
            <el-row>
                <ui-page :total="total" :pageNo="queryMap.pageNo" :pageSize="10" @size-change="handleSizeChange" @current-change="handleCurrentChange"></ui-page>
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
      brs: [{ name: "商品分类", to: { name: "goodsTypeManager" } }],
      date: [],
      queryMap: {
        pageNo: 1,
        pageSize: 10
      },
      tableData: [],
      total: null,
      viewImg:viewImg
    };
  },
  created(){
    this.$route.query.pageNo ? this.queryMap.pageNo = parseInt(this.$route.query.pageNo) : 1
    this.getTableData();
  },
  mounted() {
    
  },
  methods: {
    toDeleted(row) {
      this.$confirm("是否确认删除该商品分类", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.$post("goodsTypeSave", { id: row.id, deleted: "Y" }).then(res => {
            this.getTableData();
            this.$message({ message: "删除商品分类成功", type: "success",center:true });
          });
        })
        .catch(() => {});
    },
    toAddGoodsType() {
      this.$to({ name: "goodsTypeInsert" });
    },
    getTableData() {
      let loadingInstance = Loading.service({ fullscreen: true });
      this.$post("goodsTypeList", this.queryMap)
        .then(res => {
          this.tableData = res.list;
          this.total = res.total;
          loadingInstance.close();
        })
        .catch(() => {
          loadingInstance.close();
        });
    },
    toEditGoodsType(row) {
      // this.$to({ name: "goodsTypeEdit", query: row });
      this.$to({ name: "goodsTypeEdit", query: {id:row.id,pageNo:this.queryMap.pageNo} });
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