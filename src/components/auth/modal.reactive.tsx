"use client";

import { useHasMounted } from "@/utils/customHook";
import { Button, Form, Input, Modal, notification } from "antd";
import React, { useState } from "react";
import {
  SmileOutlined,
  SolutionOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { Steps } from "antd";
import { sendRequest } from "@/utils/api";

export default function ModalReactive(props: any) {
  const { isModalOpen, setIsModalOpen, userEmail } = props;
  const [userId, setUserId] = useState("");
  const [current, setCurrent] = useState(0);

  const hashMounted = useHasMounted();
  if (!hashMounted) return <></>;

  const onFinishStep0 = async () => {
    const res = await sendRequest<IBackendRes<any>>({
      url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/auth/retry-active`,
      method: "POST",
      body: {
        email: userEmail,
      },
    });
    console.log(res)

    if (res?.data) {
      setUserId(res?.data?._id);
      setCurrent(1);
    }
  };

  const onFinishStep1 = async (values: any) => {
    const res = await sendRequest<IBackendRes<any>>({
      url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/auth/check-code`,
      method: "POST",
      body: {
        _id: userId,
        code: values.code
      },
    });

    if (res?.data) {
      setCurrent(2);
    }
  };

  return (
    <Modal
      title="Kích hoạt tài khoản"
      open={isModalOpen}
      onOk={() => setIsModalOpen(false)}
      onCancel={() => setIsModalOpen(false)}
      maskClosable={false}
      footer={null}
    >
      <Steps
        current={current}
        items={[
          {
            title: "Login",
            icon: <UserOutlined />,
          },
          {
            title: "Verification",
            icon: <SolutionOutlined />,
          },
          {
            title: "Done",
            icon: <SmileOutlined />,
          },
        ]}
      />

      {current === 0 && (
        <>
          <Form
            name="basic"
            onFinish={onFinishStep0}
            autoComplete="off"
            layout="vertical"
          >
            <Form.Item
              label="Email"
              name="email"
              initialValue={userEmail}
              rules={[
                {
                  required: true,
                  message: "Please input your email!",
                },
              ]}
            >
              <Input disabled />
            </Form.Item>

            <Form.Item>
              <Button type="primary" htmlType="submit">
                Re send
              </Button>
            </Form.Item>
          </Form>
        </>
      )}

      {current === 1 && (
        <>
          <Form
            name="basic"
            onFinish={onFinishStep1}
            autoComplete="off"
            layout="vertical"
          >
            <Form.Item
              label="Code"
              name="code"
              rules={[
                {
                  required: true,
                  message: "Please input your code!",
                },
              ]}
            >
              <Input />
            </Form.Item>

            <Form.Item>
              <Button type="primary" htmlType="submit">
                Active
              </Button>
            </Form.Item>
          </Form>
        </>
      )}

      {current === 2 &&
      <div>Tài khoản đã được kích hoạt thành công</div>
      }
    </Modal>
  );
}
