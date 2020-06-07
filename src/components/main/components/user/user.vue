<template>
  <div class="user-avatar-dropdown">
    <Dropdown @on-click="handleClick">
      <Badge>
        <Avatar :src="userAvatar"/>
      </Badge>
      <Icon :size="18" type="md-arrow-dropdown"></Icon>
      <DropdownMenu slot="list">
        <DropdownItem name="logout">退出登录</DropdownItem>
      </DropdownMenu>
    </Dropdown>
  </div>
</template>

<script>
  import './user.less'
  import {localRead} from '@/libs/util'

  export default {
    name: 'User',
    props: {
      userAvatar: {
        type: String,
        default: ''
      },
      messageUnreadCount: {
        type: Number,
        default: 0
      }
    },
    methods: {
      logout() {
        let logoutUrl = localRead('logoutUrl')
        window.location.href = logoutUrl + location.href
        // setTimeout(1000, () => {
        //   window.location.reload()
        // })
      },
      handleClick(name) {
        switch (name) {
          case 'logout':
            this.logout()
            break
        }
      }
    }
  }
</script>
