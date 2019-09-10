<template>
    <ui-layout :brs="brs">
        <ui-container>
            <el-row>
                <el-form :inline="true" :model="formData" ref="formData" class="demo-form-inline" label-position="left" label-width="100px">
                   
                    <el-col>
                        <el-row :span="7">
                            <el-form-item label="评价">
                                <el-input v-model="formData.content" type="textarea" :rows="3" style="width:225px;"></el-input>
                            </el-form-item>
                        </el-row>
                        <el-row :span="7">
                            <el-form-item label="评分">
                                <template>
                                    <el-radio v-model="formData.type" label="1">好评</el-radio>
                                    <el-radio v-model="formData.type" label="2">中评</el-radio>
                                    <el-radio v-model="formData.type" label="3">差评</el-radio>
                                </template>
                            </el-form-item>
                        </el-row>
                    </el-col>
                    <el-col>
                        <el-row>
                            <el-form-item label=" ">
                                <div class="margin20">
                                    <el-button type="primary" @click="goodsReviewEdit">确认修改</el-button>
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
      brs: [{ name: "编辑评价", to: { name: "goodsReviewEdit" } }],
      formData: {}
    };
  },
  mounted() {
    this.getGoodsReviewDetail();
  },
  methods: {
    goodsReviewEdit() {
      let loadingInstance = Loading.service({ fullscreen: true });
      this.$post("goodsReviewSave", this.formData)
        .then(res => {
          this.$message({ message: "编辑评论成功", type: "success", center: true });
          loadingInstance.close();
          this.$to({ name: "goodsReviewManager" });
        })
        .catch(() => {
          loadingInstance.close();
        });
    },
    getGoodsReviewDetail() {
      let loadingInstance = Loading.service({ fullscreen: true });
      this.$get("goodsReviewDetail", this.$route.query.id)
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
.imgcontainer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  > div {
    text-align: center;
    > p {
      margin-bottom: 20px;
      position: relative;
      .imgUpload {
        width: 152px;
        height: 32px;
        position: absolute;
        top: 0;
        left: 74px;
        opacity: 0;
        z-index: 10;
        cursor: pointer;
      }
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