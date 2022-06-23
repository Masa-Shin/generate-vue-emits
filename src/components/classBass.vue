<template>
  <ul class="p-header__pulldown-list">
    <li><router-link to="/account">アカウント設定</router-link></li>
    <li><router-link to="/settings/member_list">管理設定</router-link></li>
    <li>
      <router-link to="/mailbox/mail_templates"
        >メールテンプレート設定</router-link
      >
    </li>
    <li>
      <router-link to="/comment_templates/new"
        >コメントテンプレート設定</router-link
      >
    </li>
    <li><ProtectedLink href="/logout">ログアウト</ProtectedLink></li>
  </ul>
</template>

<script lang="ts">
import Component from "vue-class-component";
import Vue from "vue-property-decorator";

@Component
export default class extends Vue {
  public count = 0;
  @Emit("push")
  public push(): void {
    // no return
  }

  public countUp(): void {
    this.count++;
  }

}
</script>

<style lang="scss" scoped>
a {
  cursor: pointer;
  white-space: nowrap;
}
</style>
