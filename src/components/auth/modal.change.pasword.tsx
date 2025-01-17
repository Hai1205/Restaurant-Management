"use client";

import { useHasMounted } from "@/utils/customHook";
import { Button, Form, Input, Modal, notification, Steps } from "antd";
import {
  SmileOutlined,
  SolutionOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { useState } from "react";
import { sendRequest } from "@/utils/api";
import { useRouteId } from "react-router/dist/lib/hooks";

const ModalChangePassword = (props: any) => {
  const { isModalOpen, setIsModalOpen } = props;
  const [current, setCurrent] = useState(0);
  const [form] = Form.useForm();
  const [userEmail, setUserEmail] = useState("");
  const [userId, setUserId] = useState("");

  const hasMounted = useHasMounted();

  if (!hasMounted) return <></>;

  const onFinishStep0 = async (values: any) => {
    const { email } = values;
    const res = await sendRequest<IBackendRes<any>>({
      url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/auth/retry-password`,
      method: "POST",
      body: {
        email,
      },
    });

    if (res?.data) {
      setUserEmail(res?.data?.email);
      setUserId(res?.data?._id);
      setCurrent(1);
    } else {
      notification.error({
        message: "Call APIs error",
        description: res?.message,
      });
    }
  };

  const onFinishStep1 = async (values: any) => {
    const { code, password, confirmPassword } = values;
    if (password !== confirmPassword) {
      notification.error({
        message: "Invalid input",
        description: "Mật khẩu và xác nhận mật khẩu không chính xác",
      });
      return;
    }
    const res = await sendRequest<IBackendRes<any>>({
      url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/auth/change-password`,
      method: "POST",
      body: {
        _id: userId,
        code,
        password,
        rePassword: confirmPassword,
        email: userEmail,
      },
    });

    if (res?.data) {
      setCurrent(2);
    } else {
      notification.error({
        message: "Call APIs error",
        description: res?.message,
      });
    }
  };

  const restModal = () => {
    setIsModalOpen(false);
    setCurrent(0);
    setUserEmail("");
    form.resetFields();
  };
  return (
    <>
      <Modal
        title="Quên mật khẩu"
        open={isModalOpen}
        onOk={restModal}
        onCancel={restModal}
        maskClosable={false}
        footer={null}
      >
        <Steps
          current={current}
          items={[
            {
              title: "Email",
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
              name="change-password"
              onFinish={onFinishStep0}
              autoComplete="off"
              layout="vertical"
              form={form}
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
                <Input />
              </Form.Item>
              <Form.Item>
                <Button type="primary" htmlType="submit">
                  Submit
                </Button>
              </Form.Item>
            </Form>
          </>
        )}

        {current === 1 && (
          <>
            <Form
              name="change-pass-2"
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

              <Form.Item
                label="Mật khẩu mới"
                name="password"
                rules={[
                  {
                    required: true,
                    message: "Please input your new password!",
                  },
                ]}
              >
                <Input.Password />
              </Form.Item>

              <Form.Item
                label="Xác nhận mật khẩu"
                name="confirmPassword"
                rules={[
                  {
                    required: true,
                    message: "Please input your new password!",
                  },
                ]}
              >
                <Input.Password />
              </Form.Item>

              <Form.Item>
                <Button type="primary" htmlType="submit">
                  Confirm
                </Button>
              </Form.Item>
            </Form>
          </>
        )}

        {current === 2 && (
          <div style={{ margin: "20px 0" }}>
            <p>
              Tải khoản của bạn đã được thay đổi mật khẩu thành công. Vui lòng
              đăng nhập lại
            </p>
          </div>
        )}
      </Modal>
    </>
  );
};

export default ModalChangePassword;
