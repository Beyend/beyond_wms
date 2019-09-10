<template>
    <ui-layout :brs="brs">
        <ui-container>
                <el-form :inline="true" :model="formData" ref="formData" class="demo-form-inline" label-position="center" label-width="100px">
                    <el-col >
                        <el-row :span="12">
                            <el-form-item label="标题">
                                <el-input v-model="formData.name" style="width:300px;"></el-input>
                            </el-form-item>
                        </el-row>

                        <el-row :span="12">
                            <el-form-item label="排序" prop="grade"
                            :rules="[
                                            { type: 'number', message: '排序必须为数字值'}
                                    ]">
                                <el-input v-model.number="formData.sort" autocomplete="off" type="number"></el-input>
                            </el-form-item>
                        </el-row>

                        <el-row :span="12">
                            <el-form-item label="图片" prop="bigImg">
                                <el-upload
                                    class="avatar-uploader"
                                    action="http://120.78.179.55:80/taoyy/file/upload"
                                    :show-file-list="false"
                                    :on-success="handleAvatarSuccess"
                                    >
                                    <img v-if="formData.url" :src="formData.url" class="avatar">
                                    <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                                    <!-- :before-upload="beforeAvatarUpload" -->
                                    </el-upload>
                            </el-form-item>
                        </el-row>

                        <el-row>
                            <el-form-item label=" ">
                                <div style="margin-left:50px;margin-top:100px;">
                                    <el-button type="primary" @click="shopAddMethod">确认添加</el-button>
                                    <el-button type="primary" @click="$back()">关闭</el-button>
                                </div>
                            </el-form-item>
                        </el-row>
                    </el-col>
                </el-form>
           
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
      editorOption: {},
      brs: [{ name: "编辑轮播图", to: { name: "bannerEdit" } }],
      formData: {
        name: null,
        sort:null,
        url:null
      },
      rules: {},
      viewImg:viewImg
    };
  },
 
  mounted() {
     this.formData = this.$route.query;
  },
  methods: {
    handleAvatarSuccess(res, file) {
      this.formData.url = URL.createObjectURL(file.raw);
      this.formData.url = res.data;
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
    shopAddMethod() {
      this.$refs["formData"].validate(valid => {
        if (valid) {
          let loadingInstance = Loading.service({ fullscreen: true });
          this.$post("bannerSave", this.formData)
            .then(res => {
              this.$message({
                showClose: true,
                message: "编辑轮播图成功",
                type: "success",
                center:true
              });
              this.$to({ name: "bannerManager" });
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