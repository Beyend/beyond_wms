<template>
    <ui-layout :brs="brs">
        <ui-container>
            <el-row>
                <el-form :inline="true" :model="formData" ref="formData" class="demo-form-inline" label-position="right" label-width="140px">
                   
                    <el-col>
                        <el-row :span="7">
                            <el-form-item label="优惠券名称">
                                <el-input v-model="formData.name"></el-input>
                            </el-form-item>
                        </el-row>
                        <el-row :span="7">
                            <el-form-item label="优惠券类型">
                                <template>
                                    <el-radio v-model="formData.type" label="满减券"></el-radio>
                                </template>
                            </el-form-item>
                        </el-row>
                        <el-row :span="7">
                            <el-form-item label="最低消费金额（元）" prop="mininumConsume" :rules="[{ type: 'number', message: '最低消费金额必须为数字值'}]">
                                <div >
                                    <el-input placeholder="请输入内容" v-model.number="formData.mininumConsume" autocomplete="off" type="number">
                                        <template slot="append">元</template>
                                    </el-input>
                                    <div style="font-size:10px;color:#636c72;">
                                          购物金额（不含运费）达到最低消费金额才可使用优惠券，无门槛优惠券请填0
                                    </div>
                                </div>
                            </el-form-item>
                        </el-row>
                        <el-row :span="7">
                            <el-form-item label="优惠金额（元）" prop="couponMoney" :rules="[{ type: 'number', message: '优惠金额必须为数字值'}]">
                                <div >
                                    <el-input placeholder="请输入内容" v-model.number="formData.couponMoney" autocomplete="off" type="number">
                                        <template slot="append">元</template>
                                    </el-input>
                                    <div style="font-size:10px;color:red;">
                                             注：优惠券只能抵消商品金额，不能抵消运费，商品金额最多优惠到0.01元
                                    </div>
                                </div>
                            </el-form-item>
                        </el-row>
                        <el-row :span="7">
                            <el-form-item label="优惠券有效期">
                                <template>
                                    <el-radio v-model="couponType" label="false">领取后N天内有效</el-radio>
                                    <el-radio v-model="couponType" label="true">时间段</el-radio>
                                </template>
                            </el-form-item>
                        </el-row>
                        <el-row :span="7">
                            <span v-if="couponType == 'false'">
                                <el-form-item label="有效天数" prop="timeLimit" :rules="[{ type: 'number', message: '有效天数必须为数字值'}]">
                                    <template>
                                        <el-input v-model.number="formData.timeLimit" autocomplete="off" type="number"></el-input>
                                    </template>
                                </el-form-item>
                            </span>
                            <span v-if="couponType == 'true'">
                                <el-form-item label="有效期范围">
                                     <el-date-picker v-model="startTimeNull" @change="getSearchTime" placeholder="开始日期" style="width:130px;">
                                         <template slot="prepend">开始日期</template>
                                     </el-date-picker>
                                     <el-date-picker v-model="endTimeNull" @change="getSearchTime" placeholder="结束日期" style="width:130px;">
                                         <template slot="prepend">结束日期</template>
                                     </el-date-picker>
                                </el-form-item>
                            </span>
                        </el-row>
                        <el-row :span="7">
                            <el-form-item label="加入领券中心">
                                <template>
                                    <el-radio v-model="formData.getCenter" label="Y">加入</el-radio>
                                    <el-radio v-model="formData.getCenter" label="N">不加入</el-radio>
                                </template>
                            </el-form-item>
                        </el-row>
                        <el-row :span="7" v-if="formData.getCenter == 'Y'">
                            <el-form-item label="发放总数">
                                <template>
                                    <el-input v-model.number="formData.count" autocomplete="off" type="number"></el-input>
                                </template>
                                <div style="font-size:10px;color:red">
                                      注：优惠券总数量，没有不能领取或发放,-1为不限制张数<br/>
                                      注：优惠券总数量只限制领券中心领取的优惠券数量
                                </div>
                            </el-form-item>
                        </el-row>
                        <el-row :span="7">
                            <el-form-item label="排序">
                                <template>
                                    <el-input v-model.number="formData.sort" autocomplete="off" type="number"></el-input>
                                </template>
                                <div style="font-size:10px;color:red">
                                      注：排序按升序排列
                                </div>
                            </el-form-item>
                        </el-row>
                        <el-row :span="7">
                            <el-form-item label="指定商品类别或商品">
                                <template>
                                    <el-button type="text" @click="dialogTableVisibleGoodsType = true">指定商品类别</el-button>
                                    <el-button type="text" @click="dialogTableVisibleGoods = true">指定商品</el-button>
                                </template>
                            </el-form-item>
                        </el-row>
                         <el-dialog  title="添加商品类别"  style="width:50%;margin-left:500px;" :visible.sync="dialogTableVisibleGoodsType">
                                <span>
                                    <el-form :inline="true" :model="queryMap" ref="queryMap"  class="demo-form-inline"  >
                                        <el-col>
                                            <el-row>
                                                <el-col>
                                                    <el-form-item label="">
                                                        <el-form-item label="">
                                                            <el-input v-model="queryMap.name4Like" placeholder="请输入商品类别查找" clearable >
                                                            </el-input>
                                                        </el-form-item>
                                                    </el-form-item>
                                                    <el-button type="primary" @click="getGoodsType">
                                                                <i class="el-icon-search"></i>
                                                                <span>查询</span>
                                                    </el-button>
                                                </el-col>
                                            </el-row>
                                        </el-col>
                                    </el-form>
                                </span>
                                <el-table :data="tableDataGoodsType" border style="width:300px;" height="300" @selection-change="handleSelectionChangeGoodsType">
                                        <el-table-column type="selection" width="55"></el-table-column>
                                        <el-table-column prop="name"  style="width:300px;" align="center"></el-table-column>
                                </el-table>
                                <span slot="footer" class="dialog-footer">
                                    <el-button type="primary" @click="goodsTypeConfirm">确 定</el-button>
                                </span>
                         </el-dialog>

                         <el-dialog  title="添加商品"  style="width:60%;margin-left:400px;" :visible.sync="dialogTableVisibleGoods">
                                <span>
                                    <el-form :inline="true" :model="queryMap" ref="queryMap"  class="demo-form-inline"  >
                                        <el-col>
                                            <el-row>
                                                <el-col>
                                                    <el-form-item label="">
                                                        <el-form-item label="">
                                                            <el-input v-model="queryMap.name4Like" placeholder="请输入商品查找" clearable >
                                                            </el-input>
                                                        </el-form-item>
                                                    </el-form-item>
                                                    <el-button type="primary" @click="getGoods">
                                                                <i class="el-icon-search"></i>
                                                                <span>查询</span>
                                                    </el-button>
                                                </el-col>
                                            </el-row>
                                        </el-col>
                                    </el-form>
                                </span>
                                <el-table :data="tableDataGoods" border style="width:500px;" height="300" @selection-change="handleSelectionChangeGoods">
                                        <el-table-column type="selection" width="55"></el-table-column>
                                        <el-table-column prop="name"  style="width:300px;" align="center"></el-table-column>
                                </el-table>
                                <span slot="footer" class="dialog-footer">
                                    <el-button type="primary" @click="goodsConfirm">确 定</el-button>
                                </span>
                         </el-dialog>
                        <!-- <el-row :span="7" v-if="assignCouponType == 'false'">
                            <el-form-item label="添加商品类别">
                                <template>
                                     <el-input v-model="queryMap.name4Like" placeholder="商品类别" clearable style="width:150px;"></el-input>
                                     <el-button type="primary" @click="getSearch">
                                         <i class="el-icon-search"></i>
                                              <span>查询</span>
                                     </el-button>
                                </template>
                            </el-form-item>
                        </el-row>
                        <el-row :span="7" v-if="assignCouponType == 'true'">
                            <el-form-item label="添加商品">
                                <template>
                                     <el-input v-model="queryMap.name4Like" placeholder="商品名称" clearable style="width:150px;"></el-input>
                                     <el-button type="primary" @click="getSearch">
                                         <i class="el-icon-search"></i>
                                              <span>查询</span>
                                     </el-button>
                                </template>
                            </el-form-item>
                        </el-row> -->
                        <el-row :span="7">
                            <el-form-item label="使用说明">
                                <el-input v-model="formData.remark" type="textarea" :rows="3" style="width:300px;"></el-input>
                            </el-form-item>
                        </el-row>
                        
                    </el-col>
                    <el-col>
                        <el-row>
                            <el-form-item label=" ">
                                <div class="margin20">
                                    <el-button type="primary" @click="toCouponInsert">确认添加</el-button>
                                    <el-button type="primary" @click="$back()">关闭</el-button>
                                </div>
                            </el-form-item>
                        </el-row>
                    </el-col>
                </el-form>
            </el-row>
        </ui-container>
    </ui-layout>
</template>

<script>
import { Loading } from "element-ui";
import Citys from "../../utils/citys.js";
export default {
  components: { Loading },
  data() {
    return {
      startTimeNull: null,
      endTimeNull: null,
      brs: [{ name: "编辑优惠券", to: { name: "couponEdit" } }],
      formData: {
        name: null,
        type: "满减券",
        mininumConsume: null,
        couponMoney: null,
        timeLimit: 1,
        startTime: null,
        endTime: null,
        getCenter: null,
        count: -1,
        sort: 100,
        remark: null,
        //选中商品类型集合
        goodsTypes: [],
        //选中商品集合
        goodsDtos: []
      },
      //查询商品、商品类型列表
      queryMap: {
        pageNo: 1,
        pageSize: 10000,
        name4Like: null
      },
      couponType: "false",
      //   assignCouponType:"false",
      //商品类型列表
      tableDataGoodsType: [],
      //商品列表
      tableDataGoods: [],

      dialogTableVisibleGoodsType: false,
      dialogTableVisibleGoods: false
    };
  },
  mounted() {
    this.getGoodsType();
    this.getGoods();
    this.getCouponDetail();
  },
  methods: {
    getCouponDetail() {
      let loadingInstance = Loading.service({ fullscreen: true });
      this.$get("couponDetail", this.$route.query.id)
        .then(res => {
          this.formData = res.coupon;
          if (null != res.coupon.startTime && null != res.coupon.endTime) {
            this.couponType = "true";
            this.startTimeNull = res.coupon.startTime;
            this.endTimeNull = res.coupon.endTime;
          }
          this.tableDataGoodsType = res.goodsTypes;
          this.tableDataGoods = res.goodsDtos;
          this.formData.goodsTypes = res.goodsTypes;
          this.formData.goodsDtos = res.goodsDtos;
          loadingInstance.close();
        })
        .catch(() => {
          loadingInstance.close();
        });
    },
    //商品类勾选确定
    goodsTypeConfirm() {
      this.dialogTableVisibleGoodsType = false;
      console.log(this.formData.goodsTypes);
    },
    //商品勾选确定
    goodsConfirm() {
      this.dialogTableVisibleGoods = false;
      console.log(this.formData.goodsDtos);
    },
    //商品类勾选多行
    handleSelectionChangeGoodsType(val) {
      this.formData.goodsTypes = val;
    },
    //商品勾选多行
    handleSelectionChangeGoods(val) {
      this.formData.goodsDtos = val;
    },
    getGoods() {
      let loadingInstance = Loading.service({ fullscreen: true });
      this.$post("goodsManage", this.queryMap)
        .then(res => {
          this.tableDataGoods = res.list;
          loadingInstance.close();
        })
        .catch(() => {
          loadingInstance.close();
        });
    },
    getGoodsType() {
      let loadingInstance = Loading.service({ fullscreen: true });
      this.$post("childrenGoodsTypes", this.queryMap)
        .then(res => {
          this.tableDataGoodsType = res.list;
          loadingInstance.close();
        })
        .catch(() => {
          loadingInstance.close();
        });
    },
    dateChange() {
      if (this.date.length > 1) {
        this.formData.startTime = this.$getYMD(this.date[0]);
        this.formData.endTime = this.$getYMD(this.date[1]);
      }
    },
    //时间搜索
    getSearchTime() {
      this.formData.startTime = this.$getYMD(this.startTimeNull);
      this.formData.endTime = this.$getYMD(this.endTimeNull);
    },
    toCouponInsert() {
      let loadingInstance = Loading.service({ fullscreen: true });
      this.$post("couponSave", this.formData)
        .then(res => {
          this.$message({
            showClose: true,
            message: "编辑优惠券成功",
            type: "success"
          });
          this.$to({ name: "couponManager" });
          (this.formData.goodsDtos = null),
            (this.formData.goodsTypes = null),
            loadingInstance.close();
        })
        .catch(() => {
          loadingInstance.close();
        });
    }
  }
};
</script>

<style lang="less">
@import "../../style/teaend.less";
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}
.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>