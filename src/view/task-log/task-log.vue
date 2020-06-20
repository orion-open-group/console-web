<template>
  <!--<div>-->
    <Card id="tab-card">
      <p slot="title">调度明细</p>
      <Row>
        <Form inline :label-width="100">
          <FormItem label="任务名称">
            <Input v-model="taskName" placeholder="请输入任务名称"/>
          </FormItem>
          <FormItem label="后台可用分组" style="width: 250px">
            <Select v-model="groupId" placeholder="请选择后台可用分组">
              <Option v-for="item in groupList" :key="item.id" :value="item.id">{{item.groupName}}</Option>
            </Select>
          </FormItem>
          <FormItem label="调度开始时间" style="width: 300px">
            <DatePicker type="datetime" v-model="startTime" format="yyyy-MM-dd HH:mm:ss" placeholder="请选择调度开始时间"></DatePicker>
          </FormItem>
          <FormItem label="调度结束时间" style="width: 3000px">
            <DatePicker type="datetime" v-model="endTime" format="yyyy-MM-dd HH:mm:ss" placeholder="请选择调度结束时间"></DatePicker>
          </FormItem>
          <FormItem>
            <Button type="primary" @click="search">搜索</Button>
          </FormItem>
        </Form>
      </Row>
      <Row class="margin-top-20">
        <Table border :columns="columns" :data="data"></Table>
      </Row>
      <Row class="margin-top-20">
        <Page
          @on-change="toPageNo"
          @on-page-size-change="changePageSize"
          :page-size-opts="page.pageSiezs"
          :page-size="page.pageSize"
          :total="page.total"
          show-elevator
          show-sizer
          show-total
        />
      </Row>
    </Card>
  <!--</div>-->
</template>

<style>
  .margin-top-20 {
    margin-top: 20px;
  }
 #tab-card{
   overflow: hidden !important;
 }
</style>

<script>
import {
  getTaskLogList,
  taskCommandAbort,
  taskCommandDelete,
  taskCommandCopy,
  // queryTaskProcess,
  getTaskGroupList,
  scheduleStateDecode,
  scheduleTypeDecode
} from "@/api/data";
//import { clearTimeout } from 'timers';
export default {
  name: "task-list",
  data() {
    return {
      commandId: "",
      taskName: "",
      commandType: "",
      scheduleState: "",
      targetHost: [],
      timerTaskList: [],
      groupList: [],
      groupId: "",
      startTime: null,
      endTime: null,
      traceId: null,
      toDoTaskMap: new Map(), //key 为task的commandId， vlaue 列表的 value
      isClean: false, //用来停止刷新进度条
      columns: [
        {
          title: "指令ID",
          key: "commandId",
          align: "center",
          width: 80
        },
        {
          title: "名称",
          key: "taskName",
          align: "center"
        },
        {
          title: "指令",
          key: "commandType",
          align: "center",
          width: 80,
          render: (h, p) => {
            return h('strong', scheduleTypeDecode(p.row.commandType));
          }
        },
        {
          title: "状态",
          key: "scheduleState",
          align: "center",
          width: 90,
          render: (h, p) => {
            return h('strong', scheduleStateDecode(p.row.scheduleState));
          }
        },
        {
          title: "目标机器",
          key: "targetHost",
          align: "center",
          minWidth: 80
        },
        {
          title: "发起时间",
          key: "publishTime",
          align: "center",
          minWidth: 80
        },
        {
          title: "实际发起",
          key: "startTime",
          align: "center",
          minWidth: 80
        },
        {
          title: "实际结束",
          key: "endTime",
          align: "center",
          minWidth: 80
        },
        {
          title: "追踪ID",
          key: "traceId",
          align: "center",
          minWidth: 80
        },
        {
          title: '进度',
          align: 'center',
          width: 200,
          render: (h, p) => {
            if (p.row.commandType != 'SCHEDULE' || p.row.scheduleState == 'INIT') {
              return
            }
            const index = p.index
            if (p.row.scheduleState == 'RUN' && p.row.commandType == 'SCHEDULE' ) {
              // this.startProcess()
              // toDoTaskMap.set(p.row.commandId, index)
              // this.timerTaskList.forEach((item, index) => {
              //   window.clearTimeout(item)
              // })
              // var timerIns=
              // setTimeout(()=> {
                // queryTaskProcess(p.row.commandId).then(res => {
                   // if (res.data.code === '200') {
                   //    this.$set(this.data, index, res.data.data)
                   // }

                // })
              // }, 3000);
              // clearTimeout(timerIns)
              // if(!this.timerTaskList) {
              //   this.timerTaskList = new Array();
              // }
              // this.timerTaskList.push(timerIns);
            }
            const success = p.row.success ? p.row.success : 0
            const fail = p.row.fail ? p.row.fail : 0
            const total = p.row.total ? p.row.total : 0
            let percent = total === 0 ? 100 : ((success + fail) / total) * 100
            let progrss = h(
              'i-progress',
              {
                props: {
                  percent: percent === 100 ? percent - 0.01 : percent,
                  status: 'wrong',
                  hideInfo: true,
                  successPercent: total === 0 ? 0.01 : (success / total) * 100
                }
              }
            )
            return h('Tooltip',
              {
                props: {
                  content: '总数: ' + total + '; 成功:' + success + '; 失败:' + fail,
                  placement: 'top',
                  theme: 'light'
                },
                style: {
                  width: '100%'
                }
              },
              [progrss]
            )
          }
        },
        {
          title: "操作",
          width: 120,
          align: "center",
          render: (h, param) => {
            return h("div", [
              h(
                "Button",
                {
                  props: {
                    type: "warning",
                    size: "small"
                  },
                  style: {
                    marginLeft: "10px",
                    display: param.row.commandType== 'SCHEDULE' && param.row.scheduleState=='INIT'?'inline-block':'none'
                  },
                  on: {
                    click: () => {
                      taskCommandDelete({
                        commandId: param.row.commandId
                      }).then(res => {
                        if (res.data.code === "200") {
                          this.$Message.success("删除调度成功");
                          this.taskLogList()
                        } else {
                          this.$Message.error("删除调度失败!" + res.data.msg);
                        }
                      });
                    }
                  }
                },
                "删除"
              ),
              h(
                "Button",
                {
                  props: {
                    type: "warning",
                    size: "small"
                  },
                  style: {
                    marginLeft: "10px",
                    display: param.row.commandType== 'SCHEDULE' && param.row.scheduleState=='RUN'?'inline-block':'none'
                  },
                  on: {
                    click: () => {
                      taskCommandAbort({
                        commandId: param.row.commandId
                      }).then(res => {
                        if (res.data.code === "200") {
                          this.$Message.success("终止成功");
                          this.taskLogList()
                        } else {
                          this.$Message.error("终止失败!" + res.data.msg);
                        }
                      });
                    }
                  }
                },
                "终止"
              ),
              h(
                "Button",
                {
                  props: {
                    type: "info",
                    size: "small"
                  },
                  style: {
                    marginLeft: "10px",
                    display: (param.row.scheduleState=='FINISH' ||  param.row.scheduleState=='ABORT') && param.row.commandType == 'SCHEDULE'?'inline-block':'none'
                  },
                  on: {
                    click: () => {
                      taskCommandCopy({
                        commandId: param.row.commandId
                      }).then(res => {
                        if (res.data.code === "200") {
                          this.$Message.success("复制成功");
                          this.taskLogList()
                        } else {
                          this.$Message.error("复制失败!" + res.data.msg);
                        }
                      });
                    }
                  }
                },
                "复制"
              )
            ]);
          }
        }
      ],
      data: [],
      page: {
        pageNo: 1,
        pageSize: 10,
        total: 0,
        pageSizes: [10, 20, 50]
      }
    };
  },
  methods: {
    search() {
      for(var i=0;i< this.timerTaskList.length;i++)
      {
        console.log("timeid " + this.timerTaskList[i]);
        window.clearTimeout(this.timerTaskList[i]);
      }
      this.timerTaskList=new Array();
      this.taskLogList();
    },
    toPageNo(pageNo) {
      this.page.pageNo = pageNo;
      this.taskLogList();
    },
    changePageSize(pageSize) {
      this.page.pageSize = pageSize;
      this.taskLogList();
    },
    taskLogList() {
      let param = {
        pageNo: this.page.pageNo,
        pageSize: this.page.pageSize,
        groupId: this.groupId,
        taskName: this.taskName,
        startTime: this.startTime,
        endTime: this.endTime
      };
      getTaskLogList(param).then(res => {
        if (res.data.code === '200') {
          this.data = res.data.data;
          this.$forceUpdate()
          this.page.total = res.data.totalNum;
        } else {
          this.$Message.error(res.data.msg);
        }
      });
    },
    getGroupList() {
      getTaskGroupList({
        pageNo:1,
        pageSize: 9999
      }).then(res => {
        if (res.data.code === '200') {
          this.groupList = res.data.data
        }
      })
    },
    startProcess() {
      if (this.timerTaskList.length > 0)  {
        return
      }
      let timerInx = setTimeout(() => {
        this.taskLogList()
        this.timerTaskList = []
      }, 3000)
      this.timerTaskList.push(timerInx)
    }
  },
  mounted() {
    this.taskLogList();
    this.getGroupList();
  }
};
</script>


