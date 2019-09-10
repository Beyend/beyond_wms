<template>
    <ui-layout :brs="brs">
        <ui-container>
                <el-form :inline="true" :model="formData" ref="formData" class="demo-form-inline" label-position="center" label-width="100px">
                    <el-col >
                       <el-row :span="12">
                            <el-form-item label="内容">
                                <el-input type="textarea" :rows="6" v-model="formData.content" style="width:500px;"></el-input>
                            </el-form-item>
                        </el-row>

                        <el-row>
                            <el-form-item label=" ">
                                <div style="margin-left:50px;margin-top:100px;">
                                    <el-button type="primary" @click="shopAddMethod">确认修改</el-button>
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
      brs: [{ name: "编辑公告", to: { name: "noticeEdit" } }],
      formData: {
        content: null,
      },
    };
  },
 
  mounted() {
     this.formData = this.$route.query;
  },
  methods: {
    shopAddMethod() {
      this.$refs["formData"].validate(valid => {
        if (valid) {
          let loadingInstance = Loading.service({ fullscreen: true });
          this.$post("noticeSave", this.formData)
            .then(res => {
              this.$message({
                showClose: true,
                message: "编辑公告成功",
                type: "success",
                center:true
              });
              this.$to({ name: "noticeManager" });
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
</style>