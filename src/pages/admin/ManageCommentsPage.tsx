import { useEffect, useMemo, useState } from 'react';
import { Table, Modal, Form, Input as AntInput, InputNumber, Rate, Popconfirm, message } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { Pencil, Trash2 } from 'lucide-react';
import { commentsService } from '@/services/comments';
import { getErrorMessage } from '@/utils/errors';
import { formatDateTime } from '@/utils/formatters';
import { ADMIN_PAGE_SIZE } from '@/utils/constants';
import { AdminPageHeader } from '@/components/admin/AdminPageHeader';
import type { Comment } from '@/types/models';

export const ManageCommentsPage = () => {
  const [all, setAll] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [keyword, setKeyword] = useState('');
  const [editing, setEditing] = useState<Comment | null>(null);

  const load = () => {
    setLoading(true);
    setError(null);
    commentsService
      .getAll()
      .then(setAll)
      .catch((err) => setError(getErrorMessage(err)))
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  const rows = useMemo(() => {
    const k = keyword.trim().toLowerCase();
    if (!k) return all;
    return all.filter(
      (c) =>
        c.noiDung?.toLowerCase().includes(k) ||
        String(c.maCongViec).includes(k) ||
        String(c.maNguoiBinhLuan).includes(k),
    );
  }, [all, keyword]);

  const remove = async (id: number) => {
    try {
      await commentsService.remove(id);
      message.success('Đã xoá bình luận');
      load();
    } catch (err) {
      message.error(getErrorMessage(err));
    }
  };

  const columns: ColumnsType<Comment> = [
    { title: 'ID', dataIndex: 'id', width: 64 },
    { title: 'Mã CV', dataIndex: 'maCongViec', width: 80 },
    { title: 'Người BL', dataIndex: 'maNguoiBinhLuan', width: 90 },
    { title: 'Nội dung', dataIndex: 'noiDung', ellipsis: true },
    { title: 'Sao', dataIndex: 'saoBinhLuan', width: 70 },
    {
      title: 'Ngày',
      dataIndex: 'ngayBinhLuan',
      width: 150,
      render: (v: string) => formatDateTime(v),
    },
    {
      title: 'Thao tác',
      width: 100,
      render: (_, r) => (
        <div className="flex gap-2">
          <button onClick={() => setEditing(r)} className="text-sky-600">
            <Pencil size={16} />
          </button>
          <Popconfirm title="Xoá bình luận?" onConfirm={() => remove(r.id)} okText="Xoá" cancelText="Huỷ">
            <button className="text-red-500">
              <Trash2 size={16} />
            </button>
          </Popconfirm>
        </div>
      ),
    },
  ];

  return (
    <div>
      <AdminPageHeader searchPlaceholder="Tìm nội dung / mã..." onSearch={setKeyword} />
      {error && <p className="mb-3 text-sm text-red-500">{error}</p>}
      <Table
        rowKey="id"
        columns={columns}
        dataSource={rows}
        loading={loading}
        pagination={{ pageSize: ADMIN_PAGE_SIZE, showSizeChanger: false }}
        scroll={{ x: 820 }}
      />
      {editing && (
        <EditCommentModal
          comment={editing}
          onClose={() => setEditing(null)}
          onDone={() => {
            setEditing(null);
            load();
          }}
        />
      )}
    </div>
  );
};

const EditCommentModal = ({
  comment,
  onClose,
  onDone,
}: {
  comment: Comment;
  onClose: () => void;
  onDone: () => void;
}) => {
  const [form] = Form.useForm();
  const [saving, setSaving] = useState(false);

  const submit = async () => {
    const v = await form.validateFields();
    try {
      setSaving(true);
      await commentsService.update(comment.id, {
        id: comment.id,
        maCongViec: v.maCongViec,
        maNguoiBinhLuan: comment.maNguoiBinhLuan,
        ngayBinhLuan: comment.ngayBinhLuan,
        noiDung: v.noiDung,
        saoBinhLuan: v.saoBinhLuan,
      });
      message.success('Đã cập nhật');
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
      title={`Sửa bình luận #${comment.id}`}
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
          maCongViec: comment.maCongViec,
          noiDung: comment.noiDung,
          saoBinhLuan: comment.saoBinhLuan,
        }}
      >
        <Form.Item name="maCongViec" label="Mã công việc" rules={[{ required: true }]}>
          <InputNumber className="w-full" min={1} />
        </Form.Item>
        <Form.Item name="noiDung" label="Nội dung" rules={[{ required: true }]}>
          <AntInput.TextArea rows={3} />
        </Form.Item>
        <Form.Item name="saoBinhLuan" label="Số sao">
          <Rate />
        </Form.Item>
      </Form>
    </Modal>
  );
};
