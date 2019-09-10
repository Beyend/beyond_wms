<template>
    <div class="main">
        <div class="main-header">
            <ui-header>
                <div slot="right" class="teaHeaderRight">
                    <el-dropdown @command="handleCommand">
                        <span class="el-dropdown-link">
                            <span class="teaHeaderRightText">Hello,{{userName}}</span>
                            <img class="loginOutIcon" src="../assets/img/loginout.png" alt="">
                        </span>
                        <el-dropdown-menu slot="dropdown">
                            <el-dropdown-item command="loginOut">退出登录</el-dropdown-item>
                        </el-dropdown-menu>
                    </el-dropdown>
                </div>
            </ui-header>
        </div>
        <div class="main-body">
            <div class="main-side">
                <ui-side>
                        <el-submenu index="1">
                          <template slot="title">
                              <i class="el-icon-tickets"></i>
                              <span>权限管理</span>
                          </template>
                          <el-menu-item-group>
                              <el-menu-item  index="1-1" @click="$to({name:'userManager'})">用户管理</el-menu-item>
                              <el-menu-item  index="1-2" @click="$to({name:'roleManager'})">角色管理</el-menu-item>
                              <el-menu-item  index="1-3" @click="$to({name:'menuManager'})">权限管理</el-menu-item>
                          </el-menu-item-group>
                        </el-submenu>
                </ui-side>
            </div>
            <div class="main-container">
                <router-view></router-view>
            </div>
        </div>
    </div>
</template>

<script>
import UiHeader from "./../components/UiHeader";
import UiSide from "./../components/UiSide";
import { Loading } from "element-ui";
export default {
  components: { UiHeader, UiSide, Loading },
  data() {
    return {
      userName: null,
      arrs: []
    };
  },
  mounted() {
    this.userName = localStorage.getItem("name");
    this.arrs = localStorage.getItem("privileges");
  },
  methods: {
    handleCommand(command) {
      if (command == "loginOut") {
        let loadingInstance = Loading.service({ fullscreen: true });
        this.$post("userLogout")
          .then(res => {
            loadingInstance.close();
            this.$router.replace({ name: "login" });
          })
          .catch(() => {
            loadingInstance.close();
            this.$router.replace({ name: "login" });
          });
      }
    }
  },
  computed: {
  }
};
</script>

<style lang="less">
@import "../style/variables.less";
.teaLogo {
  color: #fff;
  font-size: 24px;
  > img {
    height: 40px;
  }
}
.teaHeaderRight {
  .teaHeaderRightText {
    color: #fff;
  }
  .loginOutIcon {
    vertical-align: middle;
    margin-left: 20px;
  }
}
.main {
  display: flex;
  flex-direction: column;
  height: 100%;
  .main-body {
    display: flex;
    flex: 1;
    flex-direction: row;
    .main-side {
      flex-shrink: 0;
    }
    .main-container {
      flex: 1;
      width: 100%;
    }
  }
  .el-submenu .el-menu-item {
    height: 40px;
    line-height: 40px;
  }
}
.el-icon-165 {
  &::before {
    content: "\00A5";
  }
}
</style>
