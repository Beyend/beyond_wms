<template>
    <ui-layout :brs="brs">
        <ui-container style="height:50rem;overflow-y:scroll">
            <el-row>
                <el-form :inline="true" :model="formData" :rules="rules" ref="formData" class="demo-form-inline" label-position="center" label-width="110px">
                    <el-col>
                        <el-row :span="12">
                             <el-form-item label="等级"  prop="rank" :rules="[{ type: 'number', message: '等级必须为数字值'}]">
                                <el-input v-model.number="formData.rank" autocomplete="off" type="number"></el-input>
                                <div style="font-size:10px;">
                                      数字越大等级越高
                                </div>
                                <div style="font-size:10px;color:red;">
                                  会员满足条件等级从低到高自动升级，高等级不会自动降级<br/>
                                          如需个别调整，请前往<el-button  @click="toMemberTypeList()" type="text" size="small">会员列表</el-button>调整
                                </div>
                            </el-form-item>
                        </el-row>
                        <el-row :span="12">
                            <el-form-item label="等级名称" prop="name">
                                <el-input v-model="formData.name"></el-input>
                            </el-form-item>
                        </el-row>
                        <el-row :span="12">
                             <el-form-item label="升级条件"  prop="upCondition" :rules="[{ type: 'number', message: '升级条件必须为数字值'}]">
                                <el-input v-model.number="formData.upCondition" autocomplete="off" type="number">
                                  <template slot="prepend">累计完成订单金额满</template>
                                  <template slot="append">元</template>
                                </el-input>
                                <div style="font-size:10px;">
                                      会员升级条件
                                </div>
                            </el-form-item>
                        </el-row>
                        <el-row :span="12">
                             <el-form-item label="折扣"  prop="discount" :rules="[{ type: 'number', message: '折扣必须为数字值'}]">
                                <el-input v-model.number="formData.discount" autocomplete="off" type="number">
                                  <template slot="append">折</template>
                                </el-input>
                                <div style="font-size:10px;">
                                      请输入0.1~10之间的数字
                                </div>
                            </el-form-item>
                        </el-row>
                         <el-row :span="12">
                            <el-form-item label="会员等级状态" prop="status">
                                <template>
                                    <el-radio v-model="formData.status" label="Y">启用</el-radio>
                                    <el-radio v-model="formData.status" label="N">禁用</el-radio>
                                </template>
                            </el-form-item>
                        </el-row>
                        <el-row :span="12">
                            <el-form-item label="购买价格" prop="payMoney" :rules="[{ type: 'number', message: '购买价格必须为数字值'}]">
                                <div >
                                    <el-input placeholder="请输入内容" v-model.number="formData.payMoney" autocomplete="off" type="number">
                                        <template slot="append">元</template>
                                    </el-input>
                                </div>
                            </el-form-item>
                        </el-row>

                        <el-row :span="12">
                            <el-form-item label="会员图片">
                                        <el-upload
                                            class="avatar-uploader"
                                            action="http://120.78.179.55:80/taoyy/file/upload"
                                            :show-file-list="false"
                                            :on-success="handleAvatarSuccessType"
                                            >
                                            <!-- :before-upload="beforeAvatarUpload" -->
                                            <img v-if="formData.imgSrc" :src="formData.imgSrc" class="avatar">
                                            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                                            </el-upload>
                            </el-form-item>
                        </el-row>
                        <el-row :span="12">
                            <el-form-item label="会员权益" prop="equity">
                                <el-input v-model="formData.equity"  type="textarea" :rows="4" style="width:500px;"></el-input>
                            </el-form-item>
                        </el-row>
                        <el-row :span="12">
                            <el-form-item label="会员购买提示" prop="remark">
                                <el-input v-model="formData.remark"  type="textarea" :rows="4" style="width:500px;"></el-input>
                                <div style="font-size:10px;">
                                      购买此会员介绍
                                </div>
                            </el-form-item>
                            
                        </el-row>
                    <el-row>
                        <el-form-item label=" ">
                            <div class="margin20">
                                <el-button type="primary" @click="addMemberType">确认添加</el-button>
                                <el-button type="primary" @click="$back(-1)">关闭</el-button>
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
import Citys from "../../utils/citys.js";
import { Loading } from "element-ui";
import { viewImg } from "../../../config/project/project.env"; //图片预览
export default {
  components: { Loading },
  data() {
    return {
      brs: [{ name: "会员设置", to: { name: "memberTypeInsert" } }],
      formData: {
        rank: 0,
        name: null,
        upCondition: null,
        discount: null,
        payMoney: null,
        status: null,
        imgSrc:null,
        equity:null,
        remark:null
      },
      rules: {
        name: [
          { required: true, message: "请输入等级名称", trigger: "blur" }
        ],
        status: [
          { required: true, message: "请选择会员状态", trigger: "blur" }
        ]
      },
      imageUrl: "",
      viewImg:viewImg
    };
  },
  mounted() {
    this.getMemberTypeDetail();
  },
  methods: {
    getMemberTypeDetail(){
            let loadingInstance = Loading.service({fullscreen: true});
            this.$get('memberTypeDetail',this.$route.query.id).then((res)=>{
                this.formData = res;
                loadingInstance.close();
            }).catch(()=>{loadingInstance.close();})
        },
    toMemberTypeList(){
      this.$to({ name: "memberTypeList"});
    },
      //单图上传
    beforeAvatarUpload(file) {
      const isJPG = file.type === "image/jpeg";
      const isLt2M = file.size / 1024 / 1024 < 2;
      if (!isJPG) {
        this.$message.error("上传头像图片只能是 JPG 格式!");
      }
      if (!isLt2M) {
        this.$message.error("上传头像图片大小不能超过 2MB!");
      }
      return isJPG && isLt2M;
    },
    handleExceed(files) {
      this.$message.warning(
        `当前限制选择 1 个文件，本次选择了 ${files.length} 个文件`
      );
    },
    handleAvatarSuccessType(res, file) {
      this.imageUrl = URL.createObjectURL(file.raw);
      this.formData.imgSrc = res.data;
    },
    addMemberType() {
      this.$refs["formData"].validate(valid => {
        if (valid) {
          let loadingInstance = Loading.service({ fullscreen: true });
          this.$post("memberTypeSave", this.formData)
            .then(res => {
              this.$message({ message: "编辑会员分类成功", type: "success" ,center:true});
              loadingInstance.close();
              this.$to({ name: "memberTypeManager" });
            })
            .catch(() => {
              loadingInstance.close();
            });
        } else {
          return false;
        }
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