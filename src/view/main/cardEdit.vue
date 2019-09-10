<template>
    <ui-layout :brs="brs">
        <ui-container>
            <el-row>
                <el-form :inline="true" :model="formData" ref="formData" class="demo-form-inline" label-position="left" label-width="100px">
                   
                    <el-col>
                        <el-row :span="7">
                            <el-form-item label="卡券名称">
                                <el-input v-model="formData.name"></el-input>
                            </el-form-item>
                        </el-row>
                        <el-row :span="7">
                            <el-form-item label="卡券图片">
                                        <el-upload
                                            class="avatar-uploader"
                                            action="http://localhost:8085/taoyy/taoyy/file/upload"
                                            :show-file-list="false"
                                            :on-success="handleAvatarSuccessType"
                                            >
                                            <!-- :before-upload="beforeAvatarUpload" -->
                                            <img v-if="formData.imgSrc" :src="formData.imgSrc" class="avatar">
                                            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                                            </el-upload>
                            </el-form-item>
                        </el-row>
                        <el-row :span="7">
                            <el-form-item label="卡券描述">
                                <el-input v-model="formData.description" type="textarea" :rows="3" style="width:300px;"></el-input>
                            </el-form-item>
                        </el-row>
                        
                    </el-col>
                    <el-col>
                        <el-row>
                            <el-form-item label=" ">
                                <div class="margin20">
                                    <el-button type="primary" @click="toCardEdit">确认修改</el-button>
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
import { viewImg } from "../../../config/project/project.env"; //图片预览
export default {
  components: { Loading },
  data() {
    return {
      brs: [{ name: "编辑卡券", to: { name: "cardEdit" } }],
      formData: {
        name:null,
        imgSrc:null,
        description:null
      },
      //预览框
      dialogVisible: false,
      viewImg:viewImg
    };
  },
  mounted() {
    this.getCardDetail();
  },
  methods: {
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
    handleAvatarSuccessType(res, file) {
      this.imageUrl = URL.createObjectURL(file.raw);
      this.formData.imgSrc = res.data;
    },
    toCardEdit() {
      let loadingInstance = Loading.service({ fullscreen: true });
      this.$post("cardSave", this.formData)
        .then(res => {
          this.$message({ message: "编辑卡券成功", type: "success", center: true });
          loadingInstance.close();
          this.$to({ name: "cardManager" });
        })
        .catch(() => {
          loadingInstance.close();
        });
    },
    getCardDetail() {
      let loadingInstance = Loading.service({ fullscreen: true });
      this.$get("cardDetail", this.$route.query.id)
        .then(res => {
          this.formData = res;
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