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
import { ProtectedLink } from 'lapras-frontend'

// test4

export default defineComponent({
  // test5
  name: 'ActiveUserMenuList',
  components: {
    ProtectedLink,
  },
  emits: { "defineComponent": null, "defineComponent2": null },
  setup(_props, { emit }) {
    const func = () => {
      // test1
      emit('defineComponent' /* test3 */) // test2
      emit('defineComponent2', { payload: 1 as number })
      setTimeout(() => {
        console.log(11111111)
      }, 0)
    }
  },
})
</script>

<style lang="scss" scoped>
a {
  cursor: pointer;
  white-space: nowrap;
}
</style>
