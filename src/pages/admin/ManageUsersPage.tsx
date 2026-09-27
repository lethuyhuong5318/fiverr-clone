import { useState } from 'react';
import { Table, Modal, Form, Input as AntInput, Select as AntSelect, Popconfirm, message } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { Pencil, Trash2 } from 'lucide-react';
import { usersService } from '@/services/users';
import { useAdminPaging } from '@/hooks/useAdminPaging';
import { getErrorMessage } from '@/utils/errors';
import { AdminPageHeader } from '@/components/admin/AdminPageHeader';
import { Avatar } from '@/components/Common/Avatar';
import type { UserProfile } from '@/types/models';

export const ManageUsersPage = () => {
  const paging = useAdminPaging<UserProfile>({ fetcher: usersService.getPaged });
  const [editing, setEditing] = useState<UserProfile | null>(null);
  const [creating, setCreating] = useState(false);

  const remove = async (id: number) => {
    try {
      await usersService.remove(id);
      message.success('Đã xoá người dùng');
      paging.reload();
    } catch (err) {
      message.error(getErrorMessage(err));
    }
  };

  const columns: ColumnsType<UserProfile> = [
    { title: 'ID', dataIndex: 'id', width: 70 },
    {
      title: 'Người dùng',
      render: (_, r) => (
        <div className="flex items-center gap-2">
          <Avatar src={r.avatar} name={r.name} size={32} />
          <div>
            <p className="font-medium text-ink">{r.name}</p>
            <p className="text-xs text-ink-faint">{r.email}</p>
          </div>
        </div>
      ),
    },
    { title: 'Điện thoại', dataIndex: 'phone', width: 130 },
    {
      title: 'Vai trò',
      dataIndex: 'role',
      width: 110,
      render: (role: string) => (
        <span
          className={`rounded px-2 py-0.5 text-xs font-semibold ${
            role?.toLowerCase() === 'admin'
              ? 'bg-primary-50 text-primary-700'
              : 'bg-gray-100 text-ink-soft'
          }`}
        >
          {role}
        </span>
      ),
    },
    {
      title: 'Thao tác',
      width: 120,
      render: (_, r) => (
        <div className="flex gap-2">
          <button onClick={() => setEditing(r)} className="text-sky-600" aria-label="Sửa">
            <Pencil size={16} />
          </button>
          <Popconfirm title="Xoá người dùng này?" onConfirm={() => remove(r.id)} okText="Xoá" cancelText="Huỷ">
            <button className="text-red-500" aria-label="Xoá">
              <Trash2 size={16} />
            </button>
          </Popconfirm>
        </div>
      ),
    },
  ];

  return (
    <div>
      <AdminPageHeader
        searchPlaceholder="Nhập tài khoản hoặc họ tên..."
        onSearch={paging.search}
        onAdd={() => setCreating(true)}
        addLabel="Thêm quản trị viên"
      />

      {paging.error && <p className="mb-3 text-sm text-red-500">{paging.error}</p>}

      <Table
        rowKey="id"
        columns={columns}
        dataSource={paging.rows}
        loading={paging.loading}
        pagination={{
          current: paging.page,
          pageSize: paging.pageSize,
          total: paging.total,
          onChange: paging.changePage,
          showSizeChanger: false,
        }}
        scroll={{ x: 720 }}
      />

      {editing && (
        <UserFormModal
          user={editing}
          onClose={() => setEditing(null)}
          onDone={() => {
            setEditing(null);
            paging.reload();
          }}
        />
      )}
      {creating && (
        <AddAdminModal
          onClose={() => setCreating(false)}
          onDone={() => {
            setCreating(false);
            paging.reload();
          }}
        />
      )}
    </div>
  );
};

const genderOptions = [
  { value: true, label: 'Nam' },
  { value: false, label: 'Nữ' },
];
const roleOptions = [
  { value: 'USER', label: 'USER' },
  { value: 'ADMIN', label: 'ADMIN' },
];

const UserFormModal = ({
  user,
  onClose,
  onDone,
}: {
  user: UserProfile;
  onClose: () => void;
  onDone: () => void;
}) => {
  const [form] = Form.useForm();
  const [saving, setSaving] = useState(false);

  const submit = async () => {
    const values = await form.validateFields();
    try {
      setSaving(true);
      await usersService.update(user.id, {
        id: user.id,
        name: values.name,
        email: values.email,
        phone: values.phone,
        birthday: user.birthday ?? '',
        gender: values.gender,
        role: values.role,
        skill: user.skill ?? [],
        certification: user.certification ?? [],
      });
      message.success('Cập nhật thành công');
      onDone();
    } catch (err) {
      message.error(getErrorMessage(err));
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal
      open
      title={`Sửa người dùng #${user.id}`}
      onCancel={onClose}
      onOk={submit}
      confirmLoading={saving}
      okText="Lưu"
      cancelText="Huỷ"
    >
      <Form
        form={form}
        layout="vertical"
        initialValues={{
          name: user.name,
          email: user.email,
          phone: user.phone,
          gender: user.gender,
          role: user.role,
        }}
      >
        <Form.Item name="name" label="Họ tên" rules={[{ required: true }]}>
          <AntInput />
        </Form.Item>
        <Form.Item name="email" label="Email" rules={[{ required: true, type: 'email' }]}>
          <AntInput />
        </Form.Item>
        <Form.Item name="phone" label="Số điện thoại">
          <AntInput />
        </Form.Item>
        <Form.Item name="gender" label="Giới tính">
          <AntSelect options={genderOptions} />
        </Form.Item>
        <Form.Item name="role" label="Vai trò">
          <AntSelect options={roleOptions} />
        </Form.Item>
      </Form>
    </Modal>
  );
};

const AddAdminModal = ({ onClose, onDone }: { onClose: () => void; onDone: () => void }) => {
  const [form] = Form.useForm();
  const [saving, setSaving] = useState(false);

  const submit = async () => {
    const v = await form.validateFields();
    try {
      setSaving(true);
      await usersService.create({
        name: v.name,
        email: v.email,
        password: v.password,
        phone: v.phone,
        birthday: '',
        gender: true,
        role: 'ADMIN',
        skill: [],
        certification: [],
      });
      message.success('Đã thêm quản trị viên');
      onDone();
    } catch (err) {
      message.error(getErrorMessage(err));
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal
      open
      title="Thêm quản trị viên"
      onCancel={onClose}
      onOk={submit}
      confirmLoading={saving}
      okText="Thêm"
      cancelText="Huỷ"
    >
      <Form form={form} layout="vertical">
        <Form.Item name="name" label="Tên" rules={[{ required: true }]}>
          <AntInput />
        </Form.Item>
        <Form.Item name="email" label="Email" rules={[{ required: true, type: 'email' }]}>
          <AntInput />
        </Form.Item>
        <Form.Item name="password" label="Mật khẩu" rules={[{ required: true, min: 6 }]}>
          <AntInput.Password />
        </Form.Item>
        <Form.Item name="phone" label="Số điện thoại" rules={[{ required: true }]}>
          <AntInput />
        </Form.Item>
      </Form>
    </Modal>
  );
};
