<template>
  <div>
    <Card>
      <p slot="title">分组管理</p>
      <Row :gutter="20">
        <Form inline :label-width="80">
          <FormItem label="组编号">
            <Input v-model="groupCode" placeholder="请输入组编号"/>
          </FormItem>
          <FormItem label="组名称">
            <Input v-model="groupName" placeholder="请输入组名称"/>
          </FormItem>
          <FormItem>
            <Button type="primary" @click="search">查询</Button>
          </FormItem>
          <FormItem>
            <Button type="info" @click="addGroup">添加组</Button>
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
    <Modal
      v-model="isShowGroupInfoModal"
      :title="modalTitle"
      :mask-closable="false"
      :scrollable="true"
      :styles="{top: '20px'}"
    >
      <Form ref="addGroupForm" :model="group" :label-width="80" :rules="groupRule">
        <FormItem label="组编码" prop="groupName" v-if="isShowGroupInfo">
          <Input v-model="group.groupCode" disabled/>
        </FormItem>
        <FormItem label="组名称" prop="groupName">
          <Input v-model="group.groupName" />
        </FormItem>
        <FormItem label="组描述" prop="desc">
          <Input
            v-model="group.desc"
            type="textarea"
            :autosize="{minRows: 3,maxRows: 3}"
          />
        </FormItem>
        <FormItem label="归属应用" prop="appInfo">
          <Input
            v-model="group.appInfo"
            type="textarea"
            :autosize="{minRows: 3,maxRows: 3}"
          />
        </FormItem>
      </Form>
      <Row slot="footer" justify="center" type="flex">
        <Button type="primary" @click="submit">{{buttonContext}}</Button>
        <Button type="warning" style="margin-left: 50px" @click="cancle">取消</Button>
      </Row>
    </Modal>
  </div>
</template>

<style lang="less">
.margin-top-20 {
  margin-top: 20px;
}

.vertical-center-modal {
  display: flex;
  align-items: center;
  justify-content: center;

  .ivu-modal {
    top: 0;
  }
}
</style>

<script>
import {
  getTaskGroupList,
  deleteGroup,
  modifyGroup,
  addGroup,
} from "@/api/data";
export default {
  name: "task-group",
  data() {
    return {
      groupName: "",
      groupCode: "",
      modalTitle: "添加组",
      buttonContext: "添加",
      isShowGroupInfoModal: false,
      isShowGroupInfo: false,
      isAddGroup: true,
      eventType: "save",
      group: {},
      columns: [
        {
          title: "组ID",
          key: "id",
          align: "center",
          width: 100
        },
        {
          title: "组编码",
          key: "groupCode",
          align: "center",
          width: 100
        },
        {
          title: "组名称",
          key: "groupName",
          align: "center"
        },
        {
          title: "组详情",
          key: "desc",
          align: "center"
        },
        {
          title: "任务名称",
          key: "appInfo",
          align: "center"
        },
        {
          title: "创建时间",
          key: "createTime",
          align: "center",
          width: 150
        },
        {
          title: "操作",
          width: 250,
          align: "center",
          render: (h, param) => {
            return h("div", [
              h(
                "Button",
                {
                  props: {
                    type: "error",
                    size: 'small'
                  },
                  on: {
                    click: () => {
                      this.$Modal.confirm({
                        title: "确定删除组[" + param.row.groupName + "]?",
                        onOk: () => {
                          let params = {
                            groupId: param.row.id
                          };
                          deleteGroup(params).then(res => {
                            if (res.data.code === "200") {
                              this.$Message.success("删除成功");
                              this.taskGroupList()
                            } else {
                              this.$Message.error("删除失败!" + res.data.msg);
                            }
                          });
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
                    type: "success",
                    size: 'small'
                  },
                  style: {
                    marginLeft: "20px"
                  },
                  on: {
                    click: () => {
                      this.group = param.row
                      this.modalTitle = "编辑";
                      this.buttonContext = "修改组";
                      this.isShowGroupInfoModal = true;
                      this.isShowGroupInfo = true;
                      this.isAddGroup = false;
                      this.eventType = "edit";
                    }
                  }
                },
                "编辑"
              )
            ]);
          }
        }
      ],
      data: [],
      groupRule: {
        groupName: [
          { required: true, message: "组名称不能为空"}
        ],
        desc: [
          { required: true, message: "组描述信息不能为空"}
        ],
        appInfo: [
          { required: true, message: "归属应用信息不能为空"}
        ]
      },
      page: {
        total: 0,
        pageNo: 1,
        pageSize: 20,
        pageSizes: [10, 20, 50]
      }
    };
  },
  methods: {
    search() {
      this.taskGroupList();
    },
    toPageNo(pageNo) {
      this.pageNo = pageNo;
      this.taskGroupList();
    },
    changePageSize(pageSize) {
      this.page.pageSize = pageSize;
      this.taskGroupList();
    },
    addGroup() {
      this.isShowGroupInfoModal = true;
      this.isShowGroupInfo = false
      this.modalTitle = "添加组";
      this.eventType = "save";
      this.buttonContext = "添加";
      this.isAddGroup = true;
    },
    taskGroupList() {
      let param = {
        groupCode: this.groupCode,
        groupName: this.groupName,
        pageNo: this.page.pageNo,
        pageSize: this.page.pageSize
      };
      getTaskGroupList(param).then(res => {
        if (res.data.code === '200') {
          this.data = res.data.data;
          this.page.total = res.data.totalNum;
        }
      });
    },
    cancle() {
      this.isShowGroupInfoModal = false;
      this.group = {}
    },
    submit() {
      switch (this.eventType) {
        case "save":
          this.$refs["addGroupForm"].validate(valid => {
            if (valid) {
              let param = this.group;
              addGroup(param).then(res => {
                if (res.data.code === "200") {
                  this.$Message.success("添加成功");
                  this.cancle();
                  this.taskGroupList();
                } else {
                  this.$Message.error("添加失败!" + res.data.msg);
                }
              });
            }
          });
          break;
        case "edit":
          this.$refs["addGroupForm"].validate(valid => {
            if (valid) {
              let param = this.group;
              modifyGroup(param).then(res => {
                if (res.data.code === "200") {
                  this.$Message.success("修改成功");
                  this.cancle();
                  this.taskGroupList();
                } else {
                  this.$Message.error("修改失败!" + res.data.msg);
                }
              });
            }
          });
          break;
        case "info":
          this.cancle();
          break;
      }
    },
  },
  mounted() {
    this.taskGroupList();
  }
};
</script>
