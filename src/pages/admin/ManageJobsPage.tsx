import { useState } from 'react';
import { Table, Modal, Form, Input as AntInput, InputNumber, Popconfirm, message } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { Pencil, Trash2 } from 'lucide-react';
import { jobsService } from '@/services/jobs';
import { useAdminPaging } from '@/hooks/useAdminPaging';
import { getErrorMessage } from '@/utils/errors';
import { formatPrice } from '@/utils/formatters';
import { placeholderImg } from '@/utils/mockData';
import { AdminPageHeader } from '@/components/admin/AdminPageHeader';
import type { Job } from '@/types/models';
import type { JobPayload } from '@/types/api';

const empty: JobPayload = {
  tenCongViec: '',
  danhGia: 0,
  giaTien: 0,
  nguoiTao: 1,
  hinhAnh: '',
  moTa: '',
  maChiTietLoaiCongViec: 1,
  moTaNgan: '',
  saoCongViec: 5,
};

export const ManageJobsPage = () => {
  const paging = useAdminPaging<Job>({ fetcher: jobsService.getPaged });
  const [modal, setModal] = useState<{ mode: 'add' | 'edit'; job?: Job } | null>(null);

  const remove = async (id: number) => {
    try {
      await jobsService.remove(id);
      message.success('Đã xoá công việc');
      paging.reload();
    } catch (err) {
      message.error(getErrorMessage(err));
    }
  };

  const columns: ColumnsType<Job> = [
    { title: 'ID', dataIndex: 'id', width: 64 },
    {
      title: 'Ảnh',
      width: 80,
      render: (_, r) => (
        <img
          src={r.hinhAnh || placeholderImg(r.id, 80, 60)}
          alt=""
          className="h-12 w-16 rounded object-cover"
        />
      ),
    },
    { title: 'Tên công việc', dataIndex: 'tenCongViec', ellipsis: true },
    { title: 'Giá', dataIndex: 'giaTien', width: 100, render: (v: number) => formatPrice(v) },
    { title: 'Sao', dataIndex: 'saoCongViec', width: 70 },
    { title: 'Đánh giá', dataIndex: 'danhGia', width: 90 },
    { title: 'MãCTL', dataIndex: 'maChiTietLoaiCongViec', width: 80 },
    {
      title: 'Thao tác',
      width: 100,
      render: (_, r) => (
        <div className="flex gap-2">
          <button onClick={() => setModal({ mode: 'edit', job: r })} className="text-sky-600">
            <Pencil size={16} />
          </button>
          <Popconfirm title="Xoá công việc này?" onConfirm={() => remove(r.id)} okText="Xoá" cancelText="Huỷ">
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
      <AdminPageHeader
        searchPlaceholder="Tìm theo tên công việc..."
        onSearch={paging.search}
        onAdd={() => setModal({ mode: 'add' })}
        addLabel="Thêm công việc"
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
        scroll={{ x: 900 }}
      />

      {modal && (
        <JobFormModal
          mode={modal.mode}
          job={modal.job}
          onClose={() => setModal(null)}
          onDone={() => {
            setModal(null);
            paging.reload();
          }}
        />
      )}
    </div>
  );
};

const JobFormModal = ({
  mode,
  job,
  onClose,
  onDone,
}: {
  mode: 'add' | 'edit';
  job?: Job;
  onClose: () => void;
  onDone: () => void;
}) => {
  const [form] = Form.useForm();
  const [saving, setSaving] = useState(false);

  const submit = async () => {
    const v = (await form.validateFields()) as JobPayload;
    try {
      setSaving(true);
      if (mode === 'add') await jobsService.create({ ...empty, ...v });
      else await jobsService.update(job!.id, { ...empty, ...job, ...v });
      message.success(mode === 'add' ? 'Đã thêm công việc' : 'Đã cập nhật');
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
      title={mode === 'add' ? 'Thêm công việc' : `Sửa công việc #${job?.id}`}
      onCancel={onClose}
      onOk={submit}
      confirmLoading={saving}
      okText="Lưu"
      cancelText="Huỷ"
      width={620}
    >
      <Form form={form} layout="vertical" initialValues={job ?? empty}>
        <Form.Item name="tenCongViec" label="Tên công việc" rules={[{ required: true }]}>
          <AntInput />
        </Form.Item>
        <div className="grid grid-cols-2 gap-4">
          <Form.Item name="giaTien" label="Giá tiền (USD)" rules={[{ required: true }]}>
            <InputNumber className="w-full" min={0} />
          </Form.Item>
          <Form.Item name="maChiTietLoaiCongViec" label="Mã chi tiết loại" rules={[{ required: true }]}>
            <InputNumber className="w-full" min={1} />
          </Form.Item>
          <Form.Item name="saoCongViec" label="Sao (0-5)">
            <InputNumber className="w-full" min={0} max={5} />
          </Form.Item>
          <Form.Item name="danhGia" label="Số lượt đánh giá">
            <InputNumber className="w-full" min={0} />
          </Form.Item>
          <Form.Item name="nguoiTao" label="Người tạo (ID)">
            <InputNumber className="w-full" min={1} />
          </Form.Item>
        </div>
        <Form.Item name="hinhAnh" label="URL hình ảnh">
          <AntInput placeholder="https://..." />
        </Form.Item>
        <Form.Item name="moTaNgan" label="Mô tả ngắn">
          <AntInput />
        </Form.Item>
        <Form.Item name="moTa" label="Mô tả chi tiết">
          <AntInput.TextArea rows={4} />
        </Form.Item>
      </Form>
    </Modal>
  );
};
