<template>
    <ui-layout :brs="brs">
        <ui-container>
          <el-row>
                <el-form :inline="true" class="demo-form-inline">
                    <el-row >
                            <el-form-item label=" ">
                                <el-button type="primary" @click="toAddCoupon">
                                    <i class="el-icon-circle-plus-outline"></i>
                                    <span>添加优惠券</span>
                                </el-button>
                            </el-form-item>
                    </el-row>
                </el-form>
            </el-row>
            <el-row>
                <el-col>
                    <el-table :data="tableData" border style="max-width:80%;">
                        <el-table-column prop="id" label="ID" width="50" align="center"></el-table-column>
                        <el-table-column prop="name" label="优惠券名称" width="200" align="center"></el-table-column>
                        <el-table-column prop="mininumConsume" label="最低消费金额（元）" width="200" align="center"></el-table-column>
                        <el-table-column prop="couponMoney" label="	优惠方式" width="150;" align="center">
                          <template slot-scope="scope" >
                                    <span>优惠：{{scope.row.couponMoney}}元</span>
                            </template>
                        </el-table-column>
                        <el-table-column prop="" label="	有效时间" align="center" width="200;">
                            <template slot-scope="scope" >
                                <span v-if="scope.row.timeLimit != null && scope.row.timeLimit != ''">
                                    <span>领取{{scope.row.timeLimit}}天过期</span>
                                </span>
                                <span v-if="scope.row.startTime != null && scope.row.startTime != '' && scope.row.endTime != null && scope.row.endTime != ''">
                                    <span>{{scope.row.startTime | dateFmt('yyyy-MM-dd')}}~{{scope.row.endTime | dateFmt('yyyy-MM-dd')}}</span>
                                </span>   
                            </template>
                        </el-table-column>
                        <el-table-column prop="" label="	数量" align="center" width="260;">
                            <template slot-scope="scope" >
                                    <span v-if="scope.row.remain == 0">总数量：{{scope.row.count}},剩余数量：不限量</span>
                                    <span v-if="scope.row.remain != 0">总数量：{{scope.row.count}},剩余数量：{{scope.row.remain}}</span>
                            </template>
                        </el-table-column>
                        <el-table-column prop="getCenter" label="	加入领券中心" width="150;" align="center">
                              <template slot-scope="scope" >
                                  <span v-if="scope.row.getCenter == 'Y'" v-text="'加入'"></span>
                                  <span v-if="scope.row.getCenter == 'N'" v-text="'不加入'"></span>
                              </template>
                        </el-table-column>
                        <el-table-column prop="sort" label="	排序" align="center"></el-table-column>
                        <el-table-column label="操作"  fixed="right" align="center" width="300;">
                            <template slot-scope="scope">
                                <el-button  @click="toEdit(scope.row)" type="text" size="small">编辑</el-button>
                                <el-button  @click="toDetail(scope.row)" type="text" size="small">发放</el-button>
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
      brs: [{ name: "优惠券管理", to: { name: "couponManager" } }],
      total: null,
      queryMap: {
        pageNo: 1,
        pageSize: 10
      },
      tableData: []
    };
  },
  mounted() {
    this.getTableData();
  },
  methods: {
    toAddCoupon() {
      this.$to({ name: "couponInsert" });
    },
    //删除
    toDeleted(row) {
      this.$confirm("是否确认删除?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
          this.$post("couponSave", { id: row.id, deleted: "Y" }).then(res => {
            this.getTableData();
            this.$message({
              message: "删除优惠券成功",
              type: "success",
              center: true
            });
          });
        }).catch(() => {});
    },
    getTableData() {
      let loadingInstance = Loading.service({ fullscreen: true });
      this.$post("couponList", this.queryMap)
        .then(res => {
          this.tableData = res.list;
          this.total = res.total;
          loadingInstance.close();
        })
        .catch(() => {
          loadingInstance.close();
        });
    },
    toDetail(row){
      this.$to({ name: "couponDetail", query: row });  
    },
    toEdit(row) {
      this.$to({ name: "couponEdit", query: row });
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