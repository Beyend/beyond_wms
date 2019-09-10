<template>
    <ui-layout :brs="brs">
        <ui-container style="height:50rem;overflow-y:scroll">
                <el-form :inline="true" :model="formData" ref="formData" class="demo-form-inline" label-position="center" label-width="100px">
                    <el-col >
                        <el-row :span="12">
                            <el-form-item label="门店名称">
                                <el-input v-model="formData.name" style="width:300px;"></el-input>
                            </el-form-item>
                        </el-row>
                  
                        <el-row :span="12">
                            <el-form-item label="联系方式">
                                <el-input v-model="formData.contactInformation" style="width:300px;"></el-input>
                            </el-form-item>
                        </el-row>

                        <el-row :span="12">
                            <el-form-item label="联系地址">
                                <el-input v-model="formData.address" style="width:300px;"></el-input>
                            </el-form-item>
                        </el-row>

                        <el-row :span="12">
                            <el-form-item label="门店大图" prop="bigImg">
                                <el-upload
                                    class="avatar-uploader"
                                    action="http://120.78.179.55:80/taoyy/file/upload"
                                    :show-file-list="false"
                                    :on-success="handleAvatarSuccessBig"
                                    >
                                    <!-- :before-upload="beforeAvatarUpload" -->
                                    <img v-if="formData.bigImg" :src="formData.bigImg" class="avatar">
                                    <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                                    </el-upload>
                            </el-form-item>
                        </el-row>
                  
                        <el-row :span="12">
                            <el-form-item label="门店小图" prop="smallImg">
                                <el-upload
                                    class="avatar-uploader"
                                    action="http://120.78.179.55:80/taoyy/file/upload"
                                    :show-file-list="false"
                                    :on-success="handleAvatarSuccessSmall"
                                    >
                                    <!-- :before-upload="beforeAvatarUpload" -->
                                    <img v-if="formData.smallImg" :src="formData.smallImg" class="avatar">
                                    <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                                    </el-upload>
                            </el-form-item>
                        </el-row>


                        <el-row :span="12">
                            <el-form-item label="门店评分" prop="grade"
                            :rules="[
                                            { type: 'number', message: '门店评分必须为数字值'}
                                    ]">
                                <el-input v-model.number="formData.grade" autocomplete="off" type="number"></el-input>
                                <div style="font-size:10px;color:red;">
                                      仅支持1~5的评分
                                </div>
                            </el-form-item>
                        </el-row>

                        <el-row :span="12">
                            <el-form-item label="营业时间">
                                <el-input v-model="formData.businessHours" style="width:300px;"></el-input>
                                <div style="font-size:10px;color:red;">
                                      格式：00:00-00:00
                                </div>
                            </el-form-item>
                        </el-row>
                   

                        <el-row :span="12">
                            <el-form-item label="门店介绍">
                                <div class="edit_container" >
                                    <quill-editor v-model="formData.intro" ref="myQuillEditor" class="editer" :options="editorOption" @ready="onEditorReady($event)" style="height:300px;">
                                    </quill-editor>
                                </div>
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
import { quillEditor } from "vue-quill-editor"; //调用编辑器
import "quill/dist/quill.core.css";
import "quill/dist/quill.snow.css";
import "quill/dist/quill.bubble.css";
import { viewImg } from "../../../config/project/project.env"; //图片预览
export default {
  components: { Loading },
  data() {
    return {
      editorOption: {},
      brs: [{ name: "添加门店", to: { name: "shopInsert" } }],
      formData: {
        name: null,
        contactInformation: null,
        address: null,
        bigImg: null,
        smallImg: null,
        grade: 5,
        businessHours: null,
        intro: null,
        isDefault: "N",
      },
      rules: {},
      viewImg:viewImg
    };
  },
  components: {
    //使用编辑器
    quillEditor
  },
  computed: {
    editor() {
      return this.$refs.myQuillEditor.quill;
    }
  },
  mounted() {
  },
  methods: {
      //富文本
    onEditorReady(editor) {
    },
    handleAvatarSuccessBig(res, file) {
      this.formData.bigImg = URL.createObjectURL(file.raw);
      this.formData.bigImg = res.data;
    },
    handleAvatarSuccessSmall(res, file) {
      this.formData.smallImg = URL.createObjectURL(file.raw);
      this.formData.smallImg = res.data;
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
          this.$post("shopSave", this.formData)
            .then(res => {
              this.$message({
                showClose: true,
                message: "新增门店成功",
                type: "success"
              });
              this.$to({ name: "shopManager" });
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