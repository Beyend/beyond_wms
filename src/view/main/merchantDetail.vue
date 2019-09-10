<template>
    <ui-layout :brs="brs">
        <ui-container>
            <el-row>
                <el-form :inline="true" :model="formData" class="demo-form-inline" ref="formData" label-position="center" label-width="120px">
                    <el-col>
                        <el-row>
                            <el-form-item label="店铺名称" prop="name">
                                <el-input v-model="formData.name"></el-input>
                            </el-form-item>
                        </el-row>

                        <el-row :span="12">
                            <el-form-item label="店铺图片" prop="imgSrc">
                                <el-upload
                                    class="avatar-uploader"
                                    action="http://120.78.179.55:80/taoyy/file/upload"
                                    :show-file-list="false"
                                    :on-success="handleAvatarSuccess"
                                    >
                                    <img v-if="formData.imgSrc" :src="formData.imgSrc" class="avatar">
                                    <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                                    <!-- :before-upload="beforeAvatarUpload" -->
                                    </el-upload>
                            </el-form-item>
                        </el-row>
                    </el-col>
                    <el-col>
                        <el-row>
                            <el-form-item label="店主名" prop="master">
                                <el-input v-model="formData.master"></el-input>
                            </el-form-item>
                        </el-row>
                        <el-row>
                            <el-form-item label="角色">
                                 <el-select filterable v-model="formData.roleId" placeholder="请选择" @change="roleChange" style="width:200px;">
                                    <el-option v-for="i in roleArr" :key="i.name" :label="i.name" :value="i.id"></el-option>
                                </el-select>
                            </el-form-item>
                        </el-row>
                        <el-row>
                            <el-form-item label="店铺QQ" prop="merchantQq">
                                <el-input v-model="formData.merchantQq"></el-input>
                            </el-form-item>
                        </el-row>
                        <el-row>
                            <el-form-item label="客服QQ" prop="serviceQq">
                                <el-input v-model="formData.serviceQq"></el-input>
                            </el-form-item>
                        </el-row>
                        <el-row>
                            <el-form-item label="客服微信" prop="serviceWx">
                                <el-input v-model="formData.serviceWx"></el-input>
                            </el-form-item>
                        </el-row>
                        <el-row>
                            <el-form-item label="客服电话" prop="telephone">
                                <el-input v-model="formData.telephone"></el-input>
                            </el-form-item>
                        </el-row>
                        <el-row>
                            <el-form-item label="邮箱" prop="email">
                                <el-input v-model="formData.email"></el-input>
                            </el-form-item>
                        </el-row>
                        <el-row>
                            <el-form-item label="收款账号" prop="account">
                                <el-input v-model="formData.account"></el-input>
                            </el-form-item>
                        </el-row>
                        <el-row>
                            <el-form-item label="联系方式" prop="contactInformation">
                                <el-input v-model="formData.contactInformation"></el-input>
                            </el-form-item>
                        </el-row>
                    </el-col>
                    <el-col>
                        <el-row>
                            <el-form-item label=" ">
                                <div class="margin20 marginleft150px">
                                    <el-button type="primary" @click="toMerchantSave">确认新增</el-button>
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
import { Loading } from "element-ui";
import { viewImg } from "../../../config/project/project.env"; //图片预览
export default {
  components: { Loading },
  data() {
    return {
      brs: [{ name: "新增商户", to: { name: "merchantDetail" } }],
      viewImg:viewImg,  
      formData: {
        name: null,
        imgSrc: null,
        master: null,
        roleId:null,
        merchantQq: null,
        serviceQq:null,
        serviceWx: null,
        telephone:null,
        email: null,
        account:null,
        contactInformation:null,
        createTime:null
      },
      queryMap:{
        pageNo:1,
        pageSize:100
      },
      roleArr:[]
    };
  },
  mounted() {
    this.formData = this.$route.query;
    this.getRoleList();
  },
  methods: {
    getRoleList() {
      this.$post("roleList",this.queryMap).then(res => {
          this.roleArr = res.list;
      });
    },
    roleChange(val){
      this.formData.roleId = val;
    },
    handleAvatarSuccess(res, file) {
      this.formData.imgSrc = URL.createObjectURL(file.raw);
      this.formData.imgSrc = res.data;
    },
    //单图上传
    beforeAvatarUpload(file) {
      const isJPG = file.type === "image/jpeg";
      const isLt2M = file.size / 1024 / 1024 < 2;
      if (!isJPG) {
        this.$message.error("上传图片只能是 JPG 格式!");
      }
      if (!isLt2M) {
        this.$message.error("上传图片大小不能超过 2MB!");
      }
      return isJPG && isLt2M;
    },  
    toMerchantSave() {
      this.$refs["formData"].validate(valid => {
        if (valid) {
          let loadingInstance = Loading.service({ fullscreen: true });
          this.$post("merchantSave", this.formData)
            .then(res => {
              this.$message({
                type: "success",
                message: "编辑商户成功!",
                center: true
              });
              this.$to({ name: "merchantManager" });
              loadingInstance.close();
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
.imgcontainer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  > div {
    text-align: center;
    > p {
      margin-bottom: 20px;
    }
    > div {
      border: 1px solid #999;
      padding: 10px;
      width: 300px;
      height: 300px;
      > img {
        max-width: 280px;
        max-height: 280px;
      }
    }
  }
}
.margintop20 {
  margin-top: 20px;
}
.tenzi {
  content: "";
  display: block;
  border: 0;
  background-color: #9b9b9b;
  border-radius: 5px;
  position: absolute;
}
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