<template>
    <ui-layout :brs="brs">
        <ui-container>
            <el-row>
                <el-form :inline="true" :model="formData" class="demo-form-inline" ref="formData" label-position="right" label-width="120px">
                    <el-col>
                        <el-row>
                            <el-form-item label="用户名" prop="name">
                                <el-input v-text="formData.name"></el-input>
                            </el-form-item>
                        </el-row>
                        <el-row>
                            <el-form-item label="真实姓名" prop="nickName">
                                <el-input v-model="formData.nickName"></el-input>
                            </el-form-item>
                        </el-row>
                        <el-row>
                            <el-form-item label="会员等级" prop="memberTypeId">
                                <el-select  v-model="formData.memberTypeId" placeholder="" size ="18">
                                        <el-option
                                            v-for="item in memberTypeArr"
                                            :key="item.name"
                                            :label="item.name"
                                            :value="item.id">
                                        </el-option>
                                </el-select>
                            </el-form-item>
                        </el-row>
                        <el-row>
                            <el-form-item label="所属门店" prop="platform">
                                <el-select  v-model="formData.platform" placeholder="" size ="18">
                                        <el-option
                                            v-for="item in shopArr"
                                            :key="item.name"
                                            :label="item.name"
                                            :value="item.id">
                                        </el-option>
                                </el-select>
                            </el-form-item>
                        </el-row>
                        <el-row>
                            <el-form-item label="加入黑名单" prop="blacklist">
                                <div>
                                 <template>
                                    <el-radio v-model="formData.blacklist" label="Y">开启</el-radio>
                                    <el-radio v-model="formData.blacklist" label="N">关闭</el-radio>
                                </template>
                                </div>
                                <div style="font-size:10px;color:red">
                                      加入黑名单后用户将无法下单
                                </div>
                            </el-form-item>
                        </el-row>

                    </el-col>
                    <el-col>
                         <el-row>
                            <el-form-item label="联系方式" prop="contactInformation">
                                <el-input v-model="formData.contactInformation"></el-input>
                            </el-form-item>
                        </el-row>
                       <el-row>
                            <el-form-item label="备注" prop="remark">
                                <el-input v-model="formData.remark"></el-input>
                            </el-form-item>
                        </el-row>
                        <el-row>
                            <el-form-item label="注册时间" prop="createTime">
                                <span>{{formData.createTime | dateFmt('yyyy-MM-dd')}}</span>
                            </el-form-item>
                        </el-row>
                    </el-col>
                    <el-col>
                        <el-row>
                            <el-form-item label=" ">
                                <div class="margin20 marginleft150px">
                                    <el-button type="primary" @click="toMemberSave">确认修改</el-button>
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
export default {
  components: { Loading },
  data() {
    return {
      brs: [{ name: "编辑用户", to: { name: "userDetail" } }],
      //查询会员类型
      queryMemberTypeMap: {
        pageNo: 1,
        pageSize: 1000
      },
      formData: {
        nickName: null,
        memberTypeId: null,
        blacklist: null,
        contactInformation: null,
        remark: null,
        createTime: null,
        platform:null,
        pageNo:null
      },
      //会员类型
      memberTypeArr: [],
      //门店列表
      shopArr:[]
    };
  },
  mounted() {
    this.pageNo = this.$route.query.pageNo;
    this.formData = this.$route.query.row;
    this.getMemberTypeList();
    this.getShopList();
  },
  methods: {
     //门店列表
    getShopList() {
      let loadingInstance = Loading.service({ fullscreen: true });
      this.$post("shopNoPageList")
        .then(res => {
          this.shopArr = res;
          loadingInstance.close();
        })
        .catch(() => {
          loadingInstance.close();
        });
    }, 
    //会员类型列表
    getMemberTypeList() {
      let loadingInstance = Loading.service({ fullscreen: true });
      this.$post("memberTypeList", this.queryMemberTypeMap)
        .then(res => {
          this.memberTypeArr = res.list;
          loadingInstance.close();
        })
        .catch(() => {
          loadingInstance.close();
        });
    },
    toMemberSave() {
      this.$refs["formData"].validate(valid => {
        if (valid) {
          let loadingInstance = Loading.service({ fullscreen: true });
          this.$post("memberSave", this.formData)
            .then(res => {
              this.$message({
                type: "success",
                message: "编辑会员成功!",
                center: true
              });
            //   this.$to({ name: "memberManager" });
              this.$to({ name: "memberManager",query:{pageNo:this.pageNo} });
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
</style>