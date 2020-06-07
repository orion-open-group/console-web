<template>
  <div>
    <Card>
      <p slot="title">任务列表</p>
      <Row>
        <Form inline :label-width="100" @keydown.native.enter.prevent="search">
          <FormItem label="任务名称">
            <Input v-model="taskName" placeholder="请输入任务名称"/>
          </FormItem>
          <FormItem label="可用分组" style="width: 250px">
            <Select v-model="groupId" placeholder="请选择后台可用分组">
              <Option v-for="item in groupList" :key="item.id" :value="item.id">{{item.groupName}}</Option>
            </Select>
          </FormItem>
          <FormItem>
            <Button type="primary" @click="search">查询</Button>
          </FormItem>
          <FormItem>
            <Button type="info" @click="showAddTaskModel">添加任务</Button>
          </FormItem>
        </Form>
      </Row>
      <Row class="margin-top-20">
        <Table stripe border :columns="columns" :data="configList"></Table>
      </Row>
      <Row class="margin-top-20">
        <Page
          @on-change="toPageNo"
          @on-page-size-change="changePageSize"
          :page-size-opts="page.pageSiezs"
          :total="page.total"
          :page-size="page.pageSize"
          show-elevator
          show-sizer
          show-total
        />
      </Row>
    </Card>
    <Modal
      v-model="showTaskModal"
      :title="title"
      :mask-closable="false"
      ok-text="添加"
      :styles="{top: '20px'}"
    >
      <Form ref="addTaskForm" :model="task" :label-width="100" :rules="taskRule">
        <FormItem label="任务名称" prop="taskName">
          <Input v-model="task.taskName" placeholder="请输入任务名称"/>
        </FormItem>
        <FormItem label="任务分组" prop="groupId">
          <Select v-model="task.groupId" placeholder="请选择所属分组">
            <Option v-for="item in groupList" :key="item.id" :value="item.id">{{item.groupName + ' (' + item.groupCode +
              ')'}}
            </Option>
          </Select>
        </FormItem>
        <FormItem label="任务上下文" prop="taskContext">
          <Input
            v-model="task.taskContext"
            placeholder="请输入任务上下文"
            type="textarea"
            :autosize="{minRows: 5,maxRows: 10}"
          />
        </FormItem>
        <FormItem label="任务执行器" prop="processor">
          <Input v-model="task.processor" placeholder="请输入任务执行器"/>
        </FormItem>
        <FormItem label="调度时间类型" prop="scheduleType">
          <Select v-model="task.scheduleType" placeholder="请选择任务调度时区">
            <Option value="CRON">CRON</Option>
          </Select>
        </FormItem>
        <FormItem label="调度时区" prop="timeZone">
          <Input v-model="task.timeZone = 'Asia/Shanghai'" placeholder="请选择任务调度时区" disabled/>
        </FormItem>
        <FormItem label="调度表达式" prop="scheduleExpress">
          <Input v-model="task.scheduleExpress" placeholder="请输入任务CRON执行表达式"/>
        </FormItem>
        <FormItem label="任务优先级" prop="priority">
          <Select v-model="task.priority" placeholder="请选择任务优先级(优先级高则优先执行)">
            <Option :value="1">1</Option>
            <Option :value="2">2</Option>
            <Option :value="3">3</Option>
            <Option :value="4">4</Option>
            <Option :value="5">5</Option>
            <Option :value="6">6</Option>
            <Option :value="7">7</Option>
            <Option :value="8">8</Option>
            <Option :value="9">9</Option>
            <Option :value="10">10</Option>
          </Select>
        </FormItem>
        <FormItem label="是否并发执行" prop="parallel">
          <RadioGroup v-model="task.parallel">
            <Radio :label="0">否</Radio>
            <Radio :label="1">是</Radio>
          </RadioGroup>
        </FormItem>
      </Form>
      <Row slot="footer" justify="center" type="flex">
        <Button type="primary" @click="submit">{{buttonContext}}</Button>
        <Button type="warning" style="margin-left: 50px" @click="cancle">取消</Button>
      </Row>
    </Modal>
  </div>
</template>

<style>
  .margin-top-20 {
    margin-top: 20px;
  }
</style>

<script>
import {
  getTaskConfigList,
  addTaskConfig,
  cleanRunningLock,
  deleteTask,
  modifyTask,
  pauseSchedule,
  resumeSchedule,
  getTaskGroupList
} from '@/api/data'

export default {
  name: 'task-list',
  data () {
    return {
      taskName: '',
      groupId: '',
      task: {},
      taskStatus: '',
      showTaskModal: false,
      title: '添加任务',
      buttonContext: '添加',
      groupList: [],
      eventType: 'sava',
      columns: [
        {
          title: '名称',
          align: 'center',
          key: 'taskName',
          minWidth: 100
        },
        {
          title: '状态',
          align: 'center',
          key: 'taskState',
          width: 100
        },
        {
          title: '分组',
          key: 'groupCode',
          align: 'center',
          minWidth: 70
        },
        {
          title: '处理器',
          key: 'processor',
          minWidth: 200,
          align: 'center',
          render: (h, p) => {
            return h('strong', p.row.processor.substr(p.row.processor.lastIndexOf('.') + 1))
          }
        },
        {
          title: '类型',
          key: 'scheduleType',
          align: 'center',
          width: 100
        },
        {
          title: '调度规则',
          key: 'scheduleExpress',
          align: 'center',
          width: 130
        },
        {
          title: '并发',
          key: 'parallel',
          align: 'center',
          width: 70,
          render: (h, p) => {
            return h('strong', p.row.parallel ? '是' : '否')
          }
        },
        {
          title: '创建时间',
          key: 'createTime',
          align: 'left',
          minWidth: 100
        },
        {
          title: '操作',
          align: 'left',
          width: 250,
          render: (h, params) => {
            return h('div', [
              h(
                'Button',
                {
                  props: {
                    type: 'warning',
                    size: 'small'
                  },
                  style: {
                    marginLeft: '10px',
                    display: params.row.runCmdId > 0 ? 'inline-block' : 'none'
                  },
                  on: {
                    click: () => {
                      cleanRunningLock({
                        taskId: params.row.id
                      }).then(res => {
                        if (res.data.code === '200') {
                          this.$Message.success('clean success')
                          this.taskConfigList()
                        } else {
                          this.$Message.error('clean fail!' + res.data.msg)
                        }
                      })
                    }
                  }
                },
                '清理锁'
              ),
              h(
                'Button',
                {
                  props: {
                    type: params.row.taskState === 'PAUSE' ? 'info' : 'warning',
                    size: 'small'
                  },
                  style: {
                    marginLeft: '10px'
                  },
                  on: {
                    click: () => {
                      if (params.row.taskState === 'PAUSE') {
                        this.scheduleResume(params.row.id)
                      } else {
                        this.schedulePause(params.row.id)
                      }
                    }
                  }
                },
                params.row.taskState === 'PAUSE' ? '恢复' : '暂停'
              ),
              h(
                'Button',
                {
                  props: {
                    type: 'success',
                    size: 'small'
                  },
                  style: {
                    marginLeft: '10px'
                  },
                  on: {
                    click: () => {
                      this.showTaskModal = true
                      this.title = '修改任务'
                      this.task = params.row
                      this.buttonContext = '修改'
                      this.eventType = 'edit'
                    }
                  }
                },
                '编辑'
              ),
              h(
                'Button',
                {
                  props: {
                    type: 'info',
                    size: 'small'
                  },
                  style: {
                    marginLeft: '10px'
                  },
                  on: {
                    click: () => {
                      this.$Modal.confirm({
                        title: '确定删除任务?',
                        onOk: () => {
                          deleteTask({
                            taskId: params.row.id
                          }).then(res => {
                            if (res.data.code === '200') {
                              this.$Message.success('删除成功')
                              this.taskConfigList()
                            } else {
                              this.$Message.error('删除失败,' + res.data.msg)
                            }
                          })
                        }
                      })
                    }
                  }
                },
                '删除'
              )
            ])
          }
        }
      ],
      configList: [],
      taskRule: {
        groupId: [
          { required: true, message: '任务所属组不能为空' }
        ],
        taskName: [
          { required: true, message: '任务名称不能为空' }
        ],
        taskContext: [
          { required: true, message: '任务上下文不能为空' }
        ],
        processor: [
          { required: true, message: '任务任务执行器不能为空' }
        ],
        scheduleType: [
          { required: true, message: '任务调度类型不能为空' }
        ],
        timeZone: [
          { required: true, message: '任务调度时区不能为空' }
        ],
        scheduleExpress: [
          { required: true, message: '任务调度表达式不能为空' }
        ],
        parallel: [
          {
            required: true,
            message: '请选择任务是否并发执行'
          }
        ],
        priority: [
          { required: true, message: '请输入任务优先级' }
        ]
      },
      page: {
        total: 40,
        pageNo: 1,
        pageSize: 20,
        pageSiezs: [10, 20, 50]
      }
    }
  },
  methods: {
    search () {
      this.taskConfigList()
    },
    cancle () {
      this.task = {}
      this.showTaskModal = false
    },
    toPageNo (pageNo) {
      this.page.pageNo = pageNo
      this.taskConfigList()
    },
    changePageSize (pageSize) {
      this.page.pageSize = pageSize
      this.taskConfigList()
    },
    showAddTaskModel () {
      this.showTaskModal = true
      this.buttonContext = '添加'
      this.title = '添加任务'
      this.eventType = 'sava'
    },
    scheduleResume (taskId) {
      resumeSchedule({ taskId: taskId }).then(res => {
        if (res.data.code === '200') {
          this.$Message.success('恢复调度成功')
          this.taskConfigList()
        } else {
          this.$Message.error('恢复调度失败')
        }
      })
    },
    schedulePause (taskId) {
      pauseSchedule({ taskId: taskId }).then(res => {
        if (res.data.code === '200') {
          this.$Message.success('暂停调度成功')
          this.taskConfigList()
        } else {
          this.$Message.error('暂停调度失败')
        }
      })
    },
    submit () {
      switch (this.eventType) {
        case 'edit':
          this.$refs['addTaskForm'].validate(valid => {
            if (valid) {
              modifyTask(this.task).then(res => {
                if (res.data.code === '200') {
                  this.$Message.success('修改任务成功')
                  this.cancle()
                  this.taskConfigList()
                } else {
                  this.$Message.error('修改任务失败:' + res.data.msg)
                }
              })
            }
          })
          break
        case 'sava':
          this.$refs['addTaskForm'].validate(valid => {
            if (valid) {
              addTaskConfig(this.task).then(res => {
                if (res.data.code === '200') {
                  this.$Message.success('添加任务成功')
                  this.cancle()
                  this.taskConfigList()
                } else {
                  this.$Message.error('添加任务失败:' + res.data.msg)
                }
              })
            }
          })
          break
      }
    },
    taskConfigList () {
      let param = {
        taskName: this.taskName,
        groupId: this.groupId,
        taskStatus: this.taskStatus,
        pageNo: this.page.pageNo,
        pageSize: this.page.pageSize
      }
      getTaskConfigList(param)
        .then(res => {
          if (res.data.code === '200') {
            this.configList = res.data.data
            this.page.total = res.data.totalNum
          }
        })
        .catch(err => {
          console.log(err)
        })
    },
    getGroupList () {
      getTaskGroupList({
        pageNo: 1,
        pageSize: 9999
      }).then(res => {
        if (res.data.code === '200') {
          this.groupList = res.data.data
        }
      })
    }
  },
  mounted () {
    this.taskConfigList()
    this.getGroupList()
  }
}
</script>

