<template>
  <div :class="[multipage === true ? 'multi-page':'single-page', 'not-menu-page', 'home-page']">
    <a-row :gutter="8" class="head-info" v-if="user.roleId == 74">
      <a-card class="head-info-card">
        <a-col :span="12">
          <div class="head-info-count">
            <div class="head-info-welcome">
              {{welcomeMessage}}
            </div>
            <div class="head-info-desc">
              <p>{{user.roleName ? user.roleName : '暂无角色'}}</p>
            </div>
            <div class="head-info-time">上次登录时间：{{user.lastLoginTime ? user.lastLoginTime : '第一次访问系统'}}</div>
          </div>
        </a-col>
        <a-col :span="12">
          <div>
            <a-row class="more-info" v-if="user.roleId == 74">
              <a-col :span="4"></a-col>
              <a-col :span="4"></a-col>
              <a-col :span="4">
                <head-info title="客户数量" :content="titleData.userNum" :center="false" :bordered="false"/>
              </a-col>
              <a-col :span="4">
                <head-info title="器材数量" :content="titleData.staffNum" :center="false" :bordered="false"/>
              </a-col>
              <a-col :span="4">
                <head-info title="员工数量" :content="titleData.roomNum" :center="false" :bordered="false"/>
              </a-col>
              <a-col :span="4">
                <head-info title="总收益" :content="titleData.amount" :center="false"/>
              </a-col>
            </a-row>
          </div>
        </a-col>
      </a-card>
    </a-row>
    <home v-if="user.roleId == 74" @setTitle="setTitleData"></home>
<!--    <work v-if="user.roleId == 75"></work>-->
    <a-row :gutter="8" class="count-info" style="margin-top: 15px" v-show="user.roleId == 1111">
      <a-col :span="12" class="visit-count-wrapper">
        <a-card class="visit-count" hoverable>
          <apexchart ref="count" type=bar height=300 :options="chartOptions" :series="series" />
        </a-card>
      </a-col>
    </a-row>
    <a-row :gutter="8" class="count-info">
      <a-col :span="16" class="visit-count-wrapper">
        <a-row :gutter="8">
          <a-col :span="24">
            <a-card hoverable>
              <weather></weather>
            </a-card>
          </a-col>
        </a-row>
      </a-col>
      <a-col :span="8" class="project-wrapper">
        <a-card hoverable title="公告信息">
          <div>
            <a-list item-layout="vertical" :pagination="pagination" :data-source="bulletinList">
              <a-list-item slot="renderItem" key="item.title" slot-scope="item, index">
                <template slot="actions">
              <span key="message">
                <a-icon type="message" style="margin-right: 8px" />
                {{ item.date }}
              </span>
                </template>
                <a-list-item-meta :description="item.content" style="font-size: 14px">
                  <a slot="title">{{ item.title }}</a>
                </a-list-item-meta>
              </a-list-item>
            </a-list>
          </div>
        </a-card>
        <a-carousel effect="fade" style="margin-top: 35px">
          <div style="width: 100%;height: 300px"><img :src="'http://127.0.0.1:9527/imagesWeb/4a318e03-f0d0-46fb-be12-1eff8456245f.png'" style="width: 100%;height: 100%;object-fit:cover;" /></div>
          <div style="width: 100%;height: 300px"><img :src="'http://127.0.0.1:9527/imagesWeb/a386c2de-9c7e-4738-a449-5efab6f39f67.png'" style="width: 100%;height: 100%;object-fit:cover;" /></div>
          <div style="width: 100%;height: 300px"><img :src="'http://127.0.0.1:9527/imagesWeb/b5c6f84a-53a1-4bd3-8d48-d61dfacd8f91.png'" style="width: 100%;height: 100%;object-fit:cover;" /></div>
        </a-carousel>
      </a-col>
    </a-row>
  </div>
</template>
<script>
import HeadInfo from '@/views/common/HeadInfo'
import Weather from '@/views/web/Weather'
import {mapState} from 'vuex'
import moment from 'moment'
import Home from './manage/component/home/Home'
import Work from './manage/component/work/Work'
moment.locale('zh-cn')

export default {
  name: 'HomePage',
  components: {Home, Work, HeadInfo, Weather},
  data () {
    return {
      pagination: {
        onChange: page => {
          console.log(page)
        },
        pageSize: 3
      },
      titleData: {
        userNum: 0,
        staffNum: 0,
        roomNum: 0,
        amount: 0
      },
      series: [],
      chartOptions: {
        chart: {
          toolbar: {
            show: false
          }
        },
        plotOptions: {
          bar: {
            horizontal: false,
            columnWidth: '35%'
          }
        },
        dataLabels: {
          enabled: false
        },
        stroke: {
          show: true,
          width: 2,
          colors: ['transparent']
        },
        xaxis: {
          categories: []
        },
        fill: {
          opacity: 1

        }
      },
      todayIp: '',
      todayVisitCount: '',
      totalVisitCount: '',
      userRole: '',
      userDept: '',
      lastLoginTime: '',
      welcomeMessage: '',
      notifyList: [],
      bulletinList: []
    }
  },
  computed: {
    ...mapState({
      multipage: state => state.setting.multipage,
      user: state => state.account.user
    }),
    avatar () {
      return `static/avatar/${this.user.avatar}`
    }
  },
  methods: {
    getBulletinList () {
      this.$get('/cos/bulletin-info/list').then((r) => {
        this.bulletinList = r.data.data
      })
    },
    welcome () {
      const date = new Date()
      const hour = date.getHours()
      let time = hour < 6 ? '早上好' : (hour <= 11 ? '上午好' : (hour <= 13 ? '中午好' : (hour <= 18 ? '下午好' : '晚上好')))
      return `${time}，${this.user.username}`
    },
    setTitleData (titleData) {
      this.titleData = titleData
      console.log(this.titleData)
    },
    queryNotifyByUser () {
      if (this.user.roleId == 75) {
        this.$get('/cos/notify-info/queryNotifyByUser', {userId: this.user.userId}).then((r) => {
          this.notifyList = r.data.data
          this.notifyList.forEach((item, index) => {
            this.openNotification(item)
          })
        })
      }
    },
    notificationClose (key, id) {
      this.$notification.close(key)
      this.$get('/cos/notify-info/updateNotifyStatus', {id}).then((r) => {
      })
    },
    openNotification (item) {
      const key = `open${item.id}`
      this.$notification.open({
        message: '消息通知',
        description: item.content,
        btn: h => {
          return h(
            'a-button',
            {
              props: {
                type: 'primary',
                size: 'small'
              },
              on: {
                click: () => this.notificationClose(key, item.id)
              }
            },
            '确认'
          )
        },
        key,
        onClose: close
      })
    }
  },
  mounted () {
    // this.queryNotifyByUser()
    this.getBulletinList()
    this.welcomeMessage = this.welcome()
    this.$get(`index/${this.user.username}`).then((r) => {
      let data = r.data.data
      this.todayIp = data.todayIp
      this.todayVisitCount = data.todayVisitCount
      this.totalVisitCount = data.totalVisitCount
      let sevenVisitCount = []
      let dateArr = []
      for (let i = 6; i >= 0; i--) {
        let time = moment().subtract(i, 'days').format('MM-DD')
        let contain = false
        for (let o of data.lastSevenVisitCount) {
          if (o.days === time) {
            contain = true
            sevenVisitCount.push(o.count)
          }
        }
        if (!contain) {
          sevenVisitCount.push(0)
        }
        dateArr.push(time)
      }
      let sevenUserVistCount = []
      for (let i = 6; i >= 0; i--) {
        let time = moment().subtract(i, 'days').format('MM-DD')
        let contain = false
        for (let o of data.lastSevenUserVisitCount) {
          if (o.days === time) {
            contain = true
            sevenUserVistCount.push(o.count)
          }
        }
        if (!contain) {
          sevenUserVistCount.push(0)
        }
      }
      this.$refs.count.updateSeries([
        {
          name: '您',
          data: sevenUserVistCount
        },
        {
          name: '总数',
          data: sevenVisitCount
        }
      ], true)
      this.$refs.count.updateOptions({
        xaxis: {
          categories: dateArr
        },
        title: {
          text: '近七日系统访问记录',
          align: 'left'
        }
      }, true, true)
    }).catch((r) => {
      console.error(r)
      this.$message.error('获取首页信息失败')
    })
  }
}
</script>
<style lang="less">
.ant-card-body {
  overflow-x: auto;
}
.home-page {
  .head-info {
    margin-bottom: .5rem;
    .head-info-card {
      padding: .5rem;
      border-color: #f1f1f1;
      .head-info-avatar {
        display: inline-block;
        float: left;
        margin-right: 1rem;
        img {
          width: 5rem;
          border-radius: 2px;
        }
      }
      .head-info-count {
        display: inline-block;
        float: left;
        .head-info-welcome {
          font-size: 1.05rem;
          margin-bottom: .1rem;
        }
        .head-info-desc {
          color: rgba(0, 0, 0, 0.45);
          font-size: .8rem;
          padding: .2rem 0;
          p {
            margin-bottom: 0;
          }
        }
        .head-info-time {
          color: rgba(0, 0, 0, 0.45);
          font-size: .8rem;
          padding: .2rem 0;
        }
      }
    }
  }
  .count-info {
    .visit-count-wrapper {
      padding-left: 0 !important;
      .visit-count {
        padding: .5rem;
        border-color: #f1f1f1;
        .ant-card-body {
          padding: .5rem 1rem !important;
        }
      }
    }
    .project-wrapper {
      padding-right: 0 !important;
      .project-card {
        border: none !important;
        .ant-card-head {
          border-left: 1px solid #f1f1f1 !important;
          border-top: 1px solid #f1f1f1 !important;
          border-right: 1px solid #f1f1f1 !important;
        }
        .ant-card-body {
          padding: 0 !important;
          table {
            width: 100%;
            td {
              width: 50%;
              border: 1px solid #f1f1f1;
              padding: .6rem;
              .project-avatar-wrapper {
                display:inline-block;
                float:left;
                margin-right:.7rem;
                .project-avatar {
                  color: #42b983;
                  background-color: #d6f8b8;
                }
              }
            }
          }
        }
        .project-detail {
          display:inline-block;
          float:left;
          text-align:left;
          width: 78%;
          .project-name {
            font-size:.9rem;
            margin-top:-2px;
            font-weight:600;
          }
          .project-desc {
            color:rgba(0, 0, 0, 0.45);
            p {
              margin-bottom:0;
              font-size:.6rem;
              white-space:normal;
            }
          }
        }
      }
    }
  }
}
</style>
