<template>
    <ui-layout :brs="brs">
        <ui-container>
                <el-form :inline="true" :model="formData" ref="formData" class="demo-form-inline" label-position="center" label-width="100px">
                    <el-col >
                        <!-- <el-row :span="12">
                            <el-form-item label="QQ">
                                <el-input v-model="formData.qq" style="width:300px;"></el-input>
                            </el-form-item>
                        </el-row> -->
                        <!-- <el-row :span="12">
                            <el-form-item label="微信">
                                <el-input v-model="formData.wx" style="width:300px;"></el-input>
                            </el-form-item>
                        </el-row> -->
                        <el-row :span="12">
                            <el-form-item label="电话">
                                <el-input v-model="formData.tel" style="width:300px;"></el-input>
                            </el-form-item>
                        </el-row>

                        <el-row>
                            <el-form-item label=" ">
                                <div style="margin-left:50px;margin-top:100px;">
                                    <el-button type="primary" @click="toEdit">确认修改</el-button>
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
export default {
  components: { Loading },
  data() {
    return {
      editorOption: {},
      brs: [{ name: "编辑客服配置", to: { name: "bannerEdit" } }],
      formData: {
        qq: null,
        wx:null,
        tel:null
      },
    };
  },
 
  mounted() {
     this.formData = this.$route.query;
  },
  methods: {
    toEdit() {
      this.$refs["formData"].validate(valid => {
        if (valid) {
          let loadingInstance = Loading.service({ fullscreen: true });
          this.$post("configSave", this.formData)
            .then(res => {
              this.$message({
                showClose: true,
                message: "编辑客服配置成功",
                type: "success",
                center:true
              });
              this.$to({ name: "configManager" });
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