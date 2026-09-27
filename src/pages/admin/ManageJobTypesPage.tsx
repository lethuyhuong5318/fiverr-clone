import { useState } from 'react';
import { Table, Modal, Form, Input as AntInput, Popconfirm, message } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { Pencil, Trash2 } from 'lucide-react';
import { jobTypeService } from '@/services/categories';
import { useAdminPaging } from '@/hooks/useAdminPaging';
import { getErrorMessage } from '@/utils/errors';
import { AdminPageHeader } from '@/components/admin/AdminPageHeader';
import type { JobType } from '@/types/models';

export const ManageJobTypesPage = () => {
  const paging = useAdminPaging<JobType>({ fetcher: jobTypeService.getPaged });
  const [modal, setModal] = useState<{ mode: 'add' | 'edit'; row?: JobType } | null>(null);

  const remove = async (id: number) => {
    try {
      await jobTypeService.remove(id);
      message.success('Đã xoá');
      paging.reload();
    } catch (err) {
      message.error(getErrorMessage(err));
    }
  };

  const columns: ColumnsType<JobType> = [
    { title: 'ID', dataIndex: 'id', width: 80 },
    { title: 'Tên loại công việc', dataIndex: 'tenLoaiCongViec' },
    {
      title: 'Thao tác',
      width: 110,
      render: (_, r) => (
        <div className="flex gap-2">
          <button onClick={() => setModal({ mode: 'edit', row: r })} className="text-sky-600">
            <Pencil size={16} />
          </button>
          <Popconfirm title="Xoá loại này?" onConfirm={() => remove(r.id)} okText="Xoá" cancelText="Huỷ">
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
        searchPlaceholder="Tìm loại công việc..."
        onSearch={paging.search}
        onAdd={() => setModal({ mode: 'add' })}
        addLabel="Thêm loại công việc"
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
      />
      {modal && (
        <TypeModal
          mode={modal.mode}
          row={modal.row}
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

const TypeModal = ({
  mode,
  row,
  onClose,
  onDone,
}: {
  mode: 'add' | 'edit';
  row?: JobType;
  onClose: () => void;
  onDone: () => void;
}) => {
  const [form] = Form.useForm();
  const [saving, setSaving] = useState(false);

  const submit = async () => {
    const v = await form.validateFields();
    try {
      setSaving(true);
      if (mode === 'add') await jobTypeService.create({ tenLoaiCongViec: v.tenLoaiCongViec });
      else await jobTypeService.update(row!.id, { id: row!.id, tenLoaiCongViec: v.tenLoaiCongViec });
      message.success('Thành công');
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
      title={mode === 'add' ? 'Thêm loại công việc' : `Sửa loại #${row?.id}`}
      onCancel={onClose}
      onOk={submit}
      confirmLoading={saving}
      okText="Lưu"
      cancelText="Huỷ"
    >
      <Form form={form} layout="vertical" initialValues={row}>
        <Form.Item name="tenLoaiCongViec" label="Tên loại công việc" rules={[{ required: true }]}>
          <AntInput />
        </Form.Item>
      </Form>
    </Modal>
  );
};
