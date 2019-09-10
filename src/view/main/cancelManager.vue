<template>
    <ui-layout :brs="brs">
        <ui-container>
            <el-row>
                <el-form :inline="true" :model="queryMap" class="demo-form-inline" label-width="100px">
                    <el-row>
                        <el-col :span="3">
                            <el-form-item label="">
                                <el-input v-model="queryMap.keyWord" placeholder="请输入昵称" clearable></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="6">
                            <el-form-item label=" ">
                                <el-button type="primary" @click="getTableData">
                                    <i class="el-icon-search"></i>
                                    <span>查询</span>
                                </el-button>
                                <el-button type="primary" @click="setCancelUser">
                                    <i class="el-icon-setting"></i>
                                    <span>添加核销员</span>
                                </el-button>
                            </el-form-item>
                        </el-col>
                    </el-row>
                </el-form>
            </el-row>
            <el-row>
                <el-col>
                    <el-table :data="tableData" border style="width: 80%">
                        <el-table-column prop="id" label="ID" align="center" width="100"></el-table-column>
                        <el-table-column prop="nickName" label="昵称" align="center" ></el-table-column>
                        <el-table-column prop="shopName" label="所属门店" align="center" width="260"></el-table-column>
                         <el-table-column prop="createTime" label="加入时间" align="center" width="120">
                            <template slot-scope="scope">
                                <span>{{scope.row.createTime | dateFmt('yyyy-MM-dd')}}</span>
                            </template>
                        </el-table-column>
                        <el-table-column prop="cancelOrder" label="核销订单数" align="center"></el-table-column>
                        <el-table-column prop="cancelMoney" label="核销总额" align="center" width="120"></el-table-column>
                        <el-table-column prop="cancelCard" label="核销卡券数" align="center"></el-table-column>
                        <el-table-column label="操作" width="300" fixed="right" align="center">
                            <template slot-scope="scope">
                                <el-button type="text" size="small" @click="toSave(scope.row)">解除核销员</el-button>
                                <el-button type="text" size="small" @click="toChangeShop(scope.row)">修改门店</el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                </el-col>
            </el-row>

            <el-dialog  title="设置核销员" :visible.sync="dialogVisibleSetCancelUser" width="40%" >
                <span>
                    <el-form :inline="true" :model="setCancelUserMap" ref="setCancelUserMap"  class="demo-form-inline" label-position="left" >
                        <el-col>
                            <el-row>
                                <el-col>
                                    <el-form-item label="选择门店">
                                        <el-select filterable v-model="setCancelUserMap.shopId"  @change="shopChange" size="25">
                                            <el-option v-for="item in shopList" :key="item.name" :label="item.name" :value="item.id"></el-option>
                                        </el-select>
                                    </el-form-item>
                                </el-col>
                                <el-col>
                                    <el-form-item label="查询用户">
                                        <el-form-item label="">
                                            <el-input v-model="noCancelQueryMap.keyWord" placeholder="请输入昵称查找" clearable style="width:252px;">
                                            </el-input>
                                            
                                        </el-form-item>
                                    </el-form-item>
                                    <el-button type="primary" @click="getNoCancelUser">
                                                <i class="el-icon-search"></i>
                                                <span>查询</span>
                                    </el-button>
                                </el-col>
                            </el-row>
                        </el-col>
                    </el-form>
                </span>
                <el-table :data="noCancelTableData" border style="width: 100%" height="300">
                        <el-table-column prop="id" label="ID" align="center" width="100"></el-table-column>
                        <el-table-column prop="nickName" label="昵称" align="center" ></el-table-column>
                        <el-table-column label="" width="300" fixed="right" align="center">
                            <template slot-scope="scope">
                                <el-button type="text" size="small" @click="setNoCancelUser(scope.row)">设为核销员</el-button>
                            </template>
                        </el-table-column>
                </el-table>
            </el-dialog>

            <el-dialog  title="修改核销员门店" :visible.sync="dialogVisibleShop" width="20%" >
                                <span>
                                    <el-form :inline="true" :model="changeShopMap" ref="changeShopMap"  class="demo-form-inline" label-position="left" >
                                        <el-col>
                                            <el-row>
                                              <el-form-item label="选择门店">
                                                    <el-select filterable v-model="changeShopMap.shopId"  @change="shopChange" size="25">
                                                        <el-option v-for="item in shopList" :key="item.name" :label="item.name" :value="item.id"></el-option>
                                                    </el-select>
                                                </el-form-item>
                                            </el-row>
                                        </el-col>
                                    </el-form>
                                </span>
                                <span slot="footer" class="dialog-footer">
                                    <el-button type="primary" @click="changeShopConfirm">确 定</el-button>
                                </span>
                </el-dialog>

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
      brs: [{ name: "核销员管理", to: { name: "cancelManager" } }],
      total: 100,
      queryMap: {
        pageNo: 1,
        pageSize: 10,
        keyWord: "",
        roleId: null,
        isCancelUser: "Y"
      },
      //查询门店列表
      shopMap: {
        pageNo: 1,
        pageSize: 1000
      },
      //修改门店参数
      changeShopMap: {
        id: null,
        shopId: null
      },
      //设置核销员参数
      setCancelUserMap: {
        id: null,
        shopId: null,
        isCancelUser: "Y"
      },
      //查询不是核销员列表参数
      noCancelQueryMap: {
        pageNo: 1,
        pageSize: 1000,
        isCancelUser: "Y",
        keyWord: ""
      },
      tableData: [],
      shopList: [],
      dialogVisibleShop: false,
      //设置核销员弹窗
      dialogVisibleSetCancelUser: false,
      //不是核销员列表
      noCancelTableData: []
    };
  },
  mounted() {
    this.getTableData();
    this.getShopList();
    this.getNoCancelUser();
  },
  methods: {
    //设置非核销员
    setNoCancelUser(val) {
      if (this.setCancelUserMap.shopId == null) {
        this.$message({
          showClose: true,
          message: "请选择门店",
          type: "warning",
          center: true
        });
        return;
      }
      this.setCancelUserMap.id = val.id;
      let loadingInstance = Loading.service({ fullscreen: true });
      this.$post("userSave", this.setCancelUserMap)
        .then(res => {
          this.dialogVisibleSetCancelUser = false;
          this.$message({
            showClose: true,
            message: "设置核销员成功",
            type: "success",
            center: true
          });
          this.setCancelUserMap.id = null;
          this.setCancelUserMap.shopId = null;
          this.getTableData();
          loadingInstance.close();
        })
        .catch(() => {
          loadingInstance.close();
        });
    },
    //设置核销员点击事件
    setCancelUser() {
       this.noCancelQueryMap.keyWord = "";
      this.getNoCancelUser();
      this.dialogVisibleSetCancelUser = true;
    },
    //获取不是核销员人员列表
    getNoCancelUser() {
      let loadingInstance = Loading.service({ fullscreen: true });
      this.$post("userList", this.noCancelQueryMap)
        .then(res => {
          this.noCancelTableData = res.list;
          loadingInstance.close();
        })
        .catch(() => {
          loadingInstance.close();
        });
    },
    //确定改变门店
    changeShopConfirm() {
      let loadingInstance = Loading.service({ fullscreen: true });
      this.$post("userSave", this.changeShopMap)
        .then(res => {
          this.dialogVisibleShop = false;
          this.$message({
            showClose: true,
            message: "修改门店成功",
            type: "success",
            center: true
          });
          this.changeShopMap.id = null;
          this.changeShopMap.shopId = null;
          this.getTableData();
          loadingInstance.close();
        })
        .catch(() => {
          loadingInstance.close();
        });
    },
    //选择门店
    shopChange(val) {
      this.changeShopMap.shopId = val;
    },
    //门店列表
    getShopList() {
      let loadingInstance = Loading.service({ fullscreen: true });
      this.$post("shopList", this.shopMap)
        .then(res => {
          this.shopList = res.list;
          loadingInstance.close();
        })
        .catch(() => {
          loadingInstance.close();
        });
    },
    //解除核销员
    toSave(val) {
      this.$confirm("是否确认解除核销员", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.$post("userSave", { id: val.id, isCancelUser: "N", shopId: 0 })
            .then(res => {
              this.$message({
                showClose: true,
                message: "解除核销员成功",
                type: "success",
                center: true
              });
              this.getTableData();
            })
            .catch(() => {});
        })
        .catch(() => {});
    },
    //修改门店
    toChangeShop(val) {
      this.changeShopMap.id = val.id;
      this.changeShopMap.shopId = val.shopId;
      this.dialogVisibleShop = true;
    },
    getTableData() {
      let loadingInstance = Loading.service({ fullscreen: true });
      this.$post("userList", this.queryMap)
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
</style>